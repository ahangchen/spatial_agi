# 工具与配置

## QQ Bot集成
- 主要通过QQ机器人进行交互
- 支持图片发送: `<qqimg>图片路径</qqimg>`
- 格式要求: 本地绝对路径 (png/jpg/jpeg/gif/webp)

## Feishu集成
- 已配置响应群内所有用户消息
- 配置：groupPolicy: "any", groupAllowFrom: ["*"]

## Cron任务
- 使用cron系统进行训练完成提醒
- 按HEARTBEAT.md规则处理优先级
- 需要配置正确的channel target
- **知识库任务**（已废弃）:
  - ~~knowledge-extract: 每8小时自动提取知识~~
  - ~~knowledge-cleanup: 每周五清理过期信息（90天以上）~~
- **Spatial AGI研究任务** (2026-03-02):
  - spatial-agi-research: 每天凌晨3点执行
  - 自动搜索arXiv论文
  - 生成论文介绍和深度思考
  - 保存到 `/home/cwh/coding/auto_blog/spatial_agi/`

## Git工作流
- 定期commit: 每完成一个小任务
- 提交信息: feat/fix/docs/clear前缀
- 详细文档保存在`doc/`目录

## Skills管理
- Skills目录: `/home/cwh/.openclaw/workspace/skills/`
- 已安装superpowers的14个skills (2026-03-22)
- 总计36个skills可用
