# 代码模板

本文档提供 ML 项目的标准代码模板。

## 目录结构

```
project/
├── configs/              # 配置文件
├── networks/             # 网络模型
├── datasets/             # 数据处理
├── utils/                # 工具函数
├── tests/                # 测试
├── docs/                 # 文档
├── options.py            # 参数配置
├── runner.py             # 训练逻辑
├── run.py                # 训练入口
├── eval.py               # 评估入口
└── README.md
```

---

## options.py - 参数配置

```python
import argparse

class Options:
    def __init__(self):
        self.parser = argparse.ArgumentParser(description='Training script')
        
        # 数据参数
        self.parser.add_argument('--data_root', type=str, default='./data',
                                help='数据集根目录')
        self.parser.add_argument('--dataset', type=str, default='imagenet',
                                help='数据集名称')
        
        # 模型参数
        self.parser.add_argument('--model', type=str, default='resnet50',
                                help='模型名称')
        self.parser.add_argument('--num_classes', type=int, default=1000,
                                help='类别数')
        self.parser.add_argument('--pretrained', action='store_true',
                                help='使用预训练权重')
        
        # 训练参数
        self.parser.add_argument('--epochs', type=int, default=100,
                                help='训练轮数')
        self.parser.add_argument('--batch_size', type=int, default=32,
                                help='批次大小')
        self.parser.add_argument('--lr', type=float, default=0.001,
                                help='学习率')
        self.parser.add_argument('--weight_decay', type=float, default=0.01,
                                help='权重衰减')
        
        # 优化参数
        self.parser.add_argument('--optimizer', type=str, default='adamw',
                                choices=['sgd', 'adam', 'adamw'],
                                help='优化器')
        self.parser.add_argument('--lr_scheduler', type=str, default='cosine',
                                choices=['step', 'cosine', 'plateau'],
                                help='学习率策略')
        self.parser.add_argument('--warmup_epochs', type=int, default=5,
                                help='warmup轮数')
        
        # 性能优化参数
        self.parser.add_argument('--use_amp', action='store_true',
                                help='使用混合精度训练')
        self.parser.add_argument('--gradient_accumulation_steps', type=int, default=1,
                                help='梯度累积步数')
        self.parser.add_argument('--num_workers', type=int, default=8,
                                help='数据加载workers数')
        
        # 其他参数
        self.parser.add_argument('--gpu', type=int, default=0,
                                help='GPU设备号')
        self.parser.add_argument('--seed', type=int, default=42,
                                help='随机种子')
        self.parser.add_argument('--checkpoint', type=str, default=None,
                                help='恢复训练的检查点路径')
        self.parser.add_argument('--experiment_name', type=str, default='default',
                                help='实验名称')
    
    def parse(self):
        return self.parser.parse_args()

if __name__ == '__main__':
    opts = Options().parse()
    print(opts)
```

---

## run.py - 训练入口

```python
import torch
import random
import numpy as np
from options import Options
from runner import Runner

def set_seed(seed):
    """设置随机种子"""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def main():
    # 解析参数
    opts = Options().parse()
    
    # 设置随机种子
    set_seed(opts.seed)
    
    # 设置GPU
    torch.cuda.set_device(opts.gpu)
    
    # 创建训练器
    trainer = Runner(opts)
    
    # 恢复训练（如果指定）
    if opts.checkpoint:
        trainer.load_checkpoint(opts.checkpoint)
    
    # 开始训练
    trainer.train()

if __name__ == '__main__':
    main()
```

---

## runner.py - 训练逻辑

