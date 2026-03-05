# 网络结构搜索指南

Neural Architecture Search (NAS) 方法与实践。

## 目录

1. [NAS概述](#nas概述)
2. [搜索空间设计](#搜索空间设计)
3. [搜索策略](#搜索策略)
4. [效率评估](#效率评估)
5. [实用工具](#实用工具)
6. [最佳实践](#最佳实践)

---

## NAS概述

### 核心组件

```
NAS = 搜索空间 + 搜索策略 + 性能评估
```

### 方法分类

| 类型 | 代表方法 | 计算成本 | 搜索时间 |
|------|----------|----------|----------|
| 基于强化学习 | NASNet, ENAS | 高 | 数天-数周 |
| 基于进化算法 | AmoebaNet | 高 | 数天 |
| 可微分搜索 | DARTS | 中 | 数小时 |
| 单次搜索 | Once-for-All | 低 | 数小时 |
| 预测器方法 | BONAS | 低 | 数小时 |

---

## 搜索空间设计

### Cell-based搜索空间

```python
# NASNet搜索空间
OPERATIONS = [
    'identity',
    'sep_conv_3x3',
    'sep_conv_5x5',
    'dil_conv_3x3',
    'dil_conv_5x5',
    'avg_pool_3x3',
    'max_pool_3x3',
]

# 每个cell包含N个节点
# 每个节点选择2个输入和2个操作
```

### Macro搜索空间

```python
# 搜索层数、通道数、分辨率
search_space = {
    'depth': [12, 16, 20, 24, 28],
    'width': [256, 384, 512, 640, 768],
    'resolution': [160, 176, 192, 208, 224],
    'dropout': [0.0, 0.1, 0.2, 0.3],
}
```

### 3D网络搜索空间

```python
# 3D点云网络
search_space_3d = {
    'voxel_size': [0.05, 0.1, 0.2],
    'encoder_depth': [2, 3, 4, 5],
    'decoder_depth': [1, 2, 3],
    'channels': [32, 64, 128, 256],
    'attention': [True, False],
}
```

---

## 搜索策略

### 1. DARTS (可微分搜索)

```python
# DARTS - 连续松弛
import torch.nn as nn

class MixedOp(nn.Module):
    def __init__(self, C, stride):
        super().__init__()
        self.ops = nn.ModuleList([
            SepConv(C, C, 3, stride),
            SepConv(C, C, 5, stride),
            DilConv(C, C, 3, stride),
            DilConv(C, C, 5, stride),
            nn.Identity() if stride == 1 else FactorizedReduce(C, C),
            nn.Zero(stride),
        ])

    def forward(self, x, weights):
        return sum(w * op(x) for w, op in zip(weights, self.ops))

# 搜索过程
for epoch in range(search_epochs):
    # 更新网络权重
    optimizer.zero_grad()
    loss_train = model(x_train, arch_parameters)
    loss_train.backward()
    optimizer.step()

    # 更新架构参数
    arch_optimizer.zero_grad()
    loss_val = model(x_val, arch_parameters)
    loss_val.backward()
    arch_optimizer.step()
```

**优点**: 快速，几小时完成
**缺点**: 可能搜索出退化网络

### 2. Once-for-All (OFA)

```python
# 训练一个超大网络，从中采样子网络
from ofa import OFANetwork

# 定义超网络
supernet = OFANetwork(
    width_mult_list=[0.2, 0.25, 0.35, 0.5, 0.7, 1.0],
    depth_list=[2, 3, 4],
    expand_list=[4, 6],
    resolution_list=[160, 176, 192, 208, 224],
)

# 训练超网络
for epoch in range(epochs):
    # 采样子网络训练
    subnet = supernet.sample_subnet()
    loss = train(subnet)

# 搜索最优子网络
best_subnet = search_subnet(supernet, target_flops=300M)
```

**优点**: 训练一次，搜索快速
**缺点**: 需要大量显存训练超网络

### 3. 进化算法

```python
import random

def evolution_search(search_space, population_size=50, generations=100):
    # 初始化种群
    population = [random_architecture() for _ in range(population_size)]

    for gen in range(generations):
        # 评估
        fitness = [evaluate(arch) for arch in population]

        # 选择
        parents = select_top_k(population, fitness, k=10)

        # 变异
        offspring = []
        for parent in parents:
            child = mutate(parent)
            offspring.append(child)

        # 更新种群
        population = parents + offspring

    return best_architecture(population, fitness)
```

### 4. 贝叶斯优化

```python
from optuna import samplers

def nas_objective(trial):
    # 采样架构
    depth = trial.suggest_int('depth', 12, 28)
    width = trial.suggest_categorical('width', [256, 384, 512])
    drop_path = trial.suggest_float('drop_path', 0.0, 0.3)

    # 构建模型
    model = build_model(depth, width, drop_path)

    # 评估
    accuracy = train_and_evaluate(model)
    return accuracy

study = optuna.create_study(sampler=samplers.TPESampler())
study.optimize(nas_objective, n_trials=100)
```

---

## 效率评估

### 加速评估方法

1. **权重共享** - 子网络共享权重
2. **早停** - 训练少量epoch预测最终性能
3. **代理模型** - 学习性能预测器
4. **FLOPs约束** - 只评估满足约束的架构

### 性能预测器

```python
# 训练预测器
class PerformancePredictor(nn.Module):
    def __init__(self, arch_embedding_dim=64):
        super().__init__()
        self.encoder = ArchEncoder(arch_embedding_dim)
        self.predictor = nn.Sequential(
            nn.Linear(arch_embedding_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
        )

    def forward(self, architecture):
        embedding = self.encoder(architecture)
        return self.predictor(embedding)

# 使用预测器快速筛选
candidates = generate_candidates(1000)
predicted_scores = predictor(candidates)
top_candidates = select_top_k(candidates, predicted_scores, k=10)
# 只实际训练top candidates
```

---

## 实用工具

### NNI (Neural Network Intelligence)

```python
# Microsoft NNI
from nni.nas.pytorch import mutables

class SearchableModel(nn.Module):
    def __init__(self):
        self.conv1 = mutables.LayerChoice([
            nn.Conv2d(3, 32, 3),
            nn.Conv2d(3, 32, 5),
        ])
        self.depth = mutables.InputChoice(
            n_candidates=3,
            n_chosen=1
        )
```

### AutoGluon

```python
from autogluon.vision import ImagePredictor

predictor = ImagePredictor()
predictor.fit(train_data, time_limit=3600)  # 1小时搜索
```

### PyTorch Lightning + Optuna

```python
import pytorch_lightning as pl
from optuna.integration import PyTorchLightningPruningCallback

def objective(trial):
    model = LightningModel(
        lr=trial.suggest_loguniform('lr', 1e-5, 1e-1),
        hidden_dim=trial.suggest_categorical('hidden', [64, 128, 256]),
    )

    trainer = pl.Trainer(
        callbacks=[PyTorchLightningPruningCallback(trial, monitor='val_acc')],
    )
    trainer.fit(model)

    return trainer.callback_metrics['val_acc']
```

---

## 最佳实践

### 搜索策略选择

| 资源 | 推荐方法 |
|------|----------|
| < 1 GPU天 | 随机搜索 + Optuna |
| 1-10 GPU天 | DARTS |
| > 10 GPU天 | OFA + 进化 |

### 搜索空间设计原则

1. **包含已知优秀架构** - ResNet, EfficientNet作为候选
2. **限制搜索空间大小** - 避免组合爆炸
3. **考虑硬件约束** - FLOPs, 参数量, 延迟

### 常见陷阱

1. **搜索-评估差距**
   - 搜索时训练epoch少
   - 需要重新训练验证

2. **过拟合搜索空间**
   - 在验证集上搜索
   - 保留独立测试集

3. **忽略延迟**
   - 只看精度不看速度
   - 加入延迟约束

### 3D网络特殊考虑

```python
# 3D点云NAS
search_space_3d = {
    'voxelization': {
        'voxel_size': [0.05, 0.1, 0.15, 0.2],
        'max_points': [16, 32, 64],
    },
    'backbone': {
        'type': ['sparse_conv', 'pointnet++', 'voxelnet'],
        'depth': [2, 3, 4, 5],
    },
    'neck': {
        'type': ['fpn', 'unet', 'none'],
    },
    'head': {
        'type': ['centerpoint', 'pointpillar'],
    },
}

# 搜索约束
constraints = {
    'latency_ms': 50,  # <50ms on target hardware
    'memory_mb': 1024,  # <1GB显存
}
```

---

## 搜索后处理

### 架构微调

```python
# 搜索得到的架构需要从头训练
best_arch = search_result.best_architecture
model = build_from_arch(best_arch)

# 使用更大的训练配置
train_config = {
    'epochs': 300,
    'batch_size': 256,
    'lr': 0.1,
    'augmentation': 'strong',
    'regularization': 'moderate',
}
```

### 知识蒸馏

```python
# 用大模型指导搜索到的小模型
teacher = load_pretrained_large_model()
student = build_from_arch(best_arch)

# 蒸馏训练
loss = alpha * ce_loss(student_output, labels) + \
       (1 - alpha) * kl_loss(student_output, teacher_output)
```

---

## 关键论文参考

1. **NASNet** - Zoph & Le, ICLR 2017
2. **ENAS** - Pham et al., ICML 2018
3. **DARTS** - Liu et al., ICLR 2019
4. **Once-for-All** - Cai et al., ICLR 2020
5. **EfficientNet** - Tan & Le, ICML 2019
6. **FBNet** - Wu et al., CVPR 2019
7. **ProxylessNAS** - Cai et al., ICLR 2019
