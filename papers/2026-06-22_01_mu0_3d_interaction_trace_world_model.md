# μ₀: A Scalable 3D Interaction-Trace World Model — 论文精读分析

> **分析日期**: 2026-06-22
> **分析类型**: 深度精读 + Spatial AGI 关联分析
> **论文来源**: arXiv:2606.13769v2

---

## 论文元信息

| 字段 | 内容 |
|------|------|
| **标题** | μ₀: A Scalable 3D Interaction-Trace World Model |
| **作者** | Seungjae Lee¹, Yoonkyo Jung¹*, Jusuk Lee², Jonghun Shin², Amir Hossein Shahidzadeh¹, Yao-Chih Lee¹, H. Jin Kim², Jia-Bin Huang¹†, Furong Huang¹† |
| **机构** | ¹University of Maryland, College Park; ²Seoul National University |
| **arXiv** | 2606.13769v2 (v1: 2026-06-11, v2: 2026-06-15) |
| **领域** | cs.RO, cs.CV, cs.LG |
| **项目页** | https://mu0-wm.github.io/ |
| **关键词** | world model, 3D interaction trace, robot manipulation, cross-embodiment |

---

## 一句话总结

μ₀ 是一个基于 **3D interaction traces** 的世界模型，它不预测 dense pixels（像视频生成模型那样浪费模型容量），也不直接预测 embodiment-specific actions（像 VLA 模型那样受限于机器人硬件），而是预测 **语义关键点（物体、工具、手、接触区域）在 3D 空间中的平滑运动轨迹**，形成一种紧凑的、embodiment-agnostic 的运动接口，可从海量无标注视频中预训练，再通过轻量级 action expert 迁移到任意机器人平台。

---

## Q1: 核心算法原理

### 1.1 核心思想和动机

#### 1.1.1 机器人学习的数据悖论

μ₀ 的核心动机来自机器人学习中的一个根本性矛盾——**数据悖论**：

- **一方面**，视频数据（包括人类操作视频、机器人示教视频、日常活动视频等）是极其丰富的、可大规模获取的物理行为数据源。这些视频蕴含了大量关于物体交互、运动物理、操作技巧的知识。
- **另一方面**，对机器人控制最有用的监督信号——带 action label 的机器人数据——是稀缺的、昂贵的、硬件特定的，且不同 embodiment 之间不兼容。

这个悖论的核心问题是：**如何高效利用海量无标注视频数据来辅助机器人学习？**

#### 1.1.2 现有方法的痛点

论文分析了现有两条主要路线的局限性：

**路线一：Pixel-space video models（像素空间视频模型）**
- 这类模型（如视频生成模型）可以学习到广泛的视觉先验
- 但它们将大量模型容量浪费在 **dense appearance reconstruction**（密集外观重建）上——包括背景纹理、光照变化、无关物体的渲染等
- 对于机器人操作来说，这些信息大部分是冗余的
- 更关键的是，像素空间模型经常 **无法捕捉 manipulation 所需的 metric geometry（度量几何）、contact structure（接触结构）和 occlusion patterns（遮挡模式）**
- 例如，一个视频生成模型可以生成逼真的"抓取杯子"视频，但它可能并不真正理解杯子在 3D 空间中的精确运动轨迹

**路线二：Direct action models / VLA（直接动作模型）**
- 如 π₀、π₀.5 等 Vision-Language-Action 模型直接预测机器人动作
- 优点是端到端、直接可用
- 致命弱点是 **需要 embodiment-specific 的 action labels**，而这些数据极其稀缺且昂贵
- 不同机器人（UR3、Franka、dexterous hand 等）的动作空间完全不同，预训练知识难以迁移
- 数据规模上限受限于昂贵的遥操作数据采集

**路线三（中间地带）：Motion-centric methods（以运动为中心的方法）**
- 近期的一些方法尝试使用 2D optical flow、3D flow、object trajectories 等中间表示
- 方向正确，但存在三个共性局限：
  1. **欠采样关键区域**：固定网格采样会错过小但任务关键的区域（tool tips、contact patches）
  2. **混淆对象运动与相机运动**：在局部或 2D 图像空间坐标中操作，无法区分物体运动和相机运动
  3. **语言对齐粒度过粗**：使用 episode-level captions 而非 event-level 的细粒度描述

#### 1.1.3 μ₀ 的核心思想：3D Interaction Traces

μ₀ 占据了一个独特的中间位置：

> **不预测 dense pixels，不直接预测 actions，而是预测 3D traces——语义交互关键点的 3D 运动轨迹。**

这一思想的精髓在于：

1. **语义选择（Semantic Selection）**：不是在所有像素上预测运动，而是选择任务相关的语义关键点——物体部件、工具尖端、手指、接触区域等
2. **3D 度量空间**：在全局对齐的 3D 坐标系中预测运动轨迹，保留了 metric geometry 信息
3. **Embodiment-agnostic**：同样的物体运动轨迹可以指导不同形态的机器人执行——trace 描述的是"什么需要移动"，而不是"怎么移动"
4. **事件级语言对齐**：每段运动轨迹与细粒度的语言描述配对，实现多分辨率理解

### 1.2 主要技术方法

#### 1.2.1 TraceExtract 系统

TraceExtract 是 μ₀ 的数据引擎，负责将异构视频（人类操作、机器人示教等）转化为 **event-captioned 3D trace supervision**。这是整个系统的数据基础，也是论文的核心贡献之一。

TraceExtract 包含三个核心模块：

**（A）Semantic Keypoint Sampling（语义关键点采样）**

目标：决定"在哪里测量运动"。

传统方法使用固定网格采样（如 TraceGen），存在严重的 area-bias 问题：
- 背景区域占据大量采样预算
- 小物体可能只分到极少的点
- 接触区域、工具尖端等任务关键区域可能完全被遗漏

TraceExtract 的解决方案：
1. **DINOv2 entity clustering**：提取 DINOv2 patch features，将其聚类为 entity-level groups
2. **Temporal identity propagation**：通过 bipartite matching 在相邻帧之间传播 entity identities（匹配分数结合 feature similarity 和 spatial overlap）
3. **Budget allocation**：给每个 entity 分配与其实际可见 patch coverage 成比例的关键点配额，同时为小但 salient 的实体设置最小分配
4. **Farthest-point sampling**：在每个 entity mask 内使用最远点采样，确保空间多样性
5. **Movement filter**：计算每个关键点的 trace diameter（最大成对位移），标记运动直径超过 τ_m=40 pixels 的点为"moving"，过滤掉静态和背景点

