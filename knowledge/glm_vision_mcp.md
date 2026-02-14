# GLM Vision MCP使用指南

本页面记录GLM（智谱AI）的视觉理解MCP（Model Context Protocol）工具配置和使用方法。

---

## 概述

GLM Vision MCP Server是基于Model Context Protocol的本地MCP服务器，为GLM Coding Plan用户提供强大的视觉理解能力。

### 主要功能

- 📸 **图片分析** - 智能理解图片内容
- 🎬 **视频分析** - 理解视频场景和内容
- 📝 **OCR文本提取** - 从图片中提取文本
- 📊 **技术图分析** - 解释架构图、流程图、UML等
- 📈 **数据可视化** - 分析图表和仪表板

### 特性

- ✅ 本地运行，通过stdo通信
- ✅ 支持GLM-4.6V视觉理解模型
- ✅ 无需上传图片，直接处理本地文件
- ✅ 多种视觉理解任务
- ✅ 与Claude Code等MCP客户端兼容

---

## 安装与配置

### 环境变量

| 环境变量 | 必需 | 说明 | 值 |
|-----------|--------|------|------|
| `Z_AI_API_KEY` | ✅ | Z.AI API密钥 | `9ba36d7227c24614ba3132fa122b389b.qcvoB6kL0dqIcM88` |
| `Z_AI_MODE` | ✅ | 服务平台选择 | `ZAI` |

### 手动启动

```bash
# 启动Vision MCP Server
Z_AI_API_KEY=your_api_key Z_AI_MODE=ZAI npx -y @z_ai/mcp-server

# 验证启动
# 成功启动后会显示所有注册的工具
```

---

## 可用工具

### 1. analyze_image - 图片分析

**功能**: 分析图片内容，理解场景、对象、文字等

**用法**:
```bash
./scripts/glm_vision.sh analyze_image <图片路径>
```

**示例**:
```bash
# 分析本地图片
./scripts/glm_vision.sh analyze_image /home/cwh/images/photo.png

# 分析远程图片
./scripts/glm_vision.sh analyze_image https://example.com/image.jpg
```

**返回信息**:
- 场景描述
- 识别的对象
- 文字内容
- 颜色分析
- 情感分析

---

### 2. analyze_video - 视频分析

**功能**: 理解视频内容，描述场景和动作

**用法**:
```bash
# 分析本地视频
./scripts/glm_vision.sh analyze_video /path/to/video.mp4

# 分析远程视频
./scripts/glm_vision.sh analyze_video https://example.com/video.mp4 remote="true"
```

**参数**:
- `视频路径`: 必需
- `remote`: 可选，默认false，表示是否为远程URL

**限制**:
- 本地视频：无大小限制
- 远程视频：≤8MB
- 支持格式：MP4/MOV/M4V

**返回信息**:
- 视频场景描述
- 关键动作
- 对象检测
- 时间戳信息

---

### 3. ocr - 文本提取

**功能**: 从图片中提取可读文本

**用法**:
```bash
# 从本地图片提取文本
./scripts/glm_vision.sh ocr /path/to/screenshot.png

# 从远程图片提取文本
./scripts/glm_vision.sh ocr https://example.com/code.png
```

**应用场景**:
- 代码截图分析
- 错误信息识别
- 文档文字提取
- 用户界面文本识别

---

### 4. diagram - 技术图分析

**功能**: 解释和转换技术图表

**支持的图表类型**:
- 架构图
- 流程图
- UML图
- ER图
- 时序图
- 网络拓扑图

**用法**:
```bash
./scripts/glm_vision.sh diagram <图片路径或URL>
```

**示例**:
```bash
# 分析架构图
./scripts/glm_vision.sh diagram /path/to/architecture.png

# 分析流程图
./scripts/glm_vision.sh diagram https://example.com/flowchart.jpg
```

**返回信息**:
- 图表类型识别
- 结构描述
- 元素说明
- 关系解析
- Markdown/代码表示

---

### 5. dashboard - 数据可视化分析

**功能**: 分析图表、仪表板和数据可视化

**用法**:
```bash
./scripts/glm_vision.sh dashboard <图片路径或URL>
```

**示例**:
```bash
# 分析监控仪表板
./scripts/glm_vision.sh dashboard /path/to/dashboard.png

# 分析图表
./scripts/glm_vision.sh dashboard https://example.com/analytics.jpg
```

**返回信息**:
- 图表类型
- 数据指标
- 趋势分析
- 异常检测
- 摘要和结论

---

## 完整工作流示例

### 场景1: 错误日志分析

```bash
# 1. 提取错误截图中的文本
./scripts/glm_vision.sh ocr /path/to/error_screenshot.png

# 2. 分析错误截图内容
./scripts/glm_vision.sh analyze_image /path/to/error_screenshot.png

# 3. 如果是技术图，解释架构
./scripts/glm_vision.sh diagram /path/to/architecture.png
```

### 场景2: 代码审查

```bash
# 1. 分析代码截图
./scripts/glm_vision.sh analyze_image /path/to/code.png

# 2. 提取代码文本
./scripts/glm_vision.sh ocr /path/to/code.png

# 3. 分析架构图
./scripts/glm_vision.sh diagram /path/to/architecture.png
```

### 场景3: 数据分析

```bash
# 1. 分析仪表板截图
./scripts/glm_vision.sh dashboard /path/to/analytics.png

# 2. 生成数据报告
echo "根据分析结果..."
```

---

## 注意事项

### 图片要求

- **格式**: PNG, JPG, JPEG, WEBP, GIF
- **大小**: 建议不超过10MB
- **清晰度**: 建议高分辨率
- **内容**: 避免模糊、过度曝光

### 视频要求

- **格式**: MP4, MOV, M4V
- **大小**: 本地无限制，远程≤8MB
- **时长**: 建议不超过10分钟
- **清晰度**: 建议720p或更高

### 最佳实践

1. **图片准备**
   - 确保图片清晰可读
   - 关键内容不被遮挡
   - 适当的对比度和亮度

2. **上下文提供**
   - 在对话中明确分析需求
   - 提供相关的背景信息
   - 描述预期结果

3. **结果验证**
   - 检查识别的准确性
   - 验证提取的文本完整性
   - 确认理解的逻辑性

---

## 故障排除

### 连接失败

```bash
# 验证MCP Server是否启动
Z_AI_API_KEY=your_api_key Z_AI_MODE=ZAI npx -y @z_ai/mcp-server --version
```

**可能原因**:
- Node.js版本过低（需要v22+）
- 环境变量未设置
- 端口被占用

### 图片分析失败

**可能原因**:
- 图片格式不支持
- 图片损坏
- 文件路径错误

**解决方案**:
1. 检查图片格式和完整性
2. 尝试不同的图片
3. 查看错误日志

---

## 配额管理

### 视觉理解配额

| 套餐 | 视觉理解时间 |
|--------|-------------|
| Lite | 5小时 |
| Pro | 5小时 |
| Max | 5小时 |

**注意**: 视觉理解配额与Web Search/Reader共享

### 配额查询

登录 [Z.AI Console](https://z.ai/manage-apikey/apikey-list) 查看剩余配额

---

## 相关资源

- [Vision MCP Server文档](https://docs.z.ai/devpack/mcp/vision-mcp-server)
- [GLM Coding Plan概述](https://docs.z.ai/devpack/overview)
- [NPM Package](https://www.npmjs.com/package/@z_ai/mcp-server)
- [GLM-4.6V模型介绍](https://docs.z.ai/guides/vlm/glm-4.6v)

---

*最后更新: 2026-02-14*
