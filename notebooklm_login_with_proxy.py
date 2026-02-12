#!/usr/bin/env python3
"""改进的notebooklm登录脚本，支持代理和headless模式"""

import os
import sys
import time
from pathlib import Path

# 添加notebooklm路径
sys.path.insert(0, '/home/cwh/coding/notebooklm-py/src')

from playwright.sync_api import sync_playwright
from rich.console import Console

console = Console()

def login_with_proxy():
    """使用代理登录notebooklm"""
    
    # 配置文件路径
    browser_profile = Path.home() / ".notebooklm" / "browser_profile"
    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    
    # 创建目录
    browser_profile.mkdir(parents=True, exist_ok=True, mode=0o700)
    storage_path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    
    console.print("[yellow]启动浏览器（headless模式 + 代理）...[/yellow]")
    console.print(f"[dim]使用代理: socks5://127.0.0.1:1080[/dim]")
    console.print(f"[dim]配置文件: {browser_profile}[/dim]")
    
    try:
        with sync_playwright() as p:
            # 启动浏览器，配置代理
            context = p.chromium.launch_persistent_context(
                user_data_dir=str(browser_profile),
                headless=True,
                proxy={
                    "server": "socks5://127.0.0.1:1080",
                    "bypass": "localhost,127.0.0.1"
                },
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--password-store=basic",
                ],
                ignore_default_args=["--enable-automation"],
            )
            
            page = context.pages[0] if context.pages else context.new_page()
            
            console.print("\n[bold green]访问NotebookLM...[/bold green]")
            page.goto("https://notebooklm.google.com/", timeout=60000)
            
            console.print(f"当前URL: {page.url}")
            console.print(f"页面标题: {page.title()}")
            
            # 检查是否已登录
            if "notebooklm.google.com" in page.url and "signin" not in page.url:
                console.print("[green]✅ 已经登录！[/green]")
            else:
                console.print("[yellow]需要登录...[/yellow]")
                
                # 截图保存
                screenshot_path = "/tmp/notebooklm_login_page.png"
                page.screenshot(path=screenshot_path)
                console.print(f"[dim]登录页面截图: {screenshot_path}[/dim]")
                
                # 在headless模式下，我们需要手动处理登录
                console.print("\n[bold red]注意：[/bold red]")
                console.print("在headless模式下无法完成Google登录交互。")
                console.print("建议使用以下方法：")
                console.print("1. 在本地有图形界面的电脑上完成登录")
                console.print("2. 复制认证文件到服务器")
                console.print("3. 或使用xvfb创建虚拟显示")
            
            # 等待一段时间
            console.print("\n[dim]等待5秒...[/dim]")
            time.sleep(5)
            
            # 保存认证状态
            console.print("[yellow]保存认证状态...[/yellow]")
            storage = context.storage_state(path=str(storage_path))
            
            console.print(f"[green]✅ 认证文件已保存: {storage_path}[/green]")
            console.print(f"[dim]Cookies数量: {len(storage.get('cookies', []))}[/dim]")
            
            context.close()
            console.print("[green]✅ 登录流程完成！[/green]")
            
    except Exception as e:
        console.print(f"[red]❌ 错误: {e}[/red]")
        return False
    
    return True

def check_auth():
    """检查认证状态"""
    console.print("\n[bold]检查认证状态...[/bold]")
    
    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    
    if storage_path.exists():
        console.print(f"[green]✅ 认证文件存在: {storage_path}[/green]")
        
        # 读取文件大小
        size = storage_path.stat().st_size
        console.print(f"[dim]文件大小: {size} 字节[/dim]")
        
        # 检查文件内容
        try:
            import json
            with open(storage_path, 'r') as f:
                data = json.load(f)
            
            cookies = data.get('cookies', [])
            origins = data.get('origins', [])
            
            console.print(f"[dim]Cookies数量: {len(cookies)}[/dim]")
            console.print(f"[dim]Origins数量: {len(origins)}[/dim]")
            
            # 检查是否有Google相关的cookies
            google_cookies = [c for c in cookies if 'google' in c.get('domain', '').lower()]
            console.print(f"[dim]Google相关cookies: {len(google_cookies)}[/dim]")
            
            return True
            
        except Exception as e:
            console.print(f"[yellow]⚠️ 无法解析认证文件: {e}[/yellow]")
            return False
    else:
        console.print(f"[red]❌ 认证文件不存在[/red]")
        return False

if __name__ == "__main__":
    console.print("[bold]=== NotebookLM 代理登录工具 ===[/bold]")
    
    # 检查代理是否可用
    console.print("\n[bold]检查代理状态...[/bold]")
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex(('127.0.0.1', 1080))
        if result == 0:
            console.print("[green]✅ Shadowsocks代理正在运行 (端口1080)[/green]")
        else:
            console.print("[red]❌ Shadowsocks代理未运行[/red]")
        sock.close()
    except Exception as e:
        console.print(f"[red]❌ 检查代理时出错: {e}[/red]")
    
    # 检查现有认证
    has_auth = check_auth()
    
    if not has_auth:
        console.print("\n[bold]开始登录流程...[/bold]")
        success = login_with_proxy()
        
        if success:
            console.print("\n[bold green]✅ 登录流程完成！[/bold green]")
            console.print("\n下一步：")
            console.print("1. 运行 'notebooklm auth check' 验证认证状态")
            console.print("2. 运行 'notebooklm list' 查看笔记")
        else:
            console.print("\n[bold red]❌ 登录失败[/bold red]")
            console.print("\n建议：")
            console.print("1. 在本地电脑完成登录，复制 ~/.notebooklm/storage_state.json 到服务器")
            console.print("2. 或安装xvfb: sudo apt-get install xvfb")
            console.print("3. 然后使用: xvfb-run notebooklm login")
    else:
        console.print("\n[bold green]✅ 已有有效认证！[/bold green]")
        console.print("\n可以直接使用notebooklm命令：")
        console.print("  notebooklm list      # 查看笔记")
        console.print("  notebooklm auth check # 验证认证")