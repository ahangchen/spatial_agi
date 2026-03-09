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
