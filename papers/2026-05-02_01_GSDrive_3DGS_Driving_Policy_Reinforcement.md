# GSDrive: Reinforcing Driving Policies by Multi-mode Trajectory Probing with 3D Gaussian Splatting Environment

**Date**: 2026-05-02 | **arXiv**: [2604.28111](https://arxiv.org/abs/2604.28111) | **Published**: 2026-04-30
**Authors**: Ziang Guo, Min Chen, Xuefeng Zhang, Yixiao Zhou, Zufeng Zhang, Dzmitry Tsetserukou
**Affiliations**: Skoltech, CAS Beijing, HKU, Tsinghua
**Code**: https://github.com/ZionGo6/GSDrive

## 一句话总结
GSDrive 利用 3D Gaussian Splatting 环境进行多模态轨迹探测（multi-mode trajectory probing），将未来轨迹在物理仿真环境中展开以获取密集奖励信号，从而通过 RL 增强 E2E 自动驾驶策略。

## 核心问题
传统 E2E 自动驾驶中 IL+RL 结合面临的关键挑战：
- RL 依赖稀疏的、基于事件的奖励（如碰撞），策略只在灾难发生时收到信号
- 长期后果难以归因到早期动作，导致过早收敛到次优行为
- 3DGS 仿真中的 RL 方法（如 RAD）虽提供物理环境，但奖励仍是即时碰撞信号

## 方法架构

### 3DGS 重建
- 使用 VGGT（多视角 Transformer）从 6 个环视相机提取几何特征
- 通过极线约束实现跨视图信息聚合，前馈预测高斯基元属性
- 渲染损失 = RGB + SSIM + Depth（LiDAR 监督）

### IL 阶段（轨迹探针学习）
- ResNet + BEV 压缩 → 交叉注意力 → **Flow Matching 头**预测多模态轨迹
- 引入 Optimal Transport（Sinkhorn 算法）引导速度场学习
- 轨迹点通过指数核构建 action logits，结合 residual action head

### RL 阶段（轨迹探测奖励）
- **核心创新**：从策略预测的 K 条候选轨迹中，每条在 3DGS 环境中前向展开 H 步
- 奖励 = 基础环境奖励 + 轨迹探测奖励（取 K 条中最大值）
- 探测奖励本质上是"预见未来"——在碰撞发生前就获得惩罚信号
- PPO + 自适应 KL 正则化（EMA 跟踪 KL 散度）

## 关键结果

### 闭环评估（nuScenes, 50 episodes）
| 方法 | ER↑ | DS↑ | MA↓ | LC↑ | CR↓ |
|------|-----|-----|-----|-----|-----|
| RAD | 49.24 | 12.85 | 1.68 | 2.69 | 0.19 |
| Q-chunking | 39.70 | 13.90 | 1.94 | 1.65 | 0.22 |
| **GSDrive** | **52.97** | **13.98** | **1.56** | **3.59** | **0.11** |

### 消融实验
- Flow Matching + CFG 优于 DDPM/DDIM（低步数下更稳定）
- 轨迹构建 logits + residual head > 直接 MLP action head
- 轨迹探测奖励贡献约 +6 ER（49.08 vs 43.09）

## Spatial AGI 相关性分析

### 与空间智能的联系
1. **3DGS 作为空间仿真器**：GSDrive 将 3D 高斯场不仅用于渲染，还作为可交互的物理环境，这是空间智能从"感知"走向"行动"的关键一步
2. **未来轨迹的空间推理**：轨迹探测本质上是空间前向模拟——策略需要理解 3D 空间中的动力学后果
3. **多模态空间规划**：Flow Matching 预测多条轨迹，每条代表不同的空间路径选择

### 对 Spatial AGI 的启示
- **仿真到行动的闭环**：3DGS 不只是重建工具，而是策略学习的"空间沙盒"
- **密集空间奖励**：将稀疏的物理事件（碰撞）转化为连续的空间反馈信号
- **IL-RL 双向知识传递**：IL 学空间先验，RL 通过空间仿真优化策略

### 局限性
- 仅在 nuScenes 数据集上评估，场景多样性有限
- 3DGS 重建质量直接影响奖励信号质量
- 多模态轨迹探测的计算开销较大
- 目前仅用于自动驾驶，未扩展到机器人操作等领域

## 思考与问题
- 轨迹探测的思想是否可以泛化到更通用的 embodied agent？例如机器人操作中的"想象抓取"
- 3DGS 环境中的物理交互（碰撞检测）精度如何？是否会影响奖励质量？
- Flow Matching + CFG 的组合是否可以替代扩散模型在所有轨迹生成任务中的角色？

## 关键引用
- RAD (Gao et al., 2025) - 同样基于 3DGS 的 RL 驾驶
- VGGT (Wang et al., 2025) - 多视角 3DGS 前馈预测
- Optimal Transport Flow Matching (Kornilov et al., 2024)
