# LongSpace: Exploring Long-Horizon Spatial Memory from Perception to Recall in Video

**发表日期**: 2026-06-04
**arXiv链接**: https://arxiv.org/abs/2606.05677
**PDF链接**: https://arxiv.org/pdf/2606.05677
**HTML版本**: https://arxiv.org/html/2606.05677
**作者**: Shiqiang Lang, Jing Liu, Haoyang He, Peiwen Sun, Yuanteng Chen, Tao Liu, Lan Yang, Longteng Guo, Honggang Zhang
**机构**: BUPT; Zhongguancun Academy; Institute of Automation CAS; CUHK; Xi'an Jiaotong University

## 核心问题

### Q1: 核心算法原理

1. **核心思想和动机**
   长视频中的空间记忆是Spatial AGI的关键能力——机器人需要记住几分钟甚至几小时前观察到的空间布局、路径和物体状态。现有基准主要测试短视频（<2分钟）或静态图像，LongSpace填补了长视频空间记忆评估和建模的空白。

2. **主要技术方法**
   - **LongSpace-Bench**: 445个真实世界room-tour视频，平均21.4分钟，4073个QA对，覆盖10种空间能力（场景感知、空间关系、空间记忆）
   - **LongSpace框架**: 将长视频分块处理，在每个chunk中注入3D结构线索（geometry features），构建layer-aware可检索记忆
   - **问题引导检索**: 根据问题从记忆中检索相关空间证据

3. **算法流程**
   - 长视频→顺序chunks→每个chunk注入geometry features→构建layer-aware memory→问题引导检索→生成答案
   - geometry features在早期decoder层注入，增强局部空间表示
   - layer-aware memory维护不同抽象层次的空间信息

4. **输入输出**
   - 输入: 长视频（可达数小时）+ 空间问题
   - 输出: 多种格式答案（多选、数值、开放）

### Q2: 与Spatial AGI的关系

1. **空间理解**: LongSpace强调空间证据的结构持续性——布局、深度、方向、路径关系分布在视频不同段中
2. **空间关系处理**: 三层评估体系（感知→关系→记忆），从物体识别到路径规划
3. **对Spatial AGI的启发**:
   - **长时空间记忆**: 真正的Spatial AGI需要小时级的空间记忆，不仅是几秒的上下文
   - **结构化存储**: 空间记忆不应是原始帧堆叠，需要结构化的可检索表示
   - **问题引导检索**: 根据当前需求从大量历史中提取相关空间信息
4. **应用场景**: 自主导航、机器人探索、视频监控分析、embodied assistance

### Q3: 创新点和局限性

1. **创新点**
   - 首个聚焦长视频空间记忆的基准（平均21.4分钟，远超现有视频基准）
   - 三层空间能力评估体系（感知、关系、记忆）
   - 提出geometry-enhanced + retrievable memory的联合框架
   - 全面评估了主流MLLM在长视频空间记忆上的表现

2. **局限性**
   - 仅室内room-tour视频，缺少室外/动态场景
   - 445个视频规模有限
   - 没有探索3D重建作为更强的空间记忆表示
   - layer-aware memory的设计可能不是最优的

3. **对比**: vs VSI-Bench(1.2分钟); vs STI-Bench(0.6分钟); LongSpace的21.4分钟大幅超越

## 核心技术发现
- 长视频空间记忆需要结构化存储和问题引导检索
- 几何特征注入早期decoder层增强局部空间表示
- 层感知记忆维护不同抽象层次的空间信息
- 现有MLLM在长视频空间记忆上表现远低于人类

## 与Spatial AGI的关系
LongSpace直接针对Spatial AGI的核心需求——持久空间记忆。它证明了一个关键问题：即使最先进的MLLM也无法有效保持和检索长时段的空间信息。这对Embodied AI是致命的，因为机器人需要在数小时的部署中记住环境信息。

## 个人思考
LongSpace-Bench的21.4分钟平均视频时长已经远超大多数基准，但真实机器人部署可能持续数小时甚至数天。如何构建可扩展到这种时间尺度的空间记忆系统？3D重建（如3DGS或NeRF）结合结构化查询可能是一个方向。与昨天的MemoryWAM对比：MemoryWAM关注动作序列的记忆，LongSpace关注观察空间的记忆，两者互补。

## 关键数据
- LongSpace-Bench: 445视频, 159小时, 4073 QA对
- 10种空间任务类型
- 平均视频时长: 21.4分钟（vs VSI-Bench 1.2分钟）
- 3层评估: 场景感知(3种) + 空间关系(2种) + 空间记忆(5种)

## 总结
LongSpace填补了长视频空间记忆评估的空白，并提出geometry-enhanced + retrievable memory框架。它揭示了现有MLLM在持久空间记忆方面的根本局限。

---

**文档创建时间**: 2026-06-21
**分析方法**: arXiv HTML精读
