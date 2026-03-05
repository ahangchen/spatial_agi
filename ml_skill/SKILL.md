---
name: ml-skill
description: ML模型训练全流程协作skill。适用于深度学习项目从规划到部署的完整流程。当用户提到"训练模型"、"深度学习"、"调参"、"优化精度"等ML相关任务时使用。9个专业subagent覆盖项目规划、架构设计、算法设计、性能优化、精度调优、测试评估、文档编写、架构搜索、数据工程。
---

# ML模型训练Skill

## 概述

本 skill 提供完整的深度学习训练工作流，通过 9 个专业 subagent 协作完成从项目启动到模型部署的全流程。

**核心能力**：
- 📋 **项目规划** - 制定计划、分解任务、评估风险
- 🏗️ **架构设计** - 设计网络、选择Backbone、分析复杂度
- ⚙️ **算法设计** - 设计损失函数、配置优化器、定义评估指标
- 🚀 **性能优化** - 解决显存OOM、加速训练、优化资源
- 📊 **精度调优** - 解决过拟合、应用Bag of Tricks、提升精度
- ✅ **测试评估** - 编写评估脚本、设计测试用例、验证性能
- 📖 **文档编写** - 编写README、API文档、使用教程
- 🔍 **架构搜索** - NAS搜索最优架构、模型压缩
- 💾 **数据工程** - 数据预处理、Dataset开发、DataLoader配置

**何时使用**：
- 开始新的深度学习项目
- 需要训练或优化模型
- 遇到训练问题（OOM、精度不提升、速度慢）
- 需要设计或修改网络架构
- 需要处理或准备数据

---

## 9个专业Agent

### 1. project-planner - 项目规划专家

**职责**：制定项目计划、分解任务、评估风险

**何时委派**：新项目启动、需要制定训练计划、需要分解复杂任务

**委派示例**：
```json
{
  "project_name": "图像分类器",
  "task_description": "训练一个识别10种动物的分类器",
  "requirements": {
    "task_type": "classification",
    "target_accuracy": 0.95
  }
}
```

---

### 2. model-architect - 模型架构设计专家

**职责**：设计网络架构、选择Backbone、分析复杂度

**何时委派**：设计新的网络架构、选择Backbone、分析模型参数量和FLOPs

**输出位置**：`networks/`

**委派示例**：
```json
{
  "task": "classification",
  "input_shape": [3, 224, 224],
  "requirements": {
    "max_params": 25000000,
    "target_fps": 100
  }
}
```

---

### 3. data-engineer - 数据工程专家

**职责**：数据预处理、Dataset开发、DataLoader配置、数据可视化

**何时委派**：数据预处理、开发自定义Dataset、配置DataLoader、数据增强设计、数据质量检查

**输出位置**：`dataset/`, `datalist/`, `util/preprocess_data.py`

**委派示例**：
```json
{
  "task": "prepare_data",
  "data_source": {
    "path": "./data/raw",
    "format": "ImageNet",
    "num_samples": 50000
  },
  "requirements": {
    "batch_size": 32,
    "num_workers": 8,
    "augmentation": true
  }
}
```

---

### 4. algorithm-designer - 算法设计专家

**职责**：设计损失函数、配置优化器、定义评估指标

**何时委派**：设计自定义损失函数、处理类别不平衡、配置学习率策略

**输出位置**：`loss/`, `engine/trainer.py`

**委派示例**：
```json
{
  "task": "classification",
  "problem": "类别不平衡",
  "dataset_info": {
    "class_distribution": [10000, 8000, 5000, 1000]
  }
}
```

---

### 5. performance-tuner - 性能调优专家

**职责**：解决显存OOM、加速训练、优化GPU利用率

**何时委派**：显存OOM错误、训练速度慢、GPU利用率低

**输出位置**：`runner.py`

**委派示例**：
```json
{
  "problem": "oom",
  "error_message": "CUDA out of memory",
  "current_batch_size": 32,
  "gpu_memory_total": 6
}
```

