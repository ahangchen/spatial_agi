# Mask World Model: Predicting What Matters for Robust Robot Policy Learning

**发表日期**: 2026-04-21  
**arXiv链接**: https://arxiv.org/abs/2604.19683  
**PDF链接**: https://arxiv.org/pdf/2604.19683  
**HTML版本**: https://arxiv.org/html/2604.19683v1  
**GitHub**: https://github.com/LYFCLOUDFAN/mask-world-model  
**会议**: ICML 2026  
**作者**: Yunfan Lou, Xiaowei Chi, Xiaojie Zhang, Zezhong Qian, Chengxuan Li, Rongyu Zhang, Yaoxu Lyu, Guoyu Song, Chuyao Fu, Haoxuan Xu, Pengwei Wang, Shanghang Zhang  
**机构**: Peking University (PKU), Beijing Academy of Artificial Intelligence (BAAI)

**Tags**: #WorldModel #MaskPrediction #RobotPolicy #Diffusion #Generalization #LIBERO #RLBench #SemanticBottleneck #GeometricInformationBottleneck #DiT #FlowMatching

---

## 核心问题

### Q1: 核心算法原理

**问题**: 这篇文章的核心算法原理是什么？

**分析**:

#### 1. 核心思想和动机

MWM 的核心思想可以用一句话概括：**用语义 mask 代替 RGB 像素作为世界模型的预测目标，通过几何信息瓶颈过滤无关视觉噪声。**

动机来自一个关键观察：当前基于视频生成的世界模型（如 Cosmos、GE-ACT 等）优化的是 RGB 像素预测，但 RGB 帧包含大量与控制无关的"干扰变量"（nuisance variables）：

- **纹理** (texture)：物体表面的颜色和花纹细节
- **光照变化** (illumination)：阴影、高光、反射
- **动态背景** (dynamic backgrounds)：与任务无关的背景变化

这些问题在闭环执行中变得更加严重：小的外观驱动误差会随时间累积，导致预测漂移（predictive drift）和脆弱的策略。RGB 预测迫使模型将外观变化与交互动态纠缠在一起，将光照或背景变化与接触相关的运动同等对待。

MWM 的解决方案是：**预测语义 mask 的演化而非 RGB 帧**。语义 mask 天然形成一个"几何信息瓶颈"（geometric information bottleneck），它：
- 保留物体身份、空间布局和交互相关结构
- 丢弃冗余的外观信息
- 强制模型捕获物理动态和接触关系的本质

**关键设计原则**：训练时使用语义标注监督，但部署时完全基于原始 RGB，无需外部分割模型。

#### 2. 主要技术方法

MWM 的架构由两个核心组件构成：**Mask 动力学 Backbone** 和 **Diffusion Policy Head**。

##### 2.1 Mask 动力学 Backbone

**(a) 离散到连续的 Mask 编码**
- 语义 mask 是离散的（{0,1}^H×W×C），而视频扩散 backbone 操作连续潜在空间
- MWM 将 mask 渲染为 RGB 兼容图像（使用固定调色板），然后用同一个预训练视频 VAE 编码
- 设计巧妙：RGB 帧 z^o = E(o_t)，渲染 mask z^m = E(m̃_t)，共享编码器
- 避免修改预训练 VAE，保持一致的潜在接口

**(b) 潜在归一化、插值和堆叠**
- 通道级归一化：z̄ = (z - μ_VAE) / σ_VAE
- 时间重采样到固定长度，多视图潜在堆叠为统一序列
- 替代传统的像素空间 3D patchification，训练更稳定

**(c) 条件流匹配（Conditional Flow Matching）**
- 使用 Flow Matching 而非标准扩散（DDPM/DDIM）
- 线性插值路径：z_s = (1-s)z_0 + s·z_1，s ∈ [0,1]
- Transformer 预测速度场 v_θ(z_s, s, c_t)
- 损失函数：L_mask = E[w(s)||v_θ - (z_1 - z_0)||²]

**(d) 固定记忆槽条件化**
- 输入序列 = [记忆 RGB 潜在, 未来 mask 潜在]
- 记忆槽（n=4 帧 RGB）强制扩散时间为零（干净输入）
- 未来槽（τ=5 帧 mask）按扩散级别 s 加噪
- x_s = b ⊙ ẑ^o_{memory} + (1-b) ⊙ z̃_s
- L_mask 只在未来槽上计算

