# Real2Sim2Real for Vision-Language-Action Manipulation: An AMD ROCm-Based Pipeline

**发表日期**: 2026-07-25  
**arXiv链接**: https://arxiv.org/abs/2607.22997v1  
**PDF链接**: https://arxiv.org/pdf/2607.22997v1  
**HTML版本**: https://arxiv.org/html/2607.22997v1  
**作者**: Qing Yang, Xun Wang, Ziguan Wang, Zhenjiang Li, Hongqiang Wang, Dongdong Weng  
**机构**: AMD AIG Team, Beijing Institute of Technology  
**发表会议**: WAIC Academic (WAICA) 2026

---

## 论文概述

本文展示了AMD全栈加速的具身操作技术pipeline，从数据中心训练到Radeon PRO仿真/渲染再到Ryzen AI边缘计算，统一于ROCm开源软件栈。四个递进演示：(1) Sim-to-Real操作pipeline（SmolVLA + Franka），(2) 语义语言接地物体选择，(3) 融合3DGS重建和Genesis物理引擎的Real2Sim合成数据生成，(4) 大规模RL训练足式/人形机器人运动。全部在ROCm + PyTorch上原生运行。

---

## 核心问题

### Q1: 核心算法原理

1. **核心思想和动机**

   Physical AI是AI的下一个前沿——需要大规模并行计算（仿真）、大内存加速器（VLA训练）和低延迟边缘推理（on-robot）。AMD的硬件组合（Data Center GPU + Radeon PRO + Ryzen AI）配合ROCm开源软件栈，提供了一条不依赖CUDA的完整Physical AI pipeline。

   核心问题：**能否在非CUDA生态系统中实现完整的VLA操作pipeline？**

2. **四个技术演示**

   **Demo 1: Sim-to-Real操作**
   - Genesis物理仿真器生成合成数据
   - LeRobot数据集格式
   - SmolVLA-450M训练（4000步，~7-11分钟，<2.4GB VRAM）
   - Franka机械臂部署
   - 关键结果：纯仿真训练policy直接迁移到真实机器人

   **Demo 2: 语义物体选择（One-of-Three）**
   - 同一SmolVLA backbone
   - 自然语言指令选择正确物体（如"拿香蕉"而非葡萄）
   - 验证VLA的语言-视觉融合能力

   **Demo 3: Real2Sim合成数据管道**
   - **四阶段流程**：
     1. AMD Radeon GPU + ROCm进行3DGS重建（从真实图像+位姿）
     2. 3DGS场景作为Genesis仿真器的真实感背景
     3. Genesis物理引擎生成完整VLA训练信号（EE轨迹、多视角RGB、depth、分割、关节状态、动作）
     4. 随机化控制（物体布局、材质、光照、相机视角、机器人初始位姿、任务目标）
   - 输出：LeRobot兼容数据集，支持VLA/IL/评估
   - 关键创新：**3DGS重建场景 + Genesis物理交互的混合表示**

   **Demo 4: RL训练足式/人形机器人**
   - Unilab框架
   - Unitree Go2（四足）和G1（人形）
   - WBT、行走、操纵杆运动、动态翻转
   - 关键发现：AMD Ryzen AI MAX 395（UMA架构）在部分任务上超越discrete GPU+CPU组合

3. **关键架构选择**
   - Genesis物理仿真器（非Isaac Sim）
   - SmolVLA（小型VLA，450M参数）
   - 3DGS场景重建（非传统纹理映射）
   - ROCm + PyTorch原生（非CUDA翻译层）

### Q2: 与Spatial AGI的关系

1. **如何理解和表示空间**
   - **3DGS空间表示**：Real2Sim管道使用3DGS重建真实场景，保留了完整的空间几何和外观
   - **仿真空间**：Genesis提供物理准确的可交互3D空间
   - **混合空间**：3DGS静态背景 + Genesis动态交互物体的混合，兼顾视觉真实性和物理准确性

2. **如何处理空间关系**
   - Real2Sim将真实空间"搬入"仿真：真实图像→3DGS→Genesis可交互场景
   - 域随机化在空间维度上增强泛化（视角、布局、尺度）
   - 多视角RGB + depth感知提供丰富的3D空间信号

3. **对Spatial AGI的启发**

   **关键启发1：3DGS是Real2Sim的理想桥梁**
   
   3DGS兼具视觉真实性和实时渲染能力，作为仿真环境的背景比传统纹理映射质量更高。Spatial AGI系统可以利用3DGS重建创建大量真实感训练场景。

   **关键启发2：全栈非CUDA可行性**
   
   完整的Physical AI pipeline可以在ROCm上运行，打破了CUDA锁定。这意味着Spatial AGI的开发可以受益于更多样化的硬件生态和更低的计算成本。

   **关键启发3：UMA架构在RL中的优势**
   
   Ryzen AI的统一内存架构消除了host-device拷贝开销，在需要紧密仿真-训练循环的RL任务中表现优异。Spatial AGI系统的on-device训练可能受益于UMA设计。

