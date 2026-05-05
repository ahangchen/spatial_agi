# MolmoAct2: Action Reasoning Models for Real-world Deployment

**arXiv**: 2605.02881
**日期**: 2026-05-04
**机构**: Allen Institute for AI, University of Washington, NUS, UPenn, Johns Hopkins, Amazon, etc.
**作者**: Haoquan Fang*, Jiafei Duan*, Donovan Clay*, Sam Wang*, ... Ranjay Krishna, Ali Farhadi, Dieter Fox

---

## 核心摘要

MolmoAct2是一个完全开源的VLA动作推理模型，专为真实世界部署设计。它在五个维度上超越了前代MolmoAct：(1) Molmo2-ER空间推理VLM骨干，(2) 三个新数据集（含720小时双手操作数据），(3) OpenFAST开源动作tokenizer，(4) flow-matching连续动作专家+KV-cache架构，(5) 自适应深度推理MolmoAct2-Think。

---

## Q1: 核心算法原理

### 1. 核心思想和动机

VLA模型面临四大部署瓶颈：
- **封闭性**：前沿模型（如Gemini Robotics）不开源
- **推理延迟**：reasoning-augmented策略生成数百token才能输出一个动作
- **硬件限制**：开源VLA绑定昂贵机器人平台
- **成功率不足**：即使微调后仍低于可靠部署阈值

MolmoAct2的目标：**一个完全开源、可部署、高性能的通用VLA**。

### 2. 主要技术方法

#### 2.1 Molmo2-ER: 空间推理专用VLM

基于Molmo2，通过"specialize-then-rehearse"两阶段训练注入空间推理能力：

- **训练数据**：3.3M样本语料，覆盖6个能力支柱：
  - Image Embodied QA (1.33M)
  - Image Pointing (780K)
  - Image Detection (100K)
  - Video Embodied QA (703K)
  - Multi-image/Ego-Exo (700K)
  - Abstract Reasoning (150K)

- **Specialize阶段**：专注空间-embodied语料训练
- **Rehearse阶段**：与通用数据混合 rehearse，防止遗忘

在13个embodied reasoning基准上超越GPT-5和Gemini Robotics ER-1.5。

#### 2.2 动作专家架构

创新的连续动作专家嫁接方案：
- **Flow-matching连续动作专家**：通过per-layer KV-cache conditioning嫁接到离散token VLM上
- **OpenFAST Tokenizer**：开源动作tokenizer，将1秒32维连续动作压缩为紧凑离散序列
- 训练数据：5种embodiment的百万级轨迹

#### 2.3 MolmoAct2-Think: 自适应深度推理

核心创新：**只重新预测场景中变化的区域的深度token**
- 利用轨迹级时间冗余减少延迟
- 与静态场景比例成正比降低延迟
- 保留几何grounding（显著提升性能）

### 3. 算法流程

```
输入：图像帧 + 语言指令
  ↓
Molmo2-ER VLM backbone → 空间理解 + embodied推理
  ↓ (per-layer KV-cache)
Flow-matching Action Expert → 连续动作输出
  ↓
（可选）MolmoAct2-Think → 自适应深度推理
  ↓
输出：连续机器人动作序列
```

### 4. 输入输出

- **输入**：RGB图像（单目/多视角）+ 自然语言指令
- **输出**：32维连续动作序列（1秒horizon）

---

## Q2: 与Spatial AGI的关系

### 1. 空间理解和表示

Molmo2-ER引入了系统的空间推理能力训练：
- **像素级pointing**：精确空间定位
- **多图像/ego-exo对应**：跨视角空间推理
- **视频时序推理**：时序空间变化理解
- **深度推理**：显式3D几何推理（通过depth token）

这代表了一种将空间智能"注入"通用VLM的方法论——不是从零构建3D-native模型，而是通过精心设计的训练数据将2D VLM升级为具备空间推理能力的模型。

### 2. 空间关系处理

- 通过embodied QA训练空间关系理解（上下左右前后）
- 通过ego-exo数据训练视角转换（第一人称↔第三人称）
- 通过depth token显式编码3D几何
- 通过pointing数据训练精确定位能力

### 3. 对Spatial AGI的启发

1. **Specialize-then-rehearse范式**：通用能力→空间专门化→能力保持，这是构建Spatial AGI的有效路径
2. **空间推理作为基础能力**：Molmo2-ER证明空间推理不仅提升机器人操作，也是通用VLM的重要能力
3. **自适应推理的效率**：MolmoAct2-Think的空间自适应推理预示了Spatial AGI需要高效的空间计算
4. **开源生态的价值**：完全开源使Spatial AGI研究社区能在此基础上构建

### 4. 可应用的Spatial AGI场景

- 机器人操作中的空间推理（抓取、放置、堆叠）
- 多视角场景理解
- 基于语言指令的空间导航
- 双手协调操作中的空间规划

---

## Q3: 创新点与局限性

### 创新点

1. **Per-layer KV-cache conditioning**：将flow-matching连续动作专家优雅地嫁接到离散VLM上，解决了连续/离散模态桥接问题
2. **自适应深度推理（MolmoAct2-Think）**：只重新预测变化区域的depth token，在保持几何grounding的同时大幅降低延迟
3. **Specialize-then-rehearse训练范式**：在不损害通用能力的前提下注入空间推理
4. **最大的开源双手操作数据集**：720小时BimanualYAM
5. **全面的实证研究**：7个benchmark，13个embodied reasoning基准

### 局限性

1. **2D-native架构**：虽然通过训练数据注入了空间推理，但底层仍是2D像素处理，未从根本上解决3D表示问题
2. **深度推理的非精确性**：depth token预测不是精确的3D重建，可能在精细空间推理中不够准确
3. **动作horizon有限**：1秒的动作预测horizon可能不足以处理需要长期空间规划的任务
4. **依赖大规模数据**：3.3M样本+百万轨迹的训练成本高
5. **硬件依赖**：虽然支持低成本平台，但模型本身仍需要GPU推理

### 与相关工作对比

| 维度 | MolmoAct2 | π0.5 | Gemini Robotics |
|------|-----------|------|-----------------|
| 开源性 | ✅ 完全开源 | ❌ 权重不开源 | ❌ 完全封闭 |
| 推理能力 | ✅ 自适应深度推理 | ⚠️ 有限 | ✅ 强 |
| 部署平台 | ✅ 低-中成本 | ⚠️ 特定平台 | ❌ 高成本 |
| 双手操作 | ✅ 720h数据 | ⚠️ 有限 | ✅ 支持 |
| 空间推理 | ✅ 专门训练 | ⚠️ 通用 | ✅ 强 |

---

## 关键词

VLA, Spatial Reasoning, Flow Matching, Action Tokenization, Embodied AI, Bimanual Manipulation, Depth Reasoning, Open-source

---

## 引用信息

```bibtex
@article{fang2026molmoact2,
  title={MolmoAct2: Action Reasoning Models for Real-world Deployment},
  author={Fang, Haoquan and Duan, Jiafei and Clay, Donovan and Wang, Sam and others},
  journal={arXiv preprint arXiv:2605.02881},
  year={2026}
}
```
