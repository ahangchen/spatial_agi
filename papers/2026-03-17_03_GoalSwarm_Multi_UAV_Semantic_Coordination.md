# GoalSwarm: Multi-UAV Semantic Coordination for Open-Vocabulary Object Search

**论文信息**
- **标题**: GoalSwarm: Multi-UAV Semantic Coordination for Open-Vocabulary Object Search
- **作者**: MoniJesu Wonders James, Amir Atef Habel, Aleksey Fedoseev, Dzmitry Tsetserukou
- **机构**: Skolkovo Institute of Science and Technology, Moscow, Russia
- **arXiv ID**: 2603.12908
- **arXiv URL**: https://arxiv.org/abs/2603.12908v1
- **PDF URL**: https://arxiv.org/pdf/2603.12908v1
- **发布日期**: 2026-03-13
- **研究领域**: Robotics (cs.RO), Multi-Robot Systems, Semantic Navigation
- **关键词**: Multi-Robot Systems, Semantic Navigation, Multi-UAV Coordination, Decentralized Mapping, Open-Vocabulary Grounding

---

## 执行摘要

GoalSwarm是一个完全去中心化的多无人机（Multi-UAV）框架，用于零样本（zero-shot）语义目标导航。该系统解决了在未知环境中进行鲁棒开放词汇目标导航的挑战，主要创新在于：

1. **轻量级2D语义地图**：通过从空中视角投影深度观测，协作构建共享的轻量级2D自顶向下语义占用地图，避免了全3D表示的计算负担
2. **零样本基础模型集成**：使用SAM3实现开放词汇检测和像素级分割，无需任务特定训练
3. **贝叶斯价值地图**：融合多视角检测置信度，通过UCB探索实现信息丰富的前沿评分
4. **去中心化协调策略**：结合语义前沿提取、成本-效用竞价和空间分离惩罚，最小化冗余探索

在GOAT-Bench基准测试中，GoalSwarm在20个未见过的HM3D场景中实现了45.0%的成功率和0.179的SPL（Success weighted by Path Length），显著优于单智能体基线（10.0% SR, 0.078 SPL）和无协调的多智能体方法（40.0% SR, 0.130 SPL）。

---

## 一、核心算法原理：多无人机语义协调与开放词汇搜索

### 1.1 系统架构概述

GoalSwarm采用完全去中心化的架构，每个无人机独立运行感知、建图、协调和导航模块，定期与群体同步。在每个时间步 $t$，无人机 $j \in \{1, \ldots, N\}$ 执行以下循环：

```
循环流程：
1. 观测：获取RGB-D帧 (I_t^j, D_t^j) 和里程计位姿 p_t^j = (x, y, z, θ)
2. 感知：运行零样本基础模型检测目标物体，计算检测置信度 v_t^j ∈ [0,1]
3. 建图：将深度投影到2D自顶向下语义占用网格，用 v_t^j 更新贝叶斯价值地图
4. 协调：从共享地图提取前沿，通过UCB评分，选择最优前沿
5. 导航：使用PID控制器执行基于深度的反应式导航
```

### 1.2 协作语义建图

#### 1.2.1 深度到体素投影

**输入**：深度图像 $\mathbf{D}_t \in \mathbb{R}^{H \times W_f}$，相机内参矩阵 $\mathbf{K}$，水平视场角 $\phi$

**步骤1：计算3D点云（相机坐标系）**
$$
\mathbf{X}_c = \frac{(u - c_x) \cdot \mathbf{D}(u,v)}{f}, \quad \mathbf{Z}_c = \frac{(v - c_v) \cdot \mathbf{D}(u,v)}{f}
$$

其中 $f = \frac{W_f}{2 \tan(\phi/2)}$ 是焦距，$(c_x, c_v)$ 是主点。

**步骤2：转换到地理坐标系**
$$
\mathbf{P}_{geo} = \mathbf{R}(\alpha) \cdot \mathbf{P}_{cam} + [0, 0, h_s]^\top
$$

其中 $\mathbf{R}(\alpha)$ 是相机仰角 $\alpha$ 的旋转矩阵，$h_s$ 是传感器高度。

**步骤3：体素化和2D占用预测**
$$
\hat{m}_{obs}(i,j) = \mathbb{1}\left[\sum_{k=k_{min}}^{k_{max}} \text{voxel}(i,j,k) > \tau_{map}\right]
$$

其中 $k_{min} = \lfloor 25\text{cm}/r_z \rfloor$，$k_{max} = \lfloor (h_a + 50\text{cm})/r_z \rfloor$ 定义障碍物高度范围，$\tau_{map}$ 是占用阈值。

**关键参数**：
- 地图分辨率：$r = 5$ cm
- 地图尺寸：$W = 480$ (对应 $24\text{m} \times 24\text{m}$)
- 语义类别数：$K = 16$
- 地图数据格式：$\mathcal{M} \in \mathbb{R}^{W \times W \times (2+K)}$

#### 1.2.2 地图融合

**局部到全局变换**：
$$
\mathcal{M}_{t+1} = \max(\mathcal{M}_t, \mathcal{T}(\hat{\mathcal{M}}_t^{local}; \mathbf{p}_t))
$$

其中 $\mathcal{T}(\cdot; \mathbf{p}_t)$ 是由智能体位姿参数化的空间变换器。

**多智能体异步同步**：
- 同步频率：每25个时间步
- 通信开销：约6.6 MB（未压缩），可通过增量编码进一步减少
- 融合策略：逐元素最大融合（element-wise max fusion）

### 1.3 零样本目标与语言目标定位

#### 1.3.1 检测流程

**输入**：开放词汇目标描述 $g$（例如"红色椅子"）和RGB帧 $\mathbf{I}_t$

**模型**：SAM3（Segment Anything Model 3）
- 功能：开放词汇检测、分割和跟踪
- 优势：单一模型完成多项任务，无需任务特定训练

**聚合检测置信度**：
$$
v_t = \max_i s_i \cdot \frac{|\mathbf{m}_i|}{H \cdot W_f}
$$

结合检测器置信度 $s_i$ 和相对掩码面积 $|\mathbf{m}_i|$，抑制虚假的小检测。

**防误检机制**：
- 置信度门控：$\tau = 0.3$
- 多视角确认：需要在滑动窗口内连续2次检测
- 查询频率：每3个仿真步查询一次外部GPU服务器

#### 1.3.2 贝叶斯价值地图（Bayesian Value Map）

**核心思想**：每个地图单元存储目标相关性的概率分布（均值 $\mu$ 和方差 $\sigma^2$）

**贝叶斯更新**：
$$
\mu_{t+1} = \frac{\sigma_{obs}^2 \mu_t + \sigma_t^2 \mu_{obs}}{\sigma_t^2 + \sigma_{obs}^2 + \epsilon}
$$

$$
\sigma_{t+1}^2 = \frac{\sigma_t^2 \sigma_{obs}^2}{\sigma_t^2 + \sigma_{obs}^2 + \epsilon}
$$

其中 $\epsilon \to 0^+$ 是正则化常数。

**观测方差模型**：
$$
\sigma_{obs}^2 = 1 - c(\mathbf{x})
$$

$c(\mathbf{x}) \in [c_{min}, 1]$ 是深度依赖的置信度锥，随距离和与相机光轴的角度偏移衰减：
$$
c(\mathbf{x}) = \cos^2\!\left(\frac{\theta(\mathbf{x})}{\phi/2} \cdot \frac{\pi}{2}\right) \cdot \text{remap}(c_{min}, 1)
$$

其中 $\theta(\mathbf{x})$ 是从相机中心到像素 $\mathbf{x}$ 的角度，$c_{min} = 0.25$。

**初始化参数**：
- 初始均值：$\mu_0 = 0.5$
- 初始方差：$\sigma_0^2 = 0.5$

### 1.4 去中心化多无人机协调

#### 1.4.1 语义前沿提取

**前沿定义**：已探索自由空间与未知区域之间的边界

**提取方法**：检测满足以下条件的单元：
$$
\mathcal{M}[:,:,1] > 0 \quad \text{（已探索区域）}
$$
与未探索单元相邻。

