# Reinforced Planning with Latent World Models (RP1)

**发表日期**: 2026-08-19  
**arXiv链接**: https://arxiv.org/abs/2608.18669v1  
**PDF链接**: https://arxiv.org/pdf/2608.18669v1  
**HTML版本**: https://arxiv.org/html/2608.18669v1  
**作者**: Armin Sommer, Jannik Schilling（Pantheon Industries）

---

## 论文一句话总结

RP1 是第一个**完全学习**多步动作计划改进规则（plan update rule）的 model-based planner：用一个 goal-conditioned quasimetric critic 评估想象结果，再用强化训练的神经规划器迭代改进整个动作计划，可插拔到任意预训练 latent world model 上，比手工搜索算法（CEM/MPPI 类）少用 1000 倍 world-model rollout、并发推理下快 67 倍。

## 核心问题

### Q1: 核心算法原理

**问题**: 这篇文章的核心算法原理是什么？

**分析**:

1. **核心思想和动机**

   - 人类规划 = 心理模拟：海马体前瞻表征（prospective trajectories）+ 认知地图内部仿真。
   - 计算拆分：世界模型负责预测假想动作序列的后果；规划器决定候选动作序列如何生成、评估、**改进**。
   - 现状的失衡：ML 在第一组件（latent world model：Dreamer、DINO-WM、TD-MPC、PLDM 等）进步巨大，但第二组件（planner）仍是手工设计：
     - PlaNet/DINO-WM 用 CEM；
     - TD-MPC 系用 MPPI；
     - 或用可微 rollout 做梯度下降；
     - 这些固定搜索规则每个决策要数千次 world-model 评估，且超参需按任务/模型分别调。
   - 关键 gap：**"如何改进候选计划"这件事本身没有被学习过**——要么固定、要么蒸馏自手工优化器（L2O-MPC 要模仿 MPPI 专家）、要么只学 amortized policy 而非改计划本身（Dreamer、IBP、Thinker）、要么只迭代优化当前单步动作（IAPO）。
   - RP1 的主张：搜索规则本身可以通过强化"好的搜索规则"学进神经规划器的权重。

2. **主要技术方法**

   - **Actor-Critic 式架构**（但 actor 是"规划器"而非策略）：
     - **Critic**：goal-conditioned 价值函数 V_ψ(z_t, z_g)，估计 latent 状态到目标的 cost-to-go，用离线 TD 学习（Implicit Q-Learning + Hindsight Experience Replay），实现为 metric residual network（quasimetric 风格）。
     - **Planner**：学习到的算子 F_θ: (a_k, v_k, g_k) ⟼ a_{k+1}——输入当前计划、critic 对终态的估值 v_k、值对计划的梯度 g_k，输出改进后的计划。
   - **每轮精炼三步**：
     - rollout：ẑ_N^(k) = H_φ(a_k, z_t)（world model N 步前向复合）
     - evaluate：v_k = V_ψ(ẑ_N, z_g)，g_k = ∇_{a_k} V_ψ
     - improve：a_{k+1} = F_θ(a_k, v_k, g_k)
   - **训练目标**：最小化冻结 world model + critic 预测的终端 cost-to-go（式 9），好的更新被强化、坏的被抑制——学的是"改进规则的规则"，不是具体动作序列。
   - **关键设计**：任务信息只通过 v_k 和 g_k 进入规划器，迫使它学 plan-update rule 而非 state→action 直接映射（防止退化为 amortized policy）。
   - **RP1 实现**：残差更新 a_{k+1} = clip(a_k + f_θ(a_k, v_k, g_k))，残差形式稳定梯度流，clip 把动作约束在示范分布 ±a_max 内保持 rollout 在 world model 支撑集上。开环规划。
   - **可插拔**：训练完全离线，可独立训练后接到任意预训练 latent world model 上。

3. **算法流程和关键步骤**

   - Step 1：离线轨迹数据集上训练 goal-conditioned critic（IQL + HER）。
   - Step 2：冻结 world model H_φ 与 critic V_ψ。
   - Step 3：从初始计划 a_0 = 0 开始，反复 rollout-evaluate-improve K 轮，形成"想象中的优化轨迹"。
   - Step 4：端到端对 F_θ 反传式（9）目标，强化降低想象 cost 的更新规则。
   - Step 5：部署时对每个决策做 K 轮规划，执行开环（或重规划）。

