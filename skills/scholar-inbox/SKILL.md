---
name: scholar-inbox
description: Fetch personalized paper recommendations from Scholar Inbox using Chrome cookies. Use when the user wants to get papers with high relevance scores, access their Scholar Inbox recommendations, or work with academic paper data from scholar-inbox.com.
---

# Scholar Inbox

Fetch personalized paper recommendations from Scholar Inbox (https://www.scholar-inbox.com) using existing Chrome browser cookies.

## Quick Start

```bash
cd /home/cwh/ubuntu18/home/ubuntu/coding/LobsterAI/SKILLs/scholar-inbox

# 基本用法：获取论文
python3 scripts/run.py [relevance_threshold] [output_dir]

# 发送结果到飞书
python3 scripts/run.py [relevance_threshold] [output_dir] --feishu <open_id>
```

**Parameters:**
- `relevance_threshold`: Default 10
- `output_dir`: Default `./output`
- `--feishu <open_id>`: Optional, send results to Feishu user

**Examples:**
```bash
# 获取 relevance > 10 的论文
python3 scripts/run.py 10 ./output

# 获取并发送到飞书
python3 scripts/run.py 10 ./output --feishu ou_47c151240ed20bb8e19df6d8d5de0348
```

## Workflow

### Step 0: Check and Install Dependencies

First run auto-installs dependencies:
- Python: `browser-cookie3`, `pycryptodomex`
- Node.js: `playwright`, Chromium

### Step 1: Extract Chrome Cookies

```python
import browser_cookie3
cookies = browser_cookie3.chrome(domain_name='scholar-inbox.com')
```

### Step 2: Inject Cookies & Fetch Papers

```javascript
await context.addCookies(cookies);
await page.goto('https://www.scholar-inbox.com/home');

// Filter by relevance
const papers = json.digest_df.filter(p => p.ranking_score * 100 > threshold);
```

### Step 3: Send to Feishu (Optional)

```bash
python3 scripts/run.py 10 ./output --feishu ou_xxx
```

使用飞书 API 发送卡片消息，包含论文标题、相关性、PDF链接和摘要。

## Output

### Markdown (`papers_relevance_gt_*.md`)

```markdown
# Scholar Inbox Papers

**Date:** 2026-02-21 | **Relevance > 10** | **Total:** 4

---

### 1. StereoAdapter-2: Globally Structure-Consistent Underwater Stereo Depth Estimation
**Relevance:** 84.97 | **Category:** Computer Vision and Graphics | [PDF](https://arxiv.org/pdf/2602.16915) | [HTML](https://arxiv.org/html/2602.16915)

> Stereo depth estimation is fundamental to underwater robotic perception, yet suffers from severe domain shifts...

### 2. Boreas Road Trip: A Multi-Sensor Autonomous Driving Dataset
**Relevance:** 60.36 | **Category:** Robotics and Control | [PDF](https://arxiv.org/pdf/2602.16870) | [HTML](https://arxiv.org/html/2602.16870)

> The Boreas Road Trip (Boreas-RT) dataset extends the multi-season Boreas dataset...
```

### JSON (`papers_relevance_gt_*.json`)

```json
[{
  "title": "Paper Title",
  "authors": "Author Names",
  "abstract": "Paper abstract...",
  "relevance": 84.97,
  "category": "Computer Vision and Graphics",
  "arxiv_id": "2602.16915",
  "pdf_url": "https://arxiv.org/pdf/2602.16915",
  "html_link": "https://arxiv.org/html/2602.16915"
}]
```

## Key Formula

```
relevance = ranking_score × 100
```

## Paper Fields

| Field | Description |
|-------|-------------|
| `title` | Paper title |
| `authors` | Author list |
| `abstract` | Full abstract |
| `relevance` | AI relevance score |
| `category` | Research category |
| `arxiv_id` | arXiv identifier |
| `pdf_url` | PDF download link |
| `html_link` | HTML version link |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No cookies found | Log in to Scholar Inbox in Chrome first |
| MAC check failed | Close Chrome before running |
| Session expired | Re-run to extract fresh cookies |

## Directory Structure

```
scholar-inbox/
├── SKILL.md
├── scripts/
│   ├── run.py            # Main entry (auto-install deps)
│   ├── fetch_cookies.py  # Cookie extractor
│   ├── fetch_papers.js   # Playwright fetcher
│   └── feishu_sender.py  # Feishu message sender
└── output/
    ├── scholar_cookies.json
    ├── papers_relevance_gt_*.md
    └── papers_relevance_gt_*.json
```

## Feishu Configuration

飞书发送功能使用以下配置（在 `feishu_sender.py` 中）：
- `APP_ID`: cli_a913a2d53fb89bb3
- `APP_SECRET`: (configured in script)

需要接收者的 `open_id`（以 `ou_` 开头）。
