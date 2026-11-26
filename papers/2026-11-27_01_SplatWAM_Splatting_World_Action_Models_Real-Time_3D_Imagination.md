# SplatWAM: Splatting World Action Models for Real-Time 3D Imagination

**发表日期**: 2026-11-24
**arXiv链接**: https://arxiv.org/abs/2611.33467
**PDF链接**: https://arxiv.org/pdf/2611.33467v1
**HTML版本**: https://arxiv.org/html/2611.33467v1
**作者**: Frank Tsu-Fang Lu, Karthik Sundar Senthilkumar, Christopher Thirgood, Oscar Mendez, Simon Hadfield
**机构**: University of Surrey（英国）
**领域**: cs.CV / cs.LG / cs.RO（世界模型 + 3DGS + 机器人操作）

---

## 一句话总结

SplatWAM 是一个"在显式 3D 高斯基元空间中直接做生成式动力学预测"的世界动作模型：tokenizer 从无位姿多视角 RGB 前馈提举出固定预算的高斯 token，动力学模型以 action 为条件直接对下一帧高斯状态做扩散去噪（无需 latent 解码器），任意预测状态都能从任意视角光栅化渲染；在 OGBench Scene 上比视频世界模型快 12 倍（~80 FPS）且 PSNR 高 2.0 dB，1B 参数即可在 LIBERO 上超越 7B 的 WorldVLA / OpenVLA。

---

## 核心问题

### Q1: 核心算法原理

#### 1. 核心思想和动机

- **问题背景**：当前世界模型的主流路线是视频生成（像素空间）或 latent 空间预测。两者都有结构性缺陷：
  - **像素优先**：可能生成几何上不可能的预测；要得到可探索的 3D 世界状态还需要第二阶段的 feed-forward splatting 或逐场景提举；每个新视角都要再采样一次（常常是数十亿参数的模型）；像素策略对相机偏移敏感。
  - **latent 优先**：避开了像素生成，但不直接暴露 3D 状态，需要额外解码才能支持新视角渲染，几何一致性只能"学出来"而不能"结构性保证"——独立生成的多个视角可能在几何、遮挡、视差上互相矛盾，长 rollout 误差累积。
  - **4DGS 谱系**：保有显式可光栅化状态、直接建模运动，但它是逐场景优化、致密化到大量基元、没有生成先验，主要在"重建已观察到的运动"而非"预测可控的未来"。
- **核心主张**：世界模型的状态本身就应该是一个**紧凑、显式、可渲染的 3D 表示**（3D 高斯集合）。这样：
  1. 几何一致性由构造保证（所有视角共享同一状态）；
  2. 渲染无需学习解码器（确定性光栅化器）；
  3. 所有随机性集中在动力学模型中，可解释、可检查；
  4. 策略可以直接读 3D 状态而不是像素，天然对视角变化鲁棒。

#### 2. 主要技术方法

SplatWAM 由三个组件构成：

**（a）SplatWAM-T（tokenizer，提举器）**
- 输入：可变数量的无位姿 context views I_t。
- 骨干：VGGT（在自有数据上微调）编码 patch tokens；追加 N 个可学习的 query tokens。
- 小型 transformer 在联合序列上做 self-attention，线性头 h 在每个 query 位置解码出一个高斯基元，表达在以第一个 context view 为锚的 canonical frame 中。
- **固定 query 预算**：query 跨场景、跨时间步共享，query i 始终解码出基元 x_{t,i}——建立跨帧的固定索引约定（无需显式物理点对应）；token 数与图像分辨率和视角数解耦，状态大小恒定，使下游动力学学习可行。
- 训练目标（新视角合成）：
  - L_photo：像素重建（L2）+ LPIPS 感知损失；
  - L_geom：从 VGGT 自带的深度预测蒸馏深度和法向（中值比例 ρ_v 吸收教师未知尺度），保证几何接地（可靠 rollout 需要正确的接触与遮挡几何，仅光度损失可以在错误几何下最小化）；
  - L_reg：opacity coverage（基元覆盖全图）+ anisotropy（限制极端拉长）+ effective rank（惩罚近秩一基元），抑制稀疏视角前馈模型的"半透明针状"退化。

**（b）SplatWAM-D（动力学模型）**
- 直接在协方差经 log-Euclidean 坐标变换的高斯状态 ŝ_t 上预测未来。
- **Diffusion forcing**：训练窗口内每个时间步独立采样信号水平 τ_t，按 τ 加噪；因果 transformer 预测干净状态。逐帧独立加噪让模型在训练时暴露于不完美 context，缓解自回归 rollout 的训练-推理失配。
- **x-prediction** 缓解长 rollout 误差累积。
- **Shortcut forcing**（来自 Dreamer 4）：flow-matching 损失 + shortcut 一致性损失（一大步去噪匹配两小步），实现 K=1/d_t 步快速采样。
- **Classifier-free guidance 式 action dropout**：部分训练序列用可学习的 null action token 替换动作，使 D 同时学到 action-marginalized future（该 token 后被 P 复用）。
- 结构：每帧 N 个高斯 token + action token + τ token + 步长 token + register tokens；层内 within-frame self-attention 与跨帧因果 attention 交错。
- 推理：未来帧从噪声出发、shortcut 少步去噪；观察帧干净地给出（τ=1-d_min）；生成帧 re-noise 到 context 信号水平后作为后续预测条件。超出训练窗口时保留最近 T-1 个状态（(T-1) 阶 Markov 近似）并重排时间位置。