**前沿评分（UCB）**：
$$
U(f_i) = \tilde{\mu}(f_i) + \beta \sqrt{\max(0, \tilde{\sigma}^2(f_i))}
$$

其中：
- $\tilde{\mu}(f_i)$ 和 $\tilde{\sigma}^2(f_i)$ 是前沿质心周围半径 $R$ 圆形区域的中值均值和方差
- $\beta = 1.7$ 控制探索-利用权衡

**UCB优势**：
- 不确定性感知：优先访问检测不确定性高的前沿
- 避免贪婪：不仅追求最近或最大的前沿
- 平衡探索与利用：$\beta$ 参数灵活调整策略

#### 1.4.2 成本-效用竞价

**综合评分**：
$$
\text{Score}_{j,i} = \omega_1 U(f_i) - \omega_2 C(\mathbf{p}_j, f_i) + \omega_3 S(f_i) - \mathcal{P}_{sep}
$$

**组成部分**：
1. **效用项** $U(f_i)$：UCB前沿评分
2. **成本项** $C(\mathbf{p}_j, f_i)$：通过快速行进法（FMM）在占用网格上计算的测地线路径成本
3. **大小项** $S(f_i)$：前沿大小（边界单元数量）
4. **分离惩罚** $\mathcal{P}_{sep}$：
   $$
   \mathcal{P}_{sep} = \lambda \cdot \max\!\left(0, d_{min} - \min_{k \neq j} \|\mathbf{p}_k - f_i\|\right)
   $$

**目的**：强制执行最小无人机间距离，避免冗余探索。

#### 1.4.3 冲突解决与目标追踪

**冲突解决**：异步广播选定的前沿，优先级方案支持得分最高的无人机

**目标追踪**：当目标以高置信度正确定位时（$\tilde{\mu} > \tau_{goal}$），最近的无人机从探索模式切换到利用模式，直接导航到目标坐标。

### 1.5 无人机导航控制器

#### 1.5.1 基于深度的障碍物避免

**输入处理**：深度图像 $\mathbf{D}_t$ 分为5个角度扇区（左、偏左、中心、偏右、右）

**障碍物检测**：计算每个扇区 $s$ 的平均障碍物距离 $\bar{d}_s$，当 $\bar{d}_s < d_{safe}$ 时检测到障碍物（$d_{safe} = 1.0$ m）

**导航动作优先级级联**：
```
1. 如果卡住（位置10步不变）：执行随机逃逸机动（后退 + 随机转向）
2. 如果中心受阻：转向最大间隙方向
3. 如果找到目标（v_t > τ_goal）：直接向前移动到目标
4. 否则：转向所选前沿的相对角度并向前移动
```

#### 1.5.2 高度管理

**运行高度策略**：
- **高高度** ($h = 3.0$ m)：广域勘测
- **中高度** ($h = 2.0$ m)：房间级搜索
- **低高度** ($h = 1.5$ m)：近距离物体检查

**控制**：PID控制器管理高度转换

---

## 二、与Spatial AGI的关系：3D空间中的多智能体理解与协调

### 2.1 Spatial AGI的核心维度

Spatial AGI（空间人工通用智能）关注在物理3D空间中的感知、理解、推理和行动能力。GoalSwarm在以下关键维度上与Spatial AGI密切相关：

#### 2.1.1 3D空间感知与表示

**挑战**：如何在计算受限的平台上高效表示和理解3D环境？

**GoalSwarm的解决方案**：
- **轻量级2D投影**：避免全3D重建的计算负担
- **高度分层**：通过体素化保留关键几何信息
- **语义增强**：融合深度和语义信息到统一地图

**与Spatial AGI的关联**：
- 空间压缩：将3D世界压缩为可管理的表示
- 语义空间映射：将语言概念锚定到物理空间位置
- 实时处理：支持在线决策和行动

#### 2.1.2 多视角感知融合

**挑战**：如何从多个移动智能体的视角构建一致的世界模型？

**GoalSwarm的解决方案**：
- **异步地图同步**：每个智能体维护局部地图，定期融合
- **贝叶斯融合**：概率性地合并多视角观测
- **不确定性量化**：显式表示感知的不确定性

**与Spatial AGI的关联**：
- 分布式感知：多智能体协同感知
- 不确定性推理：在不确定信息下做出决策
- 共享世界模型：构建团队级的环境理解

#### 2.1.3 空间推理与规划

**挑战**：如何在未知环境中进行目标导向的空间推理？

**GoalSwarm的解决方案**：
- **前沿探索**：识别未探索区域的边界
- **UCB评分**：平衡探索（减少不确定性）和利用（追求目标）
- **测地线规划**：考虑障碍物的实际路径成本

**与Spatial AGI的关联**：
- 目标导向导航：理解"找到红色椅子"等自然语言目标
- 空间策略：制定探索和搜索策略
- 自适应规划：根据新信息动态调整计划

#### 2.1.4 多智能体协调

**挑战**：如何协调多个自主智能体的行为以实现共同目标？

**GoalSwarm的解决方案**：
- **去中心化架构**：无单点故障，可扩展
- **竞价机制**：分布式任务分配
- **空间分离**：避免冗余，提高效率

**与Spatial AGI的关联**：
- 群体智能：涌现的集体行为
- 分布式决策：无中央控制器的协调
- 通信效率：最小化通信开销

### 2.2 从单智能体到多智能体Spatial AGI

**演进路径**：
```
单智能体Spatial AGI
  ↓
多智能体Spatial AGI（GoalSwarm）
  ↓
群体Spatial AGI（未来）
```

**关键进步**：
1. **从个体到集体**：从"我理解环境"到"我们理解环境"
2. **从竞争到合作**：从独立探索到协调搜索
3. **从固定到自适应**：从预定义策略到基于不确定性的动态策略

### 2.3 空间智能体的核心能力

GoalSwarm展示了Spatial AGI智能体应具备的关键能力：

#### 2.3.1 感知能力
- **视觉感知**：RGB-D相机获取环境信息
- **语义感知**：通过SAM3理解开放词汇概念
- **深度感知**：构建3D到2D的映射

#### 2.3.2 认知能力
- **空间记忆**：维护和更新语义地图
- **不确定性推理**：贝叶斯价值地图表示信念
- **目标推理**：将自然语言目标转化为空间搜索策略

#### 2.3.3 决策能力
- **探索-利用权衡**：UCB策略平衡
- **多目标优化**：效用、成本、分离的加权组合
- **冲突解决**：分布式竞价和优先级

#### 2.3.4 行动能力
- **3D运动控制**：全3D自由度（不同于地面机器人）
- **障碍物避免**：基于深度的反应式导航
- **高度管理**：根据任务阶段调整高度

### 2.4 空间智能的层次结构

```
┌─────────────────────────────────────────┐
│        应用层：任务执行                    │
│  （目标搜索、环境监测、救援任务）          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        协调层：多智能体协作                │
│  （地图同步、竞价分配、冲突解决）          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        推理层：空间决策                    │
│  （前沿提取、UCB评分、路径规划）           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        表示层：环境建模                    │
│  （语义地图、贝叶斯价值地图）              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        感知层：传感器处理                  │
│  （RGB-D采集、SAM3检测、深度投影）         │
└─────────────────────────────────────────┘
```

### 2.5 空间AGI的关键挑战与GoalSwarm的应对

| 挑战 | GoalSwarm的应对 | 局限性 |
|------|----------------|--------|
| **计算资源限制** | 轻量级2D地图而非全3D重建 | 丢失垂直结构信息 |
| **感知不确定性** | 贝叶斯价值地图显式建模 | 假设完美里程计 |
| **开放词汇理解** | SAM3零样本检测 | 依赖外部GPU服务器 |
| **多智能体协调** | 去中心化竞价机制 | 需要可靠通信 |
| **实时性要求** | 异步更新，增量融合 | 同步延迟可能影响协调 |

### 2.6 未来Spatial AGI的发展方向

基于GoalSwarm的启示，未来Spatial AGI可能的发展方向：

1. **分层空间表示**：
   - 全局：拓扑地图（房间连接）
   - 局部：度量地图（GoalSwarm的2D地图）
   - 物体级：语义实例地图

2. **主动感知**：
   - 主动视角选择：移动到更好观察位置
   - 主动询问：向人类询问澄清
   - 主动记忆：选择性遗忘无关信息

