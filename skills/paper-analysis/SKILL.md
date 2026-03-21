---
name: paper-analysis
description: 单篇论文精读agent - 使用NotebookLM进行深度分析，创建详细markdown文档（至少500行）
version: 1.1
last_updated: 2026-03-16
critical_update: 必须等待PDF来源处理完成才能问问题
---

# 论文精读Agent

这个skill用于精读单篇论文，使用NotebookLM进行深度分析，创建详细的markdown文档。

## ⚠️ 【关键要求】

**必须严格遵守的执行顺序**：
1. ✅ 创建NotebookLM笔记本 → 记录ID
2. ✅ 添加arXiv页面 + PDF → **等待处理完成**
3. ✅ **验证来源就绪** → 测试问题非空
4. ✅ 询问3个核心问题 → 记录完整答案
5. ✅ 创建详细文档 → 至少500行

**禁止跳过的步骤**：
- ❌ 不要在PDF处理完成前问问题（会得到空答案）
- ❌ 不要跳过来源就绪验证
- ❌ 不要创建精简版文档（少于500行）

## 输入参数

执行时需要提供以下参数：

```json
{
  "title": "论文标题",
  "arxiv_url": "https://arxiv.org/abs/...",
  "pdf_url": "https://arxiv.org/pdf/...",
  "paper_id": "论文ID（用于文件命名）",
  "output_dir": "/home/cwh/coding/auto_blog/spatial_agi/papers",
  "notebooklm_proxy": "socks5://127.0.0.1:1080"
}
```

## 执行流程

### Step 1: 创建NotebookLM笔记本并记录ID

```bash
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"

# 创建笔记本并提取ID
NOTEBOOK_ID=$(~/miniconda3/bin/conda run -n base notebooklm create "$TITLE" | grep -oP 'Created notebook: \K[a-f0-9-]+')

# 验证ID
if [ -z "$NOTEBOOK_ID" ]; then
  echo "❌ 错误：笔记本ID提取失败"
  exit 1
fi

echo "✅ 笔记本创建成功"
echo "📝 笔记本ID: $NOTEBOOK_ID"
echo "📝 论文标题: $TITLE"
```

### Step 2: 添加来源并等待处理完成

**⚠️ 【强制要求】必须等待来源完全处理完成后才能问问题**

```bash
# 添加arXiv页面（明确指定为URL类型）
echo "📥 添加arXiv页面（网站形式）..."
~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$ARXIV_URL"

# ⚠️ 【强制】添加PDF链接（以网站形式，不是PDF文件）
echo "📥 添加PDF链接（网站来源形式，90秒超时）..."
PDF_ADDED=false

# 方法1: 尝试以URL形式添加PDF链接
if timeout 90 ~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$PDF_URL"; then
  PDF_ADDED=true
  echo "✅ PDF链接添加成功（网站形式）"
else
  # 方法2: 如果PDF URL失败，使用arXiv HTML版本（完整的HTML内容）
  echo "⚠️ PDF链接添加失败，使用arXiv HTML版本替代"
  HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')

  if timeout 90 ~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$HTML_URL"; then
    echo "✅ HTML版本添加成功（网站形式）"
  else
    echo "❌ 错误：无法添加任何来源到NotebookLM"
    echo "⚠️ 将使用web_fetch fallback方案"
    # 标记需要使用fallback
    NEED_FALLBACK=true
  fi
fi

# ⚠️ 【关键】等待来源处理完成并验证
echo "⏳ 等待NotebookLM处理来源（最多5分钟）..."
MAX_WAIT=300  # 5分钟
WAIT_INTERVAL=15  # 每15秒检查一次
ELAPSED=0
SOURCES_READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
  # 检查来源状态
  SOURCE_STATUS=$(~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1)
  
  # 检查是否有"processing"或"pending"状态
  if echo "$SOURCE_STATUS" | grep -qiE "processing|pending|uploading"; then
    echo "⏳ 来源还在处理中... (已等待 ${ELAPSED}秒)"
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
  else
    # ⚠️ 【关键验证】检查来源数量和内容
    echo "🔍 验证来源状态..."
    
    # 提取来源数量
    SOURCE_COUNT=$(echo "$SOURCE_STATUS" | grep -c "http" || echo "0")
    
    if [ "$SOURCE_COUNT" -ge 2 ]; then
      echo "✅ 检测到 $SOURCE_COUNT 个来源"
      
      # 检查是否包含PDF链接
      if echo "$SOURCE_STATUS" | grep -qi "pdf\|arxiv.org/pdf"; then
        echo "✅ 确认包含PDF链接"
        SOURCES_READY=true
        break
      else
        echo "⚠️ 来源不包含PDF链接，继续等待..."
      fi
    else
      echo "⚠️ 来源数量不足（当前: $SOURCE_COUNT，需要: 2），继续等待..."
    fi
    
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
    
    # 如果已经等待了2分钟，尝试测试问题验证
    if [ $ELAPSED -ge 120 ]; then
      echo "🔍 尝试测试问题验证来源是否就绪..."
      TEST_ANSWER=$(timeout 30 ~/miniconda3/bin/conda run -n base notebooklm ask \
        -n "$NOTEBOOK_ID" \
        "这篇论文的标题是什么？" 2>&1)
      
      # 如果得到非空答案，说明来源已就绪
      if [ -n "$TEST_ANSWER" ] && ! echo "$TEST_ANSWER" | grep -qi "error\|empty\|no answer"; then
        echo "✅ 来源已就绪，可以开始正式提问！"
        SOURCES_READY=true
        break
      else
        echo "⏳ 来源还未就绪，继续等待..."
      fi
    fi
  fi
done

# ⚠️ 【强制检查】最终验证来源状态
if [ "$SOURCES_READY" = false ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ 来源添加失败或未就绪"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📊 最终来源状态："
  ~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1
  echo ""
  echo "⚠️ NotebookLM无法正常添加来源，切换到web_fetch方案"
  echo "📝 将使用web_fetch获取论文内容进行手动分析"
  echo ""
  
  # 标记需要fallback
  NEED_FALLBACK=true
else
  echo "✅ 来源处理阶段完成"
  echo "📊 总等待时间: ${ELAPSED}秒"
  
  # 最终确认来源列表
  echo ""
  echo "📋 最终来源列表："
  ~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1
  echo ""
fi
```

