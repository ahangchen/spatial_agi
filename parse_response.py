#!/usr/bin/env python3
"""解析NotebookLM API响应"""

import json
import re

def strip_anti_xssi(text: str) -> str:
    """Strip anti-XSSI prefix from response."""
    # Remove )]}' prefix if present
    if text.startswith(")]}'\n"):
        return text[5:]
    return text

def parse_chunked_response(response: str):
    """Parse chunked response format."""
    lines = response.strip().split('\n')
    chunks = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # First number is chunk length
        try:
            chunk_length = int(line)
        except ValueError:
            continue
            
        chunks.append(line)
    
    return chunks

def decode_response(raw_response: str, rpc_id: str):
    """解码响应"""
    print(f"原始响应长度: {len(raw_response)} 字符")
    print(f"原始响应前200字符: {raw_response[:200]}")
    
    # 去除安全前缀
    cleaned = strip_anti_xssi(raw_response)
    print(f"\n去除前缀后长度: {len(cleaned)} 字符")
    
    # 解析分块响应
    lines = cleaned.strip().split('\n')
    print(f"\n分块数量: {len(lines)}")
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        print(f"\n--- 块 {i+1} ---")
        print(f"长度: {len(line)} 字符")
        
        # 尝试解析为JSON
        try:
            # 跳过长度指示行
            if line.isdigit():
                print(f"长度指示: {line}")
                continue
                
            data = json.loads(line)
            print(f"JSON解析成功")
            print(f"数据类型: {type(data)}")
            
            if isinstance(data, list):
                print(f"列表长度: {len(data)}")
                
                # 查找RPC响应
                for j, item in enumerate(data):
                    if isinstance(item, list) and len(item) > 1:
                        if item[0] in ["wrb.fr", "er"]:
                            print(f"\n第{j}项是RPC响应:")
                            print(f"  类型: {item[0]}")
                            print(f"  RPC ID: {item[1]}")
                            
                            if item[0] == "wrb.fr":
                                print(f"  状态: 成功")
                                if len(item) > 5:
                                    print(f"  结果数据位置: 索引5")
                                    result_data = item[5]
                                    print(f"  结果数据类型: {type(result_data)}")
                                    
                                    if isinstance(result_data, list):
                                        print(f"  结果列表长度: {len(result_data)}")
                                        print(f"  结果内容: {result_data}")
                                    else:
                                        print(f"  结果内容: {result_data}")
                            else:
                                print(f"  状态: 错误")
                                if len(item) > 2:
                                    print(f"  错误码: {item[2]}")
            else:
                print(f"内容: {data}")
                
        except json.JSONDecodeError as e:
            print(f"JSON解析失败: {e}")
            print(f"内容预览: {line[:100]}...")
        except Exception as e:
            print(f"其他错误: {e}")

# 读取保存的响应
try:
    with open("/tmp/api_test_response.txt", "r") as f:
        content = f.read()
    
    # 提取POST响应部分
    post_match = re.search(r'POST响应:\n(.*)', content, re.DOTALL)
    if post_match:
        post_response = post_match.group(1)
        print("🔍 解析API响应")
        print("=" * 50)
        decode_response(post_response, "wXbhsf")
    else:
        print("❌ 未找到POST响应")
        
except FileNotFoundError:
    print("❌ 响应文件不存在")
    print("请先运行测试脚本")