3. **语言-空间对齐**：
   - 空间关系推理："在桌子旁边"、"在柜子上面"
   - 相对描述："左边那把椅子"
   - 功能性推理："可以坐的地方"

4. **长期学习**：
   - 环境先验：从过去环境学习通用模式
   - 任务迁移：一个场景学到的策略迁移到新场景
   - 持续适应：在线适应新物体类别

---

## 三、创新点与局限性分析

### 3.1 核心创新点

#### 3.1.1 技术创新

**1. 贝叶斯价值地图（Bayesian Value Map）**

**创新性**：
- 首次将贝叶斯融合应用于多无人机开放词汇导航
- 显式表示和更新感知不确定性
- 支持UCB探索策略的数学基础

**技术细节**：
- 每个像素存储均值和方差，而非单一置信度
- 观测方差基于深度和角度衰减
- 贝叶斯更新公式保证概率一致性

**对比现有方法**：
| 方法 | 不确定性表示 | 多视角融合 | 探索策略 |
|------|------------|-----------|---------|
| VLFM | 单一置信度 | 无 | 贪婪 |
| NeuroSwarm | 无 | 3D重建 | 优化规划 |
| GoalSwarm | 均值+方差 | 贝叶斯 | UCB |

**2. 轻量级2D语义地图**

**创新性**：
- 针对空中视角优化的地图表示
- 避免全3D重建的计算负担
- 保留足够的几何和语义信息

**技术优势**：
- 计算效率：$480 \times 480 \times 18$ vs 全3D体素网格
- 通信效率：6.6 MB vs 数百MB的3D地图
- 实时性：支持25步同步周期

**权衡分析**：
```
优点：
+ 计算快速，适合机载处理
+ 通信开销小
+ 足以支持2D导航规划

缺点：
- 丢失垂直结构（桌子vs架子）
- 无法表示多层环境
- 高度变化物体检测困难
```

**3. 去中心化协调策略**

**创新性**：
- 完全去中心化，无中央控制器
- 基于竞价的分布式任务分配
- 空间分离惩罚避免冗余

**技术组成**：
- **语义前沿提取**：结合占用和语义信息
- **UCB评分**：不确定性感知的前沿选择
- **成本-效用竞价**：测地线距离 + 效用 + 大小 - 分离

**对比现有方法**：
| 方法 | 架构 | 协调机制 | 语义支持 |
|------|------|---------|---------|
| CoNAV | 集中式 | 共享地图 | 有限 |
| Co-NavGPT | 半集中 | LLM分配 | 封闭词汇 |
| GoalSwarm | 去中心化 | 竞价+UCB | 开放词汇 |

**4. 零样本开放词汇检测**

**创新性**：
- 集成SAM3基础模型
- 无需任务特定训练
- 支持任意自然语言描述

**技术实现**：
- 在线查询外部GPU服务器
- 置信度门控（$\tau = 0.3$）抑制误检
- 多视角确认（2次连续检测）

**对比传统方法**：
```
传统方法：
- 预定义类别（椅子、桌子、沙发...）
- 训练检测器（YOLO、Faster R-CNN）
- 无法处理新类别

GoalSwarm：
- 开放词汇（"红色椅子"、"旧沙发"...）
- 零样本SAM3
- 即时适应新描述
```

#### 3.1.2 系统创新

**1. 完整的端到端系统**

GoalSwarm不是单一算法，而是完整的系统：
- 感知：RGB-D + SAM3
- 建图：2D语义地图 + 贝叶斯价值地图
- 协调：去中心化竞价
- 导航：基于深度的反应式控制器
- 评估：GOAT-Bench基准

**2. 空中导航的专门化**

针对无人机特点设计：
- 3D自由运动（vs 地面机器人的2D）
- 高度管理策略
- 无导航网格的路径规划

**3. 实用性考虑**

- 通信开销优化（增量编码）
- 计算资源限制（轻量级地图）
- 实时性要求（异步更新）

### 3.2 实验验证与性能分析

#### 3.2.1 实验设置

**基准**：GOAT-Bench
- 环境：Habitat模拟器 + HM3D场景
- 无人机物理：VisFly框架
- 任务：顺序多目标导航
- 评估：20个未见场景，object-type子任务

**智能体配置**：
- 高度：1.41 m，半径：0.17 m
- 相机：360×640，42° HFOV，深度0.5-5.0 m
- 动作：STOP, MOVE_FORWARD (0.25 m), TURN_LEFT/RIGHT (30°), LOOK_UP/DOWN (30°)
- 预算：每子任务500步

**评估指标**：
1. **成功率（SR）**：在1.0 m内调用STOP的比例
2. **SPL**：成功加权路径长度
   $$
   \text{SPL} = \frac{1}{N}\sum_{i=1}^N S_i \cdot \frac{l_i^*}{\max(l_i, l_i^*)}
   $$
3. **平均步数**：每子任务的平均仿真步数

#### 3.2.2 主要结果

**Table II: GOAT-Bench val_unseen性能**

| 方法 | UAV数量 | SR (%) | SPL | Avg. Steps |
|------|---------|--------|-----|-----------|
| Random Frontier | 2 | 20.0 | 0.084 | 421 |
| Single Agent | 1 | 10.0 | 0.078 | 465 |
| No Shared Map | 2 | 40.0 | 0.130 | 398 |
| **GoalSwarm** | **2** | **45.0** | **0.179** | **372** |

**扩展评估（100 episodes）**：
- SR: 53.8%
- SPL: 0.195

#### 3.2.3 关键发现

**1. 多智能体优势**

- 2 UAVs vs 1 UAV：SR从10.0%提升到45.0%（4.5倍）
- 原因：双倍探索速度，更快覆盖环境

**2. 协调的重要性**

- GoalSwarm vs No Shared Map：
  - SR: 45.0% vs 40.0%
  - SPL: 0.179 vs 0.130（38%提升）
- 原因：避免冗余，导向真正未探索区域

**3. 语义引导的必要性**

- GoalSwarm vs Random Frontier：
  - SR: 45.0% vs 20.0%（2.25倍）
  - SPL: 0.179 vs 0.084（2.13倍）
- 原因：UCB评分优先高不确定性前沿

**4. UCB探索-利用平衡**

- $\beta = 1.7$ 提供最佳平衡
- 优先访问检测不确定性高的区域
- 避免贪婪追求最近或最大前沿

#### 3.2.4 消融研究

**地图融合的影响**：
```
无共享地图：
- 两个UAV频繁访问相同房间
- 浪费步数预算
- 误报导致过早停止
- SPL最低（0.130）

有共享地图（GoalSwarm）：
- 基于团队覆盖推理
- 导向真正未探索区域
- 更高SR（45.0%）和SPL（0.179）
```

**前沿选择策略的影响**：
```
随机选择：
- SR仅20.0%
- 路径效率差（SPL 0.084）

UCB选择：
- SR达45.0%
- 路径效率显著提升（SPL 0.179）
```

### 3.3 局限性分析

#### 3.3.1 技术局限性

**1. 2D地图表示的局限**

**问题描述**：
- 所有障碍物投影到单一平面
- 无法区分垂直分离的结构

**影响**：
```
示例1：桌子与架子
- 2D地图：桌子位置被标记为障碍
- 实际：架子在桌子上方，UAV可以从下方通过
- 结果：错过可行路径

示例2：多层环境
- 2D地图：只表示单一高度层
- 实际：楼梯、夹层等
- 结果：无法表示和规划
```

**改进方向**：
- 2.5D地图：存储每个单元的高度范围
- 分层地图：多个高度层的2D地图
- 选择性3D：关键区域的3D重建

**2. 里程计假设**

**问题描述**：
- 假设完美里程计
- 未考虑漂移、累积误差

**现实挑战**：
```
真实世界因素：
- IMU漂移：随时间累积的位置误差
- 视觉里程计失败：纹理缺失、快速运动
- 传感器噪声：深度测量误差

影响：
- 地图对齐错误
- 多智能体地图融合失败
- 导航精度下降
```

**改进方向**：
- 集成SLAM：同时定位与建图
- 闭环检测：识别重访位置
- 位姿图优化：全局一致性

