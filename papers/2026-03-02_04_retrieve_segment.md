# Retrieve and Segment: Are a Few Examples Enough to Bridge the Supervision Gap in Open-Vocabulary Segmentation?

**发表日期**: 2026-02-26  
**arXiv链接**: https://arxiv.org/abs/2602.23339v1  
**PDF链接**: https://arxiv.org/pdf/2602.23339v1  
**作者**: Tilemachos Aravanis, Vladan Stojnić, et al.

## 核心问题

Open-Vocabulary Segmentation (OVS) 能否通过few-shot设置缩小与全监督方法的差距？

## 主要方法

### Few-Shot OVS

1. **支持集**: 用少量像素级标注图像增强文本提示
2. **检索增强**: 检索相关的支持样本
3. **测试时适应**: 学习轻量级的per-image分类器

### 创新点

- **融合策略**: 学习式的per-query融合，而非手工融合
- **持续扩展**: 支持持续扩展的支持集
- **细粒度任务**: 支持个性化分割

## 与Spatial AGI的关系

### 启发

1. **空间理解**: 像素级空间理解能力
2. **Few-Shot学习**: 快速适应新的空间概念
3. **开放词汇**: 处理任意空间相关的类别

## 思考点

1. 如何将few-shot思想用于3D场景理解？
2. 能否用于空间关系的分割？
3. 如何与语义SLAM结合？