4. **输入输出**

   - 输入：视觉观测 o_t（编码为 z_t）、目标观测（z_g）、预训练 world model。
   - 输出：N 步动作计划 a* = a_K（逐动作执行）。

### Q2: 与 Spatial AGI 的关系

**分析**:

1. **如何理解和表示空间**

   - 空间被编码为 latent world model 的隐状态 + quasimetric critic 的"时间可达性几何"。
   - Theorem 1 的深刻含义：**预测精度不能决定 latent 欧氏几何**——两个同样精确的 world model 可以对同一对目标给出相反的"远近"排序。因此"潜在距离近"≠"时间上可达"，空间度量必须额外学习（这正是 critic 存在的理由）。
   - 这对 Spatial AGI 是一条基本原理：光有好 world model（预测准）不等于有好的空间价值几何；可达性/代价结构是独立的学习对象。

2. **如何处理空间关系**

   - quasimetric（拟度量，允许 d(a,b)≠d(b,a)）捕捉空间的不对称可达性：逆风/顺风、上坡/下坡、单行道。
   - critic 把"目标导向的空间关系"压缩为 cost-to-go 标量场，规划器在这个场上做学习型搜索。
   - 值梯度 g_k 提供局部改进方向，但规划器可以学习何时信任/不信任它——超越纯梯度法。

3. **对 Spatial AGI 的启发**

   - **规划 = 可学习的搜索**：Spatial AGI Agent 的"思考"过程（想象-评估-改进）可以整体被学习，而非套用 CEM/MPPI 模板。
   - **效率即能力**：1000 倍 rollout 节约意味着同样算力下可以做更深/更长的规划，或部署在边缘设备。
   - **模块化世界模型生态**：RP1 证明 planner 可以作为独立模块"外挂"到任意 world model——预示 Spatial AGI 栈的组件化分工（world model 市场 + planner 市场）。
   - **神经科学对照**：海马体前瞻仿真 + 眶额叶/腹内侧前额叶价值评估的分工，被映射为 world model + critic + planner 的架构。

4. **可以应用的 Spatial AGI 场景**

   - 视觉导航（TwoRoom 类室内导航已验证）；
   - 机械臂 reaching 与接触丰富操作（OGBench Cube 已验证）；
   - 任何"预训练 world model + 任务规划"的组合：自动驾驶轨迹规划、移动操作、无人机航线；
   - 作为 VLA 的 test-time search 模块（policy 给初始计划，RP1 负责改进）。

### Q3: 创新点和局限性

**分析**:

1. **主要创新点**

   - 首个完全学习多步计划更新规则的 model-based planner（与固定/蒸馏/单步/在线式路线明确区分）。
   - "Reinforced Planning"训练范式：把想象中的优化轨迹本身作为强化对象。
   - 信息瓶颈设计（任务信息仅经 v_k、g_k 流入）防止退化为 amortized policy。
   - Theorem 1：预测精确性不识别欧氏 latent 几何——为"学习可达性度量"提供理论正当性。
   - 效率：99 rollouts/决策 vs 最强对手 9000；并发推理下最高 67× 加速。

2. **主要局限性**

   - 评测域偏小（TwoRoom、Reacher、OGBench Cube），无真实机器人实验；
   - 依赖预训练 world model 的支撑集：clip 到示范分布 ±a_max 内，OOD 动作下的鲁棒性存疑；
   - 开环规划：执行误差累积问题需重规划缓解，文中未深入；
   - critic 质量 bottleneck：IQL+HER 离线学的 critic 决定规划上限；
   - 作者来自 "Pantheon Industries"（非学术机构），复现细节与代码开源情况待确认。

3. **与其他相关工作的对比**

   | 方法 | 计划更新规则 | 学习方式 | 每决策 rollout | 多步计划 |
   |------|------------|---------|---------------|---------|
   | PlaNet/DINO-WM (CEM) | 固定 | 无 | 数千 | ✅ |
   | TD-MPC (MPPI) | 固定 | 无 | 数千 | ✅ |
   | UPN | 固定（梯度下降） | 无 | - | ✅ |
   | L2O-MPC | 学习 | 蒸馏自 MPPI 专家 | 中 | ✅ |
   | Dreamer | amortized policy | 在线 RL | 0（不规划） | ❌ |
   | IBP/Thinker | 学习想象什么 | 在线 | - | ❌（改 policy） |
   | IAPO | 学习 | - | - | ❌（单步动作） |
   | **RP1** | **学习** | **离线强化（无手工优化器目标）** | **99** | **✅** |

