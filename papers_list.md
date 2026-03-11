
## 2026-03-11 研究的论文（精选4篇，缺少1篇）

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

4. **FVG-PT: Adaptive Foreground View-Guided Prompt Tuning for Vision-Language Models** - arXiv:2603.08708
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: VLM, prompt tuning, 注意力控制, 参数高效
   - 文档: papers/2026-03-11_05_FVG_PT.md
   - 代码: https://github.com/JREion/FVG-PT
   - 核心贡献: 前景注意力引导，参数0.13M，缓解base-new trade-off

5. **[待补充]** - arXiv:?
   - 相关性: ⚠️ 未生成
   - 说明: 第4篇论文未生成，可能原因：arXiv搜索未找到合适论文或执行中断

---

## 研究主题统计（2026-03-11）

**核心技术**:
- 3D表示效率: 1篇（ImprovedGS+）
- MLLM空间理解: 1篇（GR3D）
- 机器人操作: 1篇（Exp-Force）
- VLM注意力控制: 1篇（FVG-PT）

**应用领域**:
- 3D重建: 1篇（ImprovedGS+）
- 空间推理: 1篇（GR3D）
- 机器人操作: 1篇（Exp-Force）
- 视觉语言模型: 1篇（FVG-PT）

**效率提升**:
- 训练时间: -26.8%（ImprovedGS+）
- 参数量: -38.4%（ImprovedGS+）
- 空间推理: +8%（GR3D）
- 力预测误差: 0.43N（Exp-Force）
- 参数量: 0.13M（FVG-PT）

**关键技术突破**:
1. ⭐ **3DGS的C++/CUDA重实现**（ImprovedGS+）- 证明效率瓶颈在Python解释器
2. ⭐ **几何参考的MLLM空间推理**（GR3D）- 无需微调即可增强
3. ⭐ **经验条件化机器人操作**（Exp-Force）- 少量经验比大量数据重要
4. ⭐ **前景注意力引导**（FVG-PT）- 解决prompt tuning的注意力偏移

**分析质量**:
- ⚠️ 4/5篇完成（80%）
- ✅ 平均文档长度: 1,306行
- ✅ 全部达到500+行要求
- ⚠️ 3/4使用NotebookLM（1/4使用GLM WebReader备选方案）

---

# Spatial AGI 论文列表



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
