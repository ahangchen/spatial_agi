---
name: spatial-agi-research
description: 完整的Spatial AGI研究流程 - 从arXiv搜索到深度分析，每天精读5篇论文，使用research-assistant技能和NotebookLM（3个核心问题），生成论文文档和每日思考
version: 6.9
last_updated: 2026-03-22
critical_note: Git推送必须使用main分支，不是master分支
---

# Spatial AGI Research Skill - 完整流程

这个技能用于系统化地研究Spatial AGI（通用空间智能）领域的最新进展。

## ⚠️ 【强制要求】Git分支规范

```
╔════════════════════════════════════════════════════════════╗
║  🚨 Git推送必须使用 main 分支，不是 master 分支！            ║
║                                                              ║
║  ✅ 正确: git push origin main                              ║
║  ❌ 错误: git push origin master                            ║
║                                                              ║
║  如果发现推送到错误分支，请手动在GitHub上处理               ║
╚════════════════════════════════════════════════════════════╝
```

## 📁 脚本文件

本技能包含以下脚本（位于 `scripts/` 目录）：

| 脚本 | 用途 |
|------|------|
| `spatial_agi_daily_robust.sh` | 每日研究任务主脚本（去重 + 思考重试） |
| `spatial_agi_filter_papers.py` | 论文去重脚本（排除已分析的论文） |
| `search_arxiv.py` | arXiv论文搜索脚本 |
| `check_spatial_agi_status.sh` | 状态检查脚本 |

**脚本路径**: `~/.openclaw/workspace/skills/spatial-agi-research/scripts/`

**核心特点**:
- ✅ 每天精读5篇论文（质量 > 数量）
- ✅ 使用NotebookLM询问3个核心问题（每个超时1分钟）
- ✅ 生成详细的论文分析文档（至少500行）
- ✅ 每日思考文档（延续性研究）

## 📋 完整流程（必须按顺序执行）

### Step 1: 搜索arXiv最新论文 ✅

**搜索关键词**:
- `spatial intelligence`
- `VLM (Vision-Language Models)`
- `3D Gaussian Splatting`
- `world model`
- `embodied AI`
- `spatial reasoning`
- `3D understanding`
- `scene understanding`
- `video generation`
- `robot learning`
- `UAV`
- `drone`
- `aerial`

**执行命令**:
```bash
cd ~/.openclaw/workspace/scripts

# 搜索多个关键词
python3 search_arxiv.py "all:spatial+all:intelligence" 20
python3 search_arxiv.py "all:VLM+all:3D" 20
python3 search_arxiv.py "all:Gaussian+Splatting" 20
python3 search_arxiv.py "all:world+all:model" 20
python3 search_arxiv.py "all:embodied+all:AI" 20
```

**输出**: JSON格式的论文列表，包含标题、摘要、链接、作者等

---

### Step 2: 筛选最有价值的5篇论文 ✅

**筛选标准**:
1. **相关性**: 与spatial intelligence直接相关
2. **创新性**: 提出新的方法或见解
3. **影响力**: 来自知名机构或作者
4. **时效性**: 最近1-2个月发表（优先）

**筛选流程**:
```bash
# 1. 查看搜索结果
cat /tmp/today_papers.json

# 2. 按相关性排序
# 3. 选择top 5（精读，不是泛读）
# 4. 记录到papers_list.md
```

**输出**: 5篇精选论文（深度分析），记录到:
- `/home/cwh/coding/auto_blog/spatial_agi/papers_list.md`

---

### Step 3: 使用Subagent精读每篇论文 ✅

**⚠️ 【质量第一原则】**

```
╔════════════════════════════════════════════════════════════╗
║  🎯 核心原则：质量 > 速度                                  ║
║                                                              ║
║  ✅ 每篇论文15-20分钟是正常的                              ║
║  ✅ 深度分析比快速完成更重要                                ║
║  ✅ 使用Subagent避免token限制                              ║
║  ✅ 每篇论文独立处理，互不干扰                             ║
║                                                              ║
║  ❌ 不要为了省时而创建精简版文档                           ║
║  ❌ 不要因为token不足而降低质量                            ║
║  ❌ 不要跳过NotebookLM问答环节                             ║
╚════════════════════════════════════════════════════════════╝
```

**⚠️ 【强制要求】必须使用Subagent**

```
╔════════════════════════════════════════════════════════════╗
║  🔑 关键：每篇论文必须使用独立的Subagent                   ║
║                                                              ║
║  ✅ 原因1: 避免主session的token限制                        ║
║  ✅ 原因2: 每篇论文有独立上下文                            ║
║  ✅ 原因3: 可以并行处理（如果需要）                        ║
║  ✅ 原因4: 确保每篇论文都有完整的分析                      ║
║                                                              ║
║  ❌ 不要在主session中处理论文（会token不足）               ║
║  ❌ 不要创建精简版文档（质量不够）                         ║
╚════════════════════════════════════════════════════════════╝
```

**执行方法：使用sessions_spawn启动Subagent**

对于Step 2筛选出的5篇论文，每篇都启动一个独立的Subagent进行精读：

```bash
# 论文列表（从Step 2获得）
PAPERS=(
  "ACE-Brain-0|https://arxiv.org/abs/2603.03198v1|https://arxiv.org/pdf/2603.03198v1"
  "Utonia|https://arxiv.org/abs/2603.03283v1|https://arxiv.org/pdf/2603.03283v1"
  "ULTRA|https://arxiv.org/abs/2603.03279v1|https://arxiv.org/pdf/2603.03279v1"
  "LoGeR|https://arxiv.org/abs/2603.03269v1|https://arxiv.org/pdf/2603.03269v1"
  "Tether|https://arxiv.org/abs/2603.03278v1|https://arxiv.org/pdf/2603.03278v1"
)

# 对每篇论文启动Subagent
for PAPER_INFO in "${PAPERS[@]}"; do
  IFS='|' read -r TITLE ARXIV_URL PDF_URL <<< "$PAPER_INFO"
  
  # 生成paper_id（用于文件命名）
  PAPER_ID=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9]/_/g')
  
  echo "📚 处理论文: $TITLE"
  
  # 启动Subagent
  # 注意：使用subagent runtime，不是acp（paper-analysis是skill不是agent）
  sessions_spawn \
    --mode run \
    --runtime subagent \
    --task "使用paper-analysis skill精读论文: $TITLE
    
论文信息:
- 标题: $TITLE
- arXiv: $ARXIV_URL
- PDF: $PDF_URL
- Paper ID: $PAPER_ID

要求:
1. 创建NotebookLM笔记本并记录ID
2. 添加arXiv页面和PDF作为来源
3. 询问3个核心问题（核心算法、与Spatial AGI关系、创新点/局限）
4. 生成演示文稿（3-5分钟）
5. 生成中文音频概览（2-3分钟）
6. 创建详细markdown文档（至少500行）
7. 保存到 /home/cwh/coding/auto_blog/spatial_agi/papers/

输出格式:
- 返回笔记本ID
- 返回文档路径
- 返回文档行数
- 返回演示文稿生成状态
- 返回音频生成状态" \
    --timeout 1500 \
    --run-timeout 1500
done

echo "✅ 所有论文精读完成"
```

**Subagent执行流程**（paper-analysis skill）：

1. **创建NotebookLM笔记本** - 记录笔记本ID
2. **添加来源** - arXiv页面 + PDF（90秒超时）
3. **等待处理** - 30秒
4. **询问3个问题** - 每个问题90秒超时
   - Q1: 核心算法原理
   - Q2: 与Spatial AGI的关系
   - Q3: 创新点和局限性
5. **生成演示文稿** - 基于NotebookLM笔记本（3-5分钟）
6. **生成中文音频概览** - 便于快速了解论文内容（2-3分钟）
7. **创建文档** - 至少500行，包含完整问答
8. **保存文档** - 返回文档路径和行数

**Subagent优势**：

1. ✅ **独立上下文** - 每篇论文有完整的token空间
2. ✅ **并行处理** - 可以同时启动多个Subagent
3. ✅ **质量保证** - 不会因为token不足而创建精简版
4. ✅ **错误隔离** - 一篇论文失败不影响其他论文

**预计时间**：
- 单篇论文: 18分钟
- 5篇论文（串行）: 90分钟
- 5篇论文（并行）: 20-30分钟

**质量要求**：

- ✅ 文档至少500行
- ✅ 包含完整的NotebookLM问答记录（不总结）
- ✅ 包含与Spatial AGI的关系分析
- ✅ 包含个人思考和见解
- ✅ 包含NotebookLM笔记本ID

---

### Step 3.5: 收集Subagent结果 ✅

所有Subagent完成后，收集结果：

```bash
# 检查生成的文档
ls -lh /home/cwh/coding/auto_blog/spatial_agi/papers/ | grep "$(date +%Y-%m-%d)"

# 统计文档行数
for FILE in /home/cwh/coding/auto_blog/spatial_agi/papers/$(date +%Y-%m-%d)_*.md; do
  LINES=$(wc -l < "$FILE")
  echo "📄 $(basename $FILE): $LINES 行"
  
  # 检查是否满足500行要求
  if [ $LINES -lt 500 ]; then
    echo "⚠️ 警告: 文档行数不足500行"
  fi
done

# 提取所有笔记本ID（用于记录）
grep -h "NotebookLM笔记本ID" /home/cwh/coding/auto_blog/spatial_agi/papers/$(date +%Y-%m-%d)_*.md
```

**预期输出**：

```
📄 2026-03-05_01_ACE-Brain-0.md: 523 行
📄 2026-03-05_02_Utonia.md: 512 行
📄 2026-03-05_03_ULTRA.md: 498 行
📄 2026-03-05_04_LoGeR.md: 487 行
📄 2026-03-05_05_Tether.md: 476 行

笔记本ID:
- ACE-Brain-0: faee81ec-2d12-4dc5-99b9-0de78c18877a
- Utonia: ...
- ULTRA: ...
- LoGeR: ...
- Tether: ...
```

---

**⚠️ 【强制要求】必须完整执行NotebookLM流程**

**⚠️ 【强制要求】必须使用Step 3中记录的笔记本ID**

```
╔════════════════════════════════════════════════════════════╗
║  🔑 关键：必须使用Step 3中记录的笔记本ID                   ║
║                                                              ║
║  ✅ 在Step 3中创建了笔记本并记录了ID                       ║
║  ✅ 在Step 4中必须使用这个ID                                ║
║  ✅ 每个ask命令都必须带 -n "$NOTEBOOK_ID"                   ║
║                                                              ║
║  ❌ 不要使用`use`命令（有会话管理bug）                      ║
║  ❌ 不要假设系统会记住当前笔记本                            ║
║  ❌ 不要在ask命令中省略-n参数                               ║
╚════════════════════════════════════════════════════════════╝
```

**执行原则**:
1. ✅ **时间充足**: 每篇论文有充足的分析时间（15-20分钟），不要为了省时而偷懒
2. ✅ **完整流程**: 必须为每篇论文创建NotebookLM笔记本并询问3个问题
3. ✅ **质量优先**: 宁可多花时间，也要确保分析质量
4. ✅ **显式指定ID**: 每个ask命令都必须带`-n "$NOTEBOOK_ID"`
5. ❌ **禁止偷懒**: 不得以"快速完成"为由跳过NotebookLM直接使用GLM WebReader

**何时使用GLM WebReader备选方案**:
- ✅ NotebookLM连接完全失败（网络、代理、认证问题）
- ✅ 多次重试后仍然超时（3次以上）
- ✅ NotebookLM服务不可用
- ❌ **不得使用的情况**: 为了省时间、觉得简单、想快速完成

**违规示例** ❌:
```
❌ "为了节省时间，我用GLM快速分析"
❌ "这篇论文比较简单，不需要NotebookLM"
❌ "已经分析了3篇，最后2篇用快速方法"
❌ notebooklm use $NOTEBOOK_ID  # use命令有bug
❌ notebooklm ask "问题"  # 缺少-n参数
```

**正确示例** ✅:
```
✅ "NotebookLM连接失败，切换到GLM WebReader"
✅ "PDF添加超时3次，使用HTML替代"
✅ "为每篇论文完整执行3个问题"
✅ notebooklm ask -n "$NOTEBOOK_ID" "问题"  # 显式指定ID
```

**⚠️ 关键：显式指定笔记本ID**

