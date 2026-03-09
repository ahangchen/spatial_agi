#!/usr/bin/env python3
"""筛选arxiv论文，排除已分析的论文（改进版）"""

import json
import sys
import os
import re
from datetime import datetime

def get_analyzed_papers(blog_dir):
    """获取已分析的论文列表
    
    从papers目录中的所有md文件提取arXiv ID
    """
    analyzed = {}  # paper_id -> filename
    papers_dir = os.path.join(blog_dir, "papers")
    
    if not os.path.exists(papers_dir):
        return analyzed
    
    for filename in os.listdir(papers_dir):
        if not filename.endswith('.md'):
            continue
        
        filepath = os.path.join(papers_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read(3000)  # 读取前3000字符
                
                # 提取arXiv ID（多种格式）
                patterns = [
                    r'arxiv\.org/abs/(\d+\.\d+)',
                    r'arxiv\.org/pdf/(\d+\.\d+)',
                    r'\*\*arXiv\*\*:\s*https?://arxiv\.org/abs/(\d+\.\d+)',
                    r'arXiv:\s*(\d+\.\d+)',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    for match in matches:
                        # 标准化ID（去掉版本号）
                        paper_id = re.sub(r'v\d+$', '', match)
                        analyzed[paper_id] = filename
                        break  # 找到一个就够
        except Exception as e:
            print(f"警告: 无法读取 {filename}: {e}", file=sys.stderr)
    
    return analyzed

def filter_new_papers(papers_list, analyzed_ids, min_results=5, max_results=10):
    """筛选新论文
    
    Args:
        papers_list: 论文列表（Python list）
        analyzed_ids: 已分析的论文ID集合
        min_results: 最少返回的新论文数
        max_results: 最多返回的新论文数
    
    Returns:
        新论文列表（Python list）
    """
    new_papers = []
    skipped_count = 0
    
    for paper in papers_list:
        # 提取arXiv ID
        link = paper.get('link', '')
        match = re.search(r'(\d+\.\d+)', link)
        
        if match:
            paper_id = match.group(1)
            
            if paper_id not in analyzed_ids:
                new_papers.append(paper)
                print(f"✅ 新论文: {paper['title'][:60]}... (ID: {paper_id})", file=sys.stderr)
            else:
                skipped_count += 1
                print(f"⏭️  跳过已分析: {paper['title'][:60]}... (ID: {paper_id}, 文件: {analyzed_ids[paper_id]})", file=sys.stderr)
        else:
            # 无法提取ID，保守起见保留
            new_papers.append(paper)
            print(f"⚠️  无法提取ID，保留: {paper['title'][:60]}...", file=sys.stderr)
    
    # 如果新论文数量不足，给出警告
    if len(new_papers) < min_results:
        print(f"\n⚠️  警告: 只找到 {len(new_papers)} 篇新论文，少于目标 {min_results} 篇", file=sys.stderr)
        print(f"   建议: 扩大搜索范围或降低筛选标准", file=sys.stderr)
    
    # 限制返回数量
    result = new_papers[:max_results]
    print(f"\n📊 筛选结果:", file=sys.stderr)
    print(f"   总搜索: {len(papers_list)} 篇", file=sys.stderr)
    print(f"   跳过重复: {skipped_count} 篇", file=sys.stderr)
    print(f"   新论文: {len(new_papers)} 篇", file=sys.stderr)
    print(f"   返回: {len(result)} 篇", file=sys.stderr)
    
    return result

def main():
    if len(sys.argv) < 3:
        print("用法:", file=sys.stderr)
        print("  1. 从JSON文件筛选:", file=sys.stderr)
        print("     python filter_papers.py <input.json> <blog_dir> [min] [max]", file=sys.stderr)
        print("  2. 从STDIN筛选:", file=sys.stderr)
        print("     cat papers.json | python filter_papers.py - <blog_dir> [min] [max]", file=sys.stderr)
        sys.exit(1)
    
    input_source = sys.argv[1]
    blog_dir = sys.argv[2]
    min_results = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    max_results = int(sys.argv[4]) if len(sys.argv) > 4 else 10
    
    # 读取输入
    if input_source == '-':
        # 从STDIN读取
        print("📖 从STDIN读取论文列表...", file=sys.stderr)
        papers_json = sys.stdin.read()
    else:
        # 从文件读取
        print(f"📖 从文件读取论文列表: {input_source}", file=sys.stderr)
        try:
            with open(input_source, 'r', encoding='utf-8') as f:
                papers_json = f.read()
        except Exception as e:
            print(f"❌ 错误: 无法读取文件 {input_source}: {e}", file=sys.stderr)
            sys.exit(1)
    
    # 解析JSON
    try:
        # 处理多个JSON对象的情况（每行一个）
        if papers_json.strip().startswith('['):
            papers = json.loads(papers_json)
        else:
            # 尝试解析多个JSON对象
            papers = []
            for line in papers_json.strip().split('\n'):
                line = line.strip()
                if line and line.startswith('['):
                    obj = json.loads(line)
                    if isinstance(obj, list):
                        papers.extend(obj)
                    else:
                        papers.append(obj)
                elif line and line.startswith('{'):
                    papers.append(json.loads(line))
    except json.JSONDecodeError as e:
        print(f"❌ 错误: JSON解析失败: {e}", file=sys.stderr)
        print(f"   输入前100字符: {papers_json[:100]}", file=sys.stderr)
        sys.exit(1)
    
    print(f"📚 共读取 {len(papers)} 篇论文", file=sys.stderr)
    
    # 获取已分析的论文
    analyzed = get_analyzed_papers(blog_dir)
    print(f"📚 已分析论文: {len(analyzed)} 篇", file=sys.stderr)
    
    if analyzed:
        print(f"   示例: {list(analyzed.keys())[:3]}...", file=sys.stderr)
    
    # 筛选新论文
    result = filter_new_papers(papers, analyzed, min_results, max_results)
    
    # 输出JSON
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
