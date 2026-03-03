# Claude Skills 最佳实践

## 概述

本文档总结了构建 Claude Skills 和 Agents 的最佳实践，来源于 ml_skill 项目开发（2026-03-01）。

---

## 1. 渐进式披露原则

**核心理念**: 分层加载，按需提供详细信息

### 三层结构

**第一层：YAML frontmatter（始终加载）**
- 大小：约 100 tokens
- 内容：
  - `name`: 简洁的技能名称
  - `description`: 包含 WHAT（做什么）和 WHEN（何时使用）
- 目的：让 Claude 快速识别是否应该使用此 skill

**第二层：SKILL.md（触发时加载）**
- 大小：建议 ≤500行 / 5k tokens
- 内容：
  - 主要指令和工作流程
  - 快速开始示例
  - Agent 概览和触发时机
- 目的：提供足够信息让 Claude 开始工作

**第三层：references/ 和 scripts/（按需加载）**
- 大小：无限制
- 内容：
  - 详细文档
  - 代码模板
  - 参考资料
  - 辅助脚本
- 目的：提供深入的技术细节

**示例**:
```yaml
---
name: ml-skill
description: ML模型训练协作skill，通过8个专业subagent协作完成从项目启动到模型部署的全流程。当需要训练深度学习模型、优化性能、调试训练问题时使用。
---
```

---

## 2. Agent 结构要求

**完整 Agent 的 7 个部分**:

### 2.1 职责（Responsibility）
- **核心职责**: 用一句话概括
- **负责领域**: 列出具体职责（用 ✅ 标记）
- **不负责领域**: 明确边界（用 ❌ 标记，指向其他 agent）

**示例**:
```markdown
**核心职责**：
- 编写项目README文档

**负责领域**：
- ✅ README编写（项目概览、安装、使用）
- ✅ API文档编写（函数、类、模块说明）
- ✅ 教程编写（快速开始、进阶使用）

**不负责**：
- ❌ 模型架构设计（由model-architect负责）
- ❌ 训练调试（由accuracy-tuner/performance-tuner负责）
```

### 2.2 触发时机（When to Trigger）
- 列出何时应该委派给此 agent
- 使用具体场景描述

**示例**:
```markdown
**何时委派给此agent：**

1. **README编写**
   - 需要编写项目的README.md
   - 需要更新文档结构

2. **API文档编写**
   - 需要生成API文档
   - 需要添加代码注释
```

### 2.3 输入（Input）
- **字段定义**: 表格形式，包含字段名、类型、必填性、说明
- **JSON示例**: 完整的输入示例

**示例**:
```markdown
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task` | string | ✅ | 任务类型 |
| `project_name` | string | ✅ | 项目名称 |
| `features` | array | ⚪ | 功能列表 |

**示例输入**：
```json
{
  "task": "write_readme",
  "project_name": "ImageClassifier",
  "features": ["图像分类", "数据增强", "迁移学习"]
}
```
```

### 2.4 输出（Output）
- **字段定义**: 表格形式
- **JSON示例**: 完整的输出示例
- **文件路径**: 明确输出文件的存放位置

**示例**:
```markdown
| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 完成状态 |
| `files` | array | 生成的文件列表 |
| `summary` | string | 总结说明 |

**示例输出**：
```json
{
  "status": "success",
  "files": [
    {
      "path": "doc/README.md",
      "description": "项目README文档"
    }
  ],
  "summary": "已生成完整的README文档，包含安装、使用、API说明"
}
```
```

### 2.5 工作流程（Workflow）
- **ASCII 流程图**: 可视化工作流程
- **详细步骤**: 逐步说明

**示例**:
```markdown
```
接收任务需求
    │
    ├─ 分析任务类型
    │   ├─ README → 生成项目概览
    │   ├─ API文档 → 提取代码注释
    │   └─ 教程 → 编写使用指南
    │
    ├─ 收集信息
    │   ├─ 读取代码结构
    │   ├─ 读取配置文件
    │   └─ 读取现有文档
    │
    └─ 生成文档
        ├─ 编写内容
        ├─ 格式化
        └─ 输出文件
```

### 详细步骤

1. **分析任务需求**
   - 识别文档类型
   - 确定目标受众
   - 确定内容范围
```
```

### 2.6 注意事项（Notes）
- ✅ **必须做**: 列出必须遵守的规则
- ❌ **禁止做**: 列出禁止的操作
- ⚠️ **常见错误**: 列出易犯错误和解决方案

**示例**:
```markdown
### ✅ 必须做

1. **使用标准格式**
   - README 必须包含：标题、简介、安装、使用、API
   - API 文档必须包含：参数、返回值、示例

2. **保持简洁**
   - README 控制在 200 行以内
   - 每个函数的文档控制在 50 行以内

### ❌ 禁止做

1. **不要重复**
   - ❌ 在多处重复相同内容
   - ✅ 使用链接引用

### ⚠️ 常见错误

1. **文档过于详细**
   - 问题：文档太长，用户不愿意读
   - 解决：提供快速开始 + 详细文档链接
```

