# 模型训练知识库

## 概述

本文档总结了深度学习模型训练的最佳实践、常见问题和解决方案，来源于 ml_skill 项目开发和实践经验。

---

## 1. 项目目录结构

### 1.1 标准结构

**推荐结构**:
```
project/
├── doc/                  # 项目文档
│   ├── README.md         # 项目说明
│   ├── api.md            # API文档
│   └── tutorial.md       # 使用教程
├── plan/                 # 开发计划
│   ├── roadmap.md        # 开发路线图
│   └── tasks.md          # 任务列表
├── config/               # 配置文件
│   ├── default.yaml      # 默认配置
│   ├── train.yaml        # 训练配置
│   └── test.yaml         # 测试配置
├── model/                # 模型结构
│   ├── __init__.py       # build_model()
│   ├── resnet.py         # ResNet系列
│   └── efficientnet.py   # EfficientNet系列
├── loss/                 # 损失函数
│   ├── __init__.py       # build_loss()
│   ├── focal.py          # Focal Loss
│   └── dice.py           # Dice Loss
├── util/                 # 工具函数
│   ├── visualization.py  # 可视化工具
│   ├── logger.py         # 日志工具
│   ├── preprocess_data.py    # 数据预处理
│   ├── visualize.py      # 可视化脚本
│   └── convert_model.py  # 模型转换
├── engine/               # 训练引擎
│   ├── trainer.py        # 训练器
│   ├── train.py          # 训练入口
│   ├── test.py           # 测试入口
│   └── benchmark.py      # 性能基准测试
├── datalist/             # 数据列表
│   ├── train.txt         # 训练集列表
│   └── test.txt          # 测试集列表
├── dataset/              # 数据处理
│   ├── __init__.py       # build_dataloader()
│   ├── loader.py         # Dataset实现
│   ├── transform.py      # 数据增强
│   └── sampler.py        # 采样器
├── metrics/              # 评价指标
│   ├── __init__.py       # build_metrics()
│   ├── accuracy.py       # 准确率
│   ├── iou.py            # IoU
│   └── map.py            # mAP
├── log/                  # 日志和可视化
│   ├── train.log         # 训练日志
│   ├── tensorboard/      # TensorBoard日志
│   └── visualization/    # 可视化结果
├── checkpoint/           # 模型检查点
│   ├── best.pth          # 最佳模型
│   └── latest.pth        # 最新模型
├── script/               # Shell脚本（仅.sh文件）
│   ├── train.sh          # 训练启动脚本
│   ├── eval.sh           # 评估脚本
│   ├── test.sh           # 测试脚本
│   └── deploy.sh         # 部署脚本
└── test/                 # 测试代码
    ├── test_model/       # 模型测试
    ├── test_loss/        # 损失函数测试
    ├── test_dataset/     # 数据集测试
    └── test_metrics/     # 指标测试
```

### 1.2 目录职责划分

