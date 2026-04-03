# Spatial AGI 论文列表

本文档记录了所有分析过的论文，按日期组织。

---

## 2026-03-31 研究的论文（精选5篇）✅

1. **3DGSNav: Enhancing VLM Reasoning for Object Navigation via 3D Gaussian Splatting** - arXiv:2602.12159v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D Gaussian Splatting, VLM, 零样本导航, 主动感知, CoT推理
   - 文档: papers/2026-03-31_3DGSNav.md
   - 核心发现: 3DGS作为持久记忆、自由视点优化、主动视点重验证、四足机器人实机验证

2. **From Human Cognition to Neural Activations: Probing Spatial Reasoning in LLMs** - arXiv:2603.26323v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 机制可解释性、空间推理原语、线性探测、稀疏自编码器、因果干预
   - 文档: papers/2026-03-31_LLM_Spatial_Reasoning_Mechanisms.md
   - 核心发现: 中间层空间信息峰值、末层表示急剧下降、跨任务表示碎片化、机制退化现象

3. **HiSpatial: Taming Hierarchical 3D Spatial Understanding in VLMs** - arXiv:2603.25411v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 层次化空间理解、RGB-D VLM、5M图像训练、2B QA对、CVPR 2026
   - 文档: papers/2026-03-31_HiSpatial.md
   - 核心发现: 四层空间智能框架、度量尺度点云输入、超越GPT-5/Gemini-2.5-pro、层次依赖验证

4. **VGGRPO: World-Consistent Video Generation with 4D Latent Reward** - arXiv:2603.26599v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视频生成、世界一致性、潜空间奖励、4D几何、GRPO
   - 文档: papers/2026-03-31_VGGRPO.md
   - 核心发现: Latent Geometry Model、避免RGB解码开销、动态场景支持、3x训练加速

5. **VideoWeaver: Multimodal Multi-View Video-to-Video Transfer** - arXiv:2603.25420v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多视角V2V、4D点云、Pi3、具身AI数据增强、自回归视角生成
   - 文档: papers/2026-03-31_VideoWeaver.md
   - 核心发现: 共享4D潜空间、MoE多模态融合、分解4D注意力、自回归视角扩展

### 研究主题统计（2026-03-31）

**核心技术**:
- 3D Gaussian Splatting: 1篇（3DGSNav）
- 机制可解释性: 1篇（LLM Spatial Reasoning）
- 层次化空间理解: 1篇（HiSpatial）
- 世界一致性生成: 1篇（VGGRPO）
- 多视角V2V: 1篇（VideoWeaver）

**关键突破**:
- **3DGS导航记忆**（3DGSNav）：主动感知构建3DGS表示，自由视点渲染增强VLM推理
- **空间表示分析**（LLM Mechanisms）：中间层R²=0.37，末层急剧下降，碎片化表示
- **层次化训练**（HiSpatial）：Level 0-3框架，2B QA对，超越GPT-5
- **潜空间几何**（VGGRPO）：无RGB解码，动态场景支持，3x加速
- **4D一致生成**（VideoWeaver）：Pi3点云统一潜空间，自回归视角生成

**应用领域**:
- 机器人导航: 1篇（3DGSNav）
- LLM分析: 1篇（LLM Mechanisms）
- VLM训练: 1篇（HiSpatial）
- 视频生成: 2篇（VGGRPO, VideoWeaver）

**方法创新**:
- 持久3D记忆: 1篇
- 线性探测+SAE: 1篇
- 层次化数据: 1篇
- 潜空间奖励: 1篇
- 4D共享潜空间: 1篇

**核心洞察**:
- **3D表示 > 2D抽象**：保持几何连续性，避免语义离散化
- **层次依赖**：低层任务是高层能力的基石
- **机制退化**：相似行为可源于不同内部路径
- **潜空间训练**：避免RGB解码，提升效率

---

## 2026-03-27 研究的论文（精选5篇）✅

1. **DreamerAD: Efficient Reinforcement Learning via Latent World Model for Autonomous Driving** - arXiv:2603.24587v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 潜在世界模型、强化学习、自动驾驶、视频扩散、密集奖励
   - 文档: papers/2026-03-27_01_DreamerAD.md
   - 核心发现: 80倍加速、潜在空间RL训练、自回归密集奖励模型、高斯词汇采样约束

2. **Latent-WAM: Latent World Action Modeling for End-to-End Autonomous Driving** - arXiv:2603.24581v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 端到端自动驾驶、空间感知压缩、动态潜在世界、几何知识蒸馏
   - 文档: papers/2026-03-27_latent_wam.md
   - 核心发现: 89.3 EPDMS新SOTA、SCWE空间感知压缩、DLWM动态世界建模、104M参数超越基线3.2分

