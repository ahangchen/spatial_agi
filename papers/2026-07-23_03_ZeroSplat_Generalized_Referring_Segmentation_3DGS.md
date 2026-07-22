# ZeroSplat: Generalized Referring Segmentation in 3D Gaussian Splatting

**arXiv**: [2607.18801](https://arxiv.org/abs/2607.18801)
**发布日期**: 2026-07-21
**作者**: Jiayu Ding, Meilu Song, Xiaoyi Zhang, Hongbo Jin, Yichen Jin, Xiangtian Si
**发表**: ECCV 2026
**分类**: cs.CV
**项目主页**: https://inkmind-ai.github.io/ZeroSplat

---

## 摘要

Recent advancements in 3D Gaussian Splatting (3DGS) have enabled language-guided scene understanding. However, existing Referring 3D Gaussian Splatting (R3DGS) methods are fundamentally restricted to single-target queries. To reflect the ambiguity of real-world instructions, we introduce the Generalized Referring 3D Gaussian Splatting Segmentation (GR3DGS) task, which requires dynamically segmenting an arbitrary number of targets (0, 1, or N). To facilitate comprehensive evaluation, we construct two new benchmarks: GR-LERF and GR-ScanNet. Crucially, existing paradigms exhibit fundamental technical bottlenecks: they lack intrinsic 3D point-level understanding by operating merely on 2D rendered pixels, and they incur prohibitive computational overhead by requiring per-scene optimization to embed heavy semantic features. To dismantle these bottlenecks, we propose ZeroSplat, a novel training-free and zero-feature framework. ZeroSplat lifts 2D VLM priors into 3D space through robust multi-view geometric constraints. This strategy enables intrinsic point-level understanding without incurring any additional feature storage. Extensive experiments demonstrate that ZeroSplat significantly outperforms state-of-the-art methods across generalized and single-target scenarios while maintaining exceptional efficiency.

---

## Q1: 核心算法原理

### 1.1 核心思想和动机

ZeroSplat解决了3DGS场景理解中的两个根本性问题：

**问题1: 单目标限制**
现有Referring 3DGS方法只能处理"找到这个物体"的单目标查询。但真实世界的语言指令是模糊的——"把桌上的东西收起来"可能指0个、1个或多个物体。

**问题2: 计算开销与理解缺失**
现有方法需要：(a) 对每个场景进行优化以嵌入语义特征（耗时）, (b) 在2D渲染像素上操作而非原生3D点级理解（不精确）。

**ZeroSplat的洞察**：不需要在3DGS中存储和优化语义特征。可以直接将2D VLM的理解"提升"（lift）到3D空间，利用3DGS已有的几何信息作为桥梁。

### 1.2 主要技术方法

#### Generalized Referring 3DGS Segmentation (GR3DGS) 任务

定义了新任务：给定自然语言表达，在3DGS场景中分割任意数量（0/1/N）的目标实例。

#### Training-Free, Zero-Feature框架

**核心设计**：
- **Training-Free**：不需要在3DGS场景上训练/优化
- **Zero-Feature**：不在3DGS中存储额外的语义特征

**技术路径**：
1. 用VLM对多视角2D图像进行referring segmentation
2. 通过3DGS的多视角几何约束，将2D分割结果提升到3D点云级别
3. 利用3DGS的点位置信息实现精确的3D实例分割

#### 多视角几何约束

关键技术创新是robust multi-view geometric constraints：
- 同一3D点在不同视角中的投影应该获得一致的分割结果
- 利用3DGS的显式点位置进行跨视角投票/融合
- 处理遮挡和视角变化带来的不一致

### 1.3 算法流程

```
输入: 3DGS场景, 自然语言表达 query

Step 1: 多视角2D分割
  ├── 选择关键视角集合 {v_1, ..., v_n}
  ├── 对每个视角v_i:
  │   ├── 渲染3DGS到v_i得到RGB图像
  │   └── VLM对图像进行referring segmentation → 2D mask M_i
  └── 输出: 多视角2D mask集合 {M_1, ..., M_n}

Step 2: 2D到3D提升
  ├── 对每个3DGS点p:
  │   ├── 找到p在所有可见视角中的投影
  │   ├── 检查p在各视角中是否落在mask内
  │   └── 多视角投票: 如果多数视角认为p属于目标 → 标记p
  └── 输出: 3D点级别的分割结果

Step 3: 后处理与 refinement
  ├── 去除离群点
  ├── 平滑分割边界
  └── 输出: 最终3D分割结果
```

### 1.4 输入输出

**输入**: 3DGS场景 + 自然语言表达（如"红色的杯子"、"桌上所有的东西"）
**输出**: 3D场景中匹配目标的点集分割（支持0/1/N个目标）

---

## Q2: 与Spatial AGI的关系

### 2.1 空间理解和表示

ZeroSplat在3DGS的显式3D点云上进行操作，这意味着：
- **点级3D理解**：每个高斯点都被精确分类
- **几何-语义对齐**：语义信息直接绑定到3D几何位置
- **空间关系保持**：3DGS的几何结构完整保留了物体间的空间关系

### 2.2 对Spatial AGI的启发

1. **Training-Free范式**：不需要场景级训练，大幅降低部署成本
2. **2D-to-3D语义提升**：利用VLM的2D理解 + 3DGS几何 = 3D语义理解
3. **多目标处理**：真实世界的空间指令往往是模糊的，需要处理任意数量目标
4. **显式点级理解**：与隐式特征嵌入相比，点级理解更透明、更精确

### 2.3 应用场景

机器人抓取（定位目标物体）、场景编辑（选择要修改的区域）、自主导航（识别障碍物）、空间问答（"桌上有什么"）

---

## Q3: 创新点和局限性

### 创新点

1. **GR3DGS任务定义**：首次定义广义referring 3DGS分割任务，支持任意数量目标
2. **Training-Free框架**：无需场景级优化，即开即用
3. **Zero-Feature设计**：不在3DGS中存储语义特征，零额外存储
4. **多视角几何提升**：将2D VLM先验通过几何约束提升到3D
5. **新基准**：GR-LERF和GR-ScanNet为社区提供评估标准

### 局限性

1. **依赖VLM质量**：2D分割质量直接影响3D结果
2. **多视角一致性**：复杂遮挡场景可能产生不一致
3. **实时性**：需要对多个视角分别运行VLM
4. **细粒度限制**：对于场景中非常小的物体，2D VLM可能无法检测

---

## Spatial AGI深度关联

ZeroSplat为Spatial AGI提供了关键的**3D场景理解能力**：

1. **语言驱动的3D定位**：自然语言→3D场景中的精确位置
2. **零样本泛化**：无需训练即可处理新场景
3. **点级精度**：每个3D高斯点都被精确分类
4. **多目标支持**：处理真实世界的模糊指令

这种training-free的3D语义理解是Spatial AGI从"看见3D"到"理解3D"的关键桥梁。

---

## 个人思考

### 1. 2D-to-3D提升的范式
ZeroSplat证明了一个重要思路：**不需要在3D中重新学习语义，可以从2D VLM提升**。这类似于OneCanvas的panoramic reprojection思路，但更直接地利用了3DGS的显式几何。

### 2. 效率优势
不存储语义特征意味着3DGS文件大小不膨胀，且可以灵活更换VLM。

### 3. 与服务机器人的关联
SaaF（Scene-specific Ambiguity-aware）等方法处理的是3DGS语言场中的歧义，而ZeroSplat通过training-free方式直接解决了多目标问题，更适合实际部署。

### 4. 基准贡献
GR-LERF和GR-ScanNet两个基准为3D场景理解领域提供了重要的评估工具。

---

## 总结

ZeroSplat通过创新的training-free、zero-feature框架，将2D VLM先验通过多视角几何约束提升到3D空间，首次解决了广义referring 3DGS分割问题。其点级理解能力、多目标支持和零场景优化设计，为Spatial AGI的3D场景理解提供了实用的解决方案。
