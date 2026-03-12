## Spatial AGI 每日研究任务（健壮版本 v5.0）

⚠️ **容错执行模式** - 单点失败不影响整体任务

### 执行前检查

1. **检查昨日任务状态**
   ```bash
   bash /home/cwh/.openclaw/workspace/scripts/check_spatial_agi_status.sh
   ```
   - 如果有未完成的论文，优先补充

2. **执行准备工作**（带重试）
   ```bash
   bash /home/cwh/.openclaw/workspace/scripts/spatial_agi_daily_robust.sh
   ```
   - 自动搜索论文
   - 创建状态跟踪文件
   - 准备Git提交脚本

### 核心任务（容错执行）

#### 1. 筛选5篇论文

从搜索结果中筛选5篇最有价值的论文：
- 查看文件：`/tmp/spatial_agi_papers_$(date +%Y-%m-%d).json`
- 标准：相关性、创新性、时效性
- 记录到状态文件

#### 2. 论文深度分析（独立Subagent，容错）

**⚠️ 关键：每篇论文使用独立Subagent，失败不影响其他**

```bash
# 论文列表（从筛选结果填充）
PAPERS=(
  "论文1标题|arXiv链接|PDF链接"
  "论文2标题|arXiv链接|PDF链接"
  "论文3标题|arXiv链接|PDF链接"
  "论文4标题|arXiv链接|PDF链接"
  "论文5标题|arXiv链接|PDF链接"
)

# 对每篇论文
for i in ${!PAPERS[@]}; do
  PAPER_INFO=${PAPERS[$i]}
  IFS='|' read -r TITLE ARXIV_URL PDF_URL <<< "$PAPER_INFO"

  PAPER_ID=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9]/_/g')
  DATE=$(date +%Y-%m-%d)

  echo "📚 处理论文 $((i+1))/5: $TITLE"

  # 检查是否已处理
  if ls /home/cwh/coding/auto_blog/spatial_agi/papers/${DATE}_$(printf '%02d' $((i+1)))_${PAPER_ID}.md 1>/dev/null 2>&1; then
    echo "✅ 已处理，跳过"
    continue
  fi

  # 启动Subagent
  sessions_spawn \
    --mode run \
    --runtime subagent \
    --agent-id paper-analysis \
    --task "精读论文: $TITLE

论文信息:
- 标题: $TITLE
- arXiv: $ARXIV_URL
- PDF: $PDF_URL
- Paper ID: $PAPER_ID

要求:
1. 创建NotebookLM笔记本并记录ID
2. 添加来源（arXiv页面 + PDF）
3. 如果NotebookLM失败（超时、连接错误），切换到GLM WebReader
4. 询问3个核心问题：
   - Q1: 核心算法原理
   - Q2: 与Spatial AGI的关系
   - Q3: 基于Q1/Q2的自由问题
5. 创建详细文档（至少500行）
6. 保存到 /home/cwh/coding/auto_blog/spatial_agi/papers/${DATE}_$(printf '%02d' $((i+1)))_${PAPER_ID}.md

容错机制:
- NotebookLM超时90秒 → 使用GLM WebReader
- PDF添加失败3次 → 使用arXiv HTML版本
- 文档行数<500 → 标记为失败，继续下一篇

输出:
- 分析方法（NotebookLM或GLM）
- 文档路径
- 文档行数" \
    --timeout 1800 \
    --run-timeout 1800

  # 验证结果
  RESULT=$?
  DOC_FILE="/home/cwh/coding/auto_blog/spatial_agi/papers/${DATE}_$(printf '%02d' $((i+1)))_${PAPER_ID}.md"

  if [ $RESULT -eq 0 ] && [ -f "$DOC_FILE" ]; then
    LINES=$(wc -l < "$DOC_FILE")
    if [ $LINES -ge 500 ]; then
      echo "✅ 论文 $((i+1)) 完成: $LINES 行"
    else
      echo "⚠️  论文 $((i+1)) 行数不足: $LINES < 500"
    fi
  else
    echo "❌ 论文 $((i+1)) 失败，继续处理下一篇"
  fi
done

echo ""
echo "论文分析完成，继续后续步骤..."
```

**容错要点**：
- ✅ 每篇论文独立Subagent
- ✅ 失败不影响其他论文
- ✅ 质量验证（行数检查）
- ✅ NotebookLM失败自动切换GLM

#### 3. 生成每日思考（强制要求：演进图+延续性）

**⚠️ 这一步有严格的格式要求，必须包含所有图表！**

**必须阅读的文档**：
```bash
# 读取昨天的思考（如果存在）
YESTERDAY=$(date -d yesterday +%Y-%m-%d)
YESTERDAY_FILE="/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$YESTERDAY.md"

if [ -f "$YESTERDAY_FILE" ]; then
  echo "✅ 阅读昨日思考: $YESTERDAY_FILE"
  cat "$YESTERDAY_FILE"
else
  echo "⚠️  昨日思考不存在，这是第一天"
fi
```

**必须包含的内容**：
1. ✅ **与昨日思考的联系**（文档开头）
   - 昨日重点总结
   - 今日进展（延续昨天）
   - 延续性分析（昨天→今天）

2. ✅ **知识演进图**（Mermaid图表）
   - 核心见解演进图（graph LR）
   - 技术栈演进对比表
   - 问题追踪表格
   - 知识缺口分析（pie图）
   - 关键里程碑（timeline）

3. ✅ **架构演进对比**
   - 昨日架构 vs 今日架构
   - 标注新增/更新的层次

4. ✅ **下一步演进方向**
   - 昨天→今天→明天的路径
   - 基于今日发现预测明日方向

**参考模板**：
- 完整模板：`/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/2026-03-06.md`
- 技能文档：`~/.openclaw/workspace/skills/spatial-agi-research/SKILL.md`（Step 7部分）

**保存路径**：
- `/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date +%Y-%m-%d).md`

**质量检查**：
- ❌ 如果缺少"与昨日思考的联系"→ 标记为失败
- ❌ 如果缺少任何演进图 → 标记为失败
- ❌ 如果独立的一天，没有延续性 → 标记为失败

#### 4. 更新论文列表

更新 `/home/cwh/coding/auto_blog/spatial_agi/papers_list.md`，记录所有成功分析的论文。

#### 5. Git提交

```bash
bash /tmp/spatial_agi_commit_after_research.sh
```

### 质量检查

执行完成后，检查状态：
```bash
bash /home/cwh/.openclaw/workspace/scripts/check_spatial_agi_status.sh
```

### 最终报告

在QQ通知中报告：
- ✅ 成功分析：X/5篇
- ❌ 失败：Y篇（原因）
- 📄 生成的文档列表
- 💡 主要发现

### 参考文档

- 技能文档：`~/.openclaw/workspace/skills/spatial-agi-research/SKILL.md`
- 状态文件：`/tmp/spatial_agi_state_$(date +%Y-%m-%d).json`
- 日志文件：`/tmp/spatial_agi_research_$(date +%Y-%m-%d).log`

### 研究重点

1. 空间表示方法（几何、坐标、语义）
2. VLM的空间推理能力
3. 3D场景理解技术
4. Embodied AI应用
5. 多模态融合方法

### 关键原则

- **质量 > 数量**：宁可少分析，不要降低质量
- **容错 > 完美**：部分成功胜过完全失败
- **记录 > 隐式**：所有状态显式记录
- **验证 > 信任**：检查文档质量（行数）
