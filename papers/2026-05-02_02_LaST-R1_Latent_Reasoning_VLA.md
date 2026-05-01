# LaST-R1: Reinforcing Action via Adaptive Physical Latent Reasoning for VLA Models

**Date**: 2026-05-02 | **arXiv**: [2604.28192](https://arxiv.org/abs/2604.28192) | **Published**: 2026-04-30
**Authors**: Hao Chen, Jiaming Liu, Zhonghao Yan, Nuowei Han, Renrui Zhang, Chenyang Gu, Jialin Gao, Ziyu Guo, Siyuan Qian, Yinxi Wang, Peng Jia, Chi-Wing Fu, Shanghang Zhang, Pheng-Ann Heng
**Affiliations**: HKU, ByteDance, CAS

## 一句话总结
LaST-R1 提出了一种统一的 VLA 框架，将潜在 Chain-of-Thought 物理推理与动作生成交织，并设计了 LAPO（Latent-to-Action Policy Optimization）算法联合优化推理过程和动作输出，在 LIBERO 上达到 99.8% 成功率。

## 核心问题
现有 VLA 模型的推理机制存在三大限制：
1. **显式语言推理**（如 SayCan-style）存在延迟和离散化问题
2. **连续潜在推理**虽更高效，但仍局限于静态模仿学习，泛化能力差
3. **在线 RL 方法**仅优化 vanilla action space，忽略了底层的物理推理过程

## 方法架构

### 潜在 CoT 推理（Latent Chain-of-Thought）
- 在动作执行前，模型在潜在空间中进行多步物理动力学推理
- **自适应推理深度**：根据环境复杂度动态调整推理步数（简单任务少步，复杂任务多步）
- 推理 token 携带关于物体状态、空间关系、物理约束的连续表示

### LAPO（Latent-to-Action Policy Optimization）
- **核心创新**：联合优化潜在推理链和动作生成的 RL 算法
- 不仅优化最终动作，还优化推理过程中的物理世界模型表示
- 桥接"推理"与"控制"，提升物理世界建模的表征质量

### 训练流程
1. **Warm-up 阶段**：one-shot 监督学习初始化策略
2. **LAPO 后训练**：在线 RL 优化，联合更新推理链和动作头

## 关键结果

### LIBERO 基准
- **99.8% 平均成功率**（仅 one-shot warm-up）
- 显著超越 prior SOTA 方法的收敛速度和最终性能

### 真实世界部署
- LAPO 后训练相比初始 warm-up 策略提升 **44%**
- 覆盖单臂和双臂设置共 4 个复杂任务
- 展现出跨仿真和真实环境的强泛化能力

## Spatial AGI 相关性分析

### 与空间智能的联系
1. **潜在空间中的物理推理**：LaST-R1 的 CoT 推理本质是在潜在空间中模拟物理动力学——这是空间智能从感知到推理的关键能力
2. **自适应推理深度**：空间推理的复杂度应随任务动态调整，这反映了人类空间认知的特征
3. **推理-行动统一优化**：打破了"先感知再行动"的线性范式，实现了推理和行动的端到端学习

### 对 Spatial AGI 的启示
- **潜在推理是空间 AGI 的核心组件**：不是通过显式语言描述空间关系，而是在连续空间中进行隐式推理
- **RL 优化推理过程**：传统方法只优化动作，LaST-R1 表明优化"如何思考空间"同样重要
- **Few-shot + RL 范式**：one-shot warm-up + 在线 RL 可能是空间 AGI 高效学习的范式

### 局限性
- 自适应推理深度的上限和计算开销未详细讨论
- 潜在推理的可解释性较差，难以 debug 空间推理错误
- 仅在桌面级操作任务上验证，未测试导航或大规模场景

## 思考与问题
- 潜在推理 token 是否编码了可解释的空间概念（如"在...上方"、"靠近"）？
- LAPO 是否可以扩展到包含视觉反馈的闭环推理？
- 自适应推理深度与任务复杂度的对应关系是否可以量化？
- 潜在推理与显式 3D 表示（如 NeRF/3DGS）的结合是否有价值？

## 关键引用
- LIBERO benchmark (Liu et al.)
- VLA models with reasoning mechanisms
- Online RL for VLA post-training