3. **LightSplat: Fast and Memory-Efficient Open-Vocabulary 3D Scene Understanding in Five Seconds** - arXiv:2603.24146v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D高斯泼溅、开放词汇理解、索引-特征映射、无训练框架
   - 文档: papers/2026-03-27_03_lightsplat.md
   - 核心发现: 50-400倍速度提升、64倍内存降低、5秒特征蒸馏、2字节索引替代高维特征

4. **GameplayQA: A Benchmarking Framework for Decision-Dense POV-Synced Multi-Video Understanding of 3D Virtual Agents** - arXiv:2603.24329v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多模态LLM、3D虚拟代理、Self-Other-World分解、密集决策、多视频理解
   - 文档: papers/2026-03-27_04_gameplayqa_benchmark.md
   - 核心发现: 1.22标签/秒高密度标注、三方实体分解、2.4K诊断性QA、结构化干扰项分类

5. **Chameleon: Episodic Memory for Long-Horizon Robotic Manipulation** - arXiv:2603.24576v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 情景记忆、长时程操作、感知混淆、目标导向检索、几何基础去歧义
   - 文档: papers/2026-03-27_05_chameleon_episodic_memory.md
   - 核心发现: 感知混淆解决方案、模式分离+模式完成、HoloHead可微分检索、跨任务零样本泛化

### 研究主题统计（2026-03-27）

**核心技术**:
- 潜在世界模型: 2篇（DreamerAD, Latent-WAM）
- 3D场景理解: 1篇（LightSplat）
- 具身智能评估: 1篇（GameplayQA）
- 长时程记忆: 1篇（Chameleon）

**关键突破**:
- **80倍RL加速**（DreamerAD）：在潜在空间训练，100步扩散→1步
- **空间感知压缩**（Latent-WAM）：从几何基础模型蒸馏，16个场景令牌替代数千patch
- **极致效率**（LightSplat）：2字节索引替代512维特征，5秒完成特征蒸馏
- **三方分解**（GameplayQA）：Self-Other-World系统化具身感知评估
- **情景记忆**（Chameleon）：生物学启发的模式分离+模式完成，解决感知混淆

**应用领域**:
- 自动驾驶: 2篇（DreamerAD, Latent-WAM）
- 机器人操作: 2篇（GameplayQA, Chameleon）
- 3D理解: 1篇（LightSplat）

**方法创新**:
- 潜在空间训练: 2篇
- 索引化表示: 1篇
- 分解式评估: 1篇
- 生物学启发: 1篇

**性能指标**:
- 速度提升: 50-400x（LightSplat）
- 内存降低: 64x（LightSplat）
- 准确率: 89.3 EPDMS（Latent-WAM）
- 标注密度: 1.22 labels/秒（GameplayQA）

---

## 2026-03-26 研究的论文（精选5篇）✅

1. **UniFunc3D: Unified Active Spatial-Temporal Grounding for 3D Functionality Segmentation** - arXiv:2603.23478v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D功能分割、主动时空接地、统一MLLM、从粗到精、视觉掩码验证
   - 文档: papers/2026-03-26_01_UniFunc3D.md
   - NotebookLM: 42114d2c-0ed9-459c-b311-83c5e1702de6
   - 核心发现: 训练-free框架、主动巡视视频、59.9% mIoU提升、闭环推理验证

2. **VTAM: Video-Tactile-Action Models for Complex Physical Interaction Beyond VLAs** - arXiv:2603.23481v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视触觉动作模型、世界模型、触觉正则化、接触密集型任务、物理交互
   - 文档: papers/2026-03-26_02_VTAM.md
   - NotebookLM: 398eac5e-09ba-4123-9955-4e48ebfd37ca
   - 核心发现: 触觉作为世界模型内在组成、变形感知虚拟力、90%成功率、80%超越pi 0.5

3. **3DCity-LLM: Empowering Multi-modality Large Language Models for 3D City-scale Perception and Understanding** - arXiv:2603.23447v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D城市理解、120万样本数据集、从粗到细编码、空间推理、城市智能
   - 文档: papers/2026-03-26_03_3DCity_LLM.md
   - 分析方法: 基于HTML版本深度分析
   - 核心发现: 3分支并行编码、7类任务分类、BLEU-4提升8.40、城市规模理解突破

4. **OccAny: Generalized Unconstrained Urban 3D Occupancy** - arXiv:2603.23502v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 无约束3D occupancy、零样本泛化、语义强制策略、几何补全、城市场景
   - 文档: papers/2026-03-26_04_OccAny.md
   - NotebookLM: f4fbcca9-6cdf-4796-8b33-1f876b9b22b2
   - 核心发现: 无需传感器标定、SAM2特征约束、新视角渲染、几何-语义耦合

