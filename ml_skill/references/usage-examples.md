# 使用示例

本文档提供 ml_skill 的详细使用示例。

## 示例1: 图像分类项目（完整流程）

### 场景描述

用户要求："我要训练一个图像分类器，识别10种动物"

### 完整流程

#### 步骤1: 项目规划

**主会话 → 委派给 project-planner**

```json
输入:
{
  "project_name": "animal-classifier",
  "task_description": "训练一个识别10种动物的分类器",
  "requirements": {
    "task_type": "classification",
    "input_shape": [3, 224, 224],
    "num_classes": 10,
    "performance_requirement": {
      "target_accuracy": 0.95,
      "max_time": 48
    }
  },
  "constraints": {
    "hardware": "单GPU (6GB)",
    "data_availability": true
  }
}

输出:
{
  "phases": [
    {
      "name": "数据准备",
      "duration": "2天",
      "tasks": ["数据收集", "数据清洗", "数据集划分"]
    },
    {
      "name": "模型开发",
      "duration": "3天",
      "tasks": ["架构设计", "损失函数设计", "训练脚本实现"]
    },
    {
      "name": "训练调试",
      "duration": "7天",
      "tasks": ["基线训练", "参数调优", "性能优化"]
    }
  ],
  "success_metrics": ["验证准确率 > 95%"]
}
```

---

#### 步骤2: 模型架构设计

**主会话 → 委派给 model-architect**

```json
输入:
{
  "task": "classification",
  "input_shape": [3, 224, 224],
  "requirements": {
    "max_params": 25000000,
    "target_fps": 100
  },
  "dataset_info": {
    "num_classes": 10
  },
  "preferences": {
    "backbone": "resnet50",
    "pretrained": true
  }
}

输出:
{
  "architecture": {
    "name": "ResNet50",
    "params": 25557032,
    "flops": 4120000000
  },
  "files": [
    {
      "path": "networks/resnet.py",
      "content": "class ResNet50(nn.Module):\n  ..."
    }
  ],
  "implementation_tips": [
    "使用torchvision的预训练ResNet50",
    "最后的FC层替换为num_classes=10"
  ]
}
```

**主会话执行**：
```python
# 将代码写入 networks/resnet.py
# 确保提供 build_model(opts) 函数
```

---

#### 步骤3: 算法设计

**主会话 → 委派给 algorithm-designer**

```json
输入:
{
  "task": "classification",
  "dataset_info": {
    "num_classes": 10,
    "class_distribution": [1000, 1000, 1000, ...]  # 均衡
  }
}

输出:
{
  "loss_functions": [
    {
      "name": "CrossEntropyLoss",
      "rationale": "标准分类任务，数据均衡"
    }
  ],
  "optimizer_config": {
    "optimizer": "AdamW",
    "lr": 0.001,
    "weight_decay": 0.01
  },
  "lr_scheduler": {
    "type": "CosineAnnealingLR",
    "warmup_epochs": 5
  }
}
```

**主会话执行**：
```python
# 在 runner.py 中实现
def compute_loss(self, pred, gt):
    return F.cross_entropy(pred, gt)

# 配置优化器
optimizer = AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
```

---

#### 步骤4: 训练基线模型

**主会话 → 执行训练**

```bash
python run.py --model resnet50 --epochs 50 --batch_size 32
```

**训练日志**：
```
Epoch 1/50: Train Loss: 2.1234, Train Acc: 0.2345, Val Loss: 1.8765, Val Acc: 0.3456
Epoch 10/50: Train Loss: 0.8765, Train Acc: 0.7123, Val Loss: 0.9234, Val Acc: 0.6789
Epoch 50/50: Train Loss: 0.1234, Train Acc: 0.9567, Val Loss: 0.3456, Val Acc: 0.7890
```

**发现问题**：过拟合（train_acc=0.96, val_acc=0.79，差距17%）

---

#### 步骤5: 精度调优

**主会话 → 委派给 accuracy-tuner**

```json
输入:
{
  "problem": "overfit",
  "train_loss": 0.12,
  "val_loss": 0.35,
  "train_acc": 0.96,
  "val_acc": 0.79,
  "epoch": 50,
  "current_lr": 0.001,
  "batch_size": 32
}

输出:
{
  "diagnosis": "过拟合：训练精度96%但验证精度79%，差距17%",
  "solutions": [
    {
      "priority": 1,
      "action": "添加数据增强",
      "config_changes": {
        "augmentation.random_crop": true,
        "augmentation.horizontal_flip": true,
        "augmentation.color_jitter": [0.4, 0.4, 0.4, 0.1]
      }
    },
    {
      "priority": 2,
      "action": "应用Label Smoothing",
      "config_changes": {
        "label_smoothing": 0.1
      }
    }
  ]
}
```

**主会话执行**：
1. 修改 `datasets/transforms.py` 添加数据增强
2. 修改 `runner.py` 添加 Label Smoothing
3. 重新训练

```bash
python run.py --epochs 50 --augmentation random_crop,h_flip,color_jitter --label_smoothing 0.1
```

**新训练日志**：
```
Epoch 50/50: Train Loss: 0.2345, Train Acc: 0.9123, Val Loss: 0.2876, Val Acc: 0.8901
```

**结果**：验证精度提升至89%，train-val gap缩小至2%

---

#### 步骤6: 测试评估

**主会话 → 委派给 test-engineer**

```json
输入:
{
  "task": "classification",
  "metrics": ["accuracy", "precision", "recall", "f1"],
  "test_dataset": {
    "num_classes": 10,
    "num_samples": 5000
  }
}

输出:
{
  "eval_script": {
    "path": "eval.py",
    "functions": ["evaluate", "compute_metrics"]
  }
}
```