**（c）高斯专属的动力学建模设计**
- 3D 位置嵌入（利用高斯连续几何参数）；
- 渲染损失（可微渲染直接监督预测的高斯）；
- 协方差重参数化（log-Euclidean 坐标，使加性噪声/去噪在流形上合理）。

**（d）SplatWAM-P（策略头）**
- 在 D 的基础上加 agent tokens 和 flow-matching action head，预测-控制联合训练（L_π + L_SF 共享 backbone）。
- 目标 g 可以是目标图像（经 T tokenize 成高斯 token）或语言指令；输出 k 步 action chunk。
- 无需学习 value 函数即可匹配 HIQL。

#### 3. 算法流程和关键步骤

```
训练：
1. 阶段❶：训练 SplatWAM-T（NVS 目标：photo + geom + reg）
2. 阶段❷：冻结 T，训练 SplatWAM-D（diffusion forcing + shortcut forcing，渲染监督）
3. 阶段❸：联合训练 D 和 P（策略损失 + 世界模型损失共享 backbone）
推理：
4. T 把 context views 提举为高斯状态 s_t
5. 给定动作，D 单次前向去噪出 s_{t+1}（shortcut 少步）
6. 重复 H 次 → 高斯状态轨迹 s_{t+1:t+H}；任意状态可从任意视角渲染
7. P 读状态历史与目标 → 输出 action chunk
```

#### 4. 输入输出

- **输入**：无位姿 RGB context views（数量可变）+ 动作序列 +（策略模式）目标图像或语言指令。
- **输出**：显式高斯状态序列（每状态 N 个 14 维高斯：位置3+四元数4+尺度3+不透明度1+颜色3），可任意视角渲染；策略模式下输出动作块。

### Q2: 与Spatial AGI的关系

#### 1. 如何理解和表示空间

- SplatWAM 把"空间理解"的产物定义为**显式 3D 高斯场**而非隐向量或视频帧：空间 = 可从任意视角渲染、几何参数可检查的原语集合。
- "想象未来"= 在 3D 空间中演化原语，而不是在 2D 像素中演化——这是 Spatial AGI 最核心的立场：**内在状态必须是空间性的**。

#### 2. 如何处理空间关系

- 几何一致性不是靠学习（多视角一致性损失），而是靠**构造**（单一 3D 状态，多视角渲染同源）。
- 协方差的 log-Euclidean 处理体现了对空间量（旋转/各向异性尺度）的正确流形处理——空间智能系统需要"懂几何"的参数化和噪声模型。
- 固定 query 索引建立了跨时间的"伪对应"，是一种轻量的空间记忆机制。

#### 3. 对Spatial AGI的启发

- **"渲染器即世界接口"**：预测与观察共享同一个可微渲染器，使生成模型能被图像空间监督直接训练——这可能是 Spatial AGI 训练范式的关键一环（3D 状态生成 + 2D 渲染监督闭环）。
- **效率和具身价值的双赢**：3D 显式状态既让新视角渲染快 12 倍，又让策略输入比像素强 24.8 个百分点——空间表示不是"为了学术优雅"，而是直接转化为控制性能。
- **小模型大能力**：1B 高斯空间模型打过 7B VLA，说明空间结构是极强的归纳偏置，可能比堆参数更划算。

#### 4. 可以应用的Spatial AGI场景

- 机器人操作的"心理模拟"（mental simulation）：执行前在 3D 状态上 rollout 验证。
- 沉淀为导航/探索系统的可探索世界缓存（任意视角查询）。
- 仿真到真实（sim-to-real）的数据引擎：真实场景提举 + 动力学外推生成训练数据。
- 视频世界模型不可达的场景：需要精确几何/接触推理的任务。

### Q3: 创新点和局限性

#### 1. 主要创新点

1. **首个在紧凑高斯空间直接做生成式（扩散式）动作条件动力学的世界模型**——GWM 还要 latent 化、PointWorld 是确定性回归、4DGS-WAM 是单步对象变换，SplatWAM 是直接生成多步。
2. 无解码器架构：T 编码、D 预测、R 渲染、P 读同一组 N 个高斯，全链路共享状态。
3. 高斯专属动力学设计（log-Euclidean 协方差、渲染损失、3D 位置嵌入）。
4. 预测-控制联合训练的世界动作模型，策略直接吃 3D token。
5. 工程成果扎实：~80 FPS rollout、12× 加速、1B 打 7B。

#### 2. 主要局限性