**(e) 3D RoPE + 压缩感知插值缩放**
- 在 (t, h, w) 坐标上应用 3D Rotary Position Embedding
- 由于 token 在 VAE 压缩后的潜在网格中，使用插值缩放 γ = (γ_t, γ_h, γ_w) 保持位置相位一致
- RoPE(t,h,w) ← RoPE(γ_t·t, γ_h·h, γ_w·w)

**(f) AdaIN 式时间步调制**
- RMSNorm 归一化后，时间步依赖的 scale & shift 调制
- Modulate(x̄; s) = x̄ ⊙ (1 + α(s)) + β(s)
- 增强在归一化 VAE 潜在空间上的训练稳定性

**(g) 预测特征库（Predictive Feature Bank）**
- 在 mask 预测过程中缓存所有 transformer 层的隐藏状态
- H_t = {h^(1)_t, ..., h^(L)_t}
- 保留视图/空间/时间索引结构，作为策略头的 cross-attention 键/值

**(h) 多视图处理**
- 多视图 token 主要通过共享时空自注意力处理
- 周期性应用跨视图混合层（cross-view mixing layers）
- 信息在视图间流动，同时保留视图特定结构

##### 2.2 Mask 引导的 Diffusion Policy

**(a) 动作-状态 token**
- 输入向量 u_t = [a_t, s_t]，拼接动作和本体感知状态
- 线性投影为动作 token

**(b) 动作空间扩散目标**
- 条件去噪器：ϕ_ξ(ũ, σ, H_t)
- 加权 score-matching 目标：L_act = E[λ(σ)||ϕ_ξ + ε/σ||²]
- 条件来自预测特征库 H_t 和文本嵌入

#### 3. 算法流程和关键步骤

**两阶段训练协议**：

##### Stage 1: Mask 动力学预训练
1. 输入：4 帧 RGB 记忆窗口 + 语言指令
2. 目标：预测 5 帧未来语义 mask 潜在
3. 使用 flow matching 损失 L_mask
4. 增强鲁棒性：caption dropout (p=0.06)，轻微噪声注入 (0.1)
5. 总共覆盖 9 帧视频

##### Stage 2: 策略学习
1. 从 Stage-1 checkpoint 初始化
2. 仅使用动作损失 L_stage2 = L_act（无 mask/视频重建损失）
3. VAE 冻结，DiT backbone 和 action expert 联合训练
4. 动作空间：15 维（7-DoF 姿态 + 1-DoF 夹爪 + 7-DoF 状态）
5. 动作 chunk：H_a = 36 步
6. 梯度反向传播到 backbone，使预测特征更控制对齐

##### 推理
1. Receding Horizon Control (RHC)
2. 通过 10 步 Euler 离散扩散采样预测 36 步动作 chunk
3. 执行第一个动作，下一时间步重新规划
4. 纯 RGB 输入，无需语义分割模型

#### 4. 输入输出

**输入**：
- 多视图 RGB 观测 o_t = {o_t^(1), ..., o_t^(V)}
- 语言指令 p
- 本体感知状态 s_t

**输出**：
- 连续动作 a_t（末端执行器运动 + 夹爪命令）
- 15 维动作空间，36 步动作 chunk

**训练额外输入**：
- 语义 mask m_t ∈ {0,1}^{H×W×C}（仅 Stage 1，离线标注）

### Q2: 与 Spatial AGI 的关系

**问题**: 这篇文章与通用空间智能（Spatial AGI）有什么关系？

**分析**:

#### 1. 如何理解和表示空间

MWM 通过语义 mask 提供了一种**隐式的空间表示**：

- **物体级空间表示**：语义 mask 编码了场景中每个任务相关实体的空间范围（物体、机器人臂/夹爪）
- **几何信息瓶颈**：mask 作为一种空间抽象，保留了物体的几何形状和空间位置，同时过滤掉纹理和颜色等非空间信息
- **潜在空间的空间结构**：VAE 潜在空间保留了空间维度 (H' × W')，3D RoPE 编码了时空位置关系
- **多视图空间融合**：多视图 token 的跨视图混合提供了 3D 空间感知的雏形

**关键洞察**：语义 mask 本质上是空间智能的一种基础抽象——它回答了"什么在哪里"的问题，而不关心"它看起来怎样"。