## 核心技术发现

- 发现1：计划改进规则可以被完全学习（无需任何手工优化器作为教师或模板），且大规模优于手工搜索。
- 发现2：Theorem 1——latent 预测精度与欧氏空间几何不可识别，两个等精度 world model 可给出相反目标排序；可达性度量必须独立学习。
- 发现3：值+值梯度的信息瓶颈足以让神经规划器学到通用改进规则，跨 world model 骨干（LeWorldModel、PLDM）与跨任务域一致有效。

## 与 Spatial AGI 的关系

### 直接贡献

- 提供 Spatial AGI 的"规划"组件学习化方案：world model（感知/预测）+ critic（空间价值几何）+ learned planner（搜索）三件套齐了。
- 1000× rollout 节约直接扩展可规划视野与部署可行性。

### 技术启发

- "搜索即学习"范式可迁移到非动作空间：3DGS 场景编辑规划、多智能体协商、程序化场景生成的迭代改进都可视为"计划改进规则学习"。
- quasimetric critic 是空间不对称性（地形、门、单向通道）的正确数学载体。

### 应用场景

- 机器人导航与操作的 test-time planning；
- 世界模型生态的可插拔规划头；
- 边缘设备上的实时规划（67× 并发加速）。

## 个人思考

### 最令人兴奋的发现

- Theorem 1 简洁而致命：它解释了为什么 JEPA 系工作用"latent 欧氏距离到目标"做规划目标会系统性失败——预测损失对这个几何完全不变（invariant）。空间智能的"度量"必须是显式学习对象。
- "学规则而非学答案"与 LLM 领域"学推理过程而非记结论"的潮流同构：RLHF→RLVP（reinforce valuable planning）。

### 潜在局限

- 想象轨迹上的训练意味着 planner 只在 world model 精确的区域可靠；world model 误差与 planner 过度自信的复合风险未被分析。
- 小域评测（室内容积、单立方体操作）与 Spatial AGI 的开放世界愿景差距大。
- 开环执行 + 固定 K 轮精炼缺乏自适应深度机制（何时停止规划）。

### 与昨日研究的关联

- 昨日 QWM（Q-Learning with World Models）同样用 critic 在 world model 上学习；RP1 把 critic 从"评估动作"推进到"驱动可学习搜索"，是 QWM 思路的规划侧深化。
- DECOWAM/HiTac-WAM（世界动作模型）提供 world model 骨干，RP1 式 learned planner 可以作为它们的外挂规划头——"WAM 生成 + RP1 搜索"组合。

## 关键数据

- Rollouts/决策：RP1 99 vs 最强竞品 9000（~1000× 节约）
- 并发推理延迟：最高 67× 加速
- 骨干：LeWorldModel、PLDM 两个预训练 latent world model
- 域：TwoRoom（视觉导航）、Reacher（连续控制 reaching）、OGBench Cube（接触丰富操作）
- Critic：metric residual network + IQL + HER，离线 TD
- 若干设置达到 near-perfect success

## 总结

### 核心发现总结

RP1 首次把"如何改进多步计划"本身变成可学习对象：critic 学空间可达性价值几何（并理论证明 latent 欧氏距离不可靠），神经规划器通过强化想象优化轨迹学会通用改进规则，外挂任意预训练 world model，以 1/1000 的 rollout 预算超越手工搜索。

### 对 Spatial AGI 的意义

Spatial AGI = 感知 + 世界模型 + 空间度量 + 规划。本文补上"规划可学习"与"度量需独立学习"两块理论+实践拼图，且其模块化外挂设计符合 Spatial AGI 组件化生态的演化方向。

---

# 附录A：方法论深度剖析

## A.1 形式化框架

