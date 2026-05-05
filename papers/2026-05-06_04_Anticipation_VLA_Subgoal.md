# Anticipation-VLA: Solving Long-Horizon Embodied Tasks via Anticipation-based Subgoal Generation

**arXiv**: 2605.01772
**日期**: 2026-05-03
**机构**: Unknown (Chinese research group)
**作者**: Zhilong Zhang, Wenyu Luo, Haonan Wang, Yifei Sheng, Yidi Wang, Hanyuan Guo, Haoxiang Ren, Xinghao Du, Yuhan Che, Tongtong Cao, Lei Yuan, Yang Yu

---

## 核心摘要

Anticipation-VLA提出Anticipation Model，自适应递归生成未来子目标，解决VLA模型在长时序任务中的累积误差问题。基于Anticipation Model构建分层VLA架构：高层子目标生成（UMM微调）+ 低层目标条件VLA策略执行。实验证明在仿真和真实世界机器人任务中的有效性。

---

## Q1: 核心算法原理

### 1. 核心思想和动机

现有VLA模型在长时序任务中面临**累积误差**问题：
- 先前方法将任务分解为固定粒度的子任务，无法适应执行状态的复杂度变化
- 每一步的微小误差在长时序中不断累积，导致任务失败

Anticipation-VLA的核心创新：**自适应、递归的子目标生成**
- 不是预先规划所有子目标，而是随着任务执行动态调整
- 子目标的粒度根据当前状态复杂度自适应变化
- 递归机制允许在执行失败时重新规划

### 2. 主要技术方法

#### 2.1 Anticipation Model

- 输入：当前观测 + 语言指令 + 历史子目标
- 输出：下一个视觉子目标（goal image）
- 特点：
  - **自适应**：根据执行状态调整子目标粒度
  - **递归**：持续生成，随任务进展调整
  - **动态**：响应执行中的变化和偏差

#### 2.2 分层VLA架构

- **高层**：Unified Multimodal Model (UMM) 微调用于子目标生成
- **低层**：Goal-conditioned VLA policy 执行具体动作
- 两层协同：高层提供方向，低层精确执行

#### 2.3 训练策略

- UMM使用子目标数据微调
- VLA policy使用goal-conditioned训练
- 两层独立训练，推理时协同

### 3. 算法流程

```
输入：语言指令 + 当前视觉观测
  ↓
Anticipation Model (UMM) → 生成视觉子目标
  ↓
Goal-conditioned VLA Policy → 执行动作
  ↓
观测更新 → Anticipation Model评估进度
  ↓
（如需调整）→ 重新生成子目标
  ↓
循环直到任务完成
```

### 4. 输入输出

- **输入**：自然语言指令 + 视觉观测流
- **输出**：机器人动作序列 + 自适应子目标

---

## Q2: 与Spatial AGI的关系

### 1. 空间理解和表示

- **视觉子目标作为空间表示**：将空间规划转化为视觉目标生成
- **隐式空间推理**：通过生成子目标图像隐式编码空间关系
- **空间目标导向**：每个子目标是一个空间状态

### 2. 空间关系处理

- 子目标生成隐含了对空间关系的理解（物体在哪里、如何移动）
- 自适应粒度意味着简单空间操作用粗粒度目标，复杂操作用细粒度目标
- 递归机制允许空间规划的在线修正

### 3. 对Spatial AGI的启发

1. **分层空间规划**：Spatial AGI需要不同粒度的空间规划能力
2. **自适应子目标**：空间推理的深度应根据任务复杂度调整
3. **视觉子目标**：用视觉而非坐标作为空间目标更直观、更通用
4. **在线规划修正**：真实世界的空间规划必须是动态的

### 4. 可应用的Spatial AGI场景

- 长时序机器人操作（整理房间、做饭）
- 多步骤空间推理任务
- 复杂环境中的层次化导航
- 需要动态调整策略的空间任务

---

## Q3: 创新点与局限性

### 创新点

1. **自适应递归子目标生成**：打破固定粒度分解的局限
2. **分层架构**：高层规划+低层执行的清晰分离
3. **视觉子目标**：比坐标或语言描述更直观的空间目标表示
4. **仿真+真实世界验证**：双重验证增强说服力

### 局限性

1. **依赖UMM质量**：子目标质量受限于多模态模型能力
2. **视觉子目标的歧义性**：同一子目标可能有多种空间解读
3. **未显式建模3D空间**：子目标是2D图像，缺乏精确3D空间信息
4. **长时序的鲁棒性**：递归次数过多可能累积误差
5. **数据需求**：需要大量子目标标注数据

---

## 关键词

VLA, Long-horizon Planning, Subgoal Generation, Hierarchical Policy, Embodied AI, Adaptive Planning, Visual Goal

---

## 引用信息

```bibtex
@article{zhang2026anticipation,
  title={Anticipation-VLA: Solving Long-Horizon Embodied Tasks via Anticipation-based Subgoal Generation},
  author={Zhang, Zhilong and Luo, Wenyu and Wang, Haonan and others},
  journal={arXiv preprint arXiv:2605.01772},
  year={2026}
}
```
