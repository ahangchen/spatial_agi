# 故障排查指南

本文档提供 ML 训练过程中常见问题的诊断和解决方案。

## 目录

1. [显存问题](#显存问题)
2. [训练速度问题](#训练速度问题)
3. [精度问题](#精度问题)
4. [数据问题](#数据问题)
5. [其他问题](#其他问题)

---

## 显存问题

### 问题1: CUDA out of memory

**错误信息**：
```
RuntimeError: CUDA out of memory. Tried to allocate 256.00 MiB
```

**诊断步骤**：
1. 检查当前显存使用：`nvidia-smi`
2. 检查batch size是否过大
3. 检查模型大小

**解决方案**：

**方案1: 启用混合精度训练**（推荐）
```bash
python run.py --use_amp
```

效果：显存减少50%，速度提升1.5-2x

**方案2: 减小batch size**
```bash
python run.py --batch_size 16
```

**方案3: 使用梯度累积**
```bash
python run.py --batch_size 8 --gradient_accumulation_steps 4
```

效果：显存减少75%，模拟batch_size=32

**方案4: 使用梯度检查点**
```python
# 在模型中使用
from torch.utils.checkpoint import checkpoint
```

效果：显存减少70%，但速度降低20-30%

**委派给**: `performance-tuner`

---

### 问题2: 显存泄漏

**症状**：
- 训练时间越长，显存占用越大
- 最终导致OOM

**诊断步骤**：
1. 监控显存使用趋势
2. 检查是否有未释放的tensor

**解决方案**：
```python
# 及时释放不需要的变量
del features
torch.cuda.empty_cache()

# 使用 gc.collect()
import gc
gc.collect()
```

**常见原因**：
- 在循环中累积tensor列表
- 未关闭的日志记录
- 缓存过多数据

---

## 训练速度问题

### 问题1: 训练速度慢

**症状**：
- 每个iter时间 > 1秒
- GPU利用率 < 80%

**诊断步骤**：
1. 测量GPU利用率：`nvidia-smi dmon`
2. Profile训练循环：
```python
import time
t0 = time.time()
# 数据加载
t1 = time.time()
# 前向传播
t2 = time.time()
# 反向传播
t3 = time.time()

print(f"数据: {t1-t0:.3f}s, 前向: {t2-t1:.3f}s, 反向: {t3-t2:.3f}s")
```

**解决方案**：

**如果数据加载慢**（数据时间 > 0.5s）：
```bash
# 增加workers
python run.py --num_workers 8

# 启用pin_memory
# 在 DataLoader 中设置 pin_memory=True
```

**如果计算慢**（前向+反向 > 0.5s）：
```bash
# 使用混合精度
python run.py --use_amp

# 增大batch size（如果显存允许）
python run.py --batch_size 64
```

**委派给**: `performance-tuner`

---

### 问题2: GPU利用率波动

**症状**：
- GPU利用率在0-100%之间波动
- 训练不稳定

**诊断**：
- 数据加载是瓶颈
- CPU处理跟不上GPU

**解决方案**：
```bash
# 增加数据加载workers
python run.py --num_workers 8

# 使用prefetch
# 在 DataLoader 中设置 prefetch_factor=2

# 使用持久化workers
# 在 DataLoader 中设置 persistent_workers=True
```

---

## 精度问题

### 问题1: Loss不下降

**症状**：
- 训练多个epoch后loss基本不变
- 精度不提升

**诊断步骤**：
1. 检查学习率是否过小
2. 检查数据是否正确加载
3. 检查模型是否正确初始化

**解决方案**：

**如果loss很大且不变**：
- 学习率过小 → 增大lr
```bash
python run.py --lr 0.01
```

**如果loss很小且不变**：
- 可能已收敛 → 检查验证集性能

**如果loss震荡**：
- 学习率过大 → 减小lr
```bash
python run.py --lr 0.0001
```

**委派给**: `accuracy-tuner`

---

### 问题2: 过拟合

**症状**：
- 训练精度 >> 验证精度（差距 > 5%）
- 训练loss持续下降，验证loss上升

**诊断**：
```
train_acc: 0.95, val_acc: 0.78 → 过拟合
```

**解决方案**（按优先级）：

**1. 数据增强**
```python
transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.4, 0.4, 0.4, 0.1),
])
```

**2. 正则化**
```bash
python run.py --weight_decay 0.01 --dropout 0.5
```

**3. Label Smoothing**
```python
loss = F.cross_entropy(pred, gt, label_smoothing=0.1)
```

**4. 早停**
- 当验证loss连续N个epoch不下降时停止

**委派给**: `accuracy-tuner`

---

### 问题3: 欠拟合

**症状**：
- 训练和验证精度都低
- 训练loss不下降

**诊断**：
```
train_acc: 0.65, val_acc: 0.63 → 欠拟合
```

**解决方案**：

**1. 增大模型容量**
```bash
python run.py --model resnet101
```

**2. 减少正则化**
```bash
python run.py --weight_decay 0.0001 --dropout 0.0
```

**3. 增加训练时间**
```bash
python run.py --epochs 200
```

**4. 检查数据质量**
- 确保数据标签正确
- 确保数据增强不过度

**委派给**: `accuracy-tuner`

---

### 问题4: Loss震荡

**症状**：
- Loss上下波动，不稳定
- 精度忽高忽低

**诊断**：
- 学习率过大
- Batch size过小

**解决方案**：

**1. 降低学习率**
```bash
python run.py --lr 0.0001
```

**2. 增大batch size**
```bash
python run.py --batch_size 64
```

**3. 使用学习率warmup**
```bash
python run.py --warmup_epochs 10
```

**委派给**: `accuracy-tuner`

---

## 数据问题

### 问题1: 数据加载错误

**错误信息**：
```
FileNotFoundError: [Errno 2] No such file or directory
```

**诊断步骤**：
1. 检查数据路径是否正确
2. 检查文件是否存在
3. 检查权限

**解决方案**：
```bash
# 检查路径
ls -la /path/to/data

# 检查权限
chmod -R 755 /path/to/data
```

---

### 问题2: 数据不平衡

**症状**：
- 某些类别样本数远多于其他类别
- 模型偏向多数类

**诊断**：
```python
from collections import Counter
class_counts = Counter(labels)
print(class_counts)
```

**解决方案**：

**1. 类别平衡采样**
```python
from torch.utils.data import WeightedRandomSampler
sampler = WeightedRandomSampler(weights, num_samples)
```

**2. Focal Loss**
```python
class FocalLoss(nn.Module):
    def forward(self, pred, gt):
        ce_loss = F.cross_entropy(pred, gt, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = alpha * (1 - pt) ** gamma * ce_loss
        return focal_loss.mean()
```

**委派给**: `algorithm-designer`

---

### 问题3: 数据增强过度

**症状**：
- 训练精度低
- 图像失真严重

**诊断**：
- 检查数据增强后的图像

**解决方案**：
```python
# 减弱数据增强
transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),  # 不要太激进
    transforms.RandomHorizontalFlip(p=0.5),
    # ColorJitter不要太大
])
```

---

## 其他问题

### 问题1: 梯度爆炸/消失

**症状**：
- Loss变为NaN或Inf
- 梯度全为0或非常大

**诊断**：
```python
# 检查梯度
for name, param in model.named_parameters():
    if param.grad is not None:
        print(name, param.grad.norm())
```

**解决方案**：

**梯度裁剪**：
```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

**检查初始化**：
```python
# 使用合适的初始化
def init_weights(m):
    if isinstance(m, nn.Linear):
        torch.nn.init.xavier_uniform_(m.weight)
        m.bias.data.fill_(0.01)
```

---

### 问题2: BatchNorm问题

**症状**：
- 小batch size时性能差
- 训练和推理结果差异大

**解决方案**：

**1. 使用GroupNorm替代**
```python
self.norm = nn.GroupNorm(num_groups, num_channels)
```

**2. 使用SyncBatchNorm（多GPU）**
```python
model = nn.SyncBatchNorm.convert_sync_batchnorm(model)
```

**3. 增大batch size**
```bash
python run.py --batch_size 32
```

---

### 问题3: 检查点加载失败

**错误信息**：
```
KeyError: "missing keys in state_dict"
```

**诊断**：
- 模型结构改变
- 键名不匹配

**解决方案**：

**1. 严格模式关闭**
```python
model.load_state_dict(checkpoint, strict=False)
```

**2. 手动匹配键名**
```python
state_dict = checkpoint['model_state_dict']
new_state_dict = {}
for k, v in state_dict.items():
    new_state_dict[k.replace('module.', '')] = v
model.load_state_dict(new_state_dict)
```

---

## 故障排查流程图

```
遇到问题
    │
    ├─ 显存问题 → performance-tuner
    │   ├─ OOM → 混合精度/梯度累积
    │   └─ 泄漏 → 检查变量释放
    │
    ├─ 速度问题 → performance-tuner
    │   ├─ 数据慢 → 增加workers
    │   └─ 计算慢 → 混合精度
    │
    ├─ 精度问题 → accuracy-tuner
    │   ├─ 不下降 → 调整lr
    │   ├─ 过拟合 → 数据增强/正则化
    │   ├─ 欠拟合 → 增大模型
    │   └─ 震荡 → 降低lr
    │
    └─ 数据问题 → algorithm-designer
        ├─ 不平衡 → 重采样/Focal Loss
        └─ 质量差 → 数据清洗
```

---

## 快速参考表

| 问题 | 症状 | 委派给 | 解决方案 |
|------|------|--------|----------|
| OOM | 显存不足 | performance-tuner | 混合精度、梯度累积 |
| 训练慢 | iter > 1s | performance-tuner | 数据加载优化 |
| Loss不下降 | 精度不提升 | accuracy-tuner | 调整学习率 |
| 过拟合 | train >> val | accuracy-tuner | 数据增强、正则化 |
| 欠拟合 | 都低 | accuracy-tuner | 增大模型 |
| Loss震荡 | 波动大 | accuracy-tuner | 降低lr |
| 类别不平衡 | 偏向多数类 | algorithm-designer | 重采样、Focal Loss |
| 梯度爆炸 | NaN/Inf | - | 梯度裁剪 |

---

## 总结

遇到问题时，按照以下步骤排查：

1. **识别问题类型**（显存/速度/精度/数据）
2. **诊断具体原因**（使用监控工具）
3. **委派给合适的agent**
4. **应用解决方案**
5. **验证效果**

大多数训练问题都可以通过 `performance-tuner` 和 `accuracy-tuner` 解决。如果标准方法无效，可以考虑使用 `nas-specialist` 搜索更优的架构。
