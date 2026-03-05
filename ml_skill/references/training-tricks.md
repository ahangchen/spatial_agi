# 训练技巧汇总

CNN/Transformer训练最佳实践，整理自学术论文和工程经验。

## 目录

1. [数据增强](#数据增强)
2. [归一化技术](#归一化技术)
3. [学习率调度](#学习率调度)
4. [正则化方法](#正则化方法)
5. [优化器选择](#优化器选择)
6. [损失函数设计](#损失函数设计)
7. [Transformer特有技巧](#transformer特有技巧)

---

## 数据增强

### 图像分类

| 方法 | 说明 | 论文 |
|------|------|------|
| **AutoAugment** | 自动搜索增强策略 | CVPR 2019 |
| **RandAugment** | 简化的随机增强 | CVPR 2020 |
| **MixUp** | 图像混合增强 | ICLR 2018 |
| **CutMix** | 裁剪混合增强 | ICCV 2019 |
| **CutOut** | 随机遮挡 | 2017 |
| **RandomErasing** | 随机擦除 | AAAI 2020 |

**推荐组合**:
```python
# 通用组合
transforms = [
    RandomResizedCrop(224),
    RandomHorizontalFlip(),
    RandAugment(n=2, m=9),
    CutMix(alpha=1.0),
    MixUp(alpha=0.2),
]
```

### 3D点云

| 方法 | 说明 |
|------|------|
| **随机旋转** | 绕Y轴±5°~±180° |
| **随机缩放** | 0.95~1.05倍 |
| **随机抖动** | 高斯噪声 |
| **随机丢弃** | 点云随机采样 |
| **体素化增强** | 体素尺寸抖动 |

---

## 归一化技术

### Batch Normalization (BN)

```python
# 标准BN
nn.BatchNorm2d(num_features)

# 小batch size时使用
# SyncBN for multi-GPU
nn.SyncBatchNorm.convert_sync_batchnorm(model)
```

**问题**: batch_size < 16时效果下降

### Layer Normalization (LN)

```python
# Transformer标准使用
nn.LayerNorm(normalized_shape)
```

**适用**: NLP、Transformer、小batch场景

### Group Normalization (GN)

```python
# 分组归一化，不依赖batch size
nn.GroupNorm(num_groups=32, num_channels=channels)
```

**适用**: 检测、分割、小batch场景

### Instance Normalization (IN)

```python
# 风格迁移常用
nn.InstanceNorm2d(num_features)
```

### 选择指南

| 场景 | 推荐归一化 |
|------|------------|
| 分类 (batch>=32) | BN |
| 检测/分割 | GN 或 SyncBN |
| Transformer | LN |
| 风格迁移 | IN |
| 3D点云 | BN 或 LN |

---

## 学习率调度

### 1. Warmup

```python
# 线性warmup
def warmup_lr(step, warmup_steps, base_lr):
    return base_lr * min(1.0, step / warmup_steps)

# 推荐warmup steps
# 小模型: 500-1000 steps
# 大模型: 10000+ steps (BERT: 10k, GPT: 2000)
```

### 2. Cosine Annealing

```python
from torch.optim.lr_scheduler import CosineAnnealingLR

scheduler = CosineAnnealingLR(
    optimizer,
    T_max=num_epochs,
    eta_min=1e-6
)
```

**论文**: "SGDR: Stochastic Gradient Descent with Warm Restarts" (ICLR 2017)

### 3. One-Cycle Policy

```python
from torch.optim.lr_scheduler import OneCycleLR

scheduler = OneCycleLR(
    optimizer,
    max_lr=0.1,
    total_steps=num_steps,
    pct_start=0.3,  # 30% warmup
    anneal_strategy='cos'
)
```

**论文**: "Super-Convergence" (2018)

**推荐**: 快速训练，通常能获得更好结果

### 4. Step Decay

```python
# 经典阶梯式衰减
scheduler = MultiStepLR(
    optimizer,
    milestones=[60, 120, 160],
    gamma=0.2
)
```

### 学习率选择

| 模型规模 | 初始学习率 | 调度器 |
|----------|------------|--------|
| 小模型 (<10M) | 0.01-0.1 | Step/One-Cycle |
| 中型模型 (10-100M) | 0.001-0.01 | Cosine |
| 大模型 (>100M) | 1e-5-1e-4 | Cosine+Warmup |

---

## 正则化方法

### Weight Decay

```python
# 标准L2正则
optimizer = AdamW(params, lr=1e-3, weight_decay=0.01)

# 不同层使用不同weight decay
# - BN层: 0
# - bias: 0
# - 其他: 0.01-0.05
```

### Dropout

```python
# 标准dropout
nn.Dropout(p=0.5)

# Dropout2d for conv
nn.Dropout2d(p=0.1)

# DropPath (Stochastic Depth)
# 用于Transformer和深层网络
from timm.models.layers import DropPath
```

### Label Smoothing

```python
# CrossEntropy with label smoothing
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
```

**论文**: "Rethinking the Inception Architecture" (CVPR 2016)

### Stochastic Depth

```python
# 随机跳过层
# 适用于深层ResNet、Transformer
drop_path_rate = 0.1  # 浅层小，深层大
```

---

## 优化器选择

### AdamW (推荐)

```python
optimizer = AdamW(
    params,
    lr=1e-3,
    betas=(0.9, 0.999),
    eps=1e-8,
    weight_decay=0.01
)
```

**适用**: Transformer、大多数场景

### SGD with Momentum

```python
optimizer = SGD(
    params,
    lr=0.1,
    momentum=0.9,
    weight_decay=5e-4,
    nesterov=True
)
```

**适用**: CNN分类、检测，追求最高精度

### LAMB/LARS (大batch训练)

```python
# LAMB for BERT large batch
# LARS for ResNet large batch
from apex.optimizers import FusedLAMB
```

### 选择指南

| 场景 | 优化器 | 说明 |
|------|--------|------|
| CNN分类 | SGD+Momentum | 最高精度 |
| Transformer | AdamW | 默认选择 |
| 快速实验 | AdamW | 稳定收敛 |
| 大batch | LAMB/LARS | 线性扩展 |

---

## 损失函数设计

### 分类

```python
# 标准交叉熵
CrossEntropyLoss()

# 类别不平衡
CrossEntropyLoss(weight=class_weights)

# Focal Loss (难样本)
FocalLoss(alpha=0.25, gamma=2.0)
```

### 分割

```python
# Dice Loss
DiceLoss()

# 组合
loss = CE + Dice
loss = Focal + Dice
```

### 检测

```python
# Focal Loss (RetinaNet)
FocalLoss(alpha=0.25, gamma=2.0)

# GIoU/DIoU/CIoU
# 推荐CIoU
CIoULoss()
```

---

## Transformer特有技巧

### 1. Pre-LN vs Post-LN

```python
# Post-LN (原始Transformer)
x = x + dropout(sublayer(ln(x)))

# Pre-LN (推荐，更稳定)
x = x + dropout(sublayer(ln(x)))
ln放在sublayer之前
```

### 2. Gradient Checkpointing

```python
# 减少显存，增加计算
from torch.utils.checkpoint import checkpoint

# 大模型必须
model.gradient_checkpointing_enable()
```

### 3. Flash Attention

```python
# 加速注意力计算，减少显存
# PyTorch 2.0+
torch.nn.functional.scaled_dot_product_attention(
    q, k, v,
    attn_mask=None,
    dropout_p=0.0,
    is_causal=False
)
```

### 4. DeepSpeed/FSDP

```python
# 大模型分布式训练
# ZeRO优化器状态分片
```

### 5. 激活函数

```python
# 标准选择
nn.GELU()  # Transformer默认

# 新选择
nn.SiLU()  # Swish，LLaMA使用
```

### 6. 位置编码

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| Sinusoidal | 原始Transformer | 通用 |
| Learnable | 可学习位置 | ViT |
| RoPE | 旋转位置编码 | LLaMA |
| ALiBi | 线性偏置 | 长序列 |

---

## 关键论文参考

1. **Batch Normalization** - Ioffe & Szegedy, ICML 2015
2. **Layer Normalization** - Ba et al., 2016
3. **Adam** - Kingma & Ba, ICLR 2015
4. **AdamW** - Loshchilov & Hutter, ICLR 2019
5. **SGDR** - Loshchilov & Hutter, ICLR 2017
6. **Super-Convergence** - Smith & Topin, 2018
7. **MixUp** - Zhang et al., ICLR 2018
8. **CutMix** - Yun et al., ICCV 2019
9. **Focal Loss** - Lin et al., ICCV 2017
10. **Label Smoothing** - Szegedy et al., CVPR 2016
