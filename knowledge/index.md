# 知识库索引

**最后更新**: 2026-02-14 22:56

## 分类文件

### GLM MCP工具
- **glm_mcp_tools.md**: GLM Web Search和Web Reader MCP完整使用指南
- **glm_vision_mcp.md**: GLM Vision MCP完整使用指南

### 技术决策
- **technical_decisions.md**: 技术决策和架构选择（待创建）

### 问题解决方案
- **problem_solutions.md**: 问题和解决方案（待创建）

### 经验教训
- **lessons_learned.md**: 经验教训和最佳实践（待创建）

### 代码模式
- **code_patterns.md**: 代码模式和实现方式（待创建）

### 工具配置
- **tools_config.md**: 工具和配置信息（待创建）

### 工作流程
- **workflow_processes.md**: 工作流程和开发流程（待创建）

---

## 使用说明

在执行任务时，可以查询以下分类：

1. **GLM MCP工具** - 网络搜索和网页读取
   - 搜索: `./scripts/glm_search.sh "关键词"`
   - 读取: `./scripts/glm_read.sh "URL"`

2. **技术决策** - 架构选择、技术栈决策
   ```bash
   cat knowledge/technical_decisions.md | grep -A 10 "关键词"
   ```

3. **问题解决** - 错误、bug、性能问题
   ```bash
   cat knowledge/problem_solutions.md | grep -A 10 "错误信息"
   ```

4. **最佳实践** - 经验教训、改进建议
   ```bash
   cat knowledge/lessons_learned.md
   ```

5. **代码模式** - 已实现的代码模式
   ```bash
   cat knowledge/code_patterns.md
   ```

6. **工具配置** - 工具配置、环境设置
   ```bash
   cat knowledge/tools_config.md
   ```

7. **工作流程** - 开发流程、部署步骤
   ```bash
   cat knowledge/workflow_processes.md
   ```

---

## 快速查询

### 搜索所有知识文件
```bash
grep -r "关键词" /home/cwh/.openclaw/workspace/knowledge/
```

### 查看特定分类
```bash
cat /home/cwh/.openclaw/workspace/knowledge/<分类文件名>.md
```

### 列出所有知识文件
```bash
ls -lh /home/cwh/.openclaw/workspace/knowledge/*.md
```

---

## 自动维护

- **知识提取**: 每8小时自动执行
- **知识清理**: 每周五凌晨自动执行
- **归档**: 90天以上信息自动归档到`archive/`

---

## 便捷脚本

### GLM MCP工具脚本
- `/home/cwh/.openclaw/workspace/scripts/glm_search.sh` - 网络搜索
- `/home/cwh/.openclaw/workspace/scripts/glm_read.sh` - 网页读取

### 知识库管理脚本
- `/home/cwh/.openclaw/workspace/scripts/manage_knowledge.sh` - 知识库管理
- `/home/cwh/.openclaw/workspace/scripts/classify_knowledge.py` - 知识分类

---

*此索引由知识库提取脚本自动生成*
