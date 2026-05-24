# Seeing Together: Multi-Robot Cooperative Egocentric Spatial Reasoning with Multimodal Large Language Models

**日期**: 2026-05-18 | **arXiv**: 2605.18431 | **领域**: Multi-Robot, Spatial Reasoning, MLLM, Cooperative Perception

## 核心问题
MLLM在自我中心视频理解方面取得进展，但从多个具身视角**协作推理**的能力几乎未被探索。

## 核心方法
提出了**多机器人协作动态空间推理**问题和CoopSR基准：

1. **CoopSR Benchmark**: 首个多机器人协作空间推理基准，19种QA类型，4个难度层级
2. **EgoTeam Dataset**: 114,227个QA对，覆盖Habitat/iGibson仿真+真实四足机器人
3. **SP-CoR Framework**:
   - **Spectral Energy-aware Multi-Robot Frame Sampler (SE-MR²FS)**: 训练无关的两阶段帧采样
   - **Spectral & Physics-Informed Fusion**: 物理先验注入注意力融合
   - **Pose-aware Prompt Distillation**: 训练时用姿态信息，推理时仅需视频

## 关键创新
- **四级QA分类**: T1(自我中心空间)→T2(成对关系)→T3(场景组合+动作)→T4(多机器人动态推理)
- **跨机器人视角对齐**: 显式建模agent身份、几何共视、多机器人视角融合
- **Sim-to-Real验证**: 真实四足机器人测试集2,326 QA
- **22个MLLM基线**: 迄今最全面的MLLM空间推理评估

## 实验结果
- SP-CoR在Habitat上70.55%（+3.87%），iGibson上70.82%（+7.12%）
- 跨团队规模和sim-to-real泛化能力优越

## Spatial AGI关联性分析
**极高关联性**: 这篇论文直接定义和研究了Spatial AGI中的**多智能体空间推理**：

- **分布式空间理解**: 多个具身agent从不同视角协作构建共享空间理解——这是群体空间智能的基础
- **空间关系推理**: 19种QA类型全面覆盖了空间推理的各个维度（位置、距离、方向、可见性、遮挡、动作）
- **跨视角物体接地**: 在不同机器人视角之间识别同一物体，是空间一致性的核心
- **团队信念更新**: 从新观察更新团队级别的空间信念，对应分布式空间认知

**核心启示**: 
1. Spatial AGI不仅需要单agent空间智能，还需要**多agent协作空间推理**
2. 当前的MLLM在多机器人空间推理上表现不佳，说明空间理解的"瓶颈"在于跨视角融合和几何推理，而非单视角感知
3. 物理先验（姿态、运动）对空间推理至关重要，但应该在训练时使用，推理时蒸馏

## 局限性
- 依赖仿真器生成的QA，可能不够自然
- 仅评估VQA而非实际机器人控制
- SP-CoR的物理先验蒸馏在真实环境中的鲁棒性待验证

**评分**: ⭐⭐⭐⭐⭐ (5/5) — 开创性地定义了多智能体空间推理问题，对Spatial AGI的多agent协作方向有奠基意义