这一过程产生的关键点集 **紧凑且聚焦于 action-informative entities**，相比固定网格方法，能更有效地捕捉小但关键的运动区域。

**（B）3D Trace Construction（3D 轨迹构建）**

目标：在长视频中保持每个关键点的身份和 3D 位置。

挑战：
- 第一人称相机运动（egocentric camera motion）
- 物体进出场景
- 全视频重建的内存限制

解决方案：**Global-Local Reconstruction（全局-局部重建）**

1. **Global sparse pass**：从视频中均匀采样 T_sparse 个 anchor frames，通过 VGGT 进行一次 forward pass，建立全局坐标系 {E_t^sparse} 和共享内参 K^global
2. **Dense local passes**：将视频分割为 T_chunk 帧的不重叠 chunks，每个 chunk 产生局部深度图和 extrinsics
3. **SE(3) alignment**：对每个 chunk，利用其与 anchor frames 的交集，求解刚体变换 A^(c) ∈ SE(3) 将局部坐标映射到全局坐标
4. **Progressive 3D tracking**：使用 TAPIR3D 进行跨 chunk 的渐进式 3D 跟踪——后续 chunk 使用前一 chunk 最后一帧的 3D 世界坐标作为 query

关键设计决策：
- 使用单一共享 K^global 而非 per-chunk intrinsics，避免 chunk 边界处的不连续性
- 每个 chunk 直接对齐到全局 anchors 而非前一个 chunk，使 alignment errors **独立且有界**，不会跨 chunk 累积

**Reference-frame traces**：最终将 tracks 重投影到 per-chunk reference camera，获得 screen-aligned 3D traces T_ref。这一表示既消除了相机运动，又保留了与图像的对齐关系（供视觉 backbone 使用）。还通过 arc-length reparameterization 归一化 trace speed，消除人类和机器人示教之间的速度差异。

**（C）Event-Centric Captioning（事件中心化标注）**

目标：为长视频中的运动片段提供多分辨率的语言描述。

挑战：episode-level captions 错过局部 subgoals，frame-level captions 昂贵且嘈杂。

解决方案：
1. **Motion-centric chunking**：利用 trace 加速度信号确定 captioning 单元
   - 计算 per-frame trace acceleration a_t
   - 用 Savitzky-Golay 滤波器平滑为 ã_t
   - 识别 action anchors：加速度的 prominent peaks p_i
   - 在相邻 peaks 之间的加速度谷底放置 chunk boundaries：b_i = argmin_{t∈[p_i, p_{i+1}]} ã_t
   - 这创造了与 subgoals（reaching, grasping, moving, releasing）对齐的短运动事件
   
2. **Hierarchical VLM captioning**：对每个 chunk，VLM 接收起始帧、中间帧、结束帧（可选地附带 motion mask 和 episode-level task description），生成结构化 caption（描述物体初始状态、发生的交互、状态变化）
3. **Caption merging**：text-only LLM 在滑动窗口上合并相邻 chunk captions，生成细粒度 captions 和粗粒度 task summaries

**数据接口**：TraceExtract 最终将每个视频转化为元组：
```
D_TE = {(I_t, l_c, Q_t, T_ref^{t-h:t+H})}
```
其中 I_t 是观测图像，l_c 是事件/任务 caption，Q_t 是 query-keypoint 集合，T_ref^{t-h:t+H} 包含过去和未来的 3D traces。

据论文声称，TraceExtract 相比 prior 3D trace datasets（如 TraceGen）实现了约 **8×** 的数据规模化。

#### 1.2.2 μ₀ 模型架构

μ₀ 的架构由三个核心组件构成：

**（A）Multi-Modal Conditioning Backbone（多模态条件化骨干）**

负责融合全局意图和度量场景上下文。

1. **VLM backbone**：使用预训练的 SmolVLM2-2.2B 作为 vision-language prefix（截断为前 L_vlm=20 层 text-decoder layers）
   - 输入：RGB 图像（512×512）、tokenized 文本指令、可选的 metric depth map
   - 输出：key-value cache，供 trace expert cross-attend
   
2. **Depth pathway**：由于 metric depth 不在 VLM 的原生输入空间中，μ₀ 设计了特殊的处理路径：
   - Depth map 通过 Turbo colormap 转换为 RGB 图像
   - 通过单独的可训练 patch-embedding stem（从 RGB stem 克隆初始化）
   - 然后与 RGB tokens 共享更深的 SigLIP layers
   - 这样既能利用几何信息，又不破坏预训练的 RGB 统计特性
   
3. **Semantic reuse**：VLM key-value cache 同时供 trace expert 使用，实现了 semantic memory（VLM 保留）与 motion computation（trace expert 学习）的分离

**（B）Permutation-Equivariant Trace Expert（排列等变轨迹专家）**

负责处理可变数量、无序的关键点集合，预测每个关键点的未来 3D 轨迹。

核心设计原则：
1. **Exchangeable queries**：每个关键点作为 exchangeable query，所有 query 共享相同的处理 stack，保证排列等变性——预测结果不依赖于关键点的列出顺序

2. **B-spline targets**：不直接回归 H 步的 waypoints，而是将未来轨迹参数化为 **3次 B-spline 的 D=10 个控制点**
   - **紧凑性**：用少量控制点替代密集 waypoints
   - **平滑性**：B-spline 天然平滑，抑制 tracker jitter 和高频伪影
   - **易于去噪**：降低输出维度，有利于 flow matching
   
   具体拟合过程：
   - 减去当前 anchor 位置，得到 anchor-relative 未来轨迹
   - Per-axis rescaling（使用训练集的 95th-percentile scale）
   - 通过加权 ridge least squares 拟合 B-spline 控制点：P* = argmin ||M ⊙ (BP - T)||²_F + λ²_bsp ||ΓP||²_F
   - 其中 B 是固定的 cubic B-spline basis，Γ 是一阶差分算子，λ_bsp=0.2

3. **Query tokenization**：每个关键点的历史和噪声未来控制点被 tokenize 为 per-query tokens
   - Segment embeddings：区分 history vs. future
   - 2D Fourier embeddings：当前像素位置 (u,v)
   - DINO features：从冻结的 DINO-base 中通过 bilinear grid sampling 获取局部语义特征
   - 这些特征通过 2-layer MLP 融合到 trace tokens 中

**（C）Semantic Flow Matching（语义流匹配）**

负责生成多模态的未来轨迹预测。

