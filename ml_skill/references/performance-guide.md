# 性能优化指南

深度学习训练性能调优：显存、速度、IO优化。

## 目录

1. [显存优化](#显存优化)
2. [速度优化](#速度优化)
3. [IO优化](#io优化)
4. [多GPU训练](#多gpu训练)
5. [混合精度训练](#混合精度训练)
6. [工具与调试](#工具与调试)

---

## 显存优化

### 1. 混合精度训练 (最有效)

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

with autocast():
    output = model(input)
    loss = criterion(output, target)

scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
```

**节省**: ~50%显存

### 2. Gradient Checkpointing

```python
# 方法1: 函数式
from torch.utils.checkpoint import checkpoint

def custom_forward(x):
    return layer2(layer1(x))

output = checkpoint(custom_forward, input)

# 方法2: 模块式
model.gradient_checkpointing_enable()  # HuggingFace
```

**节省**: 30-70%显存
**代价**: 增加20-30%计算时间

### 3. 减小Batch Size + 累积梯度

```python
# 等效batch_size = batch_size * accumulation_steps
accumulation_steps = 4

for i, (input, target) in enumerate(dataloader):
    output = model(input)
    loss = criterion(output, target) / accumulation_steps
    loss.backward()

    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

### 4. 模型并行

```python
# 简单模型并行
model = nn.Sequential(
    nn.Linear(1024, 4096).to('cuda:0'),
    nn.Linear(4096, 1024).to('cuda:1'),
)

# 流水线并行 (DeepSpeed/PipeDream)
```

### 5. 优化数据类型

```python
# float32 → float16/bfloat16
model.half()  # 全部转FP16

# 或选择性转换
# 注意: BN/LN 通常保持FP32
```

### 6. 清理缓存

```python
import torch
import gc

def clear_memory():
    gc.collect()
    torch.cuda.empty_cache()
    torch.cuda.synchronize()
```

### 7. 减少中间变量

```python
# 不推荐
x = layer1(input)
y = layer2(x)
z = layer3(y)
output = layer4(z)

# 推荐 (原地操作)
output = layer4(layer3(layer2(layer1(input))))
```

### 8. 使用in-place操作

```python
# 推荐
x.add_(y)  # in-place
x.mul_(alpha)
x.relu_()

# 不推荐
x = x + y  # 创建新tensor
```

### 显存优化检查清单

| 方法 | 节省 | 代价 | 优先级 |
|------|------|------|--------|
| 混合精度 | ~50% | 精度略降 | ⭐⭐⭐⭐⭐ |
| Gradient Checkpointing | 30-70% | +20-30%时间 | ⭐⭐⭐⭐ |
| 梯度累积 | 任意 | 增加时间 | ⭐⭐⭐⭐ |
| 减小模型 | 可变 | 精度下降 | ⭐⭐⭐ |
| 清理缓存 | 少量 | 无 | ⭐⭐ |

---

## 速度优化

### 1. DataLoader优化

```python
dataloader = DataLoader(
    dataset,
    batch_size=64,
    shuffle=True,
    num_workers=8,          # CPU核心数
    pin_memory=True,        # 加速GPU传输
    prefetch_factor=2,      # 预取batch数
    persistent_workers=True, # 保持worker进程
)
```

**推荐设置**:
- `num_workers`: min(CPU核心数, batch_size/2)
- `pin_memory`: True (GPU训练时)
- `prefetch_factor`: 2-4

### 2. 编译优化 (PyTorch 2.0+)

```python
# torch.compile - 自动优化
model = torch.compile(model)

# 指定模式
model = torch.compile(model, mode="reduce-overhead")  # 减少CPU开销
model = torch.compile(model, mode="max-autotune")     # 最大性能
```

**提升**: 10-50%加速

### 3. cuDNN优化

```python
# 寻找最优卷积算法
torch.backends.cudnn.benchmark = True

# 确定性模式 (调试用)
torch.backends.cudnn.deterministic = True
```

### 4. 分布式数据并行

```python
# DDP比DataParallel快
model = DDP(model, device_ids=[0])

# 使用find_unused_parameters=False (如果所有参数都使用)
model = DDP(model, device_ids=[0], find_unused_parameters=False)
```

### 5. 减少Python循环

```python
# 不推荐
for i in range(batch_size):
    result[i] = func(x[i])

# 推荐: 向量化
result = func(x)  # 批量操作
```

### 6. 使用优化的库

```python
# 使用optimized implementations
from apex import amp  # NVIDIA Apex
from deepspeed.ops.adam import FusedAdam  # DeepSpeed

# 使用Flash Attention
from flash_attn import flash_attn_qkvpacked_func
```

### 速度优化检查清单

| 方法 | 提升 | 难度 | 优先级 |
|------|------|------|--------|
| DataLoader优化 | 20-50% | 低 | ⭐⭐⭐⭐⭐ |
| torch.compile | 10-50% | 低 | ⭐⭐⭐⭐⭐ |
| DDP | 30-80% | 中 | ⭐⭐⭐⭐ |
| cuDNN benchmark | 5-15% | 低 | ⭐⭐⭐⭐ |
| Flash Attention | 2-4x | 中 | ⭐⭐⭐ |

---

## IO优化

### 1. 数据预处理缓存

```python
# 预处理并保存到磁盘
for sample in dataset:
    processed = preprocess(sample)
    save_to_cache(processed)

# 训练时直接加载
class CachedDataset(Dataset):
    def __getitem__(self, idx):
        return load_from_cache(idx)
```

### 2. 内存映射

```python
import numpy as np

# 大文件使用内存映射
data = np.memmap('large_data.npy', dtype='float32', mode='r', shape=(N, C, H, W))
```

### 3. WebDataset/LMDB

```python
# WebDataset - 处理大量小文件
import webdataset as wds
dataset = wds.WebDataset("data-{000000..000999}.tar")

# LMDB - 高性能键值存储
import lmdb
```

### 4. 异步数据加载

```python
# 使用单独线程预处理
from threading import Thread
from queue import Queue
```

### 5. 压缩与格式

| 格式 | 速度 | 压缩率 | 推荐场景 |
|------|------|--------|----------|
| NPZ | 快 | 中 | NumPy数据 |
| HDF5 | 中 | 高 | 大型数据集 |
| TFRecord | 快 | 中 | TensorFlow生态 |
| Parquet | 中 | 高 | 表格数据 |
| WebDataset | 快 | 中 | 大量小文件 |

---

## 多GPU训练

### 1. DistributedDataParallel (DDP)

```python
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

# 初始化
dist.init_process_group(backend='nccl')

# 包装模型
model = DDP(model.to(device), device_ids=[local_rank])

# 采样器
sampler = DistributedSampler(dataset)
dataloader = DataLoader(dataset, sampler=sampler, ...)
```

### 2. Fully Sharded Data Parallel (FSDP)

```python
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP

# FSDP - 大模型必须
model = FSDP(
    model,
    mixed_precision=mp_policy,
    device_id=torch.cuda.current_device()
)
```

### 3. ZeRO (DeepSpeed)

```python
# ZeRO Stage 1: 优化器状态分片
# ZeRO Stage 2: +梯度分片
# ZeRO Stage 3: +参数分片
```

### 多GPU性能对比

| 方法 | 通信量 | 显存节省 | 适用场景 |
|------|--------|----------|----------|
| DP | 高 | 无 | 单机小模型 |
| DDP | 中 | 无 | 标准多GPU |
| FSDP | 低 | 高 | 大模型 |
| ZeRO-3 | 低 | 最高 | 超大模型 |

---

## 混合精度训练

### 自动混合精度 (AMP)

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()
model = model.cuda()
optimizer = AdamW(model.parameters(), lr=1e-3)

for data, target in dataloader:
    data, target = data.cuda(), target.cuda()
    optimizer.zero_grad()

    with autocast():
        output = model(data)
        loss = criterion(output, target)

    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

### bfloat16 (Ampere+)

```python
# BF16不需要scaler
with autocast(dtype=torch.bfloat16):
    output = model(data)
    loss = criterion(output, target)
loss.backward()
optimizer.step()
```

### 精度对比

| 精度 | 显存 | 速度 | 数值稳定性 | 硬件要求 |
|------|------|------|------------|----------|
| FP32 | 1x | 1x | 最好 | 通用 |
| FP16 | 0.5x | 1.5-3x | 需scaler | Volta+ |
| BF16 | 0.5x | 1.5-3x | 好 | Ampere+ |
| INT8 | 0.25x | 2-4x | 需量化 | 支持 |

---

## 工具与调试

### 1. 显存分析

```python
# 打印显存使用
print(torch.cuda.memory_summary())

# 显存快照
torch.cuda.memory._record_memory_history()
```

### 2. 性能分析

```python
# PyTorch Profiler
from torch.profiler import profile, ProfilerActivity

with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as p:
    model(input)
print(p.key_averages().table())
```

### 3. NVIDIA工具

```bash
# 实时监控
watch -n 1 nvidia-smi

# 详细分析
nsys profile python train.py
ncu python train.py
```

### 4. 常见问题诊断

| 问题 | 症状 | 解决方案 |
|------|------|----------|
| OOM | 显存不足 | 混合精度、checkpointing |
| GPU利用率低 | <50% | 增加num_workers、pin_memory |
| CPU瓶颈 | GPU等待 | 预处理缓存、WebDataset |
| 通信瓶颈 | 多GPU加速比低 | Overlap computation |

---

## 性能优化流程

1. **测量基线** - 记录显存、速度、GPU利用率
2. **识别瓶颈** - 使用profiler定位
3. **优先级排序**:
   - 混合精度 (最大收益)
   - DataLoader优化
   - torch.compile
   - Gradient Checkpointing
   - 分布式策略
4. **迭代验证** - 每次只改一个变量

---

## 关键论文参考

1. **Mixed Precision Training** - Micikevicius et al., 2018
2. **Gradient Checkpointing** - Chen et al., 2016
3. **ZeRO** - Rajbhandari et al., SC 2020
4. **Flash Attention** - Dao et al., NeurIPS 2022
5. **FSDP** - Facebook AI, 2021
