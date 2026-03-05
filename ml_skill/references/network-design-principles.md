# 网络设计原则 (RegNet + EfficientNet)

基于 arXiv:2003.13678 和相关论文的网络设计原则。

---

## RegNet: 设计网络设计空间 (arXiv:2003.13678)

### 核心思想

**不是设计单个网络实例，而是设计参数化网络群体的设计空间**

### RegNet 参数化

```python
# 核心发现：优秀网络的宽度遵循量化线性函数
# w(i) = w₀ + k * i
# 其中 i 是 stage 索引，w₀ 是初始宽度，k 是斜率

# 完整参数
class RegNetConfig:
    # 量化线性函数参数
    w0: int       # 初始宽度 (例如 32)
    wa: float     # 斜率 (例如 10.0)
    wm: float     # 量化步长 (例如 2.0)
    d: int        # 深度 (例如 20)
    
    # 分组宽度
    g: int        # 组卷积宽度 (例如 8)
    
    # 瓶颈比
    b: int        # 瓶颈比 (例如 1)
```

### RegNet 实现

```python
import numpy as np

def generate_regnet(w0, wa, wm, d, group_width, bottleneck_ratio):
    """
    生成 RegNet 网络配置
    
    参数:
        w0: 初始通道数
        wa: 宽度增长斜率
        wm: 宽度量化因子
        d: 网络深度 (块数)
        group_width: 组卷积宽度
        bottleneck_ratio: 瓶颈比
    """
    # 生成每个 stage 的宽度
    widths = []
    depths = []
    
    # 计算连续宽度
    for i in range(d):
        wi = w0 + wa * i
        widths.append(wi)
    
    # 量化宽度 (按 wm 取整)
    widths = [int(round(w / wm) * wm) for w in widths]
    widths = [max(w, group_width) for w in widths]
    
    # 合并相同宽度的 stage
    # ...
    
    return {
        'widths': widths,
        'depths': depths,
        'group_width': group_width,
        'bottleneck_ratio': bottleneck_ratio
    }

# RegNetX-400MF 配置示例
regnetx_400mf = generate_regnet(
    w0=24, wa=16.13, wm=2.0, d=22,
    group_width=8, bottleneck_ratio=1
)
```

### 关键发现

| 发现 | 说明 | 与传统认知对比 |
|------|------|----------------|
| **深度稳定** | 最优深度约20块，与计算量无关 | 传统认为大模型应该更深 |
| **无瓶颈** | 最优模型不用bottleneck (b=1) | ResNet常用b=4 |
| **宽度线性增长** | w(i) = w₀ + k·i | 比手动设计更规律 |
| **组卷积有效** | group_width=8~16 效果好 | 替代大通道卷积 |

### RegNet vs EfficientNet

| 对比项 | RegNet | EfficientNet |
|--------|--------|--------------|
| 设计方法 | 设计空间探索 | 复合缩放 + NAS |
| 缩放策略 | 线性宽度增长 | 深度/宽度/分辨率复合 |
| GPU速度 | **快5倍** | 基准 |
| 可解释性 | **高** (数学规律) | 低 (搜索结果) |
| 灵活性 | 高 (设计空间) | 中 (固定缩放) |

---

## EfficientNet: 复合缩放 (arXiv:1905.11946)

### 核心思想

**使用复合系数统一缩放深度、宽度、分辨率**

### 复合缩放公式

```python
# 复合缩放
# depth = α^φ
# width = β^φ  
# resolution = γ^φ
# 约束: α * β² * γ² ≈ 2, α≥1, β≥1, γ≥1

class EfficientNetScaling:
    # 基础系数 (搜索得到)
    alpha = 1.2   # 深度系数
    beta = 1.1    # 宽度系数
    gamma = 1.15  # 分辨率系数
    
    @staticmethod
    def scale(base_depth, base_width, base_resolution, phi):
        """根据 phi 计算缩放后的参数"""
        depth = int(base_depth * (EfficientNetScaling.alpha ** phi))
        width = int(base_width * (EfficientNetScaling.beta ** phi))
        resolution = int(base_resolution * (EfficientNetScaling.gamma ** phi))
        return depth, width, resolution

# EfficientNet 系列配置
efficientnet_configs = {
    'b0': {'phi': 0,  'depth': 18, 'width': 1.0,  'resolution': 224},
    'b1': {'phi': 0.5, 'depth': 22, 'width': 1.1,  'resolution': 240},
    'b2': {'phi': 1,  'depth': 26, 'width': 1.2,  'resolution': 260},
    'b3': {'phi': 2,  'depth': 32, 'width': 1.4,  'resolution': 300},
    'b4': {'phi': 3,  'depth': 42, 'width': 1.8,  'resolution': 380},
    'b5': {'phi': 4,  'depth': 54, 'width': 2.2,  'resolution': 456},
    'b6': {'phi': 5,  'depth': 72, 'width': 2.6,  'resolution': 528},
    'b7': {'phi': 6,  'depth': 82, 'width': 3.1,  'resolution': 600},
}
```

### MBConv 块

