#!/usr/bin/env python3
"""获取NotebookLM笔记本列表"""

import json
import httpx
from pathlib import Path
import time
import sys

def get_notebooks_list():
    # 读取认证文件
    storage_path = Path.home() / ".notebooklm" / "storage_state.json"
    
    if not storage_path.exists():
        print("❌ 认证文件不存在")
        return None
    
    with open(storage_path, 'r') as f:
        storage = json.load(f)
    
    print(f"✅ 读取认证文件")
    
    # 创建cookies字典
    cookies = {}
    for cookie in storage.get('cookies', []):
        if cookie.get('domain') and cookie.get('name'):
            cookies[cookie['name']] = cookie['value']
    
    print(f"Cookies数量: {len(cookies)}")
    
    # API端点
    api_url = "https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept": "*/*",
        "Origin": "https://notebooklm.google.com",
        "Referer": "https://notebooklm.google.com/",
        "X-Requested-With": "XMLHttpRequest",
    }
    
    try:
        transport = httpx.HTTPTransport(proxy="socks5://127.0.0.1:1080")
        
        with httpx.Client(
            cookies=cookies,
            headers=headers,
            timeout=30,
            transport=transport
        ) as client:
            
            print(f"\n🔍 获取笔记本列表...")
            
            # 构建正确的请求参数
            # 根据notebooklm-py的代码，list方法的参数是 [None, 1, None, [2]]
            rpc_method = "wXbhsf"  # LIST_NOTEBOOKS
            rpc_params = [None, 1, None, [2]]
            
            # 构建请求体
            request_body = {
                "f.req": json.dumps([
                    [rpc_method, json.dumps(rpc_params), None, "generic"]
                ])
            }
            
            params = {
                "rpcids": rpc_method,
                "source-path": "/",
                "bl": "boq_labs-tailwind-ui_20250204.00_p0",
                "soc-app": "199",
                "soc-platform": "1",
                "soc-device": "1",
                "_reqid": str(int(time.time() * 1000)),
                "rt": "c"
            }
            
            print(f"RPC方法: {rpc_method}")
            print(f"参数: {rpc_params}")
            
            # 发送请求
            response = client.post(api_url, data=request_body, params=params)
            print(f"状态码: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ 请求失败: {response.status_code}")
                return None
            
            print(f"响应长度: {len(response.text)} 字符")
            
            # 保存响应
            with open("/tmp/notebooks_response.txt", "w") as f:
                f.write(response.text)
            
            # 解析响应
            raw_response = response.text
            
            # 去除安全前缀
            if raw_response.startswith(")]}'\n"):
                raw_response = raw_response[5:]
            
            # 解析分块响应
            lines = raw_response.strip().split('\n')
            
            for line in lines:
                line = line.strip()
                if not line or line.isdigit():
                    continue
                
                try:
                    data = json.loads(line)
                    
                    if isinstance(data, list):
                        for item in data:
                            if isinstance(item, list) and len(item) > 1:
                                if item[0] == "wrb.fr" and item[1] == rpc_method:
                                    print(f"\n✅ 找到笔记本列表响应")
                                    
                                    if len(item) > 5:
                                        result_data = item[5]
                                        
                                        if isinstance(result_data, list) and len(result_data) > 0:
                                            notebooks_data = result_data[0]
                                            
                                            if isinstance(notebooks_data, list):
                                                print(f"📚 找到 {len(notebooks_data)} 个笔记本:")
                                                
                                                for i, nb in enumerate(notebooks_data):
                                                    print(f"\n{i+1}. 笔记本信息:")
                                                    print(f"   原始数据: {nb}")
                                                    
                                                    # 尝试提取标题和ID
                                                    if isinstance(nb, list) and len(nb) > 1:
                                                        # 笔记本ID通常在索引1
                                                        notebook_id = nb[1] if len(nb) > 1 else "未知"
                                                        print(f"   ID: {notebook_id}")
                                                        
                                                        # 标题可能在索引2或3
                                                        title = "未知标题"
                                                        if len(nb) > 2 and isinstance(nb[2], str):
                                                            title = nb[2]
                                                        elif len(nb) > 3 and isinstance(nb[3], str):
                                                            title = nb[3]
                                                        print(f"   标题: {title}")
                                                        
                                                        # 检查是否包含"3D"或"Former"
                                                        title_lower = title.lower()
                                                        if "3d" in title_lower or "former" in title_lower:
                                                            print(f"   🔍 找到3D Former相关笔记本！")
                                                        
                                                        # 创建时间可能在索引4
                                                        if len(nb) > 4:
                                                            created_at = nb[4]
                                                            print(f"   创建时间: {created_at}")
                                                    
                                                    elif isinstance(nb, str):
                                                        print(f"   内容: {nb}")
                                            
                                            return notebooks_data
                                        else:
                                            print(f"⚠️ 结果数据格式意外: {result_data}")
                                    break
                    
                except json.JSONDecodeError:
                    continue
            
            print("❌ 未找到笔记本数据")
            return None
            
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🔍 获取NotebookLM笔记本列表")
    print("=" * 60)
    
    notebooks = get_notebooks_list()
    
    if notebooks:
        print(f"\n✅ 成功获取笔记本信息")
        print(f"笔记本数量: {len(notebooks) if isinstance(notebooks, list) else '未知'}")
    else:
        print(f"\n❌ 未能获取笔记本列表")