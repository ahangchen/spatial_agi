# Spatial AGI 论文列表

本文档记录了所有分析过的论文，按日期组织。

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

*最后更新: 2026-03-10 07:25*
