#!/usr/bin/env python3
"""
从论文项目网页提取PDF链接和代码仓库链接

用法: python extract_paper_links.py <论文网页URL> [输出目录]
"""

import sys
import os
import json
import re
import requests
from urllib.parse import urljoin, urlparse

def fetch_page_content(url):
    """获取网页内容"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    # 尝试使用代理
    proxies = None
    if os.environ.get('https_proxy'):
        proxies = {
            'http': os.environ.get('http_proxy'),
            'https': os.environ.get('https_proxy')
        }

    response = requests.get(url, headers=headers, proxies=proxies, timeout=30)
    response.raise_for_status()
    return response.text

def extract_links(page_url, html_content):
    """从页面提取论文相关链接"""
    results = {
        'page_url': page_url,
        'title': '',
        'arxiv_url': '',
        'arxiv_pdf': '',
        'github_url': '',
        'huggingface_url': '',
        'other_links': []
    }

    # 提取arXiv链接
    arxiv_patterns = [
        r'href="(https?://arxiv\.org/abs/\d+\.\d+)"',
        r'href="(https?://arxiv\.org/pdf/\d+\.\d+)"',
        r'arxiv\.org/abs/(\d+\.\d+)',
        r'arxiv\.org/pdf/(\d+\.\d+)'
    ]

    for pattern in arxiv_patterns:
        matches = re.findall(pattern, html_content, re.IGNORECASE)
        for match in matches:
            if match.startswith('http'):
                if '/abs/' in match:
                    results['arxiv_url'] = match
                    results['arxiv_pdf'] = match.replace('/abs/', '/pdf/')
                elif '/pdf/' in match:
                    results['arxiv_pdf'] = match
                    results['arxiv_url'] = match.replace('/pdf/', '/abs/')
            else:
                results['arxiv_url'] = f'https://arxiv.org/abs/{match}'
                results['arxiv_pdf'] = f'https://arxiv.org/pdf/{match}'

    # 提取GitHub链接
    github_pattern = r'href="(https?://github\.com/[^"]+)"'
    github_matches = re.findall(github_pattern, html_content, re.IGNORECASE)
    for match in github_matches:
        # 排除一些常见的非代码仓库链接
        if not any(x in match.lower() for x in ['blog', 'io', 'about']):
            results['github_url'] = match
            break

    # 提取HuggingFace链接
    hf_pattern = r'href="(https?://huggingface\.co/[^"]+)"'
    hf_matches = re.findall(hf_pattern, html_content, re.IGNORECASE)
    for match in hf_matches:
        results['huggingface_url'] = match
        break

    # 提取标题 (从title标签或h1)
    title_match = re.search(r'<title>([^<]+)</title>', html_content, re.IGNORECASE)
    if title_match:
        results['title'] = title_match.group(1).strip()

    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html_content, re.IGNORECASE)
    if h1_match:
        results['title'] = h1_match.group(1).strip()

    # 清理标题
    results['title'] = re.sub(r'\s+', ' ', results['title'])
    results['title'] = results['title'].replace(' | ', ': ').strip()

    return results

def main():
    if len(sys.argv) < 2:
        print("用法: python extract_paper_links.py <论文网页URL> [输出目录]")
        sys.exit(1)

    page_url = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__)) + '/../output'

    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)

    print(f"[提取论文链接]")
    print(f"  页面: {page_url}")

    try:
        html_content = fetch_page_content(page_url)
        links = extract_links(page_url, html_content)

        # 保存结果
        output_file = os.path.join(output_dir, 'paper_links.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(links, f, ensure_ascii=False, indent=2)

        # 打印结果
        print(f"\n  标题: {links['title']}")
        print(f"  arXiv: {links['arxiv_url'] or '未找到'}")
        print(f"  PDF: {links['arxiv_pdf'] or '未找到'}")
        print(f"  GitHub: {links['github_url'] or '未找到'}")
        print(f"  HuggingFace: {links['huggingface_url'] or '未找到'}")

        print(f"\n  已保存到: {output_file}")

        return links

    except Exception as e:
        print(f"  错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
