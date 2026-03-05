# NavDreamer 分析工作流使用指南

## 文件说明

### 1. 工作流文档
**文件**: `/home/cwh/.openclaw/workspace/navdreamer_workflow.md`
- 详细记录了NavDreamer分析的完整步骤
- 包含每个步骤的手动命令
- 包含预期的答案要点

### 2. 自动化脚本
**文件**: `/home/cwh/.openclaw/workspace/scripts/navdreamer_analysis.sh`
- 自动化执行完整分析流程
- 一键完成：创建笔记本、添加来源、生成演示文稿、询问问题

## 使用方法

### 方法1：使用自动化脚本（推荐）

```bash
# 运行完整自动化脚本
/home/cwh/.openclaw/workspace/scripts/navdreamer_analysis.sh
```

脚本会自动完成：
1. ✅ 创建NotebookLM笔记本
2. ✅ 添加项目网页
3. ✅ 添加论文PDF
4. ✅ 生成演示文稿
5. ✅ 询问三个关键问题
6. ✅ 显示后续操作建议

### 方法2：手动执行步骤

参考 `navdreamer_workflow.md` 文件，逐个执行命令：

```bash
# 1. 创建笔记本
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh create \
  "NavDreamer: Video Models as Zero-Shot 3D Navigators"

# 2. 添加来源
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add \
  https://xinjiu612.github.io/NavDreamer/

PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add \
  https://arxiv.org/pdf/2602.09765.pdf

# 3. 生成演示文稿
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh generate slide-deck

# 4. 询问问题
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh ask \
  "这篇文章的核心算法流程是怎样的？"

PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh ask \
  "这篇文章相比其他工作或者它的baseline有什么改进和创新？"

PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh ask \
  "这个工作的实验在什么环境部署的，部署时运行效率如何？"

# 5. 生成音频概览
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh generate audio
```

## 当前状态

### 已完成的笔记本
- **ID**: b96abce1-a41e-409b-9723-7ad93cfdf085
- **标题**: NavDreamer: Video Models as Zero-Shot 3D Navigators
- **来源**: 2个（项目网页 + 论文PDF）

### Artifacts
- **演示文稿**: NavDreamer: Video Models as Zero-Shot 3D Navigators
  - 状态: in_progress（生成中）
  - ID: c9964207-3c4b-4958-9f31-3b4d42b6c586

### 已获取的答案
✅ 问题1：核心算法流程
✅ 问题2：改进和创新
✅ 问题3：实验部署和运行效率

## 检查演示文稿状态

```bash
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact list
```

## 访问NotebookLM

打开浏览器访问：https://notebooklm.google.com

## 代理配置

确保代理已启动（socks5://127.0.0.1:1080）

## 注意事项

1. **PDF添加时间**：添加论文PDF可能需要1-2分钟
2. **演示文稿生成**：可能需要3-5分钟，耐心等待
3. **代码仓库**：NavDreamer代码仓库暂未公开（HuggingFace Demo显示Coming Soon）
4. **代理稳定性**：确保代理连接稳定，避免生成过程中断开

## 快速命令参考

```bash
# 列出artifacts
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact list

# 获取artifact详情
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact get <id>

# 列出sources
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source list

# 询问问题
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh ask "你的问题"

# 生成音频
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh generate audio
```