5. **Foveated Diffusion: Efficient Spatially Adaptive Image and Video Generation** - arXiv:2603.23491v1
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 空间自适应生成、中央凹机制、混合分辨率Token、效率优化、眼动跟踪
   - 文档: papers/2026-03-26_05_Foveated_Diffusion.md
   - 核心发现: 非均匀Token分配、感知质量无损、大幅降低计算量、人眼视觉机制启发

### 研究主题统计（2026-03-26）

**核心技术**:
- 3D场景理解: 3篇（UniFunc3D, 3DCity-LLM, OccAny）
- 多模态融合: 2篇（VTAM, Foveated Diffusion）
- 空间智能: 4篇（UniFunc3D, 3DCity-LLM, OccAny, Foveated Diffusion）
- 具身智能: 2篇（UniFunc3D, VTAM）

**关键突破**:
- 主动时空接地：MLLM主动巡视视频，消除视觉盲区
- 触觉世界模型：触觉作为预测性框架内在组成，实现精确力控制
- 城市规模理解：120万样本数据集，7类任务系统分类
- 无约束occupancy：零样本泛化到任意传感器配置
- 空间自适应生成：中央凹启发机制，大幅提升生成效率

---

## 2026-03-25 研究的论文（精选6篇）✅

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

6. **LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels** - arXiv:2603.19312v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 极简世界模型、SIGReg正则化、反崩溃保证、端到端训练、物理涌现
   - 文档: papers/2026-03-25_06_leworldmodel_stable_jepa.md
   - 分析方法: GLM WebReader深度精读
   - 核心发现: 仅2项损失稳定训练、48倍规划加速、物理直觉涌现、15M参数单GPU训练

### 研究主题统计（2026-03-25）

**核心技术**:
- 多模态统一: 1篇（UniMotion）
- 世界模型: 2篇（ThinkJEPA, LeWorldModel）
- 并行推理: 1篇（DualCoT-VLA）
- 机制理解: 1篇（Dual Mechanisms）
- 空间编辑: 1篇（3D-Layout-R1）

**关键突破**:
- 连续表示范式：运动作为一等公民，优于离散Tokenization
- 双路径世界模型：密集JEPA+VLM思考者，长程稳定预测
- 极简世界模型：2项损失实现稳定训练，48倍加速
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

## 2026-03-28 研究的论文（7篇）✅

### 3D Gaussian Splatting（3篇）

1. **LGTM: Less Gaussians, Texture More: 4K Feed-Forward Textured Splatting** - arXiv:2603.25745v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4K分辨率、几何-纹理解耦、纹理化高斯、前馈网络、实时渲染
   - 文档: papers/2026-03-28_01_lgtm.md
   - 核心发现: 几何-纹理解耦实现64×像素提升仅1.47×时间、紧凑高斯+纹理基元、前馈4K NVS无优化

2. **ViewSplat: View-Adaptive Dynamic Gaussian Splatting for Feed-Forward Synthesis** - arXiv:2603.25265v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 视图自适应、动态高斯、Hypernetwork、残差学习、实时渲染
   - 文档: papers/2026-03-28_02_viewsplat.md
   - 核心发现: MLP预测视图依赖残差更新、PSNR 26.798、154 FPS实时、动态基元适配

3. **AirSplat: Alignment and Rating for Robust Feed-Forward 3D Gaussian Splatting** - arXiv:2603.25129v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 无姿态NVS、SCPA自洽对齐、ROM不透明度匹配、3DVFMs、零样本泛化
   - 文档: papers/2026-03-28_03_airsplat.md
   - 核心发现: 零样本PSNR +3.11dB、像素对齐监督、评分过滤退化基元、无姿态重建

### 自动驾驶与个性化（2篇）

4. **Vega: Learning to Drive with Natural Language Instructions** - arXiv:2603.25741v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 指令驾驶、混合自回归-扩散、MoT架构、世界建模、NAVSIM SOTA
   - 文档: papers/2026-03-28_vega_instructional_driving.md
   - 核心发现: NAVSIM v2 EPDMS 89.4第一、指令-动作-图像一致性约束、未来图像预测+2.7 PDMS

5. **Drive My Way: Preference Alignment of VLA Model for Personalized Driving** - arXiv:2603.25740v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 个性化VLA、用户嵌入、风格感知奖励、残差解码器、自然语言指令
   - 文档: papers/2026-03-28_02_drive_my_way.md
   - 核心发现: 激进指令效率+18.77%、用户嵌入编码偏好、PDD数据集（30驾驶员）、零样本泛化

### 记忆与知识系统（2篇）

