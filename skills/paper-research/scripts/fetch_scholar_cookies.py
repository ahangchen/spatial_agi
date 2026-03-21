#!/usr/bin/env python3
"""
从 Chrome 浏览器提取 scholar-inbox.com 的 cookies
用法: python fetch_scholar_cookies.py [输出路径]
"""

import json
import sys
import os

def fetch_cookies(output_path: str = None):
    """从 Chrome 提取 scholar-inbox cookies"""
    try:
        import browser_cookie3
    except ImportError:
        print("错误: 需要安装 browser_cookie3")
        print("  pip install browser-cookie3 pycryptodomex")
        sys.exit(1)

    print("正在从 Chrome 提取 scholar-inbox.com 的 cookies...")
    print("请确保已在 Chrome 浏览器中登录过 scholar-inbox.com")

    try:
        cookies = browser_cookie3.chrome(domain_name='scholar-inbox.com')
    except Exception as e:
        print(f"错误: 无法读取Chrome cookies: {e}")
        print("提示: 请确保Chrome浏览器已关闭，然后重试")
        sys.exit(1)

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
        print("错误: 未找到 scholar-inbox.com 的 cookies")
        print("请确保已在 Chrome 浏览器中登录过 scholar-inbox.com")
        sys.exit(1)

    # 设置默认输出路径
    if output_path is None:
        output_path = os.path.dirname(os.path.abspath(__file__)) + '/../output/scholar_cookies.json'

    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 保存
    with open(output_path, 'w') as f:
        json.dump(cookie_list, f, indent=2)

    print(f"✓ 成功提取 {len(cookie_list)} 个 cookies")
    print(f"✓ 已保存到: {output_path}")

    for c in cookie_list:
        print(f"  - {c['domain']} | {c['name']}")

    return cookie_list

if __name__ == '__main__':
    output_path = sys.argv[1] if len(sys.argv) > 1 else None
    fetch_cookies(output_path)
