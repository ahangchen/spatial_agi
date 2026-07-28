# Spatial AGI Research Papers - Daily Analysis

## 2026-07-24 研究的论文（精选5篇）

1. **IGGT4D: Streaming 4D Instance-Grounded Geometry Transformer** - arXiv:2607.19228
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: streaming 4D, instance grounding, causal attention, geometry-instance unified
   - 文档: papers/2026-07-24_01_IGGT4D_Streaming_4D_Instance_Grounded_Geometry.md
   - 亮点: 因果流式几何-实例统一Transformer，O(1)流式聚类，InsScene4D-147K数据集

2. **Xiaomi-Robotics-1: Scaling VLA Models with 100K+ Hours Real-World Data** - arXiv:2607.15330
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, large-scale, flow matching, embodied AI
   - 文档: (摘要分析见每日思考)
   - 亮点: 100K+小时UMI数据，RoboCasa365 57.6%，两阶段训练(pre-training + post-training)

3. **Scene-SAM3D: Multi-View Scene Asset Generation Without Fine-Tuning** - arXiv:2607.16805
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D scene generation, training-free, multi-view, SAM3D
   - 文档: (摘要分析见每日思考)
   - 亮点: 免微调多视角场景生成，选择-融合-对齐三阶段管线，Replica CD减少43.8%

4. **SafeRelBench: Spatial-Relation-Aware Benchmark for Process-Level Safety** - arXiv:2607.14543
   - 相关性: ⭐⭐⭐⭐
   - 关键词: spatial safety, process-level evaluation, VLM embodied, benchmark
   - 文档: (摘要分析见每日思考)
   - 亮点: 首个空间关系感知过程级安全基准，507样本，248空间关系场景

5. **CDIS: Cross-Dimensional Class-Agnostic 3D Instance Segmentation** - arXiv:2607.17778
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D instance segmentation, class-agnostic, cross-dimensional, zero-shot
   - 文档: (摘要分析见每日思考)
   - 亮点: 2D-3D跨维度反馈循环，zero-shot training-free，superpoint作为几何锚点

## 2026-06-29 研究的论文（精选5篇）

1. **AirGroundBench: Probing Spatial Intelligence in Multimodal Large Models under Heterogeneous Multi-View Embodied Collaboration** - arXiv:2606.28049
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Air-Ground Collaboration, Heterogeneous Multi-View, Spatial Intelligence Benchmark, VLN, Cross-View Alignment
   - 文档: papers/2026-06-29_AirGroundBench.md
   - 亮点: 首个系统性空地协同空间智能基准，揭示跨视角几何一致性是MLLM核心瓶颈，四维渐进能力分类法（感知→对齐→推理→决策）

2. **GEAR-VLA: Learning Geometry-Aware Action Representations for Generalizable Robotic Manipulation** - arXiv:2606.08530
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Geometry-Aware, Action Representation, Embodiment Canonicalization, Zero-init 3D Injection, Flow Matching
   - 文档: papers/2026-06-29_GEAR-VLA.md
   - 亮点: 零初始化3D几何融合+本体规范化+梯度解耦DiT动作专家，212物体6360次抓取90.1%成功率，跨本体迁移81%

3. **Perceptual 3D Simulation With Physical World Modeling (P3Sim)** - arXiv:2606.27575
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Physical World Model, Probabilistic Graphical Model, Pointer-Value Autoregressive, Geometrizer, Persistent Scene Memory
   - 文档: papers/2026-06-29_Perceptual3DSim.md
   - 亮点: CVPR 2026，将场景理解建模为概率图模型推理，指针机制实现随机访问解码，统一NVS/操控/动态预测

4. **S-Agent: Spatial Tool-Use Elicits Reasoning for Spatial Intelligence** - arXiv:2606.20515
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Intelligence, Agent, Evidence Accumulation, Scene Memory, S-300K, NTU
   - 文档: papers/2026-06-29_SAgent.md
   - 亮点: 时空证据累积范式，Scene Memory+Agent Memory双记忆系统，S-Agent-8B用8B参数匹配GPT-5.4和Gemini 3的空间推理能力

5. **SpatialUAV: Benchmarking Spatial Intelligence for Low-Altitude UAV Perception, Collaboration, and Motion** - arXiv:2606.27876
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: UAV Benchmark, Spatial Intelligence, Aerial-Aerial Collaboration, Aerial-Ground Collaboration, Motion Understanding
   - 文档: papers/2026-06-29_SpatialUAV.md
   - 亮点: 首个系统性低空UAV空间智能基准，4331实例14任务5维度，18个VLM评测揭示跨视角关联和几何推理瓶颈

---

## 2026-05-26 研究的论文（精选5篇）

1. **GEM-4D: Geometry-Enhanced Video World Models for Robot Manipulation** - arXiv:2605.22882
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Video World Model, 4D Geometry Distillation, Robot Manipulation, Inverse Dynamics, Correspondence
   - 文档: papers/2026-05-26_01_GEM-4D_Geometry_Enhanced_Video_World_Models.md
   - 亮点: 将4D几何基础模型表征蒸馏到视频世界模型，实现几何一致的视频生成，真实世界操作61%→81%

2. **SWEET: Sparse World Modeling with Image Editing for Embodied Task Execution** - arXiv:2605.19319
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Sparse World Model, Image Editing, Keyframe Planning, Embodied Task, FLUX-Kontext
   - 文档: papers/2026-05-26_02_SWEET_Sparse_World_Modeling_Embodied.md
   - 亮点: 首次系统性比较图像编辑vs视频生成用于机器人规划，发现图像编辑更高效可靠

3. **GesVLA: Gesture-Aware Vision-Language-Action Model with Embedded Representations** - arXiv:2605.22812
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Gesture, Dual-VLM, Spatial Ambiguity, Human-Robot Interaction
   - 文档: papers/2026-05-26_03_GesVLA_Gesture_Aware_VLA.md
   - 亮点: 将手势作为VLA一等模态，双VLM架构解耦意图推理和动作生成

4. **AffordVLA: Injecting Affordance Representations into VLA via Implicit Feature Alignment** - arXiv:2605.17517
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Affordance, Implicit Feature Alignment, Zero-shot Teacher, Manipulation
   - 文档: papers/2026-05-26_04_AffordVLA_Affordance_VLA.md
   - 亮点: 通过隐式特征对齐将可供性知识内化到VLA视觉表征，零推理开销

5. **Distilling 3D Spatial Reasoning into a Lightweight VLM with CoT** - arXiv:2605.09719
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Knowledge Distillation, 3D Spatial Reasoning, Hidden CoT, Lightweight VLM, VGGT
   - 文档: papers/2026-05-26_05_Distilling_3D_Spatial_Reasoning_Lightweight_VLM.md
   - 亮点: 首次在蒸馏3D VLM中引入Hidden CoT，7B→2.29B实现8.7x推理加速

## 2026-05-16 研究的论文（精选5篇）

1. **PG-3DGS: Optimizing 3D Gaussian Splatting to Satisfy Physics Objectives** - arXiv:2605.11266
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Differentiable Physics, Physical Objectives, Teapot Pouring, Aerodynamic Lift
   - 文档: papers/2026-05-16_01_PG-3DGS.md
   - 亮点: 首个将可微物理模拟集成到3DGS生成，从"视觉重建"到"功能生成"的范式转移，真实3D打印测试证明升力提升

2. **Evo-Depth: A Lightweight Depth-Enhanced Vision-Language-Action Model** - arXiv:2605.14950
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 隐式深度编码, 无传感器空间理解, 轻量级设计, 0.9B参数
   - 文档: papers/2026-05-16_02_Evo-Depth.md
   - 亮点: 无需额外深度传感器，从RGB高效提取紧凑深度特征，多仿真基准全部领先

3. **Exploring Bottlenecks in VLM-LLM Navigation: 3D Scene Understanding Impact** - arXiv:2605.14801
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM-LLM导航, 感知饱和, 成功率先验上界, 双层系统, 核心词汇优先
   - 文档: papers/2026-05-16_03_VLM-LLM-Navigation.md
   - 亮点: 首次量化3D场景理解对VLN性能的实际影响，发现感知饱和现象，指导空间智能的效率优化

4. **From Reaction to Anticipation: Proactive Failure Recovery through Agentic Task Graph** - arXiv:2605.11951
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: AgentChord, 预编译恢复分支, 低延迟监控, 编排器（Composer/Arranger/Conductor）
   - 文档: papers/2026-05-16_04_AgentChord.md
   - 亮点: 从反应式到主动式的范式转移，预先规划恢复路径，RSS 2026

5. **PointGS: Semantic-Consistent Unsupervised 3D Point Cloud Segmentation** - arXiv:2605.11520
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS中间表示, 无监督分割, SAM, 对比学习, 多视角融合
   - 文档: papers/2026-05-16_05_PointGS.md
   - 亮点: 3D Gaussian Splatting作为统一中间表示解决离散-连续域差距，ScanNet-V2 +0.9% mIoU, S3DIS +2.8% mIoU

---

## 2026-05-02

### 01_GSDrive_3DGS_Driving_Policy_Reinforcement.md
**Title**: GSDrive: Reinforcing Driving Policies by Multi-mode Trajectory Probing with 3DGS Environment
**Date**: 2026-04-30
**arXiv**: 2604.28111
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: 3DGS, RL, Autonomous Driving, Trajectory Probing, Flow Matching, Spatial Simulation
**Summary**: 利用3DGS环境进行多模态轨迹探测，通过未来轨迹的物理仿真获得密集奖励信号增强驾驶策略

### 02_LaST-R1_Latent_Reasoning_VLA.md
**Title**: LaST-R1: Reinforcing Action via Adaptive Physical Latent Reasoning for VLA Models
**Date**: 2026-04-30
**arXiv**: 2604.28192
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: VLA, Latent CoT, RL, Physical Reasoning, LIBERO, Spatial Intelligence
**Summary**: 潜在空间物理推理与动作生成联合优化的VLA框架，LIBERO上99.8%成功率

### 03_MotuBrain_World_Action_Model.md
**Title**: MotuBrain: An Advanced World Action Model for Robot Control
**Date**: 2026-04-30
**arXiv**: 2604.27792
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: World Model, Action Model, UniDiffuser, Mixture-of-Transformers, Robot Control
**Summary**: 统一多模态生成模型联合建模视频和动作，支持策略学习、世界建模等多种推理模式

### 04_Semantic_Foam_Spatial_Semantic_Decomposition.md
**Title**: Semantic Foam: Unifying Spatial and Semantic Scene Decomposition
**Date**: 2026-04-29
**arXiv**: 2604.26262
**Relevance**: ⭐⭐⭐⭐
**Keywords**: 3DGS, Semantic Segmentation, Voronoi, Scene Understanding, CVPR 2026 Highlight
**Summary**: 基于Voronoi网格的空间-语义统一场景分解，超越点级3DGS语义方法

### 05_3D_Generation_Embodied_AI_Survey.md
**Title**: 3D Generation for Embodied AI and Robotic Simulation: A Survey
**Date**: 2026-04-29
**arXiv**: 2604.26509
**Relevance**: ⭐⭐⭐⭐
**Keywords**: 3D Generation, Embodied AI, Sim2Real, Survey, Simulation
**Summary**: 首个3D生成在Embodied AI中应用的系统综述，从视觉真实感转向交互就绪

## 2026-04-30

### 01_Recursive Multi-Agent Systems.md
**Title**: Recursive Multi-Agent Systems: Toward a Functional Geometric Algebra for Natural Language Semantics
**Date**: 2026-04-28
**arXiv**: 2604.25917
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: Recursive Multi-Agent Systems, Natural Language Semantics, Geometric Algebra, Composition, Type System
**Summary**: 系统性分析递归多智能体系统中的潜在空间协作机制

### 02_TSN-Affinity.md
**Title**: TSN-Affinity: Continuous Off-line Reinforcement Learning with Parameter Sharing
**Date**: 2026-04-29
**arXiv**: 2604.25858
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: Reinforcement Learning, Parameter Sharing, Offline RL, Task Affinity
**Summary**: 研究了TSN-Affinity机制，即任务间的参数共享如何提升强化学习效率

### 03_Investigation_into_In_Context_Learning.md
**Title**: Investigation into In-Context Learning Capabilities of Transformers
**Date**: 2026-04-28
**arXiv**: 2604.25858
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: In-Context Learning, Transformers, ICL, Benign Overfitting, Spatial Representation
**Summary**: 系统性研究了Transformer在上下文学习中的扩展行为

### 04_Functional_Geometric_Algebra.md
**Title**: Toward a Functional Geometric Algebra for Natural Language Semantics
**Date**: 2026-04-28
**arXiv**: 2604.25902
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: Geometric Algebra, Clifford Algebra, Natural Language Semantics, Grade System, Type Constraints
**Summary**: 提出了功能几何代数(FGA)框架，将Clifford代数扩展为支持类型化、组合语义的自然语言表示系统

### 05_When_Errors_Can_Be_Beneficial.md
**Title**: When Errors Can Be Beneficial: A Categorization of Imperfect Rewards for Policy Gradient
**Date**: 2026-04-28
**arXiv**: 2604.25872
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: Reinforcement Learning, Reward Design, Error Categorization, Harmful/Benign/Beneficial Errors, Policy Gradient
**Summary**: 挑战了强化学习中"奖励误差=坏"的传统观念，通过理论分析建立奖励误差分类系统

---

## 2026-04-29

1. **BLaDA: Bridging Language to Functional Dexterous Actions within 3DGS Fields** - arXiv:2604.08410v1
2. **DP-DeGauss: Dynamic Probabilistic Gaussian Decomposition for Egocentric 4D Scene Reconstruction** - arXiv:2604.07986v1

## 2026-04-10

1. **Faithful GRPO: Improving Visual Spatial Reasoning in Multimodal Language Models via Constrained Policy Optimization** - arXiv:2604.24300
2. **OpenSpatial: A Principled Data Engine for Empowering Spatial Intelligence** - arXiv:2604.07296

## 2026-04-09

1. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:2604.07660
2. **GS I-Bench: Exploring Spatial Intelligence from a Generative Perspective** - arXiv:2604.20570

## 2026-04-11

1. **Splatblox: Traversability-Aware Gaussian Splatting for 3D Geometric Priors** - arXiv:2604.07053v2
2. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Models** - arXiv:2604.08340

## 2026-04-15

1. **SpaceDrive: Infusing Spatial Awareness into VLM-based Autonomous Driving** - arXiv:2604.11135
2. **SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities** - arXiv:2401.12168

## 2026-04-17

1. **AudioGS: Spectrogram-Based Audio Gaussian Splatting for Sound Field Reconstruction** - arXiv:2604.08967
2. **GEAR: GEometry-motion Alternating Refinement for Articulated Object Modeling with Gaussian Splatting** - arXiv:2604.07728

## 2026-04-16

1. **Details Matter: Indoor Open-vocabulary 3D Instance Segmentation with Superpoints** - arXiv:2507.23134
2. **MASS: Mesh-inellipse Aligned Deformable Surfel Splatting for Hand Reconstruction and Rendering** - arXiv:2604.08943

## 2026-04-18

1. **DOC-GS: Dual-Domain Observation and Calibration for Reliable Sparse-View Gaussian Splatting** - arXiv:2604.06739
2. **Scene-Agnostic Object-Centric Representation Learning for 3D Gaussian Splatting** - arXiv:2604.09045

## 2026-04-20

1. **GlobalSplat: Efficient Feed-Forward 3D Gaussian Splatting via Global Scene Tokens** - arXiv:2604.15284
2. **Rein3D: Reinforced 3D Indoor Scene Generation with Panoramic Video Diffusion** - arXiv:2604.10578

## 2026-04-21

1. **ManipArena: Comprehensive Real-world Evaluation of Reasoning-Oriented Generalist Robot Manipulation** - arXiv:2603.28545
2. **Habitat-GS: High-Fidelity Navigation Simulator with Dynamic Gaussian Splatting** - arXiv:2604.12626
3. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Action Models** - arXiv:2604.08340

## 2026-04-22

1. **MultiWorld: Scalable Multi-Agent Multi-View Video World Models** - arXiv:2604.18564
2. **Unmasking: Unmasking Illusion of Embodied Reasoning in Vision-Language-Action Models** - arXiv:2604.18000
3. **EmbodiedLGR: Integrating Lightweight Graph Representation and Retrieval for Semantic-Spatial Memory in Robotic Agents** - arXiv:2604.18271
4. **Robotic Manipulation is Vision-to-Geometry Mapping (f(v)→G): Vision-Geometry Backbones over Language and Video Models** - arXiv:2604.12908

## 2026-04-23

1. **CityRAG: Stepping Into a City via Spatially-Grounded Video Generation** - arXiv:2604.19741
2. **SpaceMind: A Modular and Self-Evolving VLM Agent Framework for Autonomous On-orbit Servicing** - arXiv:2604.14399
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System** - arXiv:2604.14125
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning** - arXiv:2603.27437

## 2026-04-24

1. **E3VS-Bench: A Benchmark for Viewpoint-Dependent Active Perception in 3D Gaussian Splatting Scenes** - arXiv:2604.17969
2. **PokeVLA: Empowering Pocket-Sized Vision-Language-Action Model with Comprehensive World Knowledge Guidance** - arXiv:2604.20834
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning** - arXiv:2604.19683
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment** - arXiv:2604.20246
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling** - arXiv:2604.19734

## 2026-04-25

1. **WorldMark: A Unified Benchmark Suite for Interactive Video World Models** - arXiv:2604.21686
2. **FluSplat: Sparse-View 3D Editing without Test-Time Optimization** - arXiv:2604.20038
3. **EmbodiedMidtrain: Bridging VLMs and VLA Models via Mid-training** - arXiv:2604.20012
4. **Explore Like Humans: Autonomous Exploration with Online SG-Memo Construction** - arXiv:2604.19034
5. **XEmbodied: A Foundation Model with Enhanced Geometric and Physical Cues** - arXiv:2604.18484

## 2026-04-26

1. **NeRF vs 3DGS Geometric Accuracy** - arXiv:2604.18205
2. **GRCA: Geometric Reward Credit Assignment** - arXiv:2604.21160
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping** - arXiv:2604.22339
4. **GazeVLA: Learning Human Intention** - arXiv:2604.22615
5. **NRGS: Neural Regularization for 3D Semantic GS** - arXiv:2604.22439

## 2026-04-27

1. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments** - arXiv:2604.14144
2. **SpaceMind: A Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing** - arXiv:2604.14399
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System** - arXiv:2604.14125
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning** - arXiv:2603.27437

## 2026-04-28

1. **ReVSI: Rebuilding Visual Spatial Intelligence Evaluation** - arXiv:2604.24300
2. **OpenSpatial: A Principled Data Engine for Spatial Intelligence** - arXiv:2604.07296
3. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:2604.07660
4. **GSI-Bench: Exploring Spatial Intelligence from a Generative Perspective** - arXiv:2604.20570