### Step 3: 询问3个核心问题

**⚠️ 【强制要求】必须在Step 2确认来源处理完成后才能执行此步骤！**

**⚠️ 【关键检查】如果NEED_FALLBACK=true，跳过此步骤，使用Step 4 fallback方案！**

```bash
# 检查是否需要fallback
if [ "$NEED_FALLBACK" = true ]; then
  echo "⚠️ 跳过NotebookLM问答，使用fallback方案"
  # 跳转到Step 4
else
  # 验证来源是否就绪
  echo "🔍 验证来源就绪状态..."
  if [ -z "$NOTEBOOK_ID" ]; then
    echo "❌ 错误：笔记本ID未设置"
    exit 1
  fi
  
  # 再次确认来源数量
  SOURCE_COUNT=$(~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1 | grep -c "http" || echo "0")
  if [ "$SOURCE_COUNT" -lt 2 ]; then
    echo "❌ 错误：来源数量不足（$SOURCE_COUNT < 2），无法进行问答"
    echo "⚠️ 切换到fallback方案"
    NEED_FALLBACK=true
  else
    # 开始正式提问
    echo "✅ 来源验证通过，开始正式提问"
    
    # Q1: 核心算法原理
    # ... (问答流程)
  fi
fi
```
Q1_START=$(date +%s)
Q1_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。")
Q1_END=$(date +%s)

# 检查答案是否为空
if [ -z "$Q1_ANSWER" ] || [ "$Q1_ANSWER" = "" ]; then
  echo "⚠️ 警告：Q1答案为空，可能来源还未完全处理"
  echo "⏳ 等待30秒后重试..."
  sleep 30
  Q1_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。")
fi

echo "✅ Q1完成 (耗时: $((Q1_END - Q1_START))秒)"
echo ""

# Q2: 与Spatial AGI的关系
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❓ 问题2：与Spatial AGI的关系"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Q2_START=$(date +%s)
Q2_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。")
Q2_END=$(date +%s)

# 检查答案是否为空
if [ -z "$Q2_ANSWER" ] || [ "$Q2_ANSWER" = "" ]; then
  echo "⚠️ 警告：Q2答案为空"
  echo "⏳ 等待30秒后重试..."
  sleep 30
  Q2_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。")
fi

echo "✅ Q2完成 (耗时: $((Q2_END - Q2_START))秒)"
echo ""

# 思考30秒
echo "💭 思考30秒..."
sleep 30
echo ""

# Q3: 自由问题（基于Q1和Q2）
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❓ 问题3：自由问题（基于Q1和Q2）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Q3_START=$(date +%s)
Q3_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？")
Q3_END=$(date +%s)