**主会话执行**：
```bash
python eval.py --checkpoint checkpoints/best.pth
```

**评估结果**：
```
=== Evaluation Results ===
Accuracy: 0.8923
Precision: 0.8945
Recall: 0.8912
F1 Score: 0.8928
```

---

#### 步骤7: 文档编写

**主会话 → 委派给 doc-writer**

```json
输入:
{
  "project_name": "animal-classifier",
  "document_type": "readme",
  "content_focus": ["installation", "usage", "training", "evaluation"]
}

输出:
{
  "document_content": "# Animal Classifier\n\n## 项目简介\n..."
}
```

**主会话执行**：
- 将文档写入 `README.md`

---

## 示例2: 解决显存OOM问题

### 场景描述

用户在训练时遇到显存不足错误：
```
RuntimeError: CUDA out of memory. Tried to allocate 256.00 MiB
```

### 解决流程

**主会话 → 委派给 performance-tuner**

```json
输入:
{
  "problem": "oom",
  "error_message": "RuntimeError: CUDA out of memory. Tried to allocate 256.00 MiB (GPU 0; 6.00 GiB total capacity; 4.72 GiB already allocated)",
  "current_batch_size": 32,
  "gpu_memory_total": 6,
  "gpu_memory_used": 5.8,
  "model_params": 25000000,
  "input_shape": [3, 224, 224]
}

输出:
{
  "diagnosis": "显存不足：6GB显存无法支持batch_size=32",
  "solutions": [
    {
      "priority": 1,
      "action": "启用混合精度训练",
      "memory_save": "-50%",
      "speedup": "1.5-2x",
      "config_changes": {
        "use_amp": true
      },
      "code_patches": [
        {
          "file": "runner.py",
          "location": "__init__方法",
          "code": "self.scaler = GradScaler(enabled=opts.use_amp)"
        },
        {
          "file": "runner.py",
          "location": "train_step方法",
          "code": "with autocast(enabled=self.opts.use_amp):\n    pred = self.model(x)"
        }
      ]
    },
    {
      "priority": 2,
      "action": "使用梯度累积",
      "memory_save": "-75%",
      "config_changes": {
        "batch_size": 8,
        "gradient_accumulation_steps": 4
      }
    }
  ]
}
```

**主会话执行**：

1. 应用方案1（混合精度）：
```python
# runner.py
from torch.cuda.amp import autocast, GradScaler

class Runner:
    def __init__(self, opts):
        self.scaler = GradScaler(enabled=opts.use_amp)
    
    def train_step(self, x, y):
        with autocast(enabled=self.opts.use_amp):
            pred = self.model(x)
            loss = self.compute_loss(pred, y)
        
        self.scaler.scale(loss).backward()
        self.scaler.step(self.optimizer)
        self.scaler.update()
```

```bash
python run.py --use_amp --batch_size 32
```

**结果**：显存从5.8GB降至3.0GB，训练成功

2. 如果方案1不够，应用方案2（梯度累积）：
```bash
python run.py --use_amp --batch_size 8 --gradient_accumulation_steps 4
```

**结果**：显存进一步降至2.5GB

---

## 示例3: 使用NAS搜索最优架构

### 场景描述

用户要求："标准ResNet50精度不够，需要搜索更好的架构"

### 解决流程

**主会话 → 委派给 nas-specialist**

```json
输入:
{
  "task": "classification",
  "search_budget": {
    "evaluations": 500,
    "time_limit": 24
  },
  "constraints": {
    "max_params": 30000000,
    "max_flops": 5000000000
  },
  "search_method": "evolutionary"
}

输出:
{
  "best_architecture": {
    "name": "EfficientCustomNet",
    "structure": [...],
    "accuracy": 0.92,
    "params": 23456789,
    "flops": 4200000000
  },
  "search_results": {
    "history": [...],
    "best_configs": [...]
  }
}
```

**主会话执行**：
1. 根据搜索结果实现新架构
2. 训练新模型
3. 验证精度提升

---

## 示例4: 多任务学习（检测）

### 场景描述

用户要求："训练一个目标检测模型"

### 完整流程

#### 步骤1: 模型架构

**委派给 model-architect**
```json
{
  "task": "detection",
  "requirements": {
    "backbone": "resnet50",
    "neck": "FPN"
  }
}
```

#### 步骤2: 算法设计

**委派给 algorithm-designer**
```json
{
  "task": "detection",
  "requirements": {
    "loss_types": ["classification", "regression"],
    "multi_task": true
  }
}
```

输出：Focal Loss + IoU Loss

#### 步骤3: 训练与调试

```bash
python run.py --task detection --epochs 100
```

---

## 示例5: 处理类别不平衡

### 场景描述

用户数据集类别分布不均衡：
- 类别1: 10000样本
- 类别2: 8000样本
- ...
- 类别10: 100样本（tail类）

### 解决流程

**主会话 → 委派给 algorithm-designer**

```json
输入:
{
  "task": "classification",
  "problem": "类别不平衡",
  "dataset_info": {
    "num_classes": 10,
    "class_distribution": [10000, 8000, 5000, 3000, 1000, 800, 500, 300, 100, 50]
  }
}

输出:
{
  "loss_functions": [
    {
      "name": "FocalLoss",
      "config": {"alpha": 0.25, "gamma": 2.0}
    }
  ],
  "sampling_strategy": {
    "type": "ClassBalancedSampler",
    "config": {"samples_per_class": 500}
  }
}
```

**主会话执行**：
1. 实现 Focal Loss
2. 实现类别平衡采样器
3. 训练模型

---

## 总结

通过这些示例，可以看到 ml_skill 如何通过 8 个专业 agent 协作，完成从项目规划到模型部署的完整流程。每个 agent 都有明确的职责和触发时机，确保任务委派准确、高效。