```bash
# ❌ 错误方法（有bug）
notebooklm use $NOTEBOOK_ID
notebooklm ask "问题"  # 可能使用错误的笔记本

# ✅ 正确方法（推荐）
notebooklm ask -n "$NOTEBOOK_ID" "问题"  # 显式指定笔记本ID
```

#### 问题流程（修正版 v1.1）

**⚠️ 【强制要求】必须先添加来源并等待处理完成，然后才问问题！**

```bash
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"

# ━━━ Step 1: 创建笔记本并记录ID ━━━
NOTEBOOK_ID=$(~/miniconda3/bin/conda run -n base notebooklm create "$PAPER_TITLE" | grep -oP 'Created notebook: \K[a-f0-9-]+')

# 验证ID是否存在
if [ -z "$NOTEBOOK_ID" ]; then
  echo "❌ 错误：笔记本ID未设置"
  exit 1
fi

echo "✅ 笔记本创建成功"
echo "📝 笔记本ID: $NOTEBOOK_ID"

# ━━━ Step 2: 添加来源并等待处理完成 ━━━
echo "📥 添加arXiv页面（网站形式）..."
~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$ARXIV_URL"

# ⚠️ 【强制】添加PDF链接（以网站形式，不是PDF文件）
echo "📥 添加PDF链接（网站来源形式，90秒超时）..."
if timeout 90 ~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$PDF_URL"; then
  echo "✅ PDF链接添加成功（网站形式）"
else
  echo "⚠️ PDF链接添加失败，使用arXiv HTML版本替代"
  HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')
  ~/miniconda3/bin/conda run -n base notebooklm source add -n "$NOTEBOOK_ID" --type url "$HTML_URL"
  echo "✅ HTML版本添加成功（网站形式）"
fi

# ⚠️ 【关键】等待来源处理完成并验证
echo "⏳ 等待NotebookLM处理来源（最多5分钟）..."
MAX_WAIT=300  # 5分钟
WAIT_INTERVAL=15
ELAPSED=0
SOURCES_READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
  # 检查来源状态
  SOURCE_STATUS=$(~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1)
  
  if echo "$SOURCE_STATUS" | grep -qiE "processing|pending|uploading"; then
    echo "⏳ 来源还在处理中... (${ELAPSED}s)"
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
    
    # 尝试测试问题验证
    if [ $ELAPSED -ge 120 ]; then
      echo "🔍 验证来源就绪状态..."
      TEST_ANSWER=$(timeout 30 ~/miniconda3/bin/conda run -n base notebooklm ask \
        -n "$NOTEBOOK_ID" \
        "这篇论文的标题是什么？" 2>&1)
      
      if [ -n "$TEST_ANSWER" ] && ! echo "$TEST_ANSWER" | grep -qi "error\|empty"; then
        echo "✅ 来源已就绪！"
        SOURCES_READY=true
        break
      fi
    fi
    
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
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
  
  # 标记需要fallback并退出NotebookLM流程
  NEED_FALLBACK=true
else
  echo "✅ 来源处理完成 (总等待: ${ELAPSED}s)"
  
  # 最终确认来源列表
  echo ""
  echo "📋 最终来源列表："
  ~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1
  echo ""
fi

# ━━━ Step 3: 询问3个核心问题 ━━━

# ⚠️ 【强制检查】如果来源添加失败，跳过此步骤
if [ "$NEED_FALLBACK" = true ]; then
  echo "⚠️ 跳过NotebookLM问答（来源未就绪），使用fallback方案"
  # 跳转到fallback处理
else
  # 验证来源是否就绪
  echo "🔍 验证来源就绪状态..."
  if [ -z "$NOTEBOOK_ID" ]; then
    echo "❌ 错误：笔记本ID未设置"
    NEED_FALLBACK=true
  else
    # 再次确认来源数量
    SOURCE_COUNT=$(~/miniconda3/bin/conda run -n base notebooklm source list -n "$NOTEBOOK_ID" 2>&1 | grep -c "http" || echo "0")
    if [ "$SOURCE_COUNT" -lt 2 ]; then
      echo "❌ 错误：来源数量不足（$SOURCE_COUNT < 2），无法进行问答"
      NEED_FALLBACK=true
    else
      echo "✅ 来源验证通过，开始正式提问"
      
      # Q1: 核心算法原理（必问）
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❓ 问题1：核心算法原理"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Q1_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。")

# 检查答案是否为空
if [ -z "$Q1_ANSWER" ]; then
  echo "⚠️ 警告：Q1答案为空，等待30秒后重试..."
  sleep 30
  Q1_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "这篇文章的核心算法原理是什么？请详细描述：1) 核心思想和动机，2) 主要技术方法，3) 算法流程和关键步骤，4) 输入输出。")
fi

echo "✅ Q1完成"

# Q2: 与Spatial AGI的关系（必问）
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❓ 问题2：与Spatial AGI的关系"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Q2_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。")

# 检查答案是否为空
if [ -z "$Q2_ANSWER" ]; then
  echo "⚠️ 警告：Q2答案为空，等待30秒后重试..."
  sleep 30
  Q2_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "这篇文章与通用空间智能（Spatial AGI）有什么关系？请分析：1) 如何理解和表示空间，2) 如何处理空间关系，3) 对Spatial AGI有什么启发，4) 可以应用到哪些Spatial AGI场景（机器人、AR/VR等）。")
fi

echo "✅ Q2完成"

# Q3: 经过思考后的自由问题
echo "💭 思考30秒..."
sleep 30

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❓ 问题3：自由问题（基于Q1和Q2）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Q3_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
  -n "$NOTEBOOK_ID" \
  "基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？")

# 检查答案是否为空
if [ -z "$Q3_ANSWER" ]; then
  echo "⚠️ 警告：Q3答案为空，等待30秒后重试..."
  sleep 30
  Q3_ANSWER=$(timeout 90 ~/miniconda3/bin/conda run -n base notebooklm ask \
    -n "$NOTEBOOK_ID" \
    "基于前面的分析，这个方法的主要创新点和局限性是什么？与其他相关工作相比有什么优势和劣势？")
fi

echo "✅ Q3完成"
echo "📝 记得将笔记本ID保存到文档中：$NOTEBOOK_ID"
```

**关键改进（v1.1）**：
1. ✅ **添加来源处理步骤**（Step 2）
2. ✅ **等待来源处理完成**（2-5分钟，循环检查）
3. ✅ **测试问题验证就绪状态**
4. ✅ **空答案检测和重试机制**
5. ✅ **显式指定笔记本ID**（`-n "$NOTEBOOK_ID"`）
6. ✅ **详细的日志输出**

**执行顺序（必须严格遵守）**：
```
Step 1: 创建笔记本 → 记录ID
   ↓
Step 2: 添加来源 → 等待处理完成（关键！）
   ├─ 添加arXiv + PDF
   ├─ 循环检查状态（每15秒）
   ├─ 测试问题验证
   └─ ✅ 确认就绪
   ↓
Step 3: 询问3个问题
   ├─ Q1 → 检查空答案 → 重试
   ├─ Q2 → 检查空答案 → 重试
   └─ Q3 → 检查空答案 → 重试
```

**问题选择建议**（Q3）:

根据前两个问题的答案，选择一个你最感兴趣的方向：

1. **技术深度**: 如果Q1中某个技术点不清楚，深入追问
2. **实验结果**: 如果对某个实验结果感兴趣，追问细节
3. **应用场景**: 如果看到潜在应用，追问实现细节
4. **对比分析**: 如果想到相关工作，追问对比
5. **局限性**: 如果发现潜在问题，追问改进方向

**执行策略**:
1. ✅ 问完Q1后，**仔细阅读答案**
2. ✅ 问完Q2后，**仔细阅读答案**
3. ✅ **思考30秒**：基于Q1和Q2，你最想知道什么？
4. ✅ 提出Q3

**预计时间**: 每篇论文 5-8分钟（3个问题 + 思考时间）

---

### Step 3.6: 生成演示文稿 🆕

**⚠️ 【强制要求】问完3个问题后必须生成演示文稿**

```
╔════════════════════════════════════════════════════════════╗
║  🎯 核心原则：生成演示文稿用于快速理解和分享                 ║
║                                                              ║
║  ✅ 基于NotebookLM笔记本生成                                ║
║  ✅ 3-5分钟生成时间                                         ║
║  ✅ 包含核心要点和可视化                                    ║
║  ✅ 便于快速回顾和分享                                      ║
║                                                              ║
║  ❌ 不要跳过这一步                                          ║
║  ❌ 不要为了省时而忽略                                      ║
╚════════════════════════════════════════════════════════════╝
```

**执行命令**：

```bash
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"

# ⚠️ 使用Step 3中记录的笔记本ID
# NOTEBOOK_ID="faee81ec-2d12-4dc5-99b9-0de78c18877a"

echo "📊 生成演示文稿..."
echo "📝 使用笔记本ID: $NOTEBOOK_ID"

# 生成演示文稿（3-5分钟）
~/miniconda3/bin/conda run -n base notebooklm generate slide-deck \
  -n "$NOTEBOOK_ID"

# 检查生成状态
echo "⏳ 等待演示文稿生成（3-5分钟）..."
sleep 180  # 等待3分钟

# 检查artifacts
~/miniconda3/bin/conda run -n base notebooklm artifact list \
  -n "$NOTEBOOK_ID"

echo "✅ 演示文稿生成完成"
```

**生成内容**：
- ✅ 核心算法原理
- ✅ 主要方法和流程
- ✅ 实验结果和性能
- ✅ 与Spatial AGI的关系
- ✅ 关键见解和思考

**预计时间**: 3-5分钟

**注意事项**：
1. ✅ 演示文稿生成是异步的，需要等待3-5分钟
2. ✅ 可以通过`artifact list`检查生成状态
3. ✅ 生成失败不影响文档创建，但应记录原因

---

### Step 3.7: 生成中文音频概览 🆕

**⚠️ 【强制要求】生成演示文稿后必须生成中文音频概览**

```
╔════════════════════════════════════════════════════════════╗
║  🎯 核心原则：生成中文音频便于快速了解论文                  ║
║                                                              ║
║  ✅ 基于NotebookLM笔记本生成                                ║
║  ✅ 中文音频（便于理解）                                    ║
║  ✅ 2-3分钟生成时间                                         ║
║  ✅ 可在移动中收听                                          ║
║                                                              ║
║  ❌ 不要跳过这一步                                          ║
║  ❌ 不要为了省时而忽略                                      ║
╚════════════════════════════════════════════════════════════╝
```

**执行命令**：

```bash
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"

# ⚠️ 使用Step 3中记录的笔记本ID
# NOTEBOOK_ID="faee81ec-2d12-4dc5-99b9-0de78c18877a"

echo "🎧 生成中文音频概览..."
echo "📝 使用笔记本ID: $NOTEBOOK_ID"

# 生成音频概览（2-3分钟）
~/miniconda3/bin/conda run -n base notebooklm generate audio \
  -n "$NOTEBOOK_ID" \
  --language zh-CN

# 检查生成状态
echo "⏳ 等待音频生成（2-3分钟）..."
sleep 150  # 等待2.5分钟

# 检查artifacts
~/miniconda3/bin/conda run -n base notebooklm artifact list \
  -n "$NOTEBOOK_ID"

echo "✅ 音频概览生成完成"
```

**生成内容**：
- ✅ 论文核心要点（中文）
- ✅ 主要方法和贡献
- ✅ 实验结果和性能
- ✅ 与Spatial AGI的关系（中文解释）
- ✅ 关键见解和思考

**音频用途**：
- ✅ 快速了解论文内容（收听）
- ✅ 移动中学习（通勤、锻炼时）
- ✅ 分享给他人（更易理解）
- ✅ 辅助记忆和复习

**预计时间**: 2-3分钟

**注意事项**：
1. ✅ 音频生成是异步的，需要等待2-3分钟
2. ✅ 中文音频更便于理解和记忆
3. ✅ 生成失败不影响文档创建，但应记录原因

---

### Step 4.5: 备选方案 - 使用GLM WebReader MCP 🆕

**⚠️ 【仅用于NotebookLM失败】这是备选方案，不是捷径！**

