#!/bin/bash
# 向NotebookLM提问研究问题
# 用法: bash ask_questions.sh <笔记本ID> [输出文件]

set -e

# 环境设置
CONDA_BASE="${CONDA_BASE:-/home/cwh/miniconda3}"
export https_proxy="${https_proxy:-socks5://127.0.0.1:1080}"
export http_proxy="${http_proxy:-socks5://127.0.0.1:1080}"

source "$CONDA_BASE/bin/activate" base

NOTEBOOK_ID="$1"
OUTPUT_FILE="${2:-$(dirname "$0")/../output/answers.md}"

if [ -z "$NOTEBOOK_ID" ]; then
    echo "用法: bash ask_questions.sh <笔记本ID> [输出文件]"
    exit 1
fi

echo "[问答研究问题]"

# 设置当前笔记本
notebooklm use "$NOTEBOOK_ID" > /dev/null 2>&1

# 定义问题
Q1="这篇文章的核心算法流程是怎样的？请详细描述其主要步骤。"
Q2="这篇文章相比其他工作或者它的baseline有什么改进和创新？"
Q3="这个工作的实验在什么环境部署的，部署时运行效率如何？"

# 创建输出目录
mkdir -p "$(dirname "$OUTPUT_FILE")"

# 清空输出文件
echo "# 论文研究问答" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "生成时间: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 问题1
echo ""
echo "  问题1: 核心算法流程"
echo "  正在获取回答..."

A1=$(notebooklm ask "$Q1" 2>&1)

echo "## Q1: 核心算法流程" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**问题**: $Q1" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**回答**:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "$A1" | sed 's/^Answer://' | sed 's/^Conversation:.*//' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "  ✓ 问题1完成"

# 问题2
echo ""
echo "  问题2: 改进和创新"
echo "  正在获取回答..."

A2=$(notebooklm ask "$Q2" 2>&1)

echo "## Q2: 改进和创新" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**问题**: $Q2" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**回答**:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "$A2" | sed 's/^Answer://' | sed 's/^Conversation:.*//' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "  ✓ 问题2完成"

# 问题3
echo ""
echo "  问题3: 实验部署与效率"
echo "  正在获取回答..."

A3=$(notebooklm ask "$Q3" 2>&1)

echo "## Q3: 实验部署与效率" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**问题**: $Q3" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**回答**:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "$A3" | sed 's/^Answer://' | sed 's/^Conversation:.*//' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "  ✓ 问题3完成"

echo ""
echo "  所有问题已回答完成!"
echo "  回答已保存到: $OUTPUT_FILE"
