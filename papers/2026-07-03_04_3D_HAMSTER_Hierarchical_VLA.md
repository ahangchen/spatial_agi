# 3D HAMSTER: Bridging Planning and Control in Hierarchical Vision Language Action Models through 3D Trajectory Guidance

**发表日期**: 2026-06-30  
**arXiv链接**: https://arxiv.org/abs/2606.31329  
**PDF链接**: https://arxiv.org/pdf/2606.31329v2  
**HTML版本**: https://arxiv.org/html/2606.31329v2  
**作者**: Dongyoon Hwang, Byungkun Lee, Dongjin Kim, Hyojin Jang, Hoiyeong Jin, Jueun Mun, Minho Park, Hojoon Lee, Hyunseung Kim, Jaegul Choo  
**机构**: KAIST、POSTECH、Holiday Robotics、KRAFTON AI

---

## 论文摘要

层次化VLA模型将高层规划与底层控制解耦以提升泛化性。现有方法（如HAMSTER）使用VLM预测2D末端执行器轨迹作为指导，但底层策略在3D度量空间（点云）上操作，2D→3D转换产生"涂鸦效应"——轨迹贴附在场景表面而非自由穿过3D空间。3D HAMSTER提出让规划器直接输出度量可靠的3D轨迹（u,v,d）形式，通过深度编码器和密集深度重建目标增强VLM。

---

## Q1: 核心算法原理

### 1. 核心思想和动机

**问题**: 2D-3D表示不匹配。规划器在2D像素坐标推理，控制器在3D度量空间操作。将2D waypoints提升到3D时，每个waypoint的深度由其下方的场景表面决定（而非规划器意图），产生几何扭曲——轨迹"贴"在物体表面而非按规划器意图穿过3D空间。

**核心洞察**: 现代VLM已通过大规模几何丰富预训练获得了显著的3D空间知识（如Qwen3-VL的3D边界框预测），但这种知识尚未被充分利用于机器人轨迹规划。通过针对性的微调和架构增强，可以让VLM直接生成3D轨迹。

### 2. 主要技术方法

#### 3D轨迹规划器

**架构增强**:
- 基础VLM: Qwen3-VL（具备3D空间知识）
- **深度编码器**: 独立初始化的深度编码器，生成深度token捕获几何信息
- **特征融合**: RGB视觉token + 深度token → 各自投影到LLM嵌入空间 → 逐元素融合 → 输入Transformer骨干
- 自回归生成3D轨迹: τ = {(u_t, v_t, d_t)}_{t=1}^T

**深度重建损失**:
- 深度token z_D → 轻量解码器 → 重建完整深度图 D̂ = f_dec(z_D)
- L_depth = ||D̂ - D||₁
- 确保LLM隐藏状态保持度量忠实的深度信息
- 补充稀疏轨迹监督的密集场景级3D先验

**训练数据混合**:
- (i) 3D能力数据（RGB+深度）: 机器人轨迹+空间推理（RefSpatial增强）
- (ii) 保留数据（仅RGB）: 保持基础VLM能力（RoboPoint/PixMo/LVIS/Honey-1M）
- 三种监督变体: 仅2D/仅3D/CoT变体（先2D后提升到3D）

#### 轨迹条件3D底层策略

- 输入: 场景点云 P + 预测3D轨迹 τ
- 3D轨迹通过相机内外参变换到世界坐标
- Waypoints附加到场景点云
- 通过rectified flow matching预测动作块

### 3. 算法流程

```
输入: RGB图像 I, 深度图 D, 语言指令 l, 点云 P
输出: 动作序列 {a_t}

// 高层规划
1. RGB tokens = VisualEncoder(I)
2. Depth tokens = DepthEncoder(D)
3. Fused tokens = Project(RGB_tokens) ⊙ Project(Depth_tokens)
4. τ = VLM.autoregressive(Fused_tokens, l)  → {(u,v,d)_t}
5. 深度重建: D̂ = Decoder(Depth_tokens)  // 正则化

// 底层控制
6. τ_world = TransformToWorld(τ, camera_params)
7. P_extended = P ∪ τ_world
8. {a_t} = FlowMatching(P_extended, τ_world)
```

---

## Q2: 与Spatial AGI的关系

### 1. 空间表示
**2D-3D对齐**: 核心贡献——将规划器的2D空间推理与控制器的3D度量空间对齐。(u,v,d)形式同时兼容图像平面（VLM友好）和度量空间（控制器友好）。

