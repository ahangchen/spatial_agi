#!/bin/bash
# 任务健康检查脚本 - 每8小时执行一次
# 检查过去8小时所有定时任务和心跳任务的执行状态

WORKSPACE="/home/cwh/.openclaw/workspace"
STATE_FILE="$WORKSPACE/memory/heartbeat-state.json"
HEALTH_LOG="$WORKSPACE/memory/task-health-log.md"
PAPERS_DIR="/home/cwh/coding/auto_blog/spatial_agi/papers"

# 当前时间戳
CURRENT_TIME=$(date +%s%3N)
CURRENT_DATE=$(date +%Y-%m-%d)
CURRENT_DATETIME=$(date '+%Y-%m-%d %H:%M:%S')

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

# 检查spatial-agi-research任务
check_spatial_agi() {
    echo "检查 spatial-agi-research 任务..."
    
    # 检查今天是否生成了论文
    PAPERS_TODAY=$(ls -1 "$PAPERS_DIR"/${CURRENT_DATE}_*.md 2>/dev/null | wc -l)
    
    if [ "$PAPERS_TODAY" -eq 0 ]; then
        echo "⚠️  今天未生成论文，任务可能失败"
        
        # 记录失败
        log_health "WARNING" "spatial-agi-research" "今天未生成论文文件，预期路径: $PAPERS_DIR/${CURRENT_DATE}_*.md"
        
        # 尝试重试
        echo "正在重试任务..."
        if [ -f "$WORKSPACE/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh" ]; then
            bash "$WORKSPACE/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh" 2>&1 | tee -a "$HEALTH_LOG"
            RETRY_STATUS=$?
            
            if [ $RETRY_STATUS -eq 0 ]; then
                log_health "SUCCESS" "spatial-agi-research" "重试成功"
                echo "✅ 重试成功"
                return 0
            else
                log_health "ERROR" "spatial-agi-research" "重试失败，退出码: $RETRY_STATUS\n\n**可能原因**:\n- arXiv API限流\n- 网络连接问题\n- Python环境问题\n\n**修复建议**:\n1. 检查网络连接\n2. 等待API限流恢复后手动重试\n3. 检查Python依赖是否完整"
                echo "❌ 重试失败"
                return 1
            fi
        else
            log_health "ERROR" "spatial-agi-research" "重试脚本不存在: $WORKSPACE/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh"
            echo "❌ 重试脚本不存在"
            return 1
        fi
    else
        echo "✅ 今天已生成 $PAPERS_TODAY 篇论文"
        log_health "INFO" "spatial-agi-research" "任务正常，今天已生成 $PAPERS_TODAY 篇论文"
        return 0
    fi
}

# 检查knowledge-extract任务
check_knowledge_extract() {
    echo "检查 knowledge-extract 任务..."
    
    # 读取上次知识提取时间
    LAST_EXTRACT=$(jq -r '.lastChecks.knowledge_extract // 0' "$STATE_FILE")
    
    # 计算时间差（毫秒）
    TIME_DIFF=$((CURRENT_TIME - LAST_EXTRACT))
    EIGHT_HOURS_MS=$((8 * 60 * 60 * 1000))
    
    if [ "$TIME_DIFF" -gt "$EIGHT_HOURS_MS" ]; then
        echo "⚠️  知识提取任务超过8小时未执行"
        HOURS_AGO=$((TIME_DIFF / 3600000))
        log_health "WARNING" "knowledge-extract" "知识提取任务已 $HOURS_AGO 小时未执行\n\n**可能原因**:\n- heartbeat未正常触发\n- cron任务配置错误\n\n**修复建议**:\n1. 检查crontab配置\n2. 检查OpenClaw服务状态\n3. 手动触发知识提取"
        return 1
    else
        HOURS_AGO=$((TIME_DIFF / 3600000))
        echo "✅ 知识提取任务 $HOURS_AGO 小时前执行"
        return 0
    fi
}

# 检查cron任务配置
check_cron_config() {
    echo "检查 cron 任务配置..."
    
    CRON_TASKS=$(crontab -l 2>/dev/null | grep -v "^#" | grep -v "^$")
    
    # 检查spatial-agi-research
    if echo "$CRON_TASKS" | grep -q "spatial"; then
        echo "✅ spatial-agi-research cron任务已配置"
    else
        echo "⚠️  spatial-agi-research cron任务未配置"
        log_health "WARNING" "cron-config" "spatial-agi-research 任务未在crontab中配置"
    fi
    
    # 检查knowledge-extract
    if echo "$CRON_TASKS" | grep -q "knowledge"; then
        echo "✅ knowledge-extract cron任务已配置"
    else
        echo "⚠️  knowledge-extract cron任务未配置"
        log_health "WARNING" "cron-config" "knowledge-extract 任务未在crontab中配置"
    fi
}

# 更新状态文件
update_state() {
    # 读取现有状态
    TEMP_FILE=$(mktemp)
    jq --arg time "$CURRENT_TIME" \
       --arg datetime "$CURRENT_DATETIME" \
       '.lastChecks.last_health_check = ($time | tonumber) |
        .lastChecks.last_health_check_datetime = $datetime' \
       "$STATE_FILE" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$STATE_FILE"
}

# 主函数
main() {
    echo "==================================="
    echo "任务健康检查 - $CURRENT_DATETIME"
    echo "==================================="
    echo ""
    
    FAILED_TASKS=()
    
    # 执行各项检查
    check_spatial_agi || FAILED_TASKS+=("spatial-agi-research")
    echo ""
    
    check_knowledge_extract || FAILED_TASKS+=("knowledge-extract")
    echo ""
    
    check_cron_config
    echo ""
    
    # 更新状态文件
    update_state
    
    # 汇总结果
    echo "==================================="
    if [ ${#FAILED_TASKS[@]} -eq 0 ]; then
        echo "✅ 所有任务健康"
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
