#!/bin/bash
# 论文研究完整工作流
# 用法: bash research_workflow.sh <论文网页URL>

set -e

# 获取脚本目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$SKILL_DIR/output"

# 环境设置
export CONDA_BASE="${CONDA_BASE:-/home/cwh/miniconda3}"
export https_proxy="${https_proxy:-socks5://127.0.0.1:1080}"
export http_proxy="${http_proxy:-socks5://127.0.0.1:1080}"
export SKILLS_ROOT="${SKILLS_ROOT:-/home/cwh/ubuntu18/home/ubuntu/coding/LobsterAI/SKILLs}"

PAPER_URL="$1"

if [ -z "$PAPER_URL" ]; then
    echo "用法: bash research_workflow.sh <论文网页URL>"
    echo ""
    echo "示例:"
    echo "  bash research_workflow.sh https://xinjiu612.github.io/NavDreamer/"
    echo "  bash research_workflow.sh https://arxiv.org/abs/2602.09765"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "   Paper Research Workflow"
echo "========================================"
echo ""
echo "输入URL: $PAPER_URL"
echo "输出目录: $OUTPUT_DIR"
echo ""

# 步骤1: 提取论文链接
echo "[1/5] 提取论文链接..."
python "$SCRIPT_DIR/extract_paper_links.py" "$PAPER_URL" "$OUTPUT_DIR"

# 读取提取的链接
PAPER_LINKS="$OUTPUT_DIR/paper_links.json"
if [ ! -f "$PAPER_LINKS" ]; then
    echo "错误: 无法提取论文链接"
    exit 1
fi

# 解析JSON (使用grep和sed简单解析)
TITLE=$(grep -o '"title": *"[^"]*"' "$PAPER_LINKS" | sed 's/"title": *"\([^"]*\)"/\1/')
ARXIV_URL=$(grep -o '"arxiv_url": *"[^"]*"' "$PAPER_LINKS" | sed 's/"arxiv_url": *"\([^"]*\)"/\1/')
GITHUB_URL=$(grep -o '"github_url": *"[^"]*"' "$PAPER_LINKS" | sed 's/"github_url": *"\([^"]*\)"/\1/')

# 如果标题为空，使用默认标题
if [ -z "$TITLE" ]; then
    TITLE="Paper Research"
fi

# 转义标题中的特殊字符
TITLE="${TITLE//\"/\\\"}"

echo ""

# 步骤2: 创建NotebookLM笔记本
echo "[2/5] 创建NotebookLM笔记本..."
bash "$SCRIPT_DIR/create_notebook.sh" "$TITLE" "$PAPER_URL" "$ARXIV_URL" "$GITHUB_URL"

# 读取笔记本ID
NOTEBOOK_INFO="$OUTPUT_DIR/notebook_info.json"
NOTEBOOK_ID=$(grep -o '"notebook_id": *"[^"]*"' "$NOTEBOOK_INFO" | sed 's/"notebook_id": *"\([^"]*\)"/\1/')

if [ -z "$NOTEBOOK_ID" ]; then
    echo "错误: 无法创建笔记本"
    exit 1
fi

echo ""

# 步骤3: 生成演示文稿和音频
echo "[3/5] 生成演示文稿和中文音频..."
bash "$SCRIPT_DIR/generate_content.sh" "$NOTEBOOK_ID"

echo ""

# 步骤4: 问答研究问题
echo "[4/5] 问答研究问题..."
bash "$SCRIPT_DIR/ask_questions.sh" "$NOTEBOOK_ID" "$OUTPUT_DIR/answers.md"

echo ""

# 步骤5: Scholar Inbox点赞
echo "[5/5] Scholar Inbox 搜索点赞..."

# 从标题提取论文简称用于搜索
SEARCH_TERM=$(echo "$TITLE" | sed 's/:.*//' | sed 's/ .*$//' | head -c 30)

# 检查cookies是否存在
if [ ! -f "$OUTPUT_DIR/scholar_cookies.json" ]; then
    echo "  首次使用，正在获取Scholar Inbox cookies..."
    python "$SCRIPT_DIR/fetch_scholar_cookies.py" "$OUTPUT_DIR/scholar_cookies.json"
fi

node "$SCRIPT_DIR/scholar_inbox_like.js" "$SEARCH_TERM" "$OUTPUT_DIR" || echo "  Scholar Inbox操作完成"

echo ""
echo "========================================"
echo "   工作流完成!"
echo "========================================"
echo ""
echo "输出文件:"
echo "  - 论文链接: $OUTPUT_DIR/paper_links.json"
echo "  - 笔记本信息: $OUTPUT_DIR/notebook_info.json"
echo "  - 研究问答: $OUTPUT_DIR/answers.md"
echo "  - Scholar截图: $OUTPUT_DIR/scholar_*.png"
echo ""
echo "NotebookLM笔记本ID: $NOTEBOOK_ID"
echo "查看笔记本: notebooklm use $NOTEBOOK_ID"
echo ""
