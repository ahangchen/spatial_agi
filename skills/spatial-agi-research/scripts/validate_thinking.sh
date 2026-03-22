#!/bin/bash
# 验证每日思考文档是否符合skill要求
# 用法: bash validate_thinking.sh [日期]

set -e

# 参数
DATE=${1:-$(date +%Y-%m-%d)}
THINKING_FILE="/home/cwh/coding/auto_blog/spatial_agi/daily_thinking/${DATE}.md"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 验证思考文档: $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 计数器
ERRORS=0
WARNINGS=0

# 检查1: 文档存在性
echo "📋 检查1: 文档存在性"
if [ ! -f "$THINKING_FILE" ]; then
    echo "   ❌ 错误：思考文档未生成"
    ((ERRORS++))
else
    echo "   ✅ 文档存在"
fi
echo ""

# 检查2: 文档行数（至少800行）
echo "📋 检查2: 文档行数"
LINES=$(wc -l < "$THINKING_FILE")
if [ $LINES -lt 800 ]; then
    echo "   ❌ 错误：文档行数不足（$LINES < 800）"
    echo "   📊 当前: $LINES 行"
    echo "   🎯 要求: ≥ 800 行"
    ((ERRORS++))
else
    echo "   ✅ 行数达标: $LINES 行"
fi
echo ""

# 检查3: 包含"与昨日思考的联系"
echo "📋 检查3: 与昨日思考的联系"
if grep -q "## 🔗 与昨日思考的联系" "$THINKING_FILE"; then
    # 检查是否有实际内容（至少5行）
    SECTION_LINES=$(sed -n '/## 🔗 与昨日思考的联系/,/^## /p' "$THINKING_FILE" | wc -l)
    if [ $SECTION_LINES -lt 10 ]; then
        echo "   ⚠️  警告：'与昨日思考的联系'内容过少（$SECTION_LINES 行）"
        ((WARNINGS++))
    else
        echo "   ✅ 包含'与昨日思考的联系'（$SECTION_LINES 行）"
    fi
else
    echo "   ❌ 错误：缺少'与昨日思考的联系'章节"
    ((ERRORS++))
fi
echo ""

# 检查4: 包含核心见解演进图（Mermaid graph LR）
echo "📋 检查4: 核心见解演进图"
if grep -q "graph LR" "$THINKING_FILE"; then
    GRAPH_COUNT=$(grep -c "graph LR" "$THINKING_FILE")
    echo "   ✅ 包含演进图（$GRAPH_COUNT 个）"
else
    echo "   ❌ 错误：缺少知识演进图（Mermaid graph LR）"
    ((ERRORS++))
fi
echo ""

# 检查5: 包含技术栈演进对比表
echo "📋 检查5: 技术栈演进对比表"
if grep -q "技术栈演进对比" "$THINKING_FILE"; then
    # 检查是否包含表格（至少5行）
    TABLE_LINES=$(sed -n '/技术栈演进对比/,/^$/p' "$THINKING_FILE" | grep "|" | wc -l)
    if [ $TABLE_LINES -lt 5 ]; then
        echo "   ⚠️  警告：技术栈对比表内容过少（$TABLE_LINES 行）"
        ((WARNINGS++))
    else
        echo "   ✅ 包含技术栈对比表（$TABLE_LINES 行）"
    fi
else
    echo "   ❌ 错误：缺少技术栈演进对比表"
    ((ERRORS++))
fi
echo ""

# 检查6: 包含知识缺口分析（Mermaid pie）
echo "📋 检查6: 知识缺口分析"
if grep -q "知识缺口分析" "$THINKING_FILE"; then
    if grep -q "pie title" "$THINKING_FILE"; then
        echo "   ✅ 包含知识缺口分析（pie图）"
    else
        echo "   ⚠️  警告：缺少知识缺口pie图"
        ((WARNINGS++))
    fi
else
    echo "   ❌ 错误：缺少知识缺口分析"
    ((ERRORS++))
fi
echo ""

