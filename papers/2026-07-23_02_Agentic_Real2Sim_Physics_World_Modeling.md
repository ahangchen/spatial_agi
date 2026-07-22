# Agentic Real2Sim: Physics-based World Modeling with Vision-Language Agents

**arXiv**: [2607.19190](https://arxiv.org/abs/2607.19190)
**发布日期**: 2026-07-21
**作者**: Guanxiong Chen, Qianjun Xia, Jiawei Peng, Heng Zhang, Bole Ma, Justin Qian, Ziyi Jiao, Bingyang Zhou, Luoxin Ye, Kaifeng Zhang, Kunyi Wang, Weijia Zeng, Yunuo Chen, Pengzhi Yang, Ziqiu Zeng, Huamin Wang, Chao Liu, Alan Yuille, Fan Shi, Changxi Zheng, Yunzhu Li, Chenfanfu Jiang, Peter Yichen Chen
**机构**: Johns Hopkins University, UCLA, USC, MIT, Tsinghua University
**项目主页**: https://ericchen321.github.io/agentic_real2sim.github.io/
**分类**: cs.RO, cs.AI

---

## 摘要

Real-to-sim conversion for robotic interaction with objects remains labor-intensive because it requires more than visual reconstruction: a streamlined real2sim process must recover scene geometries and object states, infer physical parameters, and assemble actors, objects, cameras, poses, and trajectories into a runnable physical simulation. Today this process still depends on manual tuning of visual foundation models, mesh cleanup, coordinate-frame alignment, and brittle workflow glue across visual perception tools and simulators. We introduce Agentic Real2Sim, a framework for generalized physical world modeling with vision-language agents, converting a real-world recording of object-robot interaction into a simulatable episodic twin which preserves observations, geometries, robot interactions, and object states. We evaluate Agentic Real2Sim on rigid-object manipulation, deformable-object interaction, and humanoid motion scenes, spanning domains that are usually handled by separate Real2Sim pipelines, marking a first step toward scalable conversion. The framework's agentic decisions can be driven by an open-weight VLM backend at a small fraction of the cost of frontier models, while attaining comparable conversion success rate.

---

## Q1: 核心算法原理

### 1.1 核心思想和动机

Agentic Real2Sim的核心思想是：**用VLM Agent自动化从真实世界视频到可运行物理仿明的转换过程**。

**问题背景**：
Real2Sim（真实到仿真）转换是机器人学习的核心瓶颈。要从视频中重建一个可运行的仿真场景，传统流程需要：几何重建、物体状态识别、物理参数推断、场景组装、轨迹对齐、验证调试——高度依赖人工专家，通常需要数小时到数天。

**核心洞察**：VLM已具备理解场景内容、推理物理参数、编写代码的能力。将Real2Sim组织为Agent工具调用序列，可以自动化大部分工作。

### 1.2 主要技术方法

#### 多步Agent Pipeline

1. **场景理解与分析**：VLM分析视频，识别物体类型（刚体/可变形体）和交互模式
2. **几何重建编排**：调用SAM、DepthAnything、3DGS等模型，VLM决策精细/简化建模
3. **物理参数推断**：从视觉线索估计材质、摩擦系数、弹性等
4. **仿真场景组装**：自动编写MuJoCo XML / Isaac Sim配置代码
5. **轨迹映射**：提取并重定向机器人运动轨迹
6. **验证与迭代**：VLM对比仿真截图与真实视频，自动调整参数

#### Episodic Twin概念

输出是**Episodic Twin**——保存原始观察、几何、交互、状态的完整可执行仿真episode，支持回放和修改。

#### 多域统一

单一框架处理刚体操作、可变形体交互和人形运动——传统上需要完全不同的工具链。

#### 开源VLM后端

支持开源VLM（如Qwen-VL），成本仅为GPT-4o的一小部分，成功率相当。

### 1.3 算法流程

```
Phase 1: Agent感知 — VLM分析视频,识别物体/交互/关键帧
Phase 2: Agent几何 — 调用视觉模型(SAM/Depth/GS), VLM验证质量
Phase 3: Agent物理 — VLM推理材质/参数, 生成配置
Phase 4: Agent组装 — VLM编写仿真代码, 加载场景
Phase 5: Agent轨迹 — 提取轨迹, 坐标变换, 重定向
Phase 6: Agent验证 — 运行仿真, VLM对比, 自动迭代
```

### 1.4 输入输出

**输入**: 真实世界交互视频（RGB/RGBD），可选机器人URDF
**输出**: Episodic Twin（可执行仿真场景 + 物理属性 + 轨迹 + 验证视频）

---

## Q2: 与Spatial AGI的关系

### 2.1 空间理解和表示

多层次空间表示：
1. **视觉空间**：VLM理解2D内容
2. **几何空间**：3D重建恢复结构
3. **物理空间**：推断物理行为参数
4. **仿真空间**：组装为可执行数值表示

### 2.2 对Spatial AGI的启发

1. **VLM作为空间推理引擎**：不仅是感知工具，更是工具调用者
2. **自动化空间建模**：大规模生成训练环境
3. **Episodic Twin作为空间记忆**：结构化的空间交互记忆格式
4. **跨域统一**：一个框架处理多种物理交互

### 2.3 应用场景

训练数据生成、策略评估、空间推理训练、安全验证、数字孪生、场景编辑、跨embodiment迁移

---

## Q3: 创新点和局限性

### 创新点

1. **VLM Agent自动化Real2Sim**：首次将Real2Sim流程组织为Agent工具调用序列
2. **跨域统一**：单一框架处理刚体/可变形体/人形运动
3. **开源VLM支持**：证明开源模型可达相当成功率
4. **Episodic Twin**：超越几何重建的完整物理交互episode

### 局限性

1. **VLM推理精度**：物理参数推断可能有较大误差
2. **计算效率**：多步Agent pipeline需分钟级耗时
3. **复杂场景**：高度复杂场景可能需要人工干预
4. **验证可靠性**：VLM视觉判断不完全可靠
5. **仿真器兼容性**：需额外适配不同仿真器

### 对比

| 方法 | 自动化 | 域覆盖 | 物理保真度 |
|------|--------|--------|------------|
| 传统Real2Sim | 全手动 | 单域 | 高 |
| 3DGS方法 | 半自动 | 视觉为主 | 低 |
| **Agentic Real2Sim** | **全自动** | **多域** | **中高** |

---

## Spatial AGI深度关联

### 自动化空间建模

Agentic Real2Sim代表了从"手动空间建模"到"自动空间建模"的范式转变，是Spatial AGI规模化的关键前提。

### VLM作为"大脑"

展示了VLM作为Spatial AGI中枢的能力：感知调度、推理决策、代码生成、质量评估、迭代优化。

### Real↔Sim闭环

Agentic Real2Sim是Real→Sim的第一步，完整的Spatial AGI需要Real↔Sim双向闭环。

---

## 个人思考

### 1. 数据基础设施的突破
Real2Sim自动化使Spatial AGI的数据瓶颈有了可规模化的解决方案。

### 2. 自动化分层
```
Level 0: 全手动 → Level 3: 全自动（本文）→ Level 4: 自进化
```

### 3. 物理推断的ill-posed性
VLM只有视觉输入，某些物理参数推断本质不适定。需要多模态融合（音频、触觉）。

### 4. 开源生态价值
开源VLM支持对社区可复现性和成本控制至关重要。

### 5. 与3DGS协同
3DGS作为几何工具 + Agentic Real2Sim作为物理参数化 = 可交互的物理世界表示。

---

## 总结

Agentic Real2Sim是Spatial AGI基础设施的重要突破，通过VLM Agent自动化Real2Sim转换，首次实现了跨域的端到端物理世界建模。Episodic Twin概念为空间记忆和训练数据生成提供了结构化格式。虽然物理参数推断精度仍有局限，但其开源、低成本、跨域统一的设计使其具有重大的实践价值。
