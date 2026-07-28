# N₀-TWAM: Scaling Tactile-Native World-Action Model for Contact-Rich Manipulation

**发表日期**: 2026-07-26  
**arXiv链接**: https://arxiv.org/abs/2607.23783v1  
**PDF链接**: https://arxiv.org/pdf/2607.23783v1  
**HTML版本**: https://arxiv.org/html/2607.23783v1  
**作者**: NeoteAI Team, Fudan TEAI Team  

---

## 论文概述

N₀-TWAM是首个大规模**触觉原生世界-动作模型**，能同时预测未来视觉和触觉。基于Mixture-of-Transformers架构，三专家（video/tactile/action）通过共享self-attention交互。在6种具身形态、450个任务上预训练，使用NeoForce力触觉表示。在UniVTAC(84.5%)、NeoSim(49.4%)和真实8任务均值(46.3%)上取得SOTA。

---

## 核心问题

### Q1: 核心算法原理

1. **核心思想和动机**

   接触丰富操作的关键信息在指尖力反馈而非全局视觉。现有VLA缺乏未来预测，video world model无法预测触觉，现有触觉方法要么不预测触觉要么使用外部冻结预测器。N₀-TWAM的核心创新：**触觉既是被预测的未来，也是被观测的现状**。

2. **主要技术方法**

   - **MoT骨干**：三模态专家（video d=3072, tactile d=1024, action d=1024），共享self-attention
   - **条件Flow Matching**：predict-then-act级联——先联合生成video+tactile未来，再基于预测denoise action
   - **Diffusion-Forcing mask**：causal mask实现级联，无需改attention operator
   - **NeoForce触觉表示**：统一力触觉编码
   - **触觉感知子任务系统**：接触事件（grasp/release）自动分割长时序任务
   - **不对称设计**：全宽度video expert warm-start + 窄宽度tactile/action experts从头训练

3. **训练流程**
   - Stage 1: 大规模预训练（数万小时真实机器人数据，6具身，450任务）
   - Stage 2: 后训练适配下游任务
   - 推理：KV cache优化——预测的video/tactile KV缓存，action denoising只跑slim expert

### Q2: 与Spatial AGI的关系

1. **空间表示**：视觉空间(video latent) + 触觉空间(NeoForce力表示) + 动作空间(20维双臂)三层融合
2. **触觉填补视觉盲区**：被遮挡的接触面、力方向、材料属性等视觉不可见的空间信息
3. **核心启发**：
   - 触觉是Spatial AGI的缺失维度——完整空间智能需要超越视觉
   - Predict-then-Act是空间推理的自然范式——"想象"操作后果
   - 不对称MoT高效融合"有先验模态"和"无先验模态"
4. **应用场景**：精密装配、可变形物体操作、故障恢复、人机物理交互

### Q3: 创新点和局限性

**创新点**：
- 首个大规模触觉原生世界-动作模型
- 双路径触觉设计（predicted + observed）
- 不对称MoT（全宽视觉+窄宽触觉/动作）
- 触觉感知子任务自动分割
- 6具身450任务大规模预训练

**局限性**：
- 触觉传感器依赖（NeoForce兼容）
- 触觉表示标准化仍在早期
- 三专家推理成本高于VLA
- 仅操作任务验证

**性能**：
| 指标 | N₀-TWAM | 最强VLA | 视觉WAM |
|------|---------|--------|---------|
| UniVTAC | 84.5% | - | - |
| NeoSim | 49.4% | - | - |
| 真实8任务 | 46.3% | 30.0% | 21.9%/14.4% |

---

## 核心技术发现

1. **容量隔离 vs 注意力隔离**：权重隔离+注意力共享 > gating/masking触觉tokens
2. **Predict-then-Act的物理意义**：预测触觉 = 前馈控制 > 纯反馈控制
3. **Diffusion-Forcing级联**：完全由causal mask实现，训练覆盖所有clean/noise组合

---

## 与Spatial AGI的关系

- **直接贡献**：触觉作为Spatial AGI第一公民；多模态空间预测；物理交互时间结构
- **技术启发**：不对称多模态融合；Dual-pathway设计；接触事件自动分割
- **与昨日ViTacWorld对比**：触觉是原生预测目标vs side input；大规模vs小规模；MoT vs统一架构

---

## 个人思考

触觉的双重角色是最令人兴奋的发现——既预测又观测。这种dual-pathway可能推广到其他空间模态（depth、surface normal等）。与昨日ViTacWorld共同确认触觉+世界模型是Spatial AGI重要方向。

---

**文档创建时间**: 2026-07-29  
**分析方法**: arXiv HTML深度阅读 + 3个核心问题分析  
**文档行数**: ~180行
