# 工具与配置

## OpenClaw升级流程

**时间**: 2026-02-27
**相关任务**: OpenClaw版本升级

### 升级方法

使用gateway工具进行升级：

```javascript
gateway({ action: "update.run", note: "升级说明" })
```

### 升级流程

```
1. 检查当前版本
   └─ openclaw --version

2. 检查最新版本
   └─ npm view openclaw version

3. 执行升级
   └─ gateway({ action: "update.run" })

4. 自动重启
   └─ Gateway自动重启，加载新版本

5. 验证升级
   └─ openclaw --version
```

### 版本历史

| 版本 | 日期 | 主要更新 |
|------|------|----------|
| 2026.2.13 | 2026-02-13 | Discord语音消息、GLM-5支持、消息防丢失 |
| 2026.2.26 | 2026-02-26 | 安全增强、Heartbeat改进、多平台修复 |

### 2026.2.26 主要新功能

1. **消息防丢失机制**
   - 写入前队列 + 崩溃恢复重试
   - 网关重启后消息不会丢失

2. **Discord增强**
   - 语音消息发送（带波形预览）
   - 可配置presence status/activity

3. **GLM-5正式支持**
   - `hf:zai-org/GLM-5` 完整支持

4. **自动回复线程改进**
   - `replyToMode` 自动注入
   - 无需手动写 `[[reply_to_current]]`

### 注意事项

- 升级耗时约7分钟（取决于网络）
- 升级期间服务会重启
- 升级后会自动发送通知到触发会话

---

## OpenClaw Cron任务配置

**时间**: 2026-02-14
**相关任务**: 定时任务管理

### 常用Cron任务

| 任务名 | 周期 | 用途 |
|--------|------|------|
| knowledge-extract | 每8小时 | 提取知识到knowledge目录 |
| knowledge-cleanup | 每周五 | 清理90天以上的过期知识 |
| memory-daily-check | 每天23:00 | 生成memory日报 |

### Cron命令

```bash
# 查看所有cron任务
openclaw cron list

# 查看任务运行历史
openclaw cron runs <jobId>

# 手动触发任务
openclaw cron run <jobId>

# 添加新任务
openclaw cron add --name "任务名" --schedule "cron表达式" --message "执行内容"
```

---

## QQ Bot配置

**时间**: 2026-02-14
**相关任务**: 消息发送配置

### 图片发送格式

```
<qqimg>/绝对路径/图片.png</qqimg>
```

### 支持的图片格式

- png
- jpg / jpeg
- gif
- webp

### 注意事项

- 必须使用**绝对路径**
- 不支持网络URL
- 发送前确保文件存在

---

## Gateway配置管理

**时间**: 2026-02-27
**相关任务**: OpenClaw配置

### 配置操作

```javascript
// 获取当前配置
gateway({ action: "config.get" })

// 获取配置schema
gateway({ action: "config.schema" })

// 安全更新配置（合并）
gateway({ action: "config.patch", raw: { "key": "value" } })

// 完整替换配置（谨慎使用）
gateway({ action: "config.apply", raw: { /* 完整配置 */ } })
```

### 配置文件位置

- 主配置: `~/.openclaw/config.json`
- 工作区: `~/.openclaw/workspace/`

### 重启Gateway

```javascript
gateway({ action: "restart", note: "重启原因" })
```

---

## Git仓库配置管理

**时间**: 2026-03-03
**相关任务**: spatial_agi仓库作者信息修正

### 新仓库初始化配置

**问题**: 新仓库初始化后未配置用户信息，导致提交作者错误

**解决方案**: 新仓库初始化后立即配置

```bash
# 1. 初始化仓库
cd /path/to/project
git init

# 2. 立即配置用户信息（重要！）
git config user.name "ahangchen"
git config user.email "cweihang@foxmail.com"

# 3. 验证配置
git config user.name
git config user.email

# 4. 首次提交前再次验证
git commit --allow-empty -m "Initial commit"
git log --pretty=format:"%an <%ae>" -1

# 5. 如果错误，立即修正
git commit --amend --author="ahangchen <cweihang@foxmail.com>"
```

### 修改历史提交作者信息

**警告**: 会重写所有历史，提交hash都会改变

```bash
# 使用filter-branch重写所有提交
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --env-filter '
OLD_EMAIL="cwh@example.com"
CORRECT_NAME="ahangchen"
CORRECT_EMAIL="cweihang@foxmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

# 强制推送到远程
git push --force origin main
```

### 配置检查清单

- [ ] 新仓库初始化后立即配置用户信息
- [ ] 首次提交前验证作者信息
- [ ] 检查远程仓库是否正确关联
- [ ] 确认推送权限

### 相关仓库配置

| 仓库 | 用户名 | 邮箱 | 远程地址 |
|------|--------|------|----------|
| spatial_agi | ahangchen | cweihang@foxmail.com | git@github.com:ahangchen/spatial_agi.git |
| former3d | ahangchen | cweihang@foxmail.com | (待确认) |

---

## Spatial AGI定时任务配置

**时间**: 2026-03-03
**相关任务**: spatial-agi-research执行时间优化

### 任务配置

| 任务名 | 执行时间 | 用途 | 配置文件 |
|--------|----------|------|----------|
| spatial-agi-research | 每天07:00 | 搜索arXiv论文、分析、生成文档 | ~/.openclaw/cron/jobs.json |

### 执行时间调整历史

**原配置**: `0 3 * * *` (凌晨3点)

**问题**:
- 凌晨3点arXiv API不稳定（返回空结果）
- 出问题时无法及时发现和处理

**新配置**: `0 7 * * *` (早上7点)

**优势**:
- API更稳定
- 接近工作时间，便于监控
- 出问题可快速响应

### 修改方法

```bash
# 1. 编辑cron任务配置
vim ~/.openclaw/cron/jobs.json

# 2. 找到spatial-agi-research任务
# 修改 "cron": "0 3 * * *" → "0 7 * * *"

# 3. 保存并验证
cat ~/.openclaw/cron/jobs.json | grep -A5 "spatial-agi-research"

# 4. 确认下次执行时间
# 应显示: 2026-03-04 07:00:00
```

### 任务执行流程

```
07:00 - 任务触发
    ↓
Step 1: 搜索arXiv（5个主题）
    ↓
Step 2: 筛选论文（24篇 → 5篇）
    ↓
Step 3-5: 深度分析（NotebookLM）
    ↓
Step 6: 更新论文列表
    ↓
Step 7: 生成每日思考
    ↓
Step 8: 自动Git提交
    ↓
完成（约1.5小时）
```

### 监控指标

- 论文搜索成功率
- NotebookLM分析完成率
- Git提交状态
- 执行总时长

---

*最后更新: 2026-03-03 13:10*
