# VoLN: Vision-Only Long-Horizon Navigation — Paradigm, Benchmark, and Method

**发表日期**: 2026-07-23  
**arXiv链接**: https://arxiv.org/abs/2607.21400v1  
**PDF链接**: https://arxiv.org/pdf/2607.21400v1  
**HTML版本**: https://arxiv.org/html/2607.21400v1  
**作者**: Jiabin Lou, Haopeng Wang, Yuanshuai Wang, Xinyu Liu, Xuxin Lv, Yuxin Guo, Lei Huang, Rongye Shi, Wenjun Wu  
**机构**: Beihang University, Hangzhou International Innovation Institute

---

## 论文概述

VoLN（Vision-Only Long-Horizon Navigation）提出了一个新的导航范式：移除外部的路径级指令和全局导航信号（GPS、地图），仅通过视觉目标视图指定目的地，路线相关信息只能通过局部可观测的场景线索（semantic beacons）获取。发布了VoLN-UAV基准（7,210 episodes，17个环境），以及初始基线VoLN-MLLM。在Test-Unseen上，Easy/Normal/Hard的成功率分别为7.4%/4.5%/1.8%，揭示了长时程导航的巨大挑战。

---

## 核心问题

### Q1: 核心算法原理

1. **核心思想和动机**

   现有VLN（Vision-and-Language Navigation）基准的路线指令包含了方向、距离、布局等空间先验，这些信息在GPS缺失的开放环境中无法通过机载传感获得。因此现有benchmark性能混合了视觉导航能力和指令提供的路线结构利用。

   **核心问题**：如果移除所有外部路线信息，agent能否仅凭视觉目标+场景线索完成长时程导航？

   VoLN范式的三个关键设计：
   - **目标视觉指定**：用goal views指定目的地（而非语言指令）
   - **路线信息局部化**：路线相关信息只能通过场景中的semantic beacons获取
   - **全局信号移除**：无GPS、无全局地图、无最短路径标注

2. **主要技术方法**

   **a) VoLN范式定义**
   
   部分可观测序列决策过程：
   - 观测 $x_t = (o_t, p_t)$：自我中心RGB观测 $o_t$ + 本体感觉 $p_t$（IMU、高度、速度、朝向）
   - 排除：GPS、世界坐标系位置
   - 动作 $a_t$：连续或离散，包含显式停止决策
   - 策略 $\pi(a_t | h_t, \mathcal{V})$：条件化于交互历史 $h_t$ 和goal views $\mathcal{V}$

   **b) VoLN-UAV基准**
   
   - **环境**：17个仿真环境（沙漠、森林、山脉、城市峡谷、隧道、工业走廊）
   - **仿真器**：Unreal Engine + Microsoft AirSim
   - **Episodes**：7,210个，按路径长度分为Easy(<300m)/Normal(300-450m)/Hard(>450m)
   - **数据分割**：Train(5,047, 12环境) / Val-Seen(1,082, 5训练环境) / Test-Unseen(1,081, 5新环境)
   - **Beacon系统**：
     - Active beacons（3-5个per episode）：稀疏放置在决策点，提供路线相关线索
     - Passive beacons（~150个per environment）：固定不变，提供语义干扰
     - 四类：方向引导、可行飞行警告、环境干扰物、上下文线索
   - **目标集**：最后3帧RGB观测 $\mathcal{V}(\xi) = \{o_{T-2}, o_{T-1}, o_T\}$

   **c) VoLN-MLLM基线方法**
   
   两阶段视觉-语义规划框架：
   
   **Stage 1: Visual-Semantic Alignment**
   - 自监督视觉特征与结构化语义空间对齐
   - 提供observations、goal views和scene cues的可比较表示
   
   **Stage 2: Cue-Conditioned Closed-Loop Planning**
   - 输入：对齐的视觉证据 + goal views + 本体感觉
   - 输出：短时程UAV轨迹waypoint
   - 基于检索的视觉-语义tokens提供场景线索信息

3. **算法流程**
   1. 给定goal views $\mathcal{V}$（目的地的3张照片）
   2. UAV从初始位置出发
   3. 每步：RGB观测 $o_t$ + 本体感觉 $p_t$ → 检测场景中的beacons
   4. 解读active beacons的含义（方向引导/警告等）
   5. 排除passive beacons的干扰
   6. 基于历史 $h_t$ + goal views $\mathcal{V}$ + beacon信息 → 决策下一步
   7. 到达目标区域后发出停止动作

