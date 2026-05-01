# 3D Generation for Embodied AI and Robotic Simulation: A Survey

**Date**: 2026-05-02 | **arXiv**: [2604.26509](https://arxiv.org/abs/2604.26509) | **Published**: 2026-04-29
**Authors**: Tianwei Ye, Yifan Mao, Minwen Liao, Jian Liu, Chunchao Guo, Dazhao Du, Quanxin Shou, Fangqi Zhu, Song Guo
**Project**: https://3dgen4robot.github.io

## 一句话总结
首个系统综述 3D 生成在 Embodied AI 中的应用，围绕数据生成、仿真环境和 Sim2Real 桥接三个角色组织文献，指出领域正从视觉真实感转向交互就绪。

## 核心问题
Embodied AI 对 3D 内容的需求远超视觉真实感：
- 生成的物体需携带**运动学结构和材料属性**
- 场景需支持**交互和任务执行**
- 内容需桥接**仿真与现实**的鸿沟

## 文献组织框架

### 1. Data Generator（数据生成器）
- 生成仿真就绪的物体和资产
- 包括铰接体（articulated）、物理基础和可变形内容
- 为下游交互任务提供训练数据

### 2. Simulation Environments（仿真环境）
- 构建交互式、面向任务的虚拟世界
- 涵盖结构感知、可控和 agentic 场景生成
- 支持任务规划、导航、操作等下游应用

### 3. Sim2Real Bridge（仿真到现实桥接）
- 数字孪生重建
- 数据增强
- 合成演示用于机器人学习和真实世界迁移

## 领域趋势分析

### 从视觉真实感 → 交互就绪
领域正在发生根本性转变：
- **过去**：追求渲染质量（PSNR, SSIM）
- **现在**：追求物理有效性、可交互性、任务相关性
- **未来**：物理标注丰富的交互式 3D 资产

### 关键瓶颈
1. **物理标注稀缺**：大部分 3D 资产缺乏物理属性（质量、摩擦系数、弹性等）
2. **几何质量 ≠ 物理有效性**：视觉上好的几何体不一定满足物理约束
3. **评估碎片化**：缺乏统一的物理有效性评估标准
4. **Sim2Real 鸿沟持续存在**：渲染域迁移、动力学差异仍未解决

## Spatial AGI 相关性分析

### 与空间智能的联系
1. **3D 生成 = Spatial AGI 的数据基础设施**：Spatial AGI 需要大量多样化的 3D 数据来训练和评估
2. **交互就绪的 3D = Spatial AGI 的训练场**：不只是"看起来对"，还要"行为对"
3. **Sim2Real = Spatial AGI 落地路径**：从虚拟空间智能到真实空间智能的迁移

### 对 Spatial AGI 的启示
- **物理属性生成**是下一个前沿：当前 3D 生成主要关注外观，但 Spatial AGI 需要理解"推一下会怎样"
- **评估标准需革新**：需要任务驱动的评估（能否完成操作？）而非像素驱动的评估
- **合成数据的规模化**：自动化 3D 资产生成是解决数据瓶颈的关键路径

### 局限性（综述本身的）
- 作为综述，缺乏对具体技术细节的深入分析
- 主要关注物体和场景级生成，较少涉及动态/交互式生成
- 对语言条件/指令驱动的 3D 生成讨论不足

## 思考与问题
- 3D 生成能否从"资产生产"走向"世界模拟"？即自动生成物理有效、可交互的完整世界？
- 物理属性（材料、动力学）能否通过生成模型直接预测，而非人工标注？
- Sim2Real 的根本瓶颈是视觉域迁移还是物理域迁移？
- Spatial AGI 的训练需要什么级别的 3D 数据保真度？粗略几何 + 精确语义是否足够？

## 关键引用
- 3DGS, NeRF, Neural Fields
- Text-to-3D, Image-to-3D generation
- Digital twins, Sim2Real transfer
- Articulated object generation
