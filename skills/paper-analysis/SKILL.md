---
name: paper-analysis
description: 单篇论文精读agent - 使用NotebookLM进行深度分析，创建详细markdown文档（至少500行）
---

# 论文精读Agent

这个skill用于精读单篇论文，使用NotebookLM进行深度分析，创建详细的markdown文档。

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

### Step 2: 添加来源

```bash
# 添加arXiv页面
echo "📥 添加arXiv页面..."
~/miniconda3/bin/conda run -n base notebooklm source add "$ARXIV_URL"

# 添加PDF（90秒超时，失败则使用HTML）
echo "📥 添加PDF（90秒超时）..."
timeout 90 ~/miniconda3/bin/conda run -n base notebooklm source add "$PDF_URL" || {
  echo "⚠️ PDF添加超时，使用HTML替代"
  HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')
  ~/miniconda3/bin/conda run -n base notebooklm source add "$HTML_URL"
}

# 等待30秒
echo "⏳ 等待30秒让NotebookLM处理来源..."
sleep 30
echo "✅ 来源处理完成"
```

### Step 3: 询问3个核心问题

```bash
# Q1: 核心算法原理
echo "❓ 询问问题1：核心算法原理"
Q1_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。")

# Q2: 与Spatial AGI的关系
echo "❓ 询问问题2：与Spatial AGI的关系"
Q2_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。")

# 思考30秒
echo "💭 思考30秒..."
sleep 30

# Q3: 自由问题（基于Q1和Q2）
echo "❓ 询问问题3：自由问题"
Q3_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？")

echo "✅ 所有问题询问完成"
```

### Step 4: 创建详细的Markdown文档

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

## 预计时间

- 创建笔记本+添加来源: 2分钟
- 等待处理: 30秒
- 询问3个问题: 5分钟
- 创建文档: 10分钟
- **总计**: 约18分钟/篇

---

**最后更新**: 2026-03-05 09:00
**版本**: v1.0