#### 2. 如何处理空间关系

- **物体间关系**：语义 mask 天然编码了物体之间的空间邻接和遮挡关系
- **接触关系**：mask 预测捕获了机器人夹爪与物体的接触动态，这是操控的核心空间关系
- **时序空间演化**：预测未来 mask 的演化 = 预测物体在空间中的运动轨迹
- **空间布局保持**：预测特征库保留了 view-/space-/time-indexed 结构

#### 3. 对 Spatial AGI 的启发

**这是本文对 Spatial AGI 最大的贡献所在：**

1. **"预测什么"比"预测多准"更重要**：与其追求高保真 RGB 生成（外观真实感），不如预测任务相关的抽象表征。这暗示 Spatial AGI 应该关注几何和动态的结构性预测，而非视觉保真度。

2. **信息瓶颈作为归纳偏置**：mask 预测作为一种归纳偏置，强制模型学习物理本质。对于 Spatial AGI，这意味着好的空间表示不应该是像素级的重建，而应该是几何和拓扑层面的抽象。

3. **语义分割作为空间表示的基础层**：这暗示语义分割（或更一般的语义空间分解）可能是 spatial intelligence 的一种基础表示。在 3D 空间中，对应的可能是 3D semantic instance segmentation。

4. **语义前瞻（Semantic Lookahead）**：MWM 不仅理解当前空间状态，还预测未来空间状态的演化。这种"空间预测"能力是 Spatial AGI 的核心需求。

5. **训练-部署解耦**：语义监督只在训练时使用，部署时纯 RGB。这种设计模式可以推广到 Spatial AGI——使用丰富的空间标注（3D 框、点云分割等）训练，但部署时只需普通传感器输入。

#### 4. 可以应用到哪些 Spatial AGI 场景

- **机器人操控**：直接应用，基于语义 mask 预测的动作生成
- **场景理解**：将 mask 预测扩展到更大规模的场景理解
- **导航与路径规划**：预测环境中障碍物的 mask 演化用于路径规划
- **人机交互**：预测人类动作的 mask 演化，用于安全协作
- **3D 空间推理**：将 2D mask 扩展到 3D semantic mask（如 3D instance segmentation），可能是更好的世界模型预测目标
- **数字孪生**：在工业场景中预测设备和工件的 mask 状态演化
- **自动驾驶**：预测道路上车辆、行人、障碍物的语义 mask 演化

### Q3: 创新点和局限性

**问题**: 基于前面的分析，这个方法的主要创新点和局限性是什么？

**分析**:

#### 1. 主要创新点

**(1) 预测空间的根本性转变**
- 从 RGB 像素预测转向语义 mask 预测
- 不是简单的表示替换，而是对"世界模型应该预测什么"这一根本问题的重新思考
- 实验证明这种转变带来了巨大且一致的性能提升

**(2) 几何信息瓶颈（Geometric Information Bottleneck）**
- 将信息论中的信息瓶颈原则具体化为 mask 预测
- 优雅的归纳偏置：保留决策关键结构，过滤无关光测变化
- 比传统的 latent space bottleneck（如 Dreamer 系列）更可解释

**(3) 训练-部署解耦设计**
- 训练时使用语义标注监督
- 部署时纯 RGB 输入，无需外部分割模型
- 这消除了实际部署中对实时语义分割的依赖

**(4) 两阶段训练协议**
- Stage 1 学习 mask 动力学（物理理解）
- Stage 2 端到端优化策略（控制对齐）
- Stage 2 的梯度反传到 backbone，使预测特征更具控制效用
- 无需 Stage 2 的辅助 mask 损失

**(5) 系统性消融实验**
- 三种 mask 利用方式对比（MWM-C1, MWM-C2, MWM）
- 证明了性能提升来自表示和目标的转变，而非特定架构设计
- Random token pruning 鲁棒性测试

**(6) 多视图处理**
- 第三人称 + 腕部视角的有效融合
- 跨视图混合层设计

#### 2. 主要局限性

**(1) 依赖语义分割质量**
- 训练数据需要像素级语义 mask 标注
- 分割错误会传播到下游策略
- 使用 RoboEngine 进行自动标注，但质量受限于标注工具

**(2) Mask 粒度限制**
- 语义 mask 是粗粒度的空间表示
- 可能丢失某些细粒度操控所需的视觉信息（如物体表面材质、透明度、微小形变）
- 对于需要精确视觉反馈的任务（如精细装配），mask 可能不够

