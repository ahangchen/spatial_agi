# Large Multimodal Models as General In-Context Classifiers

**发表日期**: 2026-02-26  
**arXiv链接**: https://arxiv.org/abs/2602.23229v1  
**PDF链接**: https://arxiv.org/pdf/2602.23229v1  
**作者**: Marco Garosi, Matteo Farina, et al.

## 核心问题

Large Multimodal Models (LMM) 在分类任务中能否超越contrastive VLMs？

## 主要发现

1. **Zero-shot**: LMM的zero-shot性能低于CLIP
2. **In-context**: LMM配合少量in-context样本可以匹配或超越CLIP + cache-based adapters
3. **Open-world**: LMM在开放世界分类中更优

### CIRCLE方法

- Training-free方法
- 为in-context样本分配伪标签
- 迭代细化伪标签

## 与Spatial AGI的关系

### 启发

1. **In-Context Learning**: 快速适应空间相关任务
2. **开放世界**: 处理未知的空间场景
3. **统一框架**: LMM可作为统一的分类器

## 思考点

1. 如何设计spatial AGI的in-context learning任务？
2. LMM能否作为spatial reasoning的统一框架？
3. 如何结合3D信息进行in-context learning？
