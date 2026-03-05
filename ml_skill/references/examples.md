# 使用示例

ml-skill的实际使用示例和代码片段。

## 目录

1. [单subagent调用](#单subagent调用)
2. [多subagent协作](#多subagent协作)
3. [完整项目流程](#完整项目流程)
4. [常见问题解决](#常见问题解决)

---

## 单subagent调用

### 性能优化示例

```python
# 调用 performance-tuner
from sessions_spawn import spawn

result = spawn(
    runtime="acp",
    agentId="performance-tuner",
    task="""
    优化3D点云模型训练性能：
    - 当前配置：batch_size=16, 显存占用15.8GB/16GB
    - 目标：batch_size=64
    - 硬件：8xV100
    - 模型：SparseConvNet, 参数量12M
    
    请给出详细的优化方案和代码修改。
    """,
    cwd="/home/cwh/coding/former3d"
)
```

### 效果调优示例

```python
# 调用 accuracy-tuner
result = spawn(
    runtime="acp",
    agentId="accuracy-tuner",
    task="""
    模型训练问题诊断：
    - 任务：3D目标检测
    - 当前精度：mAP@0.5 = 62%
    - 目标精度：mAP@0.5 = 70%
    - 训练配置：
      * backbone: ResNet50
      * lr: 0.001, CosineLR
      * batch_size: 32
      * epochs: 100 (当前在第50epoch)
    
    训练曲线显示第30epoch后验证集精度不再提升。
    请分析问题原因并给出调优方案。
    """,
    cwd="/home/cwh/coding/3d-detection"
)
```

### 模型设计示例

```python
# 调用 model-architect
result = spawn(
    runtime="acp",
    agentId="model-architect",
    task="""
    设计轻量级3D特征提取网络：
    - 输入：体素网格 32x32x24
    - 输出：256维全局特征
    - 约束：
      * 参数量 < 5M
      * FLOPs < 1G
      * 延迟 < 20ms (Xavier NX)
    
    请给出完整的网络架构设计和PyTorch实现。
    """,
    cwd="/home/cwh/coding/lightweight-3d"
)
```

---

## 多subagent协作

### 顺序协作

```python
# 1. 先调用 project-planner 制定计划
plan = spawn(
    runtime="acp",
    agentId="project-planner",
    task="制定3D点云分割项目计划，2人月，包含数据、训练、测试",
    cwd="/home/cwh/coding/segmentation"
)

# 2. 根据计划调用 model-architect
model = spawn(
    runtime="acp",
    agentId="model-architect",
    task="基于项目计划设计3D分割网络架构",
    cwd="/home/cwh/coding/segmentation"
)

# 3. 调用 algorithm-designer 设计损失函数
loss = spawn(
    runtime="acp",
    agentId="algorithm-designer",
    task="设计3D分割损失函数，处理类别不平衡",
    cwd="/home/cwh/coding/segmentation"
)

# 4. 调用 test-engineer 编写测试
test = spawn(
    runtime="acp",
    agentId="test-engineer",
    task="为模型和损失函数编写单元测试",
    cwd="/home/cwh/coding/segmentation"
)
```

### 并行协作

```python
# 并行调用多个subagent
import concurrent.futures

tasks = [
    {
        "agentId": "performance-tuner",
        "task": "优化显存使用，目标batch_size=64"
    },
    {
        "agentId": "accuracy-tuner",
        "task": "调优学习率和正则化参数"
    },
    {
        "agentId": "test-engineer",
        "task": "编写性能基准测试"
    }
]

with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(executor.map(
        lambda t: spawn(runtime="acp", agentId=t["agentId"], task=t["task"], cwd=cwd),
        tasks
    ))
```

---

## 完整项目流程

### 新项目启动

```python
# 阶段1: 规划
plan_result = spawn(
    runtime="acp",
    agentId="project-planner",
    task="""
    新项目规划：
    - 目标：3D点云语义分割
    - 数据集：SemanticKITTI
    - 团队：2人
    - 周期：2个月
    - 硬件：4xV100
    
    请制定详细的项目计划，包括：
    1. 阶段划分和里程碑
    2. 技术选型建议
    3. 风险评估
    4. 资源需求
    """,
    cwd="/home/cwh/coding/new-project"
)

# 阶段2: 模型设计
model_result = spawn(
    runtime="acp",
    agentId="model-architect",
    task="""
    基于项目计划设计模型架构：
    - 输入：激光雷达点云
    - 输出：每点语义标签 (20类)
    - 约束：
      * 实时性：<100ms/frame
      * 精度：mIoU > 60%
    
    请设计网络架构并给出PyTorch实现。
    """,
    cwd="/home/cwh/coding/new-project"
)

# 阶段3: 算法设计
algo_result = spawn(
    runtime="acp",
    agentId="algorithm-designer",
    task="""
    设计训练算法：
    - 损失函数：处理类别不平衡
    - 优化器：选择并配置
    - 学习率调度：warmup + decay
    - 数据增强：点云专用
    
    请给出完整的训练配置和代码实现。
    """,
    cwd="/home/cwh/coding/new-project"
)

# 阶段4: 测试
test_result = spawn(
    runtime="acp",
    agentId="test-engineer",
    task="""
    编写完整测试套件：
    - 模型forward测试
    - 损失函数梯度测试
    - 数据加载测试
    - 训练循环集成测试
    """,
    cwd="/home/cwh/coding/new-project"
)

# 阶段5: 文档
doc_result = spawn(
    runtime="acp",
    agentId="doc-writer",
    task="""
    编写项目文档：
    - README.md
    - API文档
    - 训练使用说明
    - 性能基准报告模板
    """,
    cwd="/home/cwh/coding/new-project"
)
```

### 问题诊断流程

```python
# 场景：训练出现问题，需要诊断

# 步骤1: performance-tuner 检查性能问题
perf = spawn(
    runtime="acp",
    agentId="performance-tuner",
    task="分析训练慢的原因，1epoch需要2小时，GPU利用率60%",
    cwd="/home/cwh/coding/project"
)

# 步骤2: accuracy-tuner 检查效果问题
acc = spawn(
    runtime="acp",
    agentId="accuracy-tuner",
    task="诊断训练loss不下降的问题，当前loss=2.3不变",
    cwd="/home/cwh/coding/project"
)

# 步骤3: 综合两个subagent的建议进行修复
```

---

## 常见问题解决

### 问题1: 显存不足

```python
result = spawn(
    runtime="acp",
    agentId="performance-tuner",
    task="""
    显存优化紧急需求：
    - 当前：batch_size=8, 显存15GB/16GB
    - 目标：batch_size=32
    - 模型：Transformer, 参数量85M
    
    请给出立即可用的优化方案，按实施难度排序。
    """,
    cwd="/home/cwh/coding/vit"
)

# 预期输出：
# 1. 启用混合精度 (5分钟)
# 2. 梯度累积 (10分钟)
# 3. Gradient Checkpointing (30分钟)
# 4. 模型并行 (2小时)
```

### 问题2: 精度不提升

```python
result = spawn(
    runtime="acp",
    agentId="accuracy-tuner",
    task="""
    精度调优：
    - 当前：验证集mAP=55%
    - 目标：mAP=65%
    - 已尝试：调整学习率、增加epoch
    
    请系统性地分析问题并给出调优方案。
    """,
    cwd="/home/cwh/coding/detection"
)

# 预期输出包含：
# 1. 数据质量检查
# 2. 模型容量分析
# 3. 超参数搜索建议
# 4. 数据增强方案
```

### 问题3: 需要快速原型

```python
result = spawn(
    runtime="acp",
    agentId="model-architect",
    task="""
    快速原型设计：
    - 任务：图像分类
    - 数据集：CIFAR-10
    - 时间：1天内出结果
    
    请推荐现成的模型架构和训练配置，能直接运行。
    """,
    cwd="/home/cwh/coding/quick-prototype"
)

# 预期输出：
# - 使用Pretrained ResNet18
# - 标准训练配置
# - 可直接运行的代码
```

---

## 代码模板

### 调用函数封装

```python
def call_subagent(agent_id: str, task: str, cwd: str = None):
    """调用subagent的封装函数"""
    from sessions_spawn import spawn
    
    result = spawn(
        runtime="acp",
        agentId=agent_id,
        task=task,
        cwd=cwd or "/home/cwh/coding"
    )
    return result

# 使用示例
performance_tuner = lambda task: call_subagent("performance-tuner", task)
accuracy_tuner = lambda task: call_subagent("accuracy-tuner", task)

# 调用
result = performance_tuner("优化显存，batch_size从16提升到64")
```

### 批量调用

```python
def batch_call(tasks: list):
    """批量调用subagents"""
    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    results = {}
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(
                spawn,
                runtime="acp",
                agentId=t["agentId"],
                task=t["task"],
                cwd=t.get("cwd")
            ): t["agentId"]
            for t in tasks
        }
        
        for future in as_completed(futures):
            agent_id = futures[future]
            results[agent_id] = future.result()
    
    return results

# 使用示例
tasks = [
    {"agentId": "performance-tuner", "task": "优化显存"},
    {"agentId": "accuracy-tuner", "task": "调优超参数"},
    {"agentId": "test-engineer", "task": "编写测试"},
]
results = batch_call(tasks)
```

---

## 最佳实践

1. **明确任务描述** - 包含当前状态、目标、约束条件
2. **提供上下文** - 模型信息、硬件配置、当前配置
3. **指定输出格式** - 需要代码、配置还是建议
4. **迭代优化** - 根据输出结果进一步追问
5. **记录决策** - 将subagent的建议记录到文档
