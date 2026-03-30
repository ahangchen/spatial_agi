# From Human Cognition to Neural Activations: Probing Spatial Reasoning in LLMs

**arXiv**: 2603.26323  
**Date**: 2026-03-27  
**Category**: NLP / Mechanistic Interpretability  
**Tags**: #SpatialReasoning #LLM #Probing #MechanisticInterpretability

---

## TL;DR

本文从**机制可解释性**视角研究 LLM 的空间推理能力，借鉴人类空间认知理论，将空间推理分解为三个计算原语：**关系组合**、**表示变换**、**状态更新**，并通过线性探测、稀疏自编码器和因果干预分析内部表示。

---

## 核心问题

> LLM 在空间推理 benchmark 上的成功，是源于**结构化的内部空间表示**，还是**语言启发式**？

Benchmark 准确率无法区分：
1. 真正的空间计算
2. 表面语言模式匹配
3. 记忆化答案

---

## 理论框架

### 人类空间认知的三原语

| 原语 | 人类能力 | LLM 任务 |
|------|----------|----------|
| **关系组合** | 认知地图构建 | 多关系推理 |
| **表示变换** | 心理旋转/视角转换 | 方向/旋转变换 |
| **状态更新** | 路径积分 | 空间程序执行 |

### 设计原则

1. **抽象性**：使用抽象实体，最小化世界知识依赖
2. **组合性**：多约束/操作整合
3. **参数化**：系统控制难度
4. **机制可访问**：明确定义中间变量

---

## 方法

### 1. 三个任务族

**Task 1: Relational Spatial Reasoning**
```
A left of B, B above C → A与C的关系？
难点：构建全局一致的2D/3D结构
```

**Task 2: Perspective Transformation**
```
初始配置 → 旋转/反射/视角变化 → 报告结果
难点：几何变换的等变性
```

**Task 3: Spatial Program Execution**
```
初始位置 → 移动指令序列 → 最终位置
难点：累积误差，状态追踪
```

### 2. 多语言设计

- **英语、中文、阿拉伯语**
- 独立构造（非翻译），保持计算等价
- 用于区分**空间计算** vs **语言特异性**

### 3. 分析工具

**线性探测**：
```python
# 从隐藏状态解码空间变量
probe = LinearProbe(hidden_dim, spatial_dim)
R² = probe.evaluate(hiddens, spatial_labels)
```

**稀疏自编码器 (SAE)**：
```python
# 提取可解释的空间特征
features = SAE.encode(hidden_states)
# 分析特征激活模式
```

**因果干预**：
```python
# 修改中间表示 → 观察行为变化
patched_hidden = intervene(hidden, new_value)
new_output = model.forward_from(patched_hidden)
```

---

## 关键发现

### 1. 空间信息的层间分布

```
Layer:  0 ---- 10 ---- 20 ---- 30 ---- End
R²:     0.1    0.25    0.37    0.20    0.05
                ↑ Peak
        中间层最高，末层急剧下降
```

**解读**：空间表示在中间层构建，但未保留到最终预测。

### 2. 跨任务表示碎片化

| Task | Best Layer | R² |
|------|------------|-----|
| Relational | 19 | 0.37 |
| Orientation | 0 | <0.01 |
| Program | 20 | 0.40 |

- **方向推理**：几乎无法解码（R²≈0）
- **关系推理** & **程序执行**：有结构化表示
- **不同任务使用不同的表示路径**

### 3. 机制退化 (Mechanistic Degeneracy)

```
英语：Layer 19, R²=0.37
中文：Layer 19, R²=0.24
阿拉伯语：Layer 20, R²=0.26

→ 相似行为，不同内部路径
```

### 4. 因果性证据

```python
# 干预中间层空间表示
intervene(layer_19, spatial_vector)
→ 输出改变（因果关系成立）
```

但**末层干预无效**，说明表示未整合到最终预测。

---

## 结论

> **当前 LLM 的空间表示是有限的、上下文依赖的，而非稳健的、通用的空间推理。**

### 关键洞察

1. **有表示但脆弱**：中间层确实编码空间信息
2. **碎片化**：不同任务类型使用不同表示
3. **弱整合**：空间信息未有效传递到输出

---

## 与 Spatial AGI 的关联

### 警示

- **不要只看 Benchmark**：准确率 ≠ 真正的空间推理
- **需要机制分析**：探测内部表示的完整性

### 启发

1. **显式 3D 表示**：LLM 的隐式表示不够稳健
2. **统一空间框架**：避免任务碎片化
3. **因果整合**：确保空间信息传递到决策

### 对比

| 方面 | 纯 LLM | Spatial AGI (理想) |
|------|--------|-------------------|
| 表示 | 隐式、碎片 | 显式、统一 |
| 整合 | 弱 | 强 |
| 泛化 | 上下文依赖 | 系统性 |

---

## Limitations

1. 仅分析文本 LLM，未涉及 VLM
2. 任务设计基于计算理论，可能与真实场景有差距
3. 因果干预的粒度有限

---

## Future Work

1. **VLM 空间表示分析**
2. **训练干预**：强化空间表示整合
3. **跨模态对齐**：文本-视觉-3D 空间统一

---

## References

- VSI-Bench (Yang et al., 2025)
- Sparse Autoencoders for Interpretability
- Human Spatial Cognition (Tolman, 1948)

---

*Analyzed: 2026-03-31*
