# ω-0 (WA-0): A Latent Predictive World Action Model for Concurrent Humanoid Loco-Manipulation

**发表日期**: 2026-08-06  
**arXiv链接**: https://arxiv.org/abs/2608.06375  
**PDF链接**: https://arxiv.org/pdf/2608.06375  
**HTML版本**: https://arxiv.org/html/2608.06375v1  
**作者**: Zhe Li, Zhenzhe Zhang, Yangyang Wei, Wenjie Zhang, Xichen Yuan, Peiyuan Zhi, Gen Li, Xinying Guo, Fengjie Gao, Jianfei Yang, Shanghang Zhang  
**机构**: 北京大学 (Peking University)

---

## 论文摘要

Humanoid household tasks often require concurrent loco-manipulation, where the robot must move, adjust posture, maintain balance, and manipulate objects as a single coordinated behavior. Yet existing humanoid policies typically decompose locomotion and manipulation, while recent world-action models remain either arm-centric or video-centered. We present **ω-0**, a latent predictive whole-body world-action model for real-world humanoid concurrent loco-manipulation.

Given a language instruction, current visual observation, and robot proprioceptive state, ω-0 directly predicts controller-compatible whole-body action latents for real-robot execution. Rather than reconstructing future videos, ω-0 learns compact future observation embeddings as a lightweight predictive objective, coupling latent visual foresight with diffusion-based whole-body action generation. The model supports egocentric RGB, exocentric RGB, and exocentric depth inputs, and leverages controller-based simulation replay to ground human/public visual-motion priors into robot-executable action latents.

The authors further collect **ω-HOME**, a 40+ hour real-world household humanoid dataset with synchronized multi-view observations, whole-body SMPL motions, robot states, and action latents. Real-world experiments on 11 household tasks demonstrate that a single ω-0 model can produce smooth manipulate-while-moving behaviors and consistently outperform representative imitation learning, VLA, humanoid, and WAM baselines.

---

## 核心问题分析

### Q1: 核心算法原理

#### 1. 核心思想和动机

ω-0的核心动机是：**人形机器人的家庭任务需要行走的同时进行操作（concurrent loco-manipulation）**，而现有方法将运动和操作分解处理，无法产生协调的全身行为。同时，现有的世界-动作模型（WAM）要么专注于手臂操作，要么仅处理视频层面的预测，缺乏真正可部署的全身控制。

ω-0的核心思想是：
- **不做视频重建，而是学习紧凑的未来观测嵌入（latent visual foresight）**
- **将潜在视觉前瞻与基于扩散的全身动作生成耦合**
- **直接预测控制器兼容的全身动作潜在表征**

#### 2. 主要技术方法

**方法1：潜在预测世界模型（Latent Predictive World Model）**
- 不重建未来视频帧（计算昂贵且信息冗余），而是学习未来观测的紧凑嵌入
- 使用潜在空间的前瞻预测作为轻量级预测目标
- 这种设计使得模型可以"想象"未来状态而无需昂贵的视频生成

**方法2：扩散式全身动作生成（Diffusion-Based Whole-Body Action Generation）**
- 使用扩散模型生成全身动作（包括双腿、躯干、双臂、头部）
- 扩散过程在动作潜在空间中而非原始动作空间中进行
- 与潜在视觉前瞻耦合，确保动作与预测的未来状态一致

**方法3：控制器兼容的动作潜在表征**
- 直接预测与机器人控制器兼容的动作潜在表征
- 通过控制器仿真的反演（simulation replay）将人类/公开运动先验转化为机器人可执行的动作
- 支持SMPL格式的全身运动数据

**方法4：多模态输入融合**
- 支持自视角RGB（egocentric RGB）
- 支持外视角RGB（exocentric RGB）
- 支持外视角深度（exocentric depth）
- 多模态融合提供丰富的场景和状态信息

#### 3. 算法流程

