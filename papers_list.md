# Spatial AGI 论文列表

本文档记录了所有分析过的论文，按日期组织。

---

## 2026-03-25 研究的论文（精选5篇）✅

1. **UniMotion: A Unified Framework for Motion-Text-Vision Understanding and Generation** - arXiv:2603.22282v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 三模态统一、连续运动表示、CMA-VAE、DPA、LRA、Any-to-Any生成
   - 文档: papers/2026-03-25_01_UniMotion.md
   - NotebookLM: e7a05e04-0118-4b95-b127-1f39e290ec07
   - 核心发现: 运动作为一等公民连续模态、269维运动向量、7项全能任务、连续表示优于离散Tokenization

2. **ThinkJEPA: Empowering Latent World Models with Large Vision-Language Reasoning Model** - arXiv:2603.22281v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM引导世界模型、双时间路径、层次化金字塔表示、FiLM注入、长程预测
   - 文档: papers/2026-03-25_02_ThinkJEPA.md
   - NotebookLM: 0639e74a-a582-4de3-b09a-9cbdf1c95d37
   - 核心发现: 密集JEPA+VLM思考者双分支、语义引导抑制误差累积、3D手部轨迹预测SOTA

3. **DualCoT-VLA: Visual-Linguistic Chain of Thought via Parallel Reasoning for Vision-Language-Action Models** - arXiv:2603.22280v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 并行CoT、视觉-语言双流、毫秒级推理、O(1)复杂度、Flow-Matching
   - 文档: papers/2026-03-25_03_DualCoT-VLA.md
   - NotebookLM: a725193a-cf05-475e-bfee-c1a96184860e
   - 核心发现: 推理延迟从3178ms降至83ms、并行查询Token、几何蒸馏+步骤监督

4. **The Dual Mechanisms of Spatial Reasoning in Vision-Language Models** - arXiv:2603.22278v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM空间推理、双机制、视觉编码器主导、全局分布表征、方向增强
   - 文档: papers/2026-03-25_04_Dual_Mechanisms_Spatial_Reasoning.md
   - NotebookLM: 0a2b3c5f-a125-40b8-9d60-10a204f95a32
   - 核心发现: 视觉派生机制主导、LM底座备份、空间信息全局分布、无需微调的改进

5. **3D-Layout-R1: Structured Reasoning for Language-Instructed Spatial Editing** - arXiv:2603.22279v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 场景图推理、结构化CoT、GRPO强化学习、几何奖励、空间编辑
   - 文档: papers/2026-03-25_05_3D_Layout_R1.md
   - NotebookLM: 38450943-4085-4a1e-be15-0dcf21c1c508
   - 核心发现: Chain-of-graph-edits、IoU提升15%、场景图作为迭代画布、几何反馈驱动

### 研究主题统计（2026-03-25）

**核心技术**:
- 多模态统一: 1篇（UniMotion）
- 世界模型: 1篇（ThinkJEPA）
- 并行推理: 1篇（DualCoT-VLA）
- 机制理解: 1篇（Dual Mechanisms）
- 空间编辑: 1篇（3D-Layout-R1）

**关键突破**:
- 连续表示范式：运动作为一等公民，优于离散Tokenization
- 并行推理革命：O(N)→O(1)，毫秒级实时响应
- 视觉编码器主导：VLM空间能力的真正来源
- 结构化推理：图编辑链优于自由文本CoT

---

## 2026-03-22 研究的论文（精选5篇）✅

1. **Matryoshka Gaussian Splatting: Scalable 3D Scene Representation with Continuous Level-of-Detail** - arXiv:2603.19234v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting、连续LoD、随机预算训练、资源自适应、嵌套式表示
   - 文档: papers/2026-03-22_01_Matryoshka_Gaussian_Splatting.md
   - 核心发现: 俄罗斯套娃式高斯表示、任意前缀可渲染、全容量质量无损、双路优化

2. **GSMem: 3D Gaussian Splatting as Persistent Spatial Memory for Embodied AI** - arXiv:2603.19137v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 具身智能、空间记忆、3D高斯泼溅、事后可重观察、空间回忆
   - 文档: papers/2026-03-22_02_GSMem.md
   - 核心发现: 持久空间记忆、任意视角渲染、VLM零样本推理、解决信息遗漏问题

3. **DreamPartGen: Semantically Grounded Part-Level 3D Generation via Collaborative Latent Denoising** - arXiv:2603.19216v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 部件级3D生成、语义基础、协同去噪、双路潜变量、关系语义
   - 文档: papers/2026-03-22_03_DreamPartGen.md
   - 核心发现: DPLs+RSLs双路表示、几何-外观-语义三位一体、语言驱动生成、部件间关系建模

4. **MonoArt: Progressive Structural Reasoning for Monocular Articulated 3D Reconstruction** - arXiv:2603.19231v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 单目重建、铰接物体、渐进式推理、结构化推理、双查询解码
   - 文档: papers/2026-03-22_04_MonoArt.md
   - 核心发现: 几何→部件→运动的渐进推理、双查询运动解码器、无需多视图/外部先验

