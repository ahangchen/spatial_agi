#!/usr/bin/env python3
"""
Feishu Message Sender
通过飞书 API 发送消息

用法:
    python feishu_sender.py <open_id> <markdown_file>
    python feishu_sender.py ou_xxx papers_relevance_gt_10.md
"""

import json
import sys
import urllib.request
from pathlib import Path
from datetime import datetime

# 飞书应用配置
FEISHU_APP_ID = "cli_a913a2d53fb89bb3"
FEISHU_APP_SECRET = "0pesUVg42LxK8dGSp5nm7eN2Fe47zIV8"


def get_tenant_access_token() -> str:
    """获取飞书 tenant_access_token"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    data = {
        "app_id": FEISHU_APP_ID,
        "app_secret": FEISHU_APP_SECRET
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode(), method='POST')
    req.add_header('Content-Type', 'application/json')

    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        if result.get('code') != 0:
            raise Exception(f"Failed to get token: {result.get('msg')}")
        return result['tenant_access_token']


def parse_markdown_to_cards(md_content: str) -> list:
    """解析 Markdown 内容为飞书卡片元素"""
    elements = []

    lines = md_content.strip().split('\n')

    # 解析标题和元数据
    for i, line in enumerate(lines):
        if line.startswith('# '):
            # 主标题
            title = line[2:].strip()
            elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": f"**📚 {title}**"
                }
            })
        elif line.startswith('**Date:') or line.startswith('**日期'):
            # 元数据行
            elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": line.replace('**', '')
                }
            })
            elements.append({"tag": "hr"})
        elif line.startswith('### '):
            # 论文标题
            title = line[4:].strip()
            elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": f"**{title}**"
                }
            })
        elif line.startswith('**Relevance'):
            # 相关性信息行
            elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": f"🎯 {line.replace('**', '')}"
                }
            })
        elif line.startswith('> '):
            # 摘要
            abstract = line[2:].strip()
            if len(abstract) > 200:
                abstract = abstract[:200] + "..."
            elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": f"> {abstract}"
                }
            })
            elements.append({"tag": "hr"})
        elif line.startswith('---') and len(elements) > 0:
            # 已经处理过的分隔符
            pass

    # 添加查看详情按钮
    elements.append({
        "tag": "action",
        "actions": [
            {
                "tag": "button",
                "text": {"tag": "plain_text", "content": "查看 Scholar Inbox"},
                "url": "https://www.scholar-inbox.com/home",
                "type": "primary"
            }
        ]
    })

    return elements


def build_card_from_json(papers: list, threshold: float) -> dict:
    """从 JSON 数据构建飞书卡片"""
    today = datetime.now().strftime('%Y-%m-%d')

    elements = [
        {
            "tag": "div",
            "text": {
                "tag": "lark_md",
                "content": f"**📚 Scholar Inbox 论文推荐**\n\n**日期:** {today} | **Relevance > {int(threshold)}** | **共 {len(papers)} 篇**\n\n---"
            }
        }
    ]

    for i, paper in enumerate(papers, 1):
        title = paper.get('title', 'Unknown Title')
        relevance = paper.get('relevance', 0)
        pdf_url = paper.get('pdf_url', '')
        html_url = paper.get('html_link', '')
        abstract = paper.get('abstract', '')
        category = paper.get('category', '')

        # 截断摘要
        if len(abstract) > 200:
            abstract = abstract[:200] + "..."

        # 构建链接
        links = []
        if pdf_url:
            links.append(f"[PDF]({pdf_url})")
        if html_url:
            links.append(f"[HTML]({html_url})")
        link_str = " | ".join(links)

        elements.append({
            "tag": "div",
            "text": {
                "tag": "lark_md",
                "content": f"**{i}. {title}**\n🎯 Relevance: **{relevance}**{f' | {category}' if category else ''}\n📎 {link_str}\n> {abstract if abstract else 'No abstract available.'}"
            }
        })

        if i < len(papers):
            elements.append({"tag": "hr"})

    # 添加按钮
    elements.append({
        "tag": "action",
        "actions": [
            {
                "tag": "button",
                "text": {"tag": "plain_text", "content": "查看 Scholar Inbox"},
                "url": "https://www.scholar-inbox.com/home",
                "type": "primary"
            }
        ]
    })

    return {
        "config": {"wide_screen_mode": True},
        "elements": elements
    }


def send_card_message(open_id: str, card: dict) -> str:
    """发送卡片消息到飞书"""
    token = get_tenant_access_token()

    url = "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id"
    data = {
        "receive_id": open_id,
        "msg_type": "interactive",
        "content": json.dumps(card)
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode(), method='POST')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            if result.get('code') != 0:
                raise Exception(f"Send failed: {result.get('msg')}")
            return result.get('data', {}).get('message_id', '')
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        result = json.loads(error_body)
        raise Exception(f"HTTP Error: {result.get('code')} - {result.get('msg')}")


def send_text_message(open_id: str, text: str) -> str:
    """发送文本消息到飞书"""
    token = get_tenant_access_token()

    url = "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id"
    data = {
        "receive_id": open_id,
        "msg_type": "text",
        "content": json.dumps({"text": text})
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode(), method='POST')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            if result.get('code') != 0:
                raise Exception(f"Send failed: {result.get('msg')}")
            return result.get('data', {}).get('message_id', '')
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        result = json.loads(error_body)
        raise Exception(f"HTTP Error: {result.get('code')} - {result.get('msg')}")


def send_papers_to_feishu(open_id: str, papers: list, threshold: float) -> str:
    """发送论文列表到飞书"""
    card = build_card_from_json(papers, threshold)
    return send_card_message(open_id, card)


def main():
    if len(sys.argv) < 3:
        print("Usage: python feishu_sender.py <open_id> <json_file> [threshold]")
        print("Example: python feishu_sender.py ou_xxx papers_relevance_gt_10.json 10")
        sys.exit(1)

    open_id = sys.argv[1]
    json_file = Path(sys.argv[2])
    threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 10

    if not json_file.exists():
        print(f"Error: File not found: {json_file}")
        sys.exit(1)

    # 读取论文数据
    with open(json_file) as f:
        papers = json.load(f)

    print(f"Sending {len(papers)} papers to {open_id}...")

    try:
        message_id = send_papers_to_feishu(open_id, papers, threshold)
        print(f"✅ 发送成功！")
        print(f"消息ID: {message_id}")
    except Exception as e:
        print(f"❌ 发送失败: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
