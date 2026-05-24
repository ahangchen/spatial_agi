# PanoWorld: A Generative Spatial World Model for Consistent Whole-House Panorama Synthesis

**日期**: 2026-05-18 | **arXiv**: 2605.17916 | **领域**: 3D Generation, World Model, Gaussian Splatting

## 核心问题
从平面图和风格参考生成一致性全屋VR漫游——需要同时实现跨视角的照片级真实感和空间连贯性。

## 核心方法
PanoWorld将全屋合成建模为**自回归节点生成**问题，将商业VR产品中的离散导航模式形式化：

1. **Floorplan-derived 3D Shell**: 平面图转换为粗略3D外壳作为全局几何代理，提供墙壁、开口、房间边界的低频约束
2. **Dynamic 3DGS Cache**: 动态3D高斯溅射缓存作为可渲染的空间记忆，随导航路径渐进扩展
3. **Room-Aware Panoramic LRM**: 首个面向全屋多房间360°重建的LRM，使用**Room-aware Group Attention**——同房间密集交互，门洞连接节点受限通信
4. **Topology-Aware Progressive Caching**: 拓扑感知渐进缓存，局部更新而非全历史重建
5. **Decoupled Guidance**: 解耦几何（shell）和外观（3DGS cache）指导

## 关键创新
- **Circular PRoPE (CPRoPE)**: 全景专用位置编码，水平方向使用整数谐波确保跨接缝连续性
- **Cross-room Memory Filtering**: 使用shell深度过滤跨房间记忆伪影
- **Confidence-based Feature Selection**: 高阶SH系数从主导Gaussian继承，避免模糊

## Spatial AGI关联性分析
**直接关联**: PanoWorld构建了一个完整的**空间世界模型**——从稀疏输入（平面图）出发，自回归地生成并维护整个房屋的3D空间表示。这本质上是一个"空间认知"系统：
- **空间记忆**: 3DGS cache作为可查询的空间记忆，与生物体的认知地图(cognitive map)类比
- **拓扑推理**: 基于房间拓扑的组织方式暗示了空间层级表示
- **自回归空间探索**: 节点生成顺序模拟了智能体的空间探索过程

**启示**: 将3DGS作为"空间工作记忆"的概念很有前景——Spatial AGI需要一个不断增长、可查询、拓扑组织的空间记忆系统。

## 局限性
- 依赖平面图输入，非端到端感知
- Cache作为记忆而非最终资产，6-DoF连续漫游质量受限
- 房间间材质一致性仍有残差问题（依赖2D生成器修复）

**评分**: ⭐⭐⭐⭐ (4/5) — 空间世界模型的优秀实例化，渐进式空间记忆的概念对Spatial AGI有直接启发
