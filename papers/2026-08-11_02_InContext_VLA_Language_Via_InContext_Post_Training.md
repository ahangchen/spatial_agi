# In-Context VLA: Endowing Vision-Language-Action Models with Language via In-Context Post-Training and Agentic Tool Use

**发表日期**: 2026-08-06  
**arXiv链接**: https://arxiv.org/abs/2608.05738  
**PDF链接**: https://arxiv.org/pdf/2608.05738  
**HTML版本**: https://arxiv.org/html/2608.05738v1  
**作者**: Jiarui Yang, Wen Huang, Jiale Zhang, Maowei Hu, Hang Guo  
**类别**: cs.RO

---

## 论文摘要

Vision-Language-Action (VLA) models have become the dominant recipe for generalist manipulation, yet they are almost universally trained by behavior cloning: a policy imitates expert action chunks conditioned on a static image and a fixed instruction. A natural remedy is to inject explicit reasoning through textual chain-of-thought (CoT). However, this paper shows that free-form textual CoT degrades low-level control: the reasoning it produces is ungrounded, its latency breaks closed-loop timing, and the reasoning and action tokens are optimized against conflicting objectives so that the policy learns to narrate rather than to act. The paper argues that what a VLA needs is not the ability to generate language, but the ability to consume grounded language. To this end, it introduces In-Context VLA, a framework that endows a VLA with language competence through (i) in-context post-training, in which perceptual evidence is injected as structured context and the model is supervised only on actions, and (ii) an agentic tool-use interface, in which the policy queries open-vocabulary detectors, monocular depth, and a vision-language model to actively acquire task-relevant information. Across the RoboCasa-GR1, SimplerEnv, and LIBERO simulation benchmarks, together with 8 real-world robot manipulation tasks, the method consistently achieves SOTA results.

---

## 核心问题分析

### Q1: 核心算法原理

**问题**: 这篇文章的核心算法原理是什么？

#### 1. 核心思想和动机

In-Context VLA的核心洞察来自一个反直觉的发现：**让VLA模型"说话"（生成chain-of-thought推理）反而会损害它的"做事"能力（低层控制）。**

具体来说，作者发现free-form textual CoT存在三个致命问题：

**问题一：推理与动作的目标冲突**
当VLA同时被训练生成推理文本和执行动作时，推理token和动作token被不同目标优化：推理token追求语言流畅性，动作token追求控制精度。这种多目标优化导致模型在两者之间妥协——学会"叙述"而非"行动"。

**问题二：推理不接地（Ungrounded Reasoning）**
生成的CoT往往与当前感知输入脱节。模型可能在"说"正确的推理步骤，但这些推理并不基于实际的视觉观察。

**问题三：延迟打破闭环时序**
生成文本推理需要额外的时间，打破了闭环控制所需的实时响应。在机器人操作中，即使是几百毫秒的延迟都可能导致失败。

**核心转向：从"生成语言"到"消费语言"**
基于这些发现，作者提出了一个范式转向：VLA不需要自己生成语言推理，而是需要**理解和使用**外部提供的语言信息。这就是"In-Context VLA"名字的由来——将语言能力作为上下文（context）注入，而非作为输出（output）生成。

#### 2. 主要技术方法

**方法一：上下文后训练（In-Context Post-Training）**

这是论文最核心的技术贡献。传统的VLA后训练通常直接微调模型同时输出推理和动作。In-Context VLA采用了完全不同的策略：

**感知证据作为结构化上下文**：
- 将视觉观察转化为结构化的语言描述
- 包括空间关系、物体位置、深度信息等
- 以"上下文"形式注入VLA的输入

**仅在动作上监督**：
- 模型只被训练输出动作，不输出推理文本
- 避免了推理和动作之间的目标冲突
- 模型学会"利用"上下文信息来改善动作质量

**数据引擎的多样性**：
- 不使用模板化的固定描述
- 生成多样、改写的、证据条件化的空间描述
- 确保模型学到的是"理解语言"而非"记忆模式"

**方法二：Agent工具使用接口（Agentic Tool-Use Interface）**

In-Context VLA不仅仅是一个被动接收信息的模型，更是一个主动查询信息的Agent：

**工具一：开放词汇检测器（Open-Vocabulary Detector）**
- VLA可以调用检测器来定位场景中的物体
- 支持非标准物体的识别（不仅仅是训练集中的类别）