### Q2: 与Spatial AGI的关系

1. **如何理解和表示空间**

   VoLN对空间的表示是独特的——**完全去中心化的空间认知**：
   
   - **无全局坐标**：agent不知道自己在世界坐标系中的位置
   - **无全局地图**：agent没有先验的环境地图
   - **视觉目标空间**：通过goal views隐式指定空间目标，需要进行跨视角空间匹配
   - **场景线索空间**：通过beacons提供局部的方向和决策信息
   
   这种设置更接近生物的空间认知方式——人类在不熟悉的环境中也是靠视觉地标而非GPS导航。

2. **如何处理空间关系**

   - **跨视角空间匹配**：当前观测 vs goal views，判断是否接近目标——需要理解不同视角下同一场景的对应关系
   - **时序空间推理**：通过历史 $h_t$ 累积空间证据，整合跨时间的导航线索
   - **线索选择**：在active beacons（有用）和passive beacons（干扰）之间做选择性利用
   - **3D连续空间**：UAV在连续3D空间中运动（位置+高度+朝向），非网格世界

3. **对Spatial AGI的启发**

   **关键启发1：移除语言接口暴露真正的空间智能**
   
   VLN中的语言指令实际上代理了大量空间推理工作——"左转100米后右转"直接提供了空间决策。VoLN移除这些"作弊"通道后，暴露了当前模型在纯视觉空间推理上的真实水平——成功率极低（Hard 1.8%）。

   **关键启发2：长时程空间记忆是核心瓶颈**
   
   VoLN的Hard episodes（>450m路径）成功率仅1.8%，说明长时程空间记忆（记住走过的路、看到的标志、做出的决策）是Spatial AGI的关键挑战。

   **关键启发3：场景线索理解 > 路线记忆**
   
   VoLN通过beacons模拟了现实世界中的导航标志（路标、箭头、地标），要求agent能"读懂"这些场景线索。这种能力对真实世界的Spatial AGI系统（如UAV delivery、搜救）至关重要。

4. **可以应用的Spatial AGI场景**

   - **无人机自主导航**：GPS缺失环境下的UAV导航（室内、地下、丛林）
   - **搜救机器人**：在未知环境中搜索目标的场景
   - **自主探索**：没有先验地图的环境探索
   - **视觉重定位**：通过视觉匹配确定是否到达目标位置

### Q3: 创新点和局限性

**创新点**：
- **新范式的提出**：VoLN移除了VLN中的语言作弊通道，暴露了真正的空间导航能力
- **大规模基准**：7,210 episodes覆盖17种环境，路径长度达300-450m+
- **Beacon系统设计**：active/passive beacons的区分测试了agent的线索判别能力
- **连续3D空间**：突破了VLN中常见的离散导航图设定
- **初始基线提供**：VoLN-MLLM为后续研究提供了参考

**局限性**：
- **极低成功率**：Test-Unseen Easy仅7.4%，Hard仅1.8%——基准可能过于困难
- **仅UAV验证**：范式未在地面机器人、室内导航等其他场景验证
- **Beacon设计人工化**：active/passive beacons的区分较为人为，真实世界中没有如此明确的分类
- **缺少全局评估**：success rate低但缺少对部分成功的分析（如到达目标附近但未停止）
- **VoLN-MLLM较简单**：基线方法相对简单，未使用最新的MLLM/World Model技术

**与其他VLN基准对比**：

| 基准 | 路线信息 | 全局信号 | 空间类型 | 路径长度 |
|------|---------|---------|---------|---------|
| **VoLN-UAV** | 无（仅局部beacons） | 无GPS/地图 | 连续3D | 300-450m+ |
| AerialVLN | 语言指令 | 无 | 连续3D | 中等 |
| R2R | 语言指令 | 无 | 离散图 | 短 |
| CityNavAgent | 语言+地图 | 地图 | 连续3D | 长 |

---

## 核心技术发现

### 发现1：7.4%/4.5%/1.8%的含义

VoLN-MLLM在Test-Unseen上的成功率极低，这意味着：
- 跨视角目标匹配（当前观测 vs goal view）仍然非常困难
- 长时程证据累积（记住历史决策和观测）超出当前模型能力
- 在未见过的环境中泛化是根本性挑战

### 发现2：Beacon的可发现性问题