**(3) 任务范围有限**
- 仅在桌面操控任务上验证（LIBERO、RLBench、Franka 真实机器人）
- 未涉及导航、大范围空间理解、多房间场景
- 未验证在高度动态或非结构化环境中的表现

**(4) 额外标注成本**
- 虽然部署时不需要分割模型，但训练时仍需要语义标注
- 使用 RoboEngine 自动化标注部分缓解了这个问题
- 对于新场景，仍需要标注流程

**(5) 计算开销**
- 基于 DiT 的 backbone（28 个 transformer blocks）
- Flow matching + diffusion policy 的双重扩散过程
- 推理需要 10 步 Euler 采样
- 实时性可能在高速任务中成为瓶颈

**(6) 颜色编码方案**
- 将离散 mask 渲染为 RGB 兼容图像使用固定调色板
- 这种"hack"虽然避免了修改 VAE，但可能不是最优的
- 颜色冲突和调色板大小的限制可能影响分割类别的数量

#### 3. 与其他相关工作的对比

| 维度 | MWM | Dreamer 系列 | GE-ACT / Cosmos | π0 |
|------|-----|-------------|-----------------|-----|
| 预测目标 | 语义 mask | Latent state | RGB 帧 | 直接策略 |
| 信息瓶颈 | 几何（显式） | 潜在空间（隐式） | 无/隐式 | 无 |
| 可解释性 | 高（mask 可视化） | 低 | 中（RGB 可视化） | 低 |
| 部署输入 | 纯 RGB | 纯 RGB | 纯 RGB | 纯 RGB |
| 空间理解 | 物体级几何 | 隐式 | 像素级 | 隐式 |
| LIBERO 平均 SR | 98.3% | - | 96.5% (GE-ACT) | ~90% |
| RLBench 平均 SR | 68.3% | - | 30.8% (GE-ACT) | ~50% |

**对比分析**：
- MWM vs Dreamer：Dreamer 用潜在空间做瓶颈（隐式、不可解释），MWM 用显式语义空间做瓶颈（可解释、几何导向）
- MWM vs GE-ACT/Cosmos：最直接的对比，同为世界模型+策略头架构，MWM 仅改变预测目标就带来巨大提升
- MWM vs π0：π0 跳过世界模型直接做策略，MWM 的世界模型提供了更好的空间预测和泛化能力

---

## 核心技术发现

### 发现 1：预测目标的选择比模型架构更重要

MWM 的三种变体（MWM-C1、MWM-C2、MWM）在相同训练数据和 recipe 下，都一致优于 RGB 世界模型。论文明确指出"性能提升主要来自表示和目标的转变，而非特定架构设计"。

**证据**：
- MWM-C1（显式 mask 解码 + IDM）vs Cosmos+IDM：0.675 → 0.810
- MWM-C2（潜在特征 + 动作扩散）vs Cosmos+LatentIDM：0.873 → 0.918
- MWM（完整模型 + 多视图）vs GE-ACT：0.965 → 0.983

### 发现 2：语义瓶颈减少长时域漂移

在长时域任务 LIBERO-10 上，mask 预测的优势最大：
- MWM-C1 vs Cosmos+IDM：0.488 → 0.704（+21.6%）
- 这说明 RGB 世界模型在外观变化上的误差累积在长时域任务中尤为严重

### 发现 3：潜在特征优于显式解码

MWM-C2（直接使用预测潜在特征）优于 MWM-C1（显式解码 mask 再用 IDM）：
- 0.810 → 0.918
- 原因：避免了显式解码引入的误差传播
- 这暗示中间层的预测表征比最终解码结果更有控制价值

### 发现 4：随机 Token Pruning 下的卓越鲁棒性

MWM 在随机删除高达 90% 的视觉 token 时仍保持竞争力：
- 即使丢失大量纹理信息，mask-centric 特征依然提供可靠的控制指导
- 这验证了几何信息瓶颈确实使模型聚焦于结构而非外观

### 发现 5：50 次演示即可实现真实世界泛化

- 真实机器人实验中，每任务仅 50 次演示
- MWM 达到 67.5% 平均成功率（GE-ACT 23.8%，π0 38.8%）
- 在外观变化（背景、光照、物体颜色）下保持强泛化