6. **WriteBack-RAG: Training the Knowledge Base through Evidence Distillation and Write-Back Enrichment** - arXiv:2603.25737v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 知识库训练、证据蒸馏、回写增强、跨方法迁移、RAG优化
   - 文档: papers/2026-03-28_03_writeback_rag.md
   - 核心发现: 平均+2.14%性能提升、成功检索→证据蒸馏→回写增强、跨方法知识单元迁移

7. **PackForcing: Short Video Training Suffices for Long Video Sampling and Long Context Inference** - arXiv:2603.25730v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 长视频生成、三分区KV缓存、双分支压缩、动态上下文选择、自回归扩散
   - 文档: papers/2026-03-28_04_PackForcing_Short_Video_Training_Long_Video.md
   - 核心发现: Sink锚点防止语义漂移、约32倍压缩Mid tokens、KV缓存约束4GB、24倍时间泛化（5秒→120秒）

### 研究主题统计（2026-03-28）

**核心技术**:
- 3D Gaussian Splatting: 3篇（LGTM, ViewSplat, AirSplat）
- 自动驾驶: 2篇（Vega, Drive My Way）
- 记忆/知识系统: 2篇（WriteBack-RAG, PackForcing）

**关键突破**:

**3DGS方向**:
- **4K纹理化解耦**（LGTM）：几何-纹理解耦，64×像素提升仅1.47×时间
- **视图自适应动态**（ViewSplat）：Hypernetwork预测残差，154 FPS实时渲染
- **无姿态鲁棒重建**（AirSplat）：SCPA自洽对齐 + ROM评分过滤，零样本+3.11dB

**自动驾驶方向**:
- **指令驱动范式**（Vega）：混合自回归-扩散 + 世界建模，NAVSIM v2第一
- **个性化对齐**（Drive My Way）：用户嵌入 + 风格感知奖励，效率+18.77%

**记忆系统方向**:
- **知识库可训练**（WriteBack-RAG）：证据蒸馏 + 回写增强，跨方法+2.14%
- **三分区KV缓存**（PackForcing）：Sink/Mid/Recent分区，24倍时间泛化

**对Spatial AGI的启发**:
- **表示层**：几何-纹理解耦（LGTM）→ 视图自适应（ViewSplat）→ 无姿态鲁棒（AirSplat）
- **个性化层**：用户嵌入编码偏好，自然语言作为空间交互接口
- **记忆层**：三分区架构（Sink长期/Mid情节/Recent工作）+ 知识库可训练
- **泛化性**：短期经验可泛化到长期任务（24倍时间泛化）

**应用领域**:
- 3D重建与渲染: 3篇
- 自动驾驶: 2篇
- RAG系统: 1篇
- 长视频生成: 1篇

**方法创新**:
- 解耦表示: 2篇（几何-纹理、静态-动态）
- 自适应机制: 2篇（视图自适应、个性化适配）
- 训练-free/高效: 3篇（无姿态、无优化、短训练长泛化）

---

## 2026-03-29 研究的论文（精选5篇）✅

1. **LGTM: Less Gaussians, Texture More: 4K Feed-Forward Textured Splatting** - arXiv:2603.25745v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4K分辨率、几何-纹理解耦、纹理化高斯、前馈网络、实时渲染
   - 文档: papers/2026-03-29_01_lgtm_less_gaussians_texture_more.md
   - 核心发现: 几何-纹理解耦实现64×像素提升仅1.47×时间开销、紧凑高斯+纹理基元、首个前馈4K NVS无per-scene优化

2. **AirVLA: π, But Make It Fly: Physics-Guided Transfer of VLA Models to Aerial Manipulation** - arXiv:2603.25038v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 物理引导迁移、负载感知引导、Payload-Aware Guidance、空中操作、VLA迁移
   - 文档: papers/2026-03-29_02_airvla_aerial_manipulation.md
   - 核心发现: Payload-Aware Guidance在flow-matching采样中注入物理约束、负载置信度补偿下垂、零样本从固定基座迁移到飞行平台

3. **GaussFusion: Improving 3D Reconstruction in the Wild with A Geometry-Informed Video Generator** - arXiv:2603.25053v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 几何引导视频生成、GP-Buffer、伪影修复、跨范式泛化、16 FPS实时推理
   - 文档: papers/2026-03-29_03_GaussFusion.md
   - 核心发现: GP-Buffer编码深度/法线/透明度/协方差、Geometry Adapter注入几何特征、同时处理优化based和前馈重建管线

4. **PhotoAgent: A Robotic Photographer with Spatial and Aesthetic Understanding** - arXiv:2603.22796v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS世界模型、心智模拟、锚点假设、视觉反思、美学推理
   - 文档: papers/2026-03-29_04_photoagent.md
   - 核心发现: LMM CoT将主观美学转化为几何约束、3DGS视觉反思实现心智模拟、迭代优化替代物理试错