**使用条件**（必须满足至少一条）:
- ✅ NotebookLM连接完全失败（网络、代理、认证问题）
- ✅ 多次重试后仍然超时（3次以上，每次90秒）
- ✅ NotebookLM服务不可用或维护中
- ✅ PDF/arXiv页面无法添加到NotebookLM（多次尝试失败）
- ✅ `notebooklm ask`命令返回空答案或错误笔记本的答案

**禁止使用的情况**:
- ❌ 为了节省时间
- ❌ 觉得论文简单
- ❌ 想快速完成任务
- ❌ 已经分析了几篇，想偷懒

**判断标准**:
```
✅ 允许使用GLM:
  - NotebookLM连接超时 > 90秒
  - 代理配置正确但仍无法连接
  - 服务返回500/503错误
  - PDF添加失败3次以上
  - `notebooklm ask`返回空答案
  - `notebooklm ask`返回错误笔记本的答案

❌ 禁止使用GLM:
  - NotebookLM响应慢但能工作
  - 为了加快速度
  - 个人偏好
  - 想早点结束
```

**如果发现违规使用GLM WebReader**:
1. 视为任务失败
2. 需要重新执行NotebookLM流程
3. 记录到知识库作为教训

**NotebookLM常见失败模式**（2026-03-05发现）：
1. **PDF添加超时** - 大PDF（>40MB）处理时间超过90秒
2. **笔记本选择错误** - `use`命令会话管理bug，返回错误笔记本的答案
3. **空答案** - `ask`命令返回空字符串（来源未处理完成）

**解决方案**：
1. ✅ 使用PDF URL而不是上传本地文件
2. ✅ 显式指定笔记本ID（`-n`参数）
3. ✅ 等待30秒让来源处理完成
4. ✅ 如果仍然失败，切换到GLM WebReader

---

#### GLM WebReader使用方法

**方法1: 使用web_fetch工具读取arXiv HTML页面**

```bash
# 1. 读取arXiv HTML页面（推荐，格式更完整）
ARXIV_ID="2603.03198v1"
ARXIV_HTML="https://arxiv.org/html/$ARXIV_ID"

# 使用web_fetch工具
web_fetch "$ARXIV_HTML"

# 2. 基于读取的内容，手动分析论文
# - 提取核心信息（标题、摘要、方法、实验）
# - 思考与Spatial AGI的关系
# - 生成分析文档
```

**方法2: 使用web_fetch工具读取arXiv摘要页面**

```bash
# arXiv摘要页面（包含基本信息）
ARXIV_ABS="https://arxiv.org/abs/2603.03198v1"

web_fetch "$ARXIV_ABS"
```

**GLM WebReader优势**：
- ✅ 响应快速（<10秒）
- ✅ 无需代理或代理要求更低
- ✅ GLM-5理解能力强

**GLM WebReader劣势**：
- ❌ 无法访问PDF的完整内容（只能读取HTML）
- ❌ 无法保存为可交互的笔记本
- ❌ 上下文长度限制（但GLM-5支持128K）
- ❌ **质量不如NotebookLM的深度分析**

**何时使用**：
- ✅ NotebookLM完全失败
- ✅ 时间紧急（但已经尝试NotebookLM）
- ✅ 快速浏览论文（非深度分析）

**何时避免使用**：
- ❌ 为了省时间
- ❌ 想早点结束任务
- ❌ 觉得NotebookLM太慢

**质量对比**：

| 维度 | NotebookLM | GLM WebReader |
|------|-----------|---------------|
| 深度分析 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 响应速度 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可靠性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 上下文理解 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 可交互性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**推荐策略**：
1. **首选**: NotebookLM（深度分析）
2. **备选**: GLM WebReader（仅在失败时）

---

### Step 5: 创建详细的Markdown文档 ✅

**⚠️ 【必须遵循EXAMPLE模板】**

参考模板: `/home/cwh/coding/auto_blog/spatial_agi/papers/EXAMPLE_full_analysis_template.md`

**文档结构**（必须包含）:
```markdown
# 论文标题

**基本信息**:
- arXiv链接
- PDF链接
- GitHub代码（如有）
- 作者列表
- 发布日期
- **NotebookLM笔记本ID**（如果使用）

## 核心信息
- 摘要
- 关键贡献

## 📝 NotebookLM问答记录

### Q1: 核心算法原理
**问题**: ...
**答案**: ...

### Q2: 与Spatial AGI的关系
**问题**: ...
**答案**: ...

### Q3: 自由问题
**问题**: ...
**答案**: ...

## 核心技术发现
- 发现1
- 发现2
- 发现3

## 与Spatial AGI的关系
- 直接贡献
- 技术启发
- 应用场景

## 个人思考
- 最令人兴奋的发现
- 潜在局限
- 与昨日研究的关联

## 关键数据
- 模型参数
- 数据集
- 性能指标

## 总结
- 核心发现总结
- 对Spatial AGI的意义

---

**文档创建时间**: YYYY-MM-DD
**分析方法**: NotebookLM / GLM WebReader MCP（备选方案）
```

**质量要求**:
- ✅ 至少500行
- ✅ 包含完整的NotebookLM问答记录（不总结）
- ✅ 包含与Spatial AGI的关系分析
- ✅ 包含个人思考和见解
- ✅ 包含关键数据

**⚠️ 禁止简化**:
- ❌ 不要只写几句话
- ❌ 不要省略NotebookLM问答
- ❌ 不要复制粘贴摘要

**预计时间**: 10-15分钟

---

#### 方案概述

使用GLM WebReader MCP直接读取arXiv HTML页面，理解论文内容。

**优势**:
- ✅ 无需代理（或使用更稳定的代理）
- ✅ 响应速度快（通常<10秒）
- ✅ 可以直接访问arXiv HTML页面
- ✅ GLM-5的理解能力很强

**劣势**:
- ❌ 无法上传PDF（只能读取HTML）
- ❌ 上下文长度限制（但GLM-5支持128K）
- ❌ 无法保存为笔记本
- ❌ **质量不如NotebookLM的深度分析**

#### 执行流程

```bash
# 1. 确认arXiv HTML页面链接
# 格式: https://arxiv.org/html/{paper_id}
# 例如: https://arxiv.org/html/2602.22745v1

# 2. 使用GLM WebReader MCP读取页面
# 假设你已经配置了GLM WebReader MCP

# 方法1: 直接通过MCP工具（如果已配置）
# 使用web_fetch工具读取HTML页面
web_fetch "https://arxiv.org/html/2602.22745v1"

# 方法2: 如果有GLM MCP工具
# 使用GLM的web_reader工具
# （具体命令取决于你的MCP配置）

# 3. 基于读取的内容，询问GLM
# 注意：这里需要你手动将web_fetch的结果传递给GLM
# 或者使用支持网页读取的GLM版本

# 示例流程：
# Step 1: 读取HTML内容
ARXIV_HTML=$(curl -L "https://arxiv.org/html/2602.22745v1")

# Step 2: 提取关键部分（标题、摘要、方法等）
# 可以使用简单的grep或更复杂的解析

# Step 3: 询问GLM（需要手动或通过脚本）
# 询问同样的3个问题
```

#### 实际操作建议

**推荐方案**: 使用OpenClaw的内置工具

```bash
# 方案A: 使用web_fetch工具（推荐）
# 这个工具可以直接读取网页并提取markdown内容
# 然后基于提取的内容进行分析

# 1. 读取arXiv HTML页面
# （假设web_fetch工具可用）
# 在实际执行中，OpenClaw会自动调用web_fetch

# 2. 基于读取的内容，继续询问GLM
# GLM会理解网页内容并回答问题
```

**具体步骤**:

1. **获取论文HTML链接**:
   ```bash
   # 从arXiv ID生成HTML链接
   # 例如: https://arxiv.org/abs/2602.22745v1
   # 改为: https://arxiv.org/html/2602.22745v1
   ```

2. **使用GLM WebReader**（在对话中直接请求）:
   ```
   请访问 https://arxiv.org/html/2602.22745v1
   阅读这篇论文，然后回答以下问题：
   
   Q1: 这篇文章的核心算法原理是什么？
   Q2: 这篇文章与Spatial AGI有什么关系？
   Q3: [基于Q1和Q2的思考]
   ```

3. **GLM会自动**:
   - 使用web_fetch工具读取HTML
   - 理解论文内容
   - 回答你的问题

#### 质量保证

使用GLM WebReader MCP的文档要求与NotebookLM相同：
- ✅ 仍然创建详细文档（至少500行）
- ✅ 仍然记录完整的3个问答
- ✅ 仍然添加个人思考
- ✅ 在文档中注明使用GLM WebReader（而非NotebookLM）

**文档标记**:
```markdown
**分析方法**: GLM WebReader MCP（NotebookLM失败）
**arXiv HTML**: https://arxiv.org/html/xxx
**GLM模型**: zai/glm-5
```

**预计时间**: 每篇论文 5-10分钟（读取 + 问答）

---

### Step 5: 创建Markdown介绍文档 ✅

**⚠️ 必须为每篇论文创建详细文档！**

**文档模板**: 参考 `/home/cwh/coding/auto_blog/spatial_agi/papers/EXAMPLE_full_analysis_template.md` (1,542行)

**必须包含的内容**:

```markdown
# [论文标题]

**发表日期**: YYYY-MM-DD  
**arXiv链接**: https://arxiv.org/abs/xxxx  
**PDF链接**: https://arxiv.org/pdf/xxxx  
**HTML版本**: https://arxiv.org/html/xxxx  
**代码仓库**: [如有]  
**作者**: 作者列表  
**NotebookLM笔记本ID**: [创建后记录]

## 核心问题
[基于NotebookLM回答整理]

## 主要方法
[基于NotebookLM回答整理]

### 方法概述
[详细描述]

### 技术细节
[具体实现]

### 算法流程
[步骤说明]

## 关键创新
1. **创新点1**: [描述]
2. **创新点2**: [描述]
3. **创新点3**: [描述]

## 实验结果
### 实验设置
[描述]

### 性能指标
[数据]

### 对比分析
[对比]

## 与Spatial AGI的关系
### 直接相关性
[基于Q2回答整理]

1. **空间表示**: [如何理解和表示空间]
2. **空间推理**: [如何处理空间关系]
3. **3D应用**: [与3D场景理解的关系]
4. **实际场景**: [可以应用的Spatial AGI场景]

### 启发与思考
[基于Q2回答整理]

1. **数据启发**: [对数据策略的启发]
2. **架构启发**: [对模型架构的启发]
3. **应用启发**: [对实际应用的启发]

### 技术挑战
[基于Q1和Q2回答分析]

## 潜在应用
[基于Q2和Q3回答整理]

## 局限性与未来工作
### 局限性
[描述]

### 未来方向
[描述]

## NotebookLM问答记录

### Q1: 核心算法原理
**问题**: 这篇文章的核心算法原理是什么？

**回答**: [NotebookLM的完整回答]

### Q2: 与Spatial AGI的关系
**问题**: 这篇文章与通用空间智能（Spatial AGI）有什么关系？

**回答**: [NotebookLM的完整回答]

### Q3: [自由问题]
**问题**: [你提出的具体问题]

**回答**: [NotebookLM的完整回答]

## 个人思考
[你的深度思考和分析，基于3个问答]

1. **最有趣的发现**: [什么]
2. **最意外的结果**: [什么]
3. **最有价值的启发**: [什么]
4. **Q3的思考过程**: [为什么问这个问题，从Q1/Q2得到了什么启发]

## 相关工作
[列出相关的论文或技术]

## 引用
```bibtex
@article{xxx,
  title={...},
  author={...},
  journal={arXiv preprint arXiv:xxxx},
  year={2026}
}
```

## 标签
`#spatial-agi` `#vlm` `#3d-understanding` `#[其他相关标签]`
```

**保存位置**:
```bash
/home/cwh/coding/auto_blog/spatial_agi/papers/YYYY-MM-DD_XX_paper_title.md
```

**质量要求**:
- ✅ 至少**500行**
- ✅ 包含**完整的NotebookLM问答记录**（不总结）
- ✅ 添加**个人思考和见解**
- ✅ 记录**NotebookLM笔记本ID**

**预计时间**: 每篇论文 15-20分钟

---

### Step 6: 更新论文列表 ✅

**更新文件**: `/home/cwh/coding/auto_blog/spatial_agi/papers_list.md`

**添加内容**:
```markdown
## YYYY-MM-DD 研究的论文（精选5篇）

