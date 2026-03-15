#!/bin/bash
# Spatial AGI 每日研究任务 - 健壮版本 v6.0（去重 + 思考重试）

# 不使用 set -e，我们自己处理错误

WORKSPACE="/home/cwh/.openclaw/workspace"
BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"
SKILL_DIR="$WORKSPACE/skills/spatial-agi-research"
SCRIPTS_DIR="$SKILL_DIR/scripts"
DATE=$(date +%Y-%m-%d)
LOG_FILE="/tmp/spatial_agi_research_$DATE.log"
STATE_FILE="/tmp/spatial_agi_state_$DATE.json"
MAX_RETRIES=3

# 日志函数
log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 错误处理函数
error_handler() {
    local step=$1
    local error_msg=$2
    log "❌ 错误 [$step]: $error_msg"
    # 记录到状态文件
    if command -v jq &> /dev/null; then
        jq ".errors += [{\"step\": \"$step\", \"message\": \"$error_msg\", \"time\": \"$(date -Iseconds)\"}]" "$STATE_FILE" > /tmp/tmp_state.json && mv /tmp/tmp_state.json "$STATE_FILE"
    fi
}

# 初始化状态文件
init_state() {
    if [ ! -f "$STATE_FILE" ]; then
        cat > "$STATE_FILE" << EOF
{
  "date": "$DATE",
  "papers_searched": false,
  "papers_filtered": false,
  "papers_selected": [],
  "papers_analyzed": [],
  "papers_failed": [],
  "papers_skipped_duplicates": 0,
  "thinking_generated": false,
  "thinking_retries": 0,
  "list_updated": false,
  "git_committed": false,
  "errors": []
}
EOF
        log "✅ 初始化状态文件: $STATE_FILE"
    else
        log "ℹ️  状态文件已存在，继续之前的工作"
    fi
}

# 更新状态
update_state() {
    local key=$1
    local value=$2
    
    if command -v jq &> /dev/null; then
        local tmp=$(mktemp)
        jq "$key = $value" "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
    else
        log "⚠️  jq未安装，跳过状态更新"
    fi
}

