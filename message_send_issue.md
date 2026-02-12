# Message发送技术问题记录

## 问题描述
在cron触发的项目进度检查任务中，无法通过message工具发送提醒到qqbot。

## 错误信息
```
{
  "status": "error",
  "tool": "message",
  "error": "Action send requires a target."
}
```

## 尝试的解决方案

### 尝试1：指定channel和to参数
```javascript
message({
  action: "send",
  channel: "qqbot",
  to: "qqbot:c2c:C95F43638870FC087DDB8AC7664CA602",
  message: "..."
})
```
结果：失败，错误"to required"

### 尝试2：指定channel和target参数
```javascript
message({
  action: "send",
  channel: "qqbot",
  target: "C95F43638870FC087DDB8AC7664CA602",
  message: "..."
})
```
结果：失败，错误"to required"

### 尝试3：不指定target
```javascript
message({
  action: "send",
  message: "..."
})
```
结果：失败，错误"Action send requires a target."

## 分析
根据会话列表信息，主会话的deliveryContext显示：
```json
{
  "channel": "qqbot",
  "to": "qqbot:c2c:C95F43638870FC087DDB8AC7664CA602",
  "accountId": "default"
}
```

但是message工具似乎不接受这种格式的to参数。

## 可能的解决方案

### 方案1：检查qqbot插件配置
需要查看qqbot插件的配置，了解正确的目标地址格式。

### 方案2：使用sessions_send
尝试发送到主会话，但之前尝试超时。

### 方案3：更新cron作业配置
修改项目进度检查的cron作业，使用不同的payload类型或配置。

## 临时解决方案
暂时记录检查结果到memory文件，等待手动查看。

## 建议
1. 检查qqbot插件的文档，了解正确的目标地址格式
2. 测试不同的参数组合
3. 考虑使用其他提醒方式（如邮件、其他消息平台）