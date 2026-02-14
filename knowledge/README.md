# 知识库 (Knowledge Base)

知识库用于存储从会话中提取的持久事实、前沿知识和经验教训。

## 目录结构

```
knowledge/
├── README.md                    # 本文件
├── index.md                     # 知识库索引
├── technical_decisions.md       # 技术决策和架构选择
├── problem_solutions.md         # 问题和解决方案
├── lessons_learned.md           # 经验教训和最佳实践
├── code_patterns.md             # 代码模式和实现方式
├── tools_config.md              # 工具和配置信息
├── workflow_processes.md       # 工作流程和开发流程
└── archive/                     # 存档的过时信息（90天以上）
```

## 自动维护

### 知识提取（每8小时）

运行脚本：
```bash
/home/cwh/.openclaw/workspace/scripts/manage_knowledge.sh extract
```

这个任务会：
1. 扫描最近的memory文件（过去24小时）
2. 提取持久事实、技术决策、问题解决方案等
3. 使用AI分类到对应的markdown文件
4. 更新知识索引

**Cron任务**: `knowledge-extract` (每8小时)

### 知识清理（每周五晚上12点）

运行脚本：
```bash
/home/cwh/.openclaw/workspace/scripts/manage_knowledge.sh cleanup
```

这个任务会：
1. 查找90天以上的知识条目
2. 归档到 `archive/` 目录而不是直接删除
3. 保留持续有效的内容

**Cron任务**: `knowledge-cleanup` (每周五 00:00 GMT+8)

## 手动查询

### 查询特定分类

```bash
# 查看技术决策
cat /home/cwh/.openclaw/workspace/knowledge/technical_decisions.md

# 搜索特定关键词
grep -r "SDF" /home/cwh/.openclaw/workspace/knowledge/

# 查看索引
cat /home/cwh/.openclaw/workspace/knowledge/index.md
```

### 在Agent中使用

Agent在执行任务时，如果遇到以下情况，应该主动查询知识库：

1. **技术决策** - 涉及架构选择、技术栈决策
   ```bash
   cat knowledge/technical_decisions.md | grep -A 10 "关键词"
   ```

2. **问题解决** - 遇到错误、bug或性能问题
   ```bash
   cat knowledge/problem_solutions.md | grep -A 10 "错误信息"
   ```

3. **最佳实践** - 需要参考过往经验和教训
   ```bash
   cat knowledge/lessons_learned.md
   ```

4. **代码模式** - 查找已实现的代码模式
   ```bash
   cat knowledge/code_patterns.md
   ```

5. **工具配置** - 需要重新配置或设置工具
   ```bash
   cat knowledge/tools_config.md
   ```

6. **工作流程** - 查看开发流程和步骤
   ```bash
   cat knowledge/workflow_processes.md
   ```

## 知识分类说明

### technical_decisions.md
存储：
- 架构设计决策
- 技术栈选择原因
- 方案对比和取舍
- 性能优化决策

### problem_solutions.md
存储：
- 问题和错误
- 根本原因分析
- 解决方案
- 修复步骤

### lessons_learned.md
存储：
- 开发经验
- 避免的陷阱
- 最佳实践
- 改进建议

### code_patterns.md
存储：
- 代码实现模式
- 函数/类设计
- 优化技巧
- 代码规范

### tools_config.md
存储：
- 工具安装和配置
- 环境设置
- 依赖管理
- 集成方式

### workflow_processes.md
存储：
- 开发工作流
- 测试流程
- 部署步骤
- 协作流程

## 维护指南

### 添加新知识

如果是重要的决策或经验，可以手动添加到对应文件：

```markdown
## 标题

**时间**: 2026-02-14
**相关任务**: [链接或描述]

内容描述...

---

```

### 归档过期知识

手动归档（90天以上）：
```bash
mv /home/cwh/.openclaw/workspace/knowledge/*.md /home/cwh/.openclaw/workspace/knowledge/archive/
```

### 更新索引

提取任务会自动更新 `index.md`，包括：
- 最后更新时间
- 各分类的条目数量
- 使用说明

## 相关脚本

- `/home/cwh/.openclaw/workspace/scripts/manage_knowledge.sh` - 知识库管理主脚本
- `/home/cwh/.openclaw/workspace/scripts/classify_knowledge.py` - 知识分类脚本

## Cron任务

查看当前cron任务：
```bash
openclaw cron list
```

查看任务运行历史：
```bash
openclaw cron runs <jobId>
```

手动触发任务：
```bash
openclaw cron run <jobId>
```