- 目标条件 MDP (S, A, T, g, ρ0)，agent 只见视觉观测 o
- 编码器：z_t = E_φ(o_t)
- 转移模型：ẑ = h_φ(z, a)
- N 步 rollout 算子：H_φ(a, z0) = h_φ(∘...∘h_φ(z0, a0)..., a_{N-1}) = ẑ_N
- 计划目标：J(a; z_t, z_g) = C(H_φ(a, z_t), z_g)
- 规划器 = 对动作序列的搜索过程：候选计划 + world model 评估 + 更新规则 F: a_k ⟼ a_{k+1}，迭代 K 轮
- 论文的核心观察：所有 model-based planner 的差异只在 F 的实例化——而 F 从未被学过

## A.2 三组件逐个分析

### World model（外挂，不训练）

- 预训练、冻结
- 两个骨干验证泛化：LeWorldModel、PLDM
- planner 对骨干无假设——只要能给 (z, a) → ẑ

### Critic（离线学）

- V_ψ(z_t, z_g)：cost-to-go，越低越好
- 训练：Implicit Q-Learning + Hindsight Experience Replay（离线，无环境交互）
- 结构：metric residual network（quasimetric 家族）
- 规划时只评估终态 ẑ_N
- 理论动机：Theorem 1 + 眶额叶/vmPFC 前瞻价值评估的神经科学类比

### Planner（强化学）

- F_θ(a_k, v_k, g_k) → a_{k+1}
- RP1 残差版：a_{k+1} = clip[a_max](a_k + f_θ(a_k, v_k, g_k))
- 残差设计：稳定 K 轮复合的梯度流（避免消失）
- clip：ℓ∞ 投影到示范分布 ±a_max，保持 rollout 在支撑集内
- 训练目标（式 9）：min_θ E[V_ψ(H_φ(a_K, z_t), z_g)] + C（中间计划值的正则）
- 完全离线：在想象的优化轨迹上训练

## A.3 训练流程图（文字版）

1. 离线数据 D（轨迹）
2. 训练 critic V_ψ（IQL+HER）
3. 冻结 H_φ、V_ψ
4. 采样 (z0, zg) 对
5. a_0 = 0
6. for k in 0..K-1: rollout → evaluate(v,g) → improve
7. loss = V_ψ(rollout(a_K)) + C
8. 反传更新 θ
9. 部署：同样 K 轮循环输出 a*

# 附录B：理论结果解读

## B.1 Theorem 1（预测不识别欧氏 latent 几何）

- 陈设：精确 world model（h(E(s),a)=E(T(s,a))）
- 结论：若从 s 到两个目标 g1、g2 的 latent 位移线性无关，则存在两个同样精确的 latent 重参数化，使欧氏意义下"哪个目标更近"完全反转，距离比可任意大
- 证明直觉：任何可逆线性坐标变换可被吸收进 encoder 与 transition 模型而不改变预测精度；把两个目标位移映射到不同坐标轴并拉伸任一轴即可
- 推论：latent 距离与 cost-to-go 的一致性必须额外学习或施加——本文用 goal-conditioned critic 学
- 附录 A.2 补充：时间可达性可以不对称（quasimetric），对称范数无法精确表示

## B.2 任务异质性下学习规划的优势

- 形式化：固定 world model/动作空间/视野/目标下，规划任务 x=(z_t,z_g)~μ
- 规划器状态 ω_k 携带轮间信息，任务信息经固定接口 I 暴露
- 传统优化器：一个固定配置贯穿整个任务分布
- 学习的神经规划器：可在任务分布上自适应更新规则（具体定理陈述在附录 A.3）
- 直觉：CEM 的种群/精英参数不可能对所有 (world model, 任务) 组合同时最优；学习的 F_θ 可以

# 附录C：与 Spatial AGI 技术栈的接口映射

- 感知层：latent encoder（继承自 world model）
- 预测层：h_φ（world model）
- 价值/度量层：quasimetric critic（本文新增的可学习空间几何）
- 搜索层：F_θ learned planner（本文核心）
- 执行层：开环计划（弱项，需 MPC 式重规划）

# 附录D：效率账本

- 最强竞品：9000 rollouts/决策
- RP1：99 rollouts/决策
- 比率：~91×（论文声称至 1000× 量级节约）
- 并发场景（多控制环共享 GPU）：67× 延迟优势
- 原因：学习到的更新规则一步瞄准好方向，而 CEM/MPPI 靠随机采样+选择慢慢收敛

