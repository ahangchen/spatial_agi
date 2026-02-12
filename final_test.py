#!/usr/bin/env python3
"""最终测试：使用notebooklm-py库但绕过浏览器"""

import asyncio
import sys
sys.path.insert(0, '/home/cwh/coding/notebooklm-py/src')

from notebooklm.client import NotebookLMClient
from notebooklm.auth import AuthTokens

async def test_with_existing_auth():
    """使用现有的认证文件测试"""
    try:
        print("🔍 尝试使用现有认证...")
        
        # 直接加载认证令牌
        tokens = await AuthTokens.from_storage()
        print(f"✅ 加载认证令牌")
        print(f"   存储路径: {tokens.storage_path}")
        print(f"   是否有效: {tokens.is_valid()}")
        
        if not tokens.is_valid():
            print("❌ 认证令牌无效，需要重新登录")
            return
        
        # 创建客户端
        print("\n🔍 创建客户端...")
        client = NotebookLMClient(tokens)
        
        async with client:
            print("✅ 客户端创建成功")
            
            print("\n📚 尝试获取笔记本列表...")
            try:
                notebooks = await client.notebooks.list()
                print(f"✅ 成功获取笔记本列表")
                print(f"   笔记本数量: {len(notebooks)}")
                
                if notebooks:
                    print("\n📋 笔记本列表:")
                    for i, nb in enumerate(notebooks):
                        print(f"\n{i+1}. {nb.title}")
                        print(f"   ID: {nb.id}")
                        print(f"   所有者: {'是' if nb.is_owner else '否'}")
                        if nb.created_at:
                            print(f"   创建时间: {nb.created_at}")
                        
                        # 检查是否包含"3D"或"Former"
                        title_lower = nb.title.lower()
                        if "3d" in title_lower or "former" in title_lower:
                            print(f"   🔍 找到3D Former相关笔记本！")
                
                else:
                    print("📭 没有找到笔记本")
                    
            except Exception as e:
                print(f"❌ 获取笔记本列表时出错: {e}")
                import traceback
                traceback.print_exc()
                
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("最终测试：NotebookLM笔记本访问")
    print("=" * 60)
    
    asyncio.run(test_with_existing_auth())