5. **SNOW: Spatio-Temporal Scene Understanding with World Knowledge for Open-World Embodied Reasoning** - arXiv:2512.16461v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D场景理解、STEP编码、训练无关框架、可查询4DSG、VLM语义
   - 文档: papers/2026-03-29_05_SNOW_4D_Scene_Understanding.md
   - 核心发现: 训练无关框架、STEP多模态token编码、HDBSCAN聚类+SAM2分割、可查询4D场景图

### 研究主题统计（2026-03-29）

**核心技术**:
- 3DGS表示: 2篇（LGTM, GaussFusion）
- 具身智能: 2篇（AirVLA, PhotoAgent）
- 4D场景理解: 1篇（SNOW）

**关键突破**:
- **几何-纹理解耦**（LGTM）：64×像素提升仅1.47×时间，4K前馈无优化
- **物理引导迁移**（AirVLA）：Payload-Aware Guidance补偿负载下垂，VLA零样本迁移到飞行平台
- **几何引导生成**（GaussFusion）：GP-Buffer提供深度/法线/透明度/协方差条件，跨范式泛化
- **心智模拟**（PhotoAgent）：3DGS世界模型实现视觉反思，LMM美学转几何约束
- **统一4D理解**（SNOW）：STEP编码多模态token，训练无关构建可查询4D场景图

**应用领域**:
- 3D重建与渲染: 2篇（LGTM, GaussFusion）
- 机器人操作: 2篇（AirVLA, PhotoAgent）
- 场景理解: 1篇（SNOW）

**方法创新**:
- 解耦表示: 2篇（几何-纹理、语义-几何）
- 物理引导: 1篇（Payload-Aware Guidance）
- 世界模型: 2篇（3DGS心智模拟、4D场景图）

**对Spatial AGI的启发**:
- **表示层**：几何-纹理解耦（LGTM）实现高效4K表示，几何引导（GaussFusion）修复伪影
- **迁移层**：VLA物理引导迁移（AirVLA）扩展具身能力到飞行平台
- **推理层**：3DGS心智模拟（PhotoAgent）将美学意图转化为几何控制
- **理解层**：统一4D场景图（SNOW）集成VLM语义与时空几何

---

## 2026-03-30 研究的论文（精选5篇）✅

1. **Kinema4D: Kinematic 4D World Modeling for Spatiotemporal Embodied Simulation** - arXiv:2603.16669
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D世界建模、运动学控制、点图表示、Robo4D-200k、embodiment-agnostic
   - 文档: papers/2026-03-30_01_Kinema4D.md
   - 核心发现: 运动学控制+生成建模解耦架构、4D点图作为控制表示、201,426 episode数据集、零-shot OOD评估

2. **ST-VLA: Enabling 4D-Aware Spatiotemporal Understanding for General Robot Manipulation** - arXiv:2603.13788
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D感知VLA、统一3D-4D表示、平滑空间掩码、ST-Human数据集、零样本泛化
   - 文档: papers/2026-03-30_02_ST_VLA.md
   - 核心发现: 统一3D-4D中间表示𝒵、锚定深度+相对偏移3D提升、300k人类episodes、零样本+44.6%

3. **Holi-Spatial: Evolving Video Streams into Holistic 3D Spatial Intelligence** - arXiv:2603.07660
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 自动化数据管道、3DGS优化、开放词汇标注、VLM Agent验证、Holi-Spatial-4M
   - 文档: papers/2026-03-30_03_Holi_Spatial.md
   - 核心发现: 完全自动化空间标注、4M+高质量标注、三级置信度过滤、深度F1=0.89、3D检测AP50=70.05

4. **Thinking in Dynamics: How Multimodal Large Language Models Perceive, Track, and Reason Dynamics in Physical 4D World** - arXiv:2603.12746
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Dyn-Bench基准、4D动态推理、ST-TCM时空文本化、时空不一致性、Mask-Guided Fusion
   - 文档: papers/2026-03-30_04_Thinking_in_Dynamics.md
   - 核心发现: 1,000动态视频+7,000 VQA、ST-TCM提升8-15%、时空不一致性根本问题、Motion+Spatial关键组合

5. **3DGSNav: Enhancing Vision-Language Model Reasoning for Object Navigation via Active 3D Gaussian Splatting** - arXiv:2603.XXXXX
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3DGS持久化内存、主动感知、VLM空间推理、零样本目标导航、增量式场景构建
   - 文档: papers/2026-03-30_05_3DGSNav.md
   - 核心发现: 3DGS作为VLM内存、信息增益最大化主动感知、模块化集成架构、开放词汇导航

