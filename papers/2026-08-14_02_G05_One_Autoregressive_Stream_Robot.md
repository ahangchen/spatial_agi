# G0.5: One Autoregressive Stream for Robot Reasoning and Action

**发表日期**: 2026-08-12  
**arXiv链接**: https://arxiv.org/abs/2608.11739  
**PDF链接**: https://arxiv.org/pdf/2608.11739  
**HTML版本**: https://arxiv.org/html/2608.11739v1  
**作者**: Yicheng Liu, Zibin Dong, Baijun Ye, Tianyuan Yuan, Tao Jiang 等  
**机构**: Galaxea AI  
**基础模型**: Qwen3.5 2B  

---

## 论文摘要

当前VLA模型的主流方案是将预训练VLM与独立训练的flow-matching action expert耦合，使VLM仅充当上下文编码器而非决策者。G0.5挑战了这一范式，提出在单一transformer解码器中统一推理和动作生成——在单一自回归token流中同时输出推理链和动作指令。通过跨具身动作编解码器、原生思维链（CoT）和视觉记忆模块三个核心组件，G0.5在7个独立评测场景中超越了SOTA。

---

## 核心问题

### Q1: 核心算法原理

#### 1. 核心思想和动机

G0.5的核心论点：**VLM应该是行动者（actor），而不仅仅是条件编码器**。

当前VLM-as-encoder架构的根本问题：
- VLM的角色被降级为提供隐藏状态或KV cache给独立的action expert
- VLM的核心生成能力（思维链推理、上下文学习、prompt驱动的行为引导）只能通过压缩的条件瓶颈间接影响行为
- 当action expert的梯度回传到VLM时，会导致VLM的预训练能力退化（anti-forgetting问题）

G0.5的解决方案：回归自回归建模，但解决其原始瓶颈——过度的action token化。

#### 2. 主要技术方法

**(a) 统一跨具身动作编解码器 (Unified Cross-Embodiment Action Codec)**

- 学习型VQ tokenizer将不同自由度、控制频率和形态的机器人动作映射到共享token词汇表
- 与FAST（使用固定DCT管道分别处理每种具身形态）不同，G0.5的codec是端到端跨具身学习的
- 采用5部分固定维度布局（27维统一action token流），保留左/右对称性
- Active-part tokenization：对不活动的控制组省略token，而非填充

**(b) 原生思维链 (Native Chain-of-Thought)**

CoT和action共享同一个解码器、上下文和目标函数。四种推理原语：
- **Subtask**: 任务分解（如"open the drawer → pour walnuts → close drawer"）
- **BBox**: 物体定位（生成bounding box坐标）
- **Trace**: 2D末端执行器轨迹（受TraceVLA启发）
- **ActionHint**: 动作提示

关键区别：推理和动作不是分离的阶段，而是同一生成过程的耦合阶段。

**(c) 视觉记忆模块 (Visual Memory Module)**

通过视觉编码器注入多秒历史信息，为长时间跨度控制提供上下文。

#### 3. 算法流程

1. **输入**: 多视角RGB观测、具身ID、任务指令、本体感知状态
2. **条件段**: 多视角RGB → 视觉编码 → 视觉token + 具身ID + 指令token + 本体感知token
3. **生成段**: 可选CoT span（Subtask/BBox/Trace/ActionHint）→ action codes（展开为R轮残差，每轮8个action code）
4. **解码**: ActionCodec将离散code转换为连续电机命令

#### 4. 输入输出

- **输入**: {多视角图像, 具身ID, 语言指令, 本体感知}
- **输出**: {可选CoT推理, 离散action codes} → 连续电机命令

### Q2: 与Spatial AGI的关系

#### 1. 如何理解和表示空间

G0.5通过多种方式感知空间：
- **多视角视觉输入**: 从多个摄像头获取空间观测
- **Bounding Box预测**: 显式定位空间中的物体位置
- **末端执行器轨迹**: 2D轨迹预测体现空间路径理解
- **视觉记忆**: 多秒历史提供时间维度的空间连续性

但G0.5的空间理解主要还是2D视角层面的，缺乏显式的3D表示。

#### 2. 对Spatial AGI的启发

