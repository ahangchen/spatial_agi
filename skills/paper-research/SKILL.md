---
name: paper-research
description: 一键式论文研究工作流。输入论文网页链接，自动提取PDF和代码链接，创建NotebookLM笔记本，生成演示文稿和中文音频，回答研究问题，并在Scholar Inbox上点赞。
---

# Paper Research Skill

一键式论文研究工作流，自动化完成以下任务：
1. 从论文网页提取PDF链接和代码仓库链接
2. 创建NotebookLM笔记本并添加来源
3. 生成演示文稿和中文音频概览
4. 回答三个核心研究问题
5. 在Scholar Inbox上搜索并点赞论文

## 前置要求

### 环境配置
```bash
# 设置代理（中国大陆用户必须）
export https_proxy=socks5://127.0.0.1:1080
export http_proxy=socks5://127.0.0.1:1080

# 设置环境变量
export SKILLS_ROOT="${LOBSTERAI_SKILLS_ROOT:-/home/cwh/ubuntu18/home/ubuntu/coding/LobsterAI/SKILLs}"
export CONDA_BASE="/home/cwh/miniconda3"
```

### 依赖工具
- **notebooklm-py**: 已安装在 conda base 环境中
- **Playwright**: 用于浏览器自动化
- **browser-cookie3**: 用于读取Chrome cookies

### 初始设置
```bash
# 首次使用需要登录NotebookLM
source $CONDA_BASE/bin/activate base
notebooklm login

# 首次使用需要获取Scholar Inbox cookies
pip install browser-cookie3 pycryptodomex
python $SKILLS_ROOT/paper-research/scripts/fetch_scholar_cookies.py
```

## 快速使用

### 完整工作流（推荐）
```bash
# 执行完整论文研究工作流
bash "$SKILLS_ROOT/paper-research/scripts/research_workflow.sh" "<论文网页URL>"

# 示例
bash "$SKILLS_ROOT/paper-research/scripts/research_workflow.sh" "https://xinjiu612.github.io/NavDreamer/"
```

### 单独执行各步骤

```bash
# 1. 提取论文链接
python "$SKILLS_ROOT/paper-research/scripts/extract_paper_links.py" "<论文网页URL>"

# 2. 创建NotebookLM笔记本并添加来源
bash "$SKILLS_ROOT/paper-research/scripts/create_notebook.sh" "<标题>" "<网页URL>" "<arXiv URL>"

# 3. 生成演示文稿和音频
bash "$SKILLS_ROOT/paper-research/scripts/generate_content.sh" "<笔记本ID>"

# 4. 问答研究问题
bash "$SKILLS_ROOT/paper-research/scripts/ask_questions.sh" "<笔记本ID>"

# 5. Scholar Inbox点赞
node "$SKILLS_ROOT/paper-research/scripts/scholar_inbox_like.js" "<论文名称>" "$SKILLS_ROOT/paper-research/output"
```

## 输出内容

### NotebookLM笔记本
- 演示文稿 (Slide Deck)
- 中文音频概览
- 三个研究问题的详细回答

### 研究问题
1. **核心算法流程**: 这篇文章的核心算法流程是怎样的？
2. **创新点**: 这篇文章相比其他工作或baseline有什么改进和创新？
3. **实验部署**: 实验在什么环境部署？运行效率如何？

### Scholar Inbox
- 论文搜索结果
- 点赞成功确认

## 目录结构

```
paper-research/
├── SKILL.md                          # 本文件
├── scripts/
│   ├── research_workflow.sh          # 主工作流脚本
│   ├── extract_paper_links.py        # 提取论文链接
│   ├── create_notebook.sh            # 创建NotebookLM笔记本
│   ├── generate_content.sh           # 生成演示文稿和音频
│   ├── ask_questions.sh              # 问答研究问题
│   ├── scholar_inbox_like.js         # Scholar Inbox搜索点赞
│   └── fetch_scholar_cookies.py      # 获取Scholar Inbox cookies
└── output/                           # 输出目录
    ├── paper_links.json              # 提取的链接
    ├── notebook_info.json            # 笔记本信息
    ├── answers.md                    # 问题回答
    └── scholar_screenshots/          # Scholar Inbox截图
```

## 工作流详细说明

### Step 1: 提取论文链接
从论文项目页面提取：
- 论文标题
- arXiv PDF链接
- GitHub代码仓库链接
- HuggingFace Demo链接

支持的项目页面格式：
- GitHub Pages (如 `https://xxx.github.io/project-name/`)
- 直接的arXiv链接
- Papers with Code页面

### Step 2: 创建NotebookLM笔记本
- 使用miniconda base环境的notebooklm-py
- 创建以论文标题命名的笔记本
- 添加网页、arXiv页面、PDF作为来源

### Step 3: 生成内容
- 生成演示文稿 (Slide Deck)
- 生成中文音频概览 (使用 `zh_Hans` 语言代码)

### Step 4: 问答研究问题
自动提问并记录回答：
1. 核心算法流程
2. 创新点对比
3. 实验部署与效率

### Step 5: Scholar Inbox互动
- 使用Playwright自动化浏览器
- 注入Chrome cookies登录
- 搜索论文
- 点击点赞按钮

## 故障排除

### NotebookLM连接超时
```bash
# 检查代理
curl -x socks5://127.0.0.1:1080 -I https://notebooklm.google.com

# 重新登录
source $CONDA_BASE/bin/activate base
notebooklm login
```

### Scholar Inbox无法找到论文
- 论文可能未被Scholar Inbox索引
- 确保已在Chrome浏览器中登录Scholar Inbox
- 重新获取cookies: `python scripts/fetch_scholar_cookies.py`

### 音频生成超时
音频生成通常需要5-10分钟，如果超时：
```bash
# 检查生成状态
notebooklm artifact list
```

## 示例输出

```
========================================
Paper Research Workflow Started
========================================

[1/5] Extracting paper links...
  Title: NavDreamer: Video Models as Zero-Shot 3D Navigators
  arXiv: https://arxiv.org/abs/2602.09765
  Code: Not found (Coming Soon)

[2/5] Creating NotebookLM notebook...
  Notebook ID: de368693-0b33-47d1-8026-59dbcd1d5aee
  Sources added: 3

[3/5] Generating content...
  ✓ Slide deck: completed
  ✓ Audio (zh_Hans): completed

[4/5] Asking research questions...
  Q1: Core algorithm flow
  A1: NavDreamer uses generative video models...

  Q2: Innovations
  A2: From static to spatiotemporal representations...

  Q3: Deployment & Efficiency
  A3: Indoor/outdoor environments, 1-2 min inference...

[5/5] Scholar Inbox interaction...
  Search: "NavDreamer"
  Found: Yes
  Like: Clicked ✓

========================================
Workflow Completed Successfully!
========================================
```

## 注意事项

1. **网络环境**: 中国大陆用户必须配置代理
2. **等待时间**: 完整工作流约需15-30分钟
3. **浏览器窗口**: Scholar Inbox操作会打开可见浏览器窗口
4. **Cookies有效期**: Scholar Inbox cookies可能需要定期刷新