**工具二：单目深度估计（Monocular Depth）**
- VLA可以获取深度信息来理解3D空间结构
- 对于抓取、放置等需要深度信息的操作特别重要

**工具三：视觉语言模型（VLM）**
- VLA可以查询VLM来获取场景的高级语义理解
- 处理需要复杂推理的子任务

这种工具使用接口使VLA从一个固定的端到端模型变成一个**主动感知的Agent**——它可以根据任务需要选择性地获取信息。

#### 3. 算法流程和关键步骤

**Step 1: 数据引擎构建**
```
场景观察 → 多模态信息提取 → 
  ├── 开放词汇检测 → 物体定位和识别
  ├── 深度估计 → 3D空间结构
  └── VLM推理 → 高级语义描述 →
结构化空间描述（多样化、改写、证据条件化）
```

**Step 2: 上下文后训练**
```
输入 = [图像 + 结构化空间描述 + 任务指令]
输出 = [机器人动作]
监督 = 仅动作标签
```

**Step 3: 推理时的Agent工具使用**
```
任务到达 → 
  判断需要什么信息 →
    ├── 需要物体识别？→ 调用检测器
    ├── 需要深度信息？→ 调用深度估计
    └── 需要语义推理？→ 调用VLM →
  整合信息 → 生成动作
```

**Step 4: 闭环控制**
- 实时执行动作
- 根据反馈更新观察
- 按需调用工具获取新信息

#### 4. 输入输出

**输入**:
- 视觉观察（RGB图像/视频）
- 任务指令（自然语言）
- 结构化空间描述（来自数据引擎或工具查询）

**输出**:
- 机器人动作序列
- 不输出文本推理（这是与CoT-VLA的关键区别）

---

### Q2: 与Spatial AGI的关系

**问题**: 这篇文章与通用空间智能（Spatial AGI）有什么关系？

#### 1. 如何理解和表示空间

**空间信息作为上下文而非内生表示**

In-Context VLA提出了一个独特的空间理解方式：不要求VLA内部构建完整的3D空间表示，而是将空间信息作为外部上下文注入。

这涉及到一个根本性的问题：**空间智能应该是内生的（endogenous）还是外源的（exogenous）？**

- 内生路线：模型内部学习3D空间表示（如3DGS、NeRF）
- 外源路线：模型从外部工具获取空间信息

In-Context VLA的选择是**两者结合**：模型有一定内生空间理解能力（来自预训练），同时通过工具增强获取更精确的空间信息。

**结构化空间描述**

论文的数据引擎生成的结构化空间描述包括：
- 物体的相对位置关系
- 深度/距离信息
- 空间布局描述
- 任务相关的空间约束

这些描述以自然语言形式呈现，使VLA能够利用其语言理解能力来处理空间信息。

**深度信息的空间意义**

单目深度工具是论文工具箱中的重要一员。通过调用深度估计，VLA可以获得2.5D的空间感知，这对于：
- 抓取操作（需要知道物体距离）
- 避障（需要知道障碍物位置）
- 空间规划（需要知道物体间的3D关系）

都至关重要。

#### 2. 如何处理空间关系

**通过工具查询空间关系**

当任务需要理解特定的空间关系时（如"把红色的杯子放到蓝色的碗左边"），VLA可以：
1. 调用检测器定位"红色杯子"和"蓝色碗"
2. 调用深度估计获取它们的3D位置
3. 调用VLM理解"左边"在当前视角下的含义
4. 综合这些信息生成正确的动作

**空间推理的外化**

与让模型内部进行空间推理不同，In-Context VLA将空间推理部分外化到专门的工具中：
- 检测器：负责"什么在哪里"
- 深度估计：负责"多远"
- VLM：负责"相对关系"
- VLA自身：负责"怎么做"

这种分工有一个重要优势：每个组件都在自己擅长的领域工作，避免了"一个模型做所有事"的性能瓶颈。

#### 3. 对Spatial AGI的启发

**启发一：消费语言 vs. 生成语言**

In-Context VLA最重要的启发是：对于Spatial AGI，**理解空间语言可能比生成空间语言更重要。** 一个能理解"把杯子向左移动10厘米"的系统，比一个能生成"我需要把杯子向左移动"但执行不准的系统更有用。

