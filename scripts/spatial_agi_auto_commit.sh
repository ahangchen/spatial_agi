#!/bin/bash

# Spatial AGI 自动提交脚本
# 每天自动提交思考结果到GitHub

REPO_DIR="/home/cwh/coding/auto_blog/spatial_agi"
LOG_FILE="/tmp/spatial_agi_commit.log"

echo "=== $(date '+%Y-%m-%d %H:%M:%S') 开始自动提交 ===" > "$LOG_FILE"

cd "$REPO_DIR" || {
    echo "❌ 无法进入目录: $REPO_DIR" >> "$LOG_FILE"
    exit 1
}

# 检查是否有更改
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ 没有新的更改需要提交" >> "$LOG_FILE"
    exit 0
fi

# 添加所有更改
echo "📝 添加更改..." >> "$LOG_FILE"
git add . >> "$LOG_FILE" 2>&1

# 创建提交
TODAY=$(date '+%Y-%m-%d')
COMMIT_MSG="chore: 自动提交 - $TODAY 日常思考更新"

echo "💾 创建提交: $COMMIT_MSG" >> "$LOG_FILE"
git commit -m "$COMMIT_MSG" >> "$LOG_FILE" 2>&1

# 推送到远程
echo "🚀 推送到GitHub..." >> "$LOG_FILE"
git push origin main >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ 自动提交成功" >> "$LOG_FILE"
else
    echo "❌ 自动提交失败" >> "$LOG_FILE"
    exit 1
fi

echo "=== 自动提交完成 ===" >> "$LOG_FILE"
