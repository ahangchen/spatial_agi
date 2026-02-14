# GLM MCP工具使用指南

本页面记录GLM（智谱AI）的MCP（Model Context Protocol）工具配置和使用方法。

---

## 概述

GLM Coding Plan提供两个MCP服务器：

1. **Web Search Prime** - 网络搜索
2. **Web Reader** - 网页内容读取

两者配合使用，可以形成完整的信息获取链：
- 搜索 → 发现相关网页
- 读取 → 获取完整内容

---

## 配置信息

### MCP服务器列表

- **web-search-prime** - `https://api.z.ai/api/mcp/web_search_prime/mcp`
- **web-reader** - `https://api.z.ai/api/mcp/web_reader/mcp`

### 认证方式
- Bearer Token
- API Key: `9ba36d7227c24614ba3132fa122b389b.qcvoB6kL0dqIcM88`

### 配置文件
- 位置: `/home/cwh/.openclaw/workspace/config/mcporter.json`
- 状态: ✅ 已配置，2个服务器均健康

---

## Web Search Prime

### 功能
- 综合网络搜索
- 实时信息检索
- 返回标题、URL、摘要、网站图标等

### 调用方式

#### 方法1: 直接使用mcporter
```bash
mcporter call web-search-prime.webSearchPrime \
    search_query="搜索关键词" \
    location="cn" \
    search_recency_filter="oneWeek"
```

#### 方法2: 使用便捷脚本
```bash
./scripts/glm_search.sh "搜索关键词" [区域] [时间范围] [结果数量]
```

**参数说明**:
- `搜索关键词`: 必需，建议不超过70字符
- `区域`: cn (默认) 或 us
- `时间范围`:
  - `oneDay` - 一天内
  - `oneWeek` - 一周内
  - `oneMonth` - 一个月内
  - `oneYear` - 一年内
  - `noLimit` - 无限制（默认）
- `结果数量`: 默认5

**示例**:
```bash
# 中文搜索
./scripts/glm_search.sh "人工智能最新发展"

# 英文搜索，限制一周内
./scripts/glm_search.sh "Python asyncio tutorial" us oneWeek

# 搜索并返回10条结果
./scripts/glm_search.sh "SDF训练最佳实践" cn noLimit 10
```

### 返回格式
```json
[
  {
    "refer": "ref_1",
    "title": "网页标题",
    "link": "https://example.com",
    "media": "媒体名称",
    "content": "页面摘要",
    "icon": "网站图标URL",
    "publish_date": "发布日期"
  }
]
```

---

## Web Reader

### 功能
- 获取网页完整内容
- 结构化数据提取（标题、正文、元数据）
- 支持Markdown和Text格式
- 支持链接列表提取

### 调用方式

#### 方法1: 直接使用mcporter
```bash
mcporter call web-reader.webReader \
    url="https://example.com" \
    timeout=20 \
    return_format="markdown" \
    no_cache=false
```

#### 方法2: 使用便捷脚本
```bash
./scripts/glm_read.sh "网页URL" [超时] [格式] [禁用缓存]
```

**参数说明**:
- `网页URL`: 必需，要读取的网页地址
- `超时`: 默认20秒
- `格式`: markdown (默认) 或 text
- `禁用缓存`: true 或 false (默认)

**示例**:
```bash
# 读取网页（默认参数）
./scripts/glm_read.sh "https://docs.python.org/zh-cn/3/library/asyncio.html"

# 读取网页，设置10秒超时，使用文本格式
./scripts/glm_read.sh "https://example.com" 10 text

# 禁用缓存读取
./scripts/glm_read.sh "https://dynamic-site.com" 20 markdown true
```

### 返回格式
```json
{
  "title": "网页标题",
  "description": "页面描述",
  "url": "原始URL",
  "content": "页面完整内容（Markdown格式）",
  "metadata": {
    "keywords": "关键词",
    "viewport": "...",
    "description": "..."
  }
}
```

---

## 完整工作流示例

### 场景1: 技术文档学习

```bash
# 1. 搜索相关文档
./scripts/glm_search.sh "Python asyncio 文档"

# 2. 选择一个结果，读取完整内容
./scripts/glm_read.sh "https://docs.python.org/zh-cn/3/library/asyncio.html"
```

### 场景2: 问题解决

```bash
# 1. 搜索错误信息
./scripts/glm_search.sh "ValueError Expected more than 1 value per channel"

# 2. 读取解决方案页面
./scripts/glm_read.sh "https://github.com/xxx/issues/123"
```

### 场景3: 知识库构建

```bash
# 1. 搜索技术主题
./scripts/glm_search.sh "SDF训练最佳实践" cn oneMonth

# 2. 批量读取相关文章
./scripts/glm_read.sh "https://article1.com"
./scripts/glm_read.sh "https://article2.com"
./scripts/glm_read.sh "https://article3.com"
```

---

## 配额管理

### 共享配额

Web Search和Web Reader共享同一个配额池：

| 套餐 | 总计 | 视觉理解 |
|--------|--------|-----------|
| Lite | 100次搜索+读取 | 5小时 |
| Pro | 1,000次搜索+读取 | 5小时 |
| Max | 4,000次搜索+读取 | 5小时 |

### 注意事项

- 配额按周期重置
- 超出后需等待下一个周期
- Web Search和Web Reader共享配额
- 建议合理分配使用次数

---

## 脚本文件

### glm_search.sh
- 位置: `/home/cwh/.openclaw/workspace/scripts/glm_search.sh`
- 功能: GLM Web Search便捷脚本
- 权限: 可执行 (chmod +x)

### glm_read.sh
- 位置: `/home/cwh/.openclaw/workspace/scripts/glm_read.sh`
- 功能: GLM Web Reader便捷脚本
- 权限: 可执行 (chmod +x)

---

## 故障排除

### 搜索无结果
1. 尝试不同的关键词
2. 检查关键词是否过于具体
3. 确认网络连接正常
4. 检查配额是否充足

### 读取失败
1. 确认目标URL可访问
2. 检查是否有反爬虫机制
3. 尝试不同的URL
4. 增加超时时间

### 连接超时
1. 检查网络连接
2. 确认防火墙设置
3. 验证服务器URL正确
4. 增加timeout参数

---

## 相关资源

- [GLM Web Search MCP文档](https://docs.z.ai/devpack/mcp/search-mcp-server)
- [GLM Web Reader MCP文档](https://docs.z.ai/devpack/mcp/reader-mcp-server)
- [Z.AI Console](https://z.ai/manage-apikey/apikey-list) - API Key管理
- [GLM Coding Plan概述](https://docs.z.ai/devpack/overview)

---

*最后更新: 2026-02-14*