5. **SAMA: Factorized Semantic Anchoring and Motion Alignment for Instruction-Guided Video Editing** - arXiv:2603.19228v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频编辑、语义锚定、运动对齐、因子化学习、语义-运动解耦
   - 文档: papers/2026-03-22_05_SAMA.md
   - 核心发现: 语义锚定+运动对齐分解、稀疏锚点帧、无外部先验依赖、运动中心自监督

### 研究主题统计（2026-03-22）

**核心技术**:
- 3D高斯泼溅: 2篇（MGS、GSMem）
- 部件级3D理解: 2篇（DreamPartGen、MonoArt）
- 语义-运动解耦: 1篇（SAMA）

**关键突破**:
- 3DGS成为Spatial AGI核心表示（连续LoD + 空间记忆）
- 部件级理解是空间智能的关键能力
- 层次化表示 + 解耦学习 + 语义基础 = Spatial AGI技术三角

---

## 2026-03-21 研究的论文（精选5篇）✅

1. **Generation Models Know Space: Unleashing Implicit 3D Priors for Scene Understanding** - arXiv:2603.19235v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频生成模型、3D先验、VEGA-3D、潜在世界模拟器、自适应门控融合
   - 文档: papers/2026-03-21_Generation_Models_Know_Space.md
   - 核心发现: 视频扩散模型作为世界模拟器、中间噪声层级富含几何信息、无需3D监督、SOTA性能

2. **Not All Features Are Created Equal: A Mechanistic Study of Vision-Language-Action Models** - arXiv:2603.19233v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA机制、SAE分析、视觉路径主导、空间绑定运动程序、可解释性
   - 文档: papers/2026-03-21_Not_All_Features_Created_Equal.md
   - 核心发现: 视觉特征占主导、语言作用依赖任务结构、专家路径vs VLM路径、Action Atlas

3. **NavTrust: Benchmarking Trustworthiness for Embodied Navigation** - arXiv:2603.19229v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 具身导航、鲁棒性、corruption评估、VLN、OGN、真实机器人部署
   - 文档: papers/2026-03-21_NavTrust.md
   - 核心发现: 系统性corruption评估、深度corruption更严重、数据增强最有效、真实机器人验证

4. **DriveTok: 3D Driving Scene Tokenization for Unified Multi-View Reconstruction and Understanding** - arXiv:2603.19219v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多视角tokenization、3D可变形注意力、场景token、统一重建理解、自动驾驶
   - 文档: papers/2026-03-21_DriveTok.md
   - 核心发现: 3D可变形交叉注意力、多任务学习（RGB+深度+语义+占用）、统一场景token

5. **Reconstruction Matters: Learning Geometry-Aligned BEV Representation through 3D Gaussian Splatting** - arXiv:2603.19193v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: BEV感知、3D Gaussian Splatting、显式3D重建、几何对齐、Splat2BEV
   - 文档: papers/2026-03-21_Reconstruction_Matters_BEV.md
   - 核心发现: 显式3D重建提升BEV质量、Gaussian Splatting高效表示、几何对齐特征、nuScenes SOTA

### 研究主题统计（2026-03-21）

**核心技术**:
- 生成模型3D先验: 1篇（VEGA-3D）
- VLA机制理解: 1篇（Not All Features）
- 鲁棒性评估: 1篇（NavTrust）
- 多视角tokenization: 1篇（DriveTok）
- 显式3D重建: 1篇（Splat2BEV）

**关键突破**:
- 生成模型包含隐式3D先验（无需3D监督）
- 视觉路径主导VLA动作生成
- Gaussian Splatting提升BEV感知质量
- 系统性corruption评估框架

---

## 2026-03-20 研究的论文（精选5篇）✅

1. **Loc3R-VLM: Language-based Localization and 3D Reasoning with Vision-Language Models** - arXiv:2603.18002v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D VLM、语言定位、情境建模、BEV重建、相机位姿先验
   - 文档: papers/2026-03-20_01_Loc3R-VLM.md
   - 核心发现: 双目标学习（全局布局重建+情境建模）、CUT3R相机位姿先验、BEV辅助训练、ScanQA SOTA

2. **Feeling the Space: Egomotion-Aware Video Representation for 3D Scene Understanding** - arXiv:2603.17980v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 自运动感知、IMU数据、物理接地、关键帧过滤、3D场景理解
   - 文档: papers/2026-03-20_02_Feeling_the_Space.md
   - 核心发现: 级联运动-视觉过滤、非对称跨模态融合、1.40×成本效益提升、绝对尺度推理

3. **GMT: Goal-Conditioned Multimodal Transformer for 6-DOF Object Trajectory Synthesis** - arXiv:2603.17993v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 6-DOF轨迹生成、目标条件、多模态融合、3D场景理解、机器人操作
   - 文档: papers/2026-03-20_03_GMT.md
   - 核心发现: 以物体为中心的轨迹表示、分层融合（几何>语义）、CLIP跨类别迁移、超越CHOIS/GIMO