**启发二：工具使用作为空间智能的扩展**

Spatial AGI不一定要把所有空间能力都内化。通过工具使用，可以：
- 利用专门的感知工具获取精确空间信息
- 利用外部计算资源处理复杂空间推理
- 保持核心策略模型的简洁和高效

**启发三：上下文设计的多样性**

论文的数据引擎生成多样、改写的空间描述，而非固定模板。这启发Spatial AGI：**训练数据的多样性比数量更重要。** 模型需要学会理解各种表达方式的空间信息，而非记忆固定的模板。

**启发四：避免多目标冲突**

推理和动作之间的目标冲突是一个重要发现。Spatial AGI的设计者需要注意：不要让一个模型同时承担太多冲突的任务。分工比全能更有效。

#### 4. 可以应用的Spatial AGI场景

**场景一：灵活的机器人操作**
- 机器人在不确定环境中执行复杂操作
- 通过工具使用获取实时空间信息
- 适应不同的任务需求

**场景二：人机协作**
- 人类用自然语言给出空间指令
- VLA理解指令中的空间约束
- 调用工具验证和补充空间信息
- 执行精确操作

**场景三：多步骤空间任务**
- 任务需要多步空间推理
- 每一步可能需要不同的空间信息
- Agent按需查询工具

**场景四：异构环境适应**
- 面对训练中未见过的物体/环境
- 通过开放词汇检测器识别新物体
- 通过深度估计理解新环境的空间结构

---

### Q3: 创新点和局限性

#### 1. 主要创新点

**创新一：CoT-VLA的系统性批判**
论文对现有CoT-VLA方法提出了三个具体且有实证支持的问题：目标冲突、不接地推理、延迟问题。这为VLA研究社区提供了重要的反思。

**创新二：从"生成"到"消费"的范式转向**
提出VLA应该消费而非生成语言。这一转向简化了训练、提高了控制精度、保持了实时性。

**创新三：Agent工具使用接口**
将VLA从固定pipeline转变为灵活的Agent系统。工具使用赋予了VLA主动感知和信息获取能力。

**创新四：多样化数据引擎**
不使用模板化描述，而是生成多样、改写的空间描述。确保模型学到的是泛化的语言理解能力。

**创新五：广泛的实验验证**
在3个仿真基准（RoboCasa-GR1, SimplerEnv, LIBERO）+ 8个真实世界任务上验证，覆盖面广。

#### 2. 主要局限性

**局限一：工具调用的延迟**
虽然避免了CoT的生成延迟，但工具调用本身也需要时间。多个工具串行调用可能导致累积延迟。

**局限二：对外部工具质量的依赖**
系统性能在很大程度上取决于外部工具（检测器、深度估计、VLM）的质量。如果工具在特定场景下失败，VLA也会失败。

**局限三：工具选择策略**
论文没有详细讨论如何决定调用哪些工具、以什么顺序调用。这可能需要额外的训练或规则。

**局限四：空间表示的间接性**
通过语言描述传递空间信息可能不如直接的3D表示精确。"距离3.2米"的描述不如直接给出3D坐标精确。

**局限五：训练数据生成的成本**
多样化数据引擎需要运行多个模型来生成描述，这增加了训练数据准备的计算成本。

#### 3. 与其他相关工作的对比

**vs.CoT-VLA / ThinkingVLA**
- CoT-VLA：让VLA生成chain-of-thought推理
- In-Context VLA：将推理外化为上下文，VLA只做动作
- 优势：避免目标冲突，控制精度更高

**vs.3D-Mix for VLA**
- 3D-Mix：向VLA注入3D信息作为特征
- In-Context VLA：通过语言描述注入空间信息
- 区别：3D-Mix用几何特征，In-Context VLA用语言描述

**vs.GEAR-VLA**
- GEAR-VLA：学习几何感知动作表示
- In-Context VLA：通过工具使用获取几何信息
- 区别：GEAR-VLA内化几何，In-Context VLA外化几何

**vs.LAVM / VLM作为感知器**
- 这些方法将VLM作为机器人的感知前端
- In-Context VLA将VLM作为可查询的工具
- 区别：调用方式和信息流方向不同

---

## 核心技术发现

### 发现一：CoT有害控制