Agent需要在egocentric观测中检测和解读beacons，但：
- 环境中有~150个passive beacons干扰
- Active beacons只有3-5个
- 不同beacon类别（方向引导/警告/干扰/上下文）需要不同的解读策略
- 这是一个高难度的视觉-语义推理任务

### 发现3：连续3D空间的挑战

不同于VLN中常见的离散导航图（在节点间选择边），VoLN-UAV要求在连续3D空间中输出连续控制指令。这对空间推理的要求更高——需要理解距离、高度、方向的连续变化。

---

## 与Spatial AGI的关系

### 直接贡献
1. **暴露空间智能的真实水平**：移除语言作弊后的纯视觉空间导航极难
2. **长时程空间记忆基准**：VoLN-UAV提供了评估长时程空间记忆的工具
3. **去中心化空间认知**：模拟生物导航方式，更接近Spatial AGI的终极目标

### 技术启发
1. **纯视觉空间推理是基础**：Spatial AGI系统不能依赖语言接口来代理空间推理
2. **线索发现与选择**：在复杂环境中识别有用的空间信息是关键能力
3. **连续3D运动**：Spatial AGI需要处理连续3D空间而非离散图

### 应用场景
- **UAV delivery**：无GPS信号的室内/地下/丛林配送
- **搜救**：在通信中断环境下的自主搜救
- **探索**：未知环境（洞穴、废墟、水下）的自主探索
- **行星探测**：无GPS基础设施的外星表面导航

---

## 个人思考

### 最令人兴奋的发现

**1.8%的Hard成功率**是最令人兴奋（也最令人警醒）的发现。这说明当我们真正移除语言接口的"作弊"通道后，当前最先进的MLLM在纯视觉长时程空间导航上的表现接近随机。这为Spatial AGI研究指明了明确的改进方向：长时程空间记忆和跨视角视觉匹配。

### 潜在局限

- Beacon系统虽然创新，但与真实世界的路标系统有较大差距——真实世界没有如此明确的active/passive分类
- Unreal Engine+AirSim仿真环境的视觉真实度有限
- 缺少对导航策略的可解释性分析——不知道agent为什么失败
- 没有测试使用最新MLLM（如GPT-4o、Gemini）或World Model的上限

### 与昨日研究的关联

昨天分析的**MissionBench**（07-28_04）也涉及UAV的零样本导航，但通过MLLM agents。VoLN提出了更根本的问题：不依赖MLLM的语义推理，仅凭视觉能否导航？两者形成了有趣的对比——MissionBench测试MLLM在UAV任务中的推理能力，VoLN测试纯视觉空间智能。

---

## 关键数据

### 基准统计

| 分割 | Episodes | 环境数 |
|------|---------|--------|
| Train | 5,047 | 12 |
| Val-Seen | 1,082 | 5（训练环境子集） |
| Test-Unseen | 1,081 | 5（新环境） |
| **总计** | **7,210** | **17** |

### 性能结果（Test-Unseen）

| 难度 | 成功率 | 路径长度 |
|------|--------|---------|
| Easy | 7.4% | <300m |
| Normal | 4.5% | 300-450m |
| Hard | 1.8% | >450m |

### Beacon配置

| 类型 | 数量 | 功能 |
|------|------|------|
| Active beacons | 3-5 per episode | 方向引导、飞行警告 |
| Passive beacons | ~150 per environment | 语义干扰 |
| Beacon类别 | 4种 | 方向/警告/干扰/上下文 |

---

## 总结

### 核心发现总结

VoLN提出了一个挑战性的新导航范式——仅凭视觉目标和局部场景线索完成长时程导航。VoLN-UAV基准（7,210 episodes）揭示了当前方法在纯视觉空间导航上的极端困难（Hard成功率1.8%）。这一基准为Spatial AGI系统的空间推理、长时程记忆和跨视角匹配能力提供了严格的评估工具。

### 对Spatial AGI的意义

VoLN暴露了Spatial AGI的核心短板：当移除语言接口后，纯视觉空间导航能力极低。这意味着Spatial AGI需要：
1. **更强的视觉空间推理**：跨视角匹配、3D空间理解
2. **更好的长时程记忆**：持续累积空间证据
3. **线索发现能力**：在复杂环境中识别有用的空间信息
4. **去语言化的空间认知**：不依赖语言描述的空间理解

---

**文档创建时间**: 2026-07-29  
**分析方法**: arXiv HTML深度阅读 + 3个核心问题分析  
**文档行数**: ~230行