**训练流程**：
1. 收集ω-HOME数据集（40+小时真实人形机器人家庭任务数据）
2. 数据包含同步多视角观测、全身SMPL运动、机器人状态、动作潜在表征
3. 训练ω-0模型：
   - 输入：语言指令 + 当前视觉观测 + 机器人本体感知状态
   - 潜在预测模块：学习未来观测的紧凑嵌入
   - 扩散动作模块：基于前瞻嵌入生成本体动作潜在表征
4. 使用人类/公开运动数据通过控制器仿真扩充训练

**推理流程**：
1. 机器人接收语言指令（如"把杯子从桌上拿到厨房"）
2. 自视角和外视角相机提供当前观测
3. ω-0预测未来观测嵌入 → 生成全身动作潜在表征 → 转换为控制器命令
4. 实时执行，支持闭环控制

**输入输出**：
- 输入：语言指令 + 多视角RGB/深度 + 本体感知
- 输出：控制器兼容的全身动作序列（行走 + 操作协调）

#### 4. 关键技术特点

- **全身协调**：首次实现行走和操作作为单一协调行为的端到端学习
- **潜在预测**：用嵌入空间代替视频重建，大幅降低计算开销
- **跨数据源训练**：人类运动数据 + 公开数据 + 真实机器人数据
- **大规模真实数据集**：ω-HOME 40+小时，含多视角+SMPL+状态+动作

---

### Q2: 与Spatial AGI的关系

#### 1. 如何理解和表示空间

ω-0在空间理解方面的关键特点：

- **多视角空间感知**：同时处理自视角和外视角，构建对环境的立体理解
- **深度信息利用**：外视角深度输入提供直接的3D场景结构
- **本体感知与空间的关系**：机器人本体感知（关节角度、姿态）与视觉观测结合，形成完整的空间状态表征
- **潜在空间前瞻**：在潜在空间中预测未来状态，隐式地建模了物体和机器人在空间中的运动

#### 2. 如何处理空间关系

- **机器人-环境空间关系**：通过全身协调控制，模型必须理解机器人与环境的动态空间关系（如行走时与障碍物的距离、操作时与物体的相对位置）
- **多视角空间对齐**：不同视角的观测在潜在空间中融合，需要模型理解视角间的几何对应
- **时间-空间联合**：潜在前瞻预测本质上是时空联合建模——预测未来时刻的空间状态

#### 3. 对Spatial AGI的启发

**核心启发1：潜在预测 > 视频重建**
ω-0验证了一个重要假设：对于机器人控制而言，在潜在空间中预测未来比生成未来视频更高效且更有效。这对Spatial AGI的世界模型设计有重要指导——**世界模型不一定需要生成逼真的未来视频，紧凑的未来状态嵌入可能更实用**。

**核心启发2：全身协调是Spatial AGI的重要挑战**
人形机器人的家庭任务需要全身协调的 Spatial AGI——不仅要理解场景的3D结构，还要在移动中维持平衡并执行操作。这比固定基座的机械臂操作复杂得多，代表了Spatial AGI在实际部署中的真正挑战。

**核心启发3：运动先验的跨形态迁移**
通过控制器仿真将人类SMPL运动转化为机器人可执行动作，展示了从人类运动数据到机器人控制的迁移路径。这是Spatial AGI从人类知识中学习的典型案例。

#### 4. 可以应用的Spatial AGI场景

- **家庭服务机器人**：直接应用于人形机器人家庭任务（清洁、搬运、厨房操作）
- **导航+操作联合任务**：任何需要边走边做的场景
- **多视角世界模型**：潜在预测+多视角融合的范式可推广到其他世界模型
- **运动迁移**：从人类视频到机器人动作的迁移框架

---

### Q3: 创新点和局限性

#### 1. 主要创新点

| 创新点 | 描述 | 重要性 |
|--------|------|--------|
| **全身世界-动作模型** | 首次实现行走+操作协调的全身WAM | ⭐⭐⭐⭐⭐ |
| **潜在预测代替视频重建** | 轻量高效的世界模型设计 | ⭐⭐⭐⭐⭐ |
| **ω-HOME数据集** | 40+小时真实人形家庭数据 | ⭐⭐⭐⭐⭐ |
| **控制器兼容动作潜在表征** | 实现人类运动→机器人动作的迁移 | ⭐⭐⭐⭐ |
| **11个真实任务验证** | 在真实环境全面超越baseline | ⭐⭐⭐⭐ |

