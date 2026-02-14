#!/bin/bash

# GLM Web Reader 便捷脚本
# 用法: ./scripts/glm_read.sh "网页URL" [选项]

URL="$1"
TIMEOUT="${2:-20}"  # 默认20秒超时
FORMAT="${3:-markdown}"  # 默认Markdown格式
NO_CACHE="${4:-false}"  # 默认使用缓存

# 检查参数
if [ -z "$URL" ]; then
    echo "用法: $0 \"网页URL\" [超时] [格式] [禁用缓存]"
    echo ""
    echo "参数:"
    echo "  网页URL     必需"
    echo "  超时(秒)   默认20"
    echo "  格式         markdown (默认) 或 text"
    echo "  禁用缓存    true 或 false (默认)"
    echo ""
    echo "示例:"
    echo "  $0 \"https://docs.python.org/zh-cn/3/library/asyncio.html\""
    echo "  $0 \"https://example.com\" 10 text true"
    exit 1
fi

echo "📖 GLM Web Reader"
echo "URL: $URL"
echo "超时: ${TIMEOUT}秒"
echo "格式: $FORMAT"
echo "禁用缓存: $NO_CACHE"
echo "---"

# 调用mcporter读取网页
mcporter call web-reader.webReader \
    url="$URL" \
    timeout="$TIMEOUT" \
    return_format="$FORMAT" \
    no_cache="$NO_CACHE"

echo ""
echo "✅ 读取完成"