### 2.7 知识参考（Knowledge References）
- **提供具体内容**，不只是引用文件
- 包含代码模板、最佳实践、参考链接

**示例**:
```markdown
## 知识参考

### README 标准结构

```markdown
# 项目名称

简短描述（1-2句话）

## 功能特性

- 特性1
- 特性2

## 安装

\`\`\`bash
pip install package
\`\`\`

## 快速开始

\`\`\`python
from package import main
main()
\`\`\`

## API 文档

详见 [API.md](doc/api.md)

## 许可证

MIT License
```
```

---

## 3. 职责边界设计原则

### 3.1 Agent 定位

**核心原则**:
- ❌ Agent 不应该"使用"目标仓库中的工具
- ✅ Agent 应该"生成"文件到目标仓库的相应目录
- ✅ 目标仓库的内容只能作为 Agent 的输入或输出

**Agent = 代码生成器**
- 输入：任务需求、配置、数据
- 输出：生成的代码文件

**错误表述** ❌:
```
- ✅ 文档生成工具（util/generate_docs.py）
```

**正确表述** ✅:
```
- ✅ 生成文档到 doc/ 目录
```

### 3.2 Skill 的辅助工具

如果 Skill 本身需要辅助工具：
- 放在 `skill/scripts/` 目录
- 可以被 Skill 自身调用
- 不应该被 Agent 调用

**目录结构**:
```
skill/
├── SKILL.md
├── agents/
├── references/
└── scripts/          ← Skill 的辅助工具
    ├── validate_agent.py
    └── generate_template.py
```

### 3.3 目标仓库的工具

目标仓库中的工具：
- 只能被目标仓库的代码调用
- 不应该被 Agent 调用
- 由 Agent 生成

**示例**:
```
目标仓库/
├── util/             ← 由 Agent 生成，被训练代码调用
│   ├── visualization.py
│   └── logger.py
└── script/           ← 由 Agent 生成，被用户执行
    ├── train.sh
    └── eval.sh
```

---

## 4. 文档控制

### 4.1 SKILL.md 规范

**大小控制**:
- 建议 ≤500行 / 5k tokens
- 超过 500 行的内容拆分到 `references/`

**内容结构**:
```markdown
# Skill 名称

## 概述
- 简短描述
- 核心功能
- 适用场景

## Agent 概览
- 8个 agent 的简要说明
- 触发时机表格

## 标准项目结构
- 目录树
- 各目录用途

## 快速开始示例
- 2-3个典型使用场景

## 使用指南
- 何时委派给哪个 agent
- 最佳实践

## 注意事项
- ✅ 必须做
- ❌ 禁止做
- ⚠️ 常见问题
```

### 4.2 References 组织

**按主题分类**:
```
references/
├── README.md              # 索引文件
├── code-templates.md      # 代码模板
├── usage-examples.md      # 使用示例
├── troubleshooting.md     # 故障排查
├── best-practices.md      # 最佳实践
└── api-reference.md       # API 参考
```

**每个 reference 文件**:
- 独立完整
- 包含示例
- 可按需加载

---

## 5. 示例项目：ml_skill

### 5.1 项目结构

```
ml_skill/
├── SKILL.md                    # 主文档（502行）
├── agents/                     # 8个 agent 文档
│   ├── model-architect.md
│   ├── algorithm-designer.md
│   ├── performance-tuner.md
│   ├── accuracy-tuner.md
│   ├── test-engineer.md
│   ├── doc-writer.md
│   ├── project-planner.md
│   └── nas-specialist.md
└── references/                 # 12个参考文档
    ├── README.md
    ├── code-templates.md       # 14.3KB
    ├── usage-examples.md       # 8.5KB
    ├── troubleshooting.md      # 6.9KB
    └── ...
```

### 5.2 统计数据

- **SKILL.md**: 502行（符合推荐）
- **8个 agent**: 4403行
- **12个 references**: 4461行
- **总计**: 9366行

### 5.3 设计亮点

1. **渐进式披露**: SKILL.md 简洁，详细内容在 references/
2. **职责清晰**: 每个 agent 明确负责和不负责的领域
3. **完整示例**: 每个 agent 都有完整的输入输出示例
4. **实用模板**: references/ 包含大量可复用的代码模板

---

## 6. 参考来源

- Claude Skills 完全指南
- Claude Code 官方指南
- Anthropic 官方文档
- ml_skill 项目实践（2026-03-01）

---

**最后更新**: 2026-03-01
**维护者**: Weihang (ahangchen)