1. **论文1标题** - arXiv:xxxx
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: xxx, yyy, zzz
   - 文档: papers/YYYY-MM-DD_01_xxx.md
   - NotebookLM: [notebook_id]

2. **论文2标题** - arXiv:yyyy
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: xxx, yyy, zzz
   - 文档: papers/YYYY-MM-DD_02_yyy.md
   - NotebookLM: [notebook_id]

3. **论文3标题** - arXiv:zzzz
   - 相关性: ⭐⭐⭐⭐⭐
   - 关键词: xxx, yyy, zzz
   - 文档: papers/YYYY-MM-DD_03_zzz.md
   - NotebookLM: [notebook_id]

4. **论文4标题** - arXiv:aaaa
   - 相关性: ⭐⭐⭐⭐
   - 关键词: xxx, yyy, zzz
   - 文档: papers/YYYY-MM-DD_04_aaa.md
   - NotebookLM: [notebook_id]

5. **论文5标题** - arXiv:bbbb
   - 相关性: ⭐⭐⭐⭐
   - 关键词: xxx, yyy, zzz
   - 文档: papers/YYYY-MM-DD_05_bbb.md
   - NotebookLM: [notebook_id]
```

---

### Step 7: 生成每日思考文档 ✅

**文件名**: `/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/YYYY-MM-DD.md`

**必须包含的内容**:

```markdown
# Spatial AGI 思考 - YYYY-MM-DD

## 📋 每日总结

**⚠️ 这一部分是必须的，放在文档最前面，快速概览当天研究！**

### 🎯 今日核心

**研究主题**: [今天的主要研究方向，如：4D重建、视频生成等]

**论文数量**: 5篇精选论文（从X篇中筛选）

**关键突破**: 
- 🚀 [最重要的发现1，如：动态4D表示层]
- 🚀 [最重要的发现2，如：线性正交表示]
- 🚀 [最重要的发现3，如：前馈架构范式转变]

**架构演进**: [如：4层→7层，新增Level 0动态4D层]

**问题解决**: [如：解决了昨日4个问题，新识别3个问题]

### 📊 一句话总结

[用1-2句话概括今天最重要的进展]

**示例**:
> "今天从UFO-4D论文发现动态4D表示是Spatial AGI的基础，架构从4层扩展到7层，问题解决率达80%。"

### 🔗 延续性

**昨日→今日**: [简述从昨天的哪个方向延续而来]

**今日→明日**: [简述明天可能的研究方向]

**示例**:
- 昨日→今日: "静态3D表示 → 动态4D表示（UFO-4D实现）"
- 今日→明日: "动态4D → 4D + 语义理解集成"

### 📈 关键数据

- **论文分析**: 5篇（1篇完整NotebookLM + 4篇快速分析）
- **核心见解**: X个新见解
- **架构更新**: X层 → Y层（+Z个新层）
- **问题追踪**: 解决X/Y个（XX%）
- **知识缺口**: 已解决XX%，部分理解XX%，未涉及XX%
- **提交记录**: X个commits

### 🎓 今日收获

**Top 3 发现**:
1. **[发现1标题]** - [1句话说明为什么重要]
2. **[发现2标题]** - [1句话说明为什么重要]
3. **[发现3标题]** - [1句话说明为什么重要]

**最大惊喜**: [今天最意外的发现或转折]

**待解决**: [最需要明天深入的问题]

### 💡 本质思考：如何达成通用空间智能

**⚠️ 这是每日总结的核心部分，必须深刻思考！**

**要求**: 结合今日获得的所有信息，从以下3个维度进行本质层面的思考：

#### 1. 核心能力的本质是什么？

**思考方向**:
- Spatial AGI需要的**最根本能力**是什么？
- 今日论文揭示了哪些**不可或缺的组成要素**？
- 这些能力之间有什么**内在联系**？

**示例**:
```
今日发现动态4D表示（UFO-4D）是基础，但本质是：
1. 显式4D表示 → 对物理世界的精确建模
2. 前馈推理 → 实时响应能力（而非优化）
3. 多模态耦合 → 减少数据依赖

本质：Spatial AGI需要"物理直觉"（前馈4D理解）而非"物理计算"（优化求解）
```

#### 2. 当前方法与理想目标的差距在哪里？

**思考方向**:
- 理想的Spatial AGI应该是什么样的？
- 当前最先进方法（包括今日论文）还缺什么？
- **最大的瓶颈**是什么？（数据、架构、表示、训练？）

**示例**:
```
差距分析：
- ✅ 已有：动态4D表示、前馈推理、多模态融合
- ❌ 缺失：语义理解、因果推理、长期规划、物体持久性
- ⚠️ 瓶颈：如何从"感知4D"到"理解4D"（不仅是看到运动，还要理解为什么运动）

最大瓶颈：缺少对物理世界规律的深层理解（因果关系、物体属性、场景语义）
```

#### 3. 从今天到理想状态，最可能的路径是什么？

**思考方向**:
- 基于今日发现，**下一步应该做什么**？
- 哪条技术路线**最有可能成功**？
- 需要**突破哪些关键技术**？

**示例**:
```
技术路线预测：
1. 短期（3-6月）：4D表示 + 语义理解集成（如4D + CLIP）
2. 中期（6-12月）：4D + 物理引擎 + 因果推理
3. 长期（1-2年）：统一的世界模型（4D + 语义 + 物理 + 因果）

关键突破点：
- 如何学习线性正交表示（Compositional论文启发）
- 如何将4D表示与符号推理结合
- 如何实现Zero-shot的空间推理能力
```

---

**⚠️ 总结要求**:
- 简洁明了，控制在800字以内（含本质思考）
- 突出**最重要的3个发现**
- 清晰的**演进路径**（昨天→今天→明天）
- **本质思考**必须结合当日论文，回答上述3个问题
- **可视化数据**（图表数量、解决率等）
- 便于快速了解当天研究重点

---

## 今日论文概览

今天精读了5篇与Spatial AGI相关的前沿论文，涵盖[领域1]、[领域2]、[领域3]等领域。

### 论文列表
1. **论文1** - [简短描述和核心发现]
2. **论文2** - [简短描述和核心发现]
3. **论文3** - [简短描述和核心发现]
4. **论文4** - [简短描述和核心发现]
5. **论文5** - [简短描述和核心发现]

## 核心见解

### 1. [见解1标题]
[基于今日论文的发现]

**从[论文X]获得**:
- ✅ [具体发现]
- ✅ [具体发现]

**对Spatial AGI的启发**:
[深入思考]

### 2. [见解2标题]
[基于今日论文的发现]

...

## 与昨日思考的联系

**昨日重点**: [昨天的主要思考]

**今日进展**:
- [如何延续昨天的思考]
- [新的发现]
- [更新的理解]

---

## 🗺️ Spatial AGI 知识图谱

**⚠️ 这是每日思考的核心部分，必须包含完整的思维导图！**

### 知识架构思维导图

**要求**: 使用Mermaid思维导图，展示Spatial AGI的10层架构及每层的候选实现方案。最有前景的方案用 🎯 标记。

```markdown
[在此处插入完整的10层架构思维导图]

示例格式：
Level 9: 4D生成层 ⭐
  ├─ Orster时空解耦 🎯
  │   ├─ 空间-时间分布迁移
  │   └─ ST-HexPlane集成
  ├─ 4D扩散模型
  └─ 4D高斯表示
```

### 🎯 主线技术路径

**⚠️ 【强制要求】基于当前研究，明确标记最有前景的技术路线！**

**要求格式**：

```markdown
#### 技术路线阶段

**阶段1: [阶段名称]**（基于论文X, Y）
- 关键技术: [具体技术]
- 验证状态: [已验证/部分验证/理论阶段]
- 核心论文: [论文列表]
- 下一步: [需要做什么]

**阶段2: [阶段名称]**（基于论文A, B）
...

#### 终极目标

[用1-2句话描述最终目标]

#### 最有前景的技术路线

1. **起点**（已验证）: [从哪里开始]
2. **核心**（已验证）: [核心技术是什么]
3. **关键**（已验证）: [关键突破点]
4. **应用**（已验证）: [如何应用]
```

**示例**（来自2026-03-09）：
```markdown
**阶段1: 空间表征来源**（03-06, 03-09）
- 文本中蕴含空间结构（R²=0.87）
- LLM直接驱动3D生成
- 关键论文: World Properties, LLM 3D Modeling

**阶段2: 4D生成突破**（03-06, 03-09）
- 从4D理解（ArtHOI）到4D生成（Orster）
- 空间-时间解耦处理
- 关键论文: ArtHOI, Orster

**最有前景的技术路线**:
1. **起点**（已验证）: 文本空间表征（R²=0.87）
2. **核心**（已验证）: Orster 4D生成
3. **关键**（已验证）: VLA可控性 + ZipMap效率
4. **应用**（已验证）: Roomify VR + cuRoboV2动力学
```

---

## 🔍 与主线相关但未探索的议题

**⚠️ 【强制要求】必须列出与主线技术路径相关但尚未深入研究的议题！**

**目的**：
1. 识别知识缺口
2. 为后续研究提供方向
3. 避免重复研究已解决的问题

**要求格式**：

```markdown
### 与主线相关但尚未深入调研的议题

#### 高优先级（本周）

1. **[议题1标题]**
   - 问题: [具体问题是什么？]
   - 候选方案: [可能的解决方案]
   - 缺口: [当前缺少什么？]
   - 相关论文: [如有]

2. **[议题2标题]**
   - 问题: [具体问题是什么？]
   - 候选方案: [可能的解决方案]
   - 缺口: [当前缺少什么？]

#### 中优先级（本月）

3. **[议题3标题]**
   - 问题: [具体问题是什么？]
   - 缺口: [当前缺少什么？]
   - 参考: [相关工作]

#### 低优先级（长期）

4. **[议题4标题]**
   - 问题: [具体问题是什么？]
   - 为什么低优先级: [原因]
```

**示例**（来自2026-03-09）：

```markdown
### 与主线相关但尚未深入调研的议题

#### 高优先级（本周）

1. **跨模态空间对齐方法**
   - 问题: 如何将文本空间（R²=0.87）与视觉空间对齐？
   - 候选: 对比学习、联合嵌入、Knowledge Distillation
   - 缺口: 尚无非视觉→视觉空间对齐的成功案例

2. **4D生成中的语义注入**
   - 问题: 如何在Orster框架中增加语义分支？
   - 候选: 语义条件扩散、语义一致性损失
   - 缺口: 4D语义生成的评估标准

3. **实时VR生成的效率优化**
   - 问题: 如何将Roomify从离线变为实时？
   - 候选: 渐进生成、缓存机制、模型压缩
   - 缺口: 实时生成的质量-速度权衡

#### 中优先级（本月）

4. **多源空间信息的统一表示**
   - 文本（统计）+ 视觉（感知）+ 物理（约束）
   - 如何设计统一的嵌入空间？
   - 参考: CLIP（文本-图像），但缺乏物理维度

5. **4D语义理解的数据集构建**
   - 需要什么样的4D语义标注？
   - 现有数据集: Hypersim, Replica（静态），缺乏动态4D语义

6. **因果推理与空间智能的结合**
   - 如何理解"为什么运动"而非仅"看到运动"？
   - 参考: Safe-SAGE的语义通量，但缺乏因果模型

#### 低优先级（长期）

7. **物体持久性（Object Permanence）**
   - 机器人需要理解物体在视野外的存在
   - 参考: SLAM地图维护，但缺乏语义持久性

8. **长期规划与空间推理**
   - 如何在4D场景中进行长期任务规划？
   - 参考: Task Planning，但缺乏4D场景支持

9. **Zero-shot空间推理能力**
   - 如何实现未见场景的泛化？
   - 参考: Meta-Learning，但空间泛化研究不足
```

### 📊 研究进度追踪

**要求**：用表格形式追踪每个议题的研究状态

| 议题 | 状态 | 相关论文 | 下一步 |
|------|------|---------|--------|
| 4D生成 | ✅ 已突破 | Orster | 语义扩展 |
| 空间表征来源 | ✅ 已发现 | World Properties | 跨模态对齐 |
| VR环境生成 | ✅ 已验证 | Roomify | 实时优化 |
| 跨模态对齐 | ⏳ 待探索 | - | 实验设计 |
| 4D语义 | ⏳ 待探索 | - | 数据集构建 |
| 因果推理 | 💡 概念阶段 | Safe-SAGE | 深入调研 |