```python
import os
import torch
import torch.nn as nn
from torch.cuda.amp import autocast, GradScaler
from torch.utils.data import DataLoader
from tqdm import tqdm

class Runner:
    def __init__(self, opts):
        self.opts = opts
        self.device = torch.device(f'cuda:{opts.gpu}')
        
        # 构建模型
        self.model = self.build_model()
        
        # 构建优化器
        self.optimizer = self.build_optimizer()
        
        # 构建学习率调度器
        self.scheduler = self.build_scheduler()
        
        # 混合精度
        self.scaler = GradScaler(enabled=opts.use_amp)
        
        # 损失函数
        self.criterion = nn.CrossEntropyLoss()
        
        # 数据加载器
        self.train_loader = self.build_dataloader(train=True)
        self.val_loader = self.build_dataloader(train=False)
        
        # 记录
        self.best_acc = 0.0
        self.start_epoch = 0
    
    def build_model(self):
        """构建模型"""
        from networks import build_model
        model = build_model(self.opts)
        model = model.to(self.device)
        return model
    
    def build_optimizer(self):
        """构建优化器"""
        if self.opts.optimizer == 'sgd':
            optimizer = torch.optim.SGD(
                self.model.parameters(),
                lr=self.opts.lr,
                momentum=0.9,
                weight_decay=self.opts.weight_decay
            )
        elif self.opts.optimizer == 'adam':
            optimizer = torch.optim.Adam(
                self.model.parameters(),
                lr=self.opts.lr,
                weight_decay=self.opts.weight_decay
            )
        elif self.opts.optimizer == 'adamw':
            optimizer = torch.optim.AdamW(
                self.model.parameters(),
                lr=self.opts.lr,
                weight_decay=self.opts.weight_decay
            )
        return optimizer
    
    def build_scheduler(self):
        """构建学习率调度器"""
        if self.opts.lr_scheduler == 'step':
            scheduler = torch.optim.lr_scheduler.StepLR(
                self.optimizer,
                step_size=30,
                gamma=0.1
            )
        elif self.opts.lr_scheduler == 'cosine':
            scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
                self.optimizer,
                T_max=self.opts.epochs,
                eta_min=1e-6
            )
        elif self.opts.lr_scheduler == 'plateau':
            scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
                self.optimizer,
                mode='max',
                factor=0.1,
                patience=10
            )
        return scheduler
    
    def build_dataloader(self, train=True):
        """构建数据加载器"""
        from datasets import build_dataset
        dataset = build_dataset(self.opts, train=train)
        
        loader = DataLoader(
            dataset,
            batch_size=self.opts.batch_size,
            shuffle=train,
            num_workers=self.opts.num_workers,
            pin_memory=True
        )
        return loader
    
    def train(self):
        """训练循环"""
        for epoch in range(self.start_epoch, self.opts.epochs):
            # 训练一个epoch
            train_loss, train_acc = self.train_epoch(epoch)
            
            # 验证
            val_loss, val_acc = self.validate(epoch)
            
            # 更新学习率
            if isinstance(self.scheduler, torch.optim.lr_scheduler.ReduceLROnPlateau):
                self.scheduler.step(val_acc)
            else:
                self.scheduler.step()
            
            # 保存检查点
            self.save_checkpoint(epoch, val_acc)
            
            # 打印信息
            print(f"Epoch {epoch+1}/{self.opts.epochs}")
            print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f}")
            print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
    
    def train_epoch(self, epoch):
        """训练一个epoch"""
        self.model.train()
        total_loss = 0.0
        correct = 0
        total = 0
        
        pbar = tqdm(self.train_loader, desc=f'Epoch {epoch+1}')
        for batch_idx, batch in enumerate(pbar):
            images = batch['image'].to(self.device)
            labels = batch['label'].to(self.device)
            
            # 前向传播（混合精度）
            with autocast(enabled=self.opts.use_amp):
                outputs = self.model(images)
                loss = self.compute_loss(outputs, labels)
            
            # 反向传播（梯度累积）
            loss = loss / self.opts.gradient_accumulation_steps
            self.scaler.scale(loss).backward()
            
            if (batch_idx + 1) % self.opts.gradient_accumulation_steps == 0:
                self.scaler.step(self.optimizer)
                self.scaler.update()
                self.optimizer.zero_grad()
            
            # 统计
            total_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            pbar.set_postfix({
                'loss': total_loss / (batch_idx + 1),
                'acc': 100. * correct / total
            })
        
        avg_loss = total_loss / len(self.train_loader)
        accuracy = correct / total
        return avg_loss, accuracy
    
    def validate(self, epoch):
        """验证"""
        self.model.eval()
        total_loss = 0.0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for batch in tqdm(self.val_loader, desc='Validation'):
                images = batch['image'].to(self.device)
                labels = batch['label'].to(self.device)
                
                outputs = self.model(images)
                loss = self.compute_loss(outputs, labels)
                
                total_loss += loss.item()
                _, predicted = outputs.max(1)
                total += labels.size(0)
                correct += predicted.eq(labels).sum().item()
        
        avg_loss = total_loss / len(self.val_loader)
        accuracy = correct / total
        return avg_loss, accuracy
    
    def compute_loss(self, pred, gt):
        """计算损失"""
        return self.criterion(pred, gt)
    
    def save_checkpoint(self, epoch, val_acc):
        """保存检查点"""
        os.makedirs('checkpoints', exist_ok=True)
        
        checkpoint = {
            'epoch': epoch,
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'scheduler_state_dict': self.scheduler.state_dict(),
            'best_acc': self.best_acc,
            'val_acc': val_acc
        }
        
        # 保存最新的检查点
        torch.save(checkpoint, f'checkpoints/{self.opts.experiment_name}_latest.pth')
        
        # 保存最佳检查点
        if val_acc > self.best_acc:
            self.best_acc = val_acc
            torch.save(checkpoint, f'checkpoints/{self.opts.experiment_name}_best.pth')
            print(f"New best accuracy: {val_acc:.4f}")
    
    def load_checkpoint(self, checkpoint_path):
        """加载检查点"""
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        self.scheduler.load_state_dict(checkpoint['scheduler_state_dict'])
        self.start_epoch = checkpoint['epoch'] + 1
        self.best_acc = checkpoint['best_acc']
        
        print(f"Loaded checkpoint from epoch {checkpoint['epoch']}")
```