# 1. 搜索论文（带重试）
search_papers() {
    log "=== 步骤1: 搜索arXiv论文 ==="
    
    PAPERS_RAW_FILE="/tmp/spatial_agi_papers_raw_$DATE.json"
    PAPERS_FILE="/tmp/spatial_agi_papers_$DATE.json"
    
    # 检查是否已完成
    if grep -q '"papers_searched": true' "$STATE_FILE" 2>/dev/null; then
        log "✅ 论文搜索已完成，跳过"
        return 0
    fi
    
    cd "$SCRIPTS_DIR" || {
        error_handler "search_papers" "无法进入目录 $SCRIPTS_DIR"
        return 1
    }
    
    # 清空文件
    > "$PAPERS_RAW_FILE"
    
    # 搜索关键词（扩大搜索范围）
    KEYWORDS=(
        "spatial intelligence"
        "vision language model 3D"
        "3D reconstruction gaussian splatting"
        "robot learning embodied"
        "world model video generation"
        "scene understanding neural"
        "spatial reasoning transformer"
        "UAV"
        "drone"
    )
    
    local success_count=0
    local consecutive_failures=0
    
    # 使用临时目录存储每次搜索的结果
    TEMP_DIR=$(mktemp -d)
    local search_index=0
    
    for keyword in "${KEYWORDS[@]}"; do
        local retry=0
        while [ $retry -lt $MAX_RETRIES ]; do
            log "  搜索: $keyword (尝试 $((retry+1))/$MAX_RETRIES)"
            
            local temp_file="$TEMP_DIR/search_${search_index}.json"
            if python3 search_arxiv.py "all:$keyword" 15 > "$temp_file" 2>> "$LOG_FILE"; then
                ((success_count++))
                ((search_index++))
                consecutive_failures=0
                break
            else
                ((retry++))
                ((consecutive_failures++))
                if [ $retry -lt $MAX_RETRIES ]; then
                    # 根据连续失败次数动态调整等待时间
                    if [ $consecutive_failures -ge 3 ]; then
                        # 连续失败3次以上，可能是全局限流，等待更长时间
                        local wait_time=60
                        log "    ⚠️  检测到连续失败，等待${wait_time}秒后重试..."
                    else
                        local wait_time=10
                        log "    ⚠️  失败，等待${wait_time}秒后重试..."
                    fi
                    sleep $wait_time
                else
                    error_handler "search_papers" "关键词 '$keyword' 搜索失败"
                fi
            fi
        done
        
        # 根据最近的成功率动态调整间隔
        if [ $consecutive_failures -ge 2 ]; then
            sleep 10  # 失败次数多，增加间隔
        else
            sleep 5   # 正常间隔
        fi
    done
    
    # 合并所有搜索结果为一个JSON数组
    log "  合并搜索结果..."
    if ls "$TEMP_DIR"/*.json 1> /dev/null 2>&1; then
        jq -s 'add' "$TEMP_DIR"/*.json > "$PAPERS_RAW_FILE" 2>> "$LOG_FILE"
        rm -rf "$TEMP_DIR"
        
        if [ $success_count -ge 4 ]; then
            update_state ".papers_searched" "true"
            log "✅ 论文搜索完成（$success_count/${#KEYWORDS[@]}），结果保存在: $PAPERS_RAW_FILE"
            return 0
        else
            error_handler "search_papers" "搜索成功率过低 ($success_count/${#KEYWORDS[@]})"
            return 1
        fi
    else
        error_handler "search_papers" "没有成功的搜索结果"
        rm -rf "$TEMP_DIR"
        return 1
    fi
}

# 2. 筛选论文（排除已分析的）
filter_papers() {
    log "=== 步骤2: 筛选新论文（排除已分析） ==="
    
    PAPERS_RAW_FILE="/tmp/spatial_agi_papers_raw_$DATE.json"
    PAPERS_FILE="/tmp/spatial_agi_papers_$DATE.json"
    
    # 检查是否已完成
    if grep -q '"papers_filtered": true' "$STATE_FILE" 2>/dev/null; then
        log "✅ 论文筛选已完成，跳过"
        return 0
    fi
    
    if [ ! -f "$PAPERS_RAW_FILE" ]; then
        error_handler "filter_papers" "原始论文文件不存在: $PAPERS_RAW_FILE"
        return 1
    fi
    
    cd "$SCRIPTS_DIR" || {
        error_handler "filter_papers" "无法进入目录 $SCRIPTS_DIR"
        return 1
    }
    
    # 使用Python脚本筛选
    log "  统计已分析论文..."
    ANALYZED_COUNT=$(ls "$BLOG_DIR"/papers/*.md 2>/dev/null | wc -l)
    log "  已有 $ANALYZED_COUNT 篇论文文档"
    
    log "  筛选新论文..."
    if python3 spatial_agi_filter_papers.py "$PAPERS_RAW_FILE" "$BLOG_DIR" 8 15 > "$PAPERS_FILE" 2>&1; then
        # 统计新论文数量
        NEW_COUNT=$(grep -o '"title"' "$PAPERS_FILE" | wc -l)
        
        if [ $NEW_COUNT -ge 5 ]; then
            update_state ".papers_filtered" "true"
            update_state ".papers_skipped_duplicates" $((ANALYZED_COUNT - NEW_COUNT))
            log "✅ 论文筛选完成，找到 $NEW_COUNT 篇新论文"
            return 0
        else
            error_handler "filter_papers" "新论文数量不足: $NEW_COUNT < 5"
            # 即使不足也继续，可能今天确实没有足够的新论文
            update_state ".papers_filtered" "true"
            return 0
        fi
    else
        error_handler "filter_papers" "论文筛选脚本执行失败"
        return 1
    fi
}

# 3. 创建目录
create_directories() {
    log "=== 步骤3: 创建目录结构 ==="
    
    mkdir -p "$BLOG_DIR/papers" || {
        error_handler "create_directories" "无法创建 papers 目录"
        return 1
    }
    
    mkdir -p "$BLOG_DIR/daily_thinking" || {
        error_handler "create_directories" "无法创建 daily_thinking 目录"
        return 1
    }
    
    log "✅ 目录创建完成"
    return 0
}

# 4. 检查并补充每日思考
ensure_daily_thinking() {
    log "=== 步骤4: 检查每日思考 ==="
    
    THINKING_FILE="$BLOG_DIR/daily_thinking/${DATE}.md"
    MAX_THINKING_RETRIES=3
    
    # 检查是否已生成
    if [ -f "$THINKING_FILE" ]; then
        LINES=$(wc -l < "$THINKING_FILE")
        if [ $LINES -ge 200 ]; then
            log "✅ 每日思考已存在（$LINES 行）"
            update_state ".thinking_generated" "true"
            return 0
        else
            log "⚠️  每日思考文件存在但行数不足（$LINES < 200），需要重新生成"
        fi
    fi
    
    # 获取当前重试次数
    CURRENT_RETRIES=$(jq -r '.thinking_retries // 0' "$STATE_FILE" 2>/dev/null || echo "0")
    
    if [ "$CURRENT_RETRIES" -ge "$MAX_THINKING_RETRIES" ]; then
        log "⚠️  每日思考已达到最大重试次数（$MAX_THINKING_RETRIES），跳过"
        return 1
    fi
    
    # 增加重试计数
    update_state ".thinking_retries" $((CURRENT_RETRIES + 1))
    
    log "⚠️  每日思考未生成，这是第 $((CURRENT_RETRIES + 1)) 次尝试"
    
    # 检查是否有今天分析的论文
    TODAY_PAPERS=$(ls "$BLOG_DIR"/papers/${DATE}_*.md 2>/dev/null | wc -l)
    
    if [ $TODAY_PAPERS -eq 0 ]; then
        log "⚠️  今天没有分析论文，无法生成思考"
        return 1
    fi
    
    log "📋 需要生成每日思考（基于 $TODAY_PAPERS 篇论文）"
    log "   请在后续任务中生成思考文档"
    
    return 0
}

# 5. 生成研究任务消息（带容错指令）
generate_task_message() {
    log "=== 步骤5: 生成研究任务消息 ==="
    
    # 获取筛选后的论文数量
    NEW_COUNT=0
    if [ -f "$PAPERS_FILE" ]; then
        NEW_COUNT=$(grep -o '"title"' "$PAPERS_FILE" 2>/dev/null | wc -l)
    fi
    
    # 检查是否需要生成思考
    NEED_THINKING="false"
    if [ ! -f "$BLOG_DIR/daily_thinking/${DATE}.md" ]; then
        NEED_THINKING="true"
    else
        LINES=$(wc -l < "$BLOG_DIR/daily_thinking/${DATE}.md")
        [ $LINES -lt 200 ] && NEED_THINKING="true"
    fi
    
    # 获取昨天日期
    YESTERDAY=$(date -d yesterday +%Y-%m-%d)
    
    MESSAGE="## Spatial AGI 每日研究任务 - $DATE（v6.0 去重 + 思考重试）

⚠️ **重要改进**：
- ✅ 已过滤已分析的论文（避免重复）
- ✅ 找到 $NEW_COUNT 篇新论文
- ✅ 每日思考自动重试机制（最多3次）

### 当前状态：
- 论文搜索: $(grep -q '"papers_searched": true' "$STATE_FILE" 2>/dev/null && echo '✅ 完成' || echo '❌ 未完成')
- 论文筛选: $(grep -q '"papers_filtered": true' "$STATE_FILE" 2>/dev/null && echo '✅ 完成' || echo '❌ 未完成')
- 每日思考: $([ "$NEED_THINKING" = "false" ] && echo '✅ 已生成' || echo '⚠️ 需要生成')
- 跳过重复: $(jq -r '.papers_skipped_duplicates // 0' "$STATE_FILE" 2>/dev/null) 篇

### 任务步骤：

#### 1. 筛选论文（5篇）
- 查看 $PAPERS_FILE
- 从 $NEW_COUNT 篇新论文中筛选5篇最有价值的
- 标准：相关性、创新性、时效性
- **确保不与昨天重复**

#### 2. 论文深度分析（每篇独立Subagent）

\`\`\`bash
# 对每篇筛选出的论文启动Subagent
# 详细指令见 SKILL.md
\`\`\`

#### 3. ⚠️ 必须生成每日思考

**即使只有2-3篇新论文，也必须生成思考文档！**

思考文档要求：
- 保存到: $BLOG_DIR/daily_thinking/${DATE}.md
- 参考昨天: $BLOG_DIR/daily_thinking/${YESTERDAY}.md
- 最少200行
- 包含：每日总结、核心见解、知识演进图、与昨日联系

#### 4. Git提交
- 执行 /tmp/spatial_agi_commit_after_research.sh

### 质量要求：
- ✅ 每篇论文文档至少500行
- ✅ 每日思考至少200行
- ✅ 不重复已分析的论文
- ✅ 与昨日思考建立联系

执行完成后，生成完整的状态报告。"

    log "✅ 研究任务消息已生成"
    echo ""
    echo "$MESSAGE"
    return 0
}

# 6. 准备Git提交脚本
prepare_git_commit() {
    log "=== 步骤6: 准备Git自动提交脚本 ==="
    
    cat > /tmp/spatial_agi_commit_after_research.sh << 'COMMIT_SCRIPT'
#!/bin/bash
# 研究完成后自动提交（健壮版本 v6.0）

BLOG_DIR="/home/cwh/coding/auto_blog/spatial_agi"
DATE=$(date '+%Y-%m-%d')
LOG_FILE="/tmp/spatial_agi_research_$DATE.log"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$BLOG_DIR" || {
    log "❌ 无法进入目录 $BLOG_DIR"
    exit 1
}

# 检查是否有更改
if git diff --quiet && git diff --staged --quiet; then
    log "✅ 没有新的更改需要提交"
    exit 0
fi

# 添加所有更改
log "📝 添加更改到Git..."
git add . || {
    log "⚠️  Git add 失败，但继续尝试提交"
}

# 统计生成的文件
PAPERS_COUNT=$(ls papers/${DATE}_*.md 2>/dev/null | wc -l)
THINKING_EXISTS="false"
[ -f "daily_thinking/${DATE}.md" ] && THINKING_EXISTS="true"

# 创建提交
COMMIT_MSG="feat: Spatial AGI Research - $DATE

- 分析${PAPERS_COUNT}篇论文（arXiv最新，去重）
- 生成论文深度分析文档
- 每日思考: ${THINKING_EXISTS}
- 更新论文列表

Spatial AGI Research Skill v6.0 (去重 + 思考重试)"

log "💾 创建提交..."
if git commit -m "$COMMIT_MSG"; then
    log "✅ 提交创建成功"
else
    log "⚠️  提交创建失败，可能没有更改"
    exit 0
fi

# 推送到远程（带重试）
log "🚀 推送到GitHub..."
RETRY=0
MAX_RETRIES=3

while [ $RETRY -lt $MAX_RETRIES ]; do
    if git push origin main; then
        log "✅ 已自动提交到GitHub: https://github.com/ahangchen/spatial_agi"
        exit 0
    else
        ((RETRY++))
        if [ $RETRY -lt $MAX_RETRIES ]; then
            log "⚠️  推送失败，等待10秒后重试 ($((RETRY+1))/$MAX_RETRIES)..."
            sleep 10
        fi
    fi
done

log "❌ 推送失败，请手动提交"
exit 1
COMMIT_SCRIPT

    chmod +x /tmp/spatial_agi_commit_after_research.sh
    log "✅ Git提交脚本已准备就绪: /tmp/spatial_agi_commit_after_research.sh"
    return 0
}

# 7. 生成最终状态报告
generate_final_report() {
    log "=== 生成最终状态报告 ==="
    
    if [ -f "$STATE_FILE" ]; then
        log "📊 状态摘要:"
        cat "$STATE_FILE" | jq '.' 2>/dev/null | tee -a "$LOG_FILE"
        
        log ""
        log "📈 执行结果:"
        log "  - 论文搜索: $(grep -q '"papers_searched": true' "$STATE_FILE" && echo '✅' || echo '❌')"
        log "  - 论文筛选: $(grep -q '"papers_filtered": true' "$STATE_FILE" && echo '✅' || echo '❌')"
        log "  - 跳过重复: $(jq -r '.papers_skipped_duplicates // 0' "$STATE_FILE") 篇"
        log "  - 每日思考: $(grep -q '"thinking_generated": true' "$STATE_FILE" && echo '✅' || echo '❌')"
    fi
    
    log ""
    log "📄 完整日志: $LOG_FILE"
    log "📊 状态文件: $STATE_FILE"
    log "📝 论文列表: $PAPERS_FILE"
}

# 0. 检查昨天任务完成度（新增 v6.3）
check_yesterday_completion() {
    log "=== 步骤0: 检查昨天任务完成度 ==="
    
    YESTERDAY=$(date -d yesterday +%Y-%m-%d)
    YESTERDAY_STATE="/tmp/spatial_agi_state_$YESTERDAY.json"
    
    # 检查昨天的论文数量
    YESTERDAY_PAPERS=$(ls "$BLOG_DIR"/papers/${YESTERDAY}_*.md 2>/dev/null | wc -l)
    log "  昨天论文: $YESTERDAY_PAPERS/5"
    
    # 检查昨天的思考
    YESTERDAY_THINKING="$BLOG_DIR/daily_thinking/${YESTERDAY}.md"
    YESTERDAY_THINKING_LINES=0
    if [ -f "$YESTERDAY_THINKING" ]; then
        YESTERDAY_THINKING_LINES=$(wc -l < "$YESTERDAY_THINKING")
        log "  昨天思考: $YESTERDAY_THINKING_LINES 行"
    else
        log "  昨天思考: ❌ 未生成"
    fi
    
    # 判断是否需要补充
    NEED_SUPPLEMENT="false"
    SUPPLEMENT_MESSAGE=""
    
    if [ $YESTERDAY_PAPERS -lt 5 ]; then
        NEED_SUPPLEMENT="true"
        SUPPLEMENT_MESSAGE="${SUPPLEMENT_MESSAGE}⚠️  论文不足 $YESTERDAY_PAPERS/5，缺 $((5 - YESTERDAY_PAPERS)) 篇\n"
    fi
    
    if [ ! -f "$YESTERDAY_THINKING" ] || [ $YESTERDAY_THINKING_LINES -lt 200 ]; then
        NEED_SUPPLEMENT="true"
        SUPPLEMENT_MESSAGE="${SUPPLEMENT_MESSAGE}⚠️  思考未生成或不足（$YESTERDAY_THINKING_LINES < 200行）\n"
    fi
    
    if [ "$NEED_SUPPLEMENT" = "true" ]; then
        log ""
        log "🔄 发现昨天任务未完整完成："
        echo "$SUPPLEMENT_MESSAGE" | tee -a "$LOG_FILE"
        log ""
        log "📋 补充任务（优先级: 思考 > 论文）："
        
        # 生成补充任务文件
        cat > /tmp/spatial_agi_supplement_$DATE.txt << EOF
## 补充 $YESTERDAY 任务

### 需要补充的内容：

$( [ ! -f "$YESTERDAY_THINKING" ] || [ $YESTERDAY_THINKING_LINES -lt 200 ] && echo "1. **生成每日思考**（最高优先级）
   - 基于已有的 $YESTERDAY_PAPERS 篇论文
   - 参考前天: $(date -d '2 days ago' +%Y-%m-%d).md
   - 保存到: $YESTERDAY_THINKING
   - 要求: 至少200行
" || echo "✅ 思考已完整" )

$( [ $YESTERDAY_PAPERS -lt 5 ] && echo "2. **补充论文分析**
   - 缺少 $((5 - YESTERDAY_PAPERS)) 篇
   - 使用Subagent独立分析
   - 至少500行/篇
" || echo "✅ 论文已完整" )

### 执行顺序：
1. 先生成思考（最重要）
2. 再补充论文
3. 最后更新papers_list.md

补充完成后再开始今天的任务。
EOF
        
        log "   补充任务已记录到: /tmp/spatial_agi_supplement_$DATE.txt"
        log ""
        update_state ".yesterday_incomplete" "true"
        update_state ".yesterday_papers" $YESTERDAY_PAPERS
        update_state ".yesterday_thinking_lines" $YESTERDAY_THINKING_LINES
    else
        log "✅ 昨天任务已完整完成"
        update_state ".yesterday_incomplete" "false"
    fi
    
    return 0
}

# 主执行流程
main() {
    log "=========================================="
    log "Spatial AGI 每日研究任务 - v6.3"
    log "日期: $DATE"
    log "改进: 去重 + 思考重试 + 完成度检查"
    log "=========================================="
    log ""
    
    # 初始化
    init_state
    
    # 检查昨天完成度（新增）
    check_yesterday_completion
    
    # 执行步骤（每步独立，失败不中断）
    search_papers || log "⚠️  论文搜索遇到问题，但继续执行"
    filter_papers || log "⚠️  论文筛选遇到问题，但继续执行"
    create_directories || log "⚠️  目录创建遇到问题，但继续执行"
    ensure_daily_thinking || log "⚠️  每日思考检查发现问题"
    generate_task_message || log "⚠️  任务消息生成遇到问题"
    prepare_git_commit || log "⚠️  Git准备遇到问题"
    
    log ""
    log "=========================================="
    log "✅ 准备工作完成"
    log "=========================================="
    log ""
    log "⚠️  接下来AI Agent将执行深度分析任务"
    log "   请按照生成的任务消息执行"
    log ""
    log "📝 任务完成后，执行："
    log "   bash /tmp/spatial_agi_commit_after_research.sh"
    log ""
    
    # 生成最终报告
    generate_final_report
}

# 执行主函数
main