- **推理-行动统一**: 在Spatial AGI中，空间推理和空间行动也应该在同一框架内统一，而非分为独立的感知和执行模块
- **Prompt驱动行为**: 不同prompt可以直接改变action的粒度、任务时域和分布外场景处理——这对Spatial AGI的指令跟随至关重要
- **跨具身泛化**: 统一的动作编解码器概念可以推广到Spatial AGI中的多种agent形态

#### 3. 应用场景

- 通用机器人操作（家庭、工业）
- 长时程多步骤任务
- 跨具身机器人学习
- 指令驱动的空间导航和操作

### Q3: 创新点和局限性

#### 创新点

1. **回归自回归**: 在VLA领域成功论证了自回归建模的优越性——当VLM保持为actor时，推理能力可以直接服务于行动
2. **跨具身动作codec**: 学习型VQ tokenizer统一不同机器人形态，比FAST的DCT方案更灵活
3. **原生CoT**: 推理和action共享权重，不是bolt-on模块
4. **7项SOTA**: 98.9% LIBERO, 93.3% RoboTwin 2.0, 87.3% SimplerEnv-Bridge, 76.7% R1-Lite/R1-Pro, 31.4% BEHAVIOR Challenge

#### 局限性

1. **动作频率限制**: 自回归生成action token的频率可能不如flow-matching expert高
2. **2D空间理解**: 缺乏显式3D空间表示，对深度和3D空间关系的理解有限
3. **CoT质量依赖训练数据**: CoT模板需要大量多样化数据覆盖
4. **计算开销**: 单一自回归流处理所有任务，在简单任务上可能有冗余

#### 与相关工作的对比

| 方面 | G0.5 | π0.5 | OpenVLA | GR00T-N1 |
|------|------|------|---------|----------|
| 架构 | 统一自回归 | VLM+flow expert | 自回归 | VLM+flow expert |
| CoT | 原生（共享权重） | bolt-on | 无 | bolt-on |
| 跨具身 | ✅ 学习型codec | ⚠️ padding | ❌ | ⚠️ per-embodiment MLP |
| R1-Lite成功率 | 76.7% | 53.3% | - | 24.4% |
| LIBERO | 98.9% | - | ~90% | - |

---

## 核心技术发现

### 发现1: VLM-as-Actor的复兴
G0.5提供了强有力证据：自回归VLA架构在保持VLM推理能力方面有结构性优势。VLA-0的发现（未经修改的VLM在AR action训练上超越π0.5-KI）进一步支持了这一论点。

### 发现2: Active-Part Tokenization
只生成活跃关节的action token，省略静止部位——这种动态token布局大幅提升了效率。

### 发现3: Prompt直接驱动行为
由于保持了自回归接口，prompt中的副词修饰、空间提示和动词替换可以直接改变policy行为，无需再训练。

---

## 与Spatial AGI的关系

### 直接贡献
- **推理-行动统一范式**: 为Spatial AGI提供了"先推理再行动"的统一框架
- **跨具身泛化**: 统一动作codec概念可推广到不同Spatial AGI agent

### 技术启发
- **空间推理作为CoT的一部分**: BBox预测和轨迹生成本质上是空间推理的体现
- **Prompt驱动的空间行为**: 通过自然语言精细控制空间行为

### 应用场景
- 家庭服务机器人的长时程操作
- 工业机器人的灵活任务切换
- 多具身协作的复杂空间任务

---

## 个人思考

### 最令人兴奋的发现
G0.5最重要贡献不是某个具体技术，而是重新定义了VLA架构辩论的方向。它证明了一个简单但被忽视的事实：如果你认真对待自回归建模，VLM本身就是一个强大的行动者。

### 与昨日研究的关联
昨天研究的"Multi-View Relational Distillation for Spatial Reasoning"关注如何将空间推理能力蒸馏到VLM中。G0.5则展示了当VLM保持为actor时，这些推理能力可以自然地服务于行动。两者形成了有趣的互补——前者增强VLM的空间理解，后者保持VLM的决策角色。

---

## 关键数据

- **基础模型**: Qwen3.5 2B
- **性能**: 
  - LIBERO: 98.9%
  - RoboTwin 2.0: 93.3%
  - SimplerEnv-Bridge: 87.3%
  - DROID zero-shot transfer: 82.5%
  - R1-Lite/R1-Pro: 76.7%（vs π0.5的53.3%）
  - BEHAVIOR Challenge: 31.4%（vs π0.5的26.3%）

---

**文档创建时间**: 2026-08-14  
**分析方法**: arXiv HTML精读
