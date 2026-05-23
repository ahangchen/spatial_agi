# GA-VLN: Geometry-Aware BEV Representation for Efficient Vision-Language Navigation

**arXiv**: [2605.22036](https://arxiv.org/abs/2605.22036) | **Date**: 2026-05-22 | **Code**: [github.com/jahhaoyang/GA-VLN](https://github.com/jahhaoyang/GA-VLN)

---

## 一句话总结

GA-VLN 提出几何感知的 BEV 表示，将显式深度投影与隐式 3D 基础模型先验融合，大幅压缩视觉 token 数量的同时实现 VLN 新 SOTA。

---

## 核心问题

现有 MLLM 导航系统直接处理密集 RGB 视频帧，产生大量冗余 token，缺乏显式空间结构，导致计算开销大、空间推理弱。

## 方法概述

**GA-BEV 表示**结合两种几何线索：

1. **显式深度引导投影**：将 RGB-D 特征通过针孔模型反投影到 3D，再投影到 agent 中心的 BEV 平面
2. **隐式 3D 几何先验**：使用 VGGT-1B 冻结特征，通过 2 层 MLP 投影后融入同一 BEV 空间
3. **网格聚合**：0.25m×0.25m 网格，均值池化，只保留非空网格 → ~500 tokens（vs 基线 4003 tokens）

**导航框架**：LLaVA-Video-7B + GA-BEV + 两轮对话预测动作

## 实验结果

| 基准 | GA-VLN SR | 次优 SR | 提升 | Token 数 |
|------|-----------|---------|------|----------|
| R2R-CE | **61.0%** | 58.2% (InternVLA) | +4.8% | 514 vs 4003 |
| RxR-CE | **55.4%** | 53.5% | +3.6% | |
| NavRAG-CE | 22.2% | 24.7% (Dynam3D) | - | |

**无需 DAgger 数据增强**即可达到 SOTA。

## 关键洞察

1. **BEV 压缩极其高效**：token 减少 87%，性能反而提升
2. **显式+隐式几何互补**：两者缺一不可，单独使用效果下降
3. **3D 基础模型的价值**：VGGT 的多视角几何先验显著提升空间理解
4. **真实机器人部署成功**：在 Hello Robot Stretch 3 上零样本科工作

## 对 Spatial AGI 的意义

- **空间表示的效率革命**：紧凑 BEV 是空间智能的关键中间表示
- **3D 基础模型赋能具身智能**：预训练的 3D 几何知识可直接迁移到导航
- **MLLM + 空间推理的范式**：将空间结构注入大语言模型的新路径

## 局限性

- NavRAG-CE 基准上不如使用 DAgger 的方法
- 32 步历史窗口可能不够长
- 真实世界部署缺少避障模块

---

*Analysis date: 2026-05-24*
