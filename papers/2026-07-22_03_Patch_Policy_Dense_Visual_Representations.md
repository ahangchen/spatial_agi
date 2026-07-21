# Patch Policy: Efficient Embodied Control via Dense Visual Representations

**arXiv**: [2607.18236](https://arxiv.org/abs/2607.18236) | **Date**: 2026-07-20 | **Category**: cs.RO, cs.LG
**Authors**: Gaoyue Zhou, Zichen Jeff Cui, Ada Langford, Bowen Tan, Yann LeCun, Lerrel Pinto
**Affiliation**: NYU Courant Institute, Meta-FAIR, AMI Labs

---

## 摘要概要

预训练 ViT 的密集视觉特征在机器人学习中被严重低估。现代机器人策略要么将每次观测压缩为单个全局 token，要么依赖从零开始训练的视觉骨干——两者都牺牲了细粒度空间细节和大规模视觉预训练的好处。大型 VLA 模型虽然操作密集 patch 特征，但继承了十亿参数 VLM 的全部计算成本。

本文提出 **Patch Policy**，一个最小的架构扩展，使基于 Transformer 的策略能够直接消费密集预训练 patch tokens，而无需完整 VLM 的计算开销。核心是一个 **block-causal 注意力掩码**：保持标准策略的时间因果性，同时让模型关注每次观测的多个 patch tokens。

在 4 个仿真和 3 个真实环境套件上，Patch Policy 相比使用全局池化表示的方法获得 **40% 相对提升**，并以约 **0.7% 的参数量**超越微调的 OpenVLA-OFT 18%。

---

## Q1: 核心算法原理

### 1) 核心思想和动机

**领域现状诊断**：机器人视觉控制策略分为两个次优范式：
1. **全局特征范式**：将图像压缩为 CLS token 或池化向量 — 破坏细粒度空间信息
2. **大型 VLA 范式**：微调十亿参数 VLM — 效果好但训练/推理成本极高

**核心洞察**：机器人不需要完整的语言模型，只需要**密集视觉特征**

**论点**：Internet 规模预训练的 ViT 已经包含了有效的密集空间理解，可以直接用于控制，无需 VLM 的生成开销

### 2) 主要技术方法

#### Observation Trunk（观测主干）
```
图像 ot → ViT 编码器 → 密集 patch 特征 [P×D]
     ↓
对于 T 步上下文窗口：[T×P×D]
     ↓
可选：拼接目标图像/状态 → [T×P×2D] 或 [T×P×(D+G)]
```

**关键设计**：
- 兼容任意 ViT 架构和预训练目标
- 支持任意视觉编码器（WebSSL CLS、DINOv2、SigLIP 等）
- 向后兼容全局特征（P=1）

#### Block-Causal Attention Mask（块因果注意力掩码）
```
时间步 T1: [patch1] [patch2] [patch3] ... [patchP]  ← 帧内双向注意力
时间步 T2: [patch1] [patch2] [patch3] ... [patchP]  ← 可以看 T1 的所有 patches
时间步 T3: [patch1] [patch2] [patch3] ... [patchP]  ← 可以看 T1, T2 的所有 patches
```

- **帧内**：patches 之间完全双向注意力（spatial reasoning）
- **帧间**：因果掩码（只能看过去帧）
- 保持时间因果性，允许空间内完整推理

#### Policy Head（策略头）
- 兼容任意 Transformer 策略架构
- 验证了两种：VQ-BeT（混合分类-回归损失）和 Diffusion Policy（去噪目标）
- 在每帧最后一个 patch token 处输出动作块

### 3) 算法流程

```
输入：图像序列 + 目标（图像或状态向量）
↓
ViT 编码器（冻结或微调）→ 每帧 P 个 patch 特征
↓
拼接目标嵌入 + 位置编码
↓
Block-Causal Attention Transformer
  - 帧内：双向空间注意力
  - 帧间：因果时间注意力
↓
Action Head (VQ-BeT / Diffusion Policy)
↓
输出：动作块（预测未来 N 步动作）
↓
执行：receding horizon control
```

### 4) 输入输出

- **输入**：图像观测序列（T 帧）+ 目标（图像或状态向量）
- **输出**：动作块（连续控制信号）
- **推理延迟**：~11ms

---

## Q2: 与 Spatial AGI 的关系

### 1) 如何理解和表示空间

Patch Policy 提出了**不需要显式 3D 重建的空间理解路径**：
- ViT 的 patch 特征保留了 2D 图像中的**细粒度空间信息**
- 预训练 ViT 在互联网规模数据上学到了**隐式的几何和空间理解**
- 密集 patch tokens 包含足够的空间信息用于精确操控

**关键发现**：空间压缩会降低控制性能 — 这从实证角度证明了细粒度空间信息的重要性

### 2) 如何处理空间关系

- **隐式空间推理**：通过密集 patch tokens 的注意力机制隐式建模空间关系
- **时间-空间分离**：block-causal 掩码将空间推理（帧内双向）和时间推理（帧间因果）分离
- **目标条件**：目标图像或状态向量引导空间动作生成

### 3) 对 Spatial AGI 的启发

1. **效率范式**：以 0.7% 的参数超越 OpenVLA-OFT 18%
   - Spatial AGI 不需要巨大的模型 — 需要的是正确的信息接口
   - 密集 2D 特征可能比显式 3D 表示更高效

2. **预训练 ViT 作为空间理解骨干**
   - Internet 规模预训练的 ViT 已包含强大的空间理解能力
   - 关键是**不要压缩** — 保留 patch 级别信息
   - 这为 Spatial AGI 提供了一种轻量级空间感知方案

3. **架构简洁性**：最小架构扩展 → 最大效果
   - block-causal 掩码是唯一的架构创新
   - 证明了有时简单的方法比复杂的 3D 编码更有效

4. **空间分辨率的重要性**：
   - 减少空间分辨率（池化、卷积压缩）会一致地降低性能
   - 这暗示 Spatial AGI 系统应优先保留空间分辨率

### 4) 应用场景

- **机器人操控**：精确抓取、放置、插入等需要空间精度的任务
- **视觉伺服**：高频反应式控制（11ms 延迟）
- **多模态控制**：兼容 VQ-BeT 和 Diffusion Policy
- **目标条件任务**：图像目标或状态目标引导

---

## Q3: 创新点与局限性

### 主要创新点

1. **简单性哲学**：仅通过一个 block-causal 注意力掩码就实现了密集 patch 特征的利用
   - 不需要新的 VLM、新的 3D 编码器或复杂的架构
   - 证明了"最小架构扩展"的力量

2. **全面的表示学习分析**：
   - 比较了 5 种 SOTA 视觉表示（WebSSL CLS、DINOv2、SigLIP 等）
   - 系统地证明了空间压缩有害、密集特征有益
   - 冻结预训练 ViT 即可有效

3. **极高的参数效率**：
   - 0.7% OpenVLA-OFT 参数量 → 超越 18% 性能
   - 推理延迟 ~11ms（适合高频控制）

4. **广泛验证**：
   - 4 个仿真 + 3 个真实环境
   - 40% 相对提升 vs 全局池化

### 局限性

1. **仅处理 2D 信息**：没有显式 3D 表示
   - 对于需要深度推理的任务（如精确 3D 定位）可能不足
   - 依赖 ViT 的隐式 3D 理解能力

2. **观测上下文限制**：patch 数量随图像分辨率和帧数线性增长
   - 高分辨率 + 长上下文 → 序列过长
   - 需要在空间分辨率和计算成本间权衡

3. **ViT 编码器依赖**：效果强烈依赖预训练 ViT 的质量
   - 不同 ViT 变体效果差异大
   - 最佳预训练目标（自监督 vs 语言-图像）仍需探索

4. **未考虑多视角**：仅处理单视角观测
   - 多相机设置（如机器人臂+手腕相机）需要额外处理

5. **动作空间局限**：主要验证在连续动作空间
   - 离散动作空间（如语言指令）的效果未知

### 与相关工作的比较

| 方法 | 视觉表示 | 参数量 | 推理延迟 | 空间信息 |
|------|---------|--------|---------|---------|
| Patch Policy | 密集 patch | ~0.7% VLA | ~11ms | ✅ 2D 密集 |
| OpenVLA-OFT | 密集 patch | ~1B+ | 较慢 | ✅ 2D+语言 |
| ResNet+DP | 全局池化 | 小 | 快 | ❌ 压缩 |
| VQ-BeT (原版) | CLS token | 小 | 快 | ❌ 单 token |

---

## 关键术语

- **Patch Features**：ViT 将图像分割为 patch 后的密集特征表示
- **Block-Causal Attention**：帧内双向、帧间因果的注意力模式
- **Receding Horizon Control**：滚动时域控制策略
- **VQ-BeT**：Vector-Quantized Behavior Transformer
- **WebSSL**：网络规模自监督学习
- **Action Chunk**：一次预测的多步动作序列

---

## 总结

Patch Policy 是一篇来自 LeCun 组的精彩工作，以极简的架构设计揭示了密集视觉表示在机器人控制中的巨大潜力。其核心洞察——**空间信息不应被压缩**——对 Spatial AGI 有重要启示：与其构建越来越大的 VLM，不如更有效地利用已有视觉骨干的密集特征。0.7% 参数超越完整 VLA 的结果挑战了"更大更好"的直觉，为高效的 Spatial AGI 系统设计提供了新思路。

---

*Analysis date: 2026-07-22*
*Paper ID: 03*