# 检查答案是否为空
if [ -z "$Q3_ANSWER" ] || [ "$Q3_ANSWER" = "" ]; then
  echo "⚠️ 警告：Q3答案为空"
  echo "⏳ 等待30秒后重试..."
  sleep 30
  Q3_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？")
fi

echo "✅ Q3完成 (耗时: $((Q3_END - Q3_START))秒)"
echo ""
echo "✅ 所有问题询问完成"
```

### Step 4: Fallback方案 - 使用web_fetch手动分析

**⚠️ 【触发条件】当Step 2检测到NEED_FALLBACK=true时执行此步骤**

**使用场景**：
- ❌ NotebookLM来源添加失败
- ❌ 来源数量不足（<2个）
- ❌ 来源不包含PDF链接
- ❌ 等待超时（5分钟）

```bash
if [ "$NEED_FALLBACK" = true ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔄 启动Fallback方案"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # 方法1: 使用web_fetch获取arXiv HTML全文
  echo "📥 方法1: 获取arXiv HTML全文..."
  PAPER_CONTENT=$(web_fetch "$ARXIV_URL" extractMode="markdown" maxChars=50000)
  
  # 方法2: 如果HTML失败，尝试PDF链接（某些情况下也能获取）
  if [ -z "$PAPER_CONTENT" ] || [ ${#PAPER_CONTENT} -lt 1000 ]; then
    echo "⚠️ HTML获取失败，尝试PDF链接..."
    PAPER_CONTENT=$(web_fetch "$PDF_URL" extractMode="markdown" maxChars=50000 2>&1 || echo "")
  fi
  
  # 验证内容是否有效
  if [ -z "$PAPER_CONTENT" ] || [ ${#PAPER_CONTENT} -lt 1000 ]; then
    echo "❌ 错误：无法获取论文内容"
    echo "⚠️ 任务失败，无法继续分析"
    exit 1
  fi
  
  echo "✅ 成功获取论文内容 (${#PAPER_CONTENT} 字符)"
  echo ""
  
  # 基于获取的内容，手动分析3个核心问题
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📝 手动分析核心问题"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Q1: 基于内容分析核心算法原理
  echo "❓ 分析问题1：核心算法原理"
  # [这里需要AI手动分析论文内容，提取核心算法]
  
  # Q2: 分析与Spatial AGI的关系
  echo "❓ 分析问题2：与Spatial AGI的关系"
  # [AI手动分析]
  
  # Q3: 分析创新点和局限性
  echo "❓ 分析问题3：创新点和局限性"
  # [AI手动分析]
  
  echo ""
  echo "✅ Fallback分析完成"
  echo "⚠️ 注意：此方法无法生成NotebookLM演示文稿和音频"
  echo "📝 文档将标记为'fallback方法'"
fi
```

**Fallback方案的输出**：
- ✅ 详细markdown文档（至少500行）
- ✅ 3个核心问题的手动分析
- ✅ 与Spatial AGI的关系分析
- ❌ 无法生成NotebookLM演示文稿
- ❌ 无法生成NotebookLM音频概览
- ⚠️ 文档中标记分析方法为"web_fetch fallback"

**质量要求（与NotebookLM相同）**：
- ✅ 文档至少500行
- ✅ 包含完整的3个问题分析
- ✅ 包含与Spatial AGI的关系分析
- ✅ 包含个人思考和见解

### Step 5: 创建详细的Markdown文档

**根据执行路径选择模板**：

**路径A: NotebookLM成功** → 使用标准模板（包含笔记本ID、演示文稿、音频）

**路径B: Fallback方案** → 使用fallback模板（标注fallback方法、无演示文稿/音频）

**必须包含**：
- ✅ 完整的基本信息（标题、链接、作者、**NotebookLM笔记本ID**）
- ✅ 基于NotebookLM回答的核心内容
- ✅ 与Spatial AGI的关系分析
- ✅ **完整的NotebookLM问答记录**（不总结）
- ✅ 个人思考和见解
- ✅ **至少500行**

**文档模板**：

```markdown
# [论文标题]

**arXiv**: [arXiv链接]
**PDF**: [PDF链接]
**NotebookLM笔记本ID**: [笔记本ID]
**发布日期**: [日期]

**作者**: [作者列表]

---

## 核心信息

### 摘要

[基于arXiv摘要]

### 关键贡献

1. **贡献1**
2. **贡献2**
3. **贡献3**

---

## 📝 NotebookLM问答记录

### Q1: 核心算法原理

**问题**: 这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。

**答案**:

[完整粘贴NotebookLM的答案]

---

### Q2: 与Spatial AGI的关系

**问题**: 这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。

**答案**:

[完整粘贴NotebookLM的答案]

---

### Q3: 自由问题

**问题**: 基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？

**答案**:

[完整粘贴NotebookLM的答案]

---

## 核心技术发现

### 1. [发现1]

[详细描述]

### 2. [发现2]

[详细描述]

### 3. [发现3]

[详细描述]

---

## 与Spatial AGI的关系

### 直接贡献

1. **贡献1**
2. **贡献2**
3. **贡献3**

### 技术启发

1. **启发1**
2. **启发2**
3. **启发3**

---

## 个人思考

### 最令人兴奋的发现

1. [发现1]
2. [发现2]
3. [发现3]

### 潜在局限

1. [局限1]
2. [局限2]
3. [局限3]

### 与相关工作的关联

[分析与其他论文的关系]

---

## 关键数据

- **模型参数**: [参数量]
- **数据集**: [数据集]
- **性能指标**: [指标]

---

## 总结

[总结论文的核心发现和对Spatial AGI的意义]

---

**文档创建时间**: [日期]
**分析方法**: NotebookLM
**笔记本ID**: [笔记本ID]
```

### Step 5: 保存文档

```bash
# 生成文件名
DATE=$(date +%Y-%m-%d)
FILENAME="${DATE}_${PAPER_ID}.md"
OUTPUT_PATH="${OUTPUT_DIR}/${FILENAME}"

# 保存文档
echo "💾 保存文档到: $OUTPUT_PATH"
# [将生成的markdown内容保存到文件]

echo "✅ 文档保存完成"
echo "📄 文件路径: $OUTPUT_PATH"
echo "📊 文档行数: $(wc -l < $OUTPUT_PATH)"
```

## 输出

执行完成后返回：

```json
{
  "status": "success",
  "notebook_id": "faee81ec-2d12-4dc5-99b9-0de78c18877a",
  "document_path": "/home/cwh/coding/auto_blog/spatial_agi/papers/2026-03-05_01_ACE-Brain-0.md",
  "document_lines": 523,
  "questions_answered": 3
}
```

## 质量要求

- ✅ 文档至少500行
- ✅ 包含完整的NotebookLM问答记录（不总结）
- ✅ 包含与Spatial AGI的关系分析
- ✅ 包含个人思考和见解
- ✅ 包含关键数据

## 错误处理

**如果NotebookLM失败**：
1. 尝试3次（每次90秒超时）
2. 如果仍然失败，切换到GLM WebReader MCP
3. 使用web_fetch读取arXiv HTML页面
4. 基于HTML内容进行分析

**如果PDF添加超时**：
1. 使用arXiv HTML版本替代
2. 继续执行后续步骤

**⚠️ 【关键】如果来源未处理完成就提问**：
1. NotebookLM会返回空答案
2. 系统会自动检测并等待30秒重试
3. 如果重试3次仍然为空，切换到GLM WebReader
4. 记录错误原因到文档

**来源处理完成的判断标准**：
- ✅ 来源状态为 "completed" / "ready" / "done"
- ✅ 测试问题得到非空答案
- ✅ 等待时间超过5分钟（自动继续）

**常见错误及解决**：
1. **空答案** → 来源未处理完成 → 等待更长时间
2. **PDF添加失败** → 使用HTML替代 → 继续执行
3. **笔记本ID丢失** → 重新创建笔记本 → 记录ID到变量
4. **网络超时** → 重试3次 → 切换到GLM WebReader

## 预计时间

- 创建笔记本: 10秒
- 添加来源: 2分钟
- **等待来源处理**: 2-5分钟（关键！）
- 询问3个问题: 5分钟
- 创建文档: 10分钟
- **总计**: 约20-25分钟/篇

**时间分布**：
- 来源处理等待时间：2-5分钟（必须）
- 问题询问：5分钟（每个1.5分钟）
- 文档创建：10分钟（至少500行）

**注意**：
- ⚠️ 不要缩短来源处理等待时间
- ⚠️ 不要跳过来源就绪验证
- ⚠️ 文档少于500行需要重做

---

**最后更新**: 2026-03-16 09:20
**版本**: v1.1
**关键改进**: 
- ✅ 添加来源处理完成验证
- ✅ 增加测试问题验证机制
- ✅ 明确禁止在来源未就绪时提问
- ✅ 更新预计时间（20-25分钟）
