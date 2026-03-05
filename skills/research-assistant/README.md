# 科研助理 (Research Assistant)

自动化科研论文分析流程的技能。从论文网页链接自动提取信息，创建NotebookLM笔记本，添加多个来源，生成演示文稿和音频概览，并询问关键研究问题。

## 快速开始

### 方法1：使用自动化脚本（推荐）

```bash
# 进入技能目录
cd /home/cwh/.openclaw/workspace/skills/research-assistant

# 运行完整分析流程
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  "<代码仓库URL（可选）>"
```

**示例**：
```bash
./scripts/research_analysis.sh \
  "NavDreamer: Video Models as Zero-Shot 3D Navigators" \
  "https://xinjiu612.github.io/NavDreamer/" \
  "https://arxiv.org/pdf/2602.09765.pdf"
```

### 方法2：手动执行步骤

参考 [SKILL.md](SKILL.md) 了解详细的工作流程。

## 目录结构

```
research-assistant/
├── SKILL.md                                    # 技能主文档
├── scripts/                                    # 自动化脚本
│   ├── research_analysis.sh                      # 完整分析流程脚本
│   └── notebooklm-proxy.sh                     # NotebookLM代理脚本
├── references/                                  # 参考文档
│   ├── notebooklm_commands.md                   # NotebookLM命令速查
│   └── research_questions.md                    # 标准研究问题集
└── assets/                                     # 资源文件
    └── report_template.md                        # 研究报告模板
```

## 核心功能

### 1. 自动创建NotebookLM笔记本
- 一键创建专用笔记本
- 自动设置代理配置
- 返回笔记本ID供后续使用

### 2. 添加多个来源
支持添加多种来源类型：
- 项目网页（必需）
- 论文PDF（必需）
- 代码仓库（可选）
- 相关论文（可选）
- 演示视频（可选）

### 3. 生成演示文稿
- 自动生成Slide Deck
- 支持生成Audio Overview
- 可下载多种格式

### 4. 询问研究问题
自动询问三个核心问题：
1. 核心算法流程
2. 改进和创新
3. 实验部署和运行效率

## 使用场景

### 场景1：分析arXiv论文

```bash
./scripts/research_analysis.sh \
  "论文标题" \
  "https://arxiv.org/abs/论文ID" \
  "https://arxiv.org/pdf/论文ID.pdf"
```

### 场景2：分析项目网页

```bash
./scripts/research_analysis.sh \
  "项目名称: 描述" \
  "https://项目网页.com" \
  "https://项目网页.com/paper.pdf"
```

### 场景3：带代码仓库的完整分析

```bash
./scripts/research_analysis.sh \
  "项目名称" \
  "https://project.page" \
  "https://arxiv.org/pdf/xxxx.pdf" \
  "https://github.com/user/repo"
```

## 常用操作

### 查看NotebookLM状态

```bash
# 列出所有笔记本
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh list

# 列出来源
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh source list

# 列出artifacts
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh artifact list
```

### 自定义代理配置

```bash
# 使用自定义代理
PROXY_HOST=your.proxy.com \
PROXY_PORT=your_port \
PROXY_TYPE=http \
./scripts/notebooklm-proxy.sh <命令>
```

### 生成其他类型的artifact

```bash
# 生成音频概览
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh generate audio

# 生成报告
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh generate report

# 生成思维导图
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh generate mind-map
```

## 故障排查

### 问题：代理连接失败

**检查代理是否启动**：
```bash
# 测试代理连接
curl -x socks5://127.0.0.1:1080 https://google.com
```

### 问题：脚本没有执行权限

**设置执行权限**：
```bash
chmod +x /home/cwh/.openclaw/workspace/skills/research-assistant/scripts/*.sh
```

### 问题：NotebookLM命令找不到

**检查conda环境**：
```bash
# 检查miniconda路径
which conda
# 检查notebooklm安装
conda run -n base notebooklm --help
```

## 扩展和自定义

### 添加自定义问题

编辑 `scripts/research_analysis.sh`，在询问问题部分添加自定义问题：

```bash
echo "问题4：自定义问题"
echo "----------------------------------------"
$NOTEBOOKLM_CMD ask "你的自定义问题"
```

### 使用参考文档

- **NotebookLM命令**: 参考 [references/notebooklm_commands.md](references/notebooklm_commands.md)
- **研究问题集**: 参考 [references/research_questions.md](references/research_questions.md)
- **报告模板**: 使用 [assets/report_template.md](assets/report_template.md) 记录分析结果

## 注意事项

1. **代理配置**：确保代理已启动且地址正确
2. **PDF添加时间**：添加PDF可能需要1-2分钟，请耐心等待
3. **演示文稿生成**：通常需要3-5分钟，可以使用 `artifact list` 检查状态
4. **来源数量**：建议至少添加论文PDF和项目网页，避免添加过多无关来源

## 访问NotebookLM网页

所有操作也可以在网页界面完成：
- 访问：https://notebooklm.google.com
- 查看已创建的笔记本
- 导出演示文稿和音频
- 进行更复杂的查询和分析

## 相关资源

- [NotebookLM官方文档](https://notebooklm.google.com)
- [notebooklm-py GitHub](https://github.com/danielmiessler/notebooklm-py)
- [技能创建指南](https://docs.openclaw.ai)
