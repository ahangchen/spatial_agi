# HEARTBEAT.md - Heartbeat Checklist

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

## 定时任务健康检查

**优先级: 高**

每天3次，固定时间执行任务健康检查（0点、8点、16点）：
- 检查**过去8小时**所有定时任务（cron）和心跳任务的执行状态
- 识别失败的任务并记录到状态文件
- **不直接重试**，由AI Agent执行完整skill流程
- 给出修复建议并记录

**触发时间**: 00:00、08:00、16:00

**触发方式**：
- 在heartbeat时检查当前小时是否在触发时间窗口（±30分钟）
- 检查该时间点是否已执行过（避免重复）
- 如果满足条件，执行健康检查脚本
- 脚本路径: `~/.openclaw/workspace/scripts/task_health_check.sh`

**执行命令**：
```bash
bash ~/.openclaw/workspace/scripts/task_health_check.sh
```

**检查范围**:
1. **Cron定时任务**（系统自动执行）:
   - spatial-agi-research (每天早上7点)
2. **心跳任务**（heartbeat触发执行）:
   - 长时间任务检查（每次heartbeat）

**失败重试流程**（重要改进）：

健康检查脚本只负责**检测和记录失败**，不直接重试脚本（因为脚本不会启动subagent）。

**AI Agent重试逻辑**（在每次heartbeat时执行）：

```bash
# 1. 读取状态文件
STATE_FILE="/home/cwh/.openclaw/workspace/memory/heartbeat-state.json"
RETRY_REQUIRED=$(jq -r '.health_check.retry_required // false' "$STATE_FILE" 2>/dev/null)
FAILED_TASKS=$(jq -r '.health_check.failed_tasks[]' "$STATE_FILE" 2>/dev/null)

# 2. 如果需要重试
if [ "$RETRY_REQUIRED" = "true" ] && [ -n "$FAILED_TASKS" ]; then
    echo "🔄 检测到失败任务，需要重试: $FAILED_TASKS"
    
    # 3. 执行完整的skill流程（包括启动subagent）
    # 对于spatial-agi-research任务：
    # - 读取SKILL.md了解完整流程
    # - 执行论文搜索和筛选
    # - 启动subagent分析每篇论文
    # - 生成每日思考
    # - Git提交
    
    echo "执行 spatial-agi-research skill 完整流程..."
    # AI Agent会自动执行完整的skill流程
    
    # 4. 重试完成后清除状态
    jq '.health_check.retry_required = false | .health_check.failed_tasks = []' "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
fi
```

**为什么要这样设计**：
1. ❌ **脚本重试** = 只执行准备工作，不会启动subagent
2. ✅ **AI Agent重试** = 执行完整skill流程，包括启动subagent分析论文

**失败原因分析**：
- **网络问题**: arXiv API限流、连接超时
- **资源问题**: 磁盘空间不足、内存不足
- **依赖问题**: Python包缺失、脚本权限问题
- **配置问题**: cron任务未正确配置、路径错误

**修复建议记录**：
- 记录到 `memory/task-health-log.md`
- 包含：失败时间、任务名称、错误信息、修复建议

**状态记录**:
- 记录到 `/home/cwh/.openclaw/workspace/memory/heartbeat-state.json`
- 字段: `health_check.retry_required` - 是否需要重试
- 字段: `health_check.failed_tasks` - 失败任务列表
- 字段: `health_check.last_check_hour` - 上次检查时间点

**提醒方式**：
- 如果发现失败任务，通过qqbot发送提醒
- 包含失败原因分析和修复建议

---

## 注意事项

- 优先处理紧急任务（训练错误、系统问题）
- 知识库查询应主动进行，不要等用户询问
- 长时间任务检查避免重复提醒
- **健康检查在0点、8点、16点执行，避免频繁检查**