# 检查7: 包含10层架构思维导图（Mermaid mindmap）
echo "📋 检查7: 10层架构思维导图"
if grep -q "10层架构思维导图" "$THINKING_FILE"; then
    if grep -q "mindmap" "$THINKING_FILE"; then
        # 检查是否包含10层
        LEVEL_COUNT=$(grep -E "Level [0-9]:" "$THINKING_FILE" | wc -l)
        if [ $LEVEL_COUNT -lt 10 ]; then
            echo "   ⚠️  警告：架构层次不足（$LEVEL_COUNT < 10）"
            ((WARNINGS++))
        else
            echo "   ✅ 包含10层架构思维导图（$LEVEL_COUNT 层）"
        fi
    else
        echo "   ❌ 错误：缺少mindmap代码"
        ((ERRORS++))
    fi
else
    echo "   ❌ 错误：缺少10层架构思维导图"
    ((ERRORS++))
fi
echo ""

# 检查8: 包含主线技术路径
echo "📋 检查8: 主线技术路径"
if grep -q "主线技术路径" "$THINKING_FILE"; then
    # 检查阶段数量（至少4个）
    STAGE_COUNT=$(grep -c "阶段[0-9]:" "$THINKING_FILE")
    if [ $STAGE_COUNT -lt 4 ]; then
        echo "   ⚠️  警告：技术路径阶段不足（$STAGE_COUNT < 4）"
        ((WARNINGS++))
    else
        echo "   ✅ 包含主线技术路径（$STAGE_COUNT 个阶段）"
    fi
else
    echo "   ❌ 错误：缺少主线技术路径"
    ((ERRORS++))
fi
echo ""

# 检查9: 包含待探索议题
echo "📋 检查9: 待探索议题"
if grep -q "待探索议题" "$THINKING_FILE"; then
    # 检查议题数量（至少9个）
    TOPIC_COUNT=$(grep -c "#### " "$THINKING_FILE" | head -1)
    if [ $TOPIC_COUNT -lt 9 ]; then
        echo "   ⚠️  警告：待探索议题数量不足（$TOPIC_COUNT < 9）"
        ((WARNINGS++))
    else
        echo "   ✅ 包含待探索议题"
    fi
else
    echo "   ❌ 错误：缺少待探索议题"
    ((ERRORS++))
fi
echo ""

# 检查10: 包含本质思考
echo "📋 检查10: 本质思考"
if grep -q "💡 本质思考" "$THINKING_FILE"; then
    # 检查3个子问题
    if grep -q "核心能力的本质" "$THINKING_FILE" && \
       grep -q "当前方法与理想目标的差距" "$THINKING_FILE" && \
       grep -q "从今天到理想状态" "$THINKING_FILE"; then
        echo "   ✅ 包含完整的本质思考（3个子问题）"
    else
        echo "   ⚠️  警告：本质思考不完整"
        ((WARNINGS++))
    fi
else
    echo "   ❌ 错误：缺少本质思考"
    ((ERRORS++))
fi
echo ""

# 检查11: Mermaid图表总数
echo "📋 检查11: Mermaid图表数量"
MERMAID_COUNT=$(grep -c "```mermaid" "$THINKING_FILE")
if [ $MERMAID_COUNT -lt 3 ]; then
    echo "   ❌ 错误：Mermaid图表不足（$MERMAID_COUNT < 3）"
    echo "   📊 要求: 至少3个图表"
    echo "      - 核心见解演进图（graph LR）"
    echo "      - 知识缺口分析（pie）"
    echo "      - 10层架构思维导图（mindmap）"
    ((ERRORS++))
else
    echo "   ✅ Mermaid图表达标: $MERMAID_COUNT 个"
fi
echo ""

# ━━━ 汇总 ━━━
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 验证结果汇总"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "❌ 错误数: $ERRORS"
echo "⚠️  警告数: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ 所有检查通过！文档符合skill要求"
    exit 0
else
    echo "❌ 发现 $ERRORS 个错误，文档不符合skill要求"
    echo ""
    echo "🔧 请重新生成文档，确保包含："
    echo "   1. 与昨日思考的联系"
    echo "   2. 核心见解演进图（graph LR）"
    echo "   3. 技术栈演进对比表"
    echo "   4. 知识缺口分析（pie图）"
    echo "   5. 10层架构思维导图（mindmap）"
    echo "   6. 主线技术路径（至少4个阶段）"
    echo "   7. 待探索议题（至少9个）"
    echo "   8. 本质思考（3个子问题）"
    echo ""
    echo "📝 文档路径: $THINKING_FILE"
    echo "📊 当前行数: $LINES 行"
    exit 1
fi