1. 固定 N 的高斯预算限制了场景复杂度上限；大场景/长视频可能欠表达。
2. 动力学学习依赖操作类数据（OGBench/LIBERO），对流体、铰链复杂物理的泛化未知。
3. 高斯状态的"语义"缺失：没有物体级分解，长时序的物体持久性/交互推理可能弱于对象中心方法（如 MRO-GWM 的 SE(3) 对象运动）。
4. 依赖 VGGT 教师蒸馏几何，几何上限受教师制约。
5. (T-1) 阶 Markov 近似在长 horizon 上仍会遗忘早期场景结构。

#### 3. 与其他相关工作的对比

| 方法 | 状态 | 渲染 | 视角一致性 | 控制输入 |
|------|------|------|-----------|---------|
| 视频世界模型（VQ/diffusion） | 像素 | 需重采样 | 学出来，易崩 | 像素，视角敏感 |
| LPWM（latent particle） | 关键点 latent | 不可新视角 | 不适用 | latent |
| GWM | per-pixel 高斯→latent | 需解码，光栅化后退化差 | 弱 | latent |
| PointWorld | 点云确定性流 | 可渲染 | 构造保证 | 点 |
| 结构化4D latent（voxel flow-match） | voxel latent | 需解码成高斯 | 弱 | 需位姿RGB-D |
| **SplatWAM** | **紧凑高斯，生成式** | **免解码任意视角** | **构造保证** | **3D token，鲁棒** |

---

## 核心技术发现

- 发现1：把世界模型的状态定义为显式高斯场，可以同时改善渲染效率（12×）与策略性能（+24.8pp）——空间表示的价值是双重的。
- 发现2：diffusion forcing + shortcut forcing + x-prediction 的组合在 3D 原语空间同样有效，且渲染监督提供了 latent 方法不具备的密集训练信号。
- 发现3：log-Euclidean 协方差坐标让扩散噪声在几何流形上合理，是"几何正确"生成建模的必要细节。

## 与Spatial AGI的关系

### 直接贡献
提供了一个"内在 3D 状态 + 生成式动力学 + 任意视角查询"的世界模型完整实例，几乎就是 Spatial AGI 世界模拟层的原型机。

### 技术启发
- 渲染器作为统一接口（预测监督、观察模型、评估手段三合一）。
- 空间 token 作为策略输入优于像素。
- 几何流形上的扩散参数化方法可推广到其他空间表示（surfel、mesh、occupancy）。

### 应用场景
机器人操作预演、可交互数字孪生、导航世界缓存、数据引擎。

## 个人思考

### 最令人兴奋的发现

"1B 的 3D 空间世界模型打赢 7B VLA"是本周最有分量的数字。它印证了过去几天系列论文（World Action Model 谱系：CoT-WAM、Ego4Gen、MemoryWAM）反复出现的趋势——**世界模型正在从视频走向显式 3D 状态**。SplatWAM 把这条路线推到了最彻底的程度：连 latent 都不要了，直接在高斯上做扩散。

### 潜在局限

固定预算的 N 个高斯 + 操作台尺度的场景，离开 benchmark 后如何扩展到房间级、物体数百个的场景是最大问号。此外高斯状态缺乏物体语义，"把杯子放到架子上"这类语言条件控制只能靠 agent tokens 隐式对齐，长期可能需要与开放词汇语义层（如 3DGS 分割工作）结合。

### 与昨日研究的关联

- 昨天的 **RoboProbe**（物理合理性基准）正好可以用来压力测试 SplatWAM 的 rollout 是否物理合理；
- 昨天的 **SplatTok**（3DGS 场景级 token 压缩）与 SplatWAM-T 的"固定预算高斯 token"形成呼应：前者压缩静态场景，后者把"压缩式表示"用于动力学状态——两者结合可能得到可扩展的大场景世界模型；
- **ViewDreamer**（机器人世界模型任意视角生成）是视频路线的代表，SplatWAM 的 12×/2dB 数字可视作对它的直接挑战。

## 关键数据

- OGBench Scene：新视角渲染比视频世界模型快 12×（~80 FPS @ RTX 5090），PSNR 最高 +2.0 dB。
- 策略：8 个任务套件上，高斯 token 策略比像素策略最高 +24.8 pp；比 LPWM +12 pp；无 value 函数匹配 HIQL。
- LIBERO：~1B 模型超过 WorldVLA(~7B) 和 OpenVLA(~7B)（均无大规模机器人预训练时），匹配 OpenVLA-OFT。
- 状态：每帧 N 个高斯 × 14 维；模型 ~1B 参数。
- 代码与 checkpoint 计划开源。

## 总结

### 核心发现总结

SplatWAM 证明了"显式 3D 高斯状态 + 生成式动力学 + 渲染监督 + 3D token 策略"的完整闭环在真实机器人 benchmark 上全面优于像素/latent 路线，且计算高效。

### 对Spatial AGI的意义

这是 Spatial AGI 世界模拟层的里程碑式工作：空间智能系统不需要"先看视频再理解 3D"，而是可以**直接在 3D 中想象**。若与语义层、更大场景规模结合，这一架构有潜力成为通用空间世界模型的骨架。

---

**文档创建时间**: 2026-11-27
**分析方法**: arXiv HTML 全文精读
