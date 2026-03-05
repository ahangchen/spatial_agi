---
name: research-assistant
description: 自动化科研论文分析流程。从论文网页链接自动提取信息，创建NotebookLM笔记本，添加多个来源（网页、PDF、代码仓库），生成演示文稿和音频概览，并询问关键研究问题。适用于计算机视觉、机器人学习、深度学习等领域的论文分析任务。
---

# 科研助理

这个技能自动化处理学术论文的完整分析流程，从网页链接到生成演示文稿和音频概览的全链路自动化。

## 适用场景

- 分析arXiv论文或研究项目网页
- 需要快速理解论文的核心贡献和创新点
- 想要生成演示文稿用于汇报或分享
- 需要询问论文的具体技术问题
- 批量处理多个论文的标准化分析流程

## 核心工作流

### 步骤1：创建NotebookLM笔记本

为每篇论文创建专用的NotebookLM笔记本：

```bash
# 使用自动化脚本
./scripts/research_analysis.sh <论文标题> <项目页面URL> <PDF链接> [代码仓库URL]
```

或手动创建：

```bash
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"
~/miniconda3/bin/conda run -n base notebooklm create "<论文标题>"
```

### 步骤2：添加来源

添加以下来源到笔记本：

**必需来源**：
1. **项目网页** - 包含论文介绍、实验结果、可视化等
2. **论文PDF** - 完整的论文文档

**可选来源**：
3. **代码仓库** - GitHub或GitLab链接
4. **相关论文** - 引用的相关工作
5. **演示视频** - 项目演示或视频介绍

添加命令：

```bash
# 添加项目网页
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add \
  <项目页面URL>

# 添加论文PDF
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add \
  <PDF链接>

# 添加代码仓库
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add \
  <代码仓库URL>
```

### 步骤3：生成演示文稿

基于添加的来源生成Slide Deck：

```bash
# 生成演示文稿
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh generate slide-deck

# 检查生成状态
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact list
```

生成时间：通常3-5分钟，取决于源文件数量和大小。

### 步骤4：生成音频概览

生成中文或英文的音频概览：

```bash
# 生成音频概览
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh generate audio
```

### 步骤5：询问关键研究问题

通过NotebookLM询问论文的核心问题：

**标准研究问题集**：
1. **核心算法流程** - 这篇文章的核心算法流程是怎样的？
2. **改进和创新** - 这篇文章相比其他工作或者它的baseline有什么改进和创新？
3. **实验部署** - 这个工作的实验在什么环境部署的，部署时运行效率如何？

**可选扩展问题**：
4. **方法论** - 使用了什么方法论和框架？
5. **实验结果** - 主要的实验结果和性能指标是什么？
6. **局限性** - 方法的局限性是什么？未来的工作方向是什么？
7. **应用场景** - 这个方法适用于哪些应用场景？

询问命令：

```bash
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh ask \
  "你的问题"
```

## 自动化脚本

### 完整分析脚本

**脚本**: `scripts/research_analysis.sh`

**功能**：
- 一键创建NotebookLM笔记本
- 自动添加所有来源
- 自动生成演示文稿
- 自动询问标准研究问题
- 显示后续操作建议

**使用方法**：

```bash
# 基本用法
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>"

# 包含代码仓库
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  "<代码仓库URL>"

# 示例
./scripts/research_analysis.sh \
  "NavDreamer: Video Models as Zero-Shot 3D Navigators" \
  "https://xinjiu612.github.io/NavDreamer/" \
  "https://arxiv.org/pdf/2602.09765.pdf" \
  "https://github.com/xinjiu612/NavDreamer"
```

### NotebookLM代理脚本

**脚本**: `scripts/notebooklm-proxy.sh`

**功能**：
- 封装所有NotebookLM命令
- 自动配置代理（`socks5://127.0.0.1:1080`）
- 支持自定义代理设置

**使用方法**：