4. **应用场景**
   - **场景数字化**：用3DGS快速重建真实环境用于训练
   - **数据增强**：在3DGS场景中进行域随机化生成多样化训练数据
   - **边缘部署**：VLA模型在Ryzen AI上的边缘推理
   - **RL训练**：足式/人形机器人的大规模RL训练

### Q3: 创新点和局限性

**创新点**：
- 首个完整的非CUDA Physical AI全栈pipeline
- 3DGS + Genesis物理引擎的Real2Sim混合管道
- 端到端验证：从仿真到真实Franka部署<1小时
- 开源可复现（Radeon Cloud Platform免费可用）

**局限性**：
- 技术演示性质，非完整研究论文
- SmolVLA-450M规模有限，复杂任务能力未知
- 3DGS重建质量依赖输入图像质量和覆盖度
- Sim-to-real gap仅在简单pick-and-place任务中验证
- 缺少与CUDA pipeline的详细性能对比
- Genesis仿真器成熟度vs Isaac Sim

---

## 核心技术发现

### 发现1：3DGS作为仿真环境背景

Real2Sim管道的关键创新——将3DGS重建的高保真场景作为Genesis仿真器的静态背景，结合程序化生成的动态交互物体。这种混合表示获得了：
- 真实场景的视觉保真度（避免"仿真感"）
- 物理引擎的交互能力（碰撞、抓取、放置）
- 可控的域随机化（材质、光照、视角）

### 发现2：SmolVLA的高效训练

仅450M参数、4000步训练、<2.4GB VRAM——SmolVLA展示了轻量VLA在简单操作任务上的潜力。关键是在Genesis中生成足够质量的合成数据。

### 发现3：UMA消除host-device拷贝

Ryzen AI MAX 395的统一内存架构让CPU/GPU/NPU共享内存池，消除了传统discrete GPU的host-device数据拷贝。在RL训练的紧密simulate-train循环中，这带来了实际性能优势。

---

## 与Spatial AGI的关系

### 直接贡献
1. **场景数字化pipeline**：Real2Sim用3DGS重建真实空间，为Spatial AGI提供了可交互的数字孪生
2. **非CUDA计算选择**：为Spatial AGI系统提供了更灵活的硬件/软件选择
3. **轻量VLA部署**：SmolVLA在边缘设备上的可行性

### 技术启发
1. **3DGS+物理引擎混合**：Spatial AGI仿真环境的标准范式
2. **合成数据+域随机化**：解决Spatial AGI数据瓶颈的工程方案
3. **全栈优化**：从训练到推理的端到端优化优于单点优化

### 应用场景
- **数字孪生**：3DGS重建+物理引擎创建可交互的spatial digital twin
- **自主机器人训练**：Real2Sim2Real闭环持续改进机器人policy
- **边缘Spatial AI**：轻量VLA在on-robot设备上的部署

---

## 个人思考

### 最令人兴奋的发现

**3DGS + Genesis的混合表示**是最令人兴奋的工程创新。它巧妙地解决了仿真环境的"视觉真实感 vs 物理交互性"困境——用3DGS保证视觉质量，用Genesis保证物理正确性。这种范式可以推广到任何需要photorealistic仿真的Spatial AGI场景。

### 潜在局限
- 3DGS场景是静态的——动态物体（如可变形物体、流体）无法被3DGS正确表示
- Genesis是较新的仿真器，其物理精度和稳定性vs成熟的Isaac Sim有待验证
- AMD硬件在中国境外可用性和社区支持有限

### 与昨日研究的关联
- 昨天的**Agentic Real2Sim**（07-23_02）也讨论了3DGS+仿真的Real2Sim范式
- 本文的工程实践为那些研究方向提供了工业级验证

---

## 关键数据

### 训练效率
| 任务 | 模型 | 时间 | VRAM |
|------|------|------|------|
| SmolVLA微调 | 450M | 7-11min (4000步) | <2.4GB |
| Genesis数据生成 | - | <30min全流程 | - |

### RL训练吞吐量
| 硬件 | Go2 Joy (steps/s) | G1 WBT (steps/s) |
|------|-------------------|------------------|
| R9700 PRO | 7.0 | 35.0 |
| W7900 | 6.5 | 33.0 |
| RTX 4090 | 6.0 | 36.0 |
| Ryzen AI MAX 395 | 8.0 | 37.0 |

---

## 总结

### 核心发现总结

本文展示了完整的非CUDA Physical AI pipeline，核心创新是3DGS+Genesis的Real2Sim混合数据生成管道。虽然技术演示性质较强，但为Spatial AGI系统的全栈开发提供了有价值的工程参考。

### 对Spatial AGI的意义

3DGS作为仿真环境的真实感桥梁，是Spatial AGI场景数字化的关键技术。全栈非CUDA选择为Spatial AGI的民主化开发提供了可能。轻量VLA的边缘部署可行性展示了Spatial AGI从云端到边缘的完整部署路径。

---

**文档创建时间**: 2026-07-29  
**分析方法**: arXiv HTML深度阅读 + 3个核心问题分析  
**文档行数**: ~210行
