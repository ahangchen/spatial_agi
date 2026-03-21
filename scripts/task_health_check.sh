#!/bin/bash
# 任务健康检查脚本 - 每天3次（0点、8点、16点）
# 只检查Cron定时任务：spatial-agi-research

WORKSPACE="/home/cwh/.openclaw/workspace"
STATE_FILE="$WORKSPACE/memory/heartbeat-state.json"
HEALTH_LOG="$WORKSPACE/memory/task-health-log.md"
PAPERS_DIR="/home/cwh/coding/auto_blog/spatial_agi/papers"

# 当前时间戳
CURRENT_TIME=$(date +%s%3N)
CURRENT_DATE=$(date +%Y-%m-%d)
CURRENT_DATETIME=$(date '+%Y-%m-%d %H:%M:%S')
CURRENT_HOUR=$(date +%H)

# 创建日志目录
mkdir -p "$WORKSPACE/memory"

# 初始化状态文件（如果不存在）
if [ ! -f "$STATE_FILE" ]; then
    echo '{}' > "$STATE_FILE"
fi

# 记录日志函数
log_health() {
    local level=$1
    local task=$2
    local message=$3
    echo "### $CURRENT_DATETIME - [$level] $task" >> "$HEALTH_LOG"
    echo "$message" >> "$HEALTH_LOG"
    echo "" >> "$HEALTH_LOG"
}

# 检查spatial-agi-research任务（Cron定时任务）
check_spatial_agi() {
    echo "检查 spatial-agi-research 定时任务..."
    
    YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
    
    # 根据当前时间决定检查哪一天的论文
    if [ "$CURRENT_HOUR" -lt 7 ]; then
        # 0点-7点：检查昨天的论文（因为今天的cron还没执行）
        CHECK_DATE="$YESTERDAY"
        echo "当前时间 $CURRENT_HOUR 点，检查昨天的论文（$CHECK_DATE）"
    else
        # 7点之后：检查今天的论文
        CHECK_DATE="$CURRENT_DATE"
        echo "当前时间 $CURRENT_HOUR 点，检查今天的论文（$CHECK_DATE）"
    fi
    
    # 检查指定日期是否生成了论文
    PAPERS_COUNT=$(ls -1 "$PAPERS_DIR"/${CHECK_DATE}_*.md 2>/dev/null | wc -l)
    
    if [ "$PAPERS_COUNT" -eq 0 ]; then
        echo "⚠️  $CHECK_DATE 未生成论文，记录失败状态"
        
        # 记录失败到状态文件（不直接重试，由AI Agent执行skill）
        jq --arg task "spatial-agi-research" \
           --arg date "$CHECK_DATE" \
           --arg papers "$PAPERS_COUNT" \
           '.health_check.failed_tasks += ["spatial-agi-research"] |
            .health_check.retry_required = true |
            .health_check.failure_date = $date' \
           "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
        
        log_health "WARNING" "spatial-agi-research" "$CHECK_DATE 未生成论文文件\n\n预期路径: $PAPERS_DIR/${CHECK_DATE}_*.md\n\n等待AI Agent重试"
        
        echo "❌ 已记录失败，等待AI Agent重试"
        return 1
    else
        echo "✅ $CHECK_DATE 已生成 $PAPERS_COUNT 篇论文"
        
        # 记录成功状态
        jq --arg task "spatial-agi-research" \
           --arg date "$CHECK_DATE" \
           --arg papers "$PAPERS_COUNT" \
           '.health_check.failed_tasks = [] |
            .health_check.retry_required = false |
            .health_check.success_date = $date' \
           "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
        
        log_health "INFO" "spatial-agi-research" "$CHECK_DATE 定时任务正常，已生成 $PAPERS_COUNT 篇论文"
        return 0
    fi
}

# 检查cron任务配置
check_cron_config() {
    echo "检查 Cron 定时任务配置..."
    
    CRON_TASKS=$(crontab -l 2>/dev/null | grep -v "^#" | grep -v "^$")
    
    # 检查spatial-agi-research
    if echo "$CRON_TASKS" | grep -q "spatial"; then
        echo "✅ spatial-agi-research cron任务已配置"
    else
        echo "⚠️  spatial-agi-research cron任务未配置"
        log_health "WARNING" "cron-config" "spatial-agi-research 定时任务未在crontab中配置"
    fi
}

# 更新状态文件
update_state() {
    # 读取现有状态
    TEMP_FILE=$(mktemp)
    jq --arg time "$CURRENT_TIME" \
       --arg datetime "$CURRENT_DATETIME" \
       --arg hour "$CURRENT_HOUR" \
       '.lastChecks.last_health_check = ($time | tonumber) |
        .lastChecks.last_health_check_datetime = $datetime |
        .health_check.last_check_hour = ($hour | tonumber)' \
       "$STATE_FILE" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$STATE_FILE"
}

# 主函数
main() {
    echo "==================================="
    echo "定时任务健康检查 - $CURRENT_DATETIME"
    echo "==================================="
    echo ""
    
    FAILED_TASKS=()
    
    # 执行各项检查
    check_spatial_agi || FAILED_TASKS+=("spatial-agi-research")
    echo ""
    
    check_cron_config
    echo ""
    
    # 更新状态文件
    update_state
    
    # 汇总结果
    echo "==================================="
    if [ ${#FAILED_TASKS[@]} -eq 0 ]; then
        echo "✅ 所有定时任务健康"
    else
        echo "❌ 发现 ${#FAILED_TASKS[@]} 个失败任务:"
        for task in "${FAILED_TASKS[@]}"; do
            echo "  - $task"
        done
        echo ""
        echo "详细日志: $HEALTH_LOG"
    fi
    echo "==================================="
}

main