```bash
# 基本命令
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  ./scripts/notebooklm-proxy.sh <命令>

# 常用命令
./scripts/notebooklm-proxy.sh list                    # 列出所有笔记本
./scripts/notebooklm-proxy.sh create <标题>          # 创建新笔记本
./scripts/notebooklm-proxy.sh use <ID>              # 使用指定笔记本
./scripts/notebooklm-proxy.sh source add <URL>      # 添加来源
./scripts/notebooklm-proxy.sh source list           # 列出来源
./scripts/notebooklm-proxy.sh generate slide-deck    # 生成演示文稿
./scripts/notebooklm-proxy.sh generate audio         # 生成音频概览
./scripts/notebooklm-proxy.sh ask "问题"           # 询问问题
./scripts/notebooklm-proxy.sh artifact list          # 列出artifacts
./scripts/notebooklm-proxy.sh download slide-deck    # 下载演示文稿
```

## 常用操作速查

### 查看笔记本状态

```bash
# 列出所有笔记本
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh list

# 列出来源
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source list

# 列出artifacts
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact list
```

### 下载和导出

```bash
# 下载演示文稿PDF
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh download slide-deck

# 下载音频
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
  /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh download audio
```

## 最佳实践

### 1. 代理配置

确保代理已启动：
- 默认代理：`socks5://127.0.0.1:1080`
- 可通过环境变量自定义：
  ```bash
  export PROXY_HOST=your.proxy.com
  export PROXY_PORT=your_port
  export PROXY_TYPE=http  # 或 socks5
  ```

### 2. PDF添加时间

添加PDF文件可能需要1-2分钟，这是正常的：
- PDF文件较大
- NotebookLM需要解析和索引
- 建议等待完成后再进行下一步

### 3. 演示文稿生成

演示文稿生成通常需要3-5分钟：
- 取决于源文件数量
- 取决于源文件大小
- 可以定期检查状态：
  ```bash
  PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 \
    /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh artifact list
  ```

### 4. 来源选择

**优先级顺序**：
1. 论文PDF - 必需，提供完整技术细节
2. 项目网页 - 必需，提供概述和可视化
3. 代码仓库 - 可选，提供实现细节
4. 相关论文 - 可选，提供背景知识
5. 演示视频 - 可选，提供直观理解

**建议**：
- 至少添加论文PDF和项目网页
- 代码仓库存在时一定添加
- 避免添加过多无关来源，影响生成质量

### 5. 问题设计

**有效的科研问题特征**：
- 具体明确，不模糊
- 针对论文的核心内容
- 可从论文中直接找到答案
- 有助于理解技术细节

**问题示例**：
- ✅ 好："这篇文章的核心算法流程是怎样的？"
- ✅ 好："相比其他工作，主要的改进和创新是什么？"
- ❌ 差："这篇论文怎么样？"（太模糊）
- ❌ 差："详细解释所有内容"（范围太大）

## 故障排查

### 问题：代理连接失败

**症状**：
```
ERROR: All connection attempts failed
```

**解决方案**：
1. 检查代理是否启动
2. 验证代理地址：`socks5://127.0.0.1:1080`
3. 测试代理连接：`curl -x socks5://127.0.0.1:1080 https://google.com`

### 问题：PDF添加超时

**症状**：
```
ERROR: Request timed out calling ADD_SOURCE
```

**解决方案**：
1. 检查PDF链接是否可访问
2. 确保网络连接稳定
3. 尝试使用其他PDF链接（如arXiv HTML页面）
4. **替代方案**：尝试先添加项目网页，在网页界面手动添加PDF
5. **替代方案**：直接访问NotebookLM网页，手动添加PDF文件

### 问题：演示文稿生成卡住

**症状**：
```
Status: in_progress (持续超过10分钟）
```

**解决方案**：
1. 检查源文件数量（过多可能导致卡住）
2. 删除不重要的源文件
3. 重新生成演示文稿
4. 如仍卡住，考虑删除笔记本重建

### 问题：artifact查询失败

**症状**：
```
ERROR conda.cli.main_run:execute(127): `conda run notebooklm artifact list` failed
```

**解决方案**：
1. **替代方案1**：直接访问NotebookLM网页查看artifacts
2. **替代方案2**：等待一段时间后重试（可能是API临时问题）
3. **替代方案3**：使用网页界面手动导出演示文稿

