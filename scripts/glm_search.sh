#!/bin/bash

# GLM Web Search 便捷脚本
# 用法: ./scripts/glm_search.sh "搜索关键词" [选项]

QUERY="$1"
LOCATION="${2:-cn}"  # 默认中国区域
RECENCY="${3:-noLimit}"  # 默认无时间限制
COUNT="${4:-5}"  # 默认返回5条结果

# 检查参数
if [ -z "$QUERY" ]; then
    echo "用法: $0 \"搜索关键词\" [区域] [时间范围] [结果数量]"
    echo ""
    echo "参数:"
    echo "  搜索关键词   必需"
    echo "  区域         cn (默认) 或 us"
    echo "  时间范围     oneDay, oneWeek, oneMonth, oneYear, noLimit (默认)"
    echo "  结果数量   默认5"
    echo ""
    echo "示例:"
    echo "  $0 \"人工智能最新发展\""
    echo "  $0 \"Python asyncio\" us oneWeek 10"
    exit 1
fi

echo "🔍 GLM Web Search"
echo "查询: $QUERY"
echo "区域: $LOCATION"
echo "时间范围: $RECENCY"
echo "结果数量: $COUNT"
echo "---"

# 调用mcporter执行搜索
mcporter call web-search-prime.webSearchPrime \
    search_query="$QUERY" \
    location="$LOCATION" \
    search_recency_filter="$RECENCY"

echo ""
echo "✅ 搜索完成"