### 研究主题统计（2026-03-30）

**核心技术**:
- 4D时空建模: 3篇（Kinema4D, ST-VLA, Thinking in Dynamics）
- 空间数据/基准: 2篇（Holi-Spatial, Thinking in Dynamics）
- 3DGS应用: 2篇（Holi-Spatial, 3DGSNav）
- VLA系统: 2篇（ST-VLA, 3DGSNav）

**关键突破**:
- **4D世界建模**（Kinema4D）：运动学确定性+生成式灵活性的解耦设计，4D点图作为统一表示
- **4D感知VLA**（ST-VLA）：统一3D-4D中间表示𝒵，零样本+44.6%成功率提升
- **自动化数据飞轮**（Holi-Spatial）：完全自动化标注超越人工质量，4M+标注开启数据飞轮
- **4D动态评测**（Thinking in Dynamics）：Dyn-Bench定义4D推理标准，ST-TCM结构化提示+8-15%
- **3DGS内存导航**（3DGSNav）：3DGS作为VLM持久化内存，主动感知提升零样本导航

**应用领域**:
- 机器人操控: 2篇（Kinema4D, ST-VLA）
- 场景理解/重建: 2篇（Holi-Spatial, 3DGSNav）
- 评测基准: 1篇（Thinking in Dynamics）

**方法创新**:
- 解耦设计: 2篇（确定性控制vs生成响应、语义vs执行）
- 数据自动化: 1篇（VLM Agent验证）
- 结构化提示: 1篇（ST-TCM时空文本化）
- 主动感知: 2篇（信息增益最大化、视角选择）

**对Spatial AGI的启发**:
- **表示层**：4D点图（Kinema4D）+ 3D-4D统一表示（ST-VLA）→ 时空一致的基础
- **数据层**：自动化管道（Holi-Spatial）开启数据飞轮 → 持续扩展训练数据
- **评测层**：Dyn-Bench（Thinking in Dynamics）定义4D推理标准 → 明确技术瓶颈
- **应用层**：3DGS内存（3DGSNav）→ 高效空间存储与查询，主动感知增强决策

**性能指标**:
- 数据规模: 201,426 episode（Kinema4D）, 300k episodes（ST-VLA）, 4M+标注（Holi-Spatial）
- 零样本提升: +44.6%（ST-VLA）, +30.3%真实世界（ST-VLA）
- 深度质量: F1=0.89（Holi-Spatial）
- 3D检测: AP50=70.05（Holi-Spatial）
- 4D推理: ST-TCM +8-15%（Thinking in Dynamics）

---

## 2026-04-01 研究的论文（精选5篇）✅

1. **Geometry-aware Similarity Metrics for Neural Representations on Riemannian and Statistical Manifolds** - arXiv:2603.28764v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 黎曼几何, Pullback度量, 谱比率, 表示相似性, 内在几何
   - 文档: papers/2026-04-01_01_geometry_aware_similarity_metrics.md
   - 核心发现: MSA框架通过比较内在几何（非外在嵌入）区分rich/lazy学习、跨架构动态比较、扩散模型Fisher信息几何分析；谱比率d_SR∈[0,1]有界距离函数

2. **On-the-fly Repulsion in the Contextual Space for Rich Diversity in Diffusion Transformers** - arXiv:2603.28762
   - 相关性: ⭐⭐⭐⭐
   - 关键词: DiT上下文空间, 即时排斥, Vendi Score, 扩散模型多样性, SIGGRAPH 2026
   - 文档: papers/2026-04-01_02_contextual_repulsion_diffusion_transformers.md
   - 核心发现: 发现DiT MM-Attention中的"上下文空间"作为语义-空间解耦的黄金干预点；即时排斥无需反向传播、零额外内存、兼容Turbo蒸馏模型

3. **SonoWorld: From One Image to a 3D Audio-Visual Scene** - arXiv:2603.28757
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D音视频场景, Ambisonics空间声场, VLM语义锚定, training-free, CVPR 2026
   - 文档: papers/2026-04-01_03_SonoWorld_From_One_Image_to_a_3D_Audio_Visual_Scene.md
   - 核心发现: 首个Image2AVScene任务；异构声源建模（点/面/环境）；可微分Ambisonics渲染器<1ms延迟；SonoScene360数据集，DOA误差降低47%

4. **FocusVLA: Focused Visual Utilization for Vision-Language-Action Models** - arXiv:2603.28740v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA模型, 模态级联注意力, 焦点注意力, 视觉利用效率, 具身智能
   - 文档: papers/2026-04-01_04_FocusVLA.md
   - 核心发现: "利用>编码"范式转移——0.5B参数超越7B模型；结构捷径消除；Patch级TopK+Channel级门控双层焦点；LIBERO均分98.7%，空间任务99.6%，收敛加速5x