---

### 5. accuracy-tuner - 精度调优专家

**职责**：解决过拟合/欠拟合、应用Bag of Tricks、提升精度

**何时委派**：Loss不下降、过拟合（train >> val）、欠拟合、验证精度停滞

**输出位置**：`options.py`, `configs/`

**委派示例**：
```json
{
  "problem": "overfit",
  "train_acc": 0.95,
  "val_acc": 0.78,
  "epoch": 50
}
```

---

### 7. test-engineer - 测试开发专家

**职责**：编写评估脚本、设计测试用例、验证性能

**何时委派**：实现`eval.py`、计算评估指标、设计测试用例、性能基准测试

**输出位置**：`eval.py`, `tests/`

**委派示例**：
```json
{
  "task": "classification",
  "metrics": ["accuracy", "precision", "recall", "f1"],
  "test_dataset": {
    "num_classes": 1000
  }
}
```

---

### 8. doc-writer - 文档编写专家

**职责**：编写README、API文档、使用教程

**何时委派**：编写项目README、API文档、快速开始指南、项目总结报告

**输出位置**：`README.md`, `docs/`

**委派示例**：
```json
{
  "project_name": "图像分类器",
  "document_type": "readme",
  "content_focus": ["installation", "usage", "training"]
}
```

---

### 9. nas-specialist - 网络架构搜索专家

**职责**：使用NAS搜索最优架构、模型压缩、架构优化

**何时委派**：搜索最优架构、模型压缩、平衡精度和速度、标准架构效果不佳

**委派示例**：
```json
{
  "task": "classification",
  "search_budget": {
    "evaluations": 500,
    "time_limit": 24
  },
  "constraints": {
    "max_params": 25000000
  }
}
```

---

## 完整训练流程

### 阶段1: 项目启动（规划与准备）

**目标**：制定计划、初始化项目结构

**委派**：
1. **project-planner** → 项目计划、任务分解
2. **doc-writer** → 初始README

**交付物**：
- ✅ 项目计划（里程碑、时间线）
- ✅ 任务分解（WBS）
- ✅ 初始项目结构

---

### 阶段2: 数据准备（验证与测试）

**目标**：确保数据质量、验证数据加载

**委派**：
1. 准备数据集（数据收集、清洗、划分）
2. **test-engineer** → 数据验证测试

**交付物**：
- ✅ 干净的数据集
- ✅ 数据加载器
- ✅ 数据验证测试

---

### 阶段3: 模型开发（设计与实现）

**目标**：设计模型、实现训练脚本

**委派**：
1. **model-architect** → 网络架构（`networks/`）
2. **algorithm-designer** → 损失函数、优化器（`runner.py`）
3. **test-engineer** → 单元测试
4. **performance-tuner**（可选）→ 性能优化

**交付物**：
- ✅ 网络架构
- ✅ 损失函数
- ✅ 训练脚本
- ✅ 单元测试

---

### 阶段4: 基线训练与调试

**目标**：训练基线模型、解决训练问题

**流程**：
```bash
# 训练基线模型
python run.py --epochs 50
```

**根据问题委派**：

| 问题 | 委派给 | 方案 |
|------|--------|------|
| 显存OOM | performance-tuner | 混合精度、梯度累积 |
| 训练速度慢 | performance-tuner | 数据加载优化 |
| Loss不下降 | accuracy-tuner | 调整学习率 |
| 过拟合（train >> val） | accuracy-tuner | 数据增强、正则化 |
| 欠拟合（都低） | accuracy-tuner | 增大模型 |

**交付物**：
- ✅ 基线模型
- ✅ 训练日志
- ✅ 问题诊断报告

---

### 阶段5: 模型优化（精度提升）

**目标**：提升模型精度

**方案A: 应用Bag of Tricks**（推荐）
- **委派**：accuracy-tuner
- **技巧**：Cosine LR + Warmup、Label Smoothing、MixUp

