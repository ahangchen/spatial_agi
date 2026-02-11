# 实验配置管理功能说明

## 功能概述

实验配置管理模块提供以下功能：

1. **自动生成实验目录名** - 根据关键命令行参数生成唯一实验名
2. **自动保存配置文件** - 将所有训练参数保存为Markdown文件
3. **统一目录结构** - .rrd文件、checkpoints、配置文件在同一目录

## 实验目录命名规则

### 格式
```
{timestamp}_bs{batch_size}_lr{learning_rate}_seq{sequence_length}_h{attn_heads}_l{attn_layers}_v{voxel_size}
```

### 示例
```
20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16
20260211_182210_bs4_lr5em04_seq20_h2_l2_v0.08
20260211_182212_bs8_lr1em03_seq5_h4_l4_v0.32
```

### 参数说明
| 参数 | 说明 | 示例 |
|------|------|------|
| timestamp | 创建时间（YYYYMMDD_HHMMSS） | 20260211_182208 |
| bs | 批次大小 | bs2 (batch_size=2) |
| lr | 学习率（科学计数法） | lr1em04 (learning_rate=1e-4) |
| seq | 序列长度 | seq10 (sequence_length=10) |
| h | 注意力头数 | h1 (attn_heads=1) |
| l | 注意力层数 | l1 (attn_layers=1) |
| v | 体素大小 | v0.16 (voxel_size=0.16) |

## 实验目录结构

```
experiments/
├── 20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16/
│   ├── EXPERIMENT_CONFIG.md    # 配置文件
│   ├── training.rrd            # Rerun可视化数据
│   └── checkpoints/            # 模型检查点
│       ├── stream_model_epoch_5.pth
│       └── stream_model_epoch_10.pth
├── 20260211_182210_bs4_lr5em04_seq20_h2_l2_v0.08/
│   ├── EXPERIMENT_CONFIG.md
│   ├── training.rrd
│   └── checkpoints/
│       └── ...
└── ...
```

## 配置文件内容

`EXPERIMENT_CONFIG.md` 包含以下部分：

### 1. 实验基本信息
- 实验名称
- 创建时间
- 模型名称

### 2. 参数表格
- 训练参数
- 模型参数
- 数据参数
- 显存管理参数
- 设备参数
- Rerun可视化参数

### 3. 完整配置（JSON格式）
所有命令行参数的JSON格式，方便解析

### 4. 使用方法
- 训练命令（用于复现实验）
- 查看可视化命令

## 使用方法

### 基本使用

```bash
cd /home/cwh/coding/former3d

# 启用可视化（自动创建实验目录）
python train_stream_integrated.py \
    --enable-rerun-viz \
    --data-root /path/to/tartanair \
    --batch-size 2 \
    --learning-rate 1e-4 \
    --epochs 10 \
    --sequence-length 10
```

### 不同实验配置

#### 实验1：小批次，低学习率
```bash
python train_stream_integrated.py \
    --enable-rerun-viz \
    --data-root /path/to/tartanair \
    --batch-size 2 \
    --learning-rate 1e-4 \
    --epochs 10
```
生成的目录：`experiments/20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16/`

#### 实验2：中等批次，中等学习率
```bash
python train_stream_integrated.py \
    --enable-rerun-viz \
    --data-root /path/to/tartanair \
    --batch-size 4 \
    --learning-rate 5e-4 \
    --epochs 10
```
生成的目录：`experiments/20260211_182210_bs4_lr5em04_seq10_h1_l1_v0.16/`

#### 实验3：大批次，高学习率
```bash
python train_stream_integrated.py \
    --enable-rerun-viz \
    --data-root /path/to/tartanair \
    --batch-size 8 \
    --learning-rate 1e-3 \
    --epochs 10
```
生成的目录：`experiments/20260211_182212_bs8_lr1em03_seq10_h1_l1_v0.16/`

## 查看实验结果

### 查看配置
```bash
# 查看特定实验的配置
cat experiments/20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16/EXPERIMENT_CONFIG.md
```

### 查看可视化
```bash
# 使用Rerun Viewer查看
rerun experiments/20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16/training.rrd
```

### 对比不同实验
由于每个实验有独立的目录，可以方便地对比不同实验的结果：

```bash
# 同时打开两个实验进行对比
rerun experiments/20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16/training.rrd &
rerun experiments/20260211_182210_bs4_lr5em04_seq10_h1_l1_v0.16/training.rrd &
```

## 模块API

### generate_experiment_name(args)
```python
from experiment_config import generate_experiment_name

args = parse_args()
experiment_name = generate_experiment_name(args)
print(experiment_name)
# 输出: 20260211_182208_bs2_lr1em04_seq10_h1_l1_v0.16
```

### save_experiment_config(args, experiment_dir, model_name)
```python
from experiment_config import save_experiment_config

args = parse_args()
config_file = save_experiment_config(
    args=args,
    experiment_dir='experiments/my_experiment',
    model_name='StreamSDFFormerIntegrated'
)
print(f"配置已保存到: {config_file}")
```

### create_experiment_directory(base_dir, args, model_name)
```python
from experiment_config import create_experiment_directory

args = parse_args()
paths = create_experiment_directory(
    base_dir='experiments',
    args=args,
    model_name='StreamSDFFormerIntegrated'
)

print(f"实验目录: {paths['experiment_dir']}")
print(f"配置文件: {paths['config_file']}")
print(f"RRD文件: {paths['rrd_file']}")
print(f"检查点目录: {paths['checkpoint_dir']}")
```

## 测试

运行测试套件：

```bash
cd /home/cwh/.openclaw/workspace
python test_experiment_config.py
```

测试内容：
- ✅ 实验目录名生成
- ✅ 配置文件保存
- ✅ 实验目录创建
- ✅ 集成功能

## 优势

### 1. 避免文件混淆
不同实验使用不同目录，.rrd文件和checkpoints不会冲突

### 2. 方便实验管理
实验目录名包含关键参数，一眼就能看出配置差异

### 3. 便于复现实验
配置文件记录所有参数，可以准确复现实验

### 4. 统一目录结构
所有实验相关文件（配置、可视化、检查点）在同一目录

### 5. 自动化程度高
无需手动创建目录和记录配置，自动完成

## 常见问题

### Q: 可以自定义实验目录名吗？
A: 可以修改`generate_experiment_name()`函数，添加更多参数或使用自定义格式。

### Q: 可以使用不同的基础目录吗？
A: 可以，通过修改`create_experiment_directory()`的`base_dir`参数。当前默认使用`'experiments'`。

### Q: 配置文件格式可以自定义吗？
A: 可以，修改`save_experiment_config()`函数中的`md_content`模板。

### Q: 可以添加更多参数到实验目录名吗？
A: 可以，在`generate_experiment_name()`函数中添加更多参数。

## 已知限制

1. **时间戳精度**：秒级时间戳，同一秒内启动的实验可能重名（极少见）
2. **目录名长度**：实验目录名可能较长，但一般不会超过系统限制
3. **参数选择**：当前只选择关键参数生成目录名，其他参数保存在配置文件中

## Git提交

```
commit a6ad3a6
feat: 实现实验配置管理功能
```

## 参考资料

- Python argparse文档: https://docs.python.org/3/library/argparse.html
- Markdown语法: https://www.markdownguide.org/
- 文件路径处理: https://docs.python.org/3/library/os.path.html