| 目录 | 文件类型 | 用途 | 示例 |
|------|---------|------|------|
| **script/** | `.sh` | Shell 脚本（环境设置、多命令组合） | `train.sh`, `eval.sh`, `deploy.sh` |
| **util/** | `.py` | Python 工具脚本（数据处理、可视化） | `preprocess_data.py`, `visualize.py` |
| **engine/** | `.py` | 训练引擎模块（训练、测试逻辑） | `trainer.py`, `benchmark.py` |
| **config/** | `.yaml` | 配置文件（参数、超参） | `default.yaml`, `train.yaml` |
| **model/** | `.py` | 模型定义（网络结构） | `resnet.py`, `efficientnet.py` |
| **loss/** | `.py` | 损失函数（训练目标） | `focal.py`, `dice.py` |
| **dataset/** | `.py` | 数据处理（加载、增强） | `loader.py`, `transform.py` |
| **metrics/** | `.py` | 评价指标（性能度量） | `accuracy.py`, `iou.py` |

### 1.3 script/ vs util/ vs engine/ 区别

**script/（Shell 脚本）**:
- 用途：启动脚本、环境变量设置、多命令组合
- 特点：独立执行，不导入
- 示例：
  ```bash
  # script/train.sh
  #!/bin/bash
  export CUDA_VISIBLE_DEVICES=0,1
  python engine/train.py --config config/train.yaml
  ```

**util/（Python 工具）**:
- 用途：数据处理、可视化、模型转换
- 特点：可独立执行或被导入
- 示例：
  ```python
  # util/preprocess_data.py
  def preprocess_dataset(data_path, output_path):
      # 数据预处理逻辑
      pass
  
  if __name__ == "__main__":
      preprocess_dataset("raw_data/", "processed_data/")
  ```

**engine/（训练引擎）**:
- 用途：训练、测试、评估的核心逻辑
- 特点：模块化，可导入
- 示例：
  ```python
  # engine/trainer.py
  class Trainer:
      def __init__(self, model, optimizer, criterion):
          self.model = model
          self.optimizer = optimizer
          self.criterion = criterion
      
      def train_epoch(self, dataloader):
          # 训练一个epoch
          pass
  ```

---

## 2. 训练工作流

### 2.1 标准训练流程

```
数据准备
    ↓
配置参数（config/train.yaml）
    ↓
启动训练（script/train.sh）
    ↓
训练循环（engine/trainer.py）
    ├─ 前向传播
    ├─ 计算损失（loss/）
    ├─ 反向传播
    ├─ 更新参数
    └─ 验证评估（metrics/）
    ↓
保存模型（checkpoint/）
    ↓
日志记录（log/）
```

### 2.2 训练入口示例

**engine/train.py**:
```python
import torch
from torch.utils.data import DataLoader
from model import build_model
from loss import build_loss
from dataset import build_dataloader
from engine.trainer import Trainer
from util.logger import setup_logger
import yaml

def main():
    # 加载配置
    with open("config/train.yaml") as f:
        config = yaml.safe_load(f)
    
    # 设置日志
    logger = setup_logger("train", "log/train.log")
    
    # 构建模型
    model = build_model(config["model"])
    model = torch.nn.DataParallel(model)
    model = model.cuda()
    
    # 构建损失函数
    criterion = build_loss(config["loss"])
    
    # 构建优化器
    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=config["training"]["lr"],
        weight_decay=config["training"]["weight_decay"]
    )
    
    # 构建数据加载器
    train_loader, val_loader = build_dataloader(config["data"])
    
    # 训练器
    trainer = Trainer(model, optimizer, criterion, logger)
    
    # 训练
    for epoch in range(config["training"]["epochs"]):
        trainer.train_epoch(train_loader, epoch)
        trainer.validate(val_loader, epoch)
        trainer.save_checkpoint(epoch, "checkpoint/latest.pth")

if __name__ == "__main__":
    main()
```

---

## 3. 损失函数选择

### 3.1 按任务类型选择

| 任务类型 | 推荐损失函数 | 权重配置 |
|---------|-------------|---------|
| 普通分类 | CrossEntropy | 1.0 |
| 类别不平衡分类 | Focal Loss | α=0.25, γ=2.0 |
| 分割 | CE + Dice | 0.5 + 0.5 |
| 检测 | Focal + IoU | 1.0 + 1.0 |
| 回归 | MSE / L1 | 1.0 |

### 3.2 常用损失函数实现

**Focal Loss（类别不平衡）**:
```python
# loss/focal.py
import torch
import torch.nn.functional as F

class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0, reduction='mean'):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.reduction = reduction
    
    def forward(self, pred, gt):
        ce_loss = F.cross_entropy(pred, gt, reduction='none')
        pt = torch.exp(-ce_loss)
        
        # Focal term
        focal_loss = self.alpha * (1 - pt) ** self.gamma * ce_loss
        
        if self.reduction == 'mean':
            return focal_loss.mean()
        elif self.reduction == 'sum':
            return focal_loss.sum()
        return focal_loss
```

**Dice Loss（分割）**:
```python
# loss/dice.py
class DiceLoss(nn.Module):
    def __init__(self, smooth=1.0):
        super().__init__()
        self.smooth = smooth
    
    def forward(self, pred, gt):
        # pred: [B, C, H, W], gt: [B, H, W]
        pred = F.softmax(pred, dim=1)
        gt_onehot = F.one_hot(gt, num_classes=pred.shape[1])
        gt_onehot = gt_onehot.permute(0, 3, 1, 2).float()
        
        intersection = (pred * gt_onehot).sum(dim=(2, 3))
        union = pred.sum(dim=(2, 3)) + gt_onehot.sum(dim=(2, 3))
        
        dice = (2 * intersection + self.smooth) / (union + self.smooth)
        return 1 - dice.mean()
```

---

## 4. 优化器配置

### 4.1 优化器选择

| 优化器 | 适用场景 | 推荐参数 |
|--------|---------|---------|
| SGD + Momentum | CV任务 | lr=0.1, momentum=0.9, wd=1e-4 |
| Adam | NLP/快速原型 | lr=0.001, betas=(0.9, 0.999) |
| AdamW | Transformer | lr=0.001, weight_decay=0.01 |
| LAMB | 大batch训练 | lr=0.001, warmup必需 |

### 4.2 学习率策略

**Cosine Annealing**:
```python
from torch.optim.lr_scheduler import CosineAnnealingLR

scheduler = CosineAnnealingLR(
    optimizer,
    T_max=epochs,
    eta_min=1e-6
)
```

**Warmup + Cosine**:
```python
from torch.optim.lr_scheduler import LambdaLR

def warmup_cosine_schedule(epoch):
    if epoch < warmup_epochs:
        return epoch / warmup_epochs
    else:
        progress = (epoch - warmup_epochs) / (total_epochs - warmup_epochs)
        return 0.5 * (1 + math.cos(math.pi * progress))

scheduler = LambdaLR(optimizer, lr_lambda=warmup_cosine_schedule)
```

---

## 5. 性能优化

### 5.1 显存优化

**混合精度训练**:
```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

with autocast():
    pred = model(x)
    loss = criterion(pred, y)

scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
```

**梯度累积**（模拟大batch）:
```python
accumulation_steps = 4

for i, (x, y) in enumerate(dataloader):
    pred = model(x)
    loss = criterion(pred, y) / accumulation_steps
    loss.backward()
    
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

**梯度检查点**（节省显存）:
```python
from torch.utils.checkpoint import checkpoint

class Model(nn.Module):
    def forward(self, x):
        # 使用checkpoint包裹层
        x = checkpoint(self.layer1, x)
        x = checkpoint(self.layer2, x)
        return x
```

### 5.2 速度优化

**DataLoader 优化**:
```python
dataloader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,
    num_workers=8,          # 多进程加载
    pin_memory=True,        # 锁页内存
    prefetch_factor=2,      # 预取
    persistent_workers=True # 持久化worker
)
```

**编译优化**（PyTorch 2.0+）:
```python
model = torch.compile(model, mode="reduce-overhead")
```

---

## 6. 常见问题

### 6.1 OOM（显存不足）

**解决方案优先级**:
1. **降低 batch size**（最直接）
2. **使用混合精度训练**（节省约50%显存）
3. **梯度累积**（模拟大batch）
4. **梯度检查点**（牺牲速度换显存）
5. **模型并行**（超大模型）

### 6.2 训练不收敛

**检查清单**:
- [ ] 学习率是否过大/过小
- [ ] 数据是否归一化
- [ ] 标签是否正确
- [ ] 损失函数是否合适
- [ ] 是否需要 warmup

### 6.3 过拟合

**解决方案**:
1. **数据增强**（transform.py）
2. **正则化**（Dropout, Weight Decay）
3. **早停**（Early Stopping）
4. **模型简化**（减少参数量）

---

## 7. 最佳实践

### 7.1 配置管理

**使用 YAML 配置文件**（config/train.yaml）:
```yaml
model:
  name: resnet50
  num_classes: 10
  pretrained: true

loss:
  name: focal
  alpha: 0.25
  gamma: 2.0

training:
  epochs: 100
  lr: 0.001
  weight_decay: 0.01
  batch_size: 32

data:
  train_path: "data/train"
  val_path: "data/val"
  num_workers: 8
```

### 7.2 日志记录

**使用 TensorBoard**:
```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("log/tensorboard")

# 记录损失
writer.add_scalar("Loss/train", train_loss, epoch)
writer.add_scalar("Loss/val", val_loss, epoch)

# 记录学习率
writer.add_scalar("LR", optimizer.param_groups[0]["lr"], epoch)

# 记录梯度分布
for name, param in model.named_parameters():
    writer.add_histogram(f"Gradients/{name}", param.grad, epoch)
```

### 7.3 检查点保存

**保存最佳模型**:
```python
def save_checkpoint(model, optimizer, epoch, best_loss, path):
    torch.save({
        "epoch": epoch,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "best_loss": best_loss,
    }, path)

# 训练循环中
if val_loss < best_loss:
    best_loss = val_loss
    save_checkpoint(model, optimizer, epoch, best_loss, "checkpoint/best.pth")
```

---

## 8. 工具脚本模板

### 8.1 训练启动脚本

**script/train.sh**:
```bash
#!/bin/bash

# 设置GPU
export CUDA_VISIBLE_DEVICES=0,1

# 训练参数
CONFIG="config/train.yaml"
RESUME=""

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --config)
            CONFIG="$2"
            shift 2
            ;;
        --resume)
            RESUME="--resume $2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# 启动训练
python engine/train.py --config $CONFIG $RESUME
```

### 8.2 数据预处理脚本

**util/preprocess_data.py**:
```python
import os
from pathlib import Path
from PIL import Image
from tqdm import tqdm

def preprocess_dataset(data_path, output_path, size=(224, 224)):
    """预处理数据集"""
    data_path = Path(data_path)
    output_path = Path(output_path)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # 遍历所有图片
    for img_path in tqdm(list(data_path.glob("**/*.jpg"))):
        # 读取图片
        img = Image.open(img_path)
        
        # 调整大小
        img = img.resize(size, Image.BILINEAR)
        
        # 保存
        output_img_path = output_path / img_path.relative_to(data_path)
        output_img_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_img_path)

if __name__ == "__main__":
    preprocess_dataset("raw_data/", "processed_data/")
```

---

## 9. 参考资料

### 9.1 官方文档
- PyTorch 官方文档：https://pytorch.org/docs/
- PyTorch 教程：https://pytorch.org/tutorials/
- TensorBoard 文档：https://pytorch.org/docs/stable/tensorboard.html

### 9.2 最佳实践
- PyTorch 性能调优指南
- 混合精度训练最佳实践
- 分布式训练指南

### 9.3 项目参考
- ml_skill 项目：https://github.com/ahangchen/claude_ml_skills
- former3d 项目：本地路径 `/home/cwh/coding/former3d`

---

**最后更新**: 2026-03-01
**维护者**: Weihang (ahangchen)