**状态说明**：
- ✅ 已突破：已找到有效解决方案
- ✅ 已验证：方案可行但需要优化
- ⏳ 待探索：已识别问题但未深入研究
- 💡 概念阶段：仅有初步想法

---

## 🗺️ Spatial AGI 知识图谱

**⚠️ 【强制要求】必须使用Mermaid绘制完整的10层架构思维导图！**

1. **[起点]**: [描述]
2. **[核心]**: [描述]  
3. **[关键]**: [描述]
4. **[目标]**: [描述]

### 🔍 待探索议题

**与主线相关但尚未深入调研的议题**:

#### 高优先级（本周）
1. **[议题名称]**
   - 问题：[具体问题]
   - 候选：[候选方案]
   - 缺口：[当前缺口]

#### 中优先级（本月）
[列出]

#### 低优先级（长期）
[列出]

### 📊 研究进度追踪

| 议题 | 状态 | 相关论文 | 下一步 |
|------|------|---------|--------|
| [议题] | ✅/⏳/💡 | [论文] | [行动] |

---

**⚠️ 【强制要求】知识演进图和延续性**

```
╔════════════════════════════════════════════════════════════╗
║  🚨 每日思考必须包含以下内容（缺一不可）                   ║
╚════════════════════════════════════════════════════════════╝

1. ✅ 与昨日思考的联系（文档开头）
   - 必须阅读昨天的思考文档
   - 明确写出"昨日→今日"的延续关系
   - 说明今天如何建立在昨天的基础上

2. ✅ 核心见解演进图（Mermaid graph LR）
   - 可视化昨天→今天的见解演进
   - 使用颜色区分（蓝色=昨天，绿色=今天，黄色=更新）

3. ✅ 技术栈演进对比表
   - 对比昨天和今天的技术方案
   - 标注变化类型（新增/优化/验证）

4. ✅ 问题追踪表格
   - 追踪昨日未解决问题的状态
   - 记录今日新识别的问题
   - 标注优先级

5. ✅ 知识缺口分析（Mermaid pie）
   - 可视化知识缺口分布
   - 列出各类别的详细内容

6. ✅ 架构演进对比
   - 昨日架构 vs 今日架构
   - 标注新增/更新的层次

7. ✅ 下一步演进方向
   - 明确写出"昨天→今天→明天"的路径
   - 基于今日发现预测明日方向

❌ 违规示例：
- 缺少"与昨日思考的联系"部分
- 缺少知识演进图（任何一个图表）
- 独立的一天，没有延续性
- 只总结今天，不对比昨天

✅ 正确示例：
见 2026-03-06.md（完整模板）
```

## 🗺️ Spatial AGI 知识图谱

**⚠️ 具体的知识图谱内容保存在每日思考文档中！**

### 查看方式

**最新的知识图谱**:
```bash
# 查看今日知识图谱
cat /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date +%Y-%m-%d).md | grep -A 200 "## 🗺️ Spatial AGI 知识图谱"

# 或直接打开文件
vim /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date +%Y-%m-%d).md
```

**历史知识图谱**:
```bash
# 列出所有每日思考
ls -lh /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/

# 查看特定日期
cat /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/2026-03-09.md
```

### 知识图谱包含的内容

每日思考中的知识图谱章节包含：

1. **10层架构思维导图**（Mermaid mindmap格式）
   - 根节点: Spatial AGI
   - 第一层: 10层架构（Level 0-9）
   - 后续层: 每层的候选实现方案
   - 高亮标记: 🎯 最有前景的方案

2. **主线技术路径**（前瞻性全局视角）
   - 基于过去4天研究成果综合设计
   - 6个关键阶段的演进路径
   - 每个阶段包含:
     - 核心发现
     - 技术路径
     - 关键论文

3. **待探索议题**（分优先级）
   - 高优先级（本周）: 3个议题
   - 中优先级（本月）: 3个议题
   - 低优先级（长期）: 3个议题
   - 每个议题包含: 问题、候选方案、当前缺口

4. **研究进度追踪表**
   - 议题状态（✅已突破 / ⏳待探索 / 💡概念阶段）
   - 相关论文
   - 下一步行动

### 设计原则

1. **前瞻性**: 基于多天（至少4天）研究成果综合设计，非单日视角
2. **全局性**: 覆盖Spatial AGI的完整10层架构
3. **动态演进**: 每日更新，反映最新研究进展
4. **可追溯**: 保留历史版本，便于回溯技术路线演进
5. **实用性**: 明确标注最有前景的方案（🎯）和下一步行动

### 生成方法

**Step 7中生成每日思考时，知识图谱章节的生成流程**:

1. **阅读过去3-4天的思考文档**
   ```bash
   # 读取昨天的思考
   cat /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date -d yesterday +%Y-%m-%d).md
   
   # 读取前天的思考
   cat /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date -d "2 days ago" +%Y-%m-%d).md
   ```

2. **提取核心发现**
   - 从每篇论文中提取关键技术突破
   - 识别与Spatial AGI相关的核心见解
   - 标注最有前景的技术方案（🎯）

3. **更新10层架构思维导图**
   - 基于新发现更新架构层次
   - 添加新的候选实现方案
   - 调整最有前景方案的标记

4. **设计主线技术路径**
   - 综合过去4天的研究成果
   - 设计6个关键阶段的演进路径
   - 明确每个阶段的核心发现、技术路径、关键论文

5. **更新待探索议题**
   - 基于当前进展调整优先级
   - 添加新发现的议题
   - 更新议题状态

6. **更新研究进度追踪表**
   - 标记已突破的议题（✅）
   - 标记待探索的议题（⏳）
   - 标记概念阶段的议题（💡）

### 示例

**最新的知识图谱示例**: 见 `/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/2026-03-09.md`

**包含内容**:
- 10层架构（Level 0-9）
- 6个阶段技术路径（空间表征→4D生成→效率→可控性→交互→安全）
- 9个待探索议题（3高+3中+3低）
- 6个研究进度追踪

---

## 关键引用

> "从论文X中的重要引述" - [作者]

---

**关键词**: `#spatial-agi` `#[其他标签]`
```

**特别注意**: 
- ✅ **必须参考前一天的思考** (如果存在)
- ✅ **延续性思考** - 不是独立的一天，而是持续的研究
- ✅ **深度 > 广度** - 质量比数量重要
- ✅ **思维导图** - 必须包含完整的10层架构及候选方案
- ✅ **主线描述** - 与最有前景的节点匹配
- ✅ **待探索议题** - 明确未调研的内容

**预计时间**: 30-40分钟（新增思维导图部分需要更多思考）

---

### Step 7.5: 验证思考文档质量 🆕

**⚠️ 【强制要求】生成思考后必须验证质量！**

```
╔════════════════════════════════════════════════════════════╗
║  🔍 强制验证：生成后必须执行验证脚本                       ║
║                                                              ║
║  ✅ 验证通过 → 继续Git提交                                  ║
║  ❌ 验证失败 → 重新生成，补充缺失部分                      ║
║                                                              ║
║  🚨 如果验证失败3次，强制停止任务并报告错误               ║
╚════════════════════════════════════════════════════════════╝
```

**执行验证脚本**:

```bash
# 验证今天的思考文档
bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/validate_thinking.sh

# 如果验证失败，查看详细错误
bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/validate_thinking.sh $(date +%Y-%m-%d)
```

**验证内容**（11项检查）:

1. ✅ 文档存在性
2. ✅ 文档行数（≥800行）
3. ✅ 包含"与昨日思考的联系"
4. ✅ 包含核心见解演进图（graph LR）
5. ✅ 包含技术栈演进对比表
6. ✅ 包含知识缺口分析（pie图）
7. ✅ 包含10层架构思维导图（mindmap）
8. ✅ 包含主线技术路径（≥4个阶段）
9. ✅ 包含待探索议题（≥9个）
10. ✅ 包含本质思考（3个子问题）
11. ✅ Mermaid图表总数（≥3个）

**如果验证失败**:

```bash
# 查看具体哪些检查失败
# 脚本会输出详细的错误信息

# 根据错误信息，重新生成缺失部分
# 例如：如果缺少"10层架构思维导图"
# 则手动补充该部分到文档中

# 再次验证，直到通过
bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/validate_thinking.sh
```

**强制要求**:
- ✅ 验证必须通过才能继续Git提交
- ✅ 最多重试3次
- ❌ 如果3次都失败，停止任务并报告错误到群

**预计时间**: 1-2分钟（验证 + 可能的补充）

---

### Step 8: 自动提交到GitHub ✅

**⚠️ 这一步是必须的，确保每日研究成果及时同步！**

**执行操作**:
```bash
# 方法1: 执行预生成的提交脚本（推荐）
bash /tmp/spatial_agi_commit_after_research.sh

# 方法2: 手动提交（如果脚本失败）
cd /home/cwh/coding/auto_blog/spatial_agi
git add .
git commit -m "feat: Spatial AGI Research - $(date '+%Y-%m-%d')

- 分析5篇论文（arXiv最新）
- 生成论文深度分析文档
- 更新每日思考文档
- 更新论文列表

Spatial AGI Research Skill v3.1"
git push origin main
```

**提交内容**:
- ✅ 论文分析文档（papers/）
- ✅ 每日思考（daily_thinking/）
- ✅ 论文列表（papers_list.md）
- ✅ README更新（如有）

**提交时间**: 立即（在Step 7完成后）

**提交信息格式**:
```
feat: Spatial AGI Research - YYYY-MM-DD

- 分析5篇论文（arXiv最新）
- 生成论文深度分析文档
- 更新每日思考文档
- 更新论文列表

Spatial AGI Research Skill v3.1
```

**验证提交**:
```bash
# 查看最新提交
git log --oneline -1

# 确认推送成功
git status
```

---

### Step 9: 推送到GitHub远程仓库 ✅

**⚠️ 这一步是必须的，确保每日研究成果同步到GitHub！**

**执行操作**:
```bash
# 推送到GitHub（带重试）
cd /home/cwh/coding/auto_blog/spatial_agi

MAX_RETRIES=3
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  echo "推送尝试 $((RETRY+1))/$MAX_RETRIES..."
  
  if git push origin main; then
    echo "✅ 推送成功！"
    echo "🌐 GitHub仓库: https://github.com/ahangchen/spatial_agi"
    exit 0
  else
    ((RETRY++))
    if [ $RETRY -lt $MAX_RETRIES ]; then
      echo "⚠️  推送失败，等待10秒后重试..."
      sleep 10
    fi
  fi
done

echo "❌ 推送失败，请手动执行: git push origin main"
exit 1
```

**推送内容**:
- ✅ 当天论文分析文档（papers/YYYY-MM-DD_*.md）
- ✅ 每日思考文档（daily_thinking/YYYY-MM-DD.md）
- ✅ 论文列表更新（papers_list.md）
- ✅ README更新（如有）

**推送验证**:
```bash
# 方法1: 查看远程状态
git remote -v
git branch -vv

# 方法2: 检查GitHub仓库
# 访问: https://github.com/ahangchen/spatial_agi
# 确认最新提交已同步

# 方法3: 查看远程最新提交
git log origin/main --oneline -1
```

**常见问题**:
1. **推送被拒绝**: 先拉取再推送
   ```bash
   git pull --rebase origin main
   git push origin main
   ```

2. **网络超时**: 使用重试机制（已包含）

3. **认证失败**: 检查SSH密钥或Token
   ```bash
   # 测试SSH连接
   ssh -T git@github.com
   ```

**完成标志**:
- ✅ GitHub仓库显示最新提交
- ✅ `git status` 显示 "Your branch is up to date with 'origin/main'"
- ✅ 远程仓库包含当天所有文件

# 查看远程仓库
# 访问: https://github.com/ahangchen/spatial_agi
```

**预计时间**: 1-2分钟

---

## 📁 完整文件结构

