# GLM MCP工具快速参考

## 便捷脚本

### 网络搜索
```bash
./scripts/glm_search.sh "搜索关键词"
```

### 网页读取
```bash
./scripts/glm_read.sh "网页URL"
```

---

## 常用场景

### 1. 技术学习
```bash
# 搜索文档
./scripts/glm_search.sh "Python asyncio 文档"

# 读取完整内容
./scripts/glm_read.sh "https://docs.python.org/zh-cn/3/library/asyncio.html"
```

### 2. 问题解决
```bash
# 搜索错误信息
./scripts/glm_search.sh "ValueError batch size"

# 读取解决方案
./scripts/glm_read.sh "https://stackoverflow.com/..."
```

### 3. 最新资讯
```bash
# 搜索新闻
./scripts/glm_search.sh "AI技术最新发展" cn oneDay

# 读取详细报道
./scripts/glm_read.sh "https://news.example.com/..."
```

---

## 参数说明

### glm_search.sh
| 参数 | 说明 | 默认值 |
|------|--------|---------|
| 搜索关键词 | 必需 | - |
| 区域 | cn/us | cn |
| 时间范围 | oneDay/oneWeek/oneMonth/oneYear/noLimit | noLimit |
| 结果数量 | 数字 | 5 |

### glm_read.sh
| 参数 | 说明 | 默认值 |
|------|--------|---------|
| 网页URL | 必需 | - |
| 超时(秒) | 数字 | 20 |
| 格式 | markdown/text | markdown |
| 禁用缓存 | true/false | false |

---

## MCP配置

### 服务器
- Web Search: `web-search-prime`
- Web Reader: `web-reader`

### 配额
- Lite: 100次搜索+读取
- Pro: 1,000次搜索+读取
- Max: 4,000次搜索+读取

---

## 详细文档

- [GLM MCP工具使用指南](knowledge/glm_mcp_tools.md)
- [知识库索引](knowledge/index.md)
- [SKILL配置总结](knowledge/GLM_MCP_SKILL_CONFIG.md)
