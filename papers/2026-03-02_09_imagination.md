# Imagination Helps Visual Reasoning, But Not Yet in Latent Space

**发表日期**: 2026-02-26  
**arXiv链接**: https://arxiv.org/abs/2602.22766v1  
**PDF链接**: https://arxiv.org/pdf/2602.22766v1  
**作者**: You Li, Chi Chen, et al.

## 核心问题

Latent visual reasoning（潜在视觉推理）的有效机制是什么？是否真的在潜在空间中进行推理？

## 主要发现

### Causal Mediation Analysis

1. **Input-Latent Disconnect**: 输入扰动对latent tokens影响很小
2. **Latent-Answer Disconnect**: latent tokens扰动对最终答案影响有限
3. **信息有限**: latent tokens编码有限的视觉信息

### CapImagine方法

- **显式想象**: 教模型使用文本显式想象
- **优于latent**: 在视觉中心任务上显著优于latent-space baselines

## 关键创新

1. **因果分析**: 使用Causal Mediation Analysis分析latent reasoning
2. **反直觉发现**: Latent reasoning可能不是想象的有效方式
3. **显式想象**: 提出显式文本想象作为替代

## 与Spatial AGI的关系

### 直接相关性

1. **视觉推理**: 研究视觉推理的机制
2. **想象能力**: 想象在空间推理中的作用
3. **认知架构**: 理解空间推理的认知过程

### 启发

1. **显式表示**: Spatial AGI可能需要显式的空间表示
2. **推理机制**: 空间推理可能不适合纯latent方法
3. **文本辅助**: 文本描述可辅助空间推理

## 思考点

1. Spatial AGI需要显式的空间表示还是潜在表示？
2. 如何在空间推理中有效使用"想象"？
3. 文本描述能否完全表达空间关系？