---

## eval.py - 评估脚本

```python
import torch
from options import Options
from runner import Runner
from tqdm import tqdm
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def evaluate(opts):
    """评估模型"""
    device = torch.device(f'cuda:{opts.gpu}')
    
    # 加载模型
    trainer = Runner(opts)
    checkpoint = torch.load(opts.checkpoint, map_location=device)
    trainer.model.load_state_dict(checkpoint['model_state_dict'])
    trainer.model.eval()
    
    # 评估
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for batch in tqdm(trainer.val_loader, desc='Evaluating'):
            images = batch['image'].to(device)
            labels = batch['label'].to(device)
            
            outputs = trainer.model(images)
            _, predicted = outputs.max(1)
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    # 计算指标
    accuracy = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds, average='macro')
    recall = recall_score(all_labels, all_preds, average='macro')
    f1 = f1_score(all_labels, all_preds, average='macro')
    
    # 打印结果
    print("\n=== Evaluation Results ===")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1
    }

if __name__ == '__main__':
    opts = Options().parse()
    results = evaluate(opts)
```

---

## networks/__init__.py - 模型构建

```python
from .resnet import ResNet50
from .efficientnet import EfficientNetB0

def build_model(opts):
    """构建模型"""
    if opts.model == 'resnet50':
        model = ResNet50(num_classes=opts.num_classes, pretrained=opts.pretrained)
    elif opts.model == 'efficientnet_b0':
        model = EfficientNetB0(num_classes=opts.num_classes, pretrained=opts.pretrained)
    else:
        raise ValueError(f"Unknown model: {opts.model}")
    
    return model
```

---

## datasets/__init__.py - 数据集构建

```python
from .imagenet import ImageNetDataset
from .transforms import get_transforms

def build_dataset(opts, train=True):
    """构建数据集"""
    transform = get_transforms(train=train)
    
    if train:
        data_root = f"{opts.data_root}/train"
    else:
        data_root = f"{opts.data_root}/val"
    
    dataset = ImageNetDataset(
        root=data_root,
        transform=transform
    )
    
    return dataset
```

---

## 完整示例

完整的代码示例请参考 GitHub 仓库：
- [PyTorch-Template](https://github.com/victoresque/pytorch-template)
- [PyTorch-Project-Template](https://github.com/moemen95/Pytorch-Project-Template)
