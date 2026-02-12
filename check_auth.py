#!/usr/bin/env python3
"""检查认证文件并尝试访问NotebookLM"""

import json
import os
from pathlib import Path

def check_auth():
    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    
    if not storage_path.exists():
        print("❌ 认证文件不存在")
        return False
    
    print(f"✅ 认证文件存在: {storage_path}")
    print(f"文件大小: {storage_path.stat().st_size} 字节")
    
    try:
        with open(storage_path, 'r') as f:
            data = json.load(f)
        
        cookies = data.get('cookies', [])
        origins = data.get('origins', [])
        
        print(f"\n📊 认证信息:")
        print(f"- Cookies数量: {len(cookies)}")
        print(f"- Origins数量: {len(origins)}")
        
        # 检查关键cookies
        important_cookies = ['SID', 'OSID', '__Secure-OSID']
        found_cookies = []
        
        for cookie in cookies:
            if cookie.get('name') in important_cookies:
                found_cookies.append(cookie['name'])
                domain = cookie.get('domain', 'unknown')
                expires = cookie.get('expires', 0)
                print(f"  ✅ {cookie['name']} (domain: {domain}, expires: {expires})")
        
        # 检查是否有NotebookLM相关的cookies
        notebooklm_cookies = [c for c in cookies if 'notebooklm' in c.get('domain', '').lower()]
        print(f"\n📝 NotebookLM相关cookies: {len(notebooklm_cookies)}")
        
        google_cookies = [c for c in cookies if 'google' in c.get('domain', '').lower()]
        print(f"🔍 Google相关cookies: {len(google_cookies)}")
        
        # 检查origins
        print(f"\n🌐 Origins:")
        for origin in origins:
            origin_url = origin.get('origin', 'unknown')
            print(f"  - {origin_url}")
            if 'notebooklm' in origin_url:
                print(f"    ✅ 包含NotebookLM origin")
        
        # 检查是否包含所有重要cookies
        missing = [c for c in important_cookies if c not in found_cookies]
        if missing:
            print(f"\n⚠️ 缺少重要cookies: {missing}")
            return False
        else:
            print(f"\n✅ 所有重要cookies都存在")
            return True
            
    except Exception as e:
        print(f"❌ 读取认证文件时出错: {e}")
        return False

if __name__ == "__main__":
    print("🔍 检查NotebookLM认证状态")
    print("=" * 50)
    
    success = check_auth()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ 认证状态良好！")
        print("\n建议:")
        print("1. 在图形界面环境中运行 'notebooklm list'")
        print("2. 或使用xvfb: 'xvfb-run notebooklm list'")
        print("3. 或安装xvfb: sudo apt-get install xvfb")
    else:
        print("❌ 认证状态有问题")
        print("\n建议:")
        print("1. 重新运行 'notebooklm login'")
        print("2. 确保在图形界面环境中登录")