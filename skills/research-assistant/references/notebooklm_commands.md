# NotebookLM 命令速查表

## 基础命令

### 笔记本管理

```bash
# 列出所有笔记本
notebooklm list

# 创建新笔记本
notebooklm create "笔记本标题"

# 删除笔记本
notebooklm delete -n <笔记本ID>

# 重命名笔记本
notebooklm rename <新标题> -n <笔记本ID>

# 使用指定笔记本
notebooklm use <笔记本ID>

# 清除当前笔记本上下文
notebooklm clear

# 查看当前状态
notebooklm status

# 获取笔记本摘要
notebooklm summary
```

### 来源管理

```bash
# 添加来源（自动检测类型）
notebooklm source add <URL或文件路径>

# 添加URL
notebooklm source add https://example.com

# 添加本地文件
notebooklm source add ./document.pdf

# 添加文本（内联）
notebooklm source add "文本内容"

# 添加文本并指定标题
notebooklm source add "文本内容" --title "标题"

# 列出来源
notebooklm source list

# 删除来源
notebooklm source delete <来源ID>

# 重命名来源
notebooklm source rename <来源ID> <新标题>

# 刷新来源
notebooklm source refresh <来源ID>
```

### Artifact生成

```bash
# 生成演示文稿
notebooklm generate slide-deck

# 生成音频概览
notebooklm generate audio

# 生成报告
notebooklm generate report

# 生成思维导图
notebooklm generate mind-map

# 生成信息图
notebooklm generate infographic

# 生成数据表
notebooklm generate data-table

# 生成闪卡
notebooklm generate flashcards

# 生成问答
notebooklm generate quiz

# 生成视频
notebooklm generate video
```

### 下载

```bash
# 下载演示文稿PDF
notebooklm download slide-deck

# 下载音频
notebooklm download audio

# 下载报告
notebooklm download report

# 下载思维导图
notebooklm download mind-map

# 下载信息图
notebooklm download infographic

# 下载数据表
notebooklm download data-table

# 下载闪卡
notebooklm download flashcards

# 下载问答
notebooklm download quiz

# 下载视频
notebooklm download video
```

### 聊天和查询

```bash
# 询问问题
notebooklm ask "你的问题"

# 查看对话历史
notebooklm history

# 清除对话历史
notebooklm history clear

# 配置聊天参数
notebooklm configure
```

## 高级用法

### 指定笔记本

大多数命令支持 `-n <笔记本ID>` 参数来指定操作的目标笔记本：

```bash
# 在指定笔记本中添加来源
notebooklm source add <URL> -n <笔记本ID>

# 在指定笔记本中生成演示文稿
notebooklm generate slide-deck -n <笔记本ID>

# 在指定笔记本中询问问题
notebooklm ask "问题" -n <笔记本ID>
```

### JSON输出

大多数命令支持 `--json` 参数来输出JSON格式：

```bash
# 以JSON格式列出来源
notebooklm source list --json

# 以JSON格式列出artifacts
notebooklm artifact list --json

# 以JSON格式列出笔记本
notebooklm list --json
```

### 研究模式

```bash
# 启动研究模式（自动搜索和导入）
notebooklm source add-research "研究主题" --mode deep

# 查看研究状态
notebooklm research status

# 等待研究完成
notebooklm research wait --import-all
```

## 常见问题

### Q: 如何找到笔记本ID？

A: 使用 `notebooklm list` 命令查看所有笔记本及其ID。

### Q: 如何设置语言？

A: 使用 `notebooklm language` 命令设置artifact生成的语言。

### Q: 如何共享笔记本？

A: 使用 `notebooklm share` 命令系列来设置共享权限。

### Q: 如何添加本地PDF文件？

A: 使用 `notebooklm source add ./path/to/file.pdf` 直接添加本地文件。