---

## 与 Spatial AGI 的关系

### 直接贡献

1. **空间表示学习范式**：证明了语义层面的空间表示（mask）比像素级表示更适合机器人控制，为 Spatial AGI 的表示学习提供了实证支持。

2. **空间预测能力**：MWM 的"语义前瞻"（semantic lookahead）能力——预测物体在未来时间步的空间位置和形状——是 Spatial AGI 核心能力的具体实例。

3. **鲁棒空间理解**：在视觉干扰下保持空间理解的能力，是 Spatial AGI 在真实世界部署的必要条件。

### 技术启发

1. **3D Semantic Mask 预测**：将 MWM 的思路从 2D 扩展到 3D，预测 3D 实例分割 mask 的演化，可能构建更强大的 3D 空间世界模型。结合 3DGS 表示，这可能是 Spatial AGI 的一个重要方向。

2. **层次化空间抽象**：MWM 使用单一粒度的语义 mask。Spatial AGI 可能需要多层次的抽象——从像素到部件、物体、场景、环境。

3. **空间关系预测**：MWM 隐式学习物体间的空间关系。显式预测空间关系（如"物体 A 在物体 B 上方"、"夹爪接触物体 C"）可能进一步提升 Spatial AGI 的推理能力。

4. **从操控到通用空间智能**：MWM 聚焦于桌面操控。将其泛化到导航、场景理解、物理推理等更广泛的空间任务，是迈向 Spatial AGI 的重要步骤。

### 应用场景

| 场景 | MWM 的适用性 | 扩展方向 |
|------|-------------|---------|
| 桌面操控 | ✅ 直接适用 | 增加更复杂的接触推理 |
| 移动操控 | 🔄 部分适用 | 需要导航能力 |
| 自动驾驶 | 💡 启发性 | 3D mask 预测 + 大规模场景 |
| 工业 4.0 | ✅ 适用 | 数字孪生 + mask 预测 |
| 家庭机器人 | 🔄 部分适用 | 需要更多物体类别 |
| 空间推理 | 💡 启发性 | 显式空间关系预测 |

---

## 个人思考

### 最令人兴奋的发现

**"预测什么"比"预测多准"更重要**——这个洞察具有深远的哲学意义。

它暗示了 AI 系统的智能不在于它能否完美重建感官输入（这是当前生成式 AI 的主流范式），而在于它能否提取和预测与决策相关的结构化信息。这与人类认知的"稀疏编码"原理一致——我们不会记住看到的所有像素，而是记住物体、关系和事件。

MWM 的语义 mask 预测可以类比为人类对场景的"功能性理解"：我们不需要知道杯子的确切颜色和纹理来抓取它，我们只需要知道它的位置、形状和与手的相对关系。

### 潜在局限

1. **语义闭集假设**：MWM 的 mask 假设了预定义的语义类别（机器人臂、夹爪、任务相关物体）。在开放世界场景中，这个假设可能不成立。Spatial AGI 需要处理开放集的空间理解。

2. **2D 到 3D 的鸿沟**：MWM 的 mask 是 2D 的。真正的 Spatial AGI 需要 3D 空间理解。如何将 mask 预测扩展到 3D（如 3D semantic field、NeRF 中的语义分割）是一个关键挑战。

3. **物理推理的缺失**：MWM 预测 mask 的视觉演化，但不显式建模物理定律（如重力、摩擦、碰撞）。Spatial AGI 可能需要结合物理仿真或物理约束。

4. **Long-horizon 的真正挑战**：虽然 MWM 在 LIBERO-10 上表现不错，但真正的长时域任务（如"做一顿饭"）涉及数百步操作和复杂的空间推理，远超当前 benchmark 的范围。

### 与昨日研究的关联

**与 Mask World Model 最相关的技术趋势**：

1. **World Model 的表示学习**：与 Dreamer 系列一脉相承，但 MWM 选择了显式的语义表示而非隐式的潜在空间
2. **Diffusion for Robotics**：延续了扩散模型在机器人策略中的应用趋势（Diffusion Policy、π0 等）
3. **语义驱动的控制**：与使用 VLM/Grounding 的方法（如 PokeVLA）互补，MWM 将语义作为预测目标而非输入增强

---

## 关键数据

### 模型参数