5. **ToLL: Topological Layout Learning with Structural Multi-view Augmentation for 3D Scene Graph Pretraining** - arXiv:2603.28178v1
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D场景图, 拓扑布局恢复, 几何捷径, 信息瓶颈, 结构化多视图增强
   - 文档: papers/2026-04-01_05_ToLL_Topological_Layout_Learning.md
   - 核心发现: 发现并解决3DSG预训练中的"几何捷径"问题；单锚点信息瓶颈强制拓扑推理；拓扑扰动优于几何变换；零样本三元组A@50: 38.64

### 研究主题统计（2026-04-01）

**核心技术**:
- 黎曼几何表示分析: 1篇（Geometry-aware Metrics）
- 扩散模型生成多样性: 1篇（Contextual Repulsion）
- 多模态空间生成: 1篇（SonoWorld）
- VLA视觉利用: 1篇（FocusVLA）
- 3D场景图预训练: 1篇（ToLL）

**关键突破**:
- **内在几何分析**（Geometry-aware Metrics）：首个基于黎曼几何的表示相似性度量，区分rich/lazy学习
- **上下文空间发现**（Contextual Repulsion）：DiT内部语义-空间解耦的黄金干预点
- **3D音视频联合生成**（SonoWorld）：从单张图像生成可导航3D场景+空间声场
- **"利用>编码"范式**（FocusVLA）：0.5B超越7B，视觉利用效率是VLA核心瓶颈
- **拓扑驱动空间推理**（ToLL）：信息瓶颈消除几何捷径，强制模型从关系学习空间

**对Spatial AGI的启发**:
- **分析层**：内在几何（论文1）提供空间表示评估的理论工具
- **生成层**：上下文空间排斥（论文2）启示多层次空间表示的设计
- **感知层**：多模态空间理解（论文3）扩展空间智能到听觉维度
- **利用层**：聚焦注意力（论文4）证明空间信息利用与编码同等重要
- **推理层**：拓扑推理（论文5）从关系出发推导几何，类人空间认知范式

**应用领域**:
- 空间表示分析: 1篇
- 图像生成: 1篇
- 3D场景理解: 2篇（SonoWorld, ToLL）
- 具身智能: 2篇（FocusVLA, ToLL）

---

*最后更新: 2026-04-01 10:11*

## 2026-04-02 研究的论文（精选5篇）

1. **SOLE-R1: Video-Language Reasoning as the Sole Reward for On-Robot Reinforcement Learning** - arXiv:2603.28730
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 强化学习, 视频语言推理, 奖励建模, 机器人
   - 文档: papers/2026-04-02_01_SOLE-R1_Video-Language_Reasoning_Reward.md
   - 核心发现: 用视频语言推理作为唯一的奖励信号训练机器人策略，无需手动设计奖励函数

2. **SonoWorld: From One Image to a 3D Audio-Visual Scene** - arXiv:2603.28757
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D场景生成, 空间声场, 多模态, 单图重建
   - 文档: papers/2026-04-02_02_SonoWorld.md
   - 核心发现: 从单张图像生成可导航的3D场景+空间声场，扩展空间智能到听觉维度

3. **DIAL: Decoupling Intent and Action via Latent World Modeling for End-to-End VLA** - arXiv:2603.29844
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLA, 世界模型, 潜在意图, System-1/System-2, 具身AI
   - 文档: papers/2026-04-02_03_DIAL_Latent_World_Modeling_VLA.md
   - 核心发现: 通过潜在视觉前瞻作为结构瓶颈，实现VLM从被动编码器到主动决策者的转变

4. **Extend3D: Town-Scale 3D Generation** - arXiv:2603.29387
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D场景生成, 潜在空间扩展, under-noising, 无训练pipeline
   - 文档: papers/2026-04-02_04_Extend3D_Town_Scale_3D_Generation.md
   - 核心发现: 将物体级3D生成模型扩展到城镇级场景，under-noising将遮挡视为噪声进行3D补全

5. **SceneTeract: Agentic Functional Affordances and VLM Grounding in 3D Scenes** - arXiv:2603.29798
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 功能可供性, VLM评估, 空间验证, 具身AI, 几何推理
   - 文档: papers/2026-04-02_05_SceneTeract_Functional_Affordances_VLM.md
   - 核心发现: 揭示VLM语义信心与物理可行性的系统性不匹配，验证驱动的方法将几何约束蒸馏到推理模型

### 今日主题：VLM空间智能的边界与桥梁

