#!/bin/bash
# 创建NotebookLM笔记本并添加来源
# 用法: bash create_notebook.sh <标题> <网页URL> <arXiv URL> [GitHub URL]

set -e

# 环境设置
CONDA_BASE="${CONDA_BASE:-/home/cwh/miniconda3}"
export https_proxy="${https_proxy:-socks5://127.0.0.1:1080}"
export http_proxy="${http_proxy:-socks5://127.0.0.1:1080}"

# 激活conda base环境
source "$CONDA_BASE/bin/activate" base

TITLE="$1"
WEB_URL="$2"
ARXIV_URL="$3"
GITHUB_URL="$4"

if [ -z "$TITLE" ] || [ -z "$WEB_URL" ]; then
    echo "用法: bash create_notebook.sh <标题> <网页URL> <arXiv URL> [GitHub URL]"
    exit 1
fi

echo "[创建NotebookLM笔记本]"

# 创建笔记本
echo "  创建笔记本: $TITLE"
NOTEBOOK_OUTPUT=$(notebooklm create "$TITLE" 2>&1)
NOTEBOOK_ID=$(echo "$NOTEBOOK_OUTPUT" | grep -oP 'Created notebook: \K[^ ]+' || echo "")

if [ -z "$NOTEBOOK_ID" ]; then
    echo "  错误: 无法创建笔记本"
    echo "$NOTEBOOK_OUTPUT"
    exit 1
fi

echo "  笔记本ID: $NOTEBOOK_ID"

# 设置当前笔记本
notebooklm use "$NOTEBOOK_ID" > /dev/null 2>&1

# 添加来源
echo "  添加来源..."

# 添加项目网页
if [ -n "$WEB_URL" ]; then
    echo "    - 项目网页"
    notebooklm source add "$WEB_URL" > /dev/null 2>&1 || echo "    (项目网页添加失败或已存在)"
fi

# 添加arXiv页面
if [ -n "$ARXIV_URL" ]; then
    echo "    - arXiv页面"
    notebooklm source add "$ARXIV_URL" > /dev/null 2>&1 || echo "    (arXiv添加失败或已存在)"
fi

# 添加GitHub仓库
if [ -n "$GITHUB_URL" ]; then
    echo "    - GitHub仓库"
    notebooklm source add "$GITHUB_URL" > /dev/null 2>&1 || echo "    (GitHub添加失败或已存在)"
fi

# 等待来源处理
echo "  等待来源处理..."
sleep 10

# 输出笔记本信息
echo ""
echo "  笔记本创建完成!"
echo "  ID: $NOTEBOOK_ID"
echo "  标题: $TITLE"

# 保存笔记本信息
OUTPUT_DIR="$(dirname "$0")/../output"
mkdir -p "$OUTPUT_DIR"
cat > "$OUTPUT_DIR/notebook_info.json" << EOF
{
    "notebook_id": "$NOTEBOOK_ID",
    "title": "$TITLE",
    "web_url": "$WEB_URL",
    "arxiv_url": "$ARXIV_URL",
    "github_url": "$GITHUB_URL"
}
EOF

echo "  信息已保存到: $OUTPUT_DIR/notebook_info.json"
