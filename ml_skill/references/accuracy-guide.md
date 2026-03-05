# 效果调优指南

深度学习模型效果优化：超参数调优、问题诊断、策略选择。

## 目录

1. [训练问题诊断](#训练问题诊断)
2. [学习率调优](#学习率调优)
3. [正则化策略](#正则化策略)
4. [数据策略](#数据策略)
5. [模型架构调整](#模型架构调整)
6. [集成方法](#集成方法)
7. [调试检查清单](#调试检查清单)

---

## 训练问题诊断

### 问题1: Loss不下降

**可能原因与解决方案**:

| 原因 | 诊断方法 | 解决方案 |
|------|----------|----------|
| 学习率过大 | loss震荡或NaN | 降低学习率10倍 |
| 学习率过小 | loss下降极慢 | 提高学习率10倍 |
| 数据未归一化 | 检查输入分布 | 添加Normalization |
| 梯度消失 | 检查梯度范数 | 使用LN/BN、残差连接 |
| 权重初始化不当 | 第一轮就出问题 | 使用Pretrained或正确初始化 |

```python
# 诊断代码
for name, param in model.named_parameters():
    print(f"{name}: grad_norm={param.grad.norm():.4f}")
```

### 问题2: 过拟合

**症状**: Train loss下降，Val loss上升

**解决方案**:

```python
# 1. 数据增强
transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.4, 0.4, 0.4),
])

# 2. 正则化
optimizer = AdamW(params, weight_decay=0.05)

# 3. Dropout
nn.Dropout(p=0.5)

# 4. Early Stopping
if val_loss < best_loss:
    best_loss = val_loss
    patience_counter = 0
else:
    patience_counter += 1
    if patience_counter >= patience:
        break

# 5. 标签平滑
criterion = CrossEntropyLoss(label_smoothing=0.1)
```

### 问题3: 欠拟合

**症状**: Train loss和Val loss都很高

**解决方案**:

1. **增加模型容量**
   ```python
   # 增加层数或通道数
   model = ResNet50()  # 从ResNet18升级
   ```

2. **减少正则化**
   ```python
   weight_decay = 0.0  # 移除weight decay
   dropout = 0.0       # 移除dropout
   ```

3. **延长训练时间**
   ```python
   num_epochs = 200  # 增加epoch
   ```

4. **优化学习率**
   ```python
   # 使用更大的学习率或One-Cycle
   scheduler = OneCycleLR(optimizer, max_lr=0.1, ...)
   ```

### 问题4: 训练不稳定

**症状**: Loss剧烈波动或突然变为NaN

**解决方案**:

```python
# 1. 梯度裁剪
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# 2. 降低学习率
lr = 1e-4  # 从1e-3降低

# 3. 使用更稳定的优化器
optimizer = AdamW(params, eps=1e-7)  # 增大eps

# 4. Warmup
def get_lr(step, warmup_steps, base_lr):
    return base_lr * min(1.0, step / warmup_steps)

# 5. 检查数据
for data in dataloader:
    assert not torch.isnan(data).any()
    assert not torch.isinf(data).any()
```

---

## 学习率调优

### 学习率范围测试

```python
# 自动找最优学习率
import torch.lr_finder as lrf

lr_finder = lrf.LRFinder(model, optimizer, criterion)
lr_finder.range_test(dataloader, end_lr=10, num_iter=100)
lr_finder.plot()  # 找到loss开始下降但未爆炸的点
```

### 推荐学习率

| 模型类型 | 优化器 | 初始学习率 | Batch Size |
|----------|--------|------------|------------|
| ResNet | SGD | 0.1 | 256 |
| ResNet | AdamW | 1e-3 | 256 |
| Transformer | AdamW | 1e-4 | 64 |
| ViT | AdamW | 1e-3 | 4096 |
| 检测 (RetinaNet) | SGD | 0.01 | 16 |
| 分割 | AdamW | 1e-4 | 16 |

### Linear Scaling Rule

```python
# 大batch时按比例增加学习率
# lr = base_lr * (batch_size / base_batch_size)
base_lr = 0.1
base_batch_size = 256
lr = base_lr * (batch_size / base_batch_size)
```

### 超参数搜索

```python
# 使用Optuna
import optuna

def objective(trial):
    lr = trial.suggest_loguniform('lr', 1e-5, 1e-1)
    weight_decay = trial.suggest_loguniform('wd', 1e-6, 1e-2)

    model = create_model()
    optimizer = AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)

    val_loss = train_and_evaluate(model, optimizer)
    return val_loss

study = optuna.create_study(direction='minimize')
study.optimize(objective, n_trials=100)
```

---

## 正则化策略

### Weight Decay选择

| 模型类型 | Weight Decay |
|----------|--------------|
| CNN分类 | 0.0001 - 0.01 |
| Transformer | 0.01 - 0.1 |
| 检测 | 0.0001 |
| ViT | 0.05 - 0.3 |

### Dropout选择

```python
# 全连接层
dropout = 0.5  # 标准

# 卷积层
dropout = 0.1 - 0.2  # 较小

# Transformer
dropout = 0.1  # 标准
```

### 数据增强强度

```python
# 弱增强 (简单任务)
RandAugment(n=1, m=9)

# 中等增强 (标准)
RandAugment(n=2, m=9)

# 强增强 (困难任务/过拟合严重)
RandAugment(n=3, m=15)
```

---

## 数据策略

### 类别不平衡

```python
# 1. 类别权重
class_weights = 1.0 / class_counts
class_weights = class_weights / class_weights.sum()
criterion = CrossEntropyLoss(weight=class_weights)

# 2. 过采样
from imblearn.over_sampling import RandomOverSampler

# 3. 欠采样
from imblearn.under_sampling import RandomUnderSampler

# 4. Focal Loss
class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0):
        self.alpha = alpha
        self.gamma = gamma

    def forward(self, pred, target):
        ce = F.cross_entropy(pred, target, reduction='none')
        pt = torch.exp(-ce)
        return self.alpha * (1 - pt) ** self.gamma * ce
```

### 数据质量检查

```python
# 1. 检查标签噪声
for i, (data, label) in enumerate(dataset):
    pred = model(data)
    if pred.argmax() != label:
        # 可能的标签错误
        print(f"Sample {i}: label={label}, pred={pred.argmax()}")

# 2. 检查数据分布
print(f"Mean: {data.mean()}, Std: {data.std()}")

# 3. 可视化
import matplotlib.pyplot as plt
plt.hist(data.flatten(), bins=100)
```

### 数据量策略

| 数据量 | 策略 |
|--------|------|
| < 1k | 强数据增强 + 预训练 + 正则化 |
| 1k - 10k | 中等增强 + 预训练 |
| 10k - 100k | 标准训练流程 |
| > 100k | 可以从头训练 |

---

## 模型架构调整

### 容量调整

```python
# 增加宽度
model = ResNet(width_multiplier=2.0)  # Wide ResNet

# 增加深度
model = ResNet101()  # 从ResNet50升级

# 增加分辨率
input_size = 384  # 从224增加
```

### 注意力机制

```python
# 添加注意力模块
class AttentionBlock(nn.Module):
    def __init__(self, channels):
        self.query = nn.Conv2d(channels, channels//8, 1)
        self.key = nn.Conv2d(channels, channels//8, 1)
        self.value = nn.Conv2d(channels, channels, 1)

# SE-Block
class SEBlock(nn.Module):
    def __init__(self, channels, reduction=16):
        self.fc = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(channels, channels // reduction),
            nn.ReLU(),
            nn.Linear(channels // reduction, channels),
            nn.Sigmoid()
        )
```

### 残差连接

```python
# 确保残差连接
class ResBlock(nn.Module):
    def forward(self, x):
        return x + self.conv(x)  # 残差连接
```

---

## 集成方法

### 模型集成

```python
# 1. 多模型投票
predictions = []
for model in models:
    pred = model(x)
    predictions.append(pred)
final_pred = torch.stack(predictions).mean(dim=0)

# 2. TTA (Test Time Augmentation)
predictions = []
for transform in tta_transforms:
    x_aug = transform(x)
    pred = model(x_aug)
    predictions.append(pred)
final_pred = torch.stack(predictions).mean(dim=0)

# 3. 多尺度
scales = [0.5, 1.0, 1.5]
predictions = []
for scale in scales:
    x_scaled = F.interpolate(x, scale_factor=scale)
    pred = model(x_scaled)
    predictions.append(pred)
```

### 典型提升

| 方法 | 提升幅度 |
|------|----------|
| 5模型集成 | 1-3% |
| TTA (5增强) | 0.5-2% |
| 多尺度 | 0.5-1% |

---

## 调试检查清单

### 训练前

- [ ] 数据归一化 (mean=0, std=1)
- [ ] 标签正确
- [ ] 模型初始化合理
- [ ] 学习率在合理范围

### 训练中

```python
# 监控指标
print(f"Epoch {epoch}:")
print(f"  Train Loss: {train_loss:.4f}")
print(f"  Val Loss: {val_loss:.4f}")
print(f"  Train Acc: {train_acc:.2%}")
print(f"  Val Acc: {val_acc:.2%}")
print(f"  LR: {current_lr:.6f}")
print(f"  Grad Norm: {grad_norm:.4f}")
```

### 过拟合检测

```python
if train_acc - val_acc > 0.1:
    print("警告: 可能过拟合")
    # 增加正则化
```

### 欠拟合检测

```python
if train_acc < 0.8 and epoch > 50:
    print("警告: 可能欠拟合")
    # 增加模型容量或减少正则化
```

---

## 效果调优流程

1. **建立基线** - 使用标准配置训练
2. **诊断问题** - 过拟合/欠拟合/不稳定
3. **针对性优化**:
   - 过拟合 → 正则化 + 数据增强
   - 欠拟合 → 增加容量 + 减少正则化
   - 不稳定 → 梯度裁剪 + warmup
4. **超参数搜索** - Optuna/WandB
5. **集成提升** - 最后1-2%提升

---

## 关键论文参考

1. **Focal Loss** - Lin et al., ICCV 2017
2. **Label Smoothing** - Szegedy et al., CVPR 2016
3. **MixUp** - Zhang et al., ICLR 2018
4. **CutMix** - Yun et al., ICCV 2019
5. **RandAugment** - Cubuk et al., CVPR 2020
6. **SGDR** - Loshchilov & Hutter, ICLR 2017
7. **Super-Convergence** - Smith & Topin, 2018