| 组件 | 规格 |
|------|------|
| Backbone | DiT-style, 28 transformer blocks |
| VAE | 预训练视频 VAE（共享编码 RGB 和 mask） |
| 记忆窗口 | n = 4 帧 RGB |
| 预测窗口 | τ = 5 帧 mask 潜在 |
| 总帧覆盖 | 9 帧视频 |
| 动作空间 | 15 维（7-DoF 姿态 + 1-DoF 夹爪 + 7-DoF 状态） |
| 动作 chunk | H_a = 36 步 |
| 推理采样 | 10 步 Euler 离散扩散 |
| Caption dropout | p = 0.06 |
| 条件帧噪声 | 0.1 |

### 数据集

| Benchmark | 任务数 | 评估方式 |
|-----------|--------|---------|
| LIBERO-Spatial | 10 | 500 episodes/suite |
| LIBERO-Object | 10 | 500 episodes/suite |
| LIBERO-Goal | 10 | 500 episodes/suite |
| LIBERO-10 | 10 (长时域) | 500 episodes/suite |
| RLBench | 6 代表任务 | 20 episodes/task |
| 真实 Franka | 4 任务 | 20 trials/task |

### 性能指标

#### LIBERO Benchmark (Success Rate)

| 方法 | Spatial | Object | Goal | Libero-10 | Average |
|------|---------|--------|------|-----------|---------|
| OpenVLA | - | - | - | - | 低 |
| π0 | - | - | - | - | ~90% |
| Cosmos+IDM | - | - | - | 0.488 | 0.675 |
| Cosmos+LatentIDM | - | - | - | - | 0.873 |
| GE-ACT | - | - | - | - | 0.965 |
| **MWM-C1** | - | - | - | 0.704 | 0.810 |
| **MWM-C2** | - | - | - | - | 0.918 |
| **MWM** | ~99% | ~99% | ~99% | ~96% | **0.983** |

#### RLBench (Success Rate)

| 方法 | 平均 SR |
|------|---------|
| GE-ACT | 30.8% |
| FiS-VLA | 50.0% |
| **MWM** | **68.3%** |

#### 真实世界 Franka 机器人

| 方法 | 平均 SR (4 任务) |
|------|-----------------|
| GE-ACT | 23.8% |
| π0 | 38.8% |
| **MWM** | **67.5%** |

#### 视觉泛化（真实世界，外观变化）

| 方法 | SR_ID | OOD-SR | Retain |
|------|-------|--------|--------|
| GE-ACT | 低 | 低 | 低 |
| π0 | 中 | 中 | 中 |
| **MWM** | **高** | **高** | **高** |

MWM 在背景变化、光照变化和物体颜色变化下均保持强泛化能力。

---

## 总结

### 核心发现总结

Mask World Model (MWM) 是 ICML 2026 的一篇重要论文，它提出了一个简洁但深刻的想法：**世界模型应该预测语义 mask 而非 RGB 像素**。这个看似简单的转变带来了巨大的性能提升：

- LIBERO 98.3%（vs GE-ACT 96.5%）
- RLBench 68.3%（vs GE-ACT 30.8%，2.2x 提升）
- 真实世界 67.5%（vs GE-ACT 23.8%，2.8x 提升）

核心技术贡献包括：几何信息瓶颈、mask-to-RGB 的共享 VAE 编码、条件流匹配、两阶段训练协议。消融实验系统性地证明了性能提升来自预测目标的转变而非架构设计。

### 对 Spatial AGI 的意义

MWM 对 Spatial AGI 研究的启示可以总结为三个层次：

1. **表示层次**：语义 mask 是空间智能的一种基础表示。将其扩展到 3D semantic mask（3D instance segmentation field）可能是构建 3D 空间世界模型的关键。

2. **方法论层次**：信息瓶颈原则——通过选择性地预测任务相关的结构化信息来过滤噪声——是 Spatial AGI 系统设计的通用原则。

3. **哲学层次**："预测什么"比"预测多准"更重要。Spatial AGI 不应该追求完美的感官重建，而应该追求对空间结构和动态的本质理解。

这篇论文代表了一种趋势：从追求生成质量（photometric realism）转向追求决策相关性（decision relevance）。这可能是通往真正 Spatial AGI 的正确方向。

---

**文档创建时间**: 2026-04-24  
**分析方法**: web_fetch + 深度精读  
**论文来源**: https://arxiv.org/html/2604.19683v1  