**深度作为一等公民**: 不再从场景表面"借用"深度，而是让规划器主动推理深度。深度编码器+重建损失确保深度信息在VLM内部得到忠实保持。

### 2. 空间关系
**轨迹空间推理**: 轨迹本质上是空间路径——一系列3D位置。2D轨迹丢失了深度维度，导致空间路径不完整。

### 3. 对Spatial AGI的启发
- **表示对齐**: 不同处理层次应使用对齐的空间表示——2D规划+3D执行的不匹配是根本问题
- **深度编码器增强VLM**: 独立深度通路让VLM"看到"几何，而不只是从RGB推断
- **密集正则化**: 稀疏监督不够——需要密集深度重建损失确保内部表示的几何忠实性
- **数据混合策略**: 3D能力数据+保留数据的平衡防止灾难性遗忘

### 4. 应用场景
- 机器人精细操作、跨视角操作、外观变化下的鲁棒操作

---

## Q3: 创新点和局限性

### 创新点
1. **识别并解决2D-3D表示不匹配** — "涂鸦效应"概念的提出和解决
2. **深度编码器+重建损失** — 让VLM获得度量可靠的3D能力
3. **CoT变体训练** — 先预测2D再提升到3D，鼓励一致的像素-深度映射
4. **数据混合策略** — 平衡3D能力获取和2D能力保留
5. **开源** — 代码、模型、项目页面全部公开

### 局限性
1. 依赖RGB-D相机输入（非所有机器人都有）
2. 单视角深度估计的精度限制
3. 深度编码器增加计算开销
4. 仅验证了pick-and-place类任务

### 与近期研究对比
- vs HAMSTER: 2D→3D的直接升级，保持层次化架构
- vs RoboTracer: RoboTracer是独立运动规划器，3D HAMSTER闭环集成底层控制器
- vs VLK(07-01): VLK用运动学轨迹作为接口，3D HAMSTER用(u,v,d)3D轨迹——不同的轨迹表示
- vs ViPSim(07-02): ViPSim通过Plücker嵌入和动作投影间接解决深度问题，3D HAMSTER直接预测深度

---

## 核心技术发现

1. **"涂鸦效应"是2D-3D不匹配的具体表现** — 2D轨迹提升到3D时贴附在场景表面
2. **VLM已具备3D知识但需要激活** — Qwen3-VL有3D bbox能力，但需要针对性微调
3. **密集深度正则化是关键** — 仅稀疏轨迹监督不足以保持几何忠实性
4. **3D指导在外观扰动下优势最大** — 不依赖外观特征，直接用几何指导

---

## 与Spatial AGI的关系

### 直接贡献
- **表示对齐范式**: 不同处理层次的空间表示应该对齐
- **深度增强VLM**: 独立深度通路让VLM真正"理解"3D
- **开源资源**: 代码+模型可用于Spatial AGI研究

### 技术启发
- 层次化系统中表示一致性是关键——规划空间≈执行空间
- 密集正则化比稀疏监督更有效保持几何能力
- 数据混合策略防止灾难性遗忘

---

## 个人思考

**"涂鸦效应"是一个精彩的概念化**。将2D轨迹提升到3D时的"贴附表面"问题，直观地展示了2D-3D不匹配的具体后果。这不是一个抽象的学术问题——它直接导致机器人在执行时轨迹被场景几何扭曲。

**与ViPSim的有趣对比**: ViPSim通过将动作投影为2D视觉表示（在像素位置画圆）来解决表示鸿沟，而3D HAMSTER通过让VLM直接输出3D来解决同一鸿沟。两种方向——一个将3D→2D，另一个将2D→3D——反映了表示对齐问题的两种解法。

---

## 关键数据

| 评估 | 结果 |
|------|------|
| DroidSpatial-Bench | 超越Gemini-3.0-Pro和RoboBrain 2.5 |
| Colosseum (11任务,14扰动) | 3D指导一致优于2D |
| 真实Franka Panda | 3任务×4泛化轴均有提升 |
| 最大优势 | 外观变化扰动下 |

---

## 总结

3D HAMSTER通过让VLM规划器直接输出3D轨迹(u,v,d)，解决了层次化VLA中的2D-3D表示不匹配问题。深度编码器+密集重建损失确保度量可靠的3D预测。核心启示：**规划空间和执行空间应该对齐——层次化系统的不同层次不应存在表示鸿沟**。

---

**文档创建时间**: 2026-07-03