4. **LoST: Level of Semantics Tokenization for 3D Shapes** - arXiv:2603.17995v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 语义tokenization、3D形状、AR生成、RIDA损失、语义检索
   - 文档: papers/2026-03-20_04_LoST.md
   - 核心发现: 语义LoD替代几何LoD、RIDA对齐损失、0.1%-10% token数量、短前缀即可用

5. **STTS: Unified Spatio-Temporal Token Scoring for Efficient Video VLMs** - arXiv:2603.18004v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 时空token优化、视频VLM、效率提升、token修剪、端到端训练
   - 文档: papers/2026-03-20_05_STTS.md
   - 核心发现: 50%修剪率、62%效率提升、仅0.7%性能损失、统一ViT+LLM修剪

### 研究主题统计（2026-03-20）

**核心技术**:
- VLM 3D理解: 2篇（Loc3R-VLM, Feeling the Space）
- 3D表示与生成: 1篇（LoST）
- 轨迹生成: 1篇（GMT）
- 效率优化: 1篇（STTS）

**关键突破**:
- 空间接地能力（IMU + 相机位姿）
- 语义tokenization替代几何LoD
- 62%效率提升的时空优化

---

## 2026-03-19 研究的论文（精选5篇）✅

1. **WorldCam: Interactive Autoregressive 3D Gaming Worlds with Camera Pose as a Unifying Geometric Representation** - arXiv:2603.16871v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D游戏世界、相机位姿、几何表示、长期一致性、交互式生成
   - 文档: papers/2026-03-19_01_WorldCam.md
   - 核心发现: 相机位姿作为统一几何表示、物理动作空间、全局位姿索引、3000分钟游戏数据

2. **Demystifing Video Reasoning** - arXiv:2603.16870v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频推理、扩散模型、Chain-of-Steps、工作记忆、自纠正
   - 文档: papers/2026-03-19_02_Demystifing_Video_Reasoning.md
   - 核心发现: 推理在去噪步骤中涌现、Chain-of-Steps机制、功能特化层、训练自由集成

3. **MessyKitchens: Contact-rich object-level 3D scene reconstruction** - arXiv:2603.16868v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 物体级重建、接触丰富场景、多物体解码器、物理合理性、真实数据集
   - 文档: papers/2026-03-19_03_MessyKitchens.md
   - 核心发现: MessyKitchens数据集、Multi-Object Decoder、非穿透约束、接触检测

4. **ManiTwin: Scaling Data-Generation-Ready Digital Object Dataset to 100K** - arXiv:2603.16866v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 数字孪生、仿真就绪、3D资产生成、机器人操作、语义标注
   - 文档: papers/2026-03-19_04_ManiTwin.md
   - 核心发现: 单图像到仿真资产、100K数据集、物理属性、功能标注、操作建议

5. **BrickSim: A Physics-Based Simulator for Manipulating Interlocking Brick Assemblies** - arXiv:2603.16853v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 物理仿真、积木组装、snap-fit力学、长期操作、实时仿真
   - 文档: papers/2026-03-19_05_BrickSim.md
   - 核心发现: 力学模型、凸二次规划、混合架构、100%稳定性预测、5ms求解时间

### 研究主题统计（2026-03-19）

**核心技术**:
- 3D世界生成与导航: 1篇（WorldCam）
- 视频推理机制: 1篇（Demystifing Video Reasoning）
- 场景理解与重建: 1篇（MessyKitchens）
- 数据生成与仿真: 2篇（ManiTwin, BrickSim）

**关键突破**:
- 相机位姿统一几何表示（WorldCam）
- Chain-of-Steps推理机制（Demystifing Video Reasoning）
- 接触丰富的多物体重建（MessyKitchens）
- 100K仿真就绪数据集（ManiTwin）
- 实时物理仿真（BrickSim）

**与Spatial AGI的关系**:
- 3D世界建模与导航能力
- 时空推理与理解
- 物理合理的场景理解
- 大规模数据生成支持
- 长期操作规划基础

---

## 2026-03-17 研究的论文（精选5篇）✅

1. **PanoMMOcc: Panoramic Multimodal Semantic Occupancy Prediction for Quadruped Robot** - arXiv:2603.13108v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 四足机器人、全景感知、多模态融合、占用预测、垂直抖动补偿
   - 文档: papers/2026-03-17_01_Panoramic_Multimodal_Semantic_Occupancy_Quadruped.md
   - 核心发现: 首个四足机器人全景多模态占用数据集，VoxelHound框架，mIoU 23.34%（+4.16%）
   - NotebookLM: 826d8422-67ef-48e0-9c0e-882e073757da

2. **Towards Spatio-Temporal World Scene Graph Generation from Monocular Videos** - arXiv:2603.13185v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 世界场景图、物体恒存性、时空推理、3D几何标注、持久记忆
   - 文档: papers/2026-03-17_02_Spatio_Temporal_World_Scene_Graph_Monocular.md
   - 核心发现: 世界中心化场景图、物体恒存性建模、ActionGenome4D数据集
   - GitHub: https://github.com/rohithpeddi/WorldSGG

