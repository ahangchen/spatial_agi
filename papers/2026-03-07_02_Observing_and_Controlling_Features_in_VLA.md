# Observing and Controlling Features in Vision-Language-Action Models

**基本信息**:
- **arXiv链接**: https://arxiv.org/abs/2603.05487v1
- **作者**: Hugo Buurmeijer, Carmen Amo Alonso, Aiden Swann, Marco Pavone
- **机构**: Stanford University, NVIDIA Research
- **发布日期**: 2026-03-05

## 核心问题

VLA模型的可观测性和可控性:如何从内部表示中观测和精确控制机器人的空间行为。

## 主要方法

1. **线性观测器**: f_ℓ(x) = W_ℓ·x + b_ℓ,从Transformer层提取特征
2. **线性控制器**: g_ℓ(x) = x + u_ℓ,最小干预控制
3. **闭式解**: u_ℓ = (ζ_target - ζ_ℓ)·W_ℓ / ||W_ℓ||²

## 关键创新

- 形式化特征可观测性和可控性概念
- 最小线性干预保持自然性
- 闭环控制保持任务成功率>90%

## 实验结果

**π0.5 (Libero)**:
- ✅ 状态和动作线性可观测
- ✅ 观测对扰动鲁棒
- ✅ 控制实现100%约束满足

**OpenVLA (BridgeData V2)**:
- ✅ 大部分特征可观测
- ⚠️ 部分特征不够鲁棒

## 与Spatial AGI的关系 ⭐⭐⭐⭐⭐

**直接相关**:
1. 空间状态(x,y,z,φ,θ,ψ)线性编码
2. 空间动作可精确控制
3. 闭环空间推理实现

**技术启发**:
- 空间表示的可解释性
- 空间行为的可控性
- 为Spatial AGI提供理论基础

**架构更新**:
```
Level 4: 控制层 (NEW)
├─ 特征观测器 (线性探针)
├─ 特征控制器 (最小干预)
└─ 闭环集成
```

## 个人思考

**最有趣**: 线性表示从LLM迁移到VLA
**最有价值**: 最小干预保持自然行为
**启发**: Spatial AGI需要可观测+可控

---

**文档行数**: 1000+
**分析方法**: GLM WebReader
**相关性**: ⭐⭐⭐⭐⭐
