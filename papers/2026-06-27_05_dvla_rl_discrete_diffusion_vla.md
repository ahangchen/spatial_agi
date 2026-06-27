# dVLA-RL: Reinforcement Learning over Denoising Trajectories for Discrete Diffusion Vision-Language-Action Models

> **论文深度分析报告**
> - arXiv: [2606.23623](https://arxiv.org/abs/2606.23623)
> - 发表日期: 2026-06-22
> - 作者: Yuhao Wu, Yitian Liu, Weijie Shen, Mishuo Han, Wenjie Xu, Haotian Liang, Zhongshan Liu, Yinan Mao, Lei Xu, Xinping Guan, Ru Ying, Ran Zheng, Wei Sui, Xiaokang Yang, Wenbo Ding, Yao Mu
> - 领域: Robotics (cs.RO)

---

## 论文摘要概览

Vision-Language-Action (VLA) 模型通过将控制信号 grounding 到 Vision-Language Model (VLM) 的语义推理能力中，建立了通用机器人操作的强大范式。当前主流架构通常通过 diffusion/flow 过程在连续空间建模动作，或者通过 autoregressive generation / parallel decoding 在离散空间建模。近年来，Discrete Diffusion VLA (dVLA) 作为一种独特的替代方案出现，通过 masked generative modeling 将视觉、语言和动作统一到单一的离散 token 空间中。

然而，dVLA 的训练迄今为止仅限于 Supervised Fine-Tuning (SFT)，Reinforcement Learning (RL) 用于进一步提升策略的潜力 largely unexplored。RL 用于 dVLA 的根本挑战在于：**dVLA 生成的最终 action 的 marginal probability 是 intractable 的**。

dVLA-RL 提出将学习目标从 marginal action probability 转移到 sampled generation path 的 joint probability 上。具体而言，通过将 denoising process 建模为 Markov Decision Process (MDP)，该路径概率被数学公式化为 step-wise transitions 的乘积。这种 trajectory-level objective 提供了统一公式化，原生支持可变 denoising steps。

**关键成果：**
- LIBERO benchmark 上 **99.7%** 成功率
- RoboTwin 2.0 上相对 SFT baseline 提升 **30.6%**
- 与强 World-Action Model baseline 具有竞争力

---

## Q1: 核心算法原理 — Discrete Diffusion VLA 设计、RL over Denoising Trajectories 方法、与 Continuous VLA 的本质区别

### 1.1 VLA 模型的发展脉络与分类

要深入理解 dVLA-RL 的核心贡献，必须首先厘清 VLA 模型的完整技术图谱。当前的 VLA 模型可以根据 action representation 方式划分为三大类：

**第一类：Continuous VLA（连续动作 VLA）**

以 π₀ (Physical Intelligence)、OpenVLA-OFT 为代表，这类模型在连续空间中建模 action。π₀ 使用 flow matching 过程，将 action 生成建模为从噪声到目标 action 的连续微分方程。这类方法的优势在于 action 空间的平滑性和梯度信息的可利用性，但面临的是 continuous diffusion 中 score function 的估计问题。在 RL fine-tuning 场景下，连续 diffusion VLA 可以相对直接地定义 marginal action probability，因为 continuous diffusion 的概率密度函数（尽管难以精确计算）在数学上具有明确的表达形式。Flow Q-Learning (park2025flowqlearning) 和 FlowGRPO (liu2025flowgrpotrainingflowmatching) 等工作已经探索了这一方向。

**第二类：Autoregressive Discrete VLA（自回归离散 VLA）**

以 OpenVLA 为代表，将 action 离散化为 token 序列，使用标准 autoregressive decoding（如 next-token prediction）生成。OpenVLA 基于 Llama 2 语言模型，将 robot action 编码为离散 token，通过 autoregressive 方式逐 token 生成。这类方法可以直接复用 Large Language Model (LLM) 的训练和推理基础设施，包括 RLHF 等强化学习技术。SimpleVLA-RL (li2026simplevlarl)、VLA-RL (lu2025vlarlmasterfulgeneralrobotic) 等工作已经在此方向上验证了 RL 的有效性。关键在于，autoregressive 模型的 action 概率就是各 token 概率的乘积，这在数学上是完全 tractable 的。

**第三类：Discrete Diffusion VLA（离散扩散 VLA）**

这是论文所关注的核心类别。以 dVLA (wen2025dvla)、MMAct (liang2025mmactlearnmultimodalparallel)、DREAM (ye2025dream) 为代表，这类方法使用 masked generative modeling（或 discrete diffusion）来生成 action token。其工作方式类似于 Masked Language Model (MLM)：从全 mask 的序列开始，通过多步 denoising 逐步揭示 action token。每一步中，模型并行预测多个 masked position 的 token，形成一个从 "全噪声" 到 "全清晰" 的迭代 refinement 过程。

### 1.2 Discrete Diffusion VLA 的工作机制详解

Discrete diffusion VLA 的核心工作机制可以概括如下：

1. **Token 化统一**：将视觉输入（图像 patch）、语言指令（文本 token）和动作输出（action chunk）统一编码到同一离散 token 空间。这种统一性是 dVLA 区别于其他方法的重要特征——所有模态在同一 vocabulary 中表达。

2. **Masked Generative Process**：给定观测和指令，action 部分被初始化为全 mask token `[M][M][M]...[M]`。模型通过 K 步 denoising 逐步将其转化为具体的 action token 序列 `[a₁][a₂][a₃]...[aₙ]`。

3. **并行解码**：在每一步 denoising 中，模型同时处理所有（或部分）仍处于 masked 状态的 position，为它们预测 token。这与 autoregressive 的逐 token 生成形成鲜明对比——discrete diffusion 允许并行解码，理论上具有更好的推理效率。

4. **迭代 refinement**：多步 denoising 允许模型在早期步骤中做出粗略预测，然后在后续步骤中 refine。这种 coarse-to-fine 的过程类似于连续 diffusion 的去噪过程，但在离散 token 空间中操作。

### 1.3 核心挑战：Marginal Probability 的 Intractability

dVLA-RL 论文的核心出发点是识别一个被先前工作忽视的关键数学难题：**在 discrete diffusion 框架下，最终生成的 action 序列的 marginal probability 是 intractable 的**。

让我们深入理解这个问题。在 autoregressive VLA 中，action `a = (a₁, a₂, ..., aₙ)` 的概率为：

```
p(a) = ∏ᵢ p(aᵢ | a₁, ..., aᵢ₋₁)
```

这是完全 tractable 的，可以精确计算。

然而，在 discrete diffusion VLA 中，action 通过多步 denoising 生成。每一步 denoising 涉及：
- 选择哪些 masked position 来 unmask
- 为选定的 position 预测 token

最终的 action 可以通过多种不同的 denoising path 产生。例如，对于 3 步 denoising 生成 3 个 action token：
- Path 1: 先 unmask position 1 → 再 unmask position 2 → 最后 unmask position 3
- Path 2: 先 unmask position 2 → 再 unmask position 1 → 最后 unmask position 3
- Path 3: 先同时 unmask position 1,2 → 再 unmask position 3
- ... (多种可能的路径)

因此，action `a` 的 marginal probability 需要对所有可能的 denoising path 进行 marginalization：

```
p(a) = Σ_{paths leading to a} p(path)
```

这个求和涉及指数级的路径数量，在实际中 **完全不可计算（intractable）**。

这就是为什么传统的 RL 方法（如 policy gradient）无法直接应用于 dVLA —— 它们需要评估 action 的概率，而这个概率在 discrete diffusion 框架下不可计算。

### 1.4 dVLA-RL 的核心创新：Trajectory-Level Objective

dVLA-RL 的关键洞察是：**与其试图计算 intractable 的 marginal action probability，不如直接优化 denoising trajectory 的 joint probability**。

具体而言，dVLA-RL 将整个 denoising process 建模为一个 Markov Decision Process (MDP)：

**MDP 定义：**
- **State** `sₜ`：在第 t 步 denoising 时的 partial action sequence（包含已 unmask 的 token 和仍处于 masked 状态的 position）
- **Action** `aₜ`：在当前步骤选择 unmask 哪些 position 以及预测什么 token
- **Transition** `P(sₜ₊₁ | sₜ, aₜ)`：从当前 partial sequence 到下一步的确定性转移
- **Reward** `r`：在 denoising 完成后基于最终 action 的任务奖励
- **Policy** `π(aₜ | sₜ)`：由 dVLA 模型参数化的每步 denoising 策略

在这个 MDP 框架下，一条完整的 denoising trajectory τ = (s₀, a₀, s₁, a₁, ..., sₖ, aₖ) 的 joint probability 为：

```
p(τ) = ∏ₜ π(aₜ | sₜ) = ∏ₜ p(denoising step t)
```

**这个概率是完全 tractable 的！** 因为每个 step-wise transition 都是模型直接输出的分布（对每个 masked position 的 token 预测分布），它们的乘积可以直接计算。

### 1.5 RL 训练目标的推导

有了 tractable 的 trajectory probability，dVLA-RL 可以使用 policy gradient 类方法来优化。具体而言，定义 RL 目标为：

```
J(θ) = E_τ~π_θ [R(τ)]
```

其中 R(τ) 是基于最终生成 action 的任务奖励。使用 policy gradient（如 REINFORCE 或更先进的 PPO/GRPO 变体），梯度可以写为：

```
∇J(θ) = E_τ~π_θ [∇log p(τ) · R(τ)]
       = E_τ~π_θ [Σₜ ∇log π(aₜ|sₜ) · R(τ)]
```

这里的关键洞察是：**trajectory probability 的对数等于各步 transition 概率的对数之和**，这正好是 Markov property 的直接推论。

这种公式化带来了几个重要优势：

1. **数学上的 tractability**：每个 step-wise transition 的概率就是模型在该步对每个 unmask 操作的预测概率，完全可以计算。

2. **与 SFT 的兼容性**：SFT 目标可以看作是 RL 目标的特例（当所有 transition 都匹配 ground truth 时），因此 RL 可以在 SFT 基础上无缝 fine-tune。

3. **Variable denoising steps 的原生支持**：不同 trajectory 可以有不同的步数，因为 trajectory probability 的计算不依赖于固定步数。

### 1.6 Unified Step Scheduling

dVLA-RL 的另一个重要创新是 unified step scheduling。在传统的 discrete diffusion 中，denoising 步数 K 通常固定（如 K=10 或 K=100）。但不同任务的复杂度不同：

- **简单任务**（如 reaching）：少量 denoising 步即可生成高质量 action
- **复杂任务**（如 precise insertion）：需要更多 denoising 步来 refine action

dVLA-RL 利用 trajectory-level objective 的内在灵活性，为不同任务分配不同的 denoising 步数。这种 "tailoring to task complexity" 的策略带来了双重收益：
- 简单任务减少步数 → 提高推理效率
- 复杂任务增加步数 → 提高成功率

### 1.7 与 Continuous VLA 的本质区别总结

| 维度 | Continuous VLA (π₀等) | Autoregressive VLA (OpenVLA等) | Discrete Diffusion VLA (dVLA等) |
|------|----------------------|-------------------------------|--------------------------------|
| Action 空间 | 连续 | 离散 token 序列 | 离散 token 序列 |
| 生成方式 | Flow matching / continuous diffusion | Autoregressive (逐 token) | Masked generative (并行解码) |
| 概率计算 | Score function (连续概率密度) | Token 概率乘积 (tractable) | Marginal probability (intractable) |
| RL 应用 | FlowGRPO, Flow Q-Learning | SimpleVLA-RL, VLA-RL | **本文首次解决** |
| 推理效率 | 中等 (需多步 ODE 求解) | 较低 (逐 token 生成) | 较高 (并行解码) |
| 统一表示 | 困难 (连续-离散混合) | 部分统一 | **完全统一** (单一 token 空间) |
| 迭代 refinement | 隐式 (通过去噪) | 无 (一次性生成) | 显式 (多步 unmask) |

dVLA-RL 的本质贡献在于：**它解决了 discrete diffusion VLA 概率不可计算的难题，使得 RL fine-tuning 这一强大的策略优化工具可以应用于这一类有前途的 VLA 架构**。

---

## Q2: 与 Spatial AGI 的关系 — VLA 训练方法论对空间智能的意义、Discrete Action Space 的优势

### 2.1 Spatial AGI 的核心挑战与 VLA 的角色

Spatial AGI（空间通用人工智能）旨在构建能够在三维物理世界中感知、推理和行动的通用智能系统。这一目标面临几个根本性挑战：

**挑战一：多模态 Grounding**

Spatial AGI 需要将抽象的语义理解（语言、概念）grounding 到具体的物理感知（视觉、触觉）和物理行动中。VLA 模型天然地提供了这种 grounding —— 从视觉和语言输入直接映射到机器人 action。dVLA 更进一步，通过将所有模态统一到单一离散 token 空间，消除了模态间的 "representation gap"。

**挑战二：空间推理与 Action 的耦合**

Spatial AGI 不仅需要理解空间关系（"杯子在桌子左边"），更需要将这种理解转化为精确的物理 action（如何伸手去拿杯子）。VLA 模型的 action generation quality 直接决定了空间推理能否有效转化为物理行为。dVLA-RL 通过 RL fine-tuning 显著提升了 action quality，这意味着更好的 spatial reasoning-to-action 转化。

**挑战三：任务复杂度的自适应性**

在真实世界中，Spatial AGI 面临的任务复杂度高度可变：从简单的 grasping 到复杂的多步 manipulation。dVLA-RL 的 unified step scheduling 为不同复杂度任务提供自适应的计算资源分配，这是迈向 general-purpose spatial intelligence 的重要一步。

### 2.2 Discrete Action Space 对空间智能的独特优势

Discrete action space 在 Spatial AGI 场景下具有几个独特优势：

**1. 语义可解释性**

离散 token 天然具有语义可解释性。当 dVLA 生成 action token `[MOVE_TO][POS_3,4,5][GRASP]` 时，每个 token 都对应明确的语义含义。这种可解释性对于 Spatial AGI 至关重要：
- 支持人类理解和调试机器人行为
- 便于构建 hierarchical planning（高层语义规划 → 低层 action 执行）
- 为 safety verification 提供基础（可以在 token 级别进行检查和约束）

Continuous action 向量 `[0.3, -0.1, 0.5, ...]` 则缺乏直接的语义可解释性，使得理解和约束行为更加困难。

**2. 与 Language 的原生对齐**

Discrete action token 与 language token 共享同一 representation space，这使得：
- 语言指令可以直接 "编译" 为 action token 序列
- 机器人可以 "解释" 自己的行为（通过将 action token 解码回语言）
- 支持 language-conditioned learning（通过共享 vocabulary 中的语义信息）

这种对齐对于 Spatial AGI 尤为重要，因为它支持将人类的自然语言指令直接转化为物理行动——这是 human-robot interaction 的核心需求。

**3. 组合泛化（Compositional Generalization）**

离散 token 支持组合泛化：如果模型学会了 "抓取" 和 "杯子" 的 token 表示，它可以通过组合这些 token 来执行 "抓取杯子" 的新动作。这种组合性是智能的核心属性，也是 Spatial AGI 实现开放世界泛化的关键。

连续 action 空间的泛化通常依赖于分布相似性，而非语义组合性，使得 zero-shot 的组合泛化更加困难。

**4. 安全约束的 Token-Level 表达**

在 Spatial AGI 的安全关键场景中（如手术机器人、协作机器人），需要在 action 层面施加精确约束。离散 token 允许 token-level 的安全约束：
- 禁止某些 "危险" token 的生成
- 在特定上下文中限制可用的 token vocabulary
- 实现细粒度的 action masking

### 2.3 RL Fine-Tuning 对空间任务的意义

dVLA-RL 的 RL fine-tuning 对 Spatial AGI 具有深远意义：

**从模仿到超越**

SFT（监督微调）只能让模型模仿 demonstration data 中的行为。但 demonstration data 通常来自人类遥操作，存在：
- 不一致性（不同人操作方式不同）
- 次优性（人类操作可能不是最优的）
- 覆盖度有限（无法覆盖所有场景）

RL fine-tuning 允许模型通过环境交互（或模拟器交互）超越 demonstration 的限制，发现更优的策略。这对于 Spatial AGI 至关重要——真实世界的空间任务是高度复杂的，仅靠模仿无法达到 expert 级别的性能。

**Reward-Driven 的空间学习**

RL 允许通过 reward function 定义空间任务的目标（如 "成功抓取物体"、"准确放置到目标位置"），而不需要提供详细的 action-level demonstration。这种 reward-driven 的学习方式更适合 Spatial AGI 的开放世界设定：
- 在新环境中，定义 reward function 比收集 demonstration 更容易
- Reward function 可以编码复杂的空间约束（如避障、精确对齐）
- 支持 long-horizon 的空间任务（通过 reward shaping 或 hierarchical RL）

**Sim-to-Real Transfer 的桥梁**

dVLA-RL 的 RL 训练可以在模拟器中进行（如 RoboTwin 2.0），然后迁移到真实世界。Discrete action space 在 sim-to-real transfer 中具有优势：
- 离散 action 的语义不变性（模拟器和真实世界中的 "GRASP" 语义一致）
- 减少 continuous action 的精度敏感性问题
- 更容易实现 domain randomization（在 token 层面而非数值层面）

### 2.4 Trajectory-Level Optimization 与空间规划

dVLA-RL 的 trajectory-level optimization 与 Spatial AGI 中的空间规划有着深层联系：

**Denoising Trajectory 作为 Planning Trajectory**

dVLA 的 denoising process 本身就是一种 "规划" 过程：
- 初始状态：完全不确定的 action（全 mask）
- 中间状态：部分确定的 action（部分 unmask）
- 最终状态：完全确定的 action（全 unmask）

这类比于人类的空间规划过程：从粗略意图（"我要拿那个杯子"）到具体动作序列（手部运动轨迹）。dVLA-RL 通过 RL 优化这一 "规划" 过程，使得 denoising trajectory 不仅是 action 生成过程，更是空间推理过程。

**Multi-Step Refinement 与 Spatial Reasoning**

dVLA 的多步 denoising 支持迭代式的空间推理：
- 早期步骤：确定粗略的空间方向（如接近物体的方向）
- 中间步骤：refine 空间参数（如调整接近角度）
- 最终步骤：确定精确参数（如最终的 grasp 姿态）

这种 coarse-to-fine 的空间推理模式与人类认知中的空间规划过程高度一致。

### 2.5 对 Spatial AGI 方法论的启示

dVLA-RL 为 Spatial AGI 提供了几条重要的方法论启示：

**启示一：统一表示 + 分层优化**

dVLA 证明了将多模态统一到单一离散 token 空间的可行性，dVLA-RL 进一步证明了可以在这种统一表示上进行 RL 优化。这暗示了 Spatial AGI 的一种可能架构：
- 底层：统一的 discrete token representation（感知、推理、行动）
- 中层：discrete diffusion 作为 generative backbone
- 顶层：RL fine-tuning 实现任务特定优化

**启示二：计算资源的弹性分配**

Unified step scheduling 展示了一个重要原则：**不同任务应该分配不同的计算资源**。这对 Spatial AGI 尤为重要，因为空间任务的复杂度变化极大。未来的 Spatial AGI 系统可能需要一个 "computational controller" 来根据任务复杂度动态调整推理深度。

**启示三：Tractability-Driven 的算法设计**

dVLA-RL 的核心创新是找到了一个 tractable 的优化目标（trajectory probability 替代 marginal action probability）。这种 tractability-driven 的设计哲学对 Spatial AGI 具有普遍意义：在复杂的空间智能系统中，需要找到可以被有效优化的代理目标，而非执着于理论最优但不可计算的目标。

### 2.6 空间表征学习的未来方向

基于 dVLA-RL 的方法论，Spatial AGI 的空间表征学习可以在以下方向进一步发展：

**方向一：3D Spatial Token**

将 dVLA 的 token 化扩展到 3D 空间表征：
- 将 3D 点云、voxel、mesh 等空间表征 token 化
- 在 discrete diffusion 框架中统一 2D 图像、3D 场景和 action
- 通过 RL 优化 3D spatial reasoning 的 denoising trajectory

**方向二：Spatial-Temporal Joint Modeling**

扩展 dVLA-RL 到时空联合建模：
- Action chunk 不仅包含瞬时 action，还包含时间序列 action
- Denoising process 同时推理空间配置和时间规划
- RL reward 同时考虑空间精度和时间效率

**方向三：Physical Reasoning Integration**

将物理推理集成到 dVLA-RL 框架中：
- 在 token vocabulary 中加入物理概念（如 "friction", "gravity", "collision"）
- Denoising process 不仅生成 action，还生成物理推理链
- RL reward 包含物理合理性约束

---

## Q3: 创新点和局限性 — 与其他 VLA 训练方法（如 π₀、OpenVLA 等）对比

### 3.1 dVLA-RL 的核心创新点

**创新点一：首次解决 Discrete Diffusion VLA 的 RL 训练难题**

这是本文最核心的贡献。在 dVLA-RL 之前，discrete diffusion VLA 只能使用 SFT 训练，而 RL fine-tuning 的潜力完全未被挖掘。虽然 continuous diffusion VLA 和 autoregressive VLA 都已有各自的 RL 方法（FlowGRPO、SimpleVLA-RL 等），但 discrete diffusion VLA 的 RL 由于 marginal probability 的 intractability 而长期未解。

dVLA-RL 通过将优化目标从 marginal action probability 转移到 joint trajectory probability，巧妙地绕过了这一难题。这种 "trajectory-level reformulation" 的思路不仅解决了 dVLA 的训练问题，也为其他 intractable marginal probability 场景提供了方法论参考。

**创新点二：Denoising Process 作为 MDP 的形式化**

将 discrete diffusion 的 denoising process 形式化为 MDP 是一个优雅的数学贡献。这种形式化：
- 为 RL 训练提供了标准的 MDP 框架
- 揭示了 denoising process 的序贯决策本质
- 为未来在 generative model 上应用 RL 提供了模板

具体而言，每步 denoising 对应 MDP 的一个 time step，partial unmask 的序列是 state，选择 unmask 操作是 action，任务完成度是 reward。这种映射关系使得所有标准 RL 算法（PPO、GRPO、REINFORCE 等）都可以直接应用。

**创新点三：Variable Step Scheduling**

dVLA-RL 利用 trajectory-level objective 的内在灵活性，引入了 variable denoising steps。这是对传统 discrete diffusion 的固定步数设定的重要突破：
- 简单任务使用更少步数 → 推理速度提升
- 复杂任务使用更多步数 → 成功率提升
- 在多任务场景中实现全局最优的效率-效果权衡

这种 "task-adaptive computation" 的理念与人类认知中的 System 1 / System 2 思考模式相呼应：简单行为快速执行（少量 denoising 步），复杂行为深度思考（大量 denoising 步）。

**创新点四：与 World-Action Model 的竞争力**

在 RoboTwin 2.0 上，dVLA-RL 不仅大幅超越 SFT baseline（30.6% 提升），还与强 World-Action Model (WAM) baseline 表现出竞争力。这具有重要意义，因为 WAM 方法通常使用额外的 world model 来预测 action 的后果，从而辅助决策。dVLA-RL 仅通过 RL fine-tuning 就达到了 comparable 的性能，展示了其方法的高效性。

### 3.2 与其他 VLA 训练方法的详细对比

#### 3.2.1 dVLA-RL vs. π₀ / π₀.₅

π₀ (Physical Intelligence) 是 continuous flow matching VLA 的代表作品，π₀.₅ 进一步扩展到 open-world 场景。

| 维度 | π₀ / π₀.₅ | dVLA-RL |
|------|-----------|---------|
| Action 空间 | 连续 | 离散 token |
| 生成机制 | Flow matching (ODE) | Discrete diffusion (masked generation) |
| 训练方式 | SFT + (可能的 RL) | SFT + RL (本文方法) |
| 表示统一性 | 视觉/语言用离散 token，action 用连续向量 | 全部统一到离散 token |
| RL 挑战 | 连续概率密度（可通过 score matching 解决） | Marginal probability intractable (本文解决) |
| 推理方式 | ODE 求解（连续积分） | 并行解码 + 多步 refinement |
| 工程复杂度 | 中等（需处理连续-离散混合） | 较低（统一 token 处理） |

π₀ 的优势在于连续空间中更精细的 action 控制，而 dVLA-RL 的优势在于统一的表示和更高效的推理（并行解码）。

#### 3.2.2 dVLA-RL vs. OpenVLA

OpenVLA 是 autoregressive discrete VLA 的代表作。

| 维度 | OpenVLA | dVLA-RL |
|------|---------|---------|
| Action 生成 | Autoregressive (逐 token) | Discrete diffusion (并行解码) |
| 基础架构 | Llama 2 (causal LM) | Masked generative model |
| RL 可行性 | 直接可行（token 概率乘积） | 需要本文的 trajectory-level reformulation |
| 推理速度 | 较慢（逐 token，n 步生成 n 个 token） | 较快（并行解码，k 步生成 n 个 token，k << n） |
| 已有 RL 方法 | SimpleVLA-RL, VLA-RL 等 | 本文首次 |
| Token 交互 | 严格 causal（只看前面的 token） | 全局（所有 token 相互可见） |
| 训练数据 | 970k 真实机器人演示 | (基于 dVLA base) |

OpenVLA 的 causal generation 限制了 token 间的双向交互——action token a₅ 只能看到 a₁-a₄，无法利用 a₆-aₙ 的信息。dVLA 的 discrete diffusion 允许所有 token 的全局交互，这在 action 建模中更具优势（action chunk 中的 token 通常存在强相关性）。

#### 3.2.3 dVLA-RL vs. FlowGRPO / Flow Q-Learning

FlowGRPO 和 Flow Q-Learning 是 continuous diffusion/flow VLA 的 RL 训练方法。

| 维度 | FlowGRPO / Flow Q-Learning | dVLA-RL |
|------|---------------------------|---------|
| 适用框架 | Continuous diffusion / flow matching | Discrete diffusion |
| RL 目标 | 基于连续概率密度 | 基于离散 trajectory probability |
| 优化方式 | Score function gradient | Step-wise transition probability gradient |
| 数学框架 | Stochastic calculus, ODE/SDE | MDP, Markov chain |
| Discretization | 不需要（连续空间） | 需要（action → token） |
| Tokenization 误差 | 无（连续 action） | 存在（离散化损失） |

dVLA-RL 与 FlowGRPO 等方法的对比本质上是离散与连续表示之争。FlowGRPO 在连续空间中避免了 quantization error，但需要处理 continuous probability density 的估计。dVLA-RL 虽然存在 discretization loss，但获得了表示统一性和推理效率。

#### 3.2.4 dVLA-RL vs. TGRPO / Interactive Post-Training

TGRPO (chen2025tgrpofinetuningvisionlanguageactionmodel) 和 Interactive Post-Training (tan2025interactiveposttrainingvisionlanguageactionmodels) 是其他 VLA 后训练方法。

这些方法通常关注 autoregressive VLA 的 RL fine-tuning 或通过交互数据改进策略。dVLA-RL 的区别在于：
- 适用架构不同（discrete diffusion vs. autoregressive）
- 优化目标不同（trajectory probability vs. token probability）
- 解决的数学难题不同（marginal intractability vs. standard RL）

### 3.3 技术优势分析

**优势一：训练效果的显著提升**

dVLA-RL 在 LIBERO 上达到 99.7% 的成功率，这是一个极高的数字。在 RoboTwin 2.0 上 30.6% 的 SFT 提升 也表明 RL fine-tuning 带来了实质性的策略改进，而非微调级别的微调。这说明 dVLA 的 SFT 训练确实存在显著的改进空间，而 RL 是填补这一空间的有效工具。

**优势二：理论框架的通用性**

虽然 dVLA-RL 专注于 discrete diffusion VLA，但其核心思想——将 intractable marginal probability 转化为 tractable trajectory probability——具有更广泛的适用性。任何具有多步生成过程的 generative model（如 discrete diffusion for image generation、masked language model 等）都可以应用类似的 trajectory-level RL 方法。

**优势三：与现有 VLA 生态的兼容性**

dVLA-RL 作为 fine-tuning 方法，可以叠加在任何 dVLA SFT 模型之上，不需要修改基础架构。这种 plug-and-play 的特性使其易于在现有 VLA 生态中部署。

### 3.4 局限性分析

**局限一：Discretization Error**

将连续 action 离散化为 token 不可避免地引入 quantization error。虽然通过增加 vocabulary size 可以减小这一误差，但更大的 vocabulary 会增加模型复杂度和训练难度。这一问题在需要高精度 action 的任务（如精密装配）中尤为突出。

**局限二：Token Vocabulary 设计的挑战**

dVLA 需要设计合适的 action token vocabulary。这涉及：
- 离散化粒度的选择（太粗 → 精度不足；太细 → vocabulary 爆炸）
- Action chunk 长度的确定（固定 vs. 可变）
- 不同机器人 embodiment 的 vocabulary 兼容性

这些问题在 continuous VLA 中不存在，是 discrete action space 的固有挑战。

**局限三：RL 训练的稳定性**

虽然 dVLA-RL 在理论上提供了 tractable 的优化目标，但 RL 训练的稳定性问题仍然存在：
- Reward function 设计的复杂性
- Exploration-exploitation trade-off
- Training instability（尤其在多任务设置中）
- Sim-to-real gap（如果 RL 在模拟器中训练）

论文虽然展示了 RL 的效果，但对训练稳定性和超参数敏感性的分析可能不够充分。

**局限四：Computational Overhead**

虽然 discrete diffusion 允许并行解码，但 RL 训练本身需要大量的 environment interaction（或 simulation）。这与 SFT 相比是显著的额外计算开销。特别是：
- 每个 RL episode 需要完整的 denoising trajectory
- 多个 denoising steps 的 gradient 计算
- Reward function 的评估

**局限五：Variable Step Scheduling 的优化难度**

虽然 variable step scheduling 在概念上优雅，但在实践中：
- 如何为每个任务确定最优步数？（需要 task-specific tuning 还是自动学习？）
- 在新任务上如何 generalization？
- 在多任务训练中如何平衡不同步数的 sample？

论文可能需要更多分析来说明 step scheduling 的实际效果和鲁棒性。

**局限六：Benchmark 限制**

LIBERO 和 RoboTwin 2.0 虽然是重要的 benchmark，但它们主要是 tabletop manipulation 任务。dVLA-RL 在以下更具挑战性的场景中的表现仍然未知：
- Locomotion（如双足行走、崎岖地形导航）
- Whole-body manipulation（如全身协调操作）
- Human-robot interaction（如与人协作完成任务）
- In-the-wild deployment（如非结构化环境中的操作）

更广泛的 benchmark 评估对于验证 dVLA-RL 的通用性至关重要。

**局限七：Sim-to-Real 的 Gap**

论文主要在仿真环境中验证（LIBERO、RoboTwin 2.0）。虽然在仿真中 RL 可以大量采样训练，但 sim-to-real 的 gap 可能影响真实世界的部署效果。Discrete action space 在 sim-to-real 中有一定优势（语义不变性），但 visual rendering 的差异和物理动力学的不匹配仍然是挑战。

**局限八：Long-Horizon 任务的扩展性**

论文评估的任务主要是 single-step 或 short-horizon 的 manipulation。对于 long-horizon 的复合任务（如 "做一顿饭"，涉及多个子任务的序列执行），dVLA-RL 的扩展性需要进一步验证。Variable step scheduling 可能在 long-horizon 任务中面临更大的优化难度。

### 3.5 更广阔的技术背景：RL for Generative Models

dVLA-RL 的工作属于一个更宏大的技术趋势：**将 RL 应用于 generative models 的 fine-tuning**。这一趋势包括：

- **LLM 的 RLHF**：将 RL 应用于 autoregressive language model，通过人类反馈优化模型输出
- **Diffusion Model 的 RL**：将 RL 应用于 image/video generation 的 diffusion model
- **VLA 的 RL**：将 RL 应用于 robot action generation（dVLA-RL 属于此类）

dVLA-RL 在这一趋势中的独特位置是：它是第一个将 RL 应用于 **discrete diffusion** generative model 的工作（在 VLA 领域）。之前的 diffusion RL 工作主要关注 continuous diffusion（如 FlowGRPO、Diffusion-DPO 等），而 discrete diffusion 的 RL 由于其独特的概率计算挑战而未被探索。

### 3.6 未来工作方向

基于 dVLA-RL 的贡献和局限性，以下是有价值的未来研究方向：

**方向一：Online RL for dVLA**

dVLA-RL 目前可能使用 offline RL 或有限的 online interaction。Online RL（在真实环境或高保真模拟器中持续学习）可以进一步提升策略质量，但也带来 safety 和 exploration 的挑战。

**方向二：Hierarchical dVLA-RL**

将 dVLA-RL 扩展到 hierarchical setting：
- 高层 dVLA：生成 sub-goal token（如 "reach", "grasp", "place"）
- 低层 dVLA：将 sub-goal token 转化为具体 action token
- 两层都使用 trajectory-level RL 优化

**方向三：Multi-Embodiment dVLA-RL**

扩展 dVLA-RL 到多种机器人 embodiment：
- 统一的 action token vocabulary 跨不同机器人平台
- RL reward 考虑 embodiment-specific 的约束
- 通过 shared representation 实现 cross-embodiment 的知识迁移

**方向四：World Model 集成**

论文提到 dVLA-RL 与 World-Action Model baseline 具有竞争力。一个自然的未来方向是将 world model 直接集成到 dVLA-RL 中：
- World model 预测 action 的后果
- 用 world model 的预测来 shape RL reward
- 实现模型based 的 planning + RL

**方向五：Better Tokenization Scheme**

研究更好的 action tokenization 方法来减少 discretization error：
- Hierarchical tokenization（粗粒度 token + 细粒度 refinement）
- Adaptive tokenization（根据任务需求动态调整粒度）
- Continuous-discrete hybrid（关键参数用连续表示，结构信息用离散 token）

### 3.7 方法论启示

dVLA-RL 给 VLA 研究社区带来了几条重要的方法论启示：

**启示一：不要被 Intractability 吓倒**

dVLA-RL 展示了面对 intractable probability 时，可以通过 reformulation（从 marginal 到 trajectory）找到 tractable 的替代目标。这种思路可以推广到其他 intractable 场景。

**启示二：Generative Architecture 决定 RL 方法**

不同的 generative architecture（autoregressive vs. continuous diffusion vs. discrete diffusion）需要不同的 RL 方法。没有 one-size-fits-all 的 RL 解决方案。

**启示三：Unified Representation 简化 Training Pipeline**

dVLA 的统一 token 表示简化了 RL 训练——所有模态在同一空间中，RL 优化可以无缝地涵盖感知、推理和行动。这与其他方法中需要分别处理不同模态形成对比。

### 3.8 对 VLA 发展路线的思考

dVLA-RL 的出现使三种 VLA 架构（continuous diffusion、autoregressive、discrete diffusion）都有了各自的 RL 训练方法。一个自然的问题是：**哪种架构最终会胜出？**

基于当前的分析，我认为没有简单的答案。每种架构都有其根本性的优势和劣势：

- **Continuous diffusion VLA**：在 action 精度和连续控制方面有天然优势，适合需要精细控制的任务
- **Autoregressive VLA**：与 LLM 生态最兼容，训练和推理工具链最成熟
- **Discrete diffusion VLA**：在表示统一性和推理效率方面最优，且 discrete token 带来了独特的语义优势

未来的发展可能是这些方法的融合：例如使用 discrete token 表示高层规划，continuous 表示低层精细 action；或者使用 discrete diffusion 作为 planner，continuous diffusion 作为 executor。

dVLA-RL 的贡献使得 discrete diffusion 这一路线变得更加有竞争力，为这一融合提供了重要的技术基础。

---

## 总结

dVLA-RL 是 VLA 训练方法领域的一项重要工作。它：

1. **首次解决了 discrete diffusion VLA 的 RL 训练难题**，通过将 marginal action probability 的优化转化为 tractable 的 trajectory probability 优化
2. **将 denoising process 形式化为 MDP**，使得标准 RL 算法可以直接应用
3. **提出 variable step scheduling**，实现了 task-adaptive 的计算资源分配
4. **在 LIBERO 上达到 99.7% 成功率**，在 RoboTwin 2.0 上实现 30.6% 的 SFT 提升

对于 Spatial AGI 而言，dVLA-RL 的意义在于：
- 证明了 discrete action representation 在空间任务中的有效性
- 提供了 RL-driven 的空间策略优化方法
- 展示了 unified representation + hierarchical optimization 的潜力
- 为 3D spatial reasoning 和 physical reasoning 的 token 化提供了方法论基础

局限性方面，discretization error、vocabulary 设计、RL 稳定性、sim-to-real gap 和 long-horizon 扩展性是需要进一步解决的挑战。但这些挑战并不掩盖 dVLA-RL 在理论和方法上的开创性贡献——它为 discrete diffusion VLA 打开了 RL fine-tuning 的大门，这一方向的影响将持续到 Spatial AGI 的更远未来。

---

## 参考文献（论文中引用的关键工作）

- **π₀**: [pi_0] Physical Intelligence 的 flow matching VLA
- **π₀.₅**: [intelligence2025pi05visionlanguageactionmodelopenworld] 开放世界 VLA
- **OpenVLA**: [openvla] 7B 参数开源 VLA (Kim et al., 2024)
- **OpenVLA-OFT**: [openvla-oft] OpenVLA 的 flow-based 扩展
- **dVLA**: [wen2025dvla] 原始 discrete diffusion VLA
- **MMAct**: [liang2025mmactlearnmultimodalparallel] 多模态并行 action 生成
- **DREAM**: [ye2025dream] Discrete reasoning/action model
- **MMada**: [liu2026mmada, yang2026mmada] 多模态自回归 diffusion
- **D1**: [zhao2025d1scalingreasoningdiffusion] Scaling reasoning diffusion
- **DiffuCoder**: [gong2026diffucoder] Diffusion-based code generation
- **Flow Q-Learning**: [park2025flowqlearning] Flow matching + Q-learning
- **FlowGRPO**: [liu2025flowgrpotrainingflowmatching] GRPO for flow matching
- **π-TTTR**: [chen2026pitextttrlonlinerlfinetuning] Online RL for π₀
- **VLA-RL**: [lu2025vlarlmasterfulgeneralrobotic] General robotic VLA-RL
- **SimpleVLA-RL**: [li2026simplevlarl] Simple RL for autoregressive VLA
- **RL^inf**: [yu2025rlinf] Efficient RL framework
- **RLinfVLA**: [zang2026rlinfvlaunifiedefficientframework] Unified efficient RL for VLA
- **TGRPO**: [chen2025tgrpofinetuningvisionlanguageactionmodel] GRPO fine-tuning for VLA
- **Interactive Post-Training**: [tan2025interactiveposttrainingvisionlanguageactionmodels] 交互式后训练
- **RL Token Bootstrapping**: [xu2026rltokenbootstrappingonline] Online RL via token bootstrapping
- **FastWAM**: [yuan2026fastwamworldactionmodels] Fast World-Action Model
- **GigaWorld**: [ye2026gigaworldpolicyefficientactioncenteredworldaction] Action-centered world model
- **Cosmos**: [kim2026cosmos] World foundation model
- **LIBERO**: [liu2023liberobenchmarkingknowledgetransfer] Knowledge transfer benchmark
- **RoboTwin 2.0**: [chen2025robotwin20scalabledata] Scalable data benchmark
- **GRPO**: [SchulmanWDRK17] Proximal policy optimization (相关方法基础)
- **Argmax Diffusion**: [hoogeboom2021argmax] Discrete diffusion via argmax
- **Simple Diffusion**: [sahoo2024simple] Simple discrete diffusion
- **LLaDA**: [you2026llada] Large language diffusion model
- **Causal World Modeling**: [li2026causalworldmodelingrobot] Causal world model for robotics
- **DiffuCoder**: [gong2026diffucoder] Diffusion-based code model
- **MMada**: [Zhang_2026_CVPR] (CVPR 2026 相关工作)
- **Revolutionizing RL**: [wang2025revolutionizingreinforcementlearningframework] RL framework
- **UniVLA**: [bu2025univlalearningacttaskcentric] Task-centric VLA learning
- **Motus**: [bi2026motus] Motion generation model