## 2026-04-21

1. **GlobalSplat: Efficient Feed-Forward 3D Gaussian Splatting via Global Scene Tokens** - arXiv:2604.15284
2. **Rein3D: Reinforced 3D Indoor Scene Generation with Panoramic Video Diffusion** - arXiv:2604.10578
3. **EmbodiedMidtrain: Bridging VLMs and VLA Models via Mid-training** - arXiv:2604.20012
4. **Explore Like Humans: Autonomous Exploration with Online SG-Memo Construction** - arXiv:2604.19034
5. **XEmbodied: A Foundation Model with Enhanced Geometric and Physical Cues** - arXiv:2604.18484

## 2026-04-20

1. **Splatblox: Traversability-Aware Gaussian Splatting for 3D Geometric Priors** - arXiv:2604.07053
2. **DriveVAE: Video Action Zero-Shot Driving** - arXiv:2604.08168
3. **TreeGaussian: Hierarchical 3D Gaussian Splatting Segmentation** - arXiv:2604.08542
4. **SFGS: Structure-Aware Fine-Grained Gaussian Splatting for Expressive Avatar Reconstruction** - arXiv:2604.09324
5. **SIC3D: Style-Conditioned Text-to-3D Gaussian Splatting Generation** - arXiv:2604.08760

## 2026-04-09

1. **From Blobs to Spokes: High-Fidelity Surface Reconstruction via Oriented Gaussians** - arXiv:2604.07337
2. **DOC-GS: Dual-Domain Observation and Calibration for Reliable Sparse-View Gaussian Splatting** - arXiv:2604.06739
3. **Scene-Agnostic Object-Centric Representation Learning for 3D Gaussian Splatting** - arXiv:2604.09045
4. **SpaceMind: Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing** - arXiv:2604.14399
5. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System** - arXiv:2604.14125
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning** - arXiv:2603.27437

## 2026-04-08

1. **Spatio_Temporal_Grounding_of_LLMs_Perception_Streams.md
**Title**: Spatio-Temporal Grounding of Large Language Models from Perception Streams
**Date**: 2026-04-08
**arXiv**: 2401.05039
**Relevance**: ⭐⭐⭐⭐⭐
**Keywords**: Grounding, Large Language Models, Perception Streams, Temporal Reasoning
**Summary**: 探讨了VLM在时空基础上的接地问题

## 2026-04-11

1. **Faithful_GRPO_Spatial_Reasoning_VLMs.md
**Title**: Faithful GRPO: Improving Visual Spatial Reasoning in Multimodal Language Models via Constrained Policy Optimization** - arXiv:2604.24300
2. **OpenSpatial_Principled_Data_Engine_Spatial_Intelligence.md
**Title**: OpenSpatial: A Principled Data Engine for Spatial Intelligence** - arXiv:2604.07296
3. **Holi_Spatial_Evolving_3D_Video_Holistic_Spatial_Intelligence.md
**Title**: Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:2604.07660
4. **GS I-Bench: Exploring Spatial Intelligence from a Generative Perspective** - arXiv:2604.20570

## 2026-04-10

1. **BLaDA: Bridging Language to Functional Dexterous Actions within 3DGS Fields** - arXiv:2604.08410v1
2. **DP-DeGauss: Dynamic Probabilistic Gaussian Decomposition for Egocentric 4D Scene Reconstruction** - arXiv:2604.07986
3. **SelfEvo: Self-Improving 4D Perception via Self-Distillation** - arXiv:2604.08532
4. **Phantom: Physics-Informed Video Generation via Joint Modeling of Visual and Latent Physical Dynamics** - arXiv:2604.08503

## 2026-04-07

1. **Details_Matter_Indoor_Open-vocabulary_3D_Instance_Segmentation.md
**Title**: Details Matter: Indoor Open-vocabulary 3D Instance Segmentation
**Date**: 2026-04-07
**arXiv**: 2507.23134
**Relevance**: ⭐⭐⭐⭐
**Keywords**: 3D Segmentation, Open Vocabulary, Instance Segmentation, Indoor Understanding

## 2026-04-06

1. **Geo3DVQA_Evaluating_Vision-Language_Models_for_3D_Geospatial_Reasoning.md
**Title**: Geo3DVQA: Evaluating Vision-Language Models for 3D Geospatial Reasoning
**Date**: 2026-04-07
**arXiv**: 2512.07276
**Relevance**: ⭐⭐⭐⭐
**Keywords**: 3D Geospatial Reasoning, Vision-Language Models, Geospatial Understanding, Benchmark

## 2026-04-22

1. **LEGO-Eval_Towards_Fine-Grained_Evaluation_on_Synthesizing_3D_Embodied_Environments.md
**Title**: LEGO: Towards Fine-Grained Evaluation on Synthesizing 3D Embodied Environments
**Date**: 2026-04-07
**arXiv**: 2511.03001
**Relevance**: ⭐⭐⭐⭐
**Keywords**: 3D Embodied AI, Fine-Grained Models, Environment Synthesis, Evaluation

## 2026-04-21

1. **Habitat-GS: High-Fidelity Navigation Simulator with Dynamic Gaussian Splatting** - arXiv:2604.12626
2. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Models** - arXiv:2604.08340
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning** - arXiv:2604.19683
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment** - arXiv:2604.20246
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling** - arXiv:2604.19734

## 2026-04-23

1. **ManipArena: Comprehensive Real-world Evaluation of Reasoning-Oriented Robot Manipulation** - arXiv:2603.28545
2. **Habitat-GS: High-Fidelity Navigation Simulator with Dynamic Gaussian Splatting** - arXiv:2604.12626
3. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Models** - arXiv:2604.08340
4. **EmbodiedLGR: Integrating Lightweight Graph Representation and Retrieval for Semantic-Spatial Memory in Robotic Agents** - arXiv:2604.18271
5. **Robotic Manipulation is Vision-to-Geometry Mapping** - arXiv:2604.12908

## 2026-04-24

1. **E3VS-Bench: A Benchmark for Viewpoint-Dependent Active Perception in 3D Gaussian Splatting Scenes** - arXiv:2604.17969
2. **PokeVLA: Empowering Pocket-Sized Vision-Language-Action Model with Comprehensive World Knowledge Guidance** - arXiv:2604.20834
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning** - arXiv:2604.19683
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment** - arXiv:2604.20246
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling** - arXiv:2604.19734

## 2026-04-25

1. **WorldMark: A Unified Benchmark Suite for Interactive Video World Models** - arXiv:2604.21686
2. **FluSplat: Sparse-View 3D Editing without Test-Time Optimization** - arXiv:2604.20038
3. **EmbodiedMidtrain: Bridging VLMs and VLA Models via Mid-training** - arXiv:2604.20012
4. **Explore Like Humans: Autonomous Exploration with Online SG-Memo Construction** - arXiv:2604.19034
5. **XEmbodied: A Foundation Model with Enhanced Geometric and Physical Cues** - arXiv:2604.18484

## 2026-04-27

1. **NeRF vs 3DGS Geometric Accuracy** - arXiv:2604.18205
2. **GRCA: Geometric Reward Credit Assignment** - arXiv:2604.21160
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping** - arXiv:2604.22339
4. **GazeVLA: Learning Human Intention** - arXiv:2604.22615
5. **NRGS: Neural Regularization for 3D Semantic GS** - arXiv:2604.22439

## 2026-04-28

1. **ReVSI: Rebuilding Visual Spatial Intelligence Evaluation** - arXiv:2604.24300
2. **OpenSpatial: A Principled Data Engine for Spatial Intelligence** - arXiv:2604.07296
3. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:2604.07660
4. **GSI-Bench: Exploring Spatial Intelligence from a Generative Perspective** - arXiv:2604.20570

## 2026-04-20

1. **Splatblox: Traversability-Aware Gaussian Splatting for 3D Geometric Priors** - arXiv:2604.07053
2. **DriveVAE: Video Action Zero-Shot Driving** - arXiv:2604.08168
3. **TreeGaussian: Hierarchical 3D Gaussian Splatting Segmentation** - arXiv:2604.08542
4. **SFGS: Structure-Aware Fine-Grained Gaussian Splatting for Expressive Avatar Reconstruction** - arXiv:2604.09324
5. **SIC3D: Style-Conditioned Text-to-3D Gaussian Splatting Generation** - arXiv:2604.08760

## 2026-04-17

1. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments** - arXiv:2604.14144
2. **SpaceMind: A Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing** - arXiv:2604.14399
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System** - arXiv:2604.14125
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning** - arXiv:2603.27437

## 2026-04-09

1. **Spatio_Temporal_Grounding_of_LLMs_Perception_Streams.md
**Title**: Spatio-Temporal Grounding of Large Language Models from Perception Streams
**Date**: 2026-04-08
**arXiv**: 2401.05039
**Relevance**: ⭐⭐⭐⭐
**Keywords**: Grounding, Large Language Models, Perception Streams, Temporal Reasoning

## 2026-04-10

1. **Splatblox: Traversability-Aware Gaussian Splatting for 3D Geometric Priors** - arXiv:2604.07053
2. **DriveVAE: Video Action Zero-Shot Driving** - arXiv:2604.08168
3. **TreeGaussian: Hierarchical 3D Gaussian Splatting Segmentation** - arXiv:2604.08542
4. **SFGS: Structure-Aware Fine-Grained Gaussian Splatting for Expressive Avatar Reconstruction** - arXiv:2604.09324
5. **SIC3D: Style-Conditioned Text-to-3D Gaussian Splatting Generation** - arXiv:2604.08760

## 2026-04-11

1. **Faithful_GRPO_Spatial_Reasoning_VLMs.md
**Title**: Faithful GRPO: Improving Visual Spatial Reasoning in Multimodal Language Models via Constrained Policy Optimization
**Date**: 2026-04-11
**arXiv**: 2604.24300
2. **OpenSpatial_Principled_Data_Engine_Spatial_Intelligence.md
**Title**: OpenSpatial: A Principled Data Engine for Spatial Intelligence
3. **Holi_Spatial_Evolving_3D_Video_Holistic_Spatial_Intelligence.md
4. **GS I-Bench: Exploring Spatial Intelligence from a Generative Perspective**

## 2026-04-15

1. **SpaceDrive: Infusing Spatial Awareness into VLM-based Autonomous Driving** - arXiv:2604.11135
2. **SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities**
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning**

## 2026-04-08

1. **AudioGS: Spectrogram-Based Audio Gaussian Splatting for Sound Field Reconstruction** - arXiv:2604.08967
2. **GEAR: GEometry-motion Alternating Refinement for Articulated Object Modeling with Gaussian Splatting**
3. **Details Matter: Indoor Open-vocabulary 3D Instance Segmentation**

## 2026-04-18

1. **DOC-GS: Dual-Domain Observation and Calibration for Reliable Sparse-View Gaussian Splatting**
2. **Scene-Agnostic Object-Centric Representation Learning for 3D Gaussian Splatting**
3. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments**
4. **SpaceMind: Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing**
5. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**

## 2026-04-16

1. **NeRF vs 3DGS Geometric Accuracy**
2. **GRCA: Geometric Reward Credit Assignment**
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping**
4. **GazeVLA: Learning Human Intention**
5. **NRGS: Neural Regularization for 3D Semantic GS**

## 2026-04-21

1. **ManipArena: Comprehensive Real-world Evaluation of Reasoning-Oriented Robot Manipulation**
2. **Habitat-GS: High-Fidelity Navigation Simulator with Dynamic Gaussian Splatting**
3. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Models**
4. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning**
5. **Cortex2: Grounding World Models in Real-World Industrial Deployment**

## 2026-04-23

1. **MultiWorld: Scalable Multi-Agent Multi-View Video World Models**
2. **Unmasking: Unmasking Illusion of Embodied Reasoning in Vision-Language-Action Models**
3. **EmbodiedLGR: Integrating Lightweight Graph Representation and Retrieval for Semantic-Spatial Memory in Robotic Agents**
4. **Robotic Manipulation is Vision-to-Geometry Mapping**

## 2026-04-25

1. **E3VS-Bench: A Benchmark for Viewpoint-Dependent Active Perception in 3D Gaussian Splatting Scenes**
2. **PokeVLA: Empowering Pocket-Sized Vision-Language-Action Model with Comprehensive World Knowledge Guidance**
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning**
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment**
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling**

## 2026-04-24

1. **NeRF vs 3DGS Geometric Accuracy**
2. **GRCA: Geometric Reward Credit Assignment**
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping**
4. **GazeVLA: Learning Human Intention**
5. **NRGS: Neural Regularization for 3D Semantic GS**

## 2026-04-27

1. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments**
2. **SpaceMind: A Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing**
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning**

## 2026-04-26

1. **GlobalSplat: Efficient Feed-Forward 3D Gaussian Splatting via Global Scene Tokens**
2. **Rein3D: Reinforced 3D Indoor Scene Generation with Panoramic Video Diffusion**
3. **EmbodiedMidtrain: Bridging VLMs and VLA Models via Mid-training**
4. **Explore Like Humans: Autonomous Exploration with Online SG-Memo Construction**
5. **XEmbodied: A Foundation Model with Enhanced Geometric and Physical Cues**

## 2026-04-28

1. **ReVSI: Rebuilding Visual Spatial Intelligence Evaluation**
2. **OpenSpatial: A Principled Data Engine for Spatial Intelligence**
3. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence**
4. **GSI-Bench: Exploring Spatial Intelligence from a Generative Perspective**

---

## 2026-04-20

1. **Splatblox: Traversability-Aware Gaussian Splatting for 3D Geometric Priors**
2. **DriveVAE: Video Action Zero-Shot Driving**
3. **TreeGaussian: Hierarchical 3D Gaussian Splatting Segmentation**
4. **SFGS: Structure-Aware Fine-Grained Gaussian Splatting for Expressive Avatar Reconstruction**
5. **SIC3D: Style-Conditioned Text-to-3D Gaussian Splatting Generation**

---

## 2026-04-09

1. **Spatio_Temporal_Grounding_of_LLMs_Perception_Streams.md**
2. **OpenSpatial_Principled_Data_Engine_Spatial_Intelligence.md**
3. **Holi-Spatial_Evolving_3D_Video_Holistic_Spatial_Intelligence.md**
4. **GS I-Bench: Exploring Spatial Intelligence from a Generative Perspective**

## 2026-04-11

1. **Faithful_GRPO_Spatial_Reasoning_VLMs.md**
2. **OpenSpatial_Principled_Data_Engine_Spatial_Intelligence.md**
3. **Holi-Spatial_Evolving_3D_Video_Holistic_Spatial_Intelligence.md**
4. **GS I-Bench: Exploring Spatial Intelligence from a Generative Perspective**

## 2026-04-15

1. **SpaceDrive: Infusing Spatial Awareness into VLM-based Autonomous Driving**
2. **SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities**
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning**

## 2026-04-08

1. **AudioGS: Spectrogram-Based Audio Gaussian Splatting for Sound Field Reconstruction**
2. **GEAR: GEometry-motion Alternating Refinement for Articulated Object Modeling with Gaussian Splatting**
3. **Details Matter: Indoor Open-vocabulary 3D Instance Segmentation**

## 2026-04-18

1. **DOC-GS: Dual-Domain Observation and Calibration for Reliable Sparse-View Gaussian Splatting**
2. **Scene-Agnostic Object-Centric Representation Learning for 3D Gaussian Splatting**
3. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments**
4. **SpaceMind: Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing**
5. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**

## 2026-04-16

1. **NeRF vs 3DGS Geometric Accuracy**
2. **GRCA: Geometric Reward Credit Assignment**
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping**
4. **GazeVLA: Learning Human Intention**
5. **NRGS: Neural Regularization for 3D Semantic GS**

## 2026-04-21

1. **ManipArena: Comprehensive Real-world Evaluation of Reasoning-Oriented Robot Manipulation**
2. **Habitat-GS: High-Fidelity Navigation Simulator with Dynamic Gaussian Splatting**
3. **PokeGym: A Visually-Driven Long-Horizon Benchmark for Vision-Language Models**
4. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning**
5. **Cortex2: Grounding World Models in Real-World Industrial Deployment**

## 2026-04-23

1. **MultiWorld: Scalable Multi-Agent Multi-View Video World Models**
2. **Unmasking: Unmasking Illusion of Embodied Reasoning in Vision-Language-Action Models**
3. **EmbodiedLGR: Integrating Lightweight Graph Representation and Retrieval for Semantic-Spatial Memory in Robotic Agents**
4. **Robotic Manipulation is Vision-to-Geometry Mapping**

---

## 2026-04-22

1. **E3VS-Bench: A Benchmark for Viewpoint-Dependent Active Perception in 3D Gaussian Splatting Scenes**
2. **PokeVLA: Empowering Pocket-Sized Vision-Language-Action Model with Comprehensive World Knowledge Guidance**
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning**
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment**
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling**

## 2026-04-24

1. **NeRF vs 3DGS Geometric Accuracy**
2. **GRCA: Geometric Reward Credit Assignment**
3. **Flow4DGS-SLAM: Efficient Dynamic Gaussian Splatting for Scene-Level Aggregated Mapping**
4. **GazeVLA: Learning Human Intention**
5. **NRGS: Neural Regularization for 3D Semantic GS**

## 2026-04-25

1. **E3VS-Bench: A Benchmark for Viewpoint-Dependent Active Perception in 3D Gaussian Splatting Scenes**
2. **PokeVLA: Empowering Pocket-Sized Vision-Language-Action Model with Comprehensive World Knowledge Guidance**
3. **Mask World Model: Predicting What Matters for Robust Robot Policy Learning**
4. **Cortex2: Grounding World Models in Real-World Industrial Deployment**
5. **UniT: Toward a Unified Physical Language for Human-to-Humanoid Policy Learning and World Modeling**

## 2026-04-27

1. **SpatialEvo: Self-Evolving Spatial Intelligence via Deterministic Geometric Environments**
2. **SpaceMind: Modular and Self-Evolving Embodied VLM Agent Framework for Autonomous On-orbit Servicing**
3. **HiVLA: Visual-Grounded-Centric Hierarchical Embodied Manipulation System**
4. **SpatialStack: Layered Geometry-Language Fusion for 3D VLM Spatial Reasoning**

## 2026-04-26

1. **ReVSI: Rebuilding Visual Spatial Intelligence Evaluation**
2. **OpenSpatial: A Principled Data Engine for Spatial Intelligence**
3. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence**
4. **GSI-Bench: Exploring Spatial Intelligence from a Generative Perspective**

---

## Research Trends

