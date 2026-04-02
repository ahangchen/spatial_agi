# DLWM: Dual Latent World Models for Holistic Gaussian-centric Pre-training in Autonomous Driving

**Paper ID**: arXiv:2604.00969
**Date**: 2026-04-03
**Authors**: Yiyao Zhu*, Ying Xue* et al. (HKUST, CUHK-SZ, Huawei)
**Link**: https://arxiv.org/abs/2604.00969
**Venue**: CVPR 2026

---

## 一句话总结
DLWM 提出双隐式世界模型预训练范式，统一了自动驾驶中 Gaussian-centric 的3D占用感知、4D占用预测和运动规划三大任务的预训练。

## 核心问题
Gaussian-centric 表示在自动驾驶中展现了巨大潜力，但：
1. 依赖大量人工标注，阻碍可扩展部署
2. 缺乏专门针对 Gaussian-centric 全生命周期的自监督预训练策略
3. 现有隐式世界模型仅用于运动规划，未探索感知和预测任务

## 方法概述

### 两阶段预训练

**Stage 1: Gaussian 表示学习**
- 从多视角图像预测3D Gaussians
- 通过自监督重建多视角语义和深度图像
- 语义标签由 Grounded SAM 自动生成（无人工标注）
- 深度监督来自 LiDAR + Metric3D 伪深度
- 损失：$\mathcal{L}_{rec} = \omega_1\mathcal{L}_d + \omega_2\mathcal{L}_{pd} + \omega_3\mathcal{L}_{sem}$

**Stage 2: 双隐式世界模型**

**(a) Gaussian-flow-guided 隐式世界模型**（面向感知和预测任务）
- 预测每个 Gaussian 的局部动态位移（Gaussian Flow）
- 通过自车运动对齐将当前帧传播到未来帧：
  $\mu_k^{t+1} = \mathbf{T}_{ego}^{t \to t+1}(\mu_k^t + \Delta\mu_k^t)$
- BEV光栅化得到隐式预测
- L2 损失监督预测的 BEV 特征与冻结感知模块提取的GT特征

**(b) Ego-planning-guided 隐式世界模型**（面向运动规划）
- 基于预测的自车轨迹条件化未来场景预测
- 联合优化时序 Gaussian-centric 表示和自车轨迹规划

### 关键设计决策
- **BEV 作为隐式表示**：Gaussian query 缺乏帧间一一对应（排列等价性），BEV光栅化保留了区域对应关系
- **双世界模型分离**：感知/预测和规划使用不同的隐式世界模型，因为任务需求不同

## 实验结果

### 定量改进（vs 无预训练）
- **3D占用感知**: +1.02 mIoU (SurroundOcc)
- **4D占用预测**: +2.68 mIoU
- **运动规划**: -16% L2误差 (nuScenes)

### 关键发现
- 在 SurroundOcc 和 nuScenes 上均达到 SOTA
- Stage 1 预训练为 Stage 2 提供了关键的几何和语义基础
- 双世界模型比单一世界模型更有效

## 关键洞察

### 对 Spatial AGI 的意义

1. **预训练是可扩展3D理解的关键**：通过自监督学习 Gaussian 表示，摆脱了对昂贵3D标注的依赖。这一范式可推广到更广泛的 Spatial AGI 任务。

2. **Gaussian Flow 的物理含义**：预测每个 Gaussian 的运动向量本质上是在3D场景中建立时空对应关系——这是理解物理世界动态的基础能力。

3. **BEV 作为通用隐式空间**：将3D Gaussian 的排列等价查询映射到有序的 BEV 网格，巧妙解决了帧间监督的难题。

4. **双世界模型的任务特化**：不同下游任务需要不同的时空建模方式，单一世界模型难以兼顾。

### 局限性

1. 仍需 LiDAR 深度作为 Stage 1 监督
2. Gaussian flow 假设物体运动是局部线性的
3. 推理时的计算开销未详细讨论

## 个人思考

DLWM 是将 Gaussian-centric 表示从"感知工具"提升为"世界建模基础"的重要一步。其双世界模型设计反映了一个深刻洞察：**感知和规划需要不同粒度的时空表示**。

与 EgoSim 的可更新3D场景状态相比，DLWM 更关注如何在自动驾驶场景中学习可迁移的 Gaussian 表示。两者的结合方向很有想象空间——如果 DLWM 的预训练范式能用于 EgoSim 的场景理解，可能进一步提升世界模拟的质量。

华为作为工业界参与，表明 Gaussian-centric 预训练正在从学术探索走向产业落地。

---

## 关键词
`自动驾驶` `Gaussian-centric` `世界模型` `预训练` `3D占用` `Gaussian Flow` `BEV` `CVPR2026`
