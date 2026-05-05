# SpatialGrammar: A Domain-Specific Language for LLM-Based 3D Indoor Scene Generation

**arXiv**: 2604.27555
**日期**: 2026-04-30
**机构**: HKUST(GZ)
**作者**: Song Tang, Kaiyong Zhao, Yuliang Li, Qingsong Yan, Penglei Sun, Junyi Zou, Qiang Wang, Xiaowen Chu

---

## 核心摘要

SpatialGrammar提出一种领域特定语言(DSL)，将重力对齐的室内布局表示为BEV网格放置，并通过确定性编译生成有效3D几何。基于此开发了SG-Agent（闭环系统，利用编译器反馈迭代优化场景）和SG-Mini（104M参数小模型，在编译器验证合成数据上训练）。在159个测试场景中超越现有方法。

---

## Q1: 核心算法原理

### 1. 核心思想和动机

现有LLM-based 3D场景生成方法使用原始坐标或冗长代码，导致：
- LLM难以正确推理3D空间关系
- 经常产生空间错误和碰撞
- 物理约束难以满足

SpatialGrammar的核心思想：**设计一种让LLM更容易理解和生成的空间表示语言**

### 2. 主要技术方法

#### 2.1 SpatialGrammar DSL

- **BEV网格放置**：将3D室内布局简化为鸟瞰图网格上的物体放置
- **重力对齐**：假设物体竖直放置，简化3D问题为2D+高度
- **确定性编译**：DSL可以确定性地编译为有效3D几何
- **可验证约束检查**：碰撞、重叠等约束可以通过编译器验证

#### 2.2 SG-Agent: 闭环场景生成

- 使用编译器反馈迭代优化场景
- 流程：LLM生成SpatialGrammar → 编译器检查 → 反馈错误 → LLM修正
- 确保生成的场景满足所有物理约束

#### 2.3 SG-Mini: 轻量级模型

- 104M参数（远小于LLM）
- 完全在编译器验证的合成数据上训练
- 单次生成即可产生合理场景
- 性能与更大LLM基线竞争

### 3. 算法流程

```
自然语言描述
  ↓ (方法1: SG-Agent)
LLM → SpatialGrammar代码 → 编译器检查
  ↑                              ↓
  └──── 反馈错误 ←────────── 约束违反
  ↓ (通过后)
  3D场景生成
  
  ↓ (方法2: SG-Mini)
SG-Mini → SpatialGrammar代码 → 编译器 → 3D场景
```

### 4. 输入输出

- **输入**：自然语言场景描述（"一个有两张沙发的客厅"）
- **输出**：交互式3D室内场景

---

## Q2: 与Spatial AGI的关系

### 1. 空间理解和表示

SpatialGrammar提出了一种**空间抽象语言**：
- **BEV作为空间抽象**：将复杂3D简化为2D网格+高度
- **空间原语**：放置、旋转、缩放等操作作为语言原语
- **约束作为语法**：物理约束嵌入在语言设计中

### 2. 空间关系处理

- 通过网格坐标隐式表示空间位置关系
- 通过碰撞检测显式处理空间排斥关系
- 通过BEV视角统一空间参考框架

### 3. 对Spatial AGI的启发

1. **空间语言设计**：为AI设计空间推理的中间表示语言是Spatial AGI的关键问题
2. **编译器-反馈循环**：空间推理需要外部验证机制（如物理引擎）
3. **小模型+空间知识**：SG-Mini证明通过注入空间先验知识，小模型也能做好空间推理
4. **BEV作为通用空间抽象**：鸟瞰图视角是一种高效的空间表示

### 4. 可应用的Spatial AGI场景

- Embodied AI中的场景生成和编辑
- 仿真环境快速构建
- 交互式空间设计工具
- 基于语言的空间规划

---

## Q3: 创新点与局限性

### 创新点

1. **空间DSL设计**：为LLM设计的空间表示语言，降低空间推理难度
2. **确定性编译器**：从语言到3D几何的确定性映射+约束验证
3. **闭环SG-Agent**：编译器反馈驱动的迭代优化
4. **SG-Mini**：104M参数小模型的竞争性能，证明空间先验的重要性
5. **159个测试场景**：5种复杂度的全面评估

### 局限性

1. **重力对齐假设**：不支持悬挂物体、倾斜放置等非常规场景
2. **室内场景限制**：不适用于室外、自然场景
3. **BEV信息损失**：丢失了物体的侧面细节
4. **家具粒度**：可能不支持非常细粒度的物体交互
5. **扩展性**：DSL的表达能力上限

---

## 关键词

Domain-Specific Language, 3D Scene Generation, LLM, Spatial Reasoning, BEV, Indoor Scene, Embodied AI

---

## 引用信息

```bibtex
@article{tang2026spatialgrammar,
  title={SpatialGrammar: A Domain-Specific Language for LLM-Based 3D Indoor Scene Generation},
  author={Tang, Song and Zhao, Kaiyong and Li, Yuliang and Yan, Qingsong and Sun, Penglei and Zou, Junyi and Wang, Qiang and Chu, Xiaowen},
  journal={arXiv preprint arXiv:2604.27555},
  year={2026}
}
```