### Current Focus
- **Embodied AI**: VLMs and embodied agents
- **Spatial Reasoning**: Grounding and consistency
- **Navigation**: Urban airspace and real-world environments
- **Foundation Models**: Embodied and multimodal

### Key Trends
1. Embodied VLMs bridging perception, reasoning, and action
2. Formal grounding for spatial and temporal reasoning
3. Real-world deployment challenges
4. Data infrastructure for spatial intelligence

---

## Analysis Quality Metrics
- **Average Relevance**: High (4.3/5)
- **Paper Count**: 30 (completed)

---

*最后更新时间: 2026-04-30*

---

## 2026-05-01 研究的论文（精选5篇）

1. **X-WAM: Unified 4D World Action Modeling from Video Priors with Asynchronous Denoising** - arXiv:2604.26694
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D World Model, Action Modeling, Video Generation, Asynchronous Denoising
   - 文档: papers/2026-05-01_01_X-WAM_Unified_4D_World_Action_Modeling.md
   - NotebookLM: [notebook_id]

2. **STARRY: Spatial-Temporal Action-Centric World Modeling for Robotic Manipulation** - arXiv:2604.26848
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Robotic Manipulation, Geometry-Aware Attention, Action Generation
   - 文档: papers/2026-05-01_02_STARRY_Spatial_Temporal_Action_Centric_World_Modeling.md
   - NotebookLM: [notebook_id]

3. **GaussianFlow SLAM: Monocular Gaussian Splatting SLAM Guided by GaussianFlow** - arXiv:2604.15612
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Gaussian Splatting, SLAM, Monocular, 3D Reconstruction, Spatial Perception
   - 文档: papers/2026-05-01_03_GaussianFlow_SLAM.md
   - NotebookLM: [notebook_id]

4. **AmaraSpatial-10K: A Spatially and Semantically Aligned 3D Dataset for Spatial Computing and Embodied AI** - arXiv:2604.23018
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Dataset, Spatial Computing, Embodied AI, Semantic Alignment
   - 文档: papers/2026-05-01_04_AmaraSpatial_10K.md
   - NotebookLM: [notebook_id]

5. **KinDER: A Physical Reasoning Benchmark for Robot Learning and Planning** - arXiv:2604.25788
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Physical Reasoning, Benchmark, Robot Learning, Planning, RSS 2026
   - 文档: papers/2026-05-01_05_KinDER_Physical_Reasoning_Benchmark.md
   - NotebookLM: [notebook_id]

---

*最后更新时间: 2026-05-01*

## 2026-05-03 研究的论文（精选5篇）

1. **UniSplat: Learning 3D Representations for Spatial Intelligence from Unposed Multi-View Images** - arXiv:2604.10573
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D表示学习, 空间智能, 高斯泼溅, 自监督, 无位姿
   - 文档: papers/2026-05-03_01_UniSplat_Learning_3D_Representations_Spatial_Intelligence.md
   - 会议: CVPR 2026

2. **BiSplat-WRF: Planar Gaussian Splatting with Bilinear Spatial Transformer for Wireless Radiance Field Reconstruction** - arXiv:2604.25945
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS, 无线辐射场, 电磁建模, 双线性空间变换器, 跨域
   - 文档: papers/2026-05-03_02_BiSplat-WRF_Planar_Gaussian_Splatting_Wireless.md
   - 会议: IEEE ICC 2026 Workshop

3. **GSI-Bench: Exploring Spatial Intelligence from a Generative Perspective** - arXiv:2604.20570
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 生成式空间智能, 基准评估, 多模态模型, 空间推理, 图像编辑
   - 文档: papers/2026-05-03_03_GSI-Bench_Exploring_Spatial_Intelligence_Generative.md
   - 会议: CVPR 2026

4. **Embodied Navigation Bench: How Far Are LMMs from Human-Level Spatial Action in Urban Airspace** - arXiv:2604.07973
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 空间行动, 城市导航, 3D导航, LMM评估, 具身AI, 无人机
   - 文档: papers/2026-05-03_04_Embodied_Navigation_Bench_Urban_Airspace.md

5. **Bringing a Personal Point of View: Evaluating Dynamic 3DGS for Egocentric Scene Reconstruction** - arXiv:2604.23803
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 自我中心, 3DGS评估, 动态场景重建, ego-exo, 场景理解
   - 文档: papers/2026-05-03_05_Egocentric_Dynamic_3DGS_Reconstruction.md
   - 会议: EgoVis Workshop at CVPR 2026

## 2026-05-04 研究的论文（精选5篇）

1. **STARRY: Spatial-Temporal Action-Centric World Modeling for Robotic Manipulation** - arXiv:2604.26848
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: world model, spatial-temporal, manipulation, VLA, GASAM, geometry-aware
   - 文档: papers/2026-05-04_01_STARRY_Spatial_Temporal_World_Model_Manipulation.md
   - 核心发现: GASAM几何感知选择性注意力调制，时空-动作联合去噪，RoboTwin 2.0达93.82%/93.30%

2. **ExoActor: Exocentric Video Generation as Generalizable Interactive Humanoid Control** - arXiv:待确认
   - 相关性: ⭐⭐⭐⭐
   - 关键词: video generation, humanoid, robot control, exocentric, embodied
   - 文档: papers/2026-05-04_02_ExoActor_Exocentric_Video_Humanoid_Control.md
   - 核心发现: 利用外中心视频生成模型实现人形机器人控制，视频到动作的桥接

3. **PRTS: A Primitive Reasoning and Tasking System via Contrastive Representations** - arXiv:待确认
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, reasoning, task decomposition, contrastive, primitive
   - 文档: papers/2026-05-04_03_PRTS_Primitive_Reasoning_Tasking_System.md
   - 核心发现: 对比表征学习用于VLA原语推理和任务分解，任务进度感知

4. **RADIO-ViPE: Online Tightly Coupled Multi-Modal Fusion for Open-Vocabulary Semantic SLAM** - arXiv:2604.26067
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: SLAM, semantic, multi-modal, foundation model, dynamic, open-vocabulary
   - 文档: papers/2026-05-04_04_RADIO_ViPE_Semantic_SLAM_Dynamic.md
   - 核心发现: 无标定单目RGB在线语义SLAM，几何-语义紧耦合因子图优化

5. **Libra-VLA: Achieving Learning Equilibrium via Asynchronous Coarse-to-Fine Dual-System** - arXiv:待确认
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, dual-system, asynchronous, learning equilibrium, coarse-to-fine
   - 文档: papers/2026-05-04_05_Libra_VLA_Learning_Equilibrium_Dual_System.md
   - 核心发现: 异步粗到细双系统架构实现VLA学习均衡

---

## 2026-05-06 研究的论文（精选5篇）

1. **MolmoAct2: Action Reasoning Models for Real-world Deployment** - arXiv:2605.02881
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Spatial Reasoning, Flow Matching, Action Tokenization, Bimanual, Open-source
   - 文档: papers/2026-05-06_01_MolmoAct2_Open_VLA_Deployment.md
   - 核心发现: 完全开源VLA，Molmo2-ER空间推理骨干+flow-matching动作专家+自适应深度推理，超越π0.5

2. **Embody4D: A Generalist 4D World Model for Embodied AI** - arXiv:2605.01799
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D World Model, Novel View Synthesis, Flow Matching, Multi-view, Compositional Data
   - 文档: papers/2026-05-06_02_Embody4D_4D_World_Model.md
   - 核心发现: 单目到4D的世界模型，组合式数据合成+置信度噪声注入+交互感知注意力

3. **Multi-Scale Gaussian-Language Map for Zero-shot Embodied Navigation and Reasoning (GLMap)** - arXiv:2605.01736
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Semantic Map, Zero-shot Navigation, VLM, Multi-scale Semantics
   - 文档: papers/2026-05-06_03_GLMap_Gaussian_Language_Map.md
   - 核心发现: CVPR2026，3DGS+多尺度语义+VLM双模态接口，零样本embodied导航

4. **Anticipation-VLA: Solving Long-Horizon Embodied Tasks via Anticipation-based Subgoal Generation** - arXiv:2605.01772
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, Long-horizon, Subgoal Generation, Hierarchical, Adaptive Planning
   - 文档: papers/2026-05-06_04_Anticipation_VLA_Subgoal.md
   - 核心发现: 自适应递归子目标生成，分层VLA架构解决长时序累积误差

5. **SpatialGrammar: A Domain-Specific Language for LLM-Based 3D Indoor Scene Generation** - arXiv:2604.27555
   - 相关性: ⭐⭐⭐⭐
   - 关键词: DSL, 3D Scene Generation, LLM, BEV, Spatial Reasoning, Indoor
   - 文档: papers/2026-05-06_05_SpatialGrammar_DSL_3D_Scene.md
   - 核心发现: 空间DSL+编译器反馈闭环+104M小模型竞争大LLM

## 2026-05-07 研究的论文（精选5篇）

1. **RL Token: Bootstrapping Online RL with Vision-Language-Action Models** - arXiv:2604.23073
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Online RL, Bootstrapping, Token-level Policy, π (Physical Intelligence)
   - 文档: papers/2026-05-07_01_RL_Token_Bootstrapping_Online_RL_with_VLA.md
   - 核心发现: 用RL token引导VLA模型在线强化学习，实现策略自举

2. **M²-VLA: Boosting VLMs for Generalizable Manipulation via Layer Mixture and Meta-Skills** - arXiv:2604.24182
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Layer Mixture, Meta-Skills, Generalizable Manipulation, Zero-shot
   - 文档: papers/2026-05-07_02_M2-VLA.md
   - 核心发现: 无需微调VLM，通过层混合和元技能实现通用机器人操作

3. **Emotion-Conditioned Short-Horizon Human Pose Forecasting with a Lightweight Predictive World Model** - arXiv:2604.23532
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Human Pose Forecasting, Emotion Conditioning, World Model, Multimodal Fusion
   - 文档: papers/2026-05-07_03_Emotion-Conditioned_Short-Horizon_Human_Pose_Forecasting.md
   - 核心发现: 情感嵌入作为姿态预测条件信号，轻量级预测世界模型

4. **GS-Playground: A High-Throughput Photorealistic Simulator for Vision-Informed Robot Learning** - arXiv:2604.25459
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Simulation, Robot Learning, Real2Sim, RSS 2026
   - 文档: papers/2026-05-07_04_GS-Playground.md
   - 核心发现: 并行物理引擎+批量3DGS渲染+自动Real2Sim流水线

5. **FreeTimeGS++: Secrets of Dynamic Gaussian Splatting and Their Principles** - arXiv:2605.03337
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 4D Gaussian Splatting, Dynamic Scene, Systematic Analysis, Rendering
   - 文档: papers/2026-05-07_05_FreeTimeGS++.md
   - 核心发现: 系统解构4DGS框架，发现5个隐藏关键因素并改进

## 2026-05-08 研究的论文（精选5篇）

1. **GSDrive: Reinforcing Driving Policies by Multi-mode Trajectory Probing with 3D Gaussian Splatting Environment** - arXiv:?
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Reinforcement Learning, Autonomous Driving, Trajectory Probing
   - 文档: papers/2026-05-08_01_GSDrive.md
   - 核心发现: 3DGS环境+多模态轨迹探测实现驾驶策略强化学习

2. **A Principled Approach for Creating High-fidelity Synthetic Demonstrations for Imitation Learning** - arXiv:?
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Synthetic Data, Imitation Learning, Robot Manipulation
   - 文档: papers/2026-05-08_02_Synthetic_Demonstrations.md
   - 核心发现: 基于原则的3DGS高保真合成模仿学习演示数据生成方法

3. **RoboVerse: Towards a Unified Platform, Dataset and Benchmark for Scalable and Generalizable Robot Learning** - arXiv:?
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Robot Learning, Unified Platform, Benchmark, Sim2Real
   - 文档: papers/2026-05-08_03_RoboVerse.md
   - 核心发现: 统一机器人学习平台+数据集+基准，5种机器人+16任务+45场景

4. **From Concept to Capability: Evaluating 3D Gaussian Splatting for Synthetic Scene Editing in Autonomous Driving** - arXiv:2605.01995
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Safety Evaluation, Autonomous Driving, ISO Standard, Fidelity Assessment
   - 文档: papers/2026-05-08_04_From_Concept_to_Capability.md
   - 核心发现: 首个面向工业安全的3DGS保真度评估框架，基于ISO标准定义Pass/Fail准则

5. **Ground4D: Spatially-Grounded Feedforward 4D Reconstruction for Unstructured Off-Road Scenes** - arXiv:2605.04435
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Feedforward 4DGS, Off-Road, Voxel-Grounded, Temporal Aggregation, Zero-shot
   - 文档: papers/2026-05-08_05_Ground4D.md
   - 核心发现: Voxel-Grounded Temporal Aggregation解决越野前馈4D重建，+1.48dB PSNR

## 2026-05-09 研究的论文（精选5篇）

1. **TriRelVLA: A Tri-Relational Compositional Structure for Generalizable Embodied Manipulation** - arXiv:2605.05714
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Tri-Relational, Generalization, Embodied Manipulation
   - 文档: papers/2026-05-09_01_TriRelVLA.md
   - 核心发现: 三元关系结构（Robot-Object-Goal）提升VLA操作泛化

2. **Multi-Scale Gaussian-Language Map for Zero-shot Embodied Navigation and Reasoning (GLMap)** - arXiv:2605.01736
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Semantic Map, Zero-shot, Navigation, Gaussian Estimator
   - 文档: papers/2026-05-09_02_GLMap.md
   - 核心发现: 多尺度高斯-语言地图统一显式几何+多尺度语义+大模型原生接口

3. **Reconstruction or Semantics? What Makes a Latent Space Useful for Robotic World Models** - arXiv:2605.06388
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Latent Space, Semantic vs Reconstruction, Diffusion
   - 文档: papers/2026-05-09_03_Reconstruction_or_Semantics.md
   - 核心发现: 语义潜空间在策略性能上全面优于重建潜空间，视觉保真度≠世界模型质量

4. **Toward Visually Realistic Simulation: VISER Benchmark** - arXiv:2605.06311
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Simulation, Visual Realism, PBR, Sim2Real, VLA Evaluation
   - 文档: papers/2026-05-09_04_VISER.md
   - 核心发现: Specular highlights和contact shadows是VLA空间理解的关键视觉因素

5. **Decompose and Recompose: Reasoning New Skills from Existing Abilities** - arXiv:2605.01448
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Cross-Task Generalization, Skill Decomposition, ICL, Atomic Skills
   - 文档: papers/2026-05-09_05_Decompose_and_Recompose.md
   - 核心发现: 原子技能-动作对齐将跨任务迁移从轨迹模仿提升到技能推理

---

## 2026-05-10

1. **OA-WAM: Object-Addressable World Action Model for Robust Robot Manipulation** - arXiv:2605.06481
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Action Model, Object Addressability, Slot-based, Robust Manipulation
   - 文档: papers/2026-05-10_01_OA-WAM.md
   - 核心发现: Object Addressability概念——通过addr-only key投影+per-layer reset实现架构级对象身份解耦，几何扰动下swap-binding cosine 0.87 vs ≤0.09

2. **EA-WM: Event-Aware Generative World Model with Structured Kinematic-to-Visual Action Fields** - arXiv:2605.06192
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Video World Model, Kinematic-to-Visual Action Fields, Event-Aware, Diffusion
   - 文档: papers/2026-05-10_02_EA-WM.md
   - 核心发现: KVAFs将运动学信号投影到视觉域，EDLS事件驱动注意力聚焦交互状态变化，解决动作-视频域不对齐

3. **OpenGaFF: Open-Vocabulary Gaussian Feature Field with Codebook Attention** - arXiv:2605.06088
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Open-Vocabulary, Gaussian Feature Field, Codebook, Semantic Mapping
   - 文档: papers/2026-05-10_03_OpenGaFF.md
   - 核心发现: Gaussian Feature Field将语义建模为几何+外观的连续函数，结构化码本实现对象级语义一致性

4. **VLA-GSE: Boosting Parameter-Efficient Fine-Tuning in VLA with Generalized and Specialized Experts** - arXiv:2605.06175
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, PEFT, SVD, MoE, Generalized/Specialized Experts
   - 文档: papers/2026-05-10_04_VLA-GSE.md
   - 核心发现: SVD谱分解初始化通用专家+路由专业专家，2.51%参数更新超过FFT 6.3%，保留VLM知识

5. **FUS3DMaps: Scalable and Accurate Open-Vocabulary Semantic Mapping by 3D Fusion of Voxel- and Instance-Level Layers** - arXiv:2605.03669
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Semantic Mapping, Open-Vocabulary, Dual-Layer Fusion, Scalable, Sliding Window
   - 文档: papers/2026-05-10_05_FUS3DMaps.md
   - 核心发现: 首个跨层3D语义融合——稠密层+实例层互补增强，滑动窗口实现多层建筑级可扩展建图

---

## 2026-05-11 — 主题：空间智能的物理化转型

1. **PhysForge: Generating Physics-Grounded 3D Assets for Interactive Virtual World** - arXiv:2605.05163
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Generation, Physics-Grounded, VLM Planning, Diffusion, KineVoxel, PhysDB
   - 会议: ICML 2026
   - 文档: papers/2026-05-11_01_PhysForge.md
   - 核心发现: 功能驱动的3D资产生成范式——VLM规划物理蓝图+Diffusion实现，物理属性反哺结构规划

2. **RoboAlign-R1: Distilled Multimodal Reward Alignment for Robot Video World Models** - arXiv:2605.03821
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Reward Alignment, Teacher-Student Distillation, GRPO, Sliding Window
   - 文档: papers/2026-05-11_02_RoboAlign_R1.md
   - 核心发现: 8B教师蒸馏为98M学生奖励模型，六维评估+GRPO后训练提升10.1%，SWR缓解长时域漂移

3. **3DSS: 3D Surface Splatting for Inverse Rendering** - arXiv:2605.05876
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Differentiable Rendering, Surface Splatting, Inverse Rendering, EWA, BRDF
   - 文档: papers/2026-05-11_03_3DSS.md
   - 核心发现: 首个可微表面splatting逆向渲染器——区间合并表面分离+EWA覆盖度不透明度，保留表面语义

4. **When to Trust Imagination: Adaptive Action Execution for World Action Models** - 2026-05-07
   - 相关性: ⭐⭐⭐⭐
   - 关键词: World Action Model, Adaptive Execution, Uncertainty, Imagination vs Reality
   - 文档: papers/2026-05-11_04_When_to_Trust_Imagination.md
   - 核心发现: 世界模型想象的自适应信任机制——动态切换想象执行和实际执行，不确定性感知的空间推理

5. **DexSim2Real: Foundation Model-Guided Sim-to-Real Transfer for Generalizable Dexterous Manipulation** - 2026-05-03
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Sim-to-Real, Dexterous Manipulation, Foundation Model, Domain Adaptation
   - 文档: papers/2026-05-11_05_DexSim2Real.md
   - 核心发现: 基础模型引导sim-to-real迁移——仿真学习空间交互+基础模型知识桥接到真实世界

## 2026-05-12 研究的论文（精选5篇）

1. **NoiseGate: Learning Per-Latent Timestep Schedules as Information Gating in World Action Models** - arXiv:2605.07794
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Action Model, Information Gating, Diffusion Forcing, GRPO, Noise-as-Masking
   - 文档: papers/2026-05-12_01_NoiseGate.md
   - 核心发现: 将逐帧时间步调度重构为可学习的信息门控策略，噪声水平在共享注意力中充当可靠性门

2. **Proxy3D: Efficient 3D Representations for Vision-Language Models via Semantic Clustering and Alignment** - arXiv:2605.08064
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D Representation, Semantic Clustering, Spatial Intelligence, CVPR 2026
   - 会议: CVPR 2026
   - 文档: papers/2026-05-12_02_Proxy3D.md
   - 核心发现: 语义感知聚类生成紧凑3D代理表示，仅需视频帧即可实现高质量3D空间推理

3. **SplatWeaver: Learning to Allocate Gaussian Primitives for Generalizable Novel View Synthesis** - arXiv:2605.07287
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS, MoE, Adaptive Allocation, High-Frequency Prior, Generalizable NVS
   - 文档: papers/2026-05-12_03_SplatWeaver.md
   - 核心发现: Cardinality Gaussian Experts实现自适应原语分配，用更少原语达到更好渲染质量

4. **Mind the Gap: Geometrically Accurate Generative Reconstruction from Disjoint Views (GLADOS)** - arXiv:2605.07550
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Disjoint Views, Generative Reconstruction, Zero Overlap, Distributed Robotics
   - 文档: papers/2026-05-12_04_Mind_the_Gap_GLADOS.md
   - 核心发现: 开创不相交视角3D重建新范式，生成式桥接连接无重叠观测

5. **PathPainter: Transferring the Generalization Ability of Image Generation Models to Embodied Navigation** - arXiv:2605.07496
   - 相关性: ⭐⭐⭐⭐
   - 关键词: BEV, Navigation, Image Generation, Cross-view Localization, UAV
   - 文档: papers/2026-05-12_05_PathPainter.md
   - 核心发现: 图像生成模型世界理解能力迁移到具身导航，160米UAV户外长距离导航验证

## 2026-05-13 研究的论文（精选5篇）

1. **VEGA: Visual Encoder Grounding Alignment for Spatially-Aware VLA Models** - arXiv:2605.10485
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 空间接地, FiT3D, DINOv2, 视觉编码器对齐
   - 文档: papers/2026-05-13_01_VEGA.md
   - 亮点: 在视觉编码器输出层直接对齐3D感知特征，零推理开销，RoboTwin SOTA

2. **ALAM: Algebraically Consistent Latent Transitions for VLA Models** - arXiv:2605.10819
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 潜在动作模型, 代数约束, flow-matching, 视频预训练
   - 文档: papers/2026-05-13_02_ALAM.md
   - 亮点: 组合+反转一致性构建结构化转移空间，MetaWorld 47.9%→85.0%

3. **Distilling 3D Spatial Reasoning into Lightweight VLM with CoT** - arXiv:2605.09719
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 知识蒸馏, 3D空间推理, Hidden CoT, VGGT, 轻量化
   - 文档: papers/2026-05-13_03_Distilling_3D_Spatial_Reasoning.md
   - 亮点: Hidden CoT潜在推理，8.7x推理加速，保留54-72%空间推理能力

4. **SABER: Scalable Action-Based Embodied Dataset for VLA Adaptation** - arXiv:2605.09613
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 零售机器人, 数据集, 自然采集, 多视角, 动作表示
   - 文档: papers/2026-05-13_04_SABER.md
   - 亮点: 100+小时自然店内采集，44.8K样本，GR00T N1.6上2.19x提升

5. **E3VS-Bench: Viewpoint-Dependent Active Perception in 3DGS Scenes** - arXiv:2604.17969
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, 主动感知, 5-DoF, 基准测试, 视角依赖
   - 文档: papers/2026-05-13_05_E3VS_Bench.md
   - 亮点: 首个5-DoF主动空间感知基准，99个3DGS场景，2014个episode

## 2026-05-14 研究的论文（精选5篇）

1. **Uncovering and Shaping the Latent Representation of 3D Scene Topology in VLMs** - arXiv:2605.07148
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D拓扑, 认知地图, Dirichlet能量, 线性提取
   - 文档: papers/2026-05-14_01_VLM_Latent_Topology.md
   - 亮点: 首次严格证明VLM内部存在3D场景拓扑表征，通过跨场景线性提取和Dirichlet能量正则化分离和塑形空间表征，500步微调提升拓扑理解12.1%

2. **ViSRA: A Video-based Spatial Reasoning Agent for Multi-modal LLMs** - arXiv:2605.10106
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: ViSRA, 推理时增强, Agent框架, 认知地图悖论, VSI-Bench
   - 文档: papers/2026-05-14_02_ViSRA.md
   - 亮点: 首个推理时空间推理Agent框架，四角色设计（plan-execute-reflect），发现认知地图注入反而降低性能，在已有和未见过任务上分别提升15.6%和28.9%

3. **PD-4DGS: Progressive Decomposition of 4D Gaussian Splatting** - arXiv:2605.11427
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: PD-4DGS, 分层变形分解, DASH/HLS, 首帧延迟, 码流压缩
   - 文档: papers/2026-05-14_03_PD-4DGS.md
   - 亮点: 首个4DGS渐进压缩框架，HDD分解变形网络为三层可传输层，首帧延迟从73-930s降到~1.7s，码流减少>60%

4. **Loc3R-VLM: Language-based Localization and 3D Reasoning** - arXiv:2603.18002
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Loc3R-VLM, 全局布局重建, 情境建模, 位姿先验, 认知地图
   - 文档: papers/2026-05-14_04_Loc3R-VLM.md
   - 亮点: 双重空间表征框架（全局布局+情境建模），利用3D基础模型提供轻量位姿先验，从单目视频实现语言定位SOTA

5. **R³L: Reasoning 3D Layouts from Relative Spatial Relations** - arXiv:2605.06758
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: R³L, 多跳推理, 不变性分解, 一致性想象, 参考系变换
   - 文档: papers/2026-05-14_05_R3L.md
   - 亮点: 首个针对多跳相对空间推理的系统框架，发现参考系变换错误累积是核心问题，通过不变性分解打断关系链消除语义/度量漂移

---

*最后更新时间: 2026-05-14*

## 2026-05-15 研究的论文（精选5篇）

1. **MAGS-SLAM: Monocular Multi-Agent Gaussian Splatting SLAM** - arXiv:2605.10760
   - 相关性: ★★★★★
   - 关键词: 3DGS, Multi-Agent SLAM, RGB-only, Sim(3), Collaborative Reconstruction
   - 文档: papers/2026-05-15_mags-slam.md
   - 亮点: 首个纯RGB多智能体3DGS SLAM，渲染质量超越需要深度传感器的方法

2. **Forecast-GS: Predictive 3D Representation for Language-Guided Manipulation** - arXiv:2605.11144
   - 相关性: ★★★★☆
   - 关键词: 3DGS, Robotic Manipulation, Language Grounding, Predictive Representation
   - 文档: papers/2026-05-15_forecast-gs.md
   - 亮点: 将3D高斯从场景表示升级为预测性操作工具，实现"先想象后执行"的空间推理

3. **Embodied Multi-Agent Coordination by Aligning World Models Through Dialogue** - arXiv:2605.12920
   - 相关性: ★★★★★
   - 关键词: Multi-Agent, World Models, LLM Planning, Dialogue, Hallucination
   - 文档: papers/2026-05-15_world-model-alignment.md
   - 亮点: 揭示LLM多智能体协作中60-69%的幻觉率导致世界模型对齐失败的关键瓶颈

4. **Real2Sim: Physics-driven Gaussian Splatting for Autonomous Driving** - arXiv:2605.13591
   - 相关性: ★★★★☆
   - 关键词: 4DGS, Autonomous Driving, MPM Physics, Simulation, Waymo
   - 文档: papers/2026-05-15_real2sim.md
   - 亮点: 将4D高斯与MPM物理求解器结合，首次从真实驾驶数据生成物理可信碰撞场景

5. **RotVLA: Rotational Latent Action for VLA Model** - arXiv:2605.13403
   - 相关性: ★★★★☆
   - 关键词: VLA, SO(n), Latent Action, Flow Matching, Cross-Embodiment
   - 文档: papers/2026-05-15_rotvla.md
   - 亮点: 用SO(n)旋转群替代离散VQ-VAE，1.7B参数在LIBERO上达到98.2%

---

*最后更新时间: 2026-05-15*

## 2026-05-16 研究的论文（精选5篇）

1. **GTA-VLA: Guide, Think, Act - Interactive Embodied Reasoning in VLA Models** - arXiv:2605.13632
   - 相关性: ★★★★★
   - 关键词: VLA, Interactive Reasoning, Spatial CoT, Embodied Manipulation, Human-in-the-Loop
   - 文档: papers/2026-05-16_01_GTA-VLA_Interactive_Embodied_Reasoning.md
   - 亮点: 提出Guide-Think-Act三阶段交互式VLA框架，显式空间定位是具身控制核心瓶颈，SimplerEnv 81.2% SOTA

2. **3D-Belief: Embodied Belief Inference via Generative 3D World Modeling** - arXiv:2605.11367
   - 相关性: ★★★★★
   - 关键词: 3D World Model, Belief Inference, Embodied AI, Generative Model, Spatial Understanding
   - 文档: papers/2026-05-16_02_3D-Belief_Embodied_Belief_Inference_Generative_3D_World.md
   - 亮点: 通过生成式3D世界建模实现具身信念推理，为Spatial AGI提供清晰的世界模型框架

3. **PG-3DGS: Optimizing 3D Gaussian Splatting to Satisfy Physics Objectives** - arXiv:2605.11266
   - 相关性: ★★★★☆
   - 关键词: 3DGS, Physics Simulation, Differentiable Physics, Functional Topology
   - 文档: papers/2026-05-16_03_PG-3DGS.md
   - 亮点: 将物理目标函数融入3D高斯优化，揭示空间智能需理解功能拓扑（物体内部连通性）

4. **Evo-Depth: A Lightweight Depth-Enhanced Vision-Language-Action Model** - arXiv:2605.14950
   - 相关性: ★★★★☆
   - 关键词: VLA, Depth Estimation, Lightweight, Embodied Manipulation, Implicit Depth
   - 文档: papers/2026-05-16_04_Evo-Depth.md
   - 亮点: 紧凑隐式深度特征即可显著提升操作性能，空间表示不需要完美只需"足够好"

5. **PointGS: Semantic-Consistent Unsupervised 3D Point Cloud Segmentation with 3DGS** - arXiv:2605.11520
   - 相关性: ★★★★☆
   - 关键词: 3DGS, Point Cloud Segmentation, Unsupervised, Semantic Consistency
   - 文档: papers/2026-05-16_05_PointGS.md
   - 亮点: CVPR 2026，结合3D高斯与点云实现无监督语义一致分割

## 2026-05-17 研究的论文（精选5篇）

1. **OnlinePG: Online Open-Vocabulary Panoptic Mapping with 3D Gaussian Splatting** - arXiv:2603.18510
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, Panoptic Mapping, Open-Vocabulary, Semantic Segmentation, Online
   - 文档: papers/2026-05-17_01_OnlinePG.md
   - 亮点: 在线开放词汇全景映射，分层3D表示融合高斯几何+语义+实例身份，直接服务于Spatial AGI的空间语义理解需求

2. **PanoEnv: Exploring 3D Spatial Intelligence in Panoramic Environments with Reinforcement Learning** - arXiv:2602.21992
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, VLM, Reinforcement Learning, Panoramic, GRPO, VQA Benchmark
   - 文档: papers/2026-05-17_02_PanoEnv.md
   - 亮点: 首个精确3D标注的大规模全景空间推理VQA基准，基于GRPO的3D-aware RL后训练框架，从2D感知到3D推理的范式突破

3. **HiSpatial: Taming Hierarchical 3D Spatial Understanding in Vision-Language Models** - arXiv:2603.25411
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Hierarchical Spatial Understanding, VLM, Spatial Reasoning, Benchmark, CV-Bench
   - 文档: papers/2026-05-17_03_HiSpatial.md
   - 亮点: 超越GPT-5和Gemini-2.5-Pro，分层3D空间理解框架，CV-Bench 96.64%

4. **World Action Models: The Next Frontier in Embodied AI** - arXiv:2605.12090
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Action Model, Embodied AI, VLM, Tree Search, RL
   - 文档: papers/2026-05-17_04_World_Action_Models.md
   - 亮点: 统一世界模型与动作模型，结合VLM语义干预和树搜索评分，具身智能前沿方向

5. **AdaptSplat: Adapting Vision Foundation Models for Feed-Forward 3D Gaussian Splatting** - arXiv:2605.10239
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, Vision Foundation Model, Feed-Forward, Novel View Synthesis
   - 文档: papers/2026-05-17_05_AdaptSplat.md
   - 亮点: 适配视觉基础模型到前馈3DGS，实现精确空间几何表征

---

*最后更新时间: 2026-05-17*

---

## 2026-05-18 研究的论文（精选5篇）

1. **Denoising-GS: Gaussian Splatting with Spatial-aware Denoising** - arXiv:2605.14880
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, Denoising, Spatial Optimization, Uncertainty, NVS
   - 文档: papers/2026-05-18_01_Denoising-GS.md
   - 亮点: 将3DGS优化重新定义为去噪过程，动量偏置探索+空间梯度去噪+不确定性剪枝，SOTA

2. **Embodied Multi-Agent Coordination by Aligning World Models Through Dialogue** - arXiv:2605.12920
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Multi-Agent, World Model Alignment, Dialogue, Embodied AI, PARTNR
   - 文档: papers/2026-05-18_02_World_Model_Alignment_Dialogue.md
   - 亮点: 首次提出世界模型对齐度量框架，揭示对话降低冲突但不提高成功率的反直觉发现

3. **3D Primitives are a Spatial Language for VLMs** - arXiv:2605.12586
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, VLM, 3D Primitives, Code Generation, Self-Supervised
   - 文档: papers/2026-05-18_03_3D_Primitives_Spatial_Language.md
   - 亮点: 揭示VLM空间悖论——能精确重建3D场景但无法回答简单空间问题，Code-CoT+自监督微调

4. **ROSBag MCP Server: Analyzing Robot Data with LLMs for Agentic Embodied AI Applications** - arXiv:2511.03497
   - 相关性: ⭐⭐⭐⭐
   - 关键词: MCP, ROS, Agentic AI, Embodied AI, Tool Calling, LLM
   - 文档: papers/2026-05-18_04_ROSBag_MCP_Server.md
   - 亮点: MCP协议+Embodied AI交叉，8个LLM/VLM工具调用能力对比，Kimi K2和Claude Sonnet 4领先

5. **VidSplat: Gaussian Splatting Reconstruction with Geometry-Guided Video Diffusion Priors** - arXiv:2605.11424
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, Video Diffusion, Sparse-View, SIGGRAPH 2026
   - 文档: papers/2026-05-18_05_VidSplat.md
   - 亮点: SIGGRAPH 2026，视频扩散先验+3DGS迭代重建，支持单图输入

---

*最后更新时间: 2026-05-18*

## 2026-05-22 研究的论文（精选5篇）

1. **GeoWorld-VLM** - arXiv:2605.16713
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, VLM, Spatial Reasoning, Knowledge Distillation, Geometry
   - 文档: papers/2026-05-22_01_GeoWorld-VLM.md
   - 核心发现: 从冻结的camera-conditioned世界模型向VLM视觉通路蒸馏几何知识，保持LLM冻结

2. **OrbiSim** - arXiv:2605.16395
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Differentiable Physics, World Model, Embodied Intelligence, Simulation
   - 文档: papers/2026-05-22_02_OrbiSim.md
   - 核心发现: 将世界模型重新定义为完全可微分的物理引擎，端到端仿真循环可微分

3. **BioProVLA-Agent** - arXiv:2605.07306
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, Embodied Agent, Protocol-Driven, Laboratory Automation, Closed-Loop
   - 文档: papers/2026-05-22_03_BioProVLA-Agent.md
   - 核心发现: 三Agent系统（协议解析+视觉验证+VLA执行）实现实验室闭环自动化

4. **ArchSIBench** - arXiv:2605.20837
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Intelligence, Benchmark, Architectural, VLM Evaluation
   - 文档: papers/2026-05-22_04_ArchSIBench.md
   - 核心发现: 从建筑学视角评估VLM空间智能，五维度17子任务，揭示高级空间认知差距

5. **ESI-Bench** - arXiv:2605.18746
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied Spatial Intelligence, Active Exploration, Perception-Action Loop, Benchmark
   - 文档: papers/2026-05-22_05_ESI-Bench.md
   - 核心发现: 主动探索优于被动观测，失败源于动作盲区而非感知不足，模型缺乏元认知能力

## 2026-05-23 研究的论文（精选5篇）

1. **Exploring Bottlenecks in VLM-LLM Navigation** - arXiv:2605.14801
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLN, Zero-Shot Navigation, 3D Scene Understanding, Perception Saturation
   - 文档: papers/2026-05-23_01_Exploring_Bottlenecks_VLM-LLM_Navigation.md
   - 核心发现: 感知饱和效应——3D感知精度超过阈值后对VLN成功率边际贡献急剧下降；20个导航相关类别足以支持室内导航

2. **GaussianDream: A Feed-Forward 3D Gaussian World Model for Robotic Manipulation** - arXiv:2605.20752
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, World Model, VLA, Robotic Manipulation, Dense Supervision
   - 文档: papers/2026-05-23_02_GaussianDream_Feed_Forward_3D_Gaussian_World_Model.md
   - 核心发现: 前馈式3D高斯世界模型插件，训练时用3D高斯重建作密集监督，推理时仅保留紧凑prefix条件化动作生成

3. **3D Primitives are a Spatial Language for VLMs** - arXiv:2605.12586
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, 3D Primitives, VLM, Scene Reconstruction, Spatial Paradox
   - 文档: papers/2026-05-23_03_3D_Primitives_are_a_Spatial_Language_for_VLMs.md
   - 核心发现: VLM空间悖论——能生成精确3D重建代码却在简单空间问答中失败，是任务路由问题而非能力缺失

4. **EvoScene-VLA: Evolving Scene Beliefs Inside the Action Decoder** - arXiv:2605.21862
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Scene Belief, Flow Matching, Chunked Control, Embodied AI
   - 文档: papers/2026-05-23_04_EvoScene-VLA.md
   - 核心发现: 动作解码器内循环更新场景先验，联合flow-matching去噪动作和场景token，两级几何锚点确保3D结构编码

5. **Do VLMs Understand 3D Scenes or Just Catalogue Objects? (LLaVA³)** - arXiv:2511.16454
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Scene Understanding, Object-Centric, NeRF, VLM, Cubism-Inspired
   - 文档: papers/2026-05-23_05_Do_VLMs_Understand_3D_Scenes_or_Just_Catalogue_Objects.md
   - 核心发现: VLM不理解3D是信息格式问题而非能力不足，物体中心全方位视觉描述让冻结VLM媲美专用3D模型

---

## 2026-05-24

1. **SOMA: Spatial Memory for Out-of-Vision Manipulation in VLA** - arXiv:2605.22283
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Spatial Memory, Embodied AI, Manipulation, Out-of-Vision, 3D Understanding
   - 文档: papers/2026-05-24_01_SOMA_Spatial_Memory_OOV_Manipulation_VLA.md
   - 核心发现: 持久化空间记忆让VLA超越视野限制操作，多视角扫描构建3D-语义记忆，动态更新维持全局一致性，行为质变：更快定位、更少搜索、接近一次性抓取

2. **LVDrive: Latent Visual Representation Enhanced VLA Autonomous Driving** - arXiv:2605.22089
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, World Model, Autonomous Driving, Latent Representation, Scene Understanding
   - 文档: papers/2026-05-24_02_LVDrive_Latent_Visual_VLA_Driving.md
   - 核心发现: 潜空间未来场景预测优于像素级世界模型，两阶段轨迹解码（粗→精）利用未来语义特征，Bench2Drive SOTA (DS 80.71, SR 58.26%)

3. **ForeSplat: Optimization-Aware Foresight for Feed-Forward 3DGS** - arXiv:2605.22020
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, Novel View Synthesis, Meta-Learning, 3D Reconstruction
   - 文档: papers/2026-05-24_03_ForeSplat_Optimization_Aware_3DGS.md
   - 核心发现: MetaGrad元学习让3DGS初始化更适合快速优化，零步质量略低但优化后显著超越vanilla，跨骨干通用，为边缘设备3D重建开辟道路

4. **GA-VLN: Geometry-Aware BEV Representation for Efficient VLN** - arXiv:2605.22036
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Vision-Language Navigation, BEV, Spatial Reasoning, 3D Grounded Representation, VGGT
   - 文档: papers/2026-05-24_04_GA-VLN_Geometry_Aware_BEV_VLN.md
   - 核心发现: 显式深度投影+隐式VGGT先验的BEV表示，token减少87%且性能提升，无需DAgger即达R2R-CE SOTA (SR 61%)，真实机器人零样本成功部署

5. **Flat-Pack Bench: Evaluating Spatio-Temporal Understanding in LVLMs** - arXiv:2605.21625
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial-Temporal Understanding, VLM Benchmark, Spatial Reasoning, Assembly, Tracking
   - 文档: papers/2026-05-24_05_Flat_Pack_Bench_Spatio_Temporal_VLM.md
   - 核心发现: 家具组装基准揭示VLM时空理解严重不足（GPT-5仅38% vs 人类94%），物体定位(37%)和时空推理(32%)是主要错误源，SAM2追踪IoU仅0.28

## 2026-05-25

1. **PanoWorld** (2605.17916) - 全屋全景空间世界模型，3DGS作为渐进空间记忆，Room-aware LRM [3D生成/世界模型]
2. **RoboFlow4D** (2605.17522) - 端到端轻量4D流世界模型，慢快协作架构，实时机器人操作 [操作/世界模型]
3. **Robo-Cortex** (2605.18729) - 自进化具身导航agent，双粒度认知记忆，自主知识归纳 [导航/自我进化]
4. **GEM** (2605.17682) - 连续4D高斯世界模型，非自回归任意时间查询，占据预测+运动规划 [自动驾驶/4D高斯]
5. **Seeing Together** (2605.18431) - 多机器人协作空间推理基准CoopSR，114K QA，SP-CoR框架 [多智能体/空间推理]

## 2026-06-19 研究的论文（精选5篇）

1. **3DVLA: Enhancing Vision-Language-Action Models via 3D Spatial and Instance Understanding** - arXiv:2605.29416
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 3D Spatial Understanding, Instance Understanding, Plug-and-Play, Self-Supervised Predictor, Multi-View Fusion
   - 文档: papers/2026-06-19_01_3DVLA.md
   - 亮点: Plug-and-play 3D注入框架，无需额外标注；废弃的masked predictor重新用于遮挡补全；无体素化多视图融合+Continuous 3D RoPE

2. **GN0: Toward a Unified Paradigm for Generation, Evaluation, and Policy Learning in VLN** - arXiv:2606.03682
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLN, 3DGS, BEV, DAgger, RL, Navigation Foundation Model, Unified Framework
   - 文档: papers/2026-06-19_02_GN0.md
   - 亮点: 统一数据生成+仿真评估+策略训练闭环；首个BEV-based导航基准GN-Bench；DAgger→RL打破专家分布狭窄瓶颈

3. **SpatialAct: Probing Spatial Reasoning-to-Action Capabilities of VLM Agents** - arXiv:2605.31148
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, Action-Conditioned, Multi-turn, Benchmark, Reasoning-to-Action Gap
   - 文档: papers/2026-06-19_03_SpatialAct.md
   - 亮点: 揭示reasoning-to-action gap——VLM单步推理可用但多轮交互中空间状态跟踪严重不足；五项基础能力诊断定位失败根因

4. **Reasmory: 3D Reconstruction as Explicit Memory for VLMs Spatial Reasoning** - arXiv:2606.00963
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Reconstruction, Explicit Memory, DSL, Structured Program Execution, Spatial Reasoning
   - 文档: papers/2026-06-19_04_Reasmory.md
   - 亮点: 3D重建作为显式空间记忆；轻量DSL约束空间查询；结构化程序执行>自由工具调用，超越GPT-5-mini和Gemini-3-flash 6-18%

5. **S-Agent: Spatial Tool-Use Elicits Reasoning for Spatial Intelligence** - arXiv:2606.20515
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Intelligence, Agent, Evidence Accumulation, Scene Memory, S-300K, NTU
   - 文档: papers/2026-06-19_05_S-Agent.md
   - 亮点: 时空证据累积范式；Scene Memory+Agent Memory双记忆系统；S-Agent-8B用8B参数匹配GPT-5.4和Gemini 3的空间推理能力

## 2026-06-20 研究的论文（精选5篇）

1. **VLM3: Vision Language Models Are Native 3D Learners** - arXiv:2605.30561
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D Understanding, Depth Estimation, Focal Length Unification, Text-based Pixel Reference, Data Scaling
   - 文档: papers/2026-06-20_01_VLM3_Native_3D_Learners.md
   - 亮点: 范式转变——标准VLM无需架构修改即天生是3D学习者；焦距统一+文本像素引用+数据缩放三要素足矣；纯文本next-token预测达SOTA深度估计(Si_wf Δ=0.84→0.9)；4B模型+好数据>8B模型

2. **WorldOlympiad: Can Your World Model Survive a Triathlon?** - arXiv:2606.11129
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model Benchmark, Physical Faithfulness, Geometric Consistency, Interaction Fidelity, Geometry-Simulation Gap
   - 文档: papers/2026-06-20_02_WorldOlympiad_Triathlon_Benchmark.md
   - 亮点: 首个跨域"铁人三项"世界模型评测基准（物理/几何/交互）；量化Geometry-Simulation Gap——最强模型3D一致性仅~42%；MLLM-as-judge自动化评测达ρ=0.95人类对齐；揭示纯视频生成路线的空间理解瓶颈

3. **Occ-VLM: Occupancy Grounded Vision Language Model for Indoor Scene Understanding** - arXiv:2606.19776
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D VLM, Occupancy Prediction, 2D-3D Bridging, Occ Adapter, Indoor Scene Understanding, RGB-only
   - 文档: papers/2026-06-20_03_Occ-VLM_Occupancy_Grounded_VLM.md
   - 亮点: 仅用RGB+单个2D编码器实现3D VLM；Occ Adapter(161M参数)实现双向2D-3D增强；占用预测SOTA同时3D VQA和密集描述具竞争力；证明2D预训练语义可显著增强3D几何感知

4. **Ouroboros-Spatial: Closing the Data-Model Loop for Spatial Reasoning** - arXiv:2606.11719
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Self-evolving Framework, Spatial Reasoning, Data Efficiency, Confidence-based Difficulty, VSI-Bench SOTA
   - 文档: papers/2026-06-20_04_Ouroboros_Spatial_Data_Model_Loop.md
   - 亮点: 自进化数据-模型闭环，模型同时出题和解题；仅25.6k样本(比现有方法少10-100倍)达VSI-Bench SOTA(62.7/63.3)；代码执行保证ground truth可靠性；冻结Proposer的上下文反馈实现零开销难度估计

5. **MemoryWAM: Efficient World Action Modeling with Persistent Memory** - arXiv:2606.20562
   - 相关性: ⭐⭐⭐⭐
   - 关键词: World Action Model, Persistent Memory, Hybrid Memory, Gist Token, Robot Manipulation, Event Boundary
   - 文档: papers/2026-06-20_05_MemoryWAM_Persistent_World_Action.md
   - 亮点: 认知科学启发的混合记忆（短期窗口+事件边界锚点+gist压缩token）；KV cache压缩15倍同时性能反超全历史(83.0% vs 78.2%)；解决WAM记忆-效率权衡；6B参数双分支MoT架构

---

*最后更新时间: 2026-06-20*

## 2026-06-21 研究的论文（精选5篇）

1. **FlowMaps: Modeling Long-Term Multimodal Object Dynamics with Flow Matching** - arXiv:2606.20209
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Flow Matching, Object Dynamics, 3D Scene, Robot Navigation
   - 文档: papers/2026-06-21_01_FlowMaps_Long_Term_Object_Dynamics.md

2. **OneCanvas: 3D Scene Understanding via Panoramic Reprojection** - arXiv:2606.19253
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D Scene Understanding, Panoramic, Spatial Reasoning
   - 文档: papers/2026-06-21_02_OneCanvas_Panoramic_Reprojection.md

3. **ImageWAM: Do World Action Models Really Need Video Generation, or Just Image Editing?** - arXiv:2606.19531
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Action Model, Image Editing, Robot Manipulation, VLA
   - 文档: papers/2026-06-21_03_ImageWAM_Image_Editing_WAM.md

4. **LongSpace: Exploring Long-Horizon Spatial Memory from Perception to Recall in Video** - arXiv:2606.05677
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Memory, Long-Horizon Video, Benchmark, Geometry
   - 文档: papers/2026-06-21_04_LongSpace_Long_Horizon_Spatial_Memory.md

5. **SpatialSV: Internalizing Interpretable 3D Spatial Awareness in MLLMs via Task-Oriented Visual Supervision** - arXiv:2606.19915
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Spatial Awareness, MLLM, 3D Understanding, Interpretability, IJCAI 2026
   - 文档: papers/2026-06-21_05_SpatialSV_3D_Spatial_Awareness_MLLMs.md

## 2026-06-21 研究的论文（第二批，精选5篇）

1. **GEAR-VLA: Learning Geometry-Aware Action Representations for Generalizable Robotic Manipulation** - arXiv:2606.08530
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Geometry-Aware, 3D Fusion, Cross-Embodiment, Flow Matching
   - 文档: papers/2026-06-21_06_GEAR-VLA_Geometry_Aware_Action.md
   - 亮点: 粗到细动作学习 + 零初始化3D融合 + Embodiment Canonicalization，LIBERO 98.7%，跨具身零样本81%

2. **Embodied3DBench: Benchmarking Low-Level Embodied Spatial Intelligence of Vision Language Models** - arXiv:2605.29074
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Benchmark, Embodied Spatial Intelligence, VLM, 3D Interaction, VA-CoT
   - 文档: papers/2026-06-21_07_Embodied3DBench_Spatial_Intelligence_Benchmark.md
   - 亮点: 首个低级具身空间智能基准，6大任务揭示VLM在3D交互中的系统性缺陷

3. **Reason, Then Re-reason: Cross-view Revisiting Improves Spatial Reasoning** - arXiv:2606.11683
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, Cross-view, VGGT 3D Reconstruction, ICML 2026, VSI-Bench
   - 文档: papers/2026-06-21_08_Reason_Re-reason_Cross_View_Spatial.md
   - 亮点: 两阶段假设-验证范式，Qwen3-VL-4B+ReRe超越GPT-4o，+8.5分提升

4. **Mem-World: Memory-Augmented Action-Conditioned World Models for Persistent Robot Manipulation** - arXiv:2606.18960
   - 相关性: ⭐⭐⭐⭐
   - 关键词: World Model, Memory Augmentation, Surfel, Robot Manipulation, 4D Memory
   - 文档: papers/2026-06-21_09_Mem-World_Memory_World_Model.md
   - 亮点: 4D腕部视角surfel记忆，动作→FK→相机位姿→渲染→检索链条，r=0.97时序感知

5. **SpatialClaw: Rethinking Action Interface for Agentic Spatial Reasoning** - arXiv:2606.13673
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Action Interface, Agentic Spatial Reasoning, Code-as-Action, NVIDIA Research
   - 文档: papers/2026-06-21_10_SpatialClaw_Action_Interface_Spatial.md
   - 亮点: 代码即动作接口范式，20个基准平均59.9%（+11.2pp），接口设计而非工具数量是关键瓶颈

## 2026-06-22 研究的论文（精选5篇）

1. **μ₀: A Scalable 3D Interaction-Trace World Model** - arXiv:2606.13769
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Interaction Traces, World Model, Cross-Embodiment, TraceExtract, B-spline, Flow Matching
   - 文档: papers/2026-06-22_01_mu0_3d_interaction_trace_world_model.md
   - 亮点: 用3D交互轨迹作为紧凑、embodiment-agnostic的运动接口，无需动作标签即可预训练world model，trace-conditioned policies达到π₀级别性能

2. **PAIWorld: A 3D-Consistent World Foundation Model for Robotic Manipulation** - arXiv:2606.18375
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Multi-view World Model, 3D Consistency, Geometry-Aware Cross-View Attention, Geo-RoPE, 3D-REPA, WorldArena
   - 文档: papers/2026-06-22_02_paiworld_3d_consistent_world_foundation_model.md
   - 亮点: 诊断多视图世界模型两个根本缺陷（缺通信+缺几何先验），三组件方案实现超加性效果，WorldArena排名第1

3. **Embodied-R1.5: Evolving Physical Intelligence via Embodied Foundation Models** - arXiv:2606.11324
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied Foundation Model, PGC Closed-Loop, 15B Tokens, Multi-task RL, Affordance Grounding, Open-Source
   - 文档: papers/2026-06-22_03_embodied_r1_5_physical_intelligence.md
   - 亮点: 8B参数在16/24个具身VLM基准达SOTA，PGC闭环框架实现自主纠错，推理能力可迁移至VLA

4. **GASP: Injecting 3D Spatial Priors into VLMs for Enhanced Geometric Reasoning** - arXiv:2605.30231
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Geometric Priors, Correspondence, Depth Consistency, VLM Transformer Layers, VSI-Bench, CVPR 2026
   - 文档: papers/2026-06-22_04_gasp_3d_spatial_priors_vlm.md
   - 亮点: 将correspondence和depth先验直接注入LLM所有transformer层，无需3D VQA数据即在VSI-Bench提升29%

5. **Stream3D-VLM: Online 3D Spatial Understanding with Incremental Geometry Priors** - arXiv:2606.06891
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Streaming 3D VLM, Incremental Geometry Priors, VSFI, GAVC, Online Spatial Understanding, 1M QA
   - 文档: papers/2026-06-22_05_stream3d_vlm_online_3d_understanding.md
   - 亮点: 首个在线流式3D VLM，增量注入几何先验实现实时空间理解，涵盖29个任务1M+ QA对

## 2026-06-27 研究的论文（精选5篇）

1. **HoloAgent-0: A Unified Embodied Agent Framework with 3D Spatial Memory** - arXiv:2606.23565
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied Agent, 3D Spatial Memory, AgentOS, Closed-Loop Execution, Horizon Robotics
   - 文档: papers/2026-06-27_01_HoloAgent-0_Unified_Embodied_Agent.md
   - 亮点: 三层耦合架构（AgentOS + 3D空间记忆 + 技能执行），将LLM数字agent执行循环扩展到物理机器人，真实硬件全栈部署验证

2. **Pocket-SLAM: Rendering-Area-Aware Pruning for Memory-Efficient 3DGS-SLAM** - arXiv:2606.24796
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS-SLAM, Memory Efficiency, Rendering-Area-Aware Pruning, Tile-Level Budget, ICRA 2026
   - 文档: papers/2026-06-27_02_Pocket-SLAM_Memory_Efficient_3DGS_SLAM.md
   - 亮点: 渲染面积感知剪枝+瓦片级预算机制，EuRoC和KITTI上60%+内存削减+2倍FPS提升

3. **NavWM: A Unified Navigation World Model for Foresight-Driven Planning** - arXiv:2606.24101
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Visual Navigation, Foresight Planning, Multimodal Trajectory Prediction, ECCV 2026
   - 文档: papers/2026-06-27_03_NavWM_Navigation_World_Model.md
   - 亮点: 统一导航世界模型，Latent World Tokens + 锚点多模态轨迹预测，导航成功率66%→72%，零样本44%

4. **World Action Models Enable Continual Imitation Learning with Recurrent Generative Replays (ReGen)** - arXiv:2606.27374
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Continual Imitation Learning, World Action Model, Generative Replay, Catastrophic Forgetting
   - 文档: papers/2026-06-27_04_WAM_Continual_Imitation_Learning.md
   - 亮点: 首个用WAM自身生成能力实现持续学习的方法，ReGen将灾难性遗忘降低50%，无需存储旧任务真实数据

5. **dVLA-RL: Reinforcement Learning over Denoising Trajectories for Discrete Diffusion VLA Models** - arXiv:2606.23623
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Discrete Diffusion VLA, Reinforcement Learning, Denoising Trajectory, Policy Optimization
   - 文档: papers/2026-06-27_05_dVLA-RL_Discrete_Diffusion_VLA.md
   - 亮点: 首次将RL应用于离散扩散VLA模型，沿去噪轨迹定义MDP并优化，揭示RL训练的运动分布偏差现象

*最后更新时间: 2026-06-27*

---

## 2026-07-01 研究的论文（精选5篇）

1. **VLK: Learning Humanoid Loco-Manipulation from Synthetic Interactions in Reconstructed Scenes** - arXiv:2606.30645
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Vision-Language-Kinematics, Humanoid, 3DGS, Synthetic Data, Sim-to-Real, Loco-Manipulation
   - 文档: papers/2026-07-01_01_VLK_Humanoid_LocoManipulation_Synthetic_Interactions.md
   - 亮点: 3DGS重建场景+合成数据训练人形机器人导航和搬运，48000轨迹全自动生成，无需真实演示，Amazon FAR+UC Berkeley+Stanford

2. **CubifyGS: Object-Centric 3D Gaussian Splatting for Lifelong Dynamic Scene Maintenance** - arXiv:2606.28720
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Object-Centric, Lifelong Mapping, Dynamic Scene, Robotics, IROS 2026
   - 文档: papers/2026-07-01_02_CubifyGS_Object_Centric_Lifelong.md
   - 亮点: 物体级3DGS分解用于长期动态场景维护，刚体重排仅需更新变换矩阵

3. **PhysisForcing: Physics Reinforced World Simulator for Robotic Manipulation** - arXiv:2606.28128
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Simulator, Physics, Video Generation, Robotic Manipulation, NVIDIA, PKU
   - 文档: papers/2026-07-01_03_PhysisForcing_Physics_World_Simulator.md
   - 亮点: 物理强化视频世界模拟器，为视频生成注入物理约束，北大+NVIDIA合作，开源

4. **CRISP: From Hallucination to Grounding — Diagnosing Visual Spatial Intelligence** - arXiv:2606.26535
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, VLM Evaluation, Structural Diagnosis, Language Priors, ECCV 2026
   - 文档: papers/2026-07-01_04_CRISP_Diagnosing_Spatial_Intelligence.md
   - 亮点: 结构化诊断范式区分VLM的语言先验与真正空间推理，ECCV 2026接收

5. **Training Vision-Language-Action Models with Dense Embodied Chain-of-Thought Supervision** - arXiv:2606.30552
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, Chain-of-Thought, Cross-Embodiment, Dense Supervision, Embodied AI
   - 文档: papers/2026-07-01_05_Dense_Embodied_CoT_VLA.md
   - 亮点: 密集Embodied CoT监督桥接不同具身形态，显式推理步骤提升VLA跨具身迁移能力

*最后更新时间: 2026-07-01*

## 2026-07-02 研究的论文（精选5篇）

1. **Dive into the Scene: Breaking the Perceptual Bottleneck in Vision-Language Decision Making via Focus Plan Generation** - arXiv:2606.04046
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: SceneDiver, Focus Plan, Scene Graph, VLM Hallucination, Embodied AI, ICML 2026
   - 文档: papers/2026-07-02_01_SceneDiver_Focus_Plan_VLM.md
   - 亮点: 粗到细焦点计划生成解决VLM视觉幻觉，场景图引导的Agent式视觉探索，浙大ICML 2026

2. **AeroVerse-SatAgent: UAV-Satellite Collaborative Spatial Reasoning Inspired by the Dual Visual Pathway Theory** - arXiv:2606.31467
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: UAV-Satellite, Spatial Reasoning, Dual Visual Pathway, BEV, Cognitive Science
   - 文档: papers/2026-07-02_02_AeroVerse_SatAgent_UAV_Satellite.md
   - 亮点: 认知科学双通路启发UAV-卫星协作空间推理，130K数据集强制跨视角推理，中科院

3. **ViPSim: Collaborating Visual and Parameter Spaces for Consistent Long-Horizon Embodied World Models** - arXiv:2606.28804
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied World Model, Visual-Parameter Dual Space, Plücker Embedding, Long-Horizon, Video Diffusion
   - 文档: papers/2026-07-02_03_ViPSim_Visual_Parameter_Embedded_World_Model.md
   - 亮点: 视觉+参数双空间协同解决EWM表示鸿沟，Plücker嵌入+四重grounding，可变形物体涌现能力

4. **Shell-Supervised Gaussian Splatting for Urban Real-to-Sim Reconstruction** - arXiv:2606.30014
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS, Urban Reconstruction, Real-to-Sim, Facade Shell, Geometric Supervision
   - 文档: papers/2026-07-02_04_Shell_Supervised_GS_Urban_Real2Sim.md
   - 亮点: 外立面壳体作为轻量几何监督改善3DGS城市重建，掩码门控损失保留外观+正则化几何

5. **UniTacVLA: Unified Tactile Understanding and Prediction in Vision Language Action Models** - arXiv:2606.31723
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Tactile VLA, Tactile Chain-of-Thought, Contact-Rich Manipulation, Dual-Frequency Control
   - 文档: papers/2026-07-02_05_UniTacVLA_Tactile_VLA.md
   - 亮点: 触觉思维链+粗到细预测的统一触觉理解框架，预测+反应双频控制器，HIT+Daimon Robotics

*最后更新时间: 2026-07-02*

## 2026-07-03 研究的论文（精选5篇）

1. **RoboAtlas: Contextual Active SLAM** - arXiv:2606.26046
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Active SLAM, Semantic Mapping, Contextual Bandit, VLM Navigation, MERL
   - 文档: papers/2026-07-03_01_RoboAtlas_Contextual_Active_SLAM.md
   - 亮点: 上下文赌博机自适应探索策略，Scene Dictionary可扩展推理，7B+好地图>GPT-4o无地图，GOAT-Bench SOTA 90.6%

2. **OmniView-Space: Reinforcing Spatial Reasoning via Multi-Perspective Spatial Mapping** - arXiv:2607.00881
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, Ego-Frame Alignment, BEV Cognitive Map, MPSM, GRPO, 厦大+腾讯
   - 文档: papers/2026-07-03_02_OmniView_Space_Spatial_Reasoning.md
   - 亮点: 识别参考系不匹配为核心瓶颈，MPSM查询对齐的BEV认知地图+文本空间图，工具→蒸馏→内化三阶段路径

3. **MASER: Modality-Adaptive Specialist Routing for Embodied 3D Spatial Intelligence** - arXiv:2606.02463
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Modality Routing, DoRA Adapters, Open3D-VQA, CVPR Workshop 2026
   - 文档: papers/2026-07-03_03_MASER_Modality_Adaptive_Routing.md
   - 亮点: 首次实证问题语义预测最佳模态，点云仅51.5%最优，轻量MLP路由器~100K参数

4. **3D HAMSTER: Bridging Planning and Control in Hierarchical VLA via 3D Trajectory Guidance** - arXiv:2606.31329
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Hierarchical VLA, 3D Trajectory, Depth Encoder, Graffiti Effect, KAIST
   - 文档: papers/2026-07-03_04_3D_HAMSTER_Hierarchical_VLA.md
   - 亮点: 解决2D-3D表示不匹配的"涂鸦效应"，深度编码器+重建损失让VLM输出度量可靠3D轨迹，开源

5. **Structured 4D Latent Predictive Model for Robot Planning** - arXiv:2607.01166
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D Prediction, Structured Latent, Sparse Voxel, World Model, ICML 2026
   - 文档: papers/2026-07-03_05_Structured_4D_Latent_Predictive.md
   - 亮点: 3D原生世界模型，稀疏体素latent预测场景演化，可解码为3DGS/点云，粗到细两步生成

## 2026-07-04 研究的论文（精选5篇）

1. **L2D2-GS: Learning to Densify for Feedforward Dynamic Gaussian Scene Reconstruction** - arXiv:2606.29374
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Dynamic Scene, Self-supervised Densification, Geometric Reparameterization, PKU+Xiaomi
   - 文档: papers/2026-07-04_01_L2D2_GS_Dynamic_Gaussian_Reconstruction.md
   - 亮点: 将前馈重建重构为迭代优化+学习致密化，自监督reward解决credit assignment，几何重参数化防止早期退化

2. **SpaceEra++: A Unified Framework Towards 3D Spatial Reasoning in Video** - arXiv:2607.02300
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, Video Understanding, VLM, Unified Framework, HIT+Pengcheng Lab
   - 文档: papers/2026-07-04_02_SpaceEra++_3D_Spatial_Reasoning_Video.md
   - 亮点: 统一框架将3D空间推理能力注入视频VLM，支持机器人导航和embodied交互

3. **PhysMani: Physics-principled 3D World Model for Dynamic Object Manipulation** - arXiv:2607.01938
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS World Model, Divergence-free Velocity, Dynamic Manipulation, ECCV 2026, vLAR
   - 文档: papers/2026-07-04_03_PhysMani_Physics_3D_World_Model.md
   - 亮点: 物理原理驱动3D高斯世界模型，无散度速度场保证物理一致性，200ms/帧在线优化，PhysMani-Bench 16个动态操作任务

4. **RoboWorld: Fast and Reliable Neural Simulators for Generalist Robot Policy Evaluation** - arXiv:2607.01060
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Video World Model, Step Forcing, Robot Policy Evaluation, KAIST, ICML 2026
   - 文档: papers/2026-07-04_04_RoboWorld_Neural_Simulators.md
   - 亮点: Step Forcing解决自回归train-test gap，0-5 rubric连续评分+多视角分离评估，Pearson r=0.989与真实世界排名

5. **FastBridge: Closing the Model-Based Realization Gap in Safety Filters on 3DGS for Fast Quadrotor Flight** - arXiv:2607.01200
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Safety Filter, Collision Cone CBF, Backup CBF, Quadrotor
   - 文档: papers/2026-07-04_05_FastBridge_3DGS_Safety_Quadrotor.md
   - 亮点: 全非线性四旋翼动力学的collision cone ECBF，backup CBF保证QP可行性，47% jerk减少+2.25×速度提升

*最后更新时间: 2026-07-04*

---

## 2026-07-10 研究的论文（精选5篇）

1. **DSWAM: A Dual-System World Action Foundation Model for Fine-Grained Robot Manipulation** - arXiv:2607.04927
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Action Model, Dual-System, Video Co-training, TensorRT, DeMaVLA, Midea Group+Tongji
   - 文档: papers/2026-07-10_01_DSWAM_Dual_System_WAM.md
   - 亮点: System 1(WAM执行器)+System 2(可选VLM规划器)双系统解耦，训练时视频协同训练+推理时直接动作预测，DeMaVLA匹配条件下96.3%成功率(+3.8%)

2. **WSA₁: A 3D-Centric World-Spatial-Action Model for Generalizable Robot Control** - arXiv:2607.03941
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D-Centric, World-Spatial-Action, Bidirectional Causal Attention, MoT, Tongji University
   - 文档: papers/2026-07-10_02_WSA1_3D_World_Spatial_Action.md
   - 亮点: 范式级创新——统一3D世界建模+3D约束2D视觉思考+3D逆动力学，双向因果注意力实现世界-动作互约束，仅6K小时数据(1K真实)达93% SR

3. **GeoGS-SLAM: Geometry-Only Gaussian Splatting for Dense Monocular SLAM** - arXiv:2607.07452
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Geometry-Only, SLAM, Sim(3) Map Update, Beihang University
   - 文档: papers/2026-07-10_03_GeoGS_SLAM_Geometry_Only.md
   - 亮点: 仅保留几何参数减少82%参数量，28K高斯(vs 198K)更好几何质量，无颜色渲染训练框架，统一Sim(3)回环更新避免地图撕裂

4. **EAGOR: Embodied Reasoning in Omni-Direction** - arXiv:2607.06165
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Omni-directional, Spherical Harmonics, Recursive Bayesian, Directional Reasoning, NTU
   - 文档: papers/2026-07-10_04_EAGOR_Omni_directional_Reasoning.md
   - 亮点: 球面谐波信念场(SH-BF)在球面上做递归贝叶斯方向估计，免训练框架(VLM+SH解耦)，HOS +34.4%/OSR-Bench +45.6%

5. **TouchWorld: A Predictive and Reactive Tactile Foundation Model for Dexterous Manipulation** - arXiv:2607.07287
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Tactile, Predictive World Model, Multi-timescale, Residual Correction, HIT Shenzhen+PHANES AI
   - 文档: papers/2026-07-10_05_TouchWorld_Tactile_Foundation.md
   - 亮点: 触觉双重角色(预测+反应)，三级多时间尺度架构(语义/动作/触觉)，残差纠正范式，Clean 65.0%/干扰 53.7%成功率

*最后更新时间: 2026-07-10*

## 2026-07-11 研究的论文（精选5篇）

1. **RynnWorld-4D: 4D Embodied World Models for Robotic Manipulation** - arXiv:2607.06559
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D World Model, RGB-DF, Diffusion, Tri-branch, Inverse Dynamics, DAMO Academy/Alibaba
   - 文档: papers/2026-07-11_01_RynnWorld_4D_4D_Embodied_World_Models_for_Robotic_Manipulati.md
   - 亮点: RGB-DF投影4D表示(同步生成RGB+Depth+Flow), 三分支Transformer+跨模态注意力, 254.4M帧Rynn4DDataset, 逆动力学头单次推理高频闭环控制

2. **CamVLA: From Fixed to Free Cameras - Calibration-Free View-Robust VLA** - arXiv:2607.05396
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: View-Robust VLA, Calibration-Free, Camera-Centric Action, Hand-Eye Matrix, NTU+Alibaba
   - 文档: papers/2026-07-11_02_From_Fixed_to_Free_Cameras_Calibration_Free_View_Robust_Visi.md
   - 亮点: 首个无标定视角鲁棒VLA——策略自己推断相机位姿, 相机中心动作+6-DoF手眼矩阵解耦, 自由向量变换数学正确性, 仅需单张RGB

3. **MultiUAV-Plat: LLM-Oriented Multi-UAV Collaborative Task Planning** - arXiv:2606.31073
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Multi-UAV, LLM Agent, Benchmark, RESTful API, Hidden Validation, NUDT
   - 文档: papers/2026-07-11_03_MultiUAV_Plat_An_LLM_Oriented_Platform_Benchmark_and_Framewo.md
   - 亮点: 首个LLM-agent导向多UAV协作平台, 75个任务/1500个NL任务/9396个验证检查, Agent4Drone 57.9% vs ReAct 30.6%(+27.3pp), 隐藏任务验证

4. **AugSplat: Radiance Field-Informed Gaussian Splatting for Sparse-View** - arXiv:2606.31556
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS, Sparse-View, NeRF Ensemble, View Augmentation, Uncertainty, Google+ETH Zurich
   - 文档: papers/2026-07-11_04_AugSplat_Radiance_Field_Informed_Gaussian_Splatting_for_Spar.md
   - 亮点: NeRF作为数据生成器(非最终表示), 集成方差→不确定性加权监督, Staged/Dual两种策略, 保持3DGS实时推理

5. **See-and-Reach: Precise VLN for UAVs (3DG-VLN)** - arXiv:2606.20045
   - 相关性: ⭐⭐⭐⭐
   - 关键词: UAV-VLN-FOV, Dynamic 3D Direction, High-Resolution Dual-View, Waypoint Prediction, SDU+UTS
   - 文档: papers/2026-07-11_05_See_and_Reach_Precise_Vision_Language_Navigation_for_UAVs_wi.md
   - 亮点: 首次隔离"看到即到达"阶段+10米严格标准, 动态在线3D方向更新解决累积漂移, 高分辨率双视角(前视+下视), 2717条轨迹专用基准

## 2026-07-12 研究的论文（精选5篇）

1. **Track2Map: Online Deformable SLAM with Motion-Aware Pose Optimization in Robotic Surgery** - arXiv:2607.08408
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Deformable SLAM, Robotic Surgery, Motion Disentanglement, MICCAI 2026, UCL+Intuitive Surgical
   - 文档: papers/2026-07-12_01_Track2Map_Deformable_SLAM_Robotic_Surgery.md
   - 亮点: 光流方向圆标准差区分相机运动vs组织变形, 运动门控冻结/优化位姿, 跟踪驱动变形初始化, 无/噪声/干净位姿三种模式统一工作

2. **PanoLOG: Geometry and Gradient-based Partitioning for Panoramic Outdoor Reconstruction** - arXiv:2607.08769
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Panoramic 3DGS, ERP, Spatial Partitioning, Sky Sphere, Insta360 Research
   - 文档: papers/2026-07-12_02_PanoLOG_Panoramic_Outdoor_Reconstruction.md
   - 亮点: 首个全景专用分区策略G2PS, 几何+梯度双驱动相机-块分配, Pano360首个大规模全景基准(>200万㎡), 天空球建模

3. **MoE-GS: On the Design of Mixture-of-Experts for Dynamic Gaussian Splatting** - arXiv:2607.08250
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Dynamic 3DGS, Mixture-of-Experts, Multi-Deformation Modeling, MoDE, MoE-GS
   - 文档: papers/2026-07-12_03_MoE_GS_Dynamic_Gaussian_Splatting.md
   - 亮点: 系统分析单一形变模型局限(场景/空间/时间级), MoDE联合训练vs MoE-GS独立+路由两种策略, 开源MoE-GS Studio

4. **FabriVLA: A Lightweight Vision-Language-Action Model for Precise Multi-Task Manipulation** - arXiv:2607.08575
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Lightweight, Flow Matching, Gated Self-Attention, Shallow Layer Fusion, MT50 90%
   - 文档: papers/2026-07-12_04_FabriVLA_Lightweight_VLA_Manipulation.md
   - 亮点: 0.89B参数达MT50 90%成功率, 门控自注意力(零初始化渐进打开), 浅层VLM融合(layer6+layer14), 单阶段联合训练

5. **FSD-VLN: Fast-Slow Dual-System Modeling for Aerial Long-Horizon Vision-Language Navigation** - arXiv:2607.08359
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: UAV VLN, Fast-Slow Dual-System, Diffusion Transformer, Asynchronous, Pengcheng Lab
   - 文档: papers/2026-07-12_05_FSD_VLN_Aerial_Long_Horizon_VLN.md
   - 亮点: 快慢解耦(慢系统VLM+快系统DiT), 异步并行推理延迟降50%, DiT建模跨时间动作依赖, 成功率提升2倍

*最后更新时间: 2026-07-12*

## 2026-07-13 研究的论文（精选5篇）

1. **ACE-Brain-0.5: A Unified Embodied Foundational Model for Physical Agentic AI** - arXiv:2607.04426
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied AI, Foundation Model, SSR+, Self-Monitoring, Self-Improvement, Closed-Loop
   - 文档: papers/2026-07-13_01_ACE-Brain-0.5_Unified_Embodied_Foundation.md
   - 亮点: 五功能统一(感知/决策/交互/监控/改进), 8B单模型SSR+训练范式, Reactivate阶段防遗忘, 15基准14项超越前代

2. **Lift3D-VLA: Lifting VLA Models to 3D Geometry and Dynamics-Aware Manipulation** - arXiv:2607.06564
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 3D Point Cloud, GC-MAE, Layer-wise Temporal Action, 2D-to-3D Lifting
   - 文档: papers/2026-07-13_02_Lift3D-VLA_3D_Geometry_VLA.md
   - 亮点: 虚拟投影2D提升策略, GC-MAE重建+预测双目标, 层级时间动作建模, MetaWorld+10.8%/RLBench+11.1%

3. **Why Far Looks Up: Probing Spatial Representation in Vision-Language Models** - arXiv:2605.30161
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM Spatial Reasoning, Vertical-Distance Entanglement, Representation Probing, SpatialTunnel
   - 文档: papers/2026-07-13_03_Why_Far_Looks_Up_VLM_Spatial_Representation.md
   - 亮点: 发现VLM垂直-距离纠缠偏见, 数据规模加剧而非解决捷径, SpatialTunnel合成基准解耦垂直位置与深度, 表征质量预测鲁棒性

4. **WCog-VLA: A Dual-Level World-Cognitive VLA for End-to-End Autonomous Driving** - arXiv:2607.08375
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLA, Autonomous Driving, World Model, Game-CoT, ADDT, NAVSIM 92.9
   - 文档: papers/2026-07-13_04_WCog-VLA_World_Cognitive_Autonomous_Driving.md
   - 亮点: 双层世界认知(语义+生成), 博弈论思维链(Game-CoT), 对齐解耦扩散Transformer(ADDT), NAVSIM PDMS 92.9 SOTA

5. **TemporalGS: Training-Free Plug-and-Play Acceleration for 3DGS Rendering via Temporal Priors** - arXiv:2607.03390
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3DGS, Rendering Acceleration, Temporal Priors, Training-Free, Plug-and-Play
   - 文档: papers/2026-07-13_05_TemporalGS_Training_Free_3DGS_Acceleration.md
   - 亮点: 首个训练无关3DGS渲染加速, 时间动态剔除+选择性渲染, 最高1.48×加速, 硬件光栅化兼容

*最后更新时间: 2026-07-13*

## 2026-07-14 研究的论文（精选5篇）

1. **PixelPilot: Scalable Vision-Language-Action Models for End-to-End Autonomous Driving** - arXiv:2607.04637
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, Autonomous Driving, 2D-to-2D Planning, GRPO, Decoupled Lifting
   - 文档: papers/2026-07-14_01_PixelPilot_Scalable_VLA_Autonomous_Driving.md
   - 会议: ECCV 2026

2. **MVP-Nav: Multi-layer Value Map Planner Navigator** - arXiv:2606.31919
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: RGB-only Navigation, 3D Foundation Model, VGGT, Semantic-Physical Alignment, Zero-shot
   - 文档: papers/2026-07-14_02_MVP-Nav_Multi-layer_Value_Map_Navigator.md

3. **DeGenseGS: Geometrically and Semantically Decoupled Surgical Scene Understanding in 4D Gaussian Splatting** - arXiv:2607.04761
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 4D Gaussian Splatting, Semantic-Geometric Decoupling, Surgical Scene, VLM, HexPlane
   - 文档: papers/2026-07-14_03_DeGenseGS_Decoupled_Surgical_4DGS.md

4. **GeoProp: Grounding Robot State in Vision for Generalist Manipulation** - arXiv:2607.07101
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Proprioception, Geometric Projection, FiLM, Robot Manipulation, Vision Grounding
   - 文档: papers/2026-07-14_04_GeoProp_Grounding_Robot_State_Vision.md
   - 机构: 阿里巴巴达摩学院

5. **MindEdit-Bench: Benchmarking Object-Level Counterfactual Spatial Reasoning in VLMs from In-the-Wild Photos** - arXiv:2607.00491
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Counterfactual Reasoning, Spatial Editing, VLM Benchmark, 3D Scene Graph, Cross-view
   - 文档: papers/2026-07-14_05_MindEdit-Bench_Counterfactual_Spatial_Reasoning.md
   - 数据集: HuggingFace (ZODAOfficial/MindEdit-Bench)

## 2026-07-15 研究的论文（精选5篇）

1. **ABot-3DWorld 0: A Universal World Model to Explore Any 3D Space** - arXiv:2607.11673
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, 3D Gaussian Splatting, SGP, Multimodal Generation, Geographic Anchoring
   - 文档: papers/2026-07-15_01_ABot-3DWorld_0_Universal_World_Model_3D_Space.md
   - 机构: 阿里巴巴高德地图

2. **SpaR3D-MoE: Adaptive 3D Spatial Reasoning from Sparse Views Meets Geometry-Inductive Mixture-of-Experts** - arXiv:2607.06620
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, MoE, Sparse RGB Views, VSI-Bench, ECCV 2026
   - 文档: papers/2026-07-15_02_SpaR3D_MoE_Adaptive_3D_Spatial_Reasoning.md
   - 发表: ECCV 2026

3. **GEM-Occ: From Visual Geometry Evidence to Embodied Semantic Occupancy Memory** - arXiv:2607.05543
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Semantic Occupancy, Gaussian Evidence Memory, Hierarchical Mapping, Free Space, HIOcc
   - 文档: papers/2026-07-15_03_GEM-Occ_Visual_Geometry_Embodied_Occupancy.md
   - 基准: HIOcc (ScanNet+ScanNet+++Matterport3D)

4. **SplatCtrl: Perception-Action Coupling via Gaussian Scene Representations and Reactive Robot Control** - arXiv:2607.08948
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, Control Barrier Function, SDF, Reactive Control, Perception-Action Coupling
   - 文档: papers/2026-07-15_04_SplatCtrl_Perception_Action_Coupling_Gaussian.md
   - 发表: ICRA 2026

5. **MultiView-Bench: A Diagnostic Benchmark for World-Centric Multi-View Integration in VLMs** - arXiv:2607.08970
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Multi-View Integration, Allocentric, VLM Benchmark, ViewNavigator, Spatial Reasoning
   - 文档: papers/2026-07-15_05_MultiView-Bench_Diagnostic_Multi_View_VLM.md
   - 机构: Yale University

## 2026-07-16 研究的论文（精选5篇）

1. **WorldBagel: Uncovering the Power of Unified Multimodal Models for Vision-Language-Action-World Modeling** - arXiv:2607.03461
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLAW, Unified Model, BAGEL, Fourier Feature Action Tokenizer, World Modeling, VLA
   - 文档: papers/2026-07-16_01_WorldBagel_Unified_VLAW_Vision_Language_Action_World.md
   - 机构: Georgia Institute of Technology
   - 备注: Rejected by ECCV 2026

2. **RoboSnap: One-Shot Real-to-Sim Scene Generation for Generalizable Robot Learning and Evaluation** - arXiv:2607.06699
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Real-to-Sim, 3DGS, Layered Scene, SDF-Physics Optimization, DROID-Sim, Robot Learning
   - 文档: papers/2026-07-16_02_RoboSnap_One_Shot_Real_to_Sim_Robot_Learning.md
   - 机构: Shanghai AI Laboratory, SJTU, Zhejiang University, Tsinghua University

3. **Validate the Dream Before You Trust Its Verdict: Admissibility for World-Model Simulators** - arXiv:2607.07196
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Admissibility, L0-L4 Ladder, Trust Inversion, VV&A, Action-Robustness
   - 文档: papers/2026-07-16_03_Validate_Dream_World_Model_Admissibility.md
   - 领域: 自动驾驶安全验证

4. **ABot-AgentOS: A General Robotic Agent OS with Lifelong Multi-modal Memory** - arXiv:2607.10350
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Agent OS, Multi-modal Graph Memory, Verification-aware ReAct, EmbodiedWorldBench, Self-Evolution
   - 文档: papers/2026-07-16_04_ABot_AgentOS_General_Robotic_Agent_OS_Memory.md
   - 机构: AMap CV Lab

5. **ActiveFly-Bench: Aligning Embodied Question Answering with Vision-Language-Action for Aerial Embodied Perception** - arXiv:2607.10180
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: UAV, Air-EQA, Observation Behavior Planning, FLUC, 5-DoF Control, Embodied Perception
   - 文档: papers/2026-07-16_05_ActiveFly_Bench_UAV_Embodied_Perception_VLA.md
   - 机构: Tsinghua University, Manifold AI

---

## 2026-07-17 研究的论文（精选5篇）

1. **VistaVLA: Geometry- and Semantic-Aware 3D Gaussian-Grounded VLA for Robotic Manipulation** - arXiv:2607.12356
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, VLA, Semantic Cognitive Map, Merge-then-Query, Token Compression
   - 文档: papers/2026-07-17_01_VistaVLA_3D_Gaussian_Grounded_VLA.md
   - 机构: NTU Singapore, A*STAR I2R
   - 亮点: 99% token压缩，3D语义高斯作为VLA认知地图，OOD鲁棒性+22.8%

2. **GeoAnchor: Collaborative Reasoning via Latent Decomposition for 3D Spatial Understanding** - arXiv:2607.13454
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Latent Decomposition, Position/Direction/Geometry Latents, Interleaved Text-Latent Reasoning, MLLM
   - 文档: papers/2026-07-17_02_GeoAnchor_Latent_Decomposition_3D_Spatial.md
   - 机构: ACM MM 2026接收
   - 亮点: 三组件潜在分解(位置/方向/几何)，交错文本-潜在推理，协作训练策略

3. **Hallo4D: Multi-Modal Hallucination Mitigation for Consistent Spatio-Temporal Generation** - arXiv:2607.12752
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Hallucination Mitigation, 3D/4D Generation, LMM Detection, Generation-Detection-Correction, Multi-Model Voting
   - 文档: papers/2026-07-17_03_Hallo4D_Hallucination_Mitigation_Spatio_Temporal.md
   - 亮点: LMM作为空间一致性裁判，生成-检测-修正范式，model-agnostic

4. **DenseReward: Dense Reward Learning via Failure Synthesis for Robotic Manipulation** - arXiv:2607.13033
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Dense Reward, Failure Synthesis, Frame-Level, RL Training, Vision-Language Reward
   - 文档: papers/2026-07-17_04_DenseReward_Failure_Synthesis_Robotic.md
   - 亮点: 自动化失败数据合成管线，帧级密集奖励，支持MPC和RL

5. **SimWorlds: A Multi-Agent System for Dynamic 3D Scene Creation** - arXiv:2607.01766
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Multi-Agent, Dynamic 4D Scene, Text-to-Scene, Runtime State Inspection, 4DBuildBench
   - 文档: papers/2026-07-17_05_SimWorlds_Multi_Agent_Dynamic_3D_Scene.md
   - 机构: CMU (Ming-Hsuan Yang)
   - 亮点: 首个文本到动态4D场景系统，planner-coder-reviewer架构，运行时状态检查

---

## 2026-07-18 研究的论文（精选5篇）

1. **SeeSE3: Emergence of 3D Space in Vision Features** - arXiv:2607.14228
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: SE(3), Vision Foundation Model, Poincaré Adapter, Latent-Space Navigation, Visual Grid Code, Self-supervised
   - 文档: papers/2026-07-18_01_SeeSE3_Emergence_3D_Space_Vision_Features.md
   - 机构: Google DeepMind (Guibas, Ovsjanikov, Yang)
   - 亮点: 首次证明自监督视觉特征隐式包含SE(3)结构，Poincaré Task形式化，潜在空间导航

2. **AeroAct: Action-Centered World-Action Models for Language-Conditioned Quadrotor Flight** - arXiv:2026.07
   - 相关性: ⭐⭐⭐⭐
   - 关键词: World-Action Model, Quadrotor, DiffAero, 3DGS Rendering, Sim-to-Real, Language-Conditioned
   - 文档: papers/2026-07-18_02_AeroAct_World_Action_Models_Quadrotor.md
   - 亮点: 首个面向四旋翼的WAM，DiffAero双渲染器管线，低成本手持采集设备

3. **SoftNav: Injecting 3D Scene Tokens into VLMs for Embodied Navigation** - arXiv:2607.14586
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Soft Token Injection, 3D Scene Encoder, VLM, Navigation, Representation Gap, Zero-shot Transfer
   - 文档: papers/2026-07-18_03_SoftNav_3D_Scene_Tokens_VLM_Navigation.md
   - 机构: 浙江大学 (IROS 2026)
   - 亮点: 首次量化文本序列化的表示差距，17M参数+1200样本达到SOTA，零样本迁移3个任务

4. **SpaceEra++: A Unified Framework Towards 3D Spatial Reasoning in Video** - arXiv:2026.07
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Video 3D Spatial Reasoning, VLM, Spatial Alignment, Progressive Reasoning, Dynamic Spatial Relations
   - 文档: papers/2026-07-18_04_SpaceErapp_3D_Spatial_Reasoning_Video.md
   - 亮点: 统一视频3D空间推理框架，感知→关系→推理层次化设计，空间对齐训练

5. **AeroVerse-SatAgent: UAV-Satellite Collaborative Spatial Reasoning Inspired by Dual Visual Pathway Theory** - arXiv:2026.06
   - 相关性: ⭐⭐⭐⭐
   - 关键词: UAV-Satellite, Dual Visual Pathway, Multi-scale Spatial, What/Where Pathway, Cross-view
   - 文档: papers/2026-07-18_05_AeroVerse_SatAgent_UAV_Satellite_Spatial.md
   - 亮点: 认知科学双通路理论的AI映射，公里-厘米多尺度空间推理，异构多视角融合

---

## 2026-07-19 研究的论文（精选5篇）

1. **AeroAct: Action-Centered World-Action Models for Language-Conditioned Quadrotor Flight** - arXiv:2607.14997v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World-Action Model, Quadrotor Flight, Video Diffusion Transformer, Trajectory Prediction, 3DGS Rendering, Self-Guidance
   - 文档: papers/2026-07-19_01_AeroAct_WAM_Quadrotor.md
   - 机构: 北京理工大学
   - 亮点: 首个物理四旋翼WAM验证，训练-部署解耦设计（训练时视频监督，部署时仅动作解码），DiffAero+Isaac+3DGS三层数据管线，推理加速37.8%

2. **VistaVLA: Geometry- and Semantic-Aware 3D Gaussian-Grounded VLA for Robotic Manipulation** - arXiv:2607.12356v2
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Primitives, VLA, Semantic Grounding, Token Compression, Merge-then-Query, Cognitive Map
   - 文档: papers/2026-07-19_02_VistaVLA_3DGaussian_VLA.md
   - 机构: 南洋理工大学 EmPACT Lab, A*STAR
   - 亮点: 3D高斯原语作为VLA认知基元，MtQ实现99%token压缩（10^5→64），在线构建无需预建地图，OOD任务+30%

3. **SpaceEra++: A Unified Framework Towards 3D Spatial Reasoning in Video** - arXiv:2607.01784v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Spatial Reasoning, VLM, ScenePick, SpaceAlign, GRPO, ScanForgeQA, Chain-of-Thought
   - 文档: papers/2026-07-19_03_SpaceEraPP_Spatial_Reasoning.md
   - 机构: 哈工大(深圳), 鹏城实验室 (NeurIPS 2025 Spotlight扩展)
   - 亮点: 全链路统一框架（数据→输入→训练→推理），ScanForgeQA 925K QA对，ScenePick空间-语义平衡采样，SpaceAlign双重约束RL

4. **Xiaomi-Robotics-U0: Unified Embodied Synthesis with World Foundation Model** - arXiv:2607.11643v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Foundation Model, 38B, Unified Training, Embodied Synthesis, Data Engine, Multi-view Generation
   - 文档: papers/2026-07-19_04_Xiaomi_Robotics_U0.md
   - 机构: 小米机器人
   - 亮点: 38B统一自回归框架，五维度结构化解耦控制，82.9×推理加速，World Arena第一，π₀.₅ OOD成功率36.9%→63.2%

5. **RxBrain: Embodied Cognition Foundation Model with Joint Language-Visual Reasoning and Imagination** - arXiv:2607.14187v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Embodied Cognition, Joint Language-Visual Planning, Visual Imagination, Mixture-of-Transformers, Subgoal Planning
   - 文档: papers/2026-07-19_05_RxBrain_Embodied_Cognition.md
   - 机构: 北京大学, 香港大学, 腾讯
   - 亮点: 语言-视觉互补的认知架构，联合计划序列（文本推理+视觉想象交替），自动视频→计划数据管线，RxBrain-Bench评估基准

## 2026-07-20 研究的论文（精选5篇）

1. **Instant NuRec: Feed-Forward 3D Gaussian Reconstruction for Driving Scene Simulation** - arXiv:2607.14203v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Feed-Forward 3DGS, Driving Simulation, Layered Output, 3DGUT, NuRec, AlpaSim
   - 文档: papers/2026-07-20_01_Instant_NuRec_Feed_Forward_3DGS_Driving_Sim.md
   - 机构: NVIDIA
   - 亮点: 1.5秒重建20秒多相机场景（10³-10⁴倍加速），分层输出（静态/动态/天空），Waymo PSNR +2.01dB

2. **SyncSpace: Layout-Conditioned 3D Gaussian Splatting for Space Reskinning in Mixed Reality** - arXiv:2607.10050v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: MR Space Reskinning, 3DGS, Layout Prior, Coarse-to-Fine Registration, Hand Tracking
   - 文档: papers/2026-07-20_02_SyncSpace_Layout_3DGS_MR_Reskinning.md
   - 机构: -
   - 亮点: 空间重皮肤化概念，布局先验条件化生成，物理-虚拟空间对齐，沉浸式世界替换

3. **REAL: Exploratory, Communicative, and Deployable — Vision-Driven Embodied Agents for Open-World Mobile Manipulation** - arXiv:2607.13653v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied Agent, Sim-to-Real, Open-World Manipulation, VLM, Online RL, REAL-Bench
   - 文档: papers/2026-07-20_03_REAL_Vision_Driven_Embodied_Agents_Mobile.md
   - 机构: 上海AI Lab等 (ECCV 2026)
   - 亮点: 无Oracle感知sim-to-real一致API，241任务基准，真实双臂机器人78.3%成功率，超越商用VLM

4. **EgoHTR: Egocentric 4D Demonstrations of Human Terrain Traversal** - arXiv:2607.13472v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 4D Human Motion, Scene Reconstruction, Humanoid Robot, Terrain Traversal, Multi-sensor
   - 文档: papers/2026-07-20_04_EgoHTR_Egocentric_4D_Human_Terrain_Traversal.md
   - 机构: ETH Zurich, Microsoft, University of Toronto
   - 亮点: 55个场景对齐4D运动序列，150K+帧，可穿戴+3D扫描融合pipeline，Unitree G1部署

5. **JOP-VLN: Joint On-and-Off Policy Learning for Vision-and-Language Navigation** - arXiv:2607.13461v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: VLN, Imitation Learning, Reinforcement Learning, DAgger, High-Entropy Sampling
   - 文档: papers/2026-07-20_05_JOP_VLN_Joint_On_Off_Policy_VLN.md
   - 机构: - (IROS 2026)
   - 亮点: IL+RL首次整合，三阶段训练pipeline，R2R 69.9%新SOTA，错误校正优先轨迹排序

---

## 2026-07-21 研究的论文（精选5篇）

1. **DriftWorld: Fast World Modeling through Drifting** - arXiv:2607.15065v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Model, Drifting Generative Model, Action-Conditioned Video Generation, Robot Planning, Policy Evaluation
   - 文档: papers/2026-07-21_01_DriftWorld_Fast_World_Modeling_Drifting.md
   - 机构: MIT, Harvard (Yilun Du)
   - 亮点: 单步前向传播30+FPS世界模型（比扩散快17倍），策略评估Pearson r=0.99，Action Accentuation技术

2. **WANDA: Worlds in One Demo — Synthetic Data Engine for Open-World Mobile Manipulation** - arXiv:2607.13154v2
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS World Substrate, One-Demo Learning, Trajectory Rearrangement, Cross-Embodiment, Synthetic Data
   - 文档: papers/2026-07-21_02_WANDA_Synthetic_Data_Engine_Mobile_Manipulation.md
   - 机构: Caltech (Guanya Shi, LecAR Lab)
   - 亮点: 单演示→数千训练轨迹，3DGS作为可操作世界基底，跨具身零样本部署，从照片生成3D世界

3. **COLMAR: Cooperative View Policy Learning for Multi-Agent Active 3D Reconstruction** - arXiv:2607.13524v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Multi-Agent, Active 3D Reconstruction, 3DGS, Parameter-Sharing PPO, View Policy
   - 文档: papers/2026-07-21_03_COLMAR_Cooperative_Multi_Agent_Active_3D.md
   - 机构: University of Maryland (Aniket Bera), IROS 2026
   - 亮点: 无通信多智能体协作（参数共享PPO），重建精度+54%覆盖+49%，3DGS质量作为RL奖励

4. **PGRD: Learning Physics-Guided Residual Dynamics for Deformable Object Simulation** - arXiv:2607.13451v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Physics Simulation, Residual Learning, Deformable Object, 3DGS Video Prediction, MPC
   - 文档: papers/2026-07-21_04_PGRD_Physics_Guided_Residual_Dynamics_Deformable.md
   - 机构: UIUC (Svetlana Lazebnik, Yunzhu Li)
   - 亮点: 弹簧-质点+Transformer残差混合范式，语言→目标图像→MPC操作规划，3DGS动态仿真

5. **SceneBind: Binding What and Where Across Vision, Audio and Language** - arXiv:2607.15265v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Omni-Modal, Semantic-Spatial Binding, Cross-Modal Retrieval, Audio-Visual Localization
   - 文档: papers/2026-07-21_05_SceneBind_Binding_What_Where_Multimodal.md
   - 机构: University of Washington (Eli Shlizerman)
   - 亮点: What+Where统一表示，轻量级空间token增强预训练编码器，双声道音频-视觉数据集

---

## 2026-07-22 研究的论文（精选5篇）

1. **E3DGS: Unified Geometric-Photometric Equivariance for 3D Gaussian Splatting via Color-as-Geometry Embedding** - arXiv:2607.15536
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, SE(3) Equivariance, Color-as-Geometry, Representation Theory, Wigner-D Matrix
   - 文档: papers/2026-07-22_01_E3DGS_Unified_Geometric_Photometric_Equivariance.md
   - 机构: University of Michigan (Maani Ghaffari)
   - 亮点: 首次将SH系数视为等变几何对象，𝔤𝔩(3)共轭统一几何+光度，O(1)成对交互无需CG张量积

2. **WCog-VLA: A Dual-Level World-Cognitive Vision-Language-Action Model for End-to-End Autonomous Driving** - arXiv:2607.08375
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, World Cognition, BEV, Game-CoT, ADDT, Autonomous Driving, Multi-Agent Trajectory
   - 文档: papers/2026-07-22_02_WCog_VLA_Dual_Level_World_Cognitive.md
   - 机构: Tongji University, NTU Singapore
   - 亮点: 双层世界认知（语义+生成），博弈论思维链推理（85k标注），NAVSIM SOTA PDMS 92.9

3. **Patch Policy: Efficient Embodied Control via Dense Visual Representations** - arXiv:2607.18236
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Dense Visual Features, ViT Patches, Block-Causal Attention, Efficient Control, LeCun
   - 文档: papers/2026-07-22_03_Patch_Policy_Dense_Visual_Representations.md
   - 机构: NYU, Meta-FAIR, AMI Labs (Yann LeCun, Lerrel Pinto)
   - 亮点: 0.7%参数超越OpenVLA-OFT 18%，~11ms推理，block-causal掩码保留空间细节

4. **Depth-Regularized JEPA World Models Learn More Transferable Representations from Real Outdoor Robot Data** - arXiv:2607.16314
   - 相关性: ⭐⭐⭐⭐
   - 关键词: JEPA, LeWorldModel, Depth Regularization, SIGReg, Outdoor Robot, Transferable
   - 文档: papers/2026-07-22_04_Depth_Reg_JEPA_World_Model_Transferable.md
   - 机构: Aigen (agricultural robot fleet)
   - 亮点: 训练时深度先验+推理时纯RGB，18M参数紧凑JEPA，VO误差降低33%，零推理成本几何注入

5. **PhyAgentOS: A Self-Evolving Operating System for Embodied Agents with Decoupled Cognitive Planning and Physical Execution** - arXiv:2607.16636
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied OS, State-as-a-File, Session-Centered Runtime, Semantic Verification, Epistemic Memory
   - 文档: papers/2026-07-22_05_PhyAgentOS_Self_Evolving_OS_Embodied.md
   - 机构: SCUT, Sun Yat-sen University (Liang Lin)
   - 亮点: 语义验证层填补"执行终止≠任务完成"空白，文件系统协议解耦认知-物理，19+具身验证

## 2026-07-23 研究的论文（精选5篇）

1. **Masked Visual Actions for Unified World Modeling** - arXiv:2607.19343
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: world model, video generation, VLA, masked actions, unified modeling
   - 机构: Stanford, MIT, Columbia, UC Berkeley (Li Fei-Fei, Jiajun Wu)
   - 文档: papers/2026-07-23_01_Masked_Visual_Actions_Unified_World_Modeling.md
   - 核心贡献: 提出像素空间masked visual action接口，单一checkpoint统一前向动力学+逆向动作推断

2. **Agentic Real2Sim: Physics-based World Modeling with Vision-Language Agents** - arXiv:2607.19190
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: real2sim, VLM agents, physics simulation, world model, episodic twin
   - 机构: JHU, UCLA, USC, MIT (Alan Yuille, Chenfanfu Jiang)
   - 文档: papers/2026-07-23_02_Agentic_Real2Sim_Physics_World_Modeling.md
   - 核心贡献: VLM Agent自动化Real2Sim流程，跨域统一(刚体/可变形体/人形)，开源VLM支持

3. **ZeroSplat: Generalized Referring Segmentation in 3D Gaussian Splatting** - arXiv:2607.18801
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, language segmentation, scene understanding, zero-shot, ECCV 2026
   - 发表: ECCV 2026
   - 文档: papers/2026-07-23_03_ZeroSplat_Generalized_Referring_Segmentation_3DGS.md
   - 核心贡献: Training-free zero-feature 3DGS分割，支持任意数量目标的广义referring segmentation

4. **RoboInter1.5: A Holistic Intermediate Representation Suite for Embodied World Modeling** - arXiv:2607.18709
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: embodied, world model, intermediate representation, manipulation, VQA, VLA
   - 机构: Beihang, Shanghai AI Lab, CUHK (Jiangmiao Pang)
   - 文档: papers/2026-07-23_04_RoboInter1.5_Holistic_Intermediate_Representation.md
   - 核心贡献: 230k episode密集标注10+种中间表示，VQA+VLA+World三模块联动

5. **Event3R: Asynchronous-to-Global 3D Reconstruction from Event Camera** - arXiv:2607.15727
   - 相关性: ⭐⭐⭐⭐
   - 关键词: event camera, 3D reconstruction, spatial-temporal, robotics, IROS 2026
   - 发表: IROS 2026
   - 文档: papers/2026-07-23_05_Event3R_Async_to_Global_3D_Reconstruction.md
   - 核心贡献: 首个前馈事件流到3D点云重建框架，MBM自监督预训练解决数据匮乏

---

## 2026-07-25 研究的论文（精选5篇）

1. **3D-Aware VLMs with Implicit and Explicit Geometries (VLM-IE3D)** - arXiv:2607.21595v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D awareness, implicit geometry, explicit geometry, RGB-only, ECCV 2026
   - 机构: NTU, DAMO Academy Alibaba, HuPan Lab
   - 文档: papers/2026-07-25_01_3D_Aware_VLM_IE3D_Implicit_Explicit_Geometries.md
   - 核心贡献: 首个同时使用隐式(IGT)+显式(EGT)3D几何Token增强VLM的统一框架，RGB-only实现多任务SOTA

2. **SafeRelBench: A Spatial-Relation-Aware Benchmark for Process-Level Safety in VLM-Driven Embodied Agents** - arXiv:2607.14543v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: safety benchmark, spatial relations, process-level safety, embodied agents, VLM
   - 机构: BUPT, BIGAI
   - 文档: papers/2026-07-25_02_SafeRelBench_Spatial_Relation_Safety_VLM_Embodied.md
   - 核心贡献: 首个将空间关系（支撑/包含/邻近）作为安全评估核心维度的过程级基准，揭示任务成功≠安全合规

3. **GeoGS-SLAM: Online Monocular Reconstruction Using Gaussian Splatting with Geometric Priors** - arXiv:2607.11184v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: SLAM, 3D Gaussian Splatting, geometric priors, VGGT, monocular, RGB-only
   - 机构: Zhejiang University
   - 文档: papers/2026-07-25_03_GeoGS_SLAM_Monocular_Reconstruction_Geometric_Priors.md
   - 核心贡献: 首个结合VGGT前馈几何先验与3DGS光度优化的RGB-only SLAM系统，闭环重建管线实现高保真+高精度

4. **VTM-Nav: Hierarchical Visual-Topological Memory for Cross-Episode Object-Goal Navigation** - arXiv:2607.14514v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: object-goal navigation, cross-episode, visual-topological memory, VLM, training-free
   - 机构: CASIA, UCAS, Tsinghua
   - 文档: papers/2026-07-25_04_VTM_Nav_Cross_Episode_Visual_Topological_Memory.md
   - 核心贡献: 提出跨回合ObjectNav新设定，层次化视觉拓扑记忆（房间+物体）实现无训练经验复用

5. **PhysCoRe: Physics-Corrected Residual World Models for Material-Aware Deformable Dynamics** - arXiv:2607.20653v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: world model, deformable objects, MPM, material identification, residual correction
   - 机构: Georgia Tech
   - 文档: papers/2026-07-25_05_PhysCoRe_Physics_Corrected_Residual_World_Model.md
   - 核心贡献: 物理仿真器+学习模块混合架构，从运动推断材料属性（MfM）+内部残差校正（RfD）

## 2026-07-26 研究的论文（精选5篇）

1. **GLAM-SLAM: Real-time Gaussian Large-scale Mapping via Flow Densification and Spatial Decomposition** - arXiv:2607.21416
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS SLAM, 大规模建图, 流引导致密化, 空间分解, 实时
   - 会议: IROS 2026
   - 文档: papers/2026-07-26_01_GLAM_SLAM_Real_Time_Large_Scale_Mapping.md

2. **KineBench: Benchmarking Embodied World Models via IDM-Free Kinematic Grounding** - arXiv:2607.19876
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Embodied世界模型, 闭环评估, 运动学接地, SPARC, Manipulability
   - 会议: ECCV 2026
   - 文档: papers/2026-07-26_02_KineBench_Embodied_World_Model_Kinematic_Grounding.md

3. **Athena-Brain Technical Report: An Efficient Robot Brain for General Intelligence** - arXiv:2026-07-21
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 紧凑机器人大脑, 设备端部署, 高层推理+底层执行, Embodied AI系统
   - 类型: Technical Report
   - 文档: papers/2026-07-26_03_Athena_Brain_Robot_General_Intelligence.md

4. **Beyond Episodic Evaluation: Memory Architectural Bottlenecks in Sequential Embodied QA** - arXiv:2026-07-23
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 空间记忆瓶颈, 序列化评估, episodic vs sequential, 架构限制
   - 机构: UMD, UT Austin, NVIDIA
   - 文档: papers/2026-07-26_04_Beyond_Episodic_Memory_Bottlenecks_Embodied_QA.md

5. **WorldScape Policy 2.0: Steerable World Action Modeling with Reasoning-Augmented Memory** - arXiv:2607.18840
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World Action Model, 长短期事件记忆, ManipEvent-5M, 语义强制, 多模态控制
   - 机构: 清华, 上交
   - 文档: papers/2026-07-26_05_WorldScape_Policy_2_Reasoning_Augmented_Memory.md

## 2026-07-27 研究的论文（精选5篇）

1. **Splat-based 3D Scene Reconstruction with Extreme Motion-blur** - arXiv:2607.16926
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, 运动模糊, RGB-D重建, 联合优化, 低光照鲁棒性
   - 会议: ICCV 2025
   - 机构: KAIST, HYPERGRAM
   - 文档: papers/2026-07-27_01_Splat_based_3D_Scene_Reconstruction_with_Extreme_Motion.md

2. **GPOcc++: Unified Sparse Gaussian Occupancy Prediction with Visual Geometry Priors** - arXiv:2607.13481
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 占用预测, 稀疏高斯, 视觉几何先验, 表面到体积转换, 室内外统一
   - 会议: CVPR 2026 (扩展版)
   - 机构: HKUST(GZ), CUHK(SZ), Sun Yat-sen Univ
   - 文档: papers/2026-07-27_02_GPOccpp_Unified_Sparse_Gaussian_Occupancy_Predicti.md

3. **Worlds in One Demo (WANDA): A Synthetic Data Engine for Learning Open-World Mobile Manipulation** - arXiv:2607.13154
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 合成数据引擎, 一次演示, 移动操作, 3DGS世界重建, 跨环境泛化
   - 机构: Caltech (LeCAR Lab)
   - 文档: papers/2026-07-27_03_Worlds_in_One_Demo_A_Synthetic_Data_Engine_for_Lea.md

4. **Robostral Navigate: Scalable Vision-Language Navigation from Monocular RGB** - arXiv:2607.20785
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLN, 单目RGB, 指向导航, Prefix-Caching, 跨身体泛化
   - 机构: Meta/FAIR相关
   - 文档: papers/2026-07-27_04_Robostral_Navigate.md

5. **ZONDA: Zero-shot Object Navigation with Dynamic Avoidance in Multi-floor Environments** - arXiv:2607.21025
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 零样本导航, 多层规划, 动态行人避障, 多视角验证, VLM
   - 机构: SUSTech, Direct Drive Tech, Great Bay University
   - 文档: papers/2026-07-27_05_ZONDA_Zero_shot_Object_Navigation_with_Dynamic_Avo.md

## 2026-07-28 研究的论文（精选5篇）

1. **ViTacWorld: Scaling Visuo-Tactile World Models for Contact-Rich Robot Manipulation** - arXiv:2607.XXXXX
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: visuo-tactile, world model, robot manipulation, dream data, action-conditioned
   - 机构: ShanghaiTech University, InstAdapt
   - 文档: papers/2026-07-28_01_ViTacWorld_Visuo_Tactile_World_Models_Contact_Rich.md

2. **3D-Aware VLMs with Implicit and Explicit Geometries (VLM-IE3D)** - arXiv:2607.21595
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, 3D awareness, implicit geometry, explicit geometry, RGB-only, ECCV 2026
   - 会议: ECCV 2026
   - 机构: NTU, Shanghai AI Lab
   - 文档: papers/2026-07-28_02_3D_Aware_VLMs_Implicit_Explicit_Geometries.md

3. **SiPhy: Single-Image Physical Property Reasoning** - arXiv:2607.22355
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: physical reasoning, single-image, material estimation, mass, stiffness, ECCV 2026
   - 会议: ECCV 2026
   - 文档: papers/2026-07-28_03_SiPhy_Single_Image_Physical_Property_Reasoning.md

4. **MissionBench: Zero-Shot Mission-Level Evaluation for Aerial MLLM Agents** - arXiv:2607.22014
   - 相关性: ⭐⭐⭐⭐
   - 关键词: UAV, MLLM, aerial, benchmark, mission-level, embodied, zero-shot
   - 机构: University of Amsterdam, University of Freiburg
   - 文档: papers/2026-07-28_04_MissionBench_Zero_Shot_Aerial_MLLM_Agents.md

5. **Robot-Factored World Models via Robot Rendering** - arXiv:2607.XXXXX
   - 相关性: ⭐⭐⭐⭐
   - 关键词: world model, robot rendering, factorization, video generation, cross-embodiment
   - 机构: University of Maryland (Hanbyul Joo)
   - 文档: papers/2026-07-28_05_Robot_Factored_World_Models_Robot_Rendering.md

## 2026-07-29 研究的论文（精选5篇）

1. **Data Pyramid for Embodied Manipulation** - arXiv:2607.24744v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: embodied data pyramid, data recipe, VLA, world-action model, tactile data, survey
   - 机构: HKU, NTU, SJTU, CUHK, PKU
   - 文档: papers/2026-07-29_01_Data_Pyramid_Embodied_Manipulation.md

2. **DeVA: Decoupled Video-Action Model with Physical Guidance** - arXiv:2607.24159v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: video-action model, decoupled experts, affordance, depth, Cosmos-Predict2, robot policy
   - 机构: UC Irvine, Georgia Tech
   - 文档: papers/2026-07-29_02_DeVA_Decoupled_Video_Action_Model.md

3. **N₀-TWAM: Scaling Tactile-Native World-Action Model** - arXiv:2607.23783v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: tactile world-action model, MoT, NeoForce, contact-rich manipulation, predict-then-act
   - 机构: NeoteAI, Fudan TEAI
   - 文档: papers/2026-07-29_03_N0_TWAM_Tactile_Native_World_Action_Model.md

4. **Real2Sim2Real for VLA Manipulation: AMD ROCm Pipeline** - arXiv:2607.22997v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: Real2Sim, 3DGS, Genesis, SmolVLA, ROCm, sim-to-real, Franka
   - 机构: AMD AIG, BIT
   - 会议: WAICA 2026
   - 文档: papers/2026-07-29_04_Real2Sim2Real_VLA_AMD_ROCm.md

5. **VoLN: Vision-Only Long-Horizon Navigation** - arXiv:2607.21400v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: vision-only navigation, long-horizon, UAV, benchmark, beacons, spatial reasoning
   - 机构: Beihang University
   - 文档: papers/2026-07-29_05_VoLN_Vision_Only_Long_Horizon_Navigation.md