**3. 通信依赖**

**问题描述**：
- 需要可靠通信进行地图同步
- 未处理丢包、延迟、带宽限制

**现实挑战**：
```
室内环境：
- 信号衰减：墙壁阻挡
- 多径效应：反射导致干扰
- 带宽限制：6.6 MB同步可能慢

影响：
- 同步延迟影响协调
- 信息不一致导致冲突
- 系统鲁棒性下降
```

**改进方向**：
- 事件触发同步：只在地图显著变化时同步
- 压缩传输：稀疏表示、增量编码
- 容错机制：处理信息缺失

**4. 外部计算依赖**

**问题描述**：
- SAM3运行在外部GPU服务器
- 需要可靠网络连接

**影响**：
```
延迟：
- 网络往返：10-50 ms
- 推理时间：50-200 ms
- 总延迟：60-250 ms per query

可用性：
- 网络断开：无法检测
- 服务器故障：系统瘫痪
```

**改进方向**：
- 模型压缩：蒸馏、量化
- 边缘部署：机载GPU
- 混合模式：机载轻量模型 + 云端重量模型

#### 3.3.2 系统局限性

**1. 静态环境假设**

**问题描述**：
- 环境假设静态不变
- 未处理动态障碍物

**现实挑战**：
```
动态因素：
- 移动的人
- 开关的门
- 移动的家具

影响：
- 地图过时
- 碰撞风险
- 路径阻塞
```

**改进方向**：
- 动态物体检测：光流、背景减除
- 时序地图：维护历史状态
- 预测规划：预测动态物体轨迹

**2. 有限的目标类别**

**问题描述**：
- 评估仅限于object-type子任务
- 跳过description-type子任务

**影响**：
- 未验证复杂语言理解能力
- 例如："找到可以坐的地方"（功能性推理）

**改进方向**：
- 功能性推理：从外观推断功能
- 空间关系：理解"旁边"、"上面"
- 属性组合：处理"大的红色椅子"

**3. 室内环境限制**

**问题描述**：
- 仅在室内HM3D场景评估
- 未测试室外环境

**室外挑战**：
```
环境差异：
- 尺度：更大的开放空间
- 光照：变化剧烈
- 障碍物：树木、建筑、地形
- GPS：可能可用（vs 室内不可用）

影响：
- 地图尺度不匹配
- 检测性能下降
- 导航策略失效
```

**改进方向**：
- 自适应地图尺度
- 鲁棒视觉模型
- GPS融合

#### 3.3.3 评估局限性

**1. 模拟器与现实差距**

**问题描述**：
- Habitat模拟器是理想化的
- 物理动力学可能不真实

**差距示例**：
```
模拟器：
- 完美碰撞检测
- 理想传感器噪声
- 确定性环境

现实：
- 复杂碰撞几何
- 传感器故障、遮挡
- 非确定性因素（风、干扰）
```

**改进方向**：
- Sim-to-Real迁移：域适应
- 真实世界测试：物理无人机实验
- 鲁棒性增强：处理非理想情况

**2. 有限的基线比较**

**问题描述**：
- 未与所有相关方法比较
- 部分基线仅在少量episode评估

**缺失比较**：
- 更多单智能体方法
- 其他多智能体协调策略
- 不同的基础模型

**3. 样本量限制**

**问题描述**：
- 主要结果基于20个子任务（4 episodes）
- 扩展评估100 episodes但未详细报告

**统计显著性**：
- 小样本可能导致结果方差大
- 需要更多episodes确认稳定性

### 3.4 失败模式分析

作者观察到三种主要失败模式：

#### 3.4.1 幽灵检测（Ghost Detections）

**现象**：
- 早期帧中的误报在语义地图中留下残留像素
- 误导目标投影通道
- UAV导航到空空间

**原因**：
- SAM3误报（低置信度检测）
- 多视角确认未完全过滤
- 地图更新未衰减旧检测

**示例**：
```
时间t=10: 检测到"椅子"（置信度0.35，误报）
时间t=13: 检测到"椅子"（置信度0.32，误报）
→ 通过多视角确认（2次检测）
→ 地图更新：标记该位置为高目标相关性
时间t=50: 无新检测，但地图仍保留旧标记
→ UAV导航到该位置，发现空空间
```

**改进方向**：
- 时间衰减：旧检测权重随时间降低
- 主动验证：到达位置后重新检测确认
- 置信度阈值：提高多视角确认的阈值

#### 3.4.2 不可达目标投影（Unreachable Goal Projections）

**现象**：
- 目标物体从房间另一侧检测到
- FMM规划器无法找到无碰撞路径
- 无法在1.0 m成功阈值内到达

**原因**：
- 物体在玻璃后
- 物体在高处（架子顶部）
- 路径被其他障碍物阻塞

**示例**：
```
场景：会议室
检测：从门口看到桌子上的"花瓶"
规划：FMM无法找到通过桌子的路径
结果：UAV到达桌子附近，但无法在1.0 m内
→ 任务失败
```

**改进方向**：
- 可达性分析：检测时评估可达性
- 多目标表示：维护多个候选位置
- 主动操作：允许UAV移动障碍物

#### 3.4.3 小或遮挡物体（Small or Occluded Objects）

**现象**：
- 类别如"镜子"或"雕像"产生弱检测信号
- 置信度低于门控阈值（$\tau = 0.3$）
- UAV耗尽500步预算未找到目标

**原因**：
- 物体小：掩码面积小，置信度降低
- 物体被遮挡：部分可见，检测困难
- SAM3对这些类别不敏感

**示例**：
```
目标：小雕像（10 cm高）
观测：从2 m距离看到部分
检测：SAM3置信度0.25（低于0.3阈值）
结果：检测被过滤，UAV继续搜索
→ 500步后仍未找到
```

**改进方向**：
- 自适应阈值：根据物体类别调整
- 主动接近：检测到弱信号时主动靠近
- 多尺度搜索：不同高度和距离搜索

### 3.5 与现有无人机协调方法的对比

#### 3.5.1 对比维度

| 维度 | NeuroSwarm | CoNAV | Co-NavGPT | GoalSwarm |
|------|-----------|-------|-----------|-----------|
| **架构** | 集中式 | 集中式 | 半集中 | 去中心化 |
| **地图类型** | 3D神经重建 | 2D占用 | Navmesh | 2D语义 |
| **语义支持** | 有限 | 封闭词汇 | 封闭词汇 | 开放词汇 |
| **协调机制** | 优化规划 | 共享地图 | LLM分配 | 竞价+UCB |
| **平台** | UAV | 地面机器人 | 地面机器人 | UAV |
| **计算需求** | 高（3D重建） | 中 | 高（LLM） | 低（2D） |
| **实时性** | 低 | 中 | 低 | 高 |

#### 3.5.2 详细对比

**vs NeuroSwarm（Zhura et al. 2023）**

**NeuroSwarm**：
- **优势**：
  - 3D神经重建提供丰富的几何信息
  - 高可靠性和规划优化
- **劣势**：
  - 计算密集，限制导航速度
  - 集中式架构，单点故障
  - 语义支持有限

**GoalSwarm**：
- **优势**：
  - 轻量级2D地图，计算快速
  - 去中心化，可扩展
  - 开放词汇语义理解
- **劣势**：
  - 丢失3D细节
  - 无法处理复杂垂直结构

**适用场景**：
- NeuroSwarm：高精度任务，计算资源充足
- GoalSwarm：快速搜索任务，资源受限

**vs CoNAV（Jain et al. 2019）**

**CoNAV**：
- **优势**：
  - 共享地图简单有效
  - 地面机器人导航成熟
- **劣势**：
  - 封闭词汇检测，无法处理新类别
  - 依赖navmesh，不适用于UAV
  - 集中式协调

**GoalSwarm**：
- **优势**：
  - 开放词汇，适应任意描述
  - 专为UAV设计，3D自由运动
  - 去中心化协调
- **劣势**：
  - 空中视角建图更复杂
  - 无navmesh辅助规划

**适用场景**：
- CoNAV：地面机器人，预定义物体类别
- GoalSwarm：空中机器人，开放词汇任务

**vs Co-NavGPT（Yu et al. 2023）**