**方案B: 架构搜索**（如果方案A效果不佳）
- **委派**：nas-specialist
- **方法**：进化算法、强化学习

**交付物**：
- ✅ 优化后的模型
- ✅ 精度提升报告

---

### 阶段6: 测试与部署

**目标**：完整测试、优化推理、编写文档

**委派**：
1. **test-engineer** → 完整评估报告
2. **performance-tuner** → 推理优化
3. **doc-writer** → 完整文档

**交付物**：
- ✅ 评估报告
- ✅ 推理优化模型
- ✅ 完整文档

---

## 标准项目结构

```
project/
├── doc/                  # 项目文档（doc-writer）
│   ├── README.md         # 项目说明
│   ├── api.md            # API文档
│   └── tutorial.md       # 使用教程
├── plan/                 # 开发计划（project-planner）
│   ├── roadmap.md        # 开发路线图
│   └── tasks.md          # 任务列表
├── config/               # 配置文件（accuracy-tuner）
│   ├── default.yaml      # 默认配置
│   ├── train.yaml        # 训练配置
│   └── test.yaml         # 测试配置
├── script/               # Shell脚本（仅.sh文件）
│   ├── train.sh          # 训练启动脚本
│   ├── eval.sh           # 评估脚本
│   ├── test.sh           # 测试脚本
│   ├── deploy.sh         # 部署脚本
│   └── download_data.sh  # 数据下载脚本
├── model/                # 模型结构（model-architect）
│   ├── __init__.py       # build_model()
│   ├── resnet.py         # ResNet系列
│   └── efficientnet.py   # EfficientNet系列
├── loss/                 # 损失函数（algorithm-designer）
│   ├── __init__.py       # build_loss()
│   ├── focal.py          # Focal Loss
│   └── dice.py           # Dice Loss
├── util/                 # 工具函数和脚本（通用）
│   ├── visualization.py  # 可视化工具
│   ├── logger.py         # 日志工具
│   ├── preprocess_data.py    # 数据预处理脚本
│   ├── visualize.py      # 可视化脚本
│   ├── convert_model.py  # 模型转换脚本
│   ├── download_weights.py  # 下载预训练权重
│   └── check_environment.py # 环境检查脚本
├── engine/               # 训练引擎（algorithm-designer + performance-tuner）
│   ├── trainer.py        # 训练器
│   ├── train.py          # 训练入口
│   ├── test.py           # 测试入口
│   └── benchmark.py      # 性能基准测试
├── datalist/             # 数据列表
│   ├── train.txt         # 训练集列表
│   └── test.txt          # 测试集列表
├── dataset/              # 数据处理（test-engineer）
│   ├── __init__.py       # build_dataloader()
│   ├── loader.py         # Dataset实现
│   ├── transform.py      # 数据增强
│   └── sampler.py        # 采样器
├── metrics/              # 评价指标（test-engineer + algorithm-designer）
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
└── test/                 # 测试代码（test-engineer）
    ├── test_model/       # 模型测试
    ├── test_loss/        # 损失函数测试
    ├── test_dataset/     # 数据集测试
    └── test_metrics/     # 指标测试
```

详细结构说明请参考：`references/project-structure.md`

---

## 快速开始示例

### 示例1: 图像分类项目

```
用户: "我要训练一个图像分类器，识别10种动物"

步骤1: 主会话 → project-planner
  输出: 项目计划

步骤2: 主会话 → model-architect
  输出: ResNet50架构

步骤3: 主会话 → algorithm-designer
  输出: CrossEntropy损失、AdamW优化器

步骤4: 主会话 → 训练基线模型
  python run.py --epochs 50

步骤5: 主会话发现过拟合 → accuracy-tuner
  输出: Label Smoothing + MixUp配置

步骤6: 主会话 → test-engineer
  输出: eval.py评估脚本

步骤7: 主会话 → doc-writer
  输出: 完整README
```

