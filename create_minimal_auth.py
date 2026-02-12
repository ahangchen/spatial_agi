#!/usr/bin/env python3
"""创建最小化的认证文件"""

import json
import os
from pathlib import Path

def create_minimal_auth():
    # 认证文件路径
    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    
    # 创建目录
    storage_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 最小化的认证文件结构
    # 注意：这只是一个示例，实际需要有效的cookies
    minimal_storage = {
        "cookies": [
            {
                "name": "SID",
                "value": "dummy_sid_value",  # 需要真实的SID值
                "domain": ".google.com",
                "path": "/",
                "expires": 1805000000,
                "httpOnly": False,
                "secure": False,
                "sameSite": "Lax"
            },
            {
                "name": "OSID",
                "value": "dummy_osid_value",  # 需要真实的OSID值
                "domain": "notebooklm.google.com",
                "path": "/",
                "expires": 1805000000,
                "httpOnly": True,
                "secure": True,
                "sameSite": "Lax"
            }
        ],
        "origins": [
            {
                "origin": "https://notebooklm.google.com",
                "localStorage": [
                    {
                        "name": "bcsp",
                        "value": "system"
                    }
                ]
            }
        ]
    }
    
    # 写入文件
    with open(storage_path, 'w') as f:
        json.dump(minimal_storage, f, indent=2)
    
    print(f"✅ 创建了最小化认证文件: {storage_path}")
    print(f"📏 文件大小: {os.path.getsize(storage_path)} 字节")
    
    # 验证文件
    try:
        with open(storage_path, 'r') as f:
            data = json.load(f)
        print("✅ 文件格式有效")
        print(f"📊 Cookies数量: {len(data.get('cookies', []))}")
        print(f"📊 Origins数量: {len(data.get('origins', []))}")
    except Exception as e:
        print(f"❌ 文件验证失败: {e}")

if __name__ == "__main__":
    print("🔧 创建最小化认证文件")
    print("=" * 60)
    create_minimal_auth()
    print("=" * 60)
    print("⚠️ 注意：这个文件包含虚拟的cookies值，需要替换为真实的cookies才能工作。")
    print("   如果你有真实的cookies，请更新这个文件。")