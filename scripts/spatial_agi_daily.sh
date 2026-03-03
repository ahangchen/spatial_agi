#!/bin/bash
# Spatial AGI 每日研究任务

set -e

WORKSPACE="/home/cwh/.openclaw/workspace"
BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"
SCRIPTS_DIR="$WORKSPACE/scripts"
DATE=$(date +%Y-%m-%d)

echo "=== Spatial AGI Daily Research - $DATE ==="

# 1. 搜索最新论文
echo "步骤1: 搜索arXiv论文..."
cd "$SCRIPTS_DIR"

# 搜索关键词（使用简单关键词，避免高级搜索语法）
KEYWORDS=(
    "spatial intelligence"
    "vision language model"
    "3D reconstruction gaussian"
    "robot learning embodied"
    "world model video generation"
)

PAPERS_FILE="/tmp/spatial_agi_papers_$DATE.json"
> "$PAPERS_FILE"

for keyword in "${KEYWORDS[@]}"; do
    echo "  搜索: $keyword"
    python3 search_arxiv.py "$keyword" 10 >> "$PAPERS_FILE" 2>&1
    sleep 2  # 避免API限制
done

echo "论文搜索完成，结果保存在: $PAPERS_FILE"

# 2. 创建必要的目录
echo "步骤2: 创建目录结构..."
mkdir -p "$BLOG_DIR/papers"
mkdir -p "$BLOG_DIR/daily_thinking"

# 3. 生成研究提示消息
echo "步骤3: 生成研究任务消息..."

MESSAGE="## Spatial AGI 每日研究任务 - $DATE

请执行以下研究任务：

### 1. 分析今日搜索结果
- 查看 /tmp/spatial_agi_papers_$DATE.json
- 筛选出10篇最有价值的论文
- 标准：相关性、创新性、时效性

### 2. 创建论文介绍文档
- 为每篇论文创建markdown文档
- 保存到 /home/cwh/coding/auto_blog/spatial_agi/papers/
- 文件命名：${DATE}_XX_paper_title.md
- 包含：核心问题、主要方法、关键创新、与Spatial AGI的关系

### 3. 生成每日思考
- 基于今日论文生成深度思考文档
- 保存到 /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/${DATE}.md
- 包含：核心见解、架构思考、未来方向、技术挑战

### 4. 更新论文列表
- 更新 /home/cwh/coding/auto_blog/spatial_agi/papers_list.md
- 记录今日研究的论文

### 5. 参考前日思考
- 如果存在 /home/cwh/coding/auto_blog/spatial_agi/daily_thinking/$(date -d yesterday +%Y-%m-%d).md
- 阅读并基于前一天的思考继续深入

### 研究重点：
1. 空间表示方法（几何、坐标、语义）
2. VLM的空间推理能力
3. 3D场景理解技术
4. Embodied AI应用
5. 多模态融合方法

### 输出要求：
- 提取有价值的见解
- 识别技术趋势
- 提出研究问题
- 记录启发和思考

执行完成后，总结今日研究的主要发现。"

echo "$MESSAGE"

# 4. Git自动提交（在研究完成后执行）
echo ""
echo "步骤4: 准备Git自动提交..."
echo "注意：此步骤将在研究完成后自动执行"

# 创建提交脚本
cat > /tmp/spatial_agi_commit_after_research.sh << 'COMMIT_SCRIPT'
#!/bin/bash
# 研究完成后自动提交

BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"
DATE=$(date '+%Y-%m-%d')

cd "$BLOG_DIR" || exit 1

# 检查是否有更改
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ 没有新的更改需要提交"
    exit 0
fi

# 添加所有更改
echo "📝 添加更改到Git..."
git add .

# 创建提交
COMMIT_MSG="feat: Spatial AGI Research - $DATE

- 分析5篇论文（arXiv最新）
- 生成论文深度分析文档
- 更新每日思考文档
- 更新论文列表

Spatial AGI Research Skill v3.1"

echo "💾 创建提交..."
git commit -m "$COMMIT_MSG"

# 推送到远程
echo "🚀 推送到GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 已自动提交到GitHub: https://github.com/ahangchen/spatial_agi"
else
    echo "❌ 推送失败，请手动提交"
    exit 1
fi
COMMIT_SCRIPT

chmod +x /tmp/spatial_agi_commit_after_research.sh

echo "✅ Git提交脚本已准备就绪"
echo "   脚本位置: /tmp/spatial_agi_commit_after_research.sh"
echo ""
echo "=== 任务准备完成 ==="
echo ""
echo "⚠️  重要提示："
echo "   研究完成后，请执行以下命令进行自动提交："
echo "   bash /tmp/spatial_agi_commit_after_research.sh"
