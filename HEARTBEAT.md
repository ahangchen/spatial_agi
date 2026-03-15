# HEARTBEAT.md - Heartbeat Checklist

## 知识库管理

**优先级: 高**

每8小时执行一次知识提取：
- 从**过去8小时**的会话上下文中提取知识（避免重复分析）
- 重点识别：技术决策、问题解决方案、代码模式、最佳实践、经验教训
- 分类存储到 `knowledge/` 目录
- 更新知识索引

**数据源**:
- 主要来源：用户直接对话的会话历史
- 过滤：忽略cron任务、heartbeat、例行监控
- 范围：仅分析过去8小时的会话

**相关cron任务**: `knowledge-extract`

---

## 知识库查询规则

在执行任何任务时，如果遇到以下情况，应该查询knowledge目录：

1. **技术决策** - 涉及架构选择、技术栈决策
2. **问题解决** - 遇到错误、bug或性能问题
3. **最佳实践** - 需要参考过往经验和教训
4. **代码模式** - 查找已实现的代码模式
5. **工具配置** - 需要重新配置或设置工具

**查询方式**:
```bash
# 查询特定分类
grep -r "关键词" /home/cwh/.openclaw/workspace/knowledge/

# 查看索引
cat /home/cwh/.openclaw/workspace/knowledge/index.md
```

---

## 长时间任务检查

**优先级: 高**

检查qqbot相关会话中是否有已完成但未回复的后台任务：

**检查步骤**：
1. 使用 `sessions_list` 获取过去4小时的活跃会话
2. 筛选出qqbot相关的会话
3. 使用 `sessions_history --include-tools` 获取对话历史（包含工具调用）
4. 识别后台任务：
   - 使用 `exec` 的 background 模式启动的命令
   - 使用 `sessions_spawn` 启动的子任务
   - 有 `process list` 检查进程状态
5. 检查后台任务状态：
   - 使用 `process list` 查看后台进程
   - 如果进程已结束（completed/error），检查是否有对应的回复
6. 如果发现未回复的已完成任务：
   - 使用 `process log` 获取完整输出
   - 总结任务执行结果
   - 通过 `message` 发送提醒

**判断标准**：
- **后台任务**：使用background exec 或 sessions_spawn
- **已完成**：进程状态为 exited，或spawn任务已完成
- **未回复**：对话中没有针对该任务完成的通知

**提醒示例**：
```
🔔 后台任务完成

任务：训练former3d模型
状态：✅ 成功完成
耗时：2小时15分钟
结果：验证损失从0.15降至0.08

详细日志已保存，是否需要查看？
```

**检查频率**: 每次heartbeat时检查
**注意**: 避免重复提醒，已提醒的任务记录到状态文件

---

## 下午任务触发（arXiv限流恢复后）

**优先级: 高**

**执行时间**: 下午1:00-3:00 PM（13:00-15:00）

**检查逻辑**：
```bash
# 当前时间
CURRENT_HOUR=$(date +%H)

# 如果在下午1-3点之间，if [ "$CURRENT_HOUR" -ge 13 ] && [ "$CURRENT_HOUR" -lt 15 ]; then
    # 检查今天是否已完成
    if [ ! -f "/home/cwh/coding/auto_blog/spatial_agi/papers/$(date +%Y-%m-%d)_*.md" ]; then
        # 检查arXiv是否恢复
        python3 ~/.openclaw/workspace/skills/spatial-agi-research/scripts/search_arxiv.py "all:spatial+all:intelligence" 1
        # 如果恢复，执行任务
        # bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh
    fi
fi
```

**状态记录**:
- 记录到 `/home/cwh/.openclaw/workspace/memory/heartbeat-state.json`
- 字段: `afternoon_task_scheduled`
- 字段: `afternoon_task_triggered`

---

## 定时任务健康检查

**优先级: 高**

每8小时执行一次任务健康检查：
- 检查**过去8小时**所有定时任务（cron）和心跳任务的执行状态
- 识别失败的任务并分析原因
- 自动重试失败的任务
- 给出修复建议并记录

**触发方式**：
- 在heartbeat时检查 `last_health_check` 字段
- 如果距离上次检查超过8小时，执行健康检查脚本
- 脚本路径: `~/.openclaw/workspace/scripts/task_health_check.sh`

**执行命令**：
```bash
bash ~/.openclaw/workspace/scripts/task_health_check.sh
```

**检查范围**:
1. **Cron任务**:
   - spatial-agi-research (每天凌晨3点)
   - knowledge-extract (每8小时)
   - knowledge-cleanup (每周五晚12点)

2. **心跳任务**:
   - 知识库管理
   - 长时间任务检查
   - 下午任务触发

**检查步骤**：
1. 读取 `heartbeat-state.json` 检查任务执行状态
2. 检查预期产出是否存在（如论文文件、知识库更新）
3. 检查系统日志中的cron执行记录
4. 对比预期执行时间与实际执行时间

**失败重试逻辑**：
```bash
# 检查spatial-agi-research是否成功
if [ ! -f "/home/cwh/coding/auto_blog/spatial_agi/papers/$(date +%Y-%m-%d)_*.md" ]; then
    # 今天没有生成论文，重试
    echo "检测到spatial-agi-research任务失败，正在重试..."
    bash ~/.openclaw/workspace/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh
fi

# 检查knowledge-extract是否成功（每8小时）
LAST_EXTRACT=$(jq -r '.lastChecks.knowledge_extract' heartbeat-state.json)
CURRENT_TIME=$(date +%s%3N)
if [ $((CURRENT_TIME - LAST_EXTRACT)) -gt 28800000 ]; then
    # 超过8小时未执行，重试
    echo "检测到knowledge-extract任务超时，正在重试..."
    # 执行知识提取逻辑
fi
```

**失败原因分析**：
- **网络问题**: arXiv API限流、连接超时
- **资源问题**: 磁盘空间不足、内存不足
- **依赖问题**: Python包缺失、脚本权限问题
- **配置问题**: cron任务未正确配置、路径错误

**修复建议记录**：
- 记录到 `memory/task-health-log.md`
- 包含：失败时间、任务名称、错误信息、修复建议、重试结果

**状态记录**:
- 记录到 `/home/cwh/.openclaw/workspace/memory/heartbeat-state.json`
- 字段: `last_health_check` - 上次健康检查时间
- 字段: `failed_tasks` - 失败任务列表
- 字段: `retry_results` - 重试结果

**提醒方式**：
- 如果发现失败任务，通过qqbot发送提醒
- 包含失败原因分析和修复建议

---

## 注意事项

- 优先处理紧急任务（训练错误、系统问题）
- 知识库查询应主动进行，不要等用户询问
- 长时间任务检查避免重复提醒
- **下午任务只在13:00-15:00之间检查一次**
- **健康检查每8小时执行一次，避免频繁检查**