3. **GoalSwarm: Multi-UAV Semantic Coordination for Open-Vocabulary Object Search** - arXiv:2603.12908v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多无人机协调、语义导航、开放词汇、去中心化架构、贝叶斯价值地图
   - 文档: papers/2026-03-17_03_GoalSwarm_Multi_UAV_Semantic_Coordination.md
   - 核心发现: 成功率45.0%（vs 单智能体10.0%），去中心化协调，零样本开放词汇检测

4. **OnFly: Onboard Zero-Shot Aerial Vision-Language Navigation toward Safe Flight** - arXiv:2603.10682v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 空中VLN、零样本导航、机载计算、双智能体架构、安全飞行
   - 文档: papers/2026-03-17_04_OnFly_Zero_Shot_Aerial_VLN_Safe_Flight.md
   - 核心发现: 全机载计算、共享感知双智能体、混合关键帧记忆、语义-几何校验

5. **Geometry-Guided Camera Motion Understanding in VideoLLMs** - arXiv:2603.13119v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VideoLLM、相机运动理解、几何感知、3D基础模型、结构化提示
   - 文档: papers/2026-03-17_05_Geometry_Guided_Camera_Motion_VideoLLMs.md
   - 核心发现: 外部3DFM几何插件、相机令牌注入、几何蒸馏
   - NotebookLM: ddae667f-691a-43fd-8cae-63107c050b76

### 研究主题统计（2026-03-17）

**核心技术**:
- 多智能体协调: 2篇（GoalSwarm, OnFly）
- 世界模型/场景图: 1篇（WorldSGG）
- 全景多模态感知: 1篇（PanoMMOcc）
- 几何感知增强: 1篇（VideoLLM Camera Motion）

**关键突破**:
1. 物体恒存性（Object Permanence）作为空间智能基础
2. 去中心化多智能体协调架构
3. 几何感知作为VideoLLM的补完
4. 从单机感知到群体智能的范式转变

---

## 2026-03-16 研究的论文（精选5篇）✅

1. **EndoCoT: Scaling Endogenous Chain-of-Thought Reasoning in Diffusion Models** - arXiv:2603.12252v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 链式思维推理、扩散模型、迭代思维指导、终端思维接地
   - 文档: papers/2026-03-16_EndoCoT_Diffusion_Reasoning.md
   - 核心发现: 92.1%平均准确率，+8.3%提升，首个真正的CoT扩散框架
   - NotebookLM: 67159b01-a1e9-42ea-8667-90e2b43437f7

2. **EVATok: Adaptive Length Video Tokenization for Efficient Visual Autoregressive Generation** - arXiv:2603.12267v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 自适应tokenization、Proxy Reward、视频生成、效率优化
   - 文档: papers/2026-03-16_EVATok_Adaptive_Video_Token.md
   - 核心发现: 节省24.4%+ tokens，四阶段训练框架，效率-质量双赢
   - NotebookLM: ffc65460-6b0c-46d7-8a11-580910c58a2e

3. **DreamVideo-Omni: Omni-Motion Controlled Multi-Subject Video Customization with Latent Identity Reinforcement Learning** - arXiv:2603.12257v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多主体视频生成、全方位运动控制、身份强化学习、潜在空间优化
   - 文档: papers/2026-03-16_DreamVideo_Omni_Motion_Control.md
   - 核心发现: 两阶段训练范式，5个关键技术组件，多主体空间关系建模
   - NotebookLM: a5e9ca2e-7cb6-48b9-927c-056fbdcde9c5 (fallback方案)

4. **Ψ₀: An Open Foundation Model Towards Universal Humanoid Loco-Manipulation** - arXiv:2603.12263v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 人形机器人、基础模型、分阶段训练、MM-DiT架构、实时控制
   - 文档: papers/2026-03-16_Psi0_Humanoid_LocoManipulation.md
   - 核心发现: 800+30小时数据超越10倍基线40%+，MM-DiT架构，RTC实时控制
   - NotebookLM: 56b92811-83c3-416c-996c-cdb509404f5d (fallback方案)

5. **Attend Before Attention: Efficient and Scalable Video Understanding** - arXiv:2603.12254v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 高效视频理解、注意力优化、可扩展架构、实时处理
   - 文档: papers/2026-03-16_Attend_Before_Attention_Video.md
   - 核心发现: 高效视频理解架构，可扩展设计，实时处理能力
   - NotebookLM: 9e75fe98-4a2f-48d1-92b5-61d6fe5e4a4d

---

## 研究主题统计（2026-03-16）

**核心技术**:
- 链式思维推理: 1篇（EndoCoT）
- 自适应tokenization: 1篇（EVATok）
- 多主体视频生成: 1篇（DreamVideo-Omni）
- 人形机器人基础模型: 1篇（Ψ₀）
- 高效视频理解: 1篇（Attend Before Attention）

