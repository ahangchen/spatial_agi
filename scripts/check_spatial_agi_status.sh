#!/bin/bash
# 检查Spatial AGI研究任务的状态

DATE=$(date +%Y-%m-%d)
STATE_FILE="/tmp/spatial_agi_state_$DATE.json"
LOG_FILE="/tmp/spatial_agi_research_$DATE.log"
BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"

echo "=== Spatial AGI 研究任务状态检查 ==="
echo "日期: $DATE"
echo ""

# 检查状态文件
if [ -f "$STATE_FILE" ]; then
    echo "📊 状态文件: $STATE_FILE"
    echo "内容:"
    cat "$STATE_FILE" | jq '.' 2>/dev/null || cat "$STATE_FILE"
    echo ""
else
    echo "⚠️  状态文件不存在: $STATE_FILE"
    echo ""
fi

# 检查日志文件
if [ -f "$LOG_FILE" ]; then
    echo "📄 日志文件: $LOG_FILE"
    echo "最后20行:"
    tail -20 "$LOG_FILE"
    echo ""
else
    echo "⚠️  日志文件不存在: $LOG_FILE"
    echo ""
fi

# 检查生成的论文文档
echo "📚 今日论文文档:"
if ls "$BLOG_DIR/papers/${DATE}_"*.md 1>/dev/null 2>&1; then
    for file in "$BLOG_DIR/papers/${DATE}_"*.md; do
        lines=$(wc -l < "$file")
        size=$(ls -lh "$file" | awk '{print $5}')
        filename=$(basename "$file")
        if [ $lines -ge 500 ]; then
            echo "  ✅ $filename ($lines 行, $size)"
        else
            echo "  ⚠️  $filename ($lines 行, $size) - 行数不足"
        fi
    done
else
    echo "  ⚠️  没有找到今日论文文档"
fi
echo ""

# 检查每日思考
echo "💭 每日思考:"
if [ -f "$BLOG_DIR/daily_thinking/${DATE}.md" ]; then
    lines=$(wc -l < "$BLOG_DIR/daily_thinking/${DATE}.md")
    echo "  ✅ ${DATE}.md ($lines 行)"
else
    echo "  ⚠️  每日思考未生成"
fi
echo ""

# 统计
echo "📈 统计:"
papers_count=$(ls "$BLOG_DIR/papers/${DATE}_"*.md 2>/dev/null | wc -l)
papers_qualified=$(find "$BLOG_DIR/papers" -name "${DATE}_*.md" -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -ge 500 ] && echo "$1"' _ {} \; | wc -l)

echo "  - 论文文档: $papers_count 个"
echo "  - 合格文档（≥500行）: $papers_qualified 个"
echo "  - 完成率: $((papers_qualified * 100 / 5))% (目标: 5篇)"
echo ""

# 建议
echo "💡 建议:"
if [ $papers_qualified -lt 5 ]; then
    missing=$((5 - papers_qualified))
    echo "  - 还需分析 $missing 篇论文"
    echo "  - 检查状态文件中的失败记录"
    echo "  - 可以手动补充缺失的论文分析"
else
    echo "  - ✅ 今日任务完成"
    echo "  - 记得执行Git提交: bash /tmp/spatial_agi_commit_after_research.sh"
fi
