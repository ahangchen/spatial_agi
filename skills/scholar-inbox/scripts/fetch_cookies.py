#!/usr/bin/env python3
"""
从 Chrome 浏览器提取 scholar-inbox.com 的 cookies
需要安装: pip install browser-cookie3 pycryptodomex
"""

import json
import sys
import os

def fetch_cookies(output_path: str = None):
    """从 Chrome 提取 scholar-inbox cookies"""
    try:
        import browser_cookie3
    except ImportError:
        print("请先安装 browser_cookie3:")
        print("  pip install browser-cookie3 pycryptodomex")
        sys.exit(1)

    print("正在从 Chrome 提取 scholar-inbox.com 的 cookies...")

    # 获取 cookies
    cookies = browser_cookie3.chrome(domain_name='scholar-inbox.com')

    # 转换为 Playwright 格式
    cookie_list = []
    for cookie in cookies:
        cookie_list.append({
            'domain': cookie.domain,
            'name': cookie.name,
            'value': cookie.value,
            'path': cookie.path,
            'secure': cookie.secure
        })

    if not cookie_list:
        print("未找到 scholar-inbox.com 的 cookies")
        print("请确保已在 Chrome 浏览器中登录过 scholar-inbox.com")
        sys.exit(1)

    # 保存
    if output_path is None:
        output_path = os.path.dirname(os.path.abspath(__file__)) + '/../scholar_cookies.json'

    with open(output_path, 'w') as f:
        json.dump(cookie_list, f, indent=2)

    print(f"✓ 成功提取 {len(cookie_list)} 个 cookies")
    print(f"✓ 已保存到: {output_path}")

    # 显示 cookie 信息
    for c in cookie_list:
        print(f"  - {c['domain']} | {c['name']}")

    return cookie_list

if __name__ == '__main__':
    output_path = sys.argv[1] if len(sys.argv) > 1 else None
    fetch_cookies(output_path)