```python
class MBConv(nn.Module):
    """MobileNet Inverted Bottleneck Convolution"""
    def __init__(self, in_ch, out_ch, expansion=6, kernel_size=3, stride=1):
        super().__init__()
        mid_ch = in_ch * expansion
        
        self.expand = nn.Sequential(
            nn.Conv2d(in_ch, mid_ch, 1, bias=False),
            nn.BatchNorm2d(mid_ch),
            nn.SiLU(inplace=True)
        ) if expansion != 1 else nn.Identity()
        
        self.depthwise = nn.Sequential(
            nn.Conv2d(mid_ch, mid_ch, kernel_size, stride, 
                     kernel_size//2, groups=mid_ch, bias=False),
            nn.BatchNorm2d(mid_ch),
            nn.SiLU(inplace=True)
        )
        
        # SE 注意力
        self.se = SEBlock(mid_ch, reduction=4)
        
        self.project = nn.Sequential(
            nn.Conv2d(mid_ch, out_ch, 1, bias=False),
            nn.BatchNorm2d(out_ch)
        )
        
        self.shortcut = stride == 1 and in_ch == out_ch
    
    def forward(self, x):
        out = self.expand(x)
        out = self.depthwise(out)
        out = self.se(out)
        out = self.project(out)
        if self.shortcut:
            out = out + x
        return out
```

---

## 数据增强策略

### AutoAugment vs RandAugment

| 方法 | 搜索策略 | 参数 | 效果 |
|------|----------|------|------|
| **AutoAugment** | 强化学习搜索 | 25组子策略 | Top-1 +2-3% |
| **RandAugment** | 随机选择 | N(操作数), M(强度) | Top-1 +1-2% |

### RandAugment 实现

```python
# RandAugment: 简化版自动增强
# 只需两个参数: N (操作数) 和 M (强度 0-10)

from torchvision.transforms import autoaugment

# PyTorch 实现
transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    autoaugment.RandAugment(num_ops=2, magnitude=9),  # N=2, M=9
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225]),
])

# 推荐配置
randaugment_configs = {
    'light':   {'N': 1, 'M': 5},   # 小数据集
    'medium':  {'N': 2, 'M': 9},   # 中等数据集
    'heavy':   {'N': 3, 'M': 15},  # 大数据集
}
```

### AugMix (增强鲁棒性)

```python
# AugMix: 提升对分布偏移的鲁棒性
# 混合多个增强版本 + JS散度损失

from torchvision.transforms import v2

transform = v2.Compose([
    v2.RandomResizedCrop(224),
    v2.AugMix(),  # PyTorch 2.0+
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean=[0.485, 0.456, 0.406], 
                std=[0.229, 0.224, 0.225]),
])
```

---

## 网络设计最佳实践

### 1. 模型选择指南

| 场景 | 推荐模型 | 原因 |
|------|----------|------|
| 移动端 | EfficientNet-B0/B1 | 小模型，高效 |
| 服务器 | RegNetY-4.0GF | GPU快5倍 |
| 高精度 | EfficientNet-B7 | SOTA精度 |
| 快速迭代 | RegNetX | 可解释，易调 |

### 2. 宽度/深度设计原则

```python
# RegNet 发现的规律
design_principles = {
    # 深度
    'depth': {
        'optimal': 20,        # 约20个块最优
        'range': (15, 25),    # 不要过深
        'scaling': 'stable',  # 不同计算量下稳定
    },
    # 宽度
    'width': {
        'growth': 'linear',   # 线性增长
        'quantized': True,    # 量化到8的倍数
        'formula': 'w(i) = w0 + k*i',
    },
    # 分辨率
    'resolution': {
        'range': (224, 600),
        'scaling': 'compound', # 复合缩放
    },
}
```

### 3. 训练配置模板

```python
# 高效训练配置 (基于 Bag of Tricks + RegNet 论文)
training_config = {
    # 学习率
    'lr': 0.1 * (batch_size / 256),  # Linear Scaling
    'warmup': 5,                       # epochs
    'scheduler': 'cosine',
    
    # 正则化
    'weight_decay': 5e-5,
    'label_smoothing': 0.1,
    
    # 数据增强
    'augmentation': {
        'type': 'randaugment',
        'N': 2,  # 操作数
        'M': 9,  # 强度
    },
    'mixup_alpha': 0.2,
    'cutmix_alpha': 1.0,
    
    # 归一化
    'norm': 'sync_bn',  # 多GPU用SyncBN
    
    # 训练
    'epochs': 100,
    'batch_size': 256,
}
```

---

## 关键论文引用

### 网络设计
1. **RegNet** - Radosavovic et al., CVPR 2020, arXiv:2003.13678
2. **EfficientNet** - Tan & Le, ICML 2019, arXiv:1905.11946
3. **EfficientNetV2** - Tan & Le, ICML 2021

### 数据增强
4. **AutoAugment** - Cubuk et al., CVPR 2019
5. **RandAugment** - Cubuk et al., CVPR 2020
6. **AugMix** - Hendrycks et al., ICLR 2020
7. **MixUp** - Zhang et al., ICLR 2018
8. **CutMix** - Yun et al., ICCV 2019

### 训练技巧
9. **Bag of Tricks** - He et al., CVPR 2019, arXiv:1812.01187
10. **Large Minibatch SGD** - Goyal et al., arXiv:1706.02677

---

*最后更新: 2026-02-28*