**应用领域**:
- 扩散模型推理: 1篇（EndoCoT）
- 视频生成/理解: 3篇（EVATok, DreamVideo-Omni, Attend Before Attention）
- 机器人操作: 1篇（Ψ₀）

**方法类别**:
- 迭代推理: 1篇（EndoCoT）
- 自适应编码: 1篇（EVATok）
- 两阶段训练: 2篇（DreamVideo-Omni, Ψ₀）
- 注意力优化: 1篇（Attend Before Attention）

**关键技术突破**:
1. ⭐ **内源性链式思维推理**（EndoCoT）- 首个真正的CoT扩散框架，92.1%准确率
2. ⭐ **Proxy Reward形式化**（EVATok）- 自适应token分配，节省24.4%+ tokens
3. ⭐ **多主体空间关系建模**（DreamVideo-Omni）- 全方位运动控制，身份强化学习
4. ⭐ **分阶段训练范式**（Ψ₀）- 仅用800+30小时数据，超越10倍基线40%+
5. ⭐ **高效视频理解架构**（Attend Before Attention）- 可扩展设计，实时处理

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 3篇使用NotebookLM深度分析
- ⚠️ 2篇使用web_fetch fallback方案（NotebookLM来源添加失败）
- ✅ 平均文档行数: 1,201行（远超500行要求）

---

## 2026-03-14 研究的论文（精选3篇）

1. **Video Streaming Thinking: VideoLLMs Can Watch and Think Simultaneously** - arXiv:2603.12262v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频流理解、分摊推理、实时响应、双记忆系统
   - 文档: papers/2026-03-14_02_Video_Streaming_Thinking.md
   - 核心发现: 15.7倍响应加速，边看边思考范式
   - NotebookLM: N/A（使用web_fetch备用方案）

2. **MM-CondChain: A Programmatically Verified Benchmark for Visually Grounded Deep Compositional Reasoning** - arXiv:2603.12266v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 深度组合推理、VPIR框架、硬负样本、基准测试
   - 文档: papers/2026-03-14_03_MM_CondChain.md
   - 核心发现: 4层组合推理仅30% F1，揭示深度推理瓶颈
   - NotebookLM: N/A（NotebookLM服务不可用）

3. **GRADE: Benchmarking Discipline-Informed Reasoning in Image Editing** - arXiv:2603.12264v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 知识驱动推理、领域知识、三维度评估、基准测试
   - 文档: papers/2026-03-14_05_GRADE.md
   - 核心发现: 闭源vs开源差距58.3分，提供知识驱动评估框架
   - NotebookLM: N/A（NotebookLM服务不可用）

---


## 2026-03-13 研究的论文（精选5篇）✅

1. **Dense Dynamic Scene Reconstruction and Camera Pose Estimation from Multi-View Videos** - arXiv:2603.12064
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多相机动态重建, 两阶段优化, 时空连接图, 宽基线初始化
   - 文档: papers/2026-03-13_01_Dynamic_Scene_Reconstruction.md
   - 核心贡献: 多相机时空连接图，鲁棒尺度一致性，MultiCamRobolab数据集

2. **OnFly: Onboard Zero-Shot Aerial Vision-Language Navigation toward Safety and Efficiency** - arXiv:2603.10682
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 零样本AVLN, 双智能体架构, 语义-几何验证, 机载实时
   - 文档: papers/2026-03-13_02_OnFly_Aerial_VLN.md
   - 代码: https://github.com/Robotics-STAR-Lab/OnFly
   - 核心贡献: 共享感知双智能体，任务成功率26.4%→67.8%，完全机载部署

3. **Pano360: Perspective to Panoramic Vision with Geometric Consistency** - arXiv:2603.12013
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 全景拼接, 3D几何一致性, Transformer架构, 多特征联合优化
   - 文档: papers/2026-03-13_03_Pano360.md
   - 代码: https://github.com/KiMomota/Pano360
   - 核心贡献: 3D摄影测量空间对齐，成功率97.8%，~5秒运行时间

4. **UAV-Based 3D Spectrum Sensing: Insights on Altitude, Bandwidth, Trajectory, and Effective Antenna Patterns on REM Reconstruction** - arXiv:2603.10362
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D频谱感知, REM重建, UAV高度影响, 天线模式校准
   - 文档: papers/2026-03-13_04_UAV_3D_Spectrum.md
   - 核心贡献: 深阴影框架，三相高度趋势，现场天线校准增强精度

5. **Lightweight 3D LiDAR-Based UAV Tracking: An Adaptive Extended Kalman Filtering Approach** - arXiv:2603.09783
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: LiDAR跟踪, AEKF, 自适应噪声协方差, GPS拒绝环境
   - 文档: papers/2026-03-13_05_LiDAR_UAV_Tracking.md
   - 核心贡献: 轻量级LiDAR跟踪，创新残差统计调整，恢复机制

---

## 研究主题统计（2026-03-13）

**核心技术**:
- 多相机动态重建: 1篇（Dynamic Scene Reconstruction）
- 零样本AVLN: 1篇（OnFly）
- 全景视觉: 1篇（Pano360）
- 3D频谱感知: 1篇（UAV 3D Spectrum）
- LiDAR跟踪: 1篇（LiDAR UAV Tracking）