**Co-NavGPT**：
- **优势**：
  - LLM提供高级任务理解和分配
  - 自然语言交互
- **劣势**：
  - LLM计算成本高
  - 封闭词汇检测
  - 依赖地面机器人假设

**GoalSwarm**：
- **优势**：
  - 无LLM，计算效率高
  - 开放词汇检测
  - 专为UAV设计
- **劣势**：
  - 无高级语言推理
  - 任务分配基于竞价，无语义理解

**适用场景**：
- Co-NavGPT：需要复杂任务分解和语言交互
- GoalSwarm：快速目标搜索，资源受限

#### 3.5.3 GoalSwarm的独特优势

1. **完全去中心化**
   - 无单点故障
   - 可扩展到更多UAV
   - 鲁棒性高

2. **开放词汇语义**
   - 无需预定义类别
   - 支持自然语言描述
   - 零样本适应新任务

3. **轻量级高效**
   - 2D地图计算快
   - 通信开销小
   - 适合机载处理

4. **不确定性感知**
   - 贝叶斯价值地图显式建模
   - UCB策略平衡探索-利用
   - 信息驱动的决策

5. **空中导航专门化**
   - 全3D自由运动
   - 高度管理策略
   - 基于深度的反应式导航

---

## 四、技术细节与实现

### 4.1 传感器配置

**无人机平台**：
- 高度：1.41 m
- 半径：0.17 m（紧凑型室内UAV）

**相机**：
- 类型：前置RGB-D
- 高度：1.31 m
- 分辨率：360×640
- 水平视场角：42°
- 深度范围：0.5-5.0 m

**动作空间**：
- STOP：停止并声明找到目标
- MOVE_FORWARD：前进0.25 m
- TURN_LEFT/RIGHT：左/右转30°
- LOOK_UP/DOWN：上/下看30°

### 4.2 地图参数

**语义地图**：
- 网格尺寸：480×480
- 分辨率：5 cm/cell
- 物理范围：24 m × 24 m
- 通道数：2（占用+探索）+ K（语义，K=16）
- 数据类型：float32
- 内存占用：约6.6 MB

**贝叶斯价值地图**：
- 初始均值：$\mu_0 = 0.5$
- 初始方差：$\sigma_0^2 = 0.5$
- UCB参数：$\beta = 1.7$
- 置信度下限：$c_{min} = 0.25$

**同步频率**：
- 地图同步：每25个时间步
- SAM3查询：每3个仿真步

### 4.3 检测参数

**SAM3配置**：
- 运行位置：外部GPU服务器（NVIDIA RTX 4090, 24 GB）
- 通信：ZMQ
- 置信度门控：$\tau = 0.3$
- 多视角确认：2次连续检测

**置信度计算**：
$$
v_t = \max_i s_i \cdot \frac{|\mathbf{m}_i|}{H \cdot W_f}
$$

### 4.4 导航参数

**障碍物避免**：
- 安全距离：$d_{safe} = 1.0$ m
- 卡住检测：10步位置不变
- 扇区数量：5（左、偏左、中心、偏右、右）

**高度管理**：
- 高高度：3.0 m（广域勘测）
- 中高度：2.0 m（房间级搜索）
- 低高度：1.5 m（近距离检查）
- 控制：PID控制器

**成功条件**：
- 距离目标：< 1.0 m（欧氏距离）
- 调用STOP动作

### 4.5 计算资源

**硬件**：
- GPU：NVIDIA RTX 4090（24 GB）
- 用途：SAM3推理

**软件栈**：
- 模拟器：Habitat + VisFly
- 基础模型：SAM3
- 通信：ZMQ
- 规划：Fast Marching Method（FMM）

---

## 五、实验结果深度分析

### 5.1 性能指标解读

#### 5.1.1 成功率（SR）分析

**GoalSwarm: 45.0%**

**成功因素**：
1. 多智能体协调：双倍探索速度
2. UCB策略：优先高不确定性区域
3. 语义引导：基于检测信息导向
4. 共享地图：避免冗余探索

**失败因素**（55.0%）：
1. 幽灵检测：误报导致导航到空空间
2. 不可达目标：物体在不可达位置
3. 小物体检测失败：置信度过低
4. 步数预算耗尽：500步不足

**对比**：
- Single Agent（10.0%）：缺乏协调，探索慢
- Random Frontier（20.0%）：无语义引导
- No Shared Map（40.0%）：冗余探索

#### 5.1.2 SPL分析

**GoalSwarm: 0.179**

**SPL公式**：
$$
\text{SPL} = \frac{1}{N}\sum_{i=1}^N S_i \cdot \frac{l_i^*}{\max(l_i, l_i^*)}
$$

**解读**：
- 成功任务的最短路径与实际路径比
- 范围：[0, 1]，越高越高效
- GoalSwarm的0.179表示平均路径效率约18%

**对比**：
- Single Agent（0.078）：无协调，路径低效
- Random Frontier（0.084）：随机探索，低效
- No Shared Map（0.130）：冗余导致低效

**GoalSwarm优势**：
- 共享地图减少重复访问
- UCB策略避免盲目探索
- 语义引导直达目标

#### 5.1.3 平均步数分析

**GoalSwarm: 372步（预算500步）**

**解读**：
- 平均在74%的步数预算内完成任务
- 剩余步数可用于更复杂任务

**对比**：
- Single Agent（465步）：93%预算，接近耗尽
- Random Frontier（421步）：84%预算
- No Shared Map（398步）：80%预算

**效率提升**：
- vs Single Agent：减少20%步数
- vs Random Frontier：减少12%步数
- vs No Shared Map：减少7%步数

### 5.2 扩展评估（100 episodes）

**性能**：
- SR: 53.8%（vs 20 episodes的45.0%）
- SPL: 0.195（vs 20 episodes的0.179）

**解读**：
- 更大样本量下性能更好
- 可能原因：
  1. 小样本方差
  2. 特定episode难度差异
  3. 随机种子影响

**结论**：
- GoalSwarm性能稳定
- 更大评估验证了可扩展性

### 5.3 计算效率分析

#### 5.3.1 地图构建

**单步时间**（估计）：
- 深度投影：~5 ms
- 地图更新：~10 ms
- 总计：~15 ms

**优势**：
- 远快于3D重建（数百ms）
- 支持实时处理

#### 5.3.2 SAM3查询

**查询频率**：每3步

**单次时间**（估计）：
- 网络传输：~10 ms
- 推理：~50-200 ms
- 总计：~60-210 ms

**影响**：
- 每步平均：~20-70 ms
- 可接受延迟范围

#### 5.3.3 协调与规划

**地图同步**：每25步

**单次时间**（估计）：
- 序列化：~20 ms
- 传输：~50 ms（6.6 MB）
- 融合：~10 ms
- 总计：~80 ms

**前沿提取与评分**：
- 提取：~5 ms
- UCB计算：~10 ms
- 竞价：~5 ms
- 总计：~20 ms

**总计**：
- 平均每步：~55-125 ms（感知+建图+协调）
- 实时性：满足要求（< 200 ms/step）

### 5.4 通信开销分析

**地图同步**：
- 频率：每25步
- 大小：6.6 MB（未压缩）
- 带宽需求：~2.6 Mbps（假设25步=6.25秒）

**优化空间**：
1. **增量编码**：只传输变化部分
   - 估计减少：50-70%
   - 新大小：~2-3.3 MB

2. **压缩**：gzip或lz4压缩
   - 估计减少：60-80%
   - 新大小：~1.3-2.6 MB

3. **事件触发**：只在地图显著变化时同步
   - 估计减少频率：50%
   - 平均带宽：~1.3 Mbps

**总优化潜力**：
- 带宽：~0.3-0.7 Mbps
- 适合大多数无线网络

---

## 六、关键洞察与研究启示

### 6.1 对多智能体系统的启示

#### 6.1.1 去中心化的价值

**发现**：
- 去中心化协调在多UAV系统中高效
- 无需中央控制器，降低通信和计算瓶颈

**启示**：
- 未来多智能体系统应优先考虑去中心化设计
- 分布式决策提高鲁棒性和可扩展性

#### 6.1.2 不确定性感知的重要性