论文最重要的实证发现：free-form textual CoT对低层控制有害。这一发现挑战了"更多推理=更好性能"的直觉，揭示了多目标优化的风险。

### 发现二：消费语言的能力可以被训练

通过多样化数据引擎和上下文后训练，VLA可以学会理解各种表达方式的空间语言，即使从未见过完全相同的描述。这证明了语言消费能力的可训练性。

### 发现三：工具使用赋予灵活性

Agent工具使用接口使VLA能够适应不同的任务需求——简单任务不需要额外工具调用，复杂任务可以串行调用多个工具。这种灵活性是固定pipeline无法实现的。

---

## 与Spatial AGI的关系

### 直接贡献

1. **空间信息消费框架**: 提供了一种将空间信息注入VLA的实用方法
2. **工具增强的空间智能**: 展示了外部工具如何增强机器人的空间感知
3. **语言-空间桥梁**: 通过结构化空间描述建立了语言和空间的连接

### 技术启发

1. **分工原则**: 空间感知、空间推理、动作执行应该分工，而非全部塞入一个模型
2. **上下文设计**: 空间信息的表达方式比信息量更重要
3. **主动感知**: Agent应该主动查询需要的信息，而非被动接收固定输入

### 应用场景

- **灵活的工业机器人**: 适应不同任务的通用操作策略
- **服务机器人**: 理解人类自然语言空间指令并执行
- **探索机器人**: 在未知环境中通过工具增强空间感知

---

## 个人思考

### 最令人兴奋的发现

"消费语言 vs. 生成语言"的区分是一个深刻的洞察。这不仅适用于VLA，对整个AI领域都有启发意义。我们经常假设AI需要"更多能力"——生成、推理、解释——但有时候，简化能力范围并提高单项能力的效果更好。

对Spatial AGI的启发：**不要追求一个模型解决所有问题。** 空间感知、空间推理、空间记忆、动作执行——每一项都可能需要专门的组件，关键是如何设计它们之间的信息流。

### 潜在局限思考

**语言作为空间表示的瓶颈**
用自然语言描述空间信息是有损的。"红色杯子在蓝色碗的左前方30厘米处"这样的描述比3D坐标(x=0.3, y=-0.1, z=0.5)更自然但更不精确。对于需要毫米级精度的操作，语言描述可能不够。

**工具链的脆弱性**
如果检测器漏检了关键物体，整个pipeline就会失败。真实环境中的遮挡、光照变化、小物体等都可能导致工具失败。

### 与近期研究的关联

**与Robust-WAM的关联**
Robust-WAM讨论世界动作模型的语义预视，而In-Context VLA展示了如何通过工具获取语义信息。两者都关注语义和动作的结合，但路径不同。

**与BridgeVLA++的关联**
BridgeVLA++也关注VLA的数据效率和泛化性，但通过记忆增强而非工具使用来实现。两者可以互补——记忆提供历史经验，工具提供当前感知。

---

## 关键数据

- **仿真基准**: RoboCasa-GR1, SimplerEnv, LIBERO
- **真实世界任务**: 8个机器人操作任务
- **对比方法**: CoT-based VLA方法
- **性能**: 在匹配配置下，在性能和效率上均达到SOTA
- **工具**: 开放词汇检测器、单目深度、VLM

---

## 总结

### 核心发现总结

In-Context VLA是一个概念性贡献大于技术贡献的工作。它的核心价值在于提出了一个反直觉但重要的观点：VLA不需要生成语言推理，而需要学会消费语言信息。这一发现可能导致VLA研究范式的转变。

技术上，上下文后训练 + Agent工具使用的组合提供了一个灵活、高效、可扩展的VLA框架。它避免了CoT-VLA的目标冲突问题，同时保持了语言理解带来的性能提升。

### 对Spatial AGI的意义

In-Context VLA为Spatial AGI提供了一个重要的设计原则：**空间智能应该是模块化、分工式的，而非全能统一的。** 通过将空间感知（工具）、空间推理（VLM）、空间动作（VLA）分工，每个组件都能在其专长领域达到最佳性能。

这种模块化设计也是Spatial AGI走向实际部署的关键——可以独立升级每个组件，而不需要重新训练整个系统。

---

**文档创建时间**: 2026-08-11  
**分析方法**: arXiv WebFetch + 深度分析  
**分析者**: Spatial AGI Research Agent