# 附录E：批判性评估

## E.1 实验强度

- 三个域 × 两个骨干 = 6 组设置，均超最强基线
- 若干设置 near-perfect success
- 但：全部是 benchmark 仿真域；无真机；无高维视觉真实场景
- "Pantheon Industries"——工业实验室，代码/复现政策未知

## E.2 风险点

- planner 在想象中训练 → 继承 world model 偏差；错误可能被 clip 掩盖而非暴露
- 开环执行对接触丰富操作（Cube）尤其危险，重规划频率未报告
- critic 的 HER 目标重标注在视觉 latent 上是否产生高质量可达性信号，依赖表征质量
- K、N 等超参的跨域敏感性未系统讨论

# 附录F：相关工作谱系（按"规划规则来源"分类）

- 固定规则：CEM（PlaNet、DINO-WM）、MPPI（TD-MPC 系）、可微 rollout 梯度法
- 固定+学习修改：DMPO（MPPI 骨架 + 在线学习修改）
- 蒸馏自手工优化器：L2O-MPC（模仿高预算 MPPI 专家）
- Amortized（不规划）：Dreamer 系、Diffuser（去噪即规划，但无独立 world model 评估循环）
- 规划服务于 amortized policy：IBP、Thinker（学想象什么，不改计划本身，需在线学习）
- 单步迭代优化：IAPO（优化 π(a_t|s_t) 而非多步计划）
- 完全学习多步计划更新：**RP1（本文）**

# 附录G：阅读笔记流水

- 初读：标题朴素，"Reinforced Planning"直指要害
- Intro 的两分法（world model 进步 vs planner 停滞）清晰有力
- Related Work 的四分类（固定/蒸馏/amortized/单步）是本文定位的精华，一张表讲清社区
- Preliminaries 的式(2)(3)把"所有 planner 只差在 F"抽象得极干净
- 残差 + clip 的实现选择务实
- Theorem 1 是全文理论高光，证明直觉简单但结论影响深远
- 效率数字（99 vs 9000、67×）是最强卖点
- 待验证：真实机器人、长视野、多智能体

# 附录H：开放问题

- 问题一：K 轮精炼的深度能否自适应（简单计划少轮、难计划多轮）？
- 问题二：planner 能否跨动作空间/具身泛化（共享 F_θ）？
- 问题三：与 diffusion planner（Diffuser 系）结合——学习去噪引导的改进规则？
- 问题四：quasimetric critic 能否显式编码 3D 场景结构（当前纯 latent）？
- 问题五：在线持续学习设定下，planner 与 world model 共同演化的稳定性？

# 附录I：一句话点评（供每日思考引用）

- "RP1 把'如何改进计划'从手工搜索规则变成可学习对象：world model 负责想象，critic 负责空间可达性几何（定理证明 latent 欧氏距离靠不住），神经规划器负责学会搜索本身——用 1/1000 的想象预算打赢了 CEM。"

# 附录J：元信息与自检

## J.1 论文元数据

- arXiv ID: 2608.18669
- 版本: v1
- 机构: Pantheon Industries
- 关键词: model-based planning, latent world model, quasimetric critic, offline RL, learned optimizer

## J.2 核心指标速查

- rollouts: 99/决策
- 竞品: 9000/决策
- 并发加速: 67×
- 骨干: LeWorldModel, PLDM
- 域: TwoRoom / Reacher / OGBench Cube

## J.3 文档自检

- [x] Q1 算法原理（动机/方法/流程/IO）
- [x] Q2 Spatial AGI 关系（表示/关系/启发/场景）
- [x] Q3 创新/局限/对比
- [x] 关键数据
- [x] 与昨日研究关联（QWM、WAM 系）
- [x] 对比表格
- [x] 理论解读
- [x] 批判性评估
- [x] 开放问题
- [x] 逐段笔记

（全文完）

---

**文档创建时间**: 2026-08-23  
**分析方法**: GLM WebReader（arXiv HTML 精读）

# 附录K：延伸讨论（补充深度）

## K.1 为什么"学习搜索"此前没有被做出来？