**发现**：
- 贝叶斯价值地图显著提升探索效率
- UCB策略优于贪婪策略

**启示**：
- 显式建模不确定性是关键
- 信息驱动的决策优于启发式规则

#### 6.1.3 轻量级表示的实用性

**发现**：
- 2D地图在资源受限平台上实用
- 保留足够信息支持有效导航

**启示**：
- 复杂不一定更好
- 针对任务设计适当的表示

### 6.2 对开放词汇理解的启示

#### 6.2.1 基础模型的威力

**发现**：
- SAM3实现零样本开放词汇检测
- 无需任务特定训练

**启示**：
- 基础模型是机器人感知的未来
- 减少数据标注和训练成本

#### 6.2.2 检测置信度的利用

**发现**：
- 检测置信度可用于建图和规划
- 贝叶斯融合提升鲁棒性

**启示**：
- 不仅使用检测结果，也利用置信度
- 概率推理增强系统可靠性

#### 6.2.3 多视角确认的必要性

**发现**：
- 多视角确认减少误报
- 但未完全消除幽灵检测

**启示**：
- 主动验证是必要的
- 时间衰减和主动重新检测可进一步提升

### 6.3 对空中导航的启示

#### 6.3.1 3D自由度的挑战与机遇

**发现**：
- UAV的3D自由度带来独特挑战
- 高度管理策略有效

**启示**：
- 不能直接应用地面机器人方法
- 需要专门化的空中导航策略

#### 6.3.2 基于深度的反应式导航

**发现**：
- 基于深度的反应式导航简单有效
- 无需复杂的规划器

**启示**：
- 简单方法在资源受限平台上更实用
- 反应式与规划式方法可结合

#### 6.3.3 无navmesh的规划

**发现**：
- 2D占用网格 + FMM足以规划
- 不需要navmesh

**启示**：
- 空中导航不依赖导航表面
- 占用网格表示足够

### 6.4 对Spatial AGI的启示

#### 6.4.1 空间表示的层次性

**启示**：
- 单一表示不足以应对复杂任务
- 需要多层次空间表示：
  - 拓扑层：房间连接
  - 度量层：2D/3D地图
  - 语义层：物体和区域
  - 不确定性层：信念状态

#### 6.4.2 感知-行动循环的紧密耦合

**启示**：
- 感知指导行动，行动辅助感知
- 主动感知：移动到更好观察位置
- 主动验证：重新检测确认目标

#### 6.4.3 语言-空间对齐的挑战

**启示**：
- 开放词汇检测是第一步
- 未来需要：
  - 空间关系推理："旁边"、"上面"
  - 功能性推理："可以坐的地方"
  - 相对描述："左边那把椅子"

#### 6.4.4 多智能体协同认知

**启示**：
- 从个体认知到集体认知
- 共享世界模型是关键
- 分布式推理和决策

---

## 七、未来研究方向

### 7.1 短期改进（1-2年）

#### 7.1.1 真实世界部署

**目标**：在物理UAV平台上验证

**挑战**：
- 里程计漂移
- 通信不可靠
- 传感器噪声
- 安全性要求

**方法**：
- 集成视觉SLAM
- 鲁棒通信协议
- 安全监控和应急机制

#### 7.1.2 动态环境处理

**目标**：处理移动障碍物和环境变化

**方法**：
- 动态物体检测（光流、背景减除）
- 时序地图维护
- 预测规划

#### 7.1.3 误检减少

**目标**：减少幽灵检测失败

**方法**：
- 时间衰减：旧检测权重降低
- 主动验证：到达后重新检测
- 提高多视角确认阈值

### 7.2 中期发展（2-5年）

#### 7.2.1 3D表示增强

**目标**：在不显著增加计算负担的情况下增强3D表示

**方法**：
- 2.5D地图：每个单元存储高度范围
- 分层地图：多个高度层的2D地图
- 选择性3D：关键区域的3D重建

#### 7.2.2 边缘计算部署

**目标**：在机载GPU上运行所有计算

**方法**：
- 模型压缩：SAM3蒸馏、量化
- 高效架构：MobileNet、EfficientNet变体
- 混合模式：机载轻量 + 云端重量

#### 7.2.3 更丰富的语言理解

**目标**：支持复杂语言描述和空间关系

**方法**：
- 空间关系推理模块
- 功能性推理：从外观推断功能
- 属性组合：处理"大的红色椅子"

### 7.3 长期愿景（5-10年）

#### 7.3.1 通用Spatial AGI

**目标**：从目标搜索到通用空间智能

**能力**：
- 理解和执行任意空间任务
- 与人类自然语言交互
- 持续学习和适应

#### 7.3.2 大规模群体协调

**目标**：从2-3个UAV扩展到数十甚至数百个

**挑战**：
- 通信带宽限制
- 协调复杂度
- 冲突解决

**方法**：
- 分层协调：小组内集中，组间去中心化
- 涌现行为：简单规则导致复杂协调
- 学习协调：通过强化学习优化策略

#### 7.3.3 跨域操作

**目标**：从室内到室外，从单一环境到多样环境

**挑战**：
- 环境尺度差异
- 光照和天气变化
- GPS可用性

**方法**：
- 自适应地图尺度
- 鲁棒视觉模型
- 多传感器融合（GPS、视觉、IMU）

---

## 八、总结与评价

### 8.1 核心贡献

GoalSwarm在多无人机语义导航领域做出了以下核心贡献：

1. **贝叶斯价值地图**：首次将贝叶斯融合应用于多UAV开放词汇导航，显式建模和更新感知不确定性，为UCB探索策略提供数学基础。

2. **轻量级2D语义地图**：针对空中视角优化的地图表示，避免全3D重建的计算负担，同时保留足够的几何和语义信息支持有效导航。

3. **去中心化协调策略**：完全去中心化的多智能体协调，结合语义前沿提取、UCB评分、成本-效用竞价和空间分离惩罚，最小化冗余探索。

4. **零样本开放词汇检测**：集成SAM3基础模型，实现无需任务特定训练的开放词汇目标识别，支持任意自然语言描述。

5. **端到端系统**：从感知到导航的完整系统，在GOAT-Bench基准上验证了有效性。

### 8.2 性能评价

**优势**：
- 显著优于单智能体和无协调基线
- SR提升4.5倍（vs Single Agent）
- SPL提升2.3倍（vs Random Frontier）
- 计算效率高，适合资源受限平台

**局限性**：
- 2D地图丢失垂直结构信息
- 假设完美里程计
- 依赖外部GPU服务器
- 仅在模拟器中验证

### 8.3 学术价值

**方法论贡献**：
- 贝叶斯融合在多智能体建图中的应用
- UCB策略在语义导航中的有效性
- 轻量级表示的实用性验证

**实证贡献**：
- GOAT-Bench上的系统评估
- 消融研究揭示各组件重要性
- 失败模式分析提供改进方向

**启发性贡献**：
- 去中心化协调的优势
- 不确定性感知的重要性
- 基础模型在机器人中的潜力

### 8.4 实用价值

**应用场景**：
- 搜索与救援：快速定位受害者
- 环境监测：检测特定物体或现象
- 基础设施检查：定位设备或异常
- 仓库管理：库存查找和盘点

**部署考虑**：
- 需要解决里程计、通信、计算等实际问题
- 安全性要求严格的监控和应急机制
- 成本效益：平衡性能和资源消耗

### 8.5 对Spatial AGI的意义

GoalSwarm代表了Spatial AGI在多智能体空中导航领域的重要进展：

1. **空间感知**：从RGB-D到语义地图的完整感知管道
2. **空间理解**：开放词汇概念到物理位置的锚定
3. **空间推理**：基于不确定性的探索-利用权衡
4. **空间行动**：3D自由运动的导航控制
5. **多智能体协调**：去中心化的集体空间智能

### 8.6 最终评价

**创新性**：★★★★☆
- 贝叶斯价值地图和去中心化协调策略是重要创新
- 轻量级2D地图是实用权衡
- 零样本开放词汇检测紧跟前沿

**完整性**：★★★★☆
- 从感知到导航的完整系统
- 详细的实验评估和消融研究
- 失败模式分析深入

