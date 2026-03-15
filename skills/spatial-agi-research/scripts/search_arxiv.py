#!/usr/bin/env python3
"""搜索arxiv论文"""

import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import json
import sys
import time

def search_arxiv(query, max_results=20, timeout=30, max_retries=3):
    """搜索arxiv论文
    
    Args:
        query: 搜索查询字符串
        max_results: 最大返回结果数
        timeout: 请求超时时间（秒）
        max_retries: 最大重试次数
    """
    base_url = "http://export.arxiv.org/api/query?"
    params = {
        'search_query': query,
        'start': 0,
        'max_results': max_results,
        'sortBy': 'submittedDate',
        'sortOrder': 'descending'
    }
    
    url = base_url + urllib.parse.urlencode(params)
    print(f"搜索URL: {url}", file=sys.stderr)
    print(f"超时设置: {timeout}秒, 最大重试: {max_retries}次", file=sys.stderr)
    
    for attempt in range(max_retries):
        try:
            # 设置超时时间
            with urllib.request.urlopen(url, timeout=timeout) as response:
                xml_data = response.read()
            
            # 解析XML
            root = ET.fromstring(xml_data)
            
            # 定义命名空间
            ns = {
                'atom': 'http://www.w3.org/2005/Atom',
                'arxiv': 'http://arxiv.org/schemas/atom'
            }
            
            papers = []
            for entry in root.findall('atom:entry', ns):
                title = entry.find('atom:title', ns).text.strip()
                summary = entry.find('atom:summary', ns).text.strip()
                link = entry.find('atom:link[@rel="alternate"]', ns).get('href')
                pdf_link = entry.find('atom:link[@title="pdf"]', ns)
                pdf_url = pdf_link.get('href') if pdf_link is not None else link + ".pdf"
                
                authors = [author.find('atom:name', ns).text 
                          for author in entry.findall('atom:author', ns)]
                
                published = entry.find('atom:published', ns).text
                
                paper = {
                    'title': title,
                    'summary': summary,
                    'link': link,
                    'pdf_url': pdf_url,
                    'authors': authors,
                    'published': published
                }
                papers.append(paper)
            
            print(f"成功获取 {len(papers)} 篇论文", file=sys.stderr)
            return papers
        
        except urllib.error.URLError as e:
            error_msg = str(e)
            is_rate_limit = '429' in error_msg or 'Too Many Requests' in error_msg
            
            if is_rate_limit:
                # 限流错误：使用更长的等待时间
                wait_time = (attempt + 1) * 20  # 20s, 40s, 60s
                print(f"尝试 {attempt + 1}/{max_retries} 遇到限流 (429)", file=sys.stderr)
            else:
                # 其他错误：使用普通等待时间
                wait_time = (attempt + 1) * 5  # 5s, 10s, 15s
                print(f"尝试 {attempt + 1}/{max_retries} 失败 (URLError): {e}", file=sys.stderr)
            
            if attempt < max_retries - 1:
                print(f"等待 {wait_time} 秒后重试...", file=sys.stderr)
                time.sleep(wait_time)
        except Exception as e:
            print(f"尝试 {attempt + 1}/{max_retries} 失败 (异常): {type(e).__name__}: {e}", file=sys.stderr)
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 5
                print(f"等待 {wait_time} 秒后重试...", file=sys.stderr)
                time.sleep(wait_time)
    
    print(f"所有重试均失败，返回空列表", file=sys.stderr)
    return []

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python search_arxiv.py <查询关键词> [最大结果数]")
        sys.exit(1)
    
    query = sys.argv[1]
    max_results = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    
    papers = search_arxiv(query, max_results)
    
    # 输出JSON格式
    print(json.dumps(papers, indent=2, ensure_ascii=False))