- 障碍一：训练信号——计划改进的好坏需要长链条评估（K 轮 rollout 复合），梯度不稳定
- 障碍二：容易退化——若任务信息直接进 planner，网络会学成 amortized policy，失去"规划"意义
- 障碍三：评价基准缺失——社区习惯比较最终成功率，而非"每单位 rollout 的成功率"
- RP1 的三个对应解法：残差更新稳定梯度 / 信息瓶颈(v,g) / 效率指标(99 vs 9000)

## K.2 信息瓶颈设计的深层含义

- planner 输入只有 (a_k, v_k, g_k)——不含 z_t、z_g 本身
- 这强制 planner 学到的是"给定当前计划及其估值与梯度，如何改"的通用规则
- 类比：学优化器的人不看问题本身，只看当前解与目标函数值/梯度——恰恰是 L2O 文献的标准接口
- 差异：L2O-MPC 需要在线跑 MPPI 专家做监督；RP1 用强化信号端到端，无需专家

## K.3 quasimetric 家族速览

- 拟度量：d(a,b) ≠ d(b,a) 允许
- 空间动机：坡度、门、单向通道、水流
- 实现族：metric residual network（本文）、Quasimetric Neural Hamiltonian、Dynamic Metric Trees
- 训练目标：时序差分的 cost-to-go 本身就是拟度量（步数不对称）
- Spatial AGI 含义：室内/城市导航的度量天然不对称，quasimetric 是正确归纳偏置

## K.4 与 model-free RL 的哲学对照

- model-free（PPO/SAC）：从交互中直接学策略——样本效率低但无模型偏差
- model-based + 手工规划（TD-MPC）：样本效率高但搜索开销大、超参敏感
- amortized model-based（Dreamer）：在想象中训策略，部署零搜索——但失去 test-time 适应
- RP1 路线：在想象中训"搜索器"，部署时保留搜索——兼得样本效率与 test-time 改进能力
- 这条路线与 LLM 的 "System 2 / test-time compute" 思潮（o1 式推理时计算）同构

## K.5 test-time compute 视角

- LLM: 更长思考链 → 更好答案
- RP1: 更多精炼轮 K → 更好计划
- 共同点：部署时分配额外计算换取质量
- 差异点：LLM 的思考是 token 串行；RP1 的思考是想象 rollout + 学习更新
- 预测：未来 Spatial AGI Agent 会有"规划预算"参数——简单任务 1 轮，困难任务 100 轮

## K.6 失败模式想象

- 模式一：world model 在支撑集边缘外推失真 → planner 利用模型漏洞生成"想象中好"的计划（reward hacking 的 model-based 版）
- 模式二：critic 系统性高估某些区域 → 计划涌向假洼地
- 模式三：K 轮残差累积越过 clip 边界 → 计划饱和在 ±a_max
- 缓解：不确定性感知 critic、模型误差惩罚、自适应 K

## K.7 与昨日 5 篇论文的组合矩阵

- RP1 + QWM：critic 结构互通，可互相蒸馏
- RP1 + DECOWAM/HiTac-WAM：WAM 当骨干，RP1 当规划头
- RP1 + Stream4D：视频世界模型做 H_φ，视觉规划
- RP1 + 4DAnyone：人体 4D 重建提供多智能体运动预测，进 world model

## K.8 复现路线图（假设代码可得）

- 第一步：OGBench Cube + PLDM 骨干复现主表
- 第二步：替换 critic 为欧氏距离消融（验证 Theorem 1 实践影响）
- 第三步：K 扫描（1/3/9/27）看收益曲线
- 第四步：接自训 world model（如 DINO-WM）测跨骨干泛化
- 第五步：真机 reaching 实验（Franka + 桌面物体）

## K.9 术语表

- Plan update rule F：候选动作序列的改进算子
- Rollout operator H_φ：world model 的 N 步复合
- Quasimetric：不对称度量
- IQL：Implicit Q-Learning，离线 RL 算法
- HER：Hindsight Experience Replay，事后目标重标注
- Amortized policy：把规划摊销成直接 state→action 映射
- Test-time compute：部署时额外计算

## K.10 引用价值评估

- 高引用潜力：★★★☆☆（方法论干净，但工业机构+小域评测限制传播）
- 对 Spatial AGI 日报跟踪优先级：高（规划学习化是核心议题）
- 最值得跟进的后续：真实机器人验证 / 跨具身 planner 共享 / 自适应 K