```
/home/cwh/coding/auto_blog/spatial_agi/
├── papers/                    # 论文介绍文档
│   ├── YYYY-MM-DD_01_paper1.md
│   ├── YYYY-MM-DD_02_paper2.md
│   ├── ...
│   ├── EXAMPLE_full_analysis_template.md  # 完整示例（1,542行）
│   └── YYYY-MM-DD_SPATIALALIGN_notebooklm_analysis.md  # 实际案例（400行）
├── daily_thinking/            # 每日思考
│   ├── YYYY-MM-DD.md
│   ├── YYYY-MM-(DD-1).md      # 前一天的思考
│   └── ...
├── papers_list.md             # 论文列表
└── README.md                  # 项目说明
```

---

## ⏱️ 时间估算（更新版 2026-03-10 09:40）

| 步骤 | 时间 | 备注 |
|------|------|------|
| 1. 搜索论文 | 10分钟 | 自动执行 |
| 2. 筛选论文 | 10分钟 | 人工筛选5篇 |
| 3. Subagent精读（5篇） | 130分钟 | 串行26分钟/篇（含演示+音频） |
| 3.5. 收集结果 | 5分钟 | 检查文档质量 |
| 4. 更新列表 | 5分钟 | papers_list.md |
| 5. 生成思考 | 30分钟 | 500+行 |
| 6. Git提交 | 1分钟 | 自动提交 |
| 7. Git推送 | 1分钟 | 推送到GitHub |
| **总计** | **~3.2小时** | |

**单篇论文时间分解**（Subagent）：
- 创建笔记本 + 添加来源：3分钟
- 询问3个问题：6分钟（2分钟/问题）
- **生成演示文稿**：3-5分钟
- **生成中文音频**：2-3分钟
- 创建文档：10分钟
- **小计**：24-30分钟/篇

**Subagent优势**（v5.0新增）：
- ✅ **独立上下文** - 每篇论文有完整token空间
- ✅ **质量保证** - 不会因token不足创建精简版
- ✅ **错误隔离** - 一篇失败不影响其他
- ✅ **可并行** - 如果需要可同时启动多个

**并行执行**（可选）：
- 5篇论文并行: 30-40分钟
- 总时间: ~1.5小时（含筛选、思考、提交）

**建议**:
- 可以在半天内完成（上午或下午）
- 每天5篇论文（精读 + 演示 + 音频）
- 重点关注最相关的论文
- 预留30分钟缓冲时间（网络延迟、生成失败重试）

---

## ✅ 质量检查清单

### 执行前
- [ ] 代理已启动 (`socks5://127.0.0.1:1080`)
- [ ] GitHub仓库已关联（git@github.com:ahangchen/spatial_agi.git）
- [ ] NotebookLM CLI可用
- [ ] 目录已创建

### 执行中（整体流程）
- [ ] Step 1: 搜索5个关键词组合
- [ ] Step 2: 筛选出5篇最有价值的论文
- [ ] Step 3: 对每篇论文启动Subagent
- [ ] Step 3.5: 收集Subagent结果并验证质量
- [ ] Step 4: 更新papers_list.md
- [ ] Step 5: 生成每日思考文档（参考前日）
- [ ] Step 6: 执行Git自动提交脚本

### 执行中（每篇论文Subagent）
- [ ] Subagent启动成功
- [ ] NotebookLM笔记本创建成功
- [ ] 添加arXiv页面作为来源
- [ ] 添加PDF或HTML作为来源
- [ ] 等待30秒让来源处理
- [ ] 询问Q1：核心算法原理
- [ ] 询问Q2：与Spatial AGI的关系
- [ ] 询问Q3：自由问题
- [ ] **生成演示文稿**（3-5分钟）
- [ ] **生成中文音频概览**（2-3分钟）
- [ ] 创建详细文档（至少500行）
- [ ] 文档包含NotebookLM笔记本ID
- [ ] 文档包含演示文稿生成状态
- [ ] 文档包含音频生成状态
- [ ] 文档保存到正确目录

### 执行后（每篇论文）
- [ ] 文档至少500行
- [ ] 包含完整的NotebookLM问答记录
- [ ] 添加个人思考和见解
- [ ] **演示文稿已生成**（或记录失败原因）
- [ ] **中文音频已生成**（或记录失败原因）
- [ ] 保存到正确位置
- [ ] 更新papers_list.md

### 每日完成
- [ ] 所有5篇论文完成
- [ ] papers_list.md已更新
- [ ] 每日思考文档已创建
- [ ] 参考了前一天的思考
- [ ] 有深度的延续性思考

---

## ⚠️ 常见问题与解决

### 问题1: PDF添加超时

**解决方案**:
```bash
# 使用HTML版本替代
notebooklm source add "https://arxiv.org/html/xxx"

# 或在网页界面手动添加
# 访问: https://notebooklm.google.com
```

### 问题2: NotebookLM连接超时

**解决方案**:
```bash
# 1. 检查代理
curl -x socks5://127.0.0.1:1080 https://www.google.com

# 2. 增加超时时间
timeout 120 notebooklm ask "问题"

# 3. 使用网页界面
# 访问: https://notebooklm.google.com
```

### 问题3: 代理不稳定

**解决方案**:
- 使用稳定的代理服务
- 考虑使用网页界面作为备选
- 分批执行，避免一次性处理所有论文

### 问题4: NotebookLM完全失败（推荐备选方案） 🆕

**症状**:
- 连接超时（即使60秒）
- 代理无法访问
- 添加来源失败
- 询问问题失败

**备选方案**: 使用GLM WebReader MCP

**操作步骤**:

1. **确认GLM MCP可用**
   ```bash
   # 检查GLM WebReader MCP是否配置
   cat ~/.config/mcporter/mcp_config.json | grep -A 5 "glm"
   
   # 或直接测试
   mcporter call glm webreader --help
   ```

2. **获取arXiv HTML链接**
   ```bash
   # 将PDF链接转换为HTML链接
   # PDF: https://arxiv.org/pdf/2602.22745v1
   # HTML: https://arxiv.org/html/2602.22745v1
   
   PAPER_ID="2602.22745v1"
   HTML_URL="https://arxiv.org/html/${PAPER_ID}"
   echo "HTML链接: ${HTML_URL}"
   ```

3. **使用GLM WebReader读取论文**
   ```bash
   # 方法1: 直接在对话中使用（推荐）
   # 直接告诉AI:
   "请访问 ${HTML_URL}，阅读这篇论文，然后回答以下问题：
   Q1: 核心算法原理是什么？
   Q2: 与Spatial AGI有什么关系？
   Q3: [基于Q1/Q2的思考]"
   
   # 方法2: 使用web_fetch工具
   web_fetch "${HTML_URL}" extractMode="markdown"
   # 然后基于内容回答问题
   ```

4. **记录使用GLM的文档**
   ```markdown
   # [论文标题]
   
   **分析方法**: GLM WebReader MCP（NotebookLM失败）
   **arXiv HTML**: https://arxiv.org/html/xxx
   **GLM模型**: zai/glm-5
   **日期**: YYYY-MM-DD
   
   ## 核心问题
   [基于GLM回答整理]
   
   ## 主要方法
   [基于GLM回答整理]
   
   ## 与Spatial AGI的关系
   [基于GLM回答整理]
   
   ## GLM WebReader问答记录
   
   ### Q1: 核心算法原理
   **回答**: [GLM的完整回答]
   
   ### Q2: 与Spatial AGI的关系
   **回答**: [GLM的完整回答]
   
   ### Q3: [自由问题]
   **回答**: [GLM的完整回答]
   
   ## 个人思考
   [你的深度思考]
   ```

**GLM vs NotebookLM对比**:

| 方面 | NotebookLM | GLM WebReader |
|------|-----------|---------------|
| 速度 | 慢（可能超时） | 快 |
| 稳定性 | 依赖代理 | 不依赖代理 |
| 深度 | 非常深（基于全文） | 深（基于HTML） |
| 可用性 | 可能失败 | 高可用 |
| 推荐场景 | 首选 | 备选 |

**推荐策略**:
1. **优先尝试NotebookLM**（更深度）
2. **如果失败，立即切换到GLM**（高可用）
3. **不要在同一篇论文上浪费太多时间**

**何时切换**:
- NotebookLM添加来源超时2次 → 切换
- NotebookLM询问问题超时2次 → 切换
- 代理连接失败 → 切换
- 总时间超过10分钟 → 切换

---

## 🎯 核心原则

1. **必须使用research-assistant技能** - 不是可选
2. **必须询问3个核心问题** - Q1算法原理 + Q2 Spatial AGI关系 + Q3思考后的自由问题
3. **必须创建详细文档** - 至少500行，完整问答
4. **必须参考昨日思考** - 延续性研究
5. **质量 > 数量** - 精读5篇 > 泛读10篇

---

## 📚 参考文档

1. **QUICK_START.md** - 快速开始指南
2. **EXECUTION_CHECKLIST.md** - 详细检查清单
3. **EXAMPLE_full_analysis_template.md** - 完整示例（1,542行）
4. **research-assistant技能** - `~/.openclaw/workspace/skills/research-assistant/SKILL.md`

---

## 🚀 自动化

### 定时任务

**任务名**: `spatial-agi-research`  
**执行时间**: 每天早上7点  
**执行方式**: Cron → Skill → Scripts

### Cron Payload（简化版）

```markdown
## Spatial AGI 每日研究任务 - 执行skill

请执行 **spatial-agi-research** skill 的每日研究流程。

### 执行步骤

1. **运行主脚本（准备阶段）**
   ```bash
   bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh
   ```
   - 搜索arXiv论文
   - 筛选新论文（自动去重）
   - 创建状态跟踪

2. **筛选5篇新论文**
   - 从 `/tmp/spatial_agi_papers_$(date +%Y-%m-%d).json` 筛选
   - 确保不重复已分析的论文

3. **使用Subagent精读每篇论文**
   - 参考 SKILL.md 的 Step 3 详细流程
   - 每篇论文独立Subagent
   - 至少500行文档

4. **生成每日思考**
   - 参考前一天：`/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date -d yesterday +%Y-%m-%d).md`
   - 保存到：`/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date +%Y-%m-%d).md`

5. **验证思考文档质量** 🆕
   ```bash
   # 验证今天的思考文档
   bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/validate_thinking.sh
   
   # 如果验证失败，补充缺失内容并重试（最多3次）
   if [ $? -ne 0 ]; then
       echo "❌ 验证失败，需要补充内容"
       RETRY=0
       while [ $RETRY -lt 3 ]; do
           echo "重试 $((RETRY+1))/3..."
           sleep 30
           
           # 根据验证失败的具体原因补充内容
           # （这里可以添加自动补充逻辑）
           
           if bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/validate_thinking.sh; then
               echo "✅ 验证通过"
               break
           fi
           ((RETRY++))
       done
       
       if [ $RETRY -eq 3 ]; then
           echo "❌ 验证失败3次，停止任务"
           # 发送错误报告到群
           exit 1
       fi
   fi
   ```

6. **Git提交和推送**
   ```bash
   # 提交
   cd /home/cwh/coding/auto_blog/spatial_agi
   git add .
   git commit -m "feat: Spatial AGI Research - $(date '+%Y-%m-%d')
   
   - 分析5篇论文（arXiv最新，去重）
   - 生成论文深度分析文档
   - 每日思考: $(test -f daily_thinking/$(date +%Y-%m-%d).md && echo '✅' || echo '❌')
   - 更新论文列表
   
   Spatial AGI Research Skill v6.9"
   
   # ⚠️ 必须推送到GitHub
   git push origin main
   ```
   
   **验证推送成功**:
   ```bash
   git log --oneline -1  # 确认提交
   git status            # 确认 "up to date with 'origin/main'"
   ```

### 参考文档
- SKILL.md: `~/.openclaw/workspace/skills/spatial-agi-research/SKILL.md`
- 脚本目录: `~/.openclaw/workspace/skills/spatial-agi-research/scripts/`
```

### 查看任务

```bash
cat ~/.openclaw/cron/jobs.json | jq '.[] | select(.name == "spatial-agi-research")'
```

### 手动触发

```bash
openclaw cron run spatial-agi-research
```

---

## 🔄 Step 0: 完成度检查与补充（每日执行前必做） 🆕

**⚠️ 【强制要求】每次执行前必须检查前一天任务是否完整完成**

