# Robo-Cortex: A Self-Evolving Embodied Agent via Dual-Grain Cognitive Memory and Autonomous Knowledge Induction

**日期**: 2026-05-18 | **arXiv**: 2605.18729 | **领域**: Embodied Navigation, Self-Evolving Agent, Cognitive Memory

## 核心问题
具身导航agent存在**经验遗忘(experiential amnesia)**——无法将过去的交互转化为可复用的决策知识，经验只产生弱且局部的行为改进。

## 核心方法
Robo-Cortex提出了**自我进化**的具身导航框架，通过反思-适应循环持续将经验转化为可迁移启发式：

1. **Imagine-then-Verify Planning**: 短视界闭环规划——世界模型想象候选动作的未来结果，VLM评估器选择最优
2. **Dual-Grain Cognitive Memory**:
   - **Short-term Reflective Memory (SRM)**: 滑动窗口捕获局部进展、失败模式、子目标上下文
   - **Long-term Principle Memory (LPM)**: 跨episode抽象成功/失败轨迹为引导/警示原则
3. **Autonomous Knowledge Induction (AKI)**: 从积累经验中蒸馏可复用导航启发式，形成Navigation Heuristic Library

## 关键创新
- **Structured Memory Graph**: 节点包含root(episode)、trajectory(决策步)、subtask(语义单元)三层
- **Goal-wise Consolidation**: 优先存储成功短轨迹，失败时保留多样化失败轨迹
- **Heuristic Merger**: 跨episode合并相似启发式，从孤立经验到紧凑行为知识
- **静态(Robo-Cortex) vs 自适应(Robo-Cortex++)**: 区分框架内在强度和持续进化的额外收益

## 实验结果
- IGNav SR: 45.07% (Robo-Cortex++) vs 38.57% (World-In-World)
- 三项任务(IGNav/AR/AEQA)全面超越基线
- 真实世界机器人部署验证

## Spatial AGI关联性分析
**极高关联性**: Robo-Cortex直接解决了Spatial AGI的核心挑战——**如何从空间经验中持续学习和进化**：

- **认知记忆架构**: 双粒度记忆（短期反思+长期原则）直接对应人类空间认知中的工作记忆和长期记忆
- **空间经验抽象**: AKI将多模态交互经验抽象为可迁移导航启发式，这是空间智能从具体到抽象的关键一步
- **自我进化循环**: 交互→反思→抽象→适应的循环，模拟了人类空间认知的进化过程
- **World Model用于空间想象**: Imagine-then-Verify中的世界模型扮演了"空间心理模拟"的角色

**核心启示**: Spatial AGI不仅需要空间感知和推理，还需要**从空间经验中提取可迁移知识**的能力。Robo-Cortex的AKI机制提供了一个可行的框架。

## 局限性
- 基于LLM/VLM，推理延迟高
- 依赖GPT-4o等大模型做评估和反思
- 启发式库的可解释性和可控性有限

**评分**: ⭐⭐⭐⭐⭐ (5/5) — 对Spatial AGI最具启发性的工作，自我进化+认知记忆直接对应空间智能的核心需求
