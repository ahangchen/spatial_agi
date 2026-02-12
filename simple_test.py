#!/usr/bin/env python3
"""简单的notebooklm测试脚本"""

import asyncio
import sys
sys.path.insert(0, '/home/cwh/coding/notebooklm-py/src')

from notebooklm.client import NotebookLMClient

async def test_list():
    try:
        print("尝试连接到NotebookLM...")
        client = await NotebookLMClient.from_storage()
        async with client:
            print("✅ 连接成功！")
            
            print("获取笔记本列表...")
            notebooks = await client.notebooks.list()
            
            print(f"找到 {len(notebooks)} 个笔记本:")
            
            # 搜索3D Former相关的笔记本
            found_3d_former = False
            for i, nb in enumerate(notebooks):
                print(f"\n{i+1}. {nb.title}")
                print(f"   ID: {nb.id}")
                print(f"   所有者: {'是' if nb.is_owner else '否'}")
                if nb.created_at:
                    print(f"   创建时间: {nb.created_at}")
                
                # 检查是否包含"3D"或"Former"
                title_lower = nb.title.lower()
                if "3d" in title_lower or "former" in title_lower:
                    found_3d_former = True
                    print("   🔍 找到3D Former相关笔记本！")
            
            if not found_3d_former:
                print("\n❌ 未找到标题中包含'3D'或'Former'的笔记本")
                
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_list())