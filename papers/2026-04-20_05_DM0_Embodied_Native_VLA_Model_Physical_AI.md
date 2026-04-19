# DM0: An Embodied-Native Vision-Language-Action Model towards Physical AI

**发表日期**: 2026-02-16
**arXiv链接**: https://arxiv.org/abs/2602.14974
**HTML版本**: https://arxiv.org/html/2602.14974v1
**作者**: DexMatic AI Team
**代码**: https://github.com/dexmal/Dexbotic-RoboChallengeInference

## 核心问题

### Q1: 核心算法原理

**问题**: 这篇文章的核心算法原理是什么？

**分析**:

1. **核心思想和动机**

DM0提出**"Embodied-Native"**理念——不同于传统"先在互联网数据预训练再微调"的范式，DM0从预训练阶段就将具身数据作为一等公民，同时学习语义知识和物理先验。

核心论点：互联网数据提供语义知识但缺乏物理交互的动态、连续和空间特性。真正通用的机器人需要"天生具身"的框架。

2. **三阶段训练管线**

**Stage 1 - Pretraining (1.13T tokens)**
- 统一预训练：web文本 + 自动驾驶 + 具身交互数据
- 目标：同时获得语义知识和物理先验（空间关系、物理动态）
- 基于Qwen3-1.7B + PE感知编码器

**Stage 2 - Mid-Training (200M samples)**
- 在VLM上构建Flow Matching动作专家
- **混合梯度策略(Knowledge Insulation)**：具身数据的动作梯度不回传到VLM，保护语义知识；VLM在非具身数据上继续更新
- 引入**Embodied Spatial Scaffolding**: 空间CoT推理

**Stage 3 - Post-Training (50M samples)**
- 收窄到目标具身形式，精调 visuomotor 对齐

3. **Embodied Spatial Scaffolding**

这是DM0最独特的创新——层次化预测框架，作为空间思维链(Spatial CoT):

```
(i)  子任务预测 → 任务分解为可解释步骤
(ii) 目标边界框预测 → 定位目标物体
(iii) 末端执行器轨迹预测 → 预测未来运动路径
(iv) 离散动作预测 → 量化控制命令
```

每个中间目标充当**结构化信息瓶颈**，从高层语义到空间定位再到低层控制，逐步约束假设空间。

4. **模型架构**

- **VLM**: Qwen3-1.7B + PE感知编码器
- **动作专家**: Flow Matching，基于VLM的KV cache生成连续动作
- **双模式推理**: 直接动作预测 或 先推理后动作

### Q2: 与Spatial AGI的关系

**分析**:

1. **空间理解维度**

DM0的Embodied Spatial Scaffolding直接体现了**结构化空间推理**:

- **空间定位**: 目标边界框预测要求模型理解物体在图像空间中的位置
- **空间路径规划**: 末端执行器轨迹预测要求理解3D空间中的运动路径
- **空间分解**: 子任务预测涉及将空间操作分解为步骤
- **空间→动作**: 离散动作预测将空间理解转化为控制信号

2. **对Spatial AGI的启发**

- **具身原生的空间理解**: 空间智能不应是后加的微调，而应从训练之初就融入
- **层次化空间推理**: 空间CoT从高层语义到低层控制的渐进式推理是空间智能的关键模式
- **混合数据预训练**: 自动驾驶数据、具身数据和web数据的混合提供了互补的空间先验
- **Knowledge Insulation**: 保护通用知识的同时学习具身技能——空间理解不应以牺牲语义为代价

### Q3: 创新点和局限性

1. **主要创新点**

- ✅ **Embodied-Native范式**: 从预训练开始就融入具身数据
- ✅ **三阶段训练**: Pre→Mid→Post，从通用到专用
- ✅ **Embodied Spatial Scaffolding**: 空间CoT推理，层次化约束动作空间
- ✅ **Knowledge Insulation**: 混合梯度策略保护语义知识
- ✅ **强实验结果**: RoboChallenge Table30上Specialist 62.0%，超GigaBrain 10%+

2. **主要局限性**

- ❌ **模型较小(2B)**: 可能限制更复杂的空间推理
- ❌ **仅限桌面操作**: 未涉及导航和移动操作
- ❌ **空间推理是隐式的**: 没有显式的3D空间表示（如3DGS）
- ❌ **复杂训练管线**: 三阶段+混合数据+多种监督，工程成本高

3. **与StarVLA-α的对比**

| 维度 | DM0 | StarVLA-α |
|------|-----|-----------|
| 范式 | Embodied-Native | Minimal-Sufficiency |
| 架构 | VLM + Flow Matching + CoT | VLM + MLP |
| 预训练 | 混合(web+驾驶+具身) | 仅VLM预训练 |
| 复杂度 | 高（三阶段） | 低 |
| 结果 | Specialist 62.0% | Generalist 57.3% |

DM0在specialist设定下更强，但架构复杂度远高于StarVLA-α。

## 核心技术发现

- **发现1**: 具身数据从预训练阶段融入可以提供关键的物理先验
- **发现2**: 空间CoT（子任务→边界框→轨迹→动作）有效约束动作解空间
- **发现3**: Knowledge Insulation策略成功平衡语义保持和动作学习
- **发现4**: 2B参数的embodied-native模型可以超越4-5B的internet-native模型
- **发现5**: 自动驾驶数据提供了有价值的空间先验

## 与Spatial AGI的关系

### 直接贡献

DM0为Spatial AGI提供了**Embodied-Native**的训练范式——从训练之初就将空间交互数据作为核心。Embodied Spatial Scaffolding展示了如何将空间推理结构化为思维链。

### 技术启发

1. 空间智能应该是"原生"的而非后加的
2. 层次化空间推理（语义→定位→路径→控制）是有效的空间认知模式
3. 混合数据预训练可以提供互补的空间先验
4. 保护通用知识的同时学习空间技能需要专门的设计

## 个人思考

### 最令人兴奋的发现

Embodied Spatial Scaffolding——将空间推理显式化为层次化的预测任务。这不仅是训练技巧，而是给出了空间认知的一种结构化模型：理解意图→定位目标→规划路径→执行动作。

### 潜在局限

DM0的空间推理是隐式的（通过语言/边界框/轨迹），没有显式的3D空间表示。结合GlobalSplat等显式3D表示可能是更强的方案。

### 与今日其他论文的关联

- 与StarVLA-α形成有趣对比：DM0用复杂设计超越简单基线，但StarVLA-α证明简单也够用
- 与WARPED互补：WARPED用3DGS做数据增强，DM0用结构化推理做策略学习
- DM0的空间CoT概念可以与GlobalSplat的全局场景标记结合

## 关键数据

- **模型**: Qwen3-1.7B + PE + Flow Matching Action Expert
- **预训练**: 1.13T tokens, 370K steps, 8192 batch
- **Mid-Training**: 200M samples, 64×H20 GPUs
- **RoboChallenge Specialist**: 62.0% (30任务平均)
- **RoboChallenge Generalist**: 37.3% success rate
- **超越**: GigaBrain-0.1 (+10.3%), Spirit-v1.5 (+11%), π0.5 (+19.3%)

## 总结

DM0通过Embodied-Native范式——从预训练开始融入多源具身数据——实现了Physical AI的重要进步。Embodied Spatial Scaffolding将空间推理结构化为层次化CoT，有效约束动作空间。对Spatial AGI而言，这展示了"空间智能应从训练之初就融入"的理念，以及层次化空间推理的有效性。

---

**文档创建时间**: 2026-04-20