**影响力**：★★★★☆
- 为多UAV语义导航提供新范式
- 启发未来Spatial AGI研究
- 实用性强，有应用潜力

**局限性**：★★★☆☆
- 2D表示限制、里程计假设、外部计算依赖等
- 仅在模拟器验证
- 样本量相对较小

**总体评价**：★★★★☆

GoalSwarm是一个设计精良、实验充分的多无人机语义导航系统，在技术创新、系统完整性和实用价值方面都有显著贡献。虽然存在一些局限性，但为未来Spatial AGI和多智能体系统研究提供了重要启示和坚实基础。

---

## 九、参考文献

1. Anderson, P., et al. (2018). On evaluation of embodied navigation agents. arXiv:1807.06757.

2. Carion, N., et al. (2025). SAM 3: Segment Anything with Concepts. arXiv:2511.16719.

3. Chaplot, D. S., et al. (2020). Object goal navigation using goal-oriented semantic exploration. NeurIPS 33.

4. Du, H., Yu, X., & Zheng, L. (2020). Learning object relation graph and tentative policy for visual navigation. ECCV.

5. Friess, C., et al. (2024). Fully onboard SLAM for distributed mapping with a swarm of nano-drones. IEEE IoT Journal.

6. Hu, C. Y., et al. (2025). See, point, fly: a learning-free VLM framework for universal unmanned aerial navigation. CoRL.

7. Jain, U., et al. (2019). Two body problem: collaborative visual task completion. CVPR.

8. Khan, R. A., et al. (2025). AgilePilot: DRL-based drone agent for real-time motion planning. ICUAS.

9. Khanna, M., et al. (2024). GOAT-Bench: A benchmark for multi-modal lifelong navigation. arXiv:2404.06609.

10. Kirillov, A., et al. (2023). Segment Anything. ICCV.

11. Li, F., et al. (2025). VisFly: An efficient and versatile simulator for training vision-based flight. ICRA.

12. Liu, S., et al. (2024). Grounding DINO: Marrying DINO with grounded pre-training for open-set object detection. ECCV.

13. Mousavian, A., et al. (2019). Visual representations for semantic target driven navigation. ICRA.

14. Ramakrishnan, S. K., et al. (2022). PONI: Potential functions for object-goal navigation with interaction-free learning. CVPR.

15. Savva, M., et al. (2019). Habitat: A platform for embodied AI research. ICCV.

16. Walker, O., Vanegas, F., & Gonzalez, F. (2020). A framework for multi-agent UAV exploration and target-finding. Sensors.

17. Yokoyama, N., et al. (2024). VLFM: Vision-language frontier maps for zero-shot semantic navigation. ICRA.

18. Yokoyama, N., et al. (2024). HM3D-OVON: A dataset and benchmark for open-vocabulary object goal navigation. IROS.

19. Yu, B., Kasaei, H., & Cao, M. (2023). Co-NavGPT: Multi-robot cooperative visual semantic navigation using large language models. arXiv:2310.07937.

20. Zafar, M., et al. (2025). SwarmVLM: VLM-guided impedance control for autonomous navigation of heterogeneous robots in dynamic warehousing. ROBIO.

21. Zhura, I., et al. (2023). NeuroSwarm: Multi-agent neural 3D scene reconstruction and segmentation with UAV for optimal navigation of quadruped robot. IEEE SMC.

---

## 附录A：数学公式详细推导

### A.1 贝叶斯更新的推导

**目标**：推导贝叶斯价值地图的更新公式

**假设**：
- 先验分布：$p(\mu) = \mathcal{N}(\mu_t, \sigma_t^2)$
- 似然函数：$p(\mu_{obs} | \mu) = \mathcal{N}(\mu, \sigma_{obs}^2)$

**后验分布**：
$$
p(\mu | \mu_{obs}) \propto p(\mu_{obs} | \mu) \cdot p(\mu)
$$

**推导**：
$$
\begin{aligned}
p(\mu | \mu_{obs}) &\propto \exp\left(-\frac{(\mu_{obs} - \mu)^2}{2\sigma_{obs}^2}\right) \cdot \exp\left(-\frac{(\mu - \mu_t)^2}{2\sigma_t^2}\right) \\
&= \exp\left(-\frac{1}{2}\left[\frac{(\mu_{obs} - \mu)^2}{\sigma_{obs}^2} + \frac{(\mu - \mu_t)^2}{\sigma_t^2}\right]\right) \\
&= \exp\left(-\frac{1}{2}\left[\frac{\sigma_t^2(\mu_{obs} - \mu)^2 + \sigma_{obs}^2(\mu - \mu_t)^2}{\sigma_{obs}^2 \sigma_t^2}\right]\right)
\end{aligned}
$$

**展开平方项**：
$$
\begin{aligned}
&\sigma_t^2(\mu_{obs}^2 - 2\mu_{obs}\mu + \mu^2) + \sigma_{obs}^2(\mu^2 - 2\mu_t\mu + \mu_t^2) \\
&= (\sigma_t^2 + \sigma_{obs}^2)\mu^2 - 2(\sigma_t^2\mu_{obs} + \sigma_{obs}^2\mu_t)\mu + (\sigma_t^2\mu_{obs}^2 + \sigma_{obs}^2\mu_t^2)
\end{aligned}
$$

**配方法**：
$$
\begin{aligned}
&(\sigma_t^2 + \sigma_{obs}^2)\left[\mu^2 - 2\frac{\sigma_t^2\mu_{obs} + \sigma_{obs}^2\mu_t}{\sigma_t^2 + \sigma_{obs}^2}\mu\right] + \text{const} \\
&= (\sigma_t^2 + \sigma_{obs}^2)\left[\mu - \frac{\sigma_t^2\mu_{obs} + \sigma_{obs}^2\mu_t}{\sigma_t^2 + \sigma_{obs}^2}\right]^2 + \text{const}
\end{aligned}
$$

**因此**：
$$
p(\mu | \mu_{obs}) = \mathcal{N}(\mu_{t+1}, \sigma_{t+1}^2)
$$

其中：
$$
\mu_{t+1} = \frac{\sigma_{obs}^2 \mu_t + \sigma_t^2 \mu_{obs}}{\sigma_t^2 + \sigma_{obs}^2}
$$

$$
\sigma_{t+1}^2 = \frac{\sigma_t^2 \sigma_{obs}^2}{\sigma_t^2 + \sigma_{obs}^2}
$$

### A.2 UCB策略的推导

**目标**：理解UCB（Upper Confidence Bound）策略的理论基础

**多臂老虎机问题**：
- $K$个臂（frontiers）
- 每个臂 $i$ 有未知奖励分布，均值 $\mu_i$
- 目标：最大化累积奖励

**UCB策略**：
$$
\text{UCB}_i(t) = \hat{\mu}_i(t) + \sqrt{\frac{2 \ln t}{n_i(t)}}
$$

其中：
- $\hat{\mu}_i(t)$：臂 $i$ 到时间 $t$ 的平均奖励
- $n_i(t)$：臂 $i$ 到时间 $t$ 的拉动次数
- $t$：总时间步

**GoalSwarm的变体**：
$$
U(f_i) = \tilde{\mu}(f_i) + \beta \sqrt{\max(0, \tilde{\sigma}^2(f_i))}
$$

**区别**：
- 使用实际方差 $\tilde{\sigma}^2(f_i)$ 而非样本方差估计
- 参数 $\beta = 1.7$ 控制探索-利用权衡
- 基于贝叶斯价值地图的概率分布

**直觉**：
- 第一项 $\tilde{\mu}(f_i)$：利用，追求高期望奖励
- 第二项 $\beta\sqrt{\tilde{\sigma}^2(f_i)}$：探索，优先高不确定性
- $\beta$ 越大，越倾向于探索

---

## 附录B：伪代码

### B.1 GoalSwarm主循环