```
╔════════════════════════════════════════════════════════════╗
║  🔍 完成度检查流程（每天7:00执行）                         ║
║                                                              ║
║  1. 检查昨天的论文数量（应有5篇）                           ║
║  2. 检查昨天的每日思考（应有200+行）                        ║
║  3. 检查papers_list.md是否更新                              ║
║  4. 如果不完整，先补充昨天，再执行今天                      ║
║                                                              ║
║  ✅ 优先级: 思考 > 论文（思考是核心产出）                   ║
║  ✅ 补充时只生成缺失部分，不重复已完成工作                  ║
╚════════════════════════════════════════════════════════════╝
```

### 执行脚本

```bash
# 检查昨天是否完成
YESTERDAY=$(date -d yesterday +%Y-%m-%d)
BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"

echo "=== 检查 $YESTERDAY 任务完成度 ==="

# 1. 检查论文数量
PAPERS_COUNT=$(ls "$BLOG_DIR"/papers/${YESTERDAY}_*.md 2>/dev/null | wc -l)
echo "📄 论文: $PAPERS_COUNT/5"

# 2. 检查每日思考
THINKING_FILE="$BLOG_DIR/daily_thinking/${YESTERDAY}.md"
if [ -f "$THINKING_FILE" ]; then
    LINES=$(wc -l < "$THINKING_FILE")
    echo "💭 思考: $LINES 行"
    if [ $LINES -lt 200 ]; then
        echo "⚠️  思考行数不足（$LINES < 200），需要补充"
    fi
else
    echo "❌ 思考未生成"
fi

# 3. 检查papers_list.md是否更新
if grep -q "$YESTERDAY" "$BLOG_DIR/papers_list.md" 2>/dev/null; then
    echo "✅ papers_list.md 已更新"
else
    echo "⚠️  papers_list.md 未更新"
fi

# 4. 判断是否需要补充
NEED_SUPPLEMENT="false"

if [ $PAPERS_COUNT -lt 5 ]; then
    echo "⚠️  论文数量不足，需要补充 $((5 - PAPERS_COUNT)) 篇"
    NEED_SUPPLEMENT="true"
fi

if [ ! -f "$THINKING_FILE" ] || [ $(wc -l < "$THINKING_FILE") -lt 200 ]; then
    echo "⚠️  每日思考需要生成/补充"
    NEED_SUPPLEMENT="true"
fi

if [ "$NEED_SUPPLEMENT" = "true" ]; then
    echo ""
    echo "🔄 需要补充昨天的任务"
    echo "   优先级: 思考 > 论文"
    echo ""
    echo "### 补充任务 ###"
    echo ""
    
    # 生成补充任务消息
    echo "请补充完成 $YESTERDAY 的研究任务："
    echo ""
    
    # 思考生成（最高优先级）
    if [ ! -f "$THINKING_FILE" ] || [ $(wc -l < "$THINKING_FILE" 2>/dev/null || echo 0) -lt 200 ]; then
        echo "1. **生成每日思考**（最高优先级）"
        echo "   - 基于已有的 $PAPERS_COUNT 篇论文生成思考"
        echo "   - 参考前天: $(date -d '2 days ago' +%Y-%m-%d).md"
        echo "   - 保存到: $THINKING_FILE"
        echo "   - 要求: 至少200行，包含知识演进图"
        echo ""
    fi
    
    # 论文补充（次优先级）
    if [ $PAPERS_COUNT -lt 5 ]; then
        echo "2. **补充论文分析**"
        echo "   - 缺少 $((5 - PAPERS_COUNT)) 篇"
        echo "   - 从昨天筛选的论文中选择"
        echo "   - 使用Subagent独立分析"
        echo ""
    fi
    
    echo "⚠️  补充完成后再开始今天的任务"
else
    echo "✅ 昨天任务已完整完成，开始今天的任务"
fi
```

### 补充流程

**如果发现昨天任务未完成**：

1. **优先级1: 生成每日思考**
   ```bash
   # 即使只有1-2篇论文，也要生成思考
   # 思考是最重要的产出
   ```

2. **优先级2: 补充论文**
   ```bash
   # 从昨天的论文列表中选择未分析的
   # 每篇使用独立Subagent
   ```

3. **优先级3: 更新papers_list.md**
   ```bash
   # 添加昨天的论文条目
   ```

4. **完成后才开始今天的任务**

---

## ⏱️ 执行时间要求 🆕

**⚠️ 【强制要求】Cron任务timeout必须足够长**

```
╔════════════════════════════════════════════════════════════╗
║  ⏰ 时间预估与配置                                         ║
║                                                              ║
║  完整流程时间:                                              ║
║  - Step 0 (完成度检查): 5分钟                              ║
║  - Step 1-2 (搜索筛选): 15分钟                             ║
║  - Step 3 (5篇论文分析): 130分钟                           ║
║  - Step 4-5 (思考生成): 40分钟                             ║
║  - Step 6-7 (Git提交): 5分钟                               ║
║  - 缓冲时间: 30分钟                                        ║
║  - **总计**: 约3.7小时                                     ║
║                                                              ║
║  ⚠️ Cron timeout 必须 ≥ 4小时 (14400秒)                    ║
║  ⚠️ 建议: 5小时 (18000秒) 以应对网络延迟                   ║
║                                                              ║
║  当前配置: 需要检查和调整                                  ║
╚════════════════════════════════════════════════════════════╝
```

### Cron配置要求

**当前问题**：
- Cron任务实际执行时间: 32分钟
- 预期执行时间: 3.7小时
- **差距**: 缩短了85%

**解决方案**：

1. **增加Cron timeout** (需要修改OpenClaw配置)
   ```bash
   # 查看当前配置
   cat ~/.openclaw/cron/jobs.json | jq '.[] | select(.name == "spatial-agi-research")'
   
   # 需要添加timeout字段（如果OpenClaw支持）
   # 或者在payload中指定
   ```

2. **执行顺序**（已调整）
   ```
   推荐顺序: 搜索 → 筛选 → 论文1-5 → 思考 → Git
   
   原因：
   - ✅ 论文分析是核心产出，必须完成
   - ✅ 思考基于完整的论文分析，质量更高
   - ✅ 避免思考生成失败导致论文分析被跳过
   ```

3. **添加中断恢复机制**
   ```bash
   # 在脚本开头检查昨天的完成度
   # 如果未完成，先补充昨天
   # 然后再开始今天的任务
   ```

### 调整建议

**方案1: 增加timeout（推荐）**
```json
{
  "name": "spatial-agi-research",
  "timeout": 18000,  // 5小时
  "sessionTarget": "isolated"
}
```

**方案2: 分拆任务（备选）**
```
Cron 1 (7:00): 搜索 + 筛选 + 思考生成 (1小时)
Cron 2 (8:00): 论文分析1-3 (1.5小时)
Cron 3 (10:00): 论文分析4-5 + Git (1小时)
```

**方案3: 异步执行（最佳）**
```
Cron触发 → 检查完成度 → 补充缺失 → 启动今天的任务
                ↓
         如果中断，下次heartbeat继续
```

---

**最后更新**: 2026-03-22 11:50
**版本**: v6.9 (强制验证思考文档质量)

**v6.9更新内容** (2026-03-22 11:50):
- ✅ **新增Step 7.5**: 验证思考文档质量（强制步骤）
- ✅ **11项质量检查**: 文档存在性、行数、必需章节、Mermaid图表等
- ✅ **验证脚本**: validate_thinking.sh自动检查文档质量
- ✅ **强制验证**: 验证通过才能继续Git提交
- ✅ **最多3次重试**: 验证失败后允许补充和重试
- ✅ **防止偷懒**: 自动检测缺少思维导图、与昨日联系、架构分析等
- ✅ **质量门控**: 在每个关键步骤后验证质量
- ✅ **早期发现**: 避免到最后才发现文档不完整

**问题解决**: 
- 解决了今天早上思考文档偷懒的问题（缺少思维导图和与昨天的联系）
- 通过11项检查确保文档质量
- 强制验证机制防止AI在token压力下偷懒

**v6.8更新内容** (2026-03-16 10:05):
- ✅ **强制使用main分支**: Git推送必须推送到main，不是master
- ✅ **明确分支规范**: 在skill开头添加醒目的警告框
- ✅ **错误修复**: 如果推送到master，立即删除并重新推送到main
- ✅ **验证步骤**: 推送后确认分支是origin/main，不是origin/master
- ✅ **Cron任务验证**: 确保定时任务使用正确的分支

**v6.7更新内容** (2026-03-16 09:40):
- ✅ **强制验证来源数量**: 必须有≥2个来源才能开始问答
- ✅ **验证PDF链接**: 确认来源包含PDF链接
- ✅ **来源状态检查**: 明确显示来源列表和状态
- ✅ **Fallback机制**: 来源添加失败时自动切换到web_fetch方案
- ✅ **防止假成功**: 避免NotebookLM笔记本无来源却继续问答
- ✅ **详细日志**: 每个验证步骤都有清晰的状态输出

**v6.6更新内容** (2026-03-16 09:25):
- ✅ **强制使用--type url**: PDF链接必须以网站形式添加，不是PDF文件
- ✅ **明确source type**: notebooklm source add --type url "$PDF_URL"
- ✅ **避免文件上传**: 不上传本地PDF，使用URL访问
- ✅ **Fallback方案**: PDF URL失败时使用HTML版本（也是网站形式）
- ✅ **原因说明**: NotebookLM处理网站来源更可靠，PDF文件可能超时或失败
- ✅ **文档更新**: 创建notebooklm-source-requirements.md详细说明

**v6.5更新内容** (2026-03-16 09:22):
- ✅ **强制等待来源处理完成**：问问题前必须确认PDF处理完成
- ✅ **添加来源处理验证**：循环检查状态（每15秒，最多5分钟）
- ✅ **测试问题验证机制**：2分钟后用测试问题验证就绪状态
- ✅ **空答案检测和重试**：每个问题检测空答案，自动重试
- ✅ **详细的日志输出**：清晰的进度显示和错误提示
- ✅ **更新预计时间**：20-25分钟/篇（含来源等待2-5分钟）
- ✅ **关键改进**：避免在来源未处理完成时提问（导致空答案）

**执行顺序（必须严格遵守）**：
```
Step 1: 创建笔记本 → 记录ID
   ↓
Step 2: 添加来源 → 等待处理完成（2-5分钟）✨ 新增
   ├─ 添加arXiv + PDF
   ├─ 循环检查状态（每15秒）
   ├─ 测试问题验证（2分钟后）
   └─ ✅ 确认就绪
   ↓
Step 3: 询问3个问题
   ├─ Q1 → 检查空答案 → 重试
   ├─ Q2 → 检查空答案 → 重试
   └─ Q3 → 检查空答案 → 重试
```

**v6.4更新内容** (2026-03-12 08:42):
- ✅ **调整执行顺序**：论文分析 → 思考（原来是思考优先）
- ✅ 原因：论文分析是核心产出，必须完成
- ✅ 思考基于完整的5篇论文，质量更高
- ✅ 避免思考生成失败导致论文分析被跳过
- ✅ 更新cron payload中的执行顺序说明

**维护者**: OpenClaw AI

**v6.2更新内容** (2026-03-10 09:40):
- ✅ **新增Step 3.6**: 生成演示文稿（3-5分钟）
  - 基于NotebookLM笔记本自动生成
  - 包含核心算法、方法、实验结果、Spatial AGI关系
  - 便于快速回顾和分享
- ✅ **新增Step 3.7**: 生成中文音频概览（2-3分钟）
  - 纯中文音频（便于理解）
  - 适合移动中收听学习
  - 提升学习效率
- ✅ **更新Subagent task**: 添加演示文稿和音频要求
- ✅ **更新时间估算**: 单篇26分钟（18分钟 → 26分钟）
  - 演示文稿: 3-5分钟
  - 音频: 2-3分钟
  - 总流程: 3.2小时（2.5小时 → 3.2小时）
- ✅ **更新质量检查清单**: 添加演示和音频生成检查项
- ✅ **更新强制要求**: 新增第5条规则（演示文稿和音频必须生成）
- ✅ **更新正确流程示例**: 添加演示和音频检查示例

**演示文稿用途**：
- ✅ 快速回顾论文要点
- ✅ 准备学术汇报
- ✅ 与同事分享
- ✅ 提升理解效率

**中文音频用途**：
- ✅ 移动中学习（通勤、锻炼）
- ✅ 多任务处理时收听
- ✅ 加深记忆和复习
- ✅ 语言学习辅助

