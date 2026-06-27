# Pocket-SLAM: Rendering-Area-Aware Pruning for Memory-Efficient 3DGS-SLAM

> **论文精读分析报告**
> - **标题**: Pocket-SLAM: Rendering-Area-Aware Pruning for Memory-Efficient 3DGS-SLAM
> - **作者**: Leshu Li (UMN Twin Cities), Jie Peng (UNC Chapel Hill), Yang Zhao (UMN Twin Cities)
> - **arXiv**: [2606.24796](https://arxiv.org/abs/2606.24796)
> - **发表**: ICRA 2026 (IEEE International Conference on Robotics and Automation)
> - **代码**: [https://github.com/UMN-ZhaoLab/Pocket-SLAM.git](https://github.com/UMN-ZhaoLab/Pocket-SLAM.git)
> - **日期**: 2026-06-23
> - **分析日期**: 2026-06-27

---

## 论文概览

Pocket-SLAM 是一种针对大规模室外场景的内存高效 3DGS-SLAM 框架。其核心创新在于引入了 **rendering-area-aware pruning strategy**（基于渲染区域感知的剪枝策略）和 **tile-level budget mechanism**（瓦片级预算机制），在保持定位与建图精度的同时，将峰值内存消耗降低超过 60%，FPS 提升超过 2 倍。该方法构建在 LSG-SLAM 基础之上，但剪枝策略具有通用性，可无缝集成到其他 3DGS-SLAM 框架中。

### 核心数据亮点

| 指标 | EuRoC | KITTI |
|------|-------|-------|
| 峰值内存降低 | 61.3% | 65.7% |
| FPS 提升 | 2.7× | 2.9× |
| 精度损失 | 无显著损失 | 部分序列精度甚至提升 |

---

## Q1: 核心算法原理 — Rendering-Area-Aware Pruning 的原理、内存效率优化方法、SLAM Pipeline 设计

### 1.1 问题定义与动机

#### 1.1.1 3DGS-SLAM 的内存瓶颈

3D Gaussian Splatting (3DGS) 自 2023 年 Kerbl 等人提出以来，因其能捕获细粒度几何特征和合成高质量新视角，在 SLAM 领域引起了广泛关注。以 MonoGS、GS-SLAM 为代表的系统展示了 3DGS-SLAM 在高保真场景重建和精确相机追踪方面的潜力。然而，当这些系统扩展到大规模室外场景（如自动驾驶）时，面临一个关键限制：

**内存消耗随时间持续增长**。在大规模非结构化室外环境中，需要实时存储和更新数百万个 Gaussian 点，导致峰值内存消耗 prohibitive（高到不可接受），成为实际部署的主要瓶颈。

这一挑战进一步被以下因素加剧：
- **边缘设备资源受限**：自动驾驶车辆或无人机搭载的嵌入式 GPU 内存有限
- **室内外场景差异根本性不同**：室内环境紧凑且纹理丰富，而室外环境广阔且包含大量稀疏纹理区域
- **现有剪枝方法的局限性**：多数方法仅关注小规模室内场景或仅优化存储，忽略了 **runtime peak memory consumption**（运行时峰值内存消耗）

#### 1.1.2 现有剪枝方法的不足

论文详细分析了现有 Gaussian 剪枝方法在 3DGS-SLAM 场景中的局限性：

1. **LightGaussian** — 基于 opacity（不透明度）剪枝，移除对渲染图像贡献可忽略的 Gaussian。但在室外场景中，覆盖道路和天空等重要区域的 Gaussian 往往具有低 opacity，会被错误移除。

2. **LP-3DGS** — 使用 gradient magnitude（梯度幅度）作为重要性指标，丢弃参数更新较少的 Gaussian。但室外场景中关键的大覆盖区域 Gaussian 往往梯度较小，同样被错误移除。

3. **PUP-3DGS** — 从感知图像质量角度设计，与追踪精度目标不完全对齐。

4. **MaskGaussian** — 引入 mask-then-prune 方案，虽完成所有序列但精度显著下降。更关键的是，其延迟删除策略导致内存节省效果有限。

5. **GEVO** — 少数关注 3DGS-SLAM 内存的工作之一，但仅关注 keyframe 存储而非 runtime peak memory。

**核心洞察**：现有方法都依赖 **Gaussian-level heuristics**（如 opacity、gradient magnitude），而非从场景级渲染效率的角度评估 Gaussian 的重要性。

### 1.2 SLAM Pipeline 总体架构

Pocket-SLAM 遵循标准的 SLAM 范式，在 **tracking**（追踪）和 **mapping**（建图）两个阶段之间交替进行。其创新在于将剪枝策略无缝集成到这两个阶段中。

#### 1.2.1 Tracking 阶段

在追踪阶段，Gaussian 集合 {G_i} 保持固定，仅优化当前估计的相机位姿 T_cam ∈ SE(3)。

**损失函数定义**：

```
L = L_c + λ_d · L_d
```

其中：
- **L_c**（光度损失）= Σ_{p∈Ω_t} ρ(I_t(p) - C_t(p; G_i, T_cam))²
- **L_d**（深度损失）= Σ_{p∈Ω_t} ψ(D_t(p) - Z_t(p; G_i, T_cam))²
- ρ, ψ 是 robust penalty functions
- λ_d ≥ 0 平衡两个损失项

**梯度重用机制**：在反向传播中，梯度先传播到每个 Gaussian，再传到相机位姿：

```
∂L/∂G_i → ∂L/∂T_cam → T_cam update
```

这里的关键设计是：追踪阶段 **不更新 G_i**，但计算每个 Gaussian 的 per-frame gradient magnitude：

```
g_i = ‖∇_{G_i} L‖₂
```

这些梯度值不会被丢弃，而是被 **重新利用**来计算 tile-level Gaussian budgets（瓦片级 Gaussian 预算）。这是一个极其优雅的设计——梯度信息在追踪阶段是"免费"获得的副产品，无需额外计算开销。

**位姿更新**在李代数形式下进行：

```
T_cam ← exp(δξ̂) · T_cam,  δξ = -η · ∇_{T_cam} L
```

#### 1.2.2 Mapping 阶段

在建图阶段，相机位姿 T_cam 固定，优化 Gaussian 集合 {G_i}：

```
L = L_c + λ_d* · L_d
```

其中 λ_d* 是建图阶段使用的可能与追踪阶段不同的权重系数。

梯度传播到每个 Gaussian 参数并用于更新：

```
∇_{G_i} L = ∇_{G_i}(L_c + λ_d · L_d)
G_i ← G_i - α · ∇_{G_i} L
```

建图优化持续到收敛，之后执行 **rendering-area-aware pruning** 移除冗余 Gaussian。

#### 1.2.3 两阶段集成的关键设计

Pocket-SLAM 的 pipeline 设计体现了"信息复用"的哲学：

| 阶段 | 主任务 | 副产品（被剪枝利用） |
|------|--------|---------------------|
| Tracking | 位姿估计 | 每个 Gaussian 的梯度幅度 g_i → tile-level budget |
| Mapping | Gaussian 优化 | 收敛后的 Gaussian 状态 → rendering-area 计算 |

这种设计意味着剪枝策略几乎 **不引入额外计算开销**，因为所需的信息（梯度、渲染参数）在正常 SLAM 流程中已经计算完毕。

### 1.3 Rendering-Area-Aware Pruning（渲染区域感知剪枝）

#### 1.3.1 核心思想

传统剪枝方法从 Gaussian 本身的属性出发（opacity、gradient、size 等），而 Pocket-SLAM 从 **Gaussian 对最终渲染图像的实际贡献** 出发。这是一个范式转换：从局部启发式转向场景级渲染效率。

**核心问题**：如何量化一个 Gaussian 对渲染图像的贡献？

**答案**：计算该 Gaussian 在图像平面上的 **effective pixel coverage**（有效像素覆盖）。

#### 1.3.2 数学公式

对于每个 Gaussian G_i，其像素级贡献为：

```
α_i(p) = o_i · exp(-1/2 · (p - u_i)^T · Λ_i^{-1} · (p - u_i))
```

其中：
- o_i 是 Gaussian 的 opacity
- u_i 是投影到图像平面的均值（中心位置）
- Λ_i 是投影后的 2D 协方差矩阵

聚合所有像素得到覆盖度（coverage）：

```
C_i = Σ_{p∈Ω} α_i(p)
S_i = C_i / Σ_j C_j    （归一化的渲染贡献分数）
```

**关键洞察**：C_i 直接衡量了 Gaussian 在当前帧渲染中的实际像素覆盖面积。S_i 则衡量了该 Gaussian 在所有 Gaussian 中的相对重要性。

#### 1.3.3 剪枝执行

在每个 tile k 内，按 S_i 对 Gaussian 排序，仅保留前 B_k^{trk} 个。其中 B_k^{trk} 由 Tile-Level Budget Mechanism 确定。

**重要细节**：当前 mapping round 新增的 Gaussian 在此轮免于剪枝，因为它们尚未经历 tracking-based budget allocation。这是一个保护机制，防止误删刚创建的、尚未稳定的新 Gaussian。

#### 1.3.4 为什么 Rendering Area 在室外场景特别重要

论文揭示了一个关键的室外场景特性：

> 在自动驾驶数据集中，渲染面积大的 Gaussian 往往对应于关键结构——道路和天空。

这些区域对于鲁棒的定位和导航至关重要。传统方法基于 opacity 或 gradient 剪枝时，会错误地移除这些 Gaussian（因为它们可能 opacity 低或 gradient 小），导致全局光度约束丢失，位姿估计不稳定。

而基于 rendering area 的剪枝能够正确识别这些 Gaussian 的重要性——它们虽然单个属性不突出，但覆盖了大面积像素，对渲染贡献巨大。

### 1.4 Tile-Level Budget Mechanism（瓦片级预算机制）

#### 1.4.1 为什么需要 Budget 机制

仅基于 rendering area 剪枝虽然有效减少内存，但会导致严重的 **信息丢失**，特别是在纹理密集区域。论文通过实验揭示了两个关键问题：

**问题一：纹理密集区域的过度剪枝**
- 纹理密集区域通常由大量小型 Gaussian 表示
- 按面积排序时，这些小 Gaussian 排在后面被优先删除
- 导致纹理密集区域的 Gaussian 几乎被清空

**问题二：纹理稀疏区域的脆弱性**
- 纹理稀疏区域可能仅由少数几个 Gaussian 表示
- 随着 pruning ratio 增大，移除这些 Gaussian 会导致该区域信息完全丢失

论文在 Fig. 3 中展示了令人信服的实验证据：当 pruning ratio 从 0 逐步增大到 0.6 时，ATE（追踪精度）和 PSNR（渲染质量）都显著退化。根因就是面积优先的剪枝不可避免地优先移除小 Gaussian，而这些小 Gaussian 集中在纹理密集区域。

#### 1.4.2 Budget 分配算法

**Step 1：计算 Tile 级平均梯度**

对于投射到 tile T_k 中的 Gaussian 集合 {G_i}，计算平均梯度幅度：

```
G_k = (1/N_k) · Σ_{i∈T_k} g_i
```

其中 N_k 是 tile k 中的 Gaussian 数量。

**梯度作为纹理密度的代理指标**：G_k 越高，说明该区域纹理密集、约束强，需要更大的预算；G_k 越低，说明约束弱。

**Step 2：分配预算**

给定全局目标 N_tar，按梯度比例分配 per-tile budget：

```
B_k^{trk} = clip(⌈N_tar · G_k / Σ_j G_j⌉, B_min, B_max)
```

其中：
- B_min = 5（防止区域被完全清空）
- B_max = 200（防止单个 tile 内 Gaussian 过度集中）
- N_tar = 0.4 · N_init（保留 40% 的 Gaussian，即 prune 60%）

**Step 3：执行**

在 tracking 阶段执行此分配过程。由于 G_i 在 tracking 中不更新，tile-level budgets 跨迭代保持相对稳定，为后续 rendering-area-aware pruning 提供一致且可靠的指导。

#### 1.4.3 Budget 机制的深层原理

Budget 机制体现了 **信息保全** 的核心原则：

1. **纹理密集区域保护**：高梯度区域获得更多预算，确保小型但信息丰富的 Gaussian 不被过度剪枝
2. **纹理稀疏区域保护**：B_min = 5 确保每个 tile 至少保留 5 个 Gaussian，防止信息完全丢失
3. **平衡分配**：按梯度比例分配，实现"按需分配"——信息量大的区域获得更多资源

这种设计与 rendering-area-aware pruning 形成互补：
- Rendering-area pruning 关注 **全局效率**——移除对渲染贡献小的 Gaussian
- Tile-level budget 关注 **局部保护**——确保每个区域都有足够的 Gaussian 表示

### 1.5 完整算法流程

```
Algorithm: Pocket-SLAM Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: 视频帧序列 {I_t, D_t}

Initialize: Gaussian set {G_i}, camera pose T_cam

For each frame t:
    ┌─── Tracking Stage ───┐
    │ 1. 固定 {G_i}                                        │
    │ 2. 最小化 L = L_c + λ_d·L_d 优化 T_cam              │
    │ 3. 计算每个 Gaussian 的梯度 g_i = ‖∇_{G_i} L‖₂     │
    │ 4. 按 tile 计算平均梯度 G_k                           │
    │ 5. 分配 budget: B_k = clip(N_tar · G_k/ΣG_j, 5, 200) │
    └──────────────────────┘
    
    If keyframe:
    ┌─── Mapping Stage ───┐
    │ 1. 固定 T_cam                                        │
    │ 2. 最小化 L = L_c + λ_d*·L_d 优化 {G_i}            │
    │ 3. 直到收敛                                           │
    │ 4. [Rendering-Area-Aware Pruning]                    │
    │    a. 计算每个 G_i 的 coverage C_i                   │
    │    b. 归一化 S_i = C_i / ΣC_j                        │
    │    c. 在每个 tile k 内按 S_i 排序                     │
    │    d. 保留前 B_k^{trk} 个 Gaussian                   │
    │    e. 新增 Gaussian 本轮免剪                          │
    └──────────────────────┘

Output: 优化后的 {G_i} 和轨迹 {T_cam}
```

### 1.6 实现细节与超参数

| 参数 | 值 | 说明 |
|------|-----|------|
| Tracking iterations | 50 per frame | 位姿优化迭代次数 |
| Mapping iterations | 100 per keyframe | Gaussian 优化迭代次数 |
| λ_d (tracking) | 1.0 | 深度损失权重 |
| λ_d* (mapping) | 1.5 | 深度损失权重（建图阶段） |
| N_tar | 0.4 · N_init | 全局目标 Gaussian 数量 |
| B_min | 5 | 每 tile 最小保留数 |
| B_max | 200 | 每 tile 最大保留数 |
| 硬件 | NVIDIA A6000 | 评估平台 |

### 1.7 内存效率优化的系统级分析

#### 1.7.1 峰值内存的来源

3DGS-SLAM 的峰值内存消耗由以下组成：
1. **Gaussian 参数存储**：每个 Gaussian 包含 position (3D)、covariance (6D)、opacity (1D)、color (SH coefficients, 通常 3-48D) — 总计每个 Gaussian 约 14-59 个浮点数
2. **优化器状态**：Adam 优化器为每个参数维护 momentum 和 variance，约 2x 参数大小
3. **渲染中间结果**：tile-based rasterization 的中间缓冲区
4. **梯度缓存**：反向传播中需保存的前向计算结果

当 Gaussian 数量达到百万级时，仅 Gaussian 参数本身就可达数 GB，加上优化器状态则翻倍。

#### 1.7.2 Pocket-SLAM 的内存节省路径

Pocket-SLAM 通过以下路径降低峰值内存：

1. **直接减少 Gaussian 数量**：每帧 mapping 后立即剪枝，直接减少 Gaussian 参数存储
2. **级联效应**：更少的 Gaussian → 更少的优化器状态 → 更少的梯度缓存 → 更小的渲染缓冲区
3. **即时删除 vs 延迟删除**：与 MaskGaussian 的 mask-then-prune 不同，Pocket-SLAM 立即物理删除冗余 Gaussian，避免了延迟删除期间的内存占用

#### 1.7.3 为什么 MaskGaussian 内存节省有限

论文在 Fig. 5 中展示了内存使用随帧数增长的趋势。MaskGaussian 虽然采用相同的 pruning ratio，但其 mask 策略导致：
- 低重要性 Gaussian 被暂时 deactivate 而非物理删除
- 这些 Gaussian 仍然占据内存
- 在每个 keyframe，MaskGaussian 实际移除的 Gaussian 远少于 Pocket-SLAM
- 结果：内存节省仅约 30%，远低于 Pocket-SLAM 的 60%+

### 1.8 小结

Pocket-SLAM 的核心算法原理可以概括为三个层次的创新：

1. **评估指标创新**：从 Gaussian-level heuristics (opacity, gradient) 转向 scene-level rendering contribution (effective pixel coverage)
2. **保护机制创新**：Tile-level budget mechanism 基于梯度分配预算，防止纹理密集和稀疏区域的过度剪枝
3. **系统集成创新**：在 tracking 中计算 budget，在 mapping 中执行 pruning，无需额外计算开销

这种设计的巧妙之处在于：它 **利用了 SLAM 流程中已有的计算**（梯度、渲染参数），以几乎零额外开销的方式实现了智能剪枝，同时保证了 SLAM 的精度和效率。

---

## Q2: 与 Spatial AGI 的关系 — 3DGS-SLAM 作为 Spatial AGI 的基础设施、内存效率对实际部署的意义

### 2.1 Spatial AGI 的概念与需求

#### 2.1.1 什么是 Spatial AGI

Spatial AGI（空间通用人工智能）是指具备理解和推理三维空间环境能力的通用人工智能系统。它需要：

1. **空间感知**：精确实时的 3D 环境感知与建模
2. **空间记忆**：对历史空间信息的持久存储和高效检索
3. **空间推理**：基于 3D 几何和语义信息进行规划、决策
4. **空间交互**：在物理世界中导航和操作

3DGS-SLAM 作为 Spatial AGI 的 **空间感知与记忆基础设施**，扮演着"眼睛+海马体"的角色——既要实时感知环境，又要构建和维护持久的空间表征。

#### 2.1.2 3DGS 相对其他表征的优势

在 Spatial AGI 的背景下，3DGS 作为环境表征具有独特优势：

| 特性 | 3DGS | NeRF | Voxel Grid | Point Cloud |
|------|------|------|------------|-------------|
| 渲染质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 渲染速度 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 几何精度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 可编辑性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 内存效率 | ⭐⭐ (未优化) | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| 动态更新 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

3DGS 的核心优势在于 **实时高保真渲染 + 可微优化**，使其成为 Spatial AGI 中"所见即所得"的空间表征。但内存效率是其主要短板，这正是 Pocket-SLAM 要解决的问题。

### 2.2 3DGS-SLAM 在 Spatial AGI 技术栈中的定位

#### 2.2.1 Spatial AGI 的层次架构

```
┌─────────────────────────────────────────────────┐
│           Spatial Reasoning Layer               │
│     (空间推理：规划、导航决策、物体交互)            │
├─────────────────────────────────────────────────┤
│           Spatial Understanding Layer            │
│   (空间理解：语义分割、物体检测、场景图)             │
├─────────────────────────────────────────────────┤
│         Spatial Representation Layer             │
│  (空间表征：3DGS / NeRF / Voxel / Mesh)           │
├─────────────────────────────────────────────────┤
│         Spatial Sensing & Mapping Layer          │
│    (空间感知与建图：SLAM、传感器融合)               │
├─────────────────────────────────────────────────┤
│              Hardware Layer                      │
│    (硬件：相机、LiDAR、IMU、GPU、边缘设备)          │
└─────────────────────────────────────────────────┘
```

Pocket-SLAM 工作在 **Spatial Sensing & Mapping Layer** 和 **Spatial Representation Layer** 的交界处，直接决定了上层模块能获得什么样的空间表征。

#### 2.2.2 作为基础设施的关键要求

对于 Spatial AGI 而言，3DGS-SLAM 作为基础设施需要满足以下要求：

1. **实时性**：必须以传感器帧率运行，不能成为系统瓶颈
2. **可扩展性**：必须能处理从单房间到城市级别的环境
3. **内存可控性**：必须在有限的硬件资源下运行
4. **表征质量**：必须提供足够高质量的环境表征供上层模块使用
5. **鲁棒性**：必须在各种环境条件下稳定运行

Pocket-SLAM 直接回应了第 2 和第 3 点要求，间接支持了第 1 点（FPS 提升 2x+）。

### 2.3 内存效率对 Spatial AGI 实际部署的意义

#### 2.3.1 边缘部署的硬件约束

Spatial AGI 的实际部署场景包括：

| 场景 | 典型硬件 | 内存限制 | 挑战 |
|------|---------|---------|------|
| 自动驾驶 | 车载 GPU (NVIDIA Drive Orin) | 32-64 GB | 需同时运行感知、规划、控制 |
| 无人机 | 嵌入式 GPU (Jetson系列) | 8-16 GB | 重量和功耗严格受限 |
| AR/VR 头显 | 移动 GPU | 4-12 GB | 极低功耗、低延迟要求 |
| 机器人 | 边缘 GPU | 8-32 GB | 多任务共享资源 |
| 云端服务 | 数据中心 GPU | 40-80 GB | 高并发、多场景同时处理 |

**关键洞察**：在实际部署中，3DGS-SLAM 从不是系统中唯一的模块。它必须与目标检测、路径规划、语义理解等模块共享有限的计算资源。如果 SLAM 消耗了过多内存，其他关键模块就无法运行。

#### 2.3.2 Pocket-SLAM 的内存节省带来的部署可能性

以 Jetson Orin（32 GB 统一内存）为例：

- **未优化的 3DGS-SLAM**：处理 KITTI 级别场景可能需要 20-30 GB 峰值内存，几乎耗尽所有资源
- **Pocket-SLAM 优化后**：峰值内存降低 65%，约需 7-10 GB，为其他模块留出 20+ GB

这意味着，Pocket-SLAM 使 **在同一边缘设备上同时运行 SLAM + 感知 + 规划成为可能**，这对 Spatial AGI 的实际部署至关重要。

#### 2.3.3 长时间运行的稳定性

Spatial AGI 系统需要长时间持续运行（如自动驾驶车辆需要连续运行数小时）。在未优化的 3DGS-SLAM 中：

- Gaussian 数量随时间线性甚至超线性增长
- 最终必然触发 OOM (Out of Memory) 错误
- 系统被迫重启或降级

Pocket-SLAM 通过持续剪枝将 Gaussian 数量控制在稳定水平，使 **长时间持续运行成为可能**。Fig. 5 中展示的内存增长曲线清晰地表明，Pocket-SLAM 的内存使用增长远比基线缓慢。

### 2.4 3DGS-SLAM 作为 Spatial AGI 的感知前端

#### 2.4.1 从 SLAM 到 Spatial Understanding

传统的 SLAM 系统输出位姿和点云地图，这些信息对 Spatial AGI 远远不够。Spatial AGI 需要：

1. **语义化表征**：不只是 3D 点，还要知道"这是道路"、"那是建筑物"
2. **可交互表征**：能够查询"前方 10 米有什么障碍物？"
3. **可生成表征**：能够回答"从当前视角看到的画面是什么样？"

3DGS-SLAM 天然支持第 3 点——高质量新视角合成。而 3DGS 的可微渲染特性也使其可以被扩展到语义分割、目标检测等任务（通过将 SH coefficients 替换或扩展为语义特征）。

Pocket-SLAM 在此的角色是：**确保这些扩展功能在内存受限的设备上仍可运行**。

#### 2.4.2 动态环境适应

Spatial AGI 需要处理动态环境——环境中的物体会移动、出现、消失。3DGS-SLAM 的 Gaussian 点可以自然地被添加和删除，使其比 NeRF 等隐式表征更适合动态场景。

Pocket-SLAM 的剪枝策略可以进一步用于 **动态物体管理**：移动的物体会产生 transient Gaussians，这些 Gaussian 在某一帧可能贡献大但后续帧不再出现。基于 rendering-area 的剪枝可以识别并移除这些过期的 Gaussian，实现环境的动态维护。

### 2.5 大规模场景扩展与 Spatial AGI 的关系

#### 2.5.1 从场景级到城市级

Spatial AGI 的终极目标是城市级甚至全球级的空间智能。这需要：

- 处理 **数公里** 的驾驶场景
- 融合 **多传感器**（相机、LiDAR、IMU、GPS）
- 维护 **持久地图**（跨天、跨季节）
- 支持 **多智能体协作**（多车共享地图）

KITTI 数据集覆盖了数公里的城市/郊区/高速公路场景。Pocket-SLAM 在 KITTI 上的成功验证表明，3DGS-SLAM 有潜力从实验室级别扩展到真实世界级别。

#### 2.5.2 与其他 Spatial AGI 技术的协同

Pocket-SLAM 与 Spatial AGI 生态中的其他技术有广阔的协同空间：

**与语义理解的协同**：
- 3DGS 表征可以与语义分割网络结合
- 语义信息可以指导剪枝——例如，道路和天空的 Gaussian 可以用更粗糙的表示，而行人附近的 Gaussian 需要精细保留
- Tile-level budget 机制可以扩展为 semantic-aware budget

**与大语言模型的协同**：
- LLM 需要空间信息来回答空间相关问题
- 3DGS 渲染可以作为 LLM 的"空间眼睛"
- 内存高效的 SLAM 确保在运行 LLM 的同时仍能维护空间表征

**与生成式 AI 的协同**：
- 3DGS 场景可以作为生成式模型的条件输入
- 例如，基于当前环境生成未来可能的场景变化
- 高效的 SLAM 留出 GPU 内存给生成模型

### 2.6 Spatial AGI 视角下的技术趋势

#### 2.6.1 从 SLAM 到 Spatial Foundation Models

当前 Spatial AGI 的发展趋势之一是从特定任务的 SLAM 系统走向 **空间基础模型** (Spatial Foundation Models)。这些模型：

- 预训练在大规模空间数据上
- 可以迁移到多种下游任务
- 需要大规模的 3D 环境表征作为训练数据

3DGS-SLAM 系统可以作为这类基础模型的数据采集和场景构建工具。Pocket-SLAM 的内存效率意味着可以在更大范围的场景中采集更高质量的训练数据。

#### 2.6.2 从被动感知到主动交互

Spatial AGI 的另一个趋势是从被动感知（仅观察环境）走向 **主动交互**（在环境中行动并观察结果）。这要求：

- 实时更新环境表征
- 高效的内存管理以支持快速更新
- 能够处理环境变化

Pocket-SLAM 的持续剪枝机制天然支持这一趋势——它不仅管理内存，还持续"清理"过期的空间表征，使系统始终保持最新、最相关的环境模型。

### 2.7 Pocket-SLAM 对 Spatial AGI 部署的启示

#### 2.7.1 "渲染即感知"的范式

Pocket-SLAM 的核心思想——从渲染贡献的角度评估重要性——暗示了一个更深的范式：

> 在 Spatial AGI 中，**一个好的空间表征应该对渲染（感知）有贡献**。

这意味着：
- 渲染质量可以作为表征质量的代理指标
- 渲染贡献可以作为信息重要性的排序标准
- "看得见的"表征更重要（对当前任务而言）

这种范式对 Spatial AGI 的表征学习、压缩和检索都有指导意义。

#### 2.7.2 资源感知的系统设计

Pocket-SLAM 体现了一个重要的工程原则：**Spatial AGI 系统必须是资源感知的**。

在一个完整的 Spatial AGI 系统中，不同模块的资源分配应该是动态的：
- 在简单环境（如空旷道路）中，SLAM 可以使用较少资源
- 在复杂环境（如城市交叉路口）中，SLAM 可能需要更多资源
- 在需要精细操作时，规划模块需要更多资源

Pocket-SLAM 的 tile-level budget 机制展示了这种资源感知分配的雏形——不同区域按需分配 Gaussian 预算。这一思路可以扩展到整个 Spatial AGI 系统的资源管理。

### 2.8 小结

Pocket-SLAM 对 Spatial AGI 的核心价值在于：

1. **基础设施可行性**：使 3DGS-SLAM 在资源受限设备上可部署，这是 Spatial AGI 从实验室走向现实的前提
2. **长时间运行能力**：通过持续剪枝控制内存增长，支持 Spatial AGI 系统的持续运行
3. **表征效率**：推动"以渲染贡献为导向"的表征质量评估范式
4. **系统协同**：节省的内存和计算资源可以用于上层 Spatial AGI 模块
5. **可扩展性**：在大规模室外场景的成功验证，为城市级 Spatial AGI 奠定基础

---

## Q3: 创新点和局限性 — 与其他 3DGS-SLAM 方法对比、ICRA 2026 的意义

### 3.1 核心创新点深度解析

#### 3.1.1 创新点一：Rendering-Area-Aware Pruning（范式转换）

**传统方法范式**：Gaussian-level heuristics
```
Importance(G_i) = f(opacity_i, gradient_i, size_i, ...)
```

**Pocket-SLAM 范式**：Scene-level rendering contribution
```
Importance(G_i) = Σ_{p∈Ω} α_i(p)  // 该 Gaussian 对渲染图像的像素覆盖
```

这一范式转换的深远意义在于：

1. **从局部到全局**：不再孤立地评估每个 Gaussian 的属性，而是考虑其对最终渲染效果的实际贡献
2. **从静态到动态**：importance 随当前帧的内容动态变化——同一个 Gaussian 在不同视角下的重要性不同
3. **从间接到直接**：opacity 和 gradient 只是重要性的间接代理指标，而 pixel coverage 是直接的功能度量

**特别值得注意的是**，这一思想与神经网络剪枝中的一些前沿工作类似——从基于权重幅度（analogous to opacity）转向基于激活贡献（analogous to rendering area）。这暗示了不同领域的剪枝方法论正在趋同。

#### 3.1.2 创新点二：Tile-Level Budget Mechanism（自适应保护）

传统全局剪枝方法对所有区域一视同仁，而 Pocket-SLAM 引入了 **空间自适应** 的保护机制：

**创新要素**：
1. **利用 tracking 阶段的梯度作为纹理密度代理**——零额外计算开销
2. **按梯度比例分配 budget**——信息量大的区域获得更多资源
3. **B_min/B_max 约束**——防止极端情况（清空或过度集中）

**深层洞察**：这一机制实际上解决的是一个 **信息保全 vs 效率优化** 的 multi-objective optimization 问题。Budget 机制相当于一个约束条件，确保剪枝优化不会在追求效率的同时破坏信息完整性。

#### 3.1.3 创新点三：即时删除 vs 延迟删除

与 MaskGaussian 的 mask-then-prune 策略不同，Pocket-SLAM 选择 **立即物理删除** 冗余 Gaussian。这一看似简单的选择有深远的系统级影响：

| 方面 | MaskGaussian (延迟删除) | Pocket-SLAM (即时删除) |
|------|------------------------|----------------------|
| 峰值内存 | 高（deactivated Gaussian 仍占内存） | 低（立即释放） |
| 恢复能力 | 可恢复（unmask 即可） | 不可恢复（需重新创建） |
| 实现复杂度 | 中等（需 mask 管理） | 简单（直接删除） |
| SLAM 适用性 | 一般（延迟删除期间内存仍高） | 好（立即释放内存） |

Pocket-SLAM 选择即时删除的原因是：在 SLAM 场景中，**峰值内存**而非最终内存才是部署的关键约束。MaskGaussian 的延迟删除在内存管理上是一个显著的劣势。

#### 3.1.4 创新点四：与现有 SLAM 框架的无缝集成

论文强调 Pocket-SLAM 的剪枝策略是 **orthogonal to other 3DGS acceleration techniques**，这意味着：

- 可以与 AdR-Gaussian (adaptive radius) 结合
- 可以与 SG-Splatting (spherical Gaussians) 结合
- 可以与 TC-GS (tensor core acceleration) 结合
- 可以与各种 SLAM tracking/mapping 策略结合

这种 **即插即用** 的特性大大增加了方法的实用价值——研究者可以将其集成到任何 3DGS-SLAM 框架中获得即时的内存效率提升。

### 3.2 与其他 3DGS-SLAM 方法的详细对比

#### 3.2.1 方法分类与定位

```
3DGS-SLAM 方法分类
│
├─ 室内场景导向
│  ├─ MonoGS (CVPR 2024)
│  ├─ GS-SLAM (2024)
│  ├─ Photo-SLAM (2024)
│  └─ LoopSplat (2024)
│
├─ 室外/大规模场景导向
│  ├─ LSG-SLAM (2025) ← Pocket-SLAM 的基线
│  └─ WildGS-SLAM (2025)
│
├─ 内存优化导向
│  ├─ GEVO (2025) — keyframe 存储
│  └─ Pocket-SLAM (2026) — runtime peak memory ← 本文
│
└─ 加速导向
   ├─ AdR-Gaussian (SIGGRAPH Asia 2024)
   ├─ SG-Splatting (2024)
   └─ TC-GS (2025)
```

#### 3.2.2 详细对比表

| 维度 | MonoGS | GS-SLAM | Photo-SLAM | LoopSplat | LSG-SLAM | WildGS-SLAM | GEVO | **Pocket-SLAM** |
|------|--------|---------|------------|-----------|----------|-------------|------|-----------------|
| 场景类型 | 室内 | 室内 | 室内 | 室内 | **室外/大规模** | 室外+动态 | 室内外 | **室外/大规模** |
| 传感器 | 单目/RGB-D | RGB-D | 单目/立体/RGB-D | RGB-D | 立体 | 单目 | 单目 | 立体 |
| Loop Closure | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ (继承LSG) |
| 内存优化 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | keyframe存储 | **runtime peak** |
| 剪枝策略 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **rendering-area** |
| 实时性 | 中 | 中 | 高 | 中 | 中 | 低 | 高 | **高** |
| 部署友好 | 低 | 低 | 中 | 低 | 低 | 低 | 中 | **高** |

#### 3.2.3 与 LSG-SLAM 的关系

Pocket-SLAM 构建在 LSG-SLAM 之上，两者是 **继承+增强** 的关系：

**LSG-SLAM 的贡献**：
- 将 3DGS-SLAM 扩展到大规模室外场景
- 引入 multi-modality priors 进行位姿初始化
- 使用 rendering 和 feature warping losses 进行追踪

**Pocket-SLAM 的增量贡献**：
- 引入 rendering-area-aware pruning
- 引入 tile-level budget mechanism
- 在保持精度的同时大幅降低内存消耗

这种关系意味着 LSG-SLAM 的所有优势（大场景处理、鲁棒追踪等）都被 Pocket-SLAM 继承，而其主要的劣势（内存消耗高）被 Pocket-SLAM 解决。

#### 3.2.4 与 GEVO 的对比

GEVO 是少数关注 3DGS-SLAM 内存的工作之一，但与 Pocket-SLAM 有根本性的区别：

| 方面 | GEVO | Pocket-SLAM |
|------|------|-------------|
| 优化目标 | keyframe 存储 | **runtime peak memory** |
| 优化手段 | 减少 keyframe 数量 | **Gaussian 剪枝** |
| 实际影响 | 降低最终地图大小 | **降低运行时内存需求** |
| 部署意义 | 地图存储/传输 | **实时运行可行性** |

**关键区别**：GEVO 关注的是"存多少 keyframe"，而 Pocket-SLAM 关注的是"运行时需要多少内存"。对于边缘设备部署而言，后者更为关键——它决定了系统能否在给定硬件上运行。

#### 3.2.5 与通用 3DGS 剪枝方法的对比

论文在相同 pruning ratio 下与三种通用剪枝方法进行了公平对比：

**LightGaussian**：
- 基于 opacity 剪枝
- 室外场景表现差：道路和天空的 Gaussian opacity 低但覆盖大
- 在 MH04、MH05 等挑战序列上 tracking lost
- **不适合 SLAM 场景**

**LP-3DGS**：
- 基于 gradient magnitude
- 室外场景同样表现差：大覆盖区域 Gradient 小
- 多个 KITTI 序列 tracking lost
- **不适合 SLAM 场景**

**MaskGaussian**：
- 基于 mask-then-prune
- 能完成所有序列但精度下降明显
- 内存节省有限（仅约 30%）
- FPS 提升有限

**Pocket-SLAM**：
- 基于 rendering area + tile budget
- 所有序列稳定完成
- 内存节省 60%+
- FPS 提升 2x+

**根本原因分析**：通用剪枝方法设计时考虑的是 **离线渲染场景**（给定所有视角，优化全局表征），而 SLAM 需要 **逐帧渲染和追踪精度**。这两种场景对 Gaussian 重要性的定义完全不同——离线渲染中不重要的 Gaussian 可能在当前帧的 SLAM 追踪中至关重要。

### 3.3 实验结果的深度解读

#### 3.3.1 EuRoC 上的表现

EuRoC 是 MAV（微型飞行器）数据集，包含 5 个室外序列 MH01-MH05：

- **精度**：Pocket-SLAM 是唯一在统一 pruning ratio 下达到与 LSG-SLAM 可比精度的方法
- **内存**：平均降低 61.3%
- **FPS**：平均提升 2.7×
- **鲁棒性**：LightGaussian 和 LP-3DGS 在 MH04/MH05 上失败

**重要发现**：即使是 EuRoC 这样的"中等规模"室外场景，通用剪枝方法也已经无法胜任。这说明了 3DGS-SLAM 场景下剪枝策略的特殊性。

#### 3.3.2 KITTI 上的表现

KITTI 是自动驾驶数据集，覆盖城市、住宅区和乡村道路：

- **精度**：Pocket-SLAM 在多个序列（00, 04, 05, 06, 08）上甚至 **超越** 了 LSG-SLAM
- **内存**：平均降低 65.7%
- **FPS**：平均提升 2.9×

**超越基线的解释**：这一看似矛盾的结果（剪枝后精度更高）实际上有合理的解释：
1. 冗余 Gaussian 可能引入噪声和过拟合
2. 保留高 rendering-area 的 Gaussian 等价于保留了最稳定、最可靠的视觉约束
3. Tile-level budget 确保了各区域的均衡覆盖，避免了某些区域过度密集导致的局部优化困难

#### 3.3.3 KITTI 比 EuRoC 改善更显著的原因

论文指出，KITTI 上的改善比 EuRoC 更显著。原因在于：

1. **场景规模更大**：KITTI 覆盖数公里，EuRoC 仅数十米
2. **室外特性更强**：KITTI 有更多道路、天空等大面积区域
3. **Rendering-area 的区分度更高**：大场景中 Gaussian 之间的 rendering area 差异更大
4. **冗余 Gaussian 更多**：大场景中不可避免地创建更多无用 Gaussian

这进一步证实了 rendering-area-aware pruning **特别适合大规模室外场景** 的核心论点。

#### 3.3.4 Fig. 4 的定性分析

Fig. 4 展示了五种方法在 KITTI sequence 10 上的渲染结果和 Gaussian 密度热力图：

**LightGaussian**：纹理密集区域（蓝框）Gaussian 大量丢失，导致渲染模糊
**LP-3DGS**：类似 LightGaussian，纹理密集区域信息严重缺失
**MaskGaussian**：纹理稀疏区域（绿框）和密集区域都有一定保留，但密度普遍偏低
**Pocket-SLAM**：纹理密集区域保留了足够的 Gaussian，纹理稀疏区域也有合理覆盖

**Gaussian 密度热力图的关键观察**：Pocket-SLAM 的密度分布最接近基线 LSG-SLAM，说明剪枝过程中较好地保留了原始的 Gaussian 分布形态。

### 3.4 局限性分析

#### 3.4.1 明确的局限性

**局限一：依赖基线框架**
- 当前实现基于 LSG-SLAM，继承了其所有局限性
- 如需要 stereo camera input，不直接支持单目设置
- 追踪精度受基线框架的能力限制

**局限二：固定 Pruning Ratio**
- N_tar = 0.4 · N_init 是一个静态全局参数
- 不同场景、不同时间段的 optimal pruning ratio 可能不同
- 论文在 Future Work 中提到 adaptive pruning schedules 的需求

**局限三：超参数敏感性**
- B_min = 5 和 B_max = 200 的选择缺乏理论指导
- 不同场景可能需要不同的 tile 划分粒度
- 这些参数在实际部署中可能需要调优

**局限四：评估局限于 EuRoC 和 KITTI**
- 这两个数据集虽然经典，但都不是最新的
- 缺少在 newer datasets (如 nuScenes, Waymo Open Dataset) 上的评估
- 缺少在极端天气/光照条件下的评估

#### 3.4.2 隐含的局限性

**局限五：Tile 划分的任意性**
- 论文未详细讨论 tile 的划分方式和大小
- Tile 大小直接影响 budget 分配的粒度
- 太粗的 tile 无法区分局部纹理差异，太细的 tile 可能导致统计不稳定

**局限六：Rendering Area 的视角依赖性**
- Rendering area 是相对于当前视角计算的
- 当相机移动到新位置时，之前被认为不重要的 Gaussian 可能变得重要
- 虽然论文的"新增 Gaussian 免剪"机制部分缓解了这一问题，但无法完全解决

**局限七：缺少语义信息**
- 纯几何/渲染的剪枝标准不考虑语义重要性
- 一个低 rendering-area 的 Gaussian 可能对应一个语义上重要的物体（如远处的交通灯）
- 纯 rendering-area 剪枝可能移除这类语义重要但渲染贡献小的 Gaussian

**局限八：动态场景处理不足**
- 论文聚焦于静态环境
- 在动态场景中（行人、车辆移动），Gaussian 的重要性会随时间剧烈变化
- 当前方法没有 temporal modeling 来处理这种变化

**局限九：计算效率的开销**
- 虽然 tracking 阶段的梯度重用很优雅，但 mapping 阶段后的 rendering-area 计算仍有额外开销
- 对每个 Gaussian 计算其所有像素的 coverage 在大图像上可能较慢
- 论文未详细分析这一开销的具体大小

#### 3.4.3 与最先进方法的差距

**与 Neural SLAM 对比**：
- Neural SLAM 使用隐式表征，内存占用天然更小
- 但渲染质量通常不如 3DGS
- Pocket-SLAM 在内存效率上可能仍不如 Neural SLAM，但在渲染质量上有优势

**与 Implicit Representation 对比**：
- 一些最新的隐式表征方法（如 iMAP、NICE-SLAM）在内存控制上有优势
- 但它们通常无法达到 3DGS 的渲染速度
- Pocket-SLAM 通过剪枝缩小了这一差距

### 3.5 ICRA 2026 的学术意义

#### 3.5.1 ICRA 的定位

ICRA（IEEE International Conference on Robotics and Automation）是机器人和自动化领域的顶级会议之一，与 IROS 并列为机器人领域两大旗舰会议。

**ICRA 的关注偏好**：
- 实际机器人应用
- 系统效率与实时性
- 硬件部署可行性
- 自主导航与感知

Pocket-SLAM 完美契合这些偏好：
- 解决实际部署问题（内存效率）
- 面向真实机器人场景（自动驾驶、无人机）
- 提供实际性能数据（FPS、内存、精度）
- 开源代码（促进社区采用）

#### 3.5.2 在 ICRA 2026 发表的意义

**对 3DGS-SLAM 社区的意义**：
1. **首次系统性地解决 runtime peak memory 问题**——之前的 3DGS-SLAM 工作很少关注这一关键指标
2. **确立 rendering-area 作为 SLAM 剪枝指标的合法性**——为后续工作开辟新方向
3. **提供公平的剪枝方法对比基准**——在相同 SLAM pipeline、相同 pruning ratio 下对比

**对机器人社区的意义**：
1. **使 3DGS-SLAM 更接近实际部署**——内存是实际系统的核心约束
2. **提供开源代码**——降低采用门槛
3. **验证了在 KITTI（自动驾驶标准基准）上的有效性**——增强了实用价值

**对 Spatial AGI 的意义**：
1. 推动了 3DGS 作为 Spatial AGI 基础设施的可行性
2. 为多模块系统集成提供了内存预算空间
3. 验证了大规模场景下的可扩展性

#### 3.5.3 可能的后续研究方向

基于 Pocket-SLAM 的贡献和局限，可以预见以下后续研究方向：

**短期（1年内）**：
- Adaptive pruning ratio：根据场景复杂度动态调整
- Semantic-aware pruning：结合语义信息进行剪枝
- 更多数据集验证：nuScenes, Waymo, Argoverse
- 移动端部署实验

**中期（1-2年）**：
- Dynamic scene extension：扩展到动态场景
- Multi-agent collaborative SLAM：多车协同建图
- Long-term map maintenance：跨季节、跨年的地图维护
- Hardware-aware pruning：根据硬件特性优化剪枝策略

**长期（2-3年）**：
- Learning-based pruning：用学习方式而非规则方式决定剪枝
- End-to-end optimization：将剪枝策略整合到端到端训练中
- Cross-modal pruning：融合视觉、LiDAR、语义等多模态信息
- Spatial AGI integration：集成到完整的 Spatial AGI 系统中

### 3.6 方法的可复现性与工程价值

#### 3.6.1 开源承诺

论文明确声明代码在 GitHub 公开（https://github.com/UMN-ZhaoLab/Pocket-SLAM.git）。这对于：
- **学术复现**：其他研究者可以验证结果
- **工业应用**：工程师可以直接集成到产品中
- **教育目的**：学生可以学习 3DGS-SLAM 的实现细节

#### 3.6.2 工程实现的简洁性

Pocket-SLAM 的实现相对简洁：
- 不需要训练额外的神经网络
- 剪枝逻辑可以几行代码实现
- 与现有 SLAM pipeline 无缝集成

这种简洁性在实际工程中极为重要——复杂的方法往往难以维护和调试。

#### 3.6.3 性能/复杂度比

| 方法 | 额外计算开销 | 内存节省 | 性能/复杂度比 |
|------|-------------|---------|-------------|
| LightGaussian | 极低 | — | — |
| LP-3DGS | 极低 | — | — |
| MaskGaussian | 中（mask管理） | ~30% | 中 |
| **Pocket-SLAM** | **低（梯度重用）** | **60%+** | **高** |

Pocket-SLAM 在性能和复杂度之间取得了优秀的平衡——以极低的额外开销获得了最高的内存节省。

### 3.7 批判性评价

#### 3.7.1 论文的优势

1. **问题定义清晰**：精准定位了 3DGS-SLAM 部署的核心瓶颈——runtime peak memory
2. **方法设计优雅**：利用 SLAM 流程中已有的计算（梯度），无需额外开销
3. **实验设计严谨**：在相同条件下公平对比多种剪枝方法
4. **消融实验充分**：通过 Fig. 3 清晰展示了 budget mechanism 的必要性
5. **结果令人信服**：60%+ 内存降低 + 2x+ FPS 提升且精度不降

#### 3.7.2 论文的不足

1. **理论分析不足**：缺乏对 rendering-area 作为重要性指标的理论证明或收敛性分析
2. **对比范围有限**：未与最新的 Neural SLAM 或 Implicit Representation 方法对比
3. **场景覆盖不足**：仅有 EuRoC 和 KITTI，缺少更现代的数据集
4. **Tile 设计未深入**：Tile 大小的选择和影响未充分讨论
5. **Temporal aspect 缺失**：未考虑 Gaussian 重要性的时间维度变化

#### 3.7.3 总体评价

**Pocket-SLAM 是一篇 solid engineering paper**。它可能没有突破性的理论创新，但精准地解决了一个实际问题，方法简洁有效，实验充分，开源代码。这种类型的工作对推动 3DGS-SLAM 的实际部署有重要价值。

在 ICRA 2026 发表是恰当的——它完美匹配了 ICRA 对实用机器人技术的偏好。虽然 CVPR/ICCV 等视觉会议可能更关注视觉渲染质量，但 ICRA 更看重系统效率和实际可用性，这正是 Pocket-SLAM 的核心卖点。

### 3.8 小结

Pocket-SLAM 的创新可以归纳为一个核心公式：

> **Rendering Contribution (scene-level) + Tile Budget (region-level) + Immediate Deletion (system-level) = Memory-Efficient 3DGS-SLAM**

这三个层次的创新共同作用，使 3DGS-SLAM 首次在保持精度的同时实现了大规模室外场景的内存可控运行。虽然方法仍有局限性（固定 ratio、语义缺失、动态场景），但它为 3DGS-SLAM 的实际部署迈出了关键一步，也为 Spatial AGI 的基础设施建设提供了重要参考。

---

## 附录：关键术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 3D Gaussian Splatting | 3DGS | 使用 3D Gaussian 进行场景表征和渲染的技术 |
| Simultaneous Localization and Mapping | SLAM | 同时定位与建图 |
| Rendering-Area-Aware Pruning | — | 基于渲染区域感知的剪枝策略 |
| Tile-Level Budget Mechanism | — | 瓦片级预算机制 |
| Absolute Trajectory Error | ATE | 绝对轨迹误差 |
| Root Mean Square Error | RMSE | 均方根误差 |
| Peak Signal-to-Noise Ratio | PSNR | 峰值信噪比 |
| Structural Similarity Index | SSIM | 结构相似性指数 |
| Learned Perceptual Image Patch Similarity | LPIPS | 学习感知图像补丁相似性 |
| Frames Per Second | FPS | 每秒帧数 |
| SE(3) | — | 三维特殊欧氏群 |
| Lie algebra | 𝔰𝔢(3) | 李代数 |
| Loop Closure | — | 回环检测 |
| Bundle Adjustment | BA | 光束法平差 |
| Keyframe | — | 关键帧 |
| Novel View Synthesis | NVS | 新视角合成 |

---

## 附录：论文引用信息

```bibtex
@inproceedings{li2026pocketslam,
  title={Pocket-SLAM: Rendering-Area-Aware Pruning for Memory-Efficient 3DGS-SLAM},
  author={Li, Leshu and Peng, Jie and Zhao, Yang},
  booktitle={2026 IEEE International Conference on Robotics and Automation (ICRA)},
  year={2026},
  organization={IEEE}
}
```

---

*分析完成日期: 2026-06-27*
*分析者: OpenClaw Paper Analysis Agent*