**应用领域**:
- 3D重建: 2篇（Dynamic Scene, Pano360）
- 无人机导航: 2篇（OnFly, LiDAR UAV Tracking）
- 频谱管理: 1篇（UAV 3D Spectrum）
- 全景视觉: 1篇（Pano360）

**方法类别**:
- 两阶段优化: 1篇
- 双智能体架构: 1篇
- 3D几何一致性: 1篇
- AEKF滤波: 1篇
- Kriging/GPR重建: 1篇

**关键技术突破**:
1. ⭐ **多相机时空连接图**（Dynamic Scene）- 解决自由移动相机的尺度一致性
2. ⭐ **共享感知双智能体**（OnFly）- 解耦高频决策与低频监控，任务成功率+156%
3. ⭐ **3D摄影测量空间对齐**（Pano360）- 摆脱2D成对限制，97.8%成功率
4. ⭐ **深阴影REM框架**（UAV 3D Spectrum）- 分解平滑与深阴影组件提升精度
5. ⭐ **自适应噪声协方差调整**（LiDAR UAV Tracking）- 创新残差统计动态调整

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 全部使用NotebookLM深度分析
- ✅ 平均文档长度: 2,000+行
- ✅ 全部达到500+行要求

---

## 2026-03-11 研究的论文（精选5篇）✅

1. **ImprovedGS+: A High-Performance C++/CUDA Re-Implementation Strategy for 3D Gaussian Splatting** - arXiv:2603.08661
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS, C++/CUDA, 性能优化, 实时重建
   - 文档: papers/2026-03-11_01_ImprovedGS.md
   - NotebookLM: 316bce50-7783-4e30-9bae-0d508a39c48c
   - 核心贡献: C++/CUDA原生实现，70%同步开销消除，训练时间-26.8%，PSNR+1.28dB

2. **Boosting MLLM Spatial Reasoning with Geometrically Referenced 3D Scene Representations (GR3D)** - arXiv:2603.08592
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: MLLM, 空间推理, 几何参考, 无需微调
   - 文档: papers/2026-03-11_02_MLLM_Spatial_Reasoning.md
   - NotebookLM: 4b208221-5ae4-456a-ae93-737a95c9917c
   - 核心贡献: 物体ID标注建立2D-3D关联，GPT-5空间推理+8%，无需训练

3. **Exp-Force: Experience-Conditioned Pre-Grasp Force Selection with Vision-Language Models** - arXiv:2603.08668
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 机器人操作, VLM, RAG, 经验推理, 力控制
   - 文档: papers/2026-03-11_03_Exp_Force.md
   - 分析方法: GLM WebReader (NotebookLM失败)
   - 核心贡献: VLM+RAG实现经验条件化，MAE 0.43N，合适力选择率63%→87%

4. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:待确认
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频流建模, 定位深度耦合, 空间推理基准, 整体理解
   - 文档: papers/2026-03-11_04_Holi_Spatial.md
   - 项目主页: https://visionary-laboratory.github.io/holi-spatial/
   - NotebookLM: 3f5f97c3-0cfb-45d0-8f57-8e3c2c7c18ea
   - 核心贡献: 统一视频流建模，定位-深度双向耦合，1.3M+ QA基准，Base-plus-Delta几何表示

5. **FVG-PT: Adaptive Foreground View-Guided Prompt Tuning for Vision-Language Models** - arXiv:2603.08708
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, prompt tuning, 注意力控制, 参数高效
   - 文档: papers/2026-03-11_05_FVG_PT.md
   - 代码: https://github.com/JREion/FVG-PT
   - 核心贡献: 前景注意力引导，参数0.13M，缓解base-new trade-off

---

## 研究主题统计（2026-03-11）

**核心技术**:
- 3D表示效率: 1篇（ImprovedGS+）
- MLLM空间理解: 1篇（GR3D）
- 视频流空间智能: 1篇（Holi-Spatial）🆕
- 机器人操作: 1篇（Exp-Force）
- VLM注意力控制: 1篇（FVG-PT）

**应用领域**:
- 3D重建: 1篇（ImprovedGS+）
- 空间推理: 2篇（GR3D, Holi-Spatial）
- 视频理解: 1篇（Holi-Spatial）
- 机器人操作: 1篇（Exp-Force）
- 视觉语言模型: 1篇（FVG-PT）

**效率提升**:
- 训练时间: -26.8%（ImprovedGS+）
- 参数量: -38.4%（ImprovedGS+）
- 空间推理: +8%（GR3D）
- 力预测误差: 0.43N（Exp-Force）
- 参数量: 0.13M（FVG-PT）
- 基准规模: 1.3M+ QA（Holi-Spatial）

