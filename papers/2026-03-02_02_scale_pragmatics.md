# Scale Can't Overcome Pragmatics: The Impact of Reporting Bias on Vision-Language Reasoning

**发表日期**: 2026-02-26  
**arXiv链接**: https://arxiv.org/abs/2602.23351v1  
**PDF链接**: https://arxiv.org/pdf/2602.23351v1  
**作者**: Amita Kamath, Jack Hessel, Khyathi Chandu, et al.

## 核心问题

Vision-Language Models (VLMs) 缺乏推理能力的问题是否源于训练数据中的报告偏差（reporting bias）？单纯增加数据规模能否解决推理问题？

## 主要发现

### 报告偏差分析

通过语用学（pragmatics）理论分析VLM训练数据，发现四种推理技能在数据中表达不足：
1. **空间推理** (spatial reasoning)
2. **时间推理** (temporal reasoning)
3. **否定推理** (negation reasoning)
4. **计数推理** (counting reasoning)

### 关键洞察

**问题**: 人们描述视觉内容时默认省略隐含信息（如"at the game today!" 而非 "a photo of 37 people standing behind a field"）

**影响**: 
- VLM训练数据缺乏推理监督信号
- 即使是网络规模或合成数据也存在此问题

### 实验结论

1. VLM在受报告偏差影响的推理类型上表现不佳
2. **缩放无效**: 增加数据规模、模型规模、多语言都不能默认解决这些推理技能
3. **解决方案**: 需要专门收集包含隐含信息的标注数据

## 关键创新

1. **语用学视角**: 首次从语用学理论分析VLM推理问题
2. **报告偏差识别**: 明确识别出训练数据中的系统性偏差
3. **反直觉发现**: 证明scale不能自动带来推理能力的涌现

## 与Spatial AGI的关系

### 直接相关性

1. **空间推理**: 直接研究VLM的空间推理能力
2. **数据偏差**: 揭示了空间推理数据的系统性缺失
3. **评估方法**: 提供了评估VLM推理能力的框架

### 启发

1. **数据策略**: Spatial AGI需要专门的空间推理数据
2. **评估重要性**: 需要针对性地评估空间推理能力
3. **规模化局限**: 不能依赖规模化解决空间推理问题

## 潜在应用

1. **数据集构建**: 指导空间推理数据集的构建
2. **模型评估**: 评估VLM的空间推理能力
3. **训练策略**: 设计更好的训练数据采样策略

## 思考点

1. 如何设计包含隐含空间信息的标注协议？
2. 报告偏差在3D场景理解中是否更严重？
3. 如何结合synthetic data弥补数据缺失？