### 问题：命令执行错误

**症状**：
```
Exec failed (code 1)
```

**解决方案**：
1. 检查代理连接是否稳定
2. 重新执行命令
3. 使用NotebookLM网页界面作为备选方案

## 高级选项和配置

### PDF超时配置

由于arXiv等PDF文件较大，添加时可能需要较长时间。脚本提供了灵活的配置：

```bash
# 使用默认超时（60秒）
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>"

# 自定义超时时间（例如120秒）
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  --pdf-timeout 120

# 跳过PDF添加（适用于PDF很大的情况）
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  --skip-pdf
```

### 跳过特定步骤

如果只需要部分结果，可以跳过不必要的步骤：

```bash
# 只生成演示文稿，不问问题
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  --skip-questions

# 只添加来源，不生成artifacts
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  --skip-slides --skip-audio

# 快速分析：只添加来源和问题，不生成artifacts
./scripts/research_analysis.sh \
  "<论文标题>" \
  "<项目页面URL>" \
  "<PDF链接>" \
  --skip-slides --skip-audio
```

### 代理配置

脚本支持通过环境变量自定义代理：

```bash
# 使用默认代理
./scripts/research_analysis.sh <参数...>

# 自定义代理地址
PROXY_HOST=your.proxy.com \
PROXY_PORT=your_port \
PROXY_TYPE=http \
./scripts/research_analysis.sh <参数...>

# SOCKS5代理
PROXY_HOST=127.0.0.1 \
PROXY_PORT=1080 \
PROXY_TYPE=socks5 \
./scripts/research_analysis.sh <参数...>
```

### 超时处理机制

脚本包含智能的超时处理：

1. **PDF添加超时**：
   - 默认60秒，可配置到120秒或更长
   - 超时不会中断整个流程
   - 脚本会报告超时但继续执行后续步骤
   - 建议在网页界面手动添加失败的PDF

2. **命令执行超时**：
   - 使用系统`timeout`命令（如果可用）
   - 或直接执行，依赖底层工具的超时机制

## 手动操作备选方案

当命令行工具遇到问题时，可以直接使用NotebookLM网页界面：

### 访问NotebookLM
```
https://notebooklm.google.com
```

### 网页操作步骤

1. **创建笔记本**
   - 点击"Create"或"新建"
   - 输入论文标题
   - 点击"Create notebook"

2. **添加来源**
   - 点击"+"添加来源
   - 选择URL并粘贴链接
   - 或选择"Upload"上传本地PDF文件

3. **生成演示文稿**
   - 点击右上角的笔记本图标
   - 选择"Audio overview"或"Generate"
   - 等待生成完成

4. **询问问题**
   - 在聊天框中直接输入问题
   - 发送并获得答案

5. **下载artifacts**
   - 点击生成的artifact
   - 选择"Download"下载

### 网页界面的优势

1. **直观操作** - 可视化界面，无需记忆命令
2. **实时反馈** - 可以直接看到处理进度
3. **手动控制** - 可以更精细地控制每个步骤
4. **错误处理** - 网页界面有更好的错误提示

## 扩展用法

### 自定义问题集

编辑`scripts/research_analysis.sh`，添加自定义问题：

```bash
# 在询问问题部分添加自定义问题
echo "问题4：自定义问题"
echo "----------------------------------------"
$NOTEBOOKLM_CMD ask "你的自定义问题"
```

### 批量处理

创建批量处理脚本：

```bash
#!/bin/bash
# 批量处理多个论文

PAPERS=(
  "论文1|https://page1.com|https://pdf1.com"
  "论文2|https://page2.com|https://pdf2.com"
  "论文3|https://page3.com|https://pdf3.com"
)

for paper in "${PAPERS[@]}"; do
  IFS='|' read -r TITLE PAGE PDF <<< "$paper"
  ./scripts/research_analysis.sh "$TITLE" "$PAGE" "$PDF"
done
```

## 访问NotebookLM网页

所有操作也可以在网页界面完成：
- 访问：https://notebooklm.google.com
- 查看已创建的笔记本
- 导出演示文稿和音频
- 进行更复杂的查询和分析