**核心观察**:
- **VLM的角色正在分化**：从被动编码器（FocusVLA 4/1）→ 主动决策者（DIAL 4/2），但需要外部约束
- **世界建模作为统一框架**：潜在世界建模（DIAL）和功能验证引擎（SceneTeract）分别从生成和评估两端使用世界模型
- **3D场景生成的扩展趋势**：从物体级（Trellis）→ 城镇级（Extend3D），但功能验证仍是瓶颈
- **多模态空间智能**：视觉+语言（DIAL）→ 视觉+语言+听觉（SonoWorld），空间智能正在超越纯视觉

**对Spatial AGI的启发**:
- **决策层**：潜在意图瓶颈（DIAL）确保VLM的空间决策被严格约束
- **评估层**：功能可供性验证（SceneTeract）揭示了VLM空间推理的系统性缺陷
- **生成层**：under-noising（Extend3D）提供了一种利用生成先验进行空间补全的新范式
- **感知层**：视频语言推理奖励（SOLE-R1）展示了多模态信号作为训练信号的潜力
- **表示层**：潜在空间扩展（Extend3D）启示层次化空间表示的设计

**应用领域**:
- 具身AI系统: 3篇（DIAL, SOLE-R1, SceneTeract）
- 3D场景理解/生成: 2篇（Extend3D, SonoWorld）
- VLM空间推理: 3篇（DIAL, SceneTeract, SOLE-R1）

---

*最后更新: 2026-04-02*

## 2026-04-03 研究的论文（精选5篇）

1. **EgoSim: Egocentric World Simulator for Embodied Interaction Generation** - arXiv:2604.01001
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 世界模型, 自我中心视觉, 具身交互, 3D场景更新, 跨具身迁移
   - 文档: papers/2026-04-03_EgoSim_Egocentric_World_Simulator.md

2. **Think, Act, Build: Agentic Framework with VLMs for Zero-Shot 3D Visual Grounding** - arXiv:2604.00528
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 3D视觉定位, Agent框架, VLM, 语义几何协同, 多视角重建
   - 文档: papers/2026-04-03_TAB_Agent_3D_Visual_Grounding.md

3. **Coko-SLAM: Compact Keyframe-Optimized Multi-Agent Gaussian Splatting SLAM** - arXiv:2604.00804
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 多Agent SLAM, 3DGS, 高斯压缩, 闭环检测, 带宽优化
   - 文档: papers/2026-04-03_CokoSLAM_Multi_Agent_GS_Slam.md

4. **DLWM: Dual Latent World Models for Holistic Gaussian-centric Pre-training** - arXiv:2604.00969
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 自动驾驶, Gaussian-centric, 世界模型, 预训练, CVPR2026
   - 文档: papers/2026-04-03_DLWM_Dual_Latent_World_Models.md

5. **Octree Diffusion for Semantic Scene Generation and Completion** - arXiv:2509.16483
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 八叉树扩散, 场景生成, 语义补全, 跨域泛化, ICRA2026
   - 文档: papers/2026-04-03_Octree_Diffusion_Semantic_Scene.md

## 2026-04-04 研究的论文（精选5篇）

1. **A3R: Agentic Affordance Reasoning via Cross-Dimensional Evidence in 3D Gaussian Scenes** - arXiv:2604.01882
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: Affordance reasoning, 3D Gaussian Splatting, Active perception, POMDP, GRPO
   - 文档: papers/2026-04-04_01_A3R_Agentic_Affordance_Reasoning.md

2. **LivingWorld: Interactive 4D World Generation with Environmental Dynamics** - arXiv:2604.01641
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: 4D world generation, Eulerian motion field, Gaussian splatting, hash-based motion field, bidirectional propagation
   - 文档: papers/2026-04-04_02_LivingWorld_4D_World_Generation.md

3. **World Action Verifier: Self-Improving World Models via Forward-Inverse Asymmetry** - arXiv:2604.01985
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: World models, Self-improvement, Forward-inverse asymmetry, Inverse dynamics, Active exploration
   - 文档: papers/2026-04-04_03_WAV_World_Action_Verifier.md

4. **Generative World Renderer** - arXiv:2604.02329
   - 相关性: ⭐⭐⭐⭐
   - 关键词: G-buffer dataset, AAA game data, inverse rendering, forward rendering, VLM evaluation
   - 文档: papers/2026-04-04_04_Generative_World_Renderer.md

5. **Omni123: Exploring 3D Native Foundation Models with Limited 3D Data by Unifying Text to 2D and 3D Generation** - arXiv:2604.02289
   - 相关性: ⭐⭐⭐⭐
   - 关键词: 3D foundation model, unified tokenization, interleaved training, cross-modal consistency, autoregressive
   - 文档: papers/2026-04-04_05_Omni123_3D_Foundation_Model.md