**关键技术突破**:
1. ⭐ **3DGS的C++/CUDA重实现**（ImprovedGS+）- 证明效率瓶颈在Python解释器
2. ⭐ **几何参考的MLLM空间推理**（GR3D）- 无需微调即可增强
3. ⭐ **统一视频流空间智能**（Holi-Spatial）- 从片段到整体的范式转变 🆕
4. ⭐ **经验条件化机器人操作**（Exp-Force）- 少量经验比大量数据重要
5. ⭐ **前景注意力引导**（FVG-PT）- 解决prompt tuning的注意力偏移

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 平均文档长度: 1,306行
- ✅ 全部达到500+行要求
- ⚠️ 4/5使用NotebookLM（1/5使用GLM WebReader备选方案）

---


## 2026-03-10 研究的论文（精选5篇）

1. **ACE-Brain-0: Spatial Intelligence as a Shared Scaffold for Universal Embodiments** - arXiv:2603.03198
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 空间智能, SSR范式, 跨具身, GRPO, 24个基准SOTA
   - 文档: papers/2026-03-10_01_ACE_Brain_0.md
   - NotebookLM: ae47fb99-b9e1-4f44-bc6f-c0ec2d686054
   - 核心贡献: 空间智能作为跨具身通用支架，Scaffold-Specialize-Reconcile范式

2. **Beyond Pixel Histories: World Models with Persistent 3D State** - arXiv:2603.03482
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: PERSIST范式, 持久3D状态, 空间记忆, 环境编辑
   - 文档: papers/2026-03-10_02_Beyond_Pixel_Histories.md
   - 分析方法: GLM WebReader (NotebookLM失败)
   - 核心贡献: latent 3D场景表示（environment + camera + renderer）

3. **3D-RFT: Reinforcement Fine-Tuning for Video-based 3D Scene Understanding** - arXiv:2603.04976
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D场景理解, 强化微调, RLVR, 3D-RFT-4B
   - 文档: papers/2026-03-10_03_3D_RFT.md
   - NotebookLM: 5b9dacc1-5c7a-489a-b393-ac0970162858
   - 核心贡献: RLVR增强LLM的3D场景理解能力

4. **PlaneCycle: Training-Free 2D-to-3D Lifting of Foundation Models Without Adapters** - arXiv:2603.04165
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 2D-to-3D提升, 训练自由, 正交平面循环, HW/DW/DH
   - 文档: papers/2026-03-10_04_PlaneCycle.md
   - NotebookLM: 748b21e3-cd15-4ded-bc9a-17b15aabda43
   - 核心贡献: 无需adapter的2D→3D提升，保留预训练归纳偏置

5. **SpatialText: A Pure-Text Cognitive Benchmark for Spatial Understanding in Large Language Models** - arXiv:2603.03002
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 空间推理, 纯文本基准, LLM认知能力, 构造空间表示
   - 文档: papers/2026-03-10_05_SpatialText.md
   - 分析方法: GLM WebReader (NotebookLM失败)
   - 核心贡献: 纯文本评估LLM的空间理解和构造能力

---



## 研究主题统计（2026-03-10）

**核心技术**:
- 空间智能作为支架: 2篇（ACE-Brain-0, PERSIST）
- 3D场景理解/表示: 2篇（3D-RFT, PlaneCycle）
- 空间推理能力: 1篇（SpatialText）

**应用领域**:
- 跨具身应用: 2篇（ACE-Brain-0, 3D-RFT）
- World Model: 1篇（PERSIST）
- Foundation Model提升: 1篇（PlaneCycle）
- LLM评估: 1篇（SpatialText）

**方法类别**:
- SSR范式: 1篇
- PERSIST范式: 1篇
- RLVR: 1篇
- 训练自由方法: 1篇
- 纯文本基准: 1篇

**关键技术突破**:
1. ⭐ **空间智能作为通用支架**（ACE-Brain-0）- SSR范式解决跨具身梯度干扰
2. ⭐ **持久3D世界模型**（PERSIST）- latent 3D场景表示
3. ⭐ **强化微调3D理解**（3D-RFT）- RLVR增强LLM的3D能力
4. ⭐ **训练自由的2D→3D提升**（PlaneCycle）- 无需adapter，保留预训练偏置
5. ⭐ **纯文本空间推理基准**（SpatialText）- LLM的空间理解和构造能力评估

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 平均文档长度: 1,269行
- ✅ 全部达到500+行要求
- ⚠️ 2/5使用NotebookLM（3/5使用GLM WebReader备选方案）

---

## 2026-03-23 研究的论文（精选5篇）✅

1. **Under One Sun: Multi-Object Generative Perception of Materials and Illumination** - arXiv:2603.19226v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 生成式感知、逆渲染、材料-光照解耦、多物体一致性、物理感知
   - 文档: papers/2026-03-23_01_Under_One_Sun.md
   - 核心发现: 共享光照约束、级联架构解耦、轴向注意力跨物体通信、材质纹理分离

2. **Bridging Semantic and Kinematic Conditions with Diffusion-based Discrete Motion Tokenizer** - arXiv:2603.19227v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 运动生成、离散token、语义-运动学桥接、扩散模型、机器人控制
   - 文档: papers/2026-03-23_02_Bridging_Semantic_Kinematic.md
   - 核心发现: 三阶段框架（感知-规划-控制）、扩散解码器恢复细节、单层token高效表示