### 示例2: 遇到OOM问题

```
用户: "训练时显存不足，报OOM错误"

主会话 → performance-tuner
输入: {
  "problem": "oom",
  "current_batch_size": 32,
  "gpu_memory_total": 6
}

输出: {
  "solutions": [
    "启用混合精度训练（use_amp: true）",
    "使用梯度累积（gradient_accumulation_steps: 4）"
  ]
}

主会话应用方案 → 训练成功
```

更多示例请参考：`references/usage-examples.md`

---

## Agent协作关系

```
project-planner (规划)
    ↓
    ├─→ model-architect (架构)
    │       ↓
    │   algorithm-designer (算法)
    │       ↓
    │   test-engineer (测试)
    │       ↓
    └─→ 训练阶段
            ↓
        if 问题 → performance-tuner (性能)
                → accuracy-tuner (精度)
            ↓
        if 需要优化 → nas-specialist (架构搜索)
            ↓
        test-engineer (评估)
            ↓
        doc-writer (文档)
```

---

## 核心文件模板

基础模板（详细模板请参考 `references/code-templates.md`）：

### options.py
```python
class Options:
    def __init__(self):
        self.parser = argparse.ArgumentParser()
        self.parser.add_argument('--model', default='resnet50')
        self.parser.add_argument('--lr', type=float, default=0.001)
```

### run.py
```python
from options import Options
from runner import Runner

if __name__ == '__main__':
    opts = Options().parse()
    trainer = Runner(opts)
    trainer.train()
```

### runner.py
```python
class Runner:
    def __init__(self, opts):
        self.model = build_model(opts)
        self.optimizer = Adam(self.model.parameters(), lr=opts.lr)
    
    def compute_loss(self, pred, gt):
        # 由 algorithm-designer 提供
        return F.cross_entropy(pred, gt)
```

---

## 注意事项

### ✅ 必须做

1. **按流程委派** - 按照阶段顺序委派任务
2. **验证输出** - 检查每个agent的输出是否符合预期
3. **记录实验** - 使用git记录每次修改
4. **测试验证** - 修改后必须测试

### ❌ 禁止做

1. **不要跳过阶段** - 每个阶段都很重要
2. **不要同时调多个agent** - 一次解决一个问题
3. **不要忽视错误** - 及时处理训练错误
4. **不要过度优化** - 先保证基线可用

---

## 故障排查

| 问题 | 委派给 | 解决方案 |
|------|--------|----------|
| 显存OOM | performance-tuner | 混合精度、梯度累积 |
| 训练慢 | performance-tuner | 数据加载优化 |
| Loss不下降 | accuracy-tuner | 调整学习率 |
| 过拟合 | accuracy-tuner | 数据增强、正则化 |
| 欠拟合 | accuracy-tuner | 增大模型 |
| 精度不够 | accuracy-tuner / nas-specialist | Bag of Tricks / 架构搜索 |

详细故障排查指南：`references/troubleshooting.md`

---

## 参考资料

- `references/project-structure.md` - 项目结构详解
- `references/code-templates.md` - 代码模板
- `references/usage-examples.md` - 使用示例
- `references/troubleshooting.md` - 故障排查
- `references/training-tricks.md` - Bag of Tricks训练技巧
- `references/performance-guide.md` - 性能优化指南
- `references/nas-methods.md` - 网络架构搜索方法

---

## 总结

本 skill 通过 8 个专业 agent 协作，提供完整的 ML 训练流程支持：

- **规划阶段**: project-planner
- **开发阶段**: model-architect + algorithm-designer + test-engineer
- **训练阶段**: performance-tuner + accuracy-tuner
- **优化阶段**: accuracy-tuner + nas-specialist
- **部署阶段**: test-engineer + doc-writer

每个 agent 都有明确的职责和触发时机，确保任务委派准确、高效。
