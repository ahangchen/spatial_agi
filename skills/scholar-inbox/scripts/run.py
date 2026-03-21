#!/usr/bin/env python3
"""
Scholar Inbox Paper Fetcher
从 Scholar Inbox 获取个性化论文推荐

用法: python run.py [relevance_threshold] [output_dir] [--feishu <open_id>]
示例:
    python run.py 10 ./output
    python run.py 10 ./output --feishu ou_xxx
"""

import os
import sys
import json
import subprocess
from pathlib import Path

# 获取脚本所在目录的父目录 (skill 根目录)
SCRIPT_DIR = Path(__file__).parent.resolve()
SKILL_DIR = SCRIPT_DIR.parent


def check_python_dependencies():
    """检查并安装 Python 依赖"""
    print("Checking Python dependencies...")

    missing = []
    try:
        import browser_cookie3
        print("  ✓ browser_cookie3 installed")
    except ImportError:
        missing.append('browser-cookie3')
        print("  ✗ browser_cookie3 not found")

    try:
        from Crypto.Cipher import AES
        print("  ✓ pycryptodomex installed")
    except ImportError:
        missing.append('pycryptodomex')
        print("  ✗ pycryptodomex not found")

    if missing:
        print(f"\nInstalling missing Python packages: {', '.join(missing)}")
        result = subprocess.run(
            ['pip3', 'install', '--user', '--break-system-packages'] + missing,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("  ✓ Python dependencies installed")
        else:
            print(f"  ✗ Failed to install: {result.stderr}")
            sys.exit(1)

    return True


def check_node_dependencies():
    """检查并安装 Node.js 依赖"""
    print("\nChecking Node.js dependencies...")

    node_modules = SKILL_DIR / 'node_modules'
    playwright_module = node_modules / 'playwright'

    if playwright_module.exists():
        print("  ✓ playwright installed")
        return True

    print("  Installing playwright...")
    os.chdir(SKILL_DIR)

    # 安装 playwright
    result = subprocess.run(['npm', 'install', 'playwright'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ✗ npm install failed: {result.stderr}")
        sys.exit(1)
    print("  ✓ playwright npm package installed")

    # 安装 chromium
    print("  Installing Chromium browser...")
    result = subprocess.run(['npx', 'playwright', 'install', 'chromium'],
                          capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ✗ playwright install failed: {result.stderr}")
        sys.exit(1)
    print("  ✓ Chromium installed")

    return True


def fetch_cookies(output_dir: Path) -> bool:
    """从 Chrome 提取 cookies"""
    print("\n" + "=" * 50)
    print("Step 1: Extracting Chrome cookies...")
    print("=" * 50)

    import browser_cookie3

    cookie_path = output_dir / 'scholar_cookies.json'

    # 检查是否已有有效的 cookies
    if cookie_path.exists():
        print(f"  Found existing cookies at {cookie_path}")
        # 可以选择重新获取或使用现有的
        print("  Using existing cookies. Delete the file to refresh.")

    try:
        cookies = browser_cookie3.chrome(domain_name='scholar-inbox.com')
    except Exception as e:
        print(f"  ✗ Failed to get cookies: {e}")
        print("  Make sure you have logged in to scholar-inbox.com in Chrome")
        return False

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
        print("  ✗ No scholar-inbox cookies found in Chrome")
        print("  Please log in to https://www.scholar-inbox.com in Chrome first")
        return False

    with open(cookie_path, 'w') as f:
        json.dump(cookie_list, f, indent=2)

    print(f"  ✓ Extracted {len(cookie_list)} cookies")
    print(f"  ✓ Saved to {cookie_path}")
    return True


def fetch_papers(relevance_threshold: float, output_dir: Path) -> bool:
    """使用 Playwright 获取论文"""
    print("\n" + "=" * 50)
    print(f"Step 2: Fetching papers (relevance > {relevance_threshold})...")
    print("=" * 50)

    os.chdir(SKILL_DIR)

    # 运行 Node.js 脚本
    result = subprocess.run(
        ['node', 'scripts/fetch_papers.js', str(output_dir), str(relevance_threshold)],
        capture_output=True,
        text=True
    )

    print(result.stdout)

    if result.returncode != 0:
        print(f"  ✗ Error: {result.stderr}")
        return False

    return True


def send_to_feishu(open_id: str, papers: list, threshold: float) -> bool:
    """发送论文到飞书"""
    print("\n" + "=" * 50)
    print("Step 3: Sending to Feishu...")
    print("=" * 50)

    try:
        # 导入飞书发送模块
        from feishu_sender import send_papers_to_feishu

        message_id = send_papers_to_feishu(open_id, papers, threshold)
        print(f"  ✓ 发送成功！消息ID: {message_id}")
        return True
    except ImportError:
        print("  ✗ feishu_sender module not found")
        return False
    except Exception as e:
        print(f"  ✗ 发送失败: {e}")
        return False


def main():
    # 解析参数
    args = sys.argv[1:]
    feishu_open_id = None

    # 检查是否有 --feishu 参数
    if '--feishu' in args:
        idx = args.index('--feishu')
        if idx + 1 < len(args):
            feishu_open_id = args[idx + 1]
            args = args[:idx] + args[idx + 2:]

    relevance_threshold = float(args[0]) if len(args) > 0 else 10
    output_dir = Path(args[1]) if len(args) > 1 else SKILL_DIR / 'output'

    print("=" * 50)
    print("Scholar Inbox Paper Fetcher")
    print("=" * 50)
    print(f"  Relevance threshold: {relevance_threshold}")
    print(f"  Output directory: {output_dir}")
    if feishu_open_id:
        print(f"  Feishu open_id: {feishu_open_id}")

    # 创建输出目录
    output_dir.mkdir(parents=True, exist_ok=True)

    # Step 0: 检查依赖
    print("\n" + "=" * 50)
    print("Step 0: Checking dependencies...")
    print("=" * 50)

    check_python_dependencies()
    check_node_dependencies()

    # Step 1: 获取 cookies
    if not fetch_cookies(output_dir):
        sys.exit(1)

    # Step 2: 获取论文
    if not fetch_papers(relevance_threshold, output_dir):
        sys.exit(1)

    # 显示结果
    output_file = output_dir / f'papers_relevance_gt_{int(relevance_threshold)}.json'
    if output_file.exists():
        with open(output_file) as f:
            papers = json.load(f)

        print("\n" + "=" * 50)
        print(f"Results: {len(papers)} papers with relevance > {relevance_threshold}")
        print("=" * 50)

        for i, paper in enumerate(papers[:5], 1):
            print(f"\n[{i}] Relevance: {paper.get('relevance', 'N/A')}")
            print(f"    Title: {paper.get('title', 'N/A')[:60]}...")
            print(f"    PDF: {paper.get('pdf_url', 'N/A')}")

        if len(papers) > 5:
            print(f"\n... and {len(papers) - 5} more papers")

        print(f"\n✓ Full results saved to: {output_file}")

        # Step 3: 发送到飞书（如果指定了 open_id）
        if feishu_open_id:
            send_to_feishu(feishu_open_id, papers, relevance_threshold)

    print("\n" + "=" * 50)
    print("Done!")
    print("=" * 50)


if __name__ == '__main__':
    main()