3. **EffectErase: Joint Video Object Removal and Insertion for High-Quality Effect Erasing** - arXiv:2603.19224v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频对象移除、效应消除、逆向辅助任务、任务感知引导、一致性学习
   - 文档: papers/2026-03-23_03_EffectErase.md
   - 核心发现: VOR数据集（60K视频对）、插入-移除互补学习、效应区域定位

4. **Rethinking Vector Field Learning for Generative Segmentation** - arXiv:2603.19218v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 向量场学习、生成分割、场景理解、空间推理
   - 文档: papers/2026-03-23_04_Rethinking_Vector_Field.md
   - 核心发现: 向量场生成范式、空间结构建模、生成式分割方法

5. **LVOmniBench: Pioneering Long Audio-Video Understanding Evaluation for Omnimodal LLMs** - arXiv:2603.19217v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 长视频理解、全模态LLM、评估基准、时空推理、多模态融合
   - 文档: papers/2026-03-23_05_LVOmniBench.md
   - 核心发现: 长时全模态理解新问题、高质量评估基准、揭示当前模型局限

### 研究主题统计（2026-03-23）

**核心技术**:
- 材质光照解耦: 1篇（Under One Sun）
- 运动生成: 1篇（Bridging Semantic Kinematic）
- 视频对象移除: 1篇（EffectErase）
- 向量场学习: 1篇（Rethinking Vector Field）
- 长视频理解: 1篇（LVOmniBench）

**关键突破**:
- 多物体一致性理解（共享光照约束）
- 语义-运动学桥接（三阶段框架）
- 效应感知场景理解（插入-移除互补）
- 生成式分割新范式（向量场）
- 长时全模态理解（新基准）

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 平均文档长度: 1,518行
- ✅ 全部达到500+行要求
- ✅ EffectErase特别详细（2587行）

---

## 2026-03-24 研究的论文（精选5篇）✅

1. **IndoorR2X: Indoor Robot-to-Everything Coordination with LLM-Driven Planning** - arXiv:2603.20182v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多智能体协作、R2X感知融合、LLM规划、全局语义状态、IoT传感器
   - 文档: papers/2026-03-24_01_IndoorR2X.md
   - 核心发现: R2X协作范式、全局语义状态三元组、Video2Text转换、DAG并行规划

2. **EgoForge: Goal-Directed Egocentric World Simulator** - arXiv:2603.20169v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 世界模型、第一人称视角、VideoDiffusionNFT、几何弱监督、意图对齐
   - 文档: papers/2026-03-24_02_EgoForge.md
   - 核心发现: 极简静态输入、奖励引导精调、VGGT几何对齐、智能眼镜验证

3. **LagerNVS: Latent Geometry for Fully Neural Real-time Novel View Synthesis** - arXiv:2603.20176v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 潜几何、神经渲染、实时NVS、3D-aware编码器、Highway架构
   - 文档: papers/2026-03-24_03_LagerNVS.md
   - 核心发现: 绕过显式3D重建、光场编码、30+FPS实时渲染、O(V)复杂度

4. **The Robot's Inner Critic: Self-Refinement of Social Behaviors through VLM-based Replanning** - arXiv:2603.20164v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM评论、CRISP框架、社交行为、自主优化、RAS搜索
   - 文档: papers/2026-03-24_04_RobotInnerCritic.md
   - 核心发现: VLM作为社交评论家、低层级关节控制、视觉反馈循环、跨平台通用

5. **VideoSeek: Long-Horizon Video Agent with Tool-Guided Seeking** - arXiv:2603.20185v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 长时程视频、视频逻辑流、多粒度工具、Think-Act-Observe、主动搜索
   - 文档: papers/2026-03-24_05_VideoSeek.md
   - 核心发现: 1/300帧数SOTA、视频逻辑流、Overview/Skim/Focus工具、ReAct循环

### 研究主题统计（2026-03-24）

**核心技术**:
- 多智能体协作: 1篇（IndoorR2X）
- 世界建模: 1篇（EgoForge）
- 神经渲染: 1篇（LagerNVS）
- 社交行为: 1篇（RobotInnerCritic）
- 长时视频: 1篇（VideoSeek）

**关键突破**:
- R2X感知融合（IoT+机器人协作）
- 极简世界模拟（单张图像+指令）
- 潜几何渲染（不重建也能理解）
- VLM社交评论（自主行为优化）
- 视频逻辑流（1/300帧数SOTA）

**分析质量**:
- ✅ 5/5篇完成（100%）
- ✅ 平均文档长度: 695行
- ✅ 全部达到500+行要求
- ✅ IndoorR2X最详细（844行）

**主题演进**:
- 从单智能体理解 → 多智能体协作
- 从被动分析 → 主动搜索
- 从显式重建 → 隐式理解
- 从行为生成 → 行为优化

---

*最后更新: 2026-03-24 07:20*