#### 2. 主要局限性

**局限1：仅验证于人形机器人**
- 虽然全身协调是人形机器人的独特挑战，但方法的适用性未在其他形态机器人上验证

**局限2：潜在预测的可解释性**
- 潜在空间的前瞻预测缺乏可解释性——模型"想象"的未来状态难以可视化和调试

**局限3：数据集规模**
- 40+小时虽然对人形机器人数据来说很大，但与视频世界模型使用的数据量相比仍然有限

**局限4：实时性要求**
- 扩散模型生成可能需要多次去噪步骤，在实时控制中可能成为瓶颈

**局限5：场景泛化**
- 仅在家庭场景验证，对工业、户外等复杂场景的泛化能力未知

#### 3. 与相关工作的对比

| 方法 | 全身协调 | 潜在预测 | 视频重建 | 真实部署 | 数据规模 |
|------|----------|----------|----------|----------|----------|
| **ω-0** | ✅ | ✅ | ❌ | ✅ 11任务 | 40h真实 |
| **MobileWAM** | 部分（移动+手臂） | ❌ | ✅ | ✅ | 中等 |
| **DreamWAM** | ❌ | ❌ | ✅ | 部分 | 大规模 |
| **传统VLA** | ❌ 分解 | ❌ | ❌ | ✅ | 中等 |
| **人形策略** | 部分 | ❌ | ❌ | ✅ | 小规模 |

---

## 核心技术发现

### 发现1：潜在预测的效率优势
ω-0最重要的技术发现是：**对于机器人控制，不需要重建未来视频帧**。紧凑的未来观测嵌入足以指导动作生成，且计算效率远高于视频生成。这可能改变了世界模型的设计范式——从"生成式"走向"预测式"。

### 发现2：全身协调的可行性
通过将扩散模型与潜在前瞻耦合，ω-0展示了端到端学习全身协调行为的可行性。这打破了传统方法将运动和操作分离的范式。

### 发现3：人类运动数据的桥接作用
控制器仿真反演（controller simulation replay）提供了一种将人类运动先验"翻译"为机器人可执行动作的有效路径，解决了人类数据到机器人数据的域鸿沟问题。

---

## 与Spatial AGI的关系

### 直接贡献

1. **全身Spatial AGI范式**：ω-0展示了如何在人形机器人上实现全身协调的Spatial AGI，包括空间导航、物体操作和平衡维持的统一处理
2. **高效世界模型设计**：潜在预测范式为Spatial AGI提供了更实用的世界模型设计方向
3. **大规模真实数据基准**：ω-HOME数据集为Spatial AGI的人形机器人研究提供了重要基准

### 技术启发

1. **"不重建只预测"原则**：Spatial AGI的世界模型不需要生成逼真的未来，紧凑的状态预测可能更有效
2. **多模态空间状态**：视觉+深度+本体感知的融合是构建完整空间状态表征的必要条件
3. **运动先验迁移**：人类运动数据通过仿真反迁可以作为Spatial AGI的运动知识来源

---

## 总结

ω-0是人形机器人世界-动作模型的重要突破。它首次实现了全身协调的loc-manipulation，通过潜在预测避免了视频重建的开销，并用大规模真实数据验证了可行性。ω-HOME数据集和控制器仿真反演的跨数据源训练策略，为后续研究提供了重要基础设施。

**核心评分**：
- 创新性：9/10（首次全身协调WAM + 潜在预测范式）
- 技术深度：8/10（扩散+潜在预测的组合设计合理）
- 与Spatial AGI相关性：9/10（直接解决空间导航+操作+平衡统一问题）
- 实用性：9/10（真实部署11任务，大规模数据集）
- 写作质量：8/10

**综合评分：8.6/10** — 人形机器人Spatial AGI的重要进展。