动机：即使有了平滑的 spline targets，未来物体运动本质上是不确定的——同一指令可以有多种合理路径，且 traces 可能被截断或部分遮挡。确定性回归器会平均化这些未来，产生不可操作的轨迹。

训练目标：
```
L = L_flow + λ_done · L_done + λ_rig · L_rig
```

1. **L_flow（流匹配损失）**：核心条件流匹配目标
   - 线性概率路径：P_τ = τ·ε + (1-τ)·P*（ε ~ N(0,I), τ ∈ [0,1]）
   - 网络预测从噪声到干净数据的速度场：v_θ(P_τ, τ, F_cond)
   - 目标速度：ε - P*
   - adaLN-Zero 注入 flow-time modulation（每个 Trace Expert layer）

2. **L_done（有效性预测损失）**：per-step 二分类交叉熵
   - 预测每个关键点在每个未来时间步的 visibility/validity
   - 在推理时提供 stop index，冻结遮挡或 track loss 后的轨迹
   - 这对于处理物体被遮挡或离开视野的场景至关重要

3. **L_rig（语义刚性损失）**：保持同一 DINO cluster 内关键点的局部几何
   - 对同一 DINO cluster 内的每对关键点，惩罚其控制点间距离在控制点序列上的方差
   - L_rig = E[1/|R| Σ Var_d(||P̂_{n,d} - P̂_{n',d}||²)]
   - 与需要 GT object segmentation masks 的先前方法不同，μ₀ 使用 TraceExtract 产生的 DINO cluster identities，可直接应用于真实世界数据

推理过程：4步 Euler 积分从 τ=1（噪声）到 τ=0（干净数据），然后通过单次矩阵乘法解码 3D traces：T̂¹ = BP̂。

### 1.3 算法流程和关键步骤（完整 Pipeline）

从视频输入到机器人执行的完整流程：

```
========== 阶段一：数据准备（TraceExtract） ==========

[输入] 异构操作视频（人类视频、机器人示教等）
   ↓
[Step 1] DINOv2 entity clustering → 关键点采样
   - 提取 DINOv2 patch features
   - 聚类为 entity-level groups
   - 按 entity 分配关键点预算
   - Farthest-point sampling 确保空间多样性
   - Movement filter 过滤静态点
   ↓
[Step 2] Global-Local 3D Reconstruction
   - Sparse anchor frames → VGGT → 全局坐标系
   - Dense local chunks → VGGT → 局部深度+extrinsics
   - SE(3) alignment 到全局坐标
   - Progressive 3D tracking with TAPIR3D
   ↓
[Step 3] Reference-frame reprojection
   - 重投影到 per-chunk reference camera
   - Arc-length reparameterization 归一化速度
   ↓
[Step 4] Event-centric captioning
   - Trace 加速度信号 → Savitzky-Golay 滤波
   - Action anchors (peaks) → Chunk boundaries (valleys)
   - VLM captioning（start/mid/end frames）
   - LLM caption merging → hierarchical captions
   ↓
[输出] {observation, trace, language} triplets

========== 阶段二：预训练 μ₀ ==========

[输入] TraceExtract triplets
   ↓
[Step 5] Multi-modal conditioning
   - SmolVLM2-2.2B 编码 RGB + language (+ depth)
   - 输出 key-value cache
   ↓
[Step 6] Trace expert query processing
   - 每个关键点 → query token
   - 融合 DINO features + Fourier embeddings + segment embeddings
   - Cross-attend to VLM key-value cache
   - Self-attention among query tokens
   ↓
[Step 7] Flow matching training
   - 随机采样 τ, ε
   - 构造 P_τ = τ·ε + (1-τ)·P*
   - 预测速度场 v_θ
   - 计算 L_flow + L_done + L_rig
   ↓
[输出] 预训练的 μ₀ world model（frozen）

========== 阶段三：下游适配 ==========

[输入] 目标机器人示教数据（含 action labels）
   ↓
[Step 8] Freeze μ₀, train Action Expert
   - 从 μ₀ 的 partial-denoising step 提取 trace features
   - 注入 VLM features（gated cross-attention）
   - 结合 gripper-camera, proprioception, language
   - Action denoiser 预测 continuous action chunks
   ↓
[输出] 可执行的机器人策略
```

### 1.4 输入输出规格

**预训练阶段输入**：
- RGB 图像 I_t（512×512）
- 事件/任务级语言指令 l_c
- Query keypoints Q_t = {q_n^t}_{n=1}^N（N ∈ [1, 256]）
- 历史 3D traces T_ref^{t-h:t}（h=8 步）
- 可选：metric depth map

**预训练阶段输出**：
- 未来 3D traces T̂_ref^{t:t+H}（H=32 步）
- Per-step validity predictions（哪些关键点在哪些时间步仍然有效）

**下游推理输入**：
- 机器人相机观测（gripper camera RGB）
- Proprioception（机器人本体感知状态）
- 语言指令
- μ₀ 的 trace-denoising features（从单次 partial denoising step 获取）

**下游推理输出**：
- 连续 action chunks（可执行的机器人动作序列）

### 1.5 关键设计决策总结

| 设计选择 | 原因 | 对比 |
|----------|------|------|
| 3D traces 而非 pixels | 紧凑、metric、embodiment-agnostic | Pixel models 浪费容量在外观重建 |
| Semantic keypoints 而非 fixed grid | 聚焦 task-critical 区域 | Fixed grid 错过 tool tips、contact patches |
| B-spline 控制点 而非 raw waypoints | 紧凑、平滑、易于去噪 | Raw waypoints 维度高、有 jitter |
| Flow matching 而非 deterministic regression | 捕捉多模态未来 | 确定性回归会平均化轨迹 |
| Freeze μ₀ + Action Expert | 可复用、可跨 embodiment | 端到端 VLA 需要 embodiment-specific 预训练 |
| DINO cluster rigidity loss | 无需 GT segmentation | 先前方法依赖合成环境的 GT masks |

---

## Q2: 与 Spatial AGI 的关系

### 2.1 如何理解和表示空间——3D Trace 作为空间表示

Spatial AGI 的核心挑战之一是：**如何让 AI 系统真正理解和表示三维物理空间？** μ₀ 给出了一个极其优雅的答案——**3D interaction traces**。

#### 2.1.1 从像素到轨迹：表示范式的转变

传统的空间理解方法主要依赖：
- **2D 像素/特征图**：丢失了深度和度量信息
- **3D 体素/点云**：虽然保留了空间信息，但计算昂贵且包含大量无关信息
- **NeRF/3DGS**：高质量的场景重建，但不直接面向交互和操作
- **隐式 3D 表示**：难以解释和控制

μ₀ 提出的 **3D interaction traces** 是一种全新的空间表示：
- 不是对整个场景的密集重建，而是对 **交互关键点的稀疏 3D 运动轨迹** 的预测
- 每条 trace 是一个语义关键点（物体部件、工具尖端、手指接触点等）在 3D 空间中的运动路径
- 这种表示天然地编码了：空间位置、运动方向、物体间关系、交互时序

#### 2.1.2 为什么 3D Traces 是优秀的空间表示？

从 Spatial AGI 的角度看，3D traces 具有以下优势：

1. **语义锚定（Semantic Anchoring）**：每条 trace 不只是一个 3D 点的运动，而是通过 DINOv2 clustering 与具体语义实体（物体、工具、手）绑定的。这意味着 AI 不仅知道"这个点在移动"，还知道"这是咖啡杯把手的移动轨迹"。

2. **度量精度（Metric Precision）**：在全局对齐的 3D 坐标系中，traces 保留了真实的物理尺度。这对于需要精确空间推理的 Spatial AGI 任务（如抓取、放置、避障）至关重要。

3. **运动语义（Motion Semantics）**：Traces 不只是静态的空间描述，而是 **运动的**——它们描述了"什么在移动"、"如何移动"、"移动到哪里"。这种动态性是 Spatial AGI 理解物理交互的基础。

4. **层次化表示（Hierarchical Representation）**：
   - 微观层：单个 keypoint 的 3D 运动轨迹
   - 中观层：同一 entity cluster 内多个 keypoints 的刚性/非刚性运动
   - 宏观层：多个 entities 之间的时空关系（如手抓住杯子倒水）
   
   这种层次化结构与人类对空间交互的认知方式高度一致。

5. **时间延伸（Temporal Extension）**：Traces 天然包含时间维度——不仅描述"在哪里"，还描述"什么时候在那里"和"将要到哪里"。这种时空连续性是 Spatial AGI 进行预测和规划的基础。

#### 2.1.3 Trace 作为 Spatial AGI 的"通用语言"

对 Spatial AGI 而言，3D traces 可能扮演类似"通用语言"的角色：
- 不同传感器（RGB camera、depth camera、tactile sensor）的信息可以转化为 traces
- 不同 embodiment（机械臂、灵巧手、移动机器人）的行为可以转化为或从 traces 推导
- 不同任务（操作、导航、场景理解）可以统一在 trace 表示下

### 2.2 如何处理空间关系——对象、工具、手、接触点的运动轨迹

#### 2.2.1 空间关系的 Trace 表示

μ₀ 通过四类关键交互点来捕捉空间关系：

1. **Objects（物体）**：被操作对象的运动轨迹
   - 例如：咖啡杯被抓起、移动、放置的完整 3D 路径
   - 物体的运动反映了任务的进展和意图

2. **Tools（工具）**：工具的运动轨迹
   - 例如：螺丝刀的尖端轨迹、锤子的挥动路径
   - 工具的运动编码了操作技能和精度要求
   - TraceExtract 通过 semantic sampling 确保 tool tips 获得 adequate keypoint budget

3. **Hands（手/末端执行器）**：操作者的手部运动
   - 例如：手指接近物体、握紧、旋转、释放的完整过程
   - 手部 traces 为机器人 action expert 提供了运动模板

4. **Contact Regions（接触区域）**：交互接触点的运动
   - 例如：手指与物体表面的接触点变化
   - 接触信息对于精细操作（如 in-hand manipulation）至关重要

#### 2.2.2 空间关系的编码方式

μ₀ 通过多种机制编码这些空间关系：

**（A）DINO Cluster-based Rigidity**
- 同一 DINO cluster 内的关键点被约束为保持局部几何关系
- 这意味着同一物体的不同部件（如咖啡杯的杯身和把手）在运动中保持合理的空间关系
- 通过 L_rig 损失函数实现：惩罚同一 cluster 内控制点间距离的方差

**（B）Cross-Entity Interaction**
- 不同 entities 的 traces 在时间上对齐，形成交互模式
- 例如：手的轨迹接近物体轨迹的时间点标记了"抓取"事件的开始
- Event-centric captioning 自动捕捉这些交互事件

**（C）Global 3D Alignment**
- 所有 traces 在全局 3D 坐标系中对齐
- 消除了相机运动的干扰，使得不同视角、不同视频中的交互模式可以比较
- Progressive 3D tracking 确保跨 chunk 的身份连续性

**（D）Permutation-Equivariant Processing**
- Trace Expert 以集合的方式处理所有关键点
- 隐式地学习了关键点之间的空间关系，而不依赖于特定的排列顺序

#### 2.2.3 空间推理能力

从 Spatial AGI 的角度，μ₀ 展现了几种关键的空间推理能力：

1. **空间预测**：给定当前观测和指令，预测未来 3D 运动轨迹
2. **空间约束**：通过 rigidity loss 理解物体的刚性/非刚性属性
3. **空间交互**：捕捉手-物体、工具-工件的交互模式
4. **空间泛化**：embodiment-agnostic 表示使得空间知识可以跨平台迁移

### 2.3 对 Spatial AGI 的启发

#### 2.3.1 Embodiment-Agnostic 表示的重要性

这是 μ₀ 对 Spatial AGI 最重要的启发。传统的 Spatial AGI 研究往往陷入一个困境：**空间知识是和 embodiment 绑定的**。一个在 UR3 机械臂上训练的策略，很难直接迁移到 Franka 或 dexterous hand 上。这种 embodiment binding 严重限制了 Spatial AGI 的可扩展性。

μ₀ 的核心洞察是：**如果我们将空间交互表示为"什么需要移动"（what should move）而非"怎么移动"（how to move），就可以解耦空间知识和具体执行**。

具体来说：
- **3D trace** 描述了"咖啡杯需要从桌上移动到架子上"这一空间目标
- 这个描述对 UR3、Franka、dexterous hand 乃至人形机器人都是相同的
- 不同的 embodiment 只需要各自的 action expert 来将 trace 翻译为具体动作
- 这使得空间知识可以 **从海量无标注视频中大规模学习**，而不受 embodiment 限制

对 Spatial AGI 的启示：
1. **可扩展性**：空间知识可以从互联网级视频数据中学习
2. **可迁移性**：同一套空间先验可以服务于多种机器人平台
3. **模块化**：世界模型（理解空间）和策略模型（执行动作）可以解耦设计和训练

#### 2.3.2 中间表示的设计哲学

μ₀ 展示了一个重要的设计哲学：**选择正确的中间表示是通向 Spatial AGI 的关键**。

对比三种表示层次：

```
太抽象 ←——— 中间地带 ———→ 太具体
  |              |              |
Language    3D Traces      Raw Actions/Pixels
  |              |              |
缺乏空间     恰好足够的      冗余 + embodiment
精度和因果   几何+运动+语义   绑定 + 容量浪费
```

3D traces 的"恰好"之处在于：
- **足够具体**：包含了 3D 度量几何、运动学、接触信息
- **足够抽象**：去除了外观渲染（纹理、光照）和 embodiment 细节（关节角度、电机力矩）
- **可组合**：traces 可以作为条件输入各种 downstream 模型

这种"Goldilocks 原则"——**不多不少，恰好够用**——是 Spatial AGI 表示设计的核心原则。

#### 2.3.3 数据引擎思维

TraceExtract 系统展示了 Spatial AGI 的另一个重要思维模式：**数据引擎比模型本身更重要**。

- 模型架构可以改进，但如果缺少大规模高质量数据，进步空间有限
- TraceExtract 将非结构化视频转化为结构化 3D trace supervision，实现了 **8× 的数据规模化**
- 这种"感知→提取→标注→训练"的 pipeline 思维可以推广到更多 Spatial AGI 场景

对 Spatial AGI 的启示：未来的系统不应只关注模型设计，更应关注 **如何自动化地从海量非结构化数据中提取结构化空间知识**。

### 2.4 可以应用到哪些 Spatial AGI 场景

#### 2.4.1 跨具身操作（Cross-Embodiment Manipulation）

这是 μ₀ 最直接的应用场景。论文已展示：
- 从纯视频预训练的 μ₀ 可以通过 action expert 迁移到 UR3 机械臂
- 在真实世界任务中达到 91.7% 平均成功率
- 超越了使用 action-labeled 预训练的 π₀（71.7%）和 π₀.5（80.0%）

更广泛的想象：
- **人形机器人**：从人类活动视频中学习全身操作 traces
- **灵巧手**：从人类手部操作视频学习 in-hand manipulation traces
- **双臂协同**：从人类双手操作视频中学习协同 traces
- **移动操作**：结合导航 traces 和操作 traces

#### 2.4.2 场景理解与预测

μ₀ 的 trace 预测能力可以直接用于场景理解：
- **活动预测**：预测人类在当前场景中的下一步行动轨迹
- **安全隐患检测**：预测潜在的危险交互（如碰撞轨迹）
- **任务完成度评估**：通过比较 predicted traces 和实际 traces 评估任务进展
- **场景动态变化预测**：预测多个物体的运动趋势

#### 2.4.3 视频理解与生成

3D traces 作为视频理解的中间表示：
- **动作识别**：traces 编码了精细的运动模式
- **视频摘要**：event-centric chunking 自动识别关键动作片段
- **视频生成条件控制**：用 traces 引导视频生成模型产生物理合理的运动
- **视频编辑**：通过修改 traces 来编辑视频中的物体运动

#### 2.4.4 自主驾驶与导航

虽然 μ₀ 目前聚焦于桌面操作，但其方法论可迁移到：
- **交通参与者轨迹预测**：行人、车辆的 3D 运动轨迹
- **自动驾驶决策**：ego-vehicle 和周围物体的交互 traces
- **无人机导航**：复杂环境中的 3D 路径规划

#### 2.4.5 AR/VR 与人机交互

- **手势识别与预测**：3D hand traces 提供精确的手势信息
- **虚拟物体交互**：预测用户意图操控的虚拟物体运动
- **混合现实**：在真实场景中叠加 predicted traces 用于辅助操作

---

## Q3: 创新点和局限性

### 3.1 主要创新点

#### 3.1.1 与 Pixel-Space Models 的本质区别

μ₀ 与 pixel-space world models（如视频生成模型用于机器人学习）有根本性的区别：

| 维度 | Pixel-Space Models | μ₀ (3D Trace World Model) |
|------|-------------------|---------------------------|
| **预测目标** | 每个像素的 RGB 值 | 语义关键点的 3D 位置 |
| **信息密度** | 冗余（包含背景、纹理、光照） | 紧凑（仅交互相关点） |
| **度量信息** | 隐式/不保证 | 显式 3D 度量坐标 |
| **模型容量分配** | 大量用于外观重建 | 聚焦于运动和交互 |
| **训练数据需求** | 大量计算用于渲染 | 计算更高效 |
| **可解释性** | 黑箱（像素到像素） | 可视化轨迹（直观） |
| **控制接口** | 需要额外的 track extraction | 直接的 trace → action 映射 |

本质区别在于：**pixel-space models 学习的是"场景看起来怎样"，而 μ₀ 学习的是"场景中发生了什么"**。前者是 appearance-centric 的，后者是 interaction-centric 的。

#### 3.1.2 与 Direct Action Models 的本质区别

| 维度 | Direct Action Models (VLA) | μ₀ |
|------|---------------------------|-----|
| **预训练数据** | 需要 action-labeled 机器人数据 | 仅需视频（无 action labels） |
| **Embodiment 绑定** | 强绑定（特定机器人 DOF） | 无绑定（embodiment-agnostic） |
| **可扩展性** | 受限于遥操作数据采集 | 可从互联网视频扩展 |
| **迁移性** | 跨 embodiment 迁移困难 | 通过替换 action expert 自然迁移 |
| **数据效率** | 预训练数据昂贵 | 预训练数据近乎无限 |

μ₀ 的本质创新在于 **将"运动理解"和"动作执行"解耦**：
- 运动理解（world model）从视频中学习，不依赖 embodiment
- 动作执行（action expert）针对特定机器人训练，利用 trace features 作为桥梁

#### 3.1.3 与 TraceGen 的关键改进

TraceGen（lee2026tracegen）是最接近的先前工作，也使用 3D traces。μ₀ 在三个关键维度上实现了改进：

1. **Semantic Keypoint Selection vs. Fixed Grid**
   - TraceGen：在固定网格上采样，area-biased
   - μ₀：DINOv2 entity clustering + adaptive budget allocation
   - 改进效果：任务关键区域（tool tips、contact patches）获得更多 keypoints

2. **Global 3D Alignment vs. Depth-Conditioned Input**
   - TraceGen：需要推理时提供 depth 输入
   - μ₀：global-local reconstruction + reference-frame reprojection
   - 改进效果：消除相机运动混淆，不需要推理时 depth

3. **Event-Level Captions vs. Episode-Level Captions**
   - TraceGen：使用 episode-level captions
   - μ₀：motion-centric chunking + hierarchical VLM captioning
   - 改进效果：细粒度语言-运动对齐，更好的任务理解

#### 3.1.4 B-spline 控制点 + Flow Matching 的创新组合

μ₀ 将 B-spline 参数化与 conditional flow matching 相结合，这是一个巧妙的创新：

1. **B-spline 参数化**提供了：
   - 紧凑的表示（D=10 控制点 vs H=32 waypoints）
   - 天然平滑性（抑制 tracker jitter）
   - 降低了 flow matching 的目标维度

2. **Flow Matching** 提供了：
   - 多模态未来分布建模能力
   - 可控的生成过程（通过条件化）
   - 比 GAN 更稳定的训练

3. **创新组合的协同效应**：
   - B-spline 使 flow matching 在低维空间中工作，更稳定
   - Flow matching 使 B-spline 控制点可以表达多模态未来
   - 两者结合产生了 **平滑且多样化** 的轨迹预测

#### 3.1.5 语义刚性损失的实用性

L_rig 的创新在于利用 DINO cluster identities（而非 GT segmentation masks）来约束轨迹一致性：
- 先前方法需要合成环境中才有的 GT object masks
- μ₀ 直接使用 TraceExtract 产生的 DINO clusters
- 使得 rigidity constraint 可以直接应用于真实世界数据

#### 3.1.6 实验验证的全面性

论文的实验设计也非常全面：
- **Trace 预测质量**：2D 和 3D 指标，多种时间跨度，ADE/FDE/DTW
- **仿真实验**：8 个 RoboCasa365 任务
- **真实世界实验**：3 个 UR3 任务，20 次 rollout 评估
- **对比基线全面**：VLM baselines (Gemini, GPT-5.5)、trace models (Track2Act, Hamster, TraceGen)、VLA models (π₀, π₀.5)、Diffusion Policy
- **消融实验**：B-spline parameterization, DINO features, rigidity loss, depth input, historical traces
- **Scaling analysis**：模型大小和数据量的影响

### 3.2 主要局限性

#### 3.2.1 感知 Pipeline 的级联误差

μ₀ 的 traces 完全依赖于感知 pipeline 的输出质量。论文在 Limitations 中明确承认：

> "μ₀ inherits errors from the perception stack used to construct traces: failures in semantic clustering, 3D reconstruction, tracking, or captioning can produce noisy supervision."

具体依赖链：
```
DINOv2 clustering → VGGT 3D reconstruction → TAPIR3D tracking → Savitzky-Golay chunking → VLM captioning
```

每一个环节都可能引入误差：
- **DINOv2 clustering** 可能将同一物体的不同部件分到不同 cluster，或将不同物体重叠
- **VGGT 3D reconstruction** 在纹理稀疏、透明/反光表面上可能失败
- **TAPIR3D tracking** 在快速运动、严重遮挡时可能丢失 track
- **VLM captioning** 可能产生不准确或幻觉性描述

这些误差会 **级联放大**，影响最终 trace 质量。虽然 movement filter 和 rigidity loss 可以部分缓解，但根本问题未完全解决。

#### 3.2.2 缺乏力和触觉信息

论文承认：
> "The trace representation captures geometry and motion but does not explicitly model forces, tactile feedback, or contact modes, which may be important for fine manipulation."

这是 3D trace 表示的固有局限：
- Traces 描述了"运动学"（kinematics）但不描述"动力学"（dynamics）
- 对于需要精确力控制的任务（如插拔、拧螺丝、柔顺装配），仅靠运动轨迹是不够的
- 触觉信息（如滑动检测、力反馈）无法被 3D 位置轨迹捕捉

这意味着对于 **contact-rich fine manipulation** 任务，μ₀ 可能需要额外的 modalities 补充。

#### 3.2.3 计算开销和推理延迟

虽然 μ₀ 的 trace 预测延迟（0.29s）优于大多数 baseline（Track2Act 0.85s, TraceGen 1.20s, Dream2Flow 106.8s），但仍存在：

- **训练成本**：需要预训练 VLM backbone + Trace Expert + TraceExtract pipeline，整体计算需求较高
- **推理开销**：4步 Euler 积分 + action expert denoising，对于高频控制可能仍有挑战
- **Action expert 推理**：需要额外的 partial denoising step 和 gated cross-attention，增加了延迟

论文未提供完整的端到端控制频率数据（如 Hz），这使得与 real-time 控制需求的对比不够清晰。

#### 3.2.4 评估范围有限

论文承认：
> "Our action expert evaluations focus on tabletop manipulation with limited embodiments and task families; broader validation on mobile manipulators, dexterous hands, and longer-horizon tasks remains future work."

具体局限：
- **任务范围**：主要是 tabletop manipulation（桌面操作），未测试导航、全身操作等
- **Embodiment 范围**：仅 UR3 机械臂 + 两指夹爪，未测试 Franka、dexterous hand、人形机器人等
- **时序范围**：单个 trace 预测窗口为 H=32 步，对于长时序任务（multi-step cooking, room cleaning）可能不够
- **场景多样性**：仿真中仅 RoboCasa365 厨房场景，真实世界仅 3 个任务

#### 3.2.5 Top-1 预测的不确定性

从 Table 1 可以观察到：
- μ₀ 的 **Top-1 ADE** 在某些情况下不如最强的 VLM baselines（如 Gemini-3.1-pro 在 T=8 时 0.190 vs μ₀ 的 0.202）
- 但 **Top-5 ADE** 显著优于所有 baselines（0.124 vs 0.161）

这表明：
- μ₀ 的多采样预测中包含更准确的轨迹，但 **单次预测的最优性不如大型 VLM**
- 这对于需要实时决策的场景（如快速动态环境中的操作）可能是问题
- 但对于可以通过多采样+筛选的场景，μ₀ 的优势明显

#### 3.2.6 对 Depth 的依赖

虽然 depth 是 "optional" 的，但论文的实验中 depth 输入带来了改善（参见消融实验）。在实际部署中：
- 不是所有机器人都配备 depth camera
- Depth sensing 在透明/反光物体上可能不可靠
- 这可能限制了 μ₀ 在某些场景中的适用性

#### 3.2.7 Event Captioning 的语言依赖

Hierarchical captioning 依赖 VLM 和 LLM 的质量：
- VLM 可能对特定领域的操作（如精密装配）描述不准确
- Caption 质量直接影响 event chunking 和 trace-language 对齐
- 多语言场景下的泛化性未被验证

### 3.3 与相关工作的对比

#### 3.3.1 与 π₀ 的对比

π₀（Physical Intelligence, 2025）是当前最具代表性的 VLA 模型之一：

| 维度 | π₀ | μ₀ |
|------|-----|-----|
| **预训练范式** | Action-labeled 预训练 | Video-only 预训练 |
| **预测目标** | Robot actions | 3D traces |
| **Backbone** | PaliGemma + flow matching | SmolVLM2-2.2B + trace expert + flow matching |
| **Action supervision** | 预训练阶段使用 | 仅在 action expert fine-tuning 阶段使用 |
| **Embodiment 通用性** | 需要重新训练 | 通过替换 action expert |
| **仿真成功率** | 25.25% (RoboCasa365 avg) | 30.25% (RoboCasa365 avg) |
| **真实世界成功率** | 71.7% (3 UR3 tasks) | 91.7% (3 UR3 tasks) |

关键洞察：**μ₀ 在使用更少 action supervision 的情况下超越了 π₀**，这有力地验证了 trace-based pretraining 的有效性。

#### 3.3.2 与 π₀.5 的对比

π₀.5 是 π₀ 的升级版本，使用了更大规模的 action-labeled 预训练：

| 维度 | π₀.5 | μ₀ |
|------|-------|-----|
| **预训练数据规模** | 大规模 action-labeled | 大规模 video-only |
| **仿真成功率** | 42% (RoboCasa365 avg) | 30.25% |
| **真实世界成功率** | 80.0% (3 UR3 tasks) | 91.7% |
| **数据成本** | 高（遥操作采集） | 低（视频可大规模获取） |

分析：
- 在仿真中 π₀.5 更强，这可能因为它预训练了更多与仿真环境匹配的 action patterns
- 在真实世界中 μ₀ 更强，可能因为 3D traces 更好地捕捉了真实世界的几何和运动多样性
- 这个差异暗示：**trace 表示在 sim-to-real transfer 中可能有优势**，因为 geometry/motion 是跨域不变的

#### 3.3.3 与其他 World Models 的对比

| 方法 | 表示 | 优势 | 劣势 |
|------|------|------|------|
| **Cosmos** (NVIDIA) | Pixel-space | 广泛视觉先验 | 浪费容量，缺几何精度 |
| **PointWorld** | 3D point flow | 度量精度 | 固定网格，缺语义选择 |
| **Dream2Flow** | 2D/3D flow from video | 从视频提取 | 推理慢（106.8s） |
| **3DFlowAction** | 3D flow → action | 直接用于控制 | 精度较低 |
| **Track2Act** | 2D tracks → action | 简单有效 | 丢失 3D 信息 |
| **TraceGen** | 3D traces (fixed grid) | 最接近 μ₀ | 固定网格，需 depth，episode captions |
| **μ₀** | 3D traces (semantic) | 紧凑+语义+3D+事件级 | 依赖感知 pipeline |

#### 3.3.4 与 MolmoMotion 的对比

论文项目页提到了 concurrent work MolmoMotion：
- 同样预测 language-conditioned 的 3D point trajectories
- 也支持迁移到 robot manipulation
- μ₀ 的区别在于 focus on trace-space world modeling + action expert 的分离设计

### 3.4 关键数据汇总

#### Trace 预测质量（Table 1 关键数据）

**3D Trace Prediction（越低越好）**：

| 方法 | Top5-ADE (T=32) | Top5-FDE (T=32) | Top5-DTW (T=32) | 推理时间 |
|------|-----------------|-----------------|-----------------|---------|
| 3DFlowAction | 0.630 | 0.712 | 0.623 | 3.38s |
| Dream2Flow | 0.336 | 0.403 | 0.329 | 106.8s |
| TraceGen | 0.325 | 0.370 | 0.299 | 1.20s |
| **μ₀** | **0.239** | **0.305** | **0.223** | **0.29s** |

μ₀ 在所有 3D 指标上全面领先，且推理速度最快。

#### 仿真结果（RoboCasa365, Table 2）

| 方法 | 平均成功率 | 预训练类型 |
|------|-----------|-----------|
| Diffusion Policy | 22.75% | 无预训练 |
| π₀ | 25.25% | Action-labeled |
| TraceGen + action expert | 23.00% | Video-only |
| **μ₀ + action expert** | **30.25%** | **Video-only** |
| π₀.5 | 42.00% | Action-labeled (大规模) |

#### 真实世界结果（3 UR3 tasks）

| 方法 | 平均成功率 |
|------|-----------|
| VLM + action expert (no trace) | 73.3% |
| π₀ | 71.7% |
| TraceGen + action expert | 81.7% |
| π₀.5 | 80.0% |
| **μ₀ + action expert** | **91.7%** |

---

## 核心技术发现

### 发现一：3D Traces 是可扩展的监督信号

论文最重要的发现是：**3D interaction traces 可以作为连接视频数据和机器人控制的可扩展桥梁**。通过 TraceExtract 系统，异构视频（人类操作、机器人示教、日常活动）可以自动转化为结构化的 3D trace supervision，规模比 prior work 提升 8×。这意味着随着更多视频数据的获取，trace-based 世界模型的性能可以持续提升。

### 发现二：Action-Free 预训练可以超越 Action-Labeled 预训练

在真实世界实验中，μ₀（video-only pretraining）超越了 π₀ 和 π₀.5（action-labeled pretraining），这是非常 surprising 的结果。它暗示：

- **视频数据中蕴含的运动知识比 action labels 更丰富和通用**
- Action labels 虽然精确但受限于特定 embodiment
- 3D traces 作为中间表示，比直接学习 action-to-action 映射更具泛化能力

### 发现三：B-spline + Flow Matching 是轨迹生成的有效组合

D=10 个 B-spline 控制点 + 4步 Euler 积分的 flow matching，在 0.29 秒内完成预测，同时在所有 3D 指标上领先。这一组合的关键优势：
- B-spline 将 H=32 步的轨迹压缩为 10 个控制点
- Flow matching 在低维空间中生成多模态分布
- 两者协同实现了效率和质量的最优平衡

### 发现四：Semantic Keypoint Selection 显著优于 Fixed Grid

DINOv2 entity clustering + adaptive budget allocation 解决了 fixed-grid sampling 的三个核心问题（背景主导、小物体欠采样、关键区域遗漏）。这一改进直接反映在 trace 预测质量和下游任务成功率上（μ₀ vs. TraceGen 的 7.25% 仿真提升和 10.0% 真实世界提升）。

### 发现五：Event-Level Language 对齐优于 Episode-Level

Motion-centric chunking（基于 trace 加速度的自动事件分割）+ hierarchical VLM captioning 提供了比 episode-level captions 更精细的语言-运动对齐。这使得模型可以理解"reach → grasp → move → release"等子目标级别的操作流程。

---

## 个人思考与展望

### 思考一：Trace 表示的认知科学联系

μ₀ 的 3D interaction traces 与认知科学中的 **affordance theory**（可供性理论）有深刻的联系。James Gibson 提出，人类感知环境时直接感知的是 "affordances"——环境提供的行动可能性。3D traces 正是一种计算化的 affordance 表示：

- 物体的运动轨迹暗示了它"可以被抓取"、"可以被推动"等 affordance
- 工具的运动轨迹编码了"如何使用"的知识
- 接触区域的信息反映了"在哪里施加力"

这种类比暗示 3D traces 可能不仅仅是工程上的 trick，而是更接近 **生物智能的空间表示方式**。

### 思考二：向 Spatial Foundation Model 演进

μ₀ 代表了 Spatial Foundation Model 的一个可能方向：
- **预训练**：从海量视频中学习通用的 3D interaction traces
- **适配**：通过轻量级 action experts 迁移到各种下游任务
- **复用**：同一套 trace features 可以服务于操作、导航、场景理解等多种任务

未来可能的演进路径：
1. **多模态 traces**：整合视觉、触觉、力觉信号
2. **物理 traces**：加入物理约束（重力、摩擦、碰撞）
3. **社交 traces**：理解多 agent 交互
4. **长时序 traces**：支持 multi-step 任务规划

### 思考三：Scaling Laws for Trace Models

论文的 scaling analysis 显示，trace prediction 随模型规模和数据量持续改善。这引出一个重要问题：**trace-based world models 的 scaling law 是什么？**

如果 trace 表示确实是一种良好的中间表示，那么：
- 更大的模型 + 更多视频 → 更精确的 traces → 更好的 downstream 性能
- 这可能形成一个新的 scaling paradigm，不同于 LLM 的 next-token prediction
- Trace prediction 可能成为 spatial AI 领域的 "next-token prediction"

### 思考四：局限性的深层分析

μ₀ 的一个深层局限是：**它仍然是一种"运动学"世界模型，而非"动力学"世界模型**。Traces 描述了"什么在移动"但不描述"为什么这样移动"。

一个完整的 Spatial AGI 系统需要：
- 运动学（μ₀ 已覆盖）：什么在移动、如何移动
- 动力学（μ₀ 未覆盖）：力、质量、摩擦、碰撞
- 因果推理（μ₀ 未覆盖）：如果我这样推，会发生什么
- 物理常识（μ₀ 未覆盖）：物体不会穿墙、重物需要更多力

未来的工作可能需要将 trace 表示与物理引擎（如 MuJoCo, Isaac Sim）或 learnable physics simulators 结合。

### 思考五：Sim-to-Real Transfer 的启示

μ₀ 在真实世界（91.7%）的表现远好于仿真（30.25%），特别是与 π₀.5 的对比中：
- 仿真中 π₀.5 (42%) >> μ₀ (30.25%)
- 真实世界中 μ₀ (91.7%) >> π₀.5 (80.0%)

这个反差可能暗示：
- **3D traces 具有更好的 sim-to-real transfer 能力**
- 原因可能是 traces 捕捉的是 geometry/motion invariants，这些在 sim 和 real 中是一致的
- 而 action representations 更容易过拟合到仿真环境的动力学特性
- 这对于 Spatial AGI 的实际部署非常重要

---

## 总结

μ₀ 是一项具有范式转变意义的工作。它提出了 3D interaction traces 作为连接视频数据和机器人控制的可扩展中间表示，并通过 TraceExtract 数据引擎、permutation-equivariant trace expert、semantic flow matching 等技术创新，证明了这一表示的有效性。

**核心贡献**：
1. **TraceExtract**：可扩展的 3D trace 数据提取 pipeline（8× 规模化）
2. **μ₀ world model**：query-conditioned 3D trace 预测模型
3. **Trace-conditioned action adaptation**：freeze → action expert 的迁移范式

**核心洞察**：
- 不要预测 pixels（太冗余），不要直接预测 actions（太 embodiment-specific）
- 预测 semantic interaction points 的 3D motion（恰好平衡）
- 从海量视频中学习这种表示（可扩展）
- 通过 action expert 迁移到任意机器人（可迁移）

**对 Spatial AGI 的核心启示**：
- Embodiment-agnostic 表示是可扩展空间智能的关键
- 选择正确的中间表示比堆砌模型规模更重要
- 数据引擎（将非结构化数据转化为结构化监督）是 Spatial AGI 的基础设施
- 3D traces 可能是 spatial domain 的 "language tokens"

**未来方向**：
- 整合多模态信息（力、触觉、声音）
- 扩展到更长时序和更复杂任务
- 探索 trace-based scaling laws
- 结合因果推理和物理常识
- 在更多 embodiment 和场景中验证

---

## 参考文献（论文中引用的关键工作）

- **π₀** (Black et al., 2025): VLA model with flow matching, action-labeled pretraining
- **π₀.5** (Physical Intelligence, 2025): Upgraded π₀ with larger-scale pretraining
- **TraceGen** (Lee et al., 2026): Closest prior work, fixed-grid 3D traces with depth input
- **DINOv2** (Oquab et al., 2023): Self-supervised vision transformer for entity features
- **VGGT**: Feed-forward 3D reconstruction model used in TraceExtract
- **TAPIR3D** (Zhang et al., 2025): 3D point tracking across long videos
- **SmolVLM2-2.2B**: VLM backbone used in μ₀
- **RoboCasa365** (Nasiriany et al., 2026): Large-scale kitchen manipulation simulation benchmark
- **Track2Act** (Bharadhwaj et al., 2024): 2D track-based manipulation interface
- **PointWorld** (Huang et al., 2026): 3D point flow world model
- **MolmoMotion** (Concurrent, 2026): Language-conditioned 3D point trajectory forecasting

---

*本分析文档基于 arXiv:2606.13769v2 的完整内容撰写，涵盖论文主体、附录和项目页的所有公开信息。*