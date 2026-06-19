# Spatial AGI Research Papers - Daily Analysis

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

---

*最后更新时间: 2026-06-19*
