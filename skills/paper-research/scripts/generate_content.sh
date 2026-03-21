#!/bin/bash
# 生成NotebookLM演示文稿和中文音频概览
# 用法: bash generate_content.sh <笔记本ID>

set -e

# 环境设置
CONDA_BASE="${CONDA_BASE:-/home/cwh/miniconda3}"
export https_proxy="${https_proxy:-socks5://127.0.0.1:1080}"
export http_proxy="${http_proxy:-socks5://127.0.0.1:1080}"

source "$CONDA_BASE/bin/activate" base

NOTEBOOK_ID="$1"

if [ -z "$NOTEBOOK_ID" ]; then
    echo "用法: bash generate_content.sh <笔记本ID>"
    exit 1
fi

echo "[生成内容]"

# 设置当前笔记本
notebooklm use "$NOTEBOOK_ID" > /dev/null 2>&1

# 生成演示文稿
echo "  生成演示文稿..."
SLIDE_OUTPUT=$(notebooklm generate slide-deck "论文研究演示文稿" 2>&1)
SLIDE_ID=$(echo "$SLIDE_OUTPUT" | grep -oP 'Started: \K[^ ]+' || echo "")
echo "  演示文稿任务ID: ${SLIDE_ID:-已启动}"

# 生成中文音频概览
echo "  生成中文音频概览..."
AUDIO_OUTPUT=$(notebooklm generate audio "论文深度解析" --language zh_Hans 2>&1)
AUDIO_ID=$(echo "$AUDIO_OUTPUT" | grep -oP 'Task: \K[^ ]+' || echo "")
echo "  音频任务ID: ${AUDIO_ID:-已启动}"

# 等待生成完成
echo ""
echo "  等待内容生成（约5-10分钟）..."
echo "  您可以继续其他操作，稍后检查状态"

# 轮询检查状态
MAX_WAIT=600  # 最大等待10分钟
WAITED=0
INTERVAL=30

while [ $WAITED -lt $MAX_WAIT ]; do
    sleep $INTERVAL
    WAITED=$((WAITED + INTERVAL))

    # 检查生成状态
    STATUS_OUTPUT=$(notebooklm artifact list 2>&1)

    SLIDE_STATUS=$(echo "$STATUS_OUTPUT" | grep -i "slide" | grep -oP '(completed|in_progress|failed)' | head -1 || echo "unknown")
    AUDIO_STATUS=$(echo "$STATUS_OUTPUT" | grep -i "audio" | grep -oP '(completed|in_progress|failed)' | head -1 || echo "unknown")

    echo "  [${WAITED}秒] 演示文稿: $SLIDE_STATUS | 音频: $AUDIO_STATUS"

    if [ "$SLIDE_STATUS" = "completed" ] && [ "$AUDIO_STATUS" = "completed" ]; then
        echo ""
        echo "  ✓ 内容生成完成!"
        break
    fi

    if [ "$SLIDE_STATUS" = "failed" ] || [ "$AUDIO_STATUS" = "failed" ]; then
        echo "  ⚠ 部分内容生成失败，请检查"
        break
    fi
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo ""
    echo "  ⏱ 等待超时，内容仍在生成中"
    echo "  请使用 'notebooklm artifact list' 检查状态"
fi
