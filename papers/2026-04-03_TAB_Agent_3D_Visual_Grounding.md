# Think, Act, Build (TAB): Agentic Framework with VLMs for Zero-Shot 3D Visual Grounding

**Paper ID**: arXiv:2604.00528
**Date**: 2026-04-03
**Authors**: Haibo Wang*, Zihao Lin*, Zhiyang Xu*, Lifu Huang* (UC Davis, Virginia Tech)
**Link**: https://arxiv.org/abs/2604.00528
**Code**: https://github.com/WHB139426/TAB-Agent

---

## 一句话总结
TAB 将3D视觉定位重构为一个Agent驱动的语义推理与几何重建过程，使用纯开源模型在 ScanRefer 上超越全监督基线。

## 核心问题
现有 zero-shot 3D-VG 方法的两个瓶颈：
1. **依赖预处理点云**：将3D-VG退化为"候选框匹配"分类任务，在无3D点云的环境中失效
2. **纯语义跟踪脆弱**：依赖2D语义匹配关联多视角观测，在极端视角变化下极易失败

## 方法概述

### 核心理念
将3D-VG解耦为：
- **2D VLM** 负责复杂空间语义推理
- **确定性多视角几何** 负责3D结构实例化

### 三阶段循环

**Think（思考）**：Agent 基于3D-VG Skill蓝图和当前视觉上下文推理下一步动作

**Act（行动）**：调用专用视觉工具（检测器、分割模型）与环境交互
- Query Analysis → Coarse Filter → Fine Filter → Score&Rank → Seg&Marker → Reference Target Isolation

**Build（构建）**：Semantic-Anchored Geometric Expansion 机制

### Semantic-Anchored Geometric Expansion（核心创新）

**问题**：纯VLM语义跟踪在极端视角或特写时会丢失目标 → 多视角覆盖不足

**解决方案**：2D→3D→2D 映射策略

1. **Semantic Temporal Expansion**：
   - 从参考帧双向扩展，VLM验证目标身份一致性
   - 得到局部可靠的语义视频片段 $\mathcal{V}_{sem}$
   - 逆投影构建 Initial Build 点云

2. **Centroid Extraction**：
   - 从局部点云计算3D几何质心 $\mathbf{P}_{centroid}$
   - 作为视角不变的物理锚点

3. **Multi-View Geometric Expansion**：
   - 将3D质心投影回所有帧的2D平面
   - 进行 FoV、深度有效性、Z-buffer遮挡检查
   - 通过点提示分割模型获取完整多视角mask
   - 最终重建完整的3D目标点云和bbox

## 实验结果

### ScanRefer（主要结果）

| 方法 | 类型 | Overall Acc@0.25 | Acc@0.5 |
|------|------|-------------------|---------|
| GPT4Scene (7B) | 有监督LLM | 62.6 | 57.0 |
| SPAZER (GPT-4o) | Zero-shot | 57.2 | 48.8 |
| **TAB (Qwen3-VL-32B)** | **Zero-shot** | **71.2** | **46.4** |

TAB 在 Acc@0.25 上大幅超越所有方法（包括使用GPT-4o的），甚至超过多个全监督方法。

### 关键发现
- **不依赖3D点云**：直接从RGB-D流操作
- **纯开源模型**：Qwen3-VL-32B + SAM3
- **容错能力**：Agent 可动态调整工具阈值或跳过非关键步骤
- **Benchmark修正**：发现并修正了 ScanRefer/Nr3D 中大量标注错误

## 关键洞察

### 对 Spatial AGI 的意义

1. **Agent化是3D理解的趋势**：将静态pipeline重构为动态Agent循环，使系统能灵活应对不同场景——这代表了从"模型"到"系统"的范式转变。

2. **语义×几何的协同**：纯语义方法脆弱，纯几何方法缺乏理解。TAB 的 Semantic-Anchored Geometric Expansion 展示了两者的优雅结合：用语义建立锚点，用几何进行扩展。

3. **摆脱3D预处理依赖**：直接从RGB-D流工作，大大降低了实际部署的门槛。对于真实机器人来说，获得干净的3D点云本身就是个挑战。

4. **Benchmark质量的重要性**：现有benchmark存在显著噪声，这可能误导研究方向。

### 局限性

1. 依赖大模型推理能力（Qwen3-VL-32B），计算成本高
2. Agent框架的多步调用累积延迟
3. 在 Multiple 类别场景（存在同类干扰物）中 Acc@0.5 仍有差距

## 个人思考

TAB 是一个"正确的方向"——将3D视觉定位从静态匹配提升为动态重建过程。其核心洞察"用语义建立锚点，用几何进行扩展"不仅适用于3D-VG，更可以推广到更广泛的3D场景理解任务。

特别值得注意的是，这个工作完全使用开源模型就超越了依赖GPT-4o的方法，这说明了**方法设计比模型规模更重要**。

Agent式的 fault tolerance（动态调整阈值、跳过步骤）在实际部署中极其重要——真实世界不会给你完美的输入。

---

## 关键词
`3D视觉定位` `Agent框架` `VLM` `语义几何协同` `多视角重建` `零样本` `RGB-D`
