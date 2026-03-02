# Spatial AGI Research

这个项目用于系统化地研究Spatial AGI（通用空间智能）领域的最新进展。

## 目录结构

```
spatial_agi/
├── papers/                    # 论文介绍文档
│   ├── 2026-03-02_01_spatialalign.md
│   ├── 2026-03-02_02_scale_pragmatics.md
│   ├── 2026-03-02_03_sotalign.md
│   ├── 2026-03-02_04_retrieve_segment.md
│   ├── 2026-03-02_05_lmm_classifiers.md
│   ├── 2026-03-02_06_omnigaia.md
│   ├── 2026-03-02_07_dysl_vla.md
│   ├── 2026-03-02_08_trajtok.md
│   ├── 2026-03-02_09_imagination.md
│   └── 2026-03-02_10_sope.md
├── daily_thinking/            # 每日思考
│   └── 2026-03-02.md
├── papers_list.md             # 论文列表
└── README.md                  # 本文档
```

## 研究方法

### 1. 论文搜索

使用arXiv API搜索相关关键词：
- spatial intelligence
- VLM (Vision-Language Models)
- 3D Gaussian Splatting
- world model
- embodied AI

### 2. 论文筛选

基于以下标准筛选10篇最有价值的论文：
- 相关性：与spatial intelligence直接相关
- 创新性：提出新的方法或见解
- 影响力：来自知名机构或作者
- 时效性：最近1-2个月发表

### 3. 深度分析

- 为每篇论文创建详细的介绍文档
- 提取核心创新点和Spatial AGI相关性
- 可选：使用NotebookLM进行深度分析

### 4. 思考输出

基于每日阅读的论文，输出关于Spatial AGI的深度思考。

## 核心见解

### 数据策略 > 模型架构

规模化不是万能的，需要精心设计的空间推理数据集。

### 显式表示 > 潜在学习

空间推理可能需要显式的表示（坐标、关系描述）而非纯潜在表示。

### 多模态融合 > 单一模态

Spatial AGI应该是全模态的，整合视觉、语言、音频信息。

### 效率优化 > 精度提升

实际应用中，推理效率往往比精度更重要。

## 未来方向

1. **数据集构建**: 构建包含隐含空间信息的标注数据
2. **架构设计**: 设计多层次的Spatial AGI架构
3. **效率优化**: 开发高效的空间推理算法
4. **实际应用**: 在机器人、AR/VR等领域应用

## 相关资源

- [Research Skill文档](~/.openclaw/workspace/skills/spatial-agi-research/SKILL.md)
- [论文搜索脚本](~/.openclaw/workspace/scripts/search_arxiv.py)
- [Research Assistant技能](~/.openclaw/workspace/skills/research-assistant/SKILL.md)

## 贡献

这个项目由OpenClaw AI助手维护，用于探索Spatial AGI的前沿研究。

## 许可

MIT License