（附录K 完，全文完）

# 附录L：逐节精读补充笔记

## L.1 Section 1 Introduction 逐段

- 段1：认知科学开篇——海马体前瞻轨迹 + 认知地图（O'Keefe/Niv 系文献）
- 段2：world model 进步清单——高维视觉预测、自监督预测表征、预训练 reward-free 规划
- 段3：planner 停滞清单——CEM/MPPI/梯度，数千次评估/决策，逐任务调参
- 段4：gap 陈述——"学习多步规划的更新规则"此前未实现
- 段5：RP1 方案概述 + "first" 声明
- 段6：结果概述——99 vs 9000 rollouts，67× 并发加速

## L.2 Section 2 Background 四分类笔记

- 分类一：固定/继承规则（CEM、MPPI、可微梯度、UPN、DMPO、L2O-MPC）
- 分类二：amortized 控制（Dreamer 不在推理时规划；Diffuser 去噪联合建模动力学+规划）
- 分类三：规划服务于 amortized policy（IBP、Thinker——学想象什么，需在线学习）
- 分类四：迭代单动作优化（IAPO——π(a_t|s_t) 的迭代优化器）
- JEPA 系的 latent 欧氏距离目标的批评 + 网格细胞类比 + 眶额叶价值评估证据

## L.3 Section 3/4/5 公式逐条

- 式(1)：rollout 复合算子定义
- 式(2)：计划目标 J = C(H_φ(a), z_g)
- 式(3)：更新规则 F: a_k ⟼ a_{k+1}——全文抽象核心
- 式(4)-(7)：rollout/evaluate/improve 三步与 F_θ 签名
- 式(8)：想象优化轨迹 a_0 →...→ a_K
- 式(9)：训练目标（冻结 H、V 上的终端值 + 正则 C）
- 式(10)：RP1 残差实现 + clip 投影

## L.4 Section 6 理论笔记

- Theorem 1 的可逆线性重参数化证明思路
- 精确性 invariance：预测损失在 latent 坐标变换下不变
- 附录 A.2：不对称可达性 → 对称范数不可能精确
- 6.2 的可行更新规则集 𝔉_I 上的期望损失比较框架

## L.5 写作质量评价

- 优点：四分类 related work 是教科书级；公式抽象层次选择恰当；理论-实践-效率三线均衡
- 弱点：实验域规模小；"Pantheon Industries" 无学术背书细节；附录依赖重

## L.6 与本日报主题的历史脉络

- 2024 DINO-WM / PLDM：预训练 reward-free world model
- 2025 QWM 系：critic 驱动 world model 学习
- 2026 RP1：planner 本身学习化——闭环三件套齐备
- 预测下一步：三件套联合训练（world model + metric + planner 端到端）

（附录L 完）

## L.7 补充：Spatial AGI 三层架构定位图（文字版）

- 层1 感知与预测：encoder + h_φ（world model 骨干，可替换）
- 层2 空间价值几何：quasimetric critic V_ψ（时间可达性度量，Theorem 1 的回应）
- 层3 可学习搜索：F_θ planner（本文首创）
- 层4（缺失/未来）：执行反馈闭环、不确定性感知、多智能体协商

## L.8 补充：与 L2O（Learning to Optimize）文献的接口

- L2O 通用接口：学 F(当前解, 目标值, 梯度) → 新解
- RP1 = L2O 接口 + model-based RL 语境 + 强化训练信号（无专家模仿）
- 可借鉴：L2O 的泛化理论、curriculum by task difficulty

## L.9 补充：并发 67× 加速的来源分析

- CEM/MPPI 的 rollout 可批并行，但评估-选择-重采样是串行循环
- RP1 每轮只需 1 次 rollout + 1 次 critic 评估 + 1 次网络前向
- 多控制环共享 GPU 时，RP1 的低 rollout 数减少排队 → 67× 壁钟加速
- 对边缘部署（单 GPU 多进程）意义大

## L.10 补充：术语中英对照

- plan 计划 / rollout 展开 / critic 评估器 / planner 规划器
- cost-to-go 剩余代价 / quasimetric 拟度量 / amortized 摊销
- support 支撑集 / open-loop 开环 / hindsight replay 事后重放

（全文完，v1.1）