**v6.1更新内容** (2026-03-09 09:40):
- ✅ **强制要求**：明确Step 9 Git推送到GitHub
- ✅ 更新时间估算表（添加推送步骤）
- ✅ 更新强制要求总结（添加推送规则）
- ✅ 更新Cron Payload（明确推送步骤）

**v6.0更新内容** (2026-03-09 09:00):
- ✅ **架构改进**：脚本集成到skill目录
- ✅ **论文去重**：自动排除已分析的论文
- ✅ **思考重试**：每日思考未生成时自动重试（最多3次）
- ✅ **状态跟踪**：完整的执行状态记录
- ✅ **简化cron**：payload调用skill，skill调用脚本

**v5.0更新内容** (2026-03-05 10:43):
- ✅ **重大改进**：使用Subagent进行论文精读
- ✅ 创建paper-analysis skill作为Subagent的执行逻辑
- ✅ 每篇论文有独立的上下文，避免token限制
- ✅ 确保每篇论文都有完整的分析（不再有精简版）
- ✅ 支持并行处理（可选）

- ✅ 总时间从2.5小时减少到2.5小时（串行）
- ✅ 新增Step 3.5： 收集Subagent结果

- ✅ 修复spatial-agi-research skill的runtime配置
- ✅ 成功测试： ACE-Brain-0论文（1650行，- ✅ Git已提交并推送

**v4.1更新内容** (2026-03-05 08:54):
- ✅ **强制要求**：创建笔记本后必须立即记录ID到 -n "$NOTEBOOK_ID"
- ✅ 添加ID验证步骤
- ✅ 添加日志输出便于调试
- ✅ 更新Step 3和Step 4的示例代码

- ✅ 更新时间估算: 3.5小时 → 2.5小时（串行)
- ✅ 新增Step 3.5: 收集Subagent结果并验证质量

- ✅ 更新质量检查清单（每篇论文Subagent）
- ✅ 更新强制要求总结（6条不可违反的规则)
- ✅ 提供正确/错误流程示例对比
- ✅ 从建议改为强制要求
- ✅ 明确违反规则的后果
- ✅ 提供完整的正确/错误示例

**v5.0更新内容** (2026-03-05 08:50):
- ✅ 修复NotebookLM `use`命令会话管理bug
- ✅ 添加PDF下载链接方法（比上传本地PDF更快）
- ✅ 增加PDF添加超时到90秒
- ✅ 添加30秒等待时间让来源处理完成
- ✅ 更新GLM WebReader使用条件
- ✅ 更新质量检查清单
- ✅ 删除3点的冗余crontab任务
- ✅ 保留7点的spatial-agi-research skill（完整流程)
- ✅ skill已包含论文搜索步骤
- ✅ Git已提交并推送
- ✅ 总时间从3.5小时减少到2.5小时
- ✅ 支持并行处理（可选）
- ✅ 新增Step 3.5: 收集Subagent结果并验证质量
- ✅ 新增强制要求总结（6条不可违反的规则）
- ✅ 提供正确/错误流程示例对比
- ✅ 从建议改为强制要求
- ✅ 明确违反规则的后果
- ✅ 提供完整的正确/错误示例

- ❌ 错误流程示例

  ```bash
  # ❌ 错误1: 不记录ID
  notebooklm create "ACE-Brain-0"
  notebooklm source add "https://arxiv.org/abs/2603.03198v1"
  notebooklm ask "问题"  # 可能使用错误的笔记本
  # ❌ 错误2: 使用use命令
  notebooklm use $ID
  notebooklm ask "问题"  # use有bug

  # ❌ 错误3: 不等待处理
  notebooklm source add "..."
  notebooklm ask "..."  # 来源未处理完成，返回空答案
  ```

**v5.0更新内容** (2026-03-05 09:05):
- ✅ **重大改进**：使用Subagent进行每篇论文的精读
- ✅ 创建paper-analysis skill作为Subagent的执行逻辑
- ✅ 每篇论文有独立的上下文，避免token限制
- ✅ 确保每篇论文都有完整的分析（不再有精简版）
- ✅ 支持并行处理多篇论文（可选）
- ✅ 总时间从3.5小时减少到2.5小时（串行）
- ✅ 新增Step 3.5：收集Subagent结果

**v4.1更新内容** (2026-03-05 08:54):
- ✅ **强制要求**：创建笔记本后必须立即记录ID到变量
- ✅ **强制要求**：所有ask命令必须使用`-n "$NOTEBOOK_ID"`
- ✅ 添加ID验证步骤（检查ID是否存在）
- ✅ 添加日志输出便于调试

**v4.0更新内容** (2026-03-05 08:50):
- ✅ 修复NotebookLM `use`命令会话管理bug（使用`-n`参数）
- ✅ 添加PDF下载链接方法（比上传本地PDF更快）
- ✅ 增加PDF添加超时到90秒

**v3.0更新内容**:
- ✅ 论文数量从10篇减少到5篇（精读 > 泛读）
- ✅ NotebookLM问题从13+个简化为3个核心问题
- ✅ 总时间从~7.5小时减少到~3.7小时

---

## 📋 强制要求总结（v6.1）

### ⚠️ 必须遵守的规则

```
╔════════════════════════════════════════════════════════════╗
║  🚨 强制要求（不可违反）                                   ║
╚════════════════════════════════════════════════════════════╝

1. 🤖 必须使用Subagent进行论文精读
   ✅ sessions_spawn --runtime subagent
   ❌ 在主session中处理论文（会token不足）
   ❌ 创建精简版文档（质量不够）

2. 📝 每篇论文必须有独立的Subagent
   ✅ 5篇论文 = 5个Subagent
   ✅ 每个Subagent独立上下文
   ❌ 多篇论文共用一个Subagent

3. 📄 文档质量要求
   ✅ 至少500行
   ✅ 包含完整的NotebookLM问答记录
   ✅ 包含NotebookLM笔记本ID
   ❌ 少于500行的精简版

4. 📅 每日思考必须生成
   ✅ 至少500行
   ✅ 参考昨天的思考文档
   ✅ 包含知识演进图
   ❌ 跳过思考文档

5. 🎨 演示文稿和音频必须生成（v6.1新增）
   ✅ 问完3个问题后生成演示文稿（3-5分钟）
   ✅ 生成演示文稿后生成中文音频（2-3分钟）
   ✅ 记录生成状态到文档
   ❌ 跳过演示文稿生成
   ❌ 跳过音频生成

6. 🔀 必须推送到GitHub
   ✅ git add . && git commit && git push
   ✅ 确认远程仓库有最新提交
   ❌ 只提交不推送
   ❌ 忘记推送

7. ⏱️ 时间预估（v6.1更新）
   ✅ 单篇论文: 26分钟（含演示+音频）
   ✅ 5篇论文（串行）: 130分钟
   ✅ 总流程: ~3.2小时
```

### ✅ 正确流程示例（v6.1）

```bash
# Step 1: 筛选5篇论文
PAPERS=(
  "ACE-Brain-0|https://arxiv.org/abs/2603.03198v1|https://arxiv.org/pdf/2603.03198v1"
  # ... 其他4篇
)

# Step 2: 对每篇论文启动Subagent
for PAPER_INFO in "${PAPERS[@]}"; do
  IFS='|' read -r TITLE ARXIV_URL PDF_URL <<< "$PAPER_INFO"
  
  # 启动Subagent
  sessions_spawn \
    --mode run \
    --runtime subagent \
    --task "精读论文: $TITLE
    论文信息:
    - 标题: $TITLE
    - arXiv: $ARXIV_URL
    - PDF: $PDF_URL
    - Paper ID: $(echo "$TITLE" | sed 's/[^a-zA-Z0-9]/_/g')
    
    要求:
    1. 创建NotebookLM笔记本并记录ID
    2. 添加来源（arXiv + PDF）
    3. 询问3个核心问题
    4. 生成演示文稿（3-5分钟）
    5. 生成中文音频概览（2-3分钟）
    6. 创建详细文档（至少500行）
    7. 保存到 /home/cwh/coding/auto_blog/spatial_agi/papers/
    
    输出:
    - 笔记本ID
    - 文档路径
    - 文档行数
    - 演示文稿生成状态
    - 音频生成状态" \
    --timeout 1500
done

# Step 3: 收集结果并验证
for FILE in /home/cwh/coding/auto_blog/spatial_agi/papers/$(date +%Y-%m-%d)_*.md; do
  LINES=$(wc -l < "$FILE")
  echo "📄 $(basename $FILE): $LINES 行"
  
  if [ $LINES -lt 500 ]; then
    echo "⚠️ 警告: 文档行数不足500行"
  fi
  
  # 检查演示文稿和音频生成状态
  if ! grep -q "演示文稿" "$FILE"; then
    echo "⚠️ 警告: 缺少演示文稿生成记录"
  fi
  
  if ! grep -q "音频概览" "$FILE"; then
    echo "⚠️ 警告: 缺少音频生成记录"
  fi
done
```

### ❌ 错误流程示例（v5.0）

```bash
# ❌ 错误1: 在主session中处理论文
# （会导致token不足，创建精简版）

# ❌ 错误2: 多篇论文共用一个Subagent
# （会导致上下文混乱）

# ❌ 错误3: 不检查文档质量
# （可能创建精简版而不自知）
```
notebooklm ask "Q1"  # 哪个笔记本？

# ❌ 错误2: 使用use命令
notebooklm create "ACE-Brain-0"
notebooklm use $ID  # use有bug
notebooklm ask "Q1"  # 可能使用错误的笔记本

# ❌ 错误3: 不等待处理
notebooklm source add "https://arxiv.org/pdf/..."
notebooklm ask "Q1"  # 来源还没处理完，返回空答案
```

---

## 🔧 故障排查

### NotebookLM常见问题

#### 问题1: PDF添加超时
```
ERROR [notebooklm._core] RPC ADD_SOURCE failed after 30.445s
Error: Request timed out calling ADD_SOURCE
```

**原因**: 大PDF（>40MB）处理时间超过默认30秒

**解决方案**:
1. ✅ 使用PDF的URL而不是上传本地文件
2. ✅ 增加超时到90秒
3. ✅ 使用arXiv HTML版本作为备选

```bash
# 推荐方法
timeout 90 notebooklm source add "https://arxiv.org/pdf/2603.03198v1" || \
  notebooklm source add "https://arxiv.org/html/2603.03198v1"
```

#### 问题2: 笔记本选择错误
```
# 问的是ACE-Brain-0，返回的是SLAM-Former的答案
```

**原因**: NotebookLM CLI的`use`命令会话管理有bug

**解决方案**: 显式指定笔记本ID
```bash
# ❌ 错误方法
notebooklm use $NOTEBOOK_ID
notebooklm ask "问题"  # 可能使用错误的笔记本

# ✅ 正确方法
notebooklm ask -n $NOTEBOOK_ID "问题"  # 显式指定
```

#### 问题3: 返回空答案
```
Answer:

Conversation: 6e59af6e... (turn ?)
```

**原因**: 来源未处理完成就提问

**解决方案**: 添加等待时间
```bash
# 添加来源后等待30秒
notebooklm source add "https://arxiv.org/abs/2603.03198v1"
sleep 30  # 等待处理
notebooklm ask -n $NOTEBOOK_ID "问题"
```

### 代理问题

#### 问题: 代理连接失败
```
ERROR: Cannot connect to proxy socks5://127.0.0.1:1080
```

**解决方案**:
1. 检查代理是否启动
2. 验证代理配置
3. 使用正确的环境变量

```bash
# 检查代理
curl --socks5 127.0.0.1:1080 https://www.google.com

# 设置环境变量
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"
```

### GLM WebReader问题

#### 问题: 何时切换到GLM WebReader?

**判断标准**:
```
✅ 切换条件（满足任意一条）:
  - NotebookLM连接超时 > 90秒
  - PDF添加失败3次以上
  - `ask`返回空答案3次以上
  - `ask`返回错误笔记本的答案2次以上

❌ 不要切换:
  - 为了节省时间
  - 响应慢但能工作
  - 个人偏好
```

---

**记住**: 质量 > 数量。 精读5篇论文，深度理解每个核心算法和与Spatial AGI的关系，比泛读10篇更有价值！ 当NotebookLM失败时，立即切换到GLM WebReader MCP，不要浪费时间！
