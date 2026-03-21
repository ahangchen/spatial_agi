# NotebookLM 来源添加强制要求

**最后更新**: 2026-03-16 09:25
**状态**: ⚠️ 强制要求

## 核心要求

**必须以网站来源（URL）形式添加PDF链接，不能以PDF文件形式添加**

### ✅ 正确方式

```bash
# 添加arXiv页面（网站形式）
notebooklm source add -n "$NOTEBOOK_ID" --type url "https://arxiv.org/abs/2603.xxxxx"

# 添加PDF链接（网站形式，不是PDF文件）
notebooklm source add -n "$NOTEBOOK_ID" --type url "https://arxiv.org/pdf/2603.xxxxx"
```

### ❌ 错误方式

```bash
# ❌ 不指定类型（可能导致误识别为PDF文件）
notebooklm source add -n "$NOTEBOOK_ID" "https://arxiv.org/pdf/2603.xxxxx"

# ❌ 上传本地PDF文件
notebooklm source add -n "$NOTEBOOK_ID" "/path/to/paper.pdf"
```

## 原因分析

1. **NotebookLM处理方式不同**：
   - **网站来源（URL）**: NotebookLM会抓取网页内容，建立索引，支持问答
   - **PDF文件**: NotebookLM可能无法正确处理或处理时间过长

2. **arXiv PDF URL特性**：
   - arXiv的PDF URL（`https://arxiv.org/pdf/xxx`）是一个网页，不是直接下载的PDF文件
   - NotebookLM需要以URL形式访问和处理

3. **性能和可靠性**：
   - 网站来源处理更快（2-5分钟）
   - PDF文件处理可能超时或失败
   - 网站来源支持更好的内容提取

## 执行流程（更新版）

### Step 1: 创建笔记本

```bash
NOTEBOOK_ID=$(notebooklm create "论文标题" | grep -oP 'Created notebook: \K[a-f0-9-]+')
```

### Step 2: 添加来源（强制使用--type url）

```bash
# 1. 添加arXiv页面
notebooklm source add -n "$NOTEBOOK_ID" --type url "$ARXIV_URL"

# 2. 添加PDF链接（网站形式，90秒超时）
if timeout 90 notebooklm source add -n "$NOTEBOOK_ID" --type url "$PDF_URL"; then
  echo "✅ PDF链接添加成功（网站形式）"
else
  # 3. Fallback: 使用HTML版本
  HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')
  notebooklm source add -n "$NOTEBOOK_ID" --type url "$HTML_URL"
  echo "✅ HTML版本添加成功"
fi
```

### Step 3: 等待处理完成

```bash
# ⚠️ 必须等待来源处理完成才能问问题
MAX_WAIT=300  # 5分钟
WAIT_INTERVAL=15
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
  # 检查来源状态
  SOURCE_STATUS=$(notebooklm source list -n "$NOTEBOOK_ID" 2>&1)
  
  if echo "$SOURCE_STATUS" | grep -qiE "processing|pending"; then
    echo "⏳ 来源还在处理中..."
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
  else
    # 测试问题验证
    if [ $ELAPSED -ge 120 ]; then
      TEST_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "论文标题是什么？")
      if [ -n "$TEST_ANSWER" ]; then
        echo "✅ 来源已就绪"
        break
      fi
    fi
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
  fi
done
```

### Step 4: 询问问题

```bash
# ⚠️ 确认来源就绪后才问问题
Q1_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "核心算法原理？")

# 检查空答案
if [ -z "$Q1_ANSWER" ]; then
  echo "⚠️ 答案为空，等待30秒后重试"
  sleep 30
  Q1_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "核心算法原理？")
fi
```

## 常见问题

### Q1: 为什么必须用--type url？

**A**: NotebookLM会自动检测来源类型，但PDF URL可能被误识别为文件。明确指定`--type url`确保以网站形式处理。

### Q2: 如果PDF URL添加失败怎么办？

**A**: 使用arXiv HTML版本替代：
```bash
HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')
notebooklm source add -n "$NOTEBOOK_ID" --type url "$HTML_URL"
```

### Q3: 为什么不能上传本地PDF？

**A**: 
1. 本地PDF文件处理时间更长（可能超时）
2. NotebookLM对网站来源的支持更好
3. arXiv URL有更好的内容提取和索引

### Q4: 如何验证来源是否就绪？

**A**: 
1. 检查source list状态
2. 问测试问题（如"论文标题是什么？"）
3. 确认得到非空答案

## 已更新的Skills

1. ✅ **paper-analysis skill** - `~/.openclaw/workspace/skills/paper-analysis/SKILL.md`
2. ✅ **spatial-agi-research skill** - `~/.openclaw/workspace/skills/spatial-agi-research/SKILL.md`

## 检查清单

在执行论文分析前，确认：

- [ ] 使用`--type url`参数
- [ ] 添加PDF链接，不是PDF文件
- [ ] 等待来源处理完成（2-5分钟）
- [ ] 验证来源就绪（测试问题）
- [ ] 检查答案非空
- [ ] 准备fallback方案（HTML版本）

---

**维护者**: OpenClaw AI
**相关Issue**: 来源添加失败导致无法生成演示文稿和音频