```python
# 初始化
semantic_map = SemanticMap(resolution=0.05, size=480)
bayesian_value_map = BayesianValueMap(init_mean=0.5, init_var=0.5)
sam3_detector = SAM3Detector(server_url="gpu_server:5555")
navigator = DepthBasedNavigator(safety_distance=1.0)

# 主循环
for t in range(max_steps):
    # 1. 观测
    rgb_frame, depth_frame = camera.capture()
    pose = odometry.get_pose()
    
    # 2. 感知
    if t % 3 == 0:  # 每3步查询一次SAM3
        detections = sam3_detector.detect(rgb_frame, target_description)
        confidence = compute_aggregated_confidence(detections)
    else:
        confidence = previous_confidence
    
    # 3. 建图
    local_map = project_depth_to_2d(depth_frame, pose)
    semantic_map.update(local_map, pose)
    bayesian_value_map.update(confidence, depth_frame, pose)
    
    # 4. 协调
    if t % 25 == 0:  # 每25步同步一次
        broadcast_map(semantic_map, bayesian_value_map)
        receive_maps_from_others()
        semantic_map.fuse_with_others()
        bayesian_value_map.fuse_with_others()
    
    frontiers = extract_frontiers(semantic_map)
    scored_frontiers = score_frontiers_ucb(frontiers, bayesian_value_map, beta=1.7)
    selected_frontier = select_frontier_by_bidding(scored_frontiers, pose, other_uav_poses)
    
    # 5. 导航
    if confidence > tau_goal:
        action = navigator.navigate_to_goal(pose, target_location)
    else:
        action = navigator.navigate_to_frontier(pose, selected_frontier)
    
    execute_action(action)
    
    if action == STOP:
        break
```

### B.2 贝叶斯价值地图更新

```python
def update_bayesian_value_map(self, confidence, depth_frame, pose):
    for (u, v) in depth_frame.coordinates():
        # 计算观测方差
        depth = depth_frame[u, v]
        angle = compute_angle_from_center(u, v, camera_fov)
        confidence_cone = compute_confidence_cone(angle, depth, c_min=0.25)
        obs_var = 1 - confidence_cone
        
        # 地图坐标
        map_x, map_y = project_to_map(u, v, depth, pose)
        
        # 当前先验
        prior_mean = self.mean_map[map_x, map_y]
        prior_var = self.var_map[map_x, map_y]
        
        # 贝叶斯更新
        posterior_var = (prior_var * obs_var) / (prior_var + obs_var + epsilon)
        posterior_mean = (obs_var * prior_mean + prior_var * confidence) / (prior_var + obs_var + epsilon)
        
        # 更新地图
        self.mean_map[map_x, map_y] = posterior_mean
        self.var_map[map_x, map_y] = posterior_var
```

### B.3 UCB前沿评分

```python
def score_frontiers_ucb(frontiers, bayesian_value_map, beta=1.7, radius=5):
    scored_frontiers = []
    
    for frontier in frontiers:
        centroid = frontier.centroid
        
        # 提取前沿周围区域的均值和方差
        region_mask = circular_mask(center=centroid, radius=radius)
        region_means = bayesian_value_map.mean_map[region_mask]
        region_vars = bayesian_value_map.var_map[region_mask]
        
        # 计算中值（鲁棒性）
        median_mean = np.median(region_means)
        median_var = np.median(region_vars)
        
        # UCB评分
        ucb_score = median_mean + beta * np.sqrt(max(0, median_var))
        
        scored_frontiers.append((frontier, ucb_score))
    
    return sorted(scored_frontiers, key=lambda x: x[1], reverse=True)
```

### B.4 成本-效用竞价

```python
def select_frontier_by_bidding(scored_frontiers, my_pose, other_uav_poses, 
                                weights=[1.0, 1.0, 0.5], lambda_sep=10.0, d_min=5.0):
    best_frontier = None
    best_score = -float('inf')
    
    for frontier, ucb_score in scored_frontiers:
        # 效用项
        utility = weights[0] * ucb_score
        
        # 成本项（测地线距离）
        geodesic_cost = compute_geodesic_distance(my_pose, frontier.centroid, occupancy_map)
        cost = weights[1] * geodesic_cost
        
        # 大小项
        size = weights[2] * frontier.size
        
        # 分离惩罚
        min_dist_to_others = min([distance(frontier.centroid, other_pose) 
                                   for other_pose in other_uav_poses])
        separation_penalty = lambda_sep * max(0, d_min - min_dist_to_others)
        
        # 综合评分
        composite_score = utility - cost + size - separation_penalty
        
        if composite_score > best_score:
            best_score = composite_score
            best_frontier = frontier
    
    return best_frontier
```

---

## 附录C：实验配置详细参数

### C.1 无人机参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 高度 | 1.41 m | 紧凑型室内UAV |
| 半径 | 0.17 m | 碰撞检测用 |
| 相机高度 | 1.31 m | 相对无人机基座 |
| 相机分辨率 | 360×640 | RGB和深度 |
| 相机HFOV | 42° | 水平视场角 |
| 深度范围 | 0.5-5.0 m | 最小和最大深度 |
| 动作频率 | 10 Hz | 仿真步频率 |

### C.2 地图参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 网格尺寸 | 480×480 | 单元数量 |
| 分辨率 | 0.05 m/cell | 5 cm |
| 物理范围 | 24 m × 24 m | 覆盖面积 |
| 通道数 | 18 | 2（占用+探索）+ 16（语义） |
| 数据类型 | float32 | 4字节 |
| 内存占用 | ~6.6 MB | 未压缩 |
| 同步频率 | 每25步 | 约2.5秒 |

### C.3 贝叶斯价值地图参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始均值 | 0.5 | 中性先验 |
| 初始方差 | 0.5 | 高不确定性 |
| UCB参数β | 1.7 | 探索-利用权衡 |
| 置信度下限c_min | 0.25 | 边缘置信度 |
| 正则化ε | 1e-6 | 防止除零 |

### C.4 SAM3检测参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 查询频率 | 每3步 | 约0.3秒 |
| 置信度门控τ | 0.3 | 过滤低置信度 |
| 多视角确认 | 2次 | 连续检测 |
| 服务器GPU | RTX 4090 | 24 GB |
| 通信协议 | ZMQ | TCP |

### C.5 导航参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 安全距离d_safe | 1.0 m | 障碍物避免 |
| 卡住检测 | 10步 | 位置不变 |
| 前进距离 | 0.25 m | MOVE_FORWARD |
| 转向角度 | 30° | TURN_LEFT/RIGHT |
| 俯仰角度 | 30° | LOOK_UP/DOWN |
| 成功阈值 | 1.0 m | 欧氏距离 |
| 步数预算 | 500 | 每子任务 |

### C.6 高度管理

| 阶段 | 高度 | 用途 |
|------|------|------|
| 广域勘测 | 3.0 m | 快速覆盖大区域 |
| 房间搜索 | 2.0 m | 平衡视野和细节 |
| 近距离检查 | 1.5 m | 详细物体检测 |

### C.7 协调参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 同步周期 | 25步 | 地图广播 |
| 竞价权重ω₁ | 1.0 | 效用 |
| 竞价权重ω₂ | 1.0 | 成本 |
| 竞价权重ω₃ | 0.5 | 大小 |
| 分离惩罚λ | 10.0 | 权重 |
| 最小分离d_min | 5.0 m | 距离 |

---

**文档信息**
- **创建日期**: 2026-03-17
- **最后更新**: 2026-03-17
- **文档版本**: 1.0
- **总行数**: 1000+
- **字数**: 约15000字（中文部分）
- **作者**: AI Assistant (based on arXiv:2603.12908)
- **NotebookLM笔记本ID**: 9dfebb75-c42f-491e-b8ad-e3e88c9a4314

**文档结构**
1. 执行摘要
2. 核心算法原理
3. 与Spatial AGI的关系
4. 创新点与局限性
5. 技术细节与实现
6. 实验结果深度分析
7. 关键洞察与研究启示
8. 未来研究方向
9. 总结与评价
10. 参考文献
11. 附录A-D

**使用说明**
- 本文档基于arXiv论文和HTML版本自动生成
- 包含对核心算法、创新点、局限性的深度分析
- 适合研究人员、工程师和学生参考
- 可作为论文精读、技术分享和项目开发的基础

**版权声明**
- 论文内容版权归原作者所有
- 本分析文档由AI Assistant生成，供学习研究使用
- 引用请标注原论文：James et al., "GoalSwarm: Multi-UAV Semantic Coordination for Open-Vocabulary Object Search", arXiv:2603.12908, 2026
