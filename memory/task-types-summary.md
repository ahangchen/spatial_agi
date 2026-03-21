# 任务类型说明

## 定时任务（Cron Jobs）

通过系统cron自动执行的任务，不依赖heartbeat。

### spatial-agi-research
- **执行时间**: 每天早上7:00
- **执行方式**: crontab自动执行
- **任务内容**: 
  - 搜索arXiv最新论文
  - 筛选5篇最有价值的论文
  - 使用research-assistant技能深度分析
  - 生成论文介绍文档（每篇至少500行）
  - 生成每日思考文档（至少200行）
  - Git提交
- **输出位置**: `/home/cwh/coding/auto_blog/spatial_agi/papers/`
- **日志位置**: `/tmp/spatial_agi_cron.log`
- **监控**: 通过heartbeat的健康检查监控执行状态

---

## 心跳任务（Heartbeat Tasks）

通过OpenClaw的heartbeat机制触发的任务。

### 1. 知识库管理
- **触发频率**: 每8小时
- **触发方式**: heartbeat时检查时间戳，超过8小时则执行
- **任务内容**:
  - 从过去8小时的会话中提取知识
  - 识别技术决策、问题解决方案、代码模式等
  - 分类存储到knowledge目录
  - 更新知识索引
- **数据源**: 用户直接对话的会话历史
- **输出位置**: `/home/cwh/.openclaw/workspace/knowledge/`

### 2. 长时间任务检查
- **触发频率**: 每次heartbeat
- **触发方式**: 每次heartbeat时自动检查
- **任务内容**:
  - 检查qqbot会话中的后台任务
  - 识别已完成的background exec或sessions_spawn
  - 检查是否有对应的回复
  - 对未回复的已完成任务发送提醒
- **状态记录**: `heartbeat-state.json`

### 3. 定时任务健康检查
- **触发频率**: 每天3次（0点、8点、16点）
- **触发方式**: heartbeat时检查时间窗口，触发则执行
- **任务内容**:
  - 检查Cron任务是否正常执行
  - 检查预期产出是否存在
  - 识别失败任务
  - 自动重试失败任务
  - 记录修复建议
- **检查范围**: 
  - spatial-agi-research（检查今天是否生成论文）
- **脚本位置**: `~/.openclaw/workspace/scripts/task_health_check.sh`
- **日志位置**: `memory/task-health-log.md`

---

## 关键区别

| 类型 | 定时任务 | 心跳任务 |
|------|---------|---------|
| 执行方式 | 系统cron自动执行 | OpenClaw heartbeat触发 |
| 依赖 | 无依赖 | 依赖heartbeat机制 |
| 主要内容 | 论文分析 | 知识管理、监控 |
| 失败处理 | 由健康检查发现并重试 | 实时监控 |
| 配置位置 | crontab | HEARTBEAT.md |

---

## 配置文件

1. **Crontab配置**: `crontab -l`
2. **心跳任务配置**: `/home/cwh/.openclaw/workspace/HEARTBEAT.md`
3. **状态文件**: `/home/cwh/.openclaw/workspace/memory/heartbeat-state.json`
4. **健康检查脚本**: `/home/cwh/.openclaw/workspace/scripts/task_health_check.sh`

---

*最后更新: 2026-03-16*
