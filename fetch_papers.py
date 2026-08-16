#!/usr/bin/env python3
"""Fetch and parse arXiv search results for Spatial AGI papers."""
import json
import re
import os
import urllib.request
import time
from datetime import datetime

QUERIES = [
    ("gaussian_splatting_scene", "gaussian+splatting+scene"),
    ("world_model_robot", "world+model+robot"),
    ("embodied_AI_VLM", "embodied+AI+VLM"),
    ("spatial_intelligence_3D", "spatial+intelligence+3D"),
    ("VLM_3D_understanding", "VLM+3D+understanding"),
]

HIGH_REL_KEYWORDS = [
    "spatial intelligence", "spatial reasoning", "3d understanding",
    "scene understanding", "embodied", "world model",
    "vision-language", "vlm", "vla", "gaussian splatting",
    "robot", "manipulation", "navigation", "point cloud",
    "3d scene", "depth estimation", "scene graph",
    "visual grounding", "spatial", "3d perception",
    "multimodal", "large language model", "mllm",
    "autonomous driving", "occupancy", "embodied ai",
    "representation learning", "3d reconstruction",
    "sim-to-real", "affordance", "agentic",
    "world action model", "visual-language-navigation", "vln",
    "robotic", "grasping", "trajectory",
]

MED_REL_KEYWORDS = [
    "3d", "vision", "language", "model", "learning",
    "neural", "deep", "transformer", "diffusion",
    "perception", "cognition", "reasoning", "planning",
    "geometry", "rendering", "reconstruction",
    "video", "image", "scene", "object",
    "action", "policy", "reinforcement", "imitation",
    "knowledge", "graph", "cross-modal", "alignment",
    "benchmark", "dataset", "evaluation",
]


def fetch_arxiv_search(query_str, max_results=50):
    """Fetch arXiv search results via HTTP and parse papers."""
    url = f"https://arxiv.org/search/?searchtype=all&query={query_str}&start=0&order=-announced_date_first"
    
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    })
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"  Error fetching {query_str}: {e}")
        return []
    
    # Parse papers from HTML using regex
    # Each paper is in <li class="arxiv-result">
    papers = []
    
    # Extract paper blocks
    blocks = re.split(r'<li class="arxiv-result">', html)[1:]
    
    for block in blocks:
        # End at </li>
        block = block.split('</li>')[0]
        
        # Extract title
        title_match = re.search(r'<p class="title is-5 mathjax">\s*(.*?)\s*</p>', block, re.DOTALL)
        title = ""
        if title_match:
            title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
        
        if not title or len(title) < 5:
            continue
        
        # Extract arxiv ID
        arxiv_id = ""
        id_match = re.search(r'arxiv\.org/abs/(\d+\.\d+)', block)
        if id_match:
            arxiv_id = id_match.group(1)
        
        # Extract authors
        authors = []
        author_matches = re.findall(r'class="author"[^>]*>([^<]+)</a>', block)
        for a in author_matches:
            name = a.strip()
            if name and len(name) > 1:
                authors.append(name)
        
        # Also try alternate author pattern
        if not authors:
            author_matches = re.findall(r'data-orcid[^>]*>([^<]+)<', block)
            for a in author_matches:
                authors.append(a.strip())
        
        # Also try the "has-text-black" class used by arXiv
        if not authors:
            author_matches = re.findall(r'<a[^>]*query="[^"]*"[^>]*>([^<]+)</a>', block)
            for a in author_matches:
                name = a.strip()
                if name and len(name) > 1 and ',' in name or len(name) > 2:
                    authors.append(name)
        
        # Extract abstract
        abstract = ""
        abs_match = re.search(r'<span class="abstract-full[^"]*"[^>]*>(.*?)(?:<a|$)', block, re.DOTALL)
        if abs_match:
            abstract = re.sub(r'<[^>]+>', '', abs_match.group(1)).strip()
        else:
            abs_match = re.search(r'<span class="abstract-short[^"]*"[^>]*>(.*?)(?:<a|$)', block, re.DOTALL)
            if abs_match:
                abstract = re.sub(r'<[^>]+>', '', abs_match.group(1)).strip()
        
        # Also try the ▽ More pattern
        if not abstract:
            abs_match = re.search(r'abstract.*?:(.*?)(?:▽|Submitted|Originally)', block, re.DOTALL | re.IGNORECASE)
            if abs_match:
                abstract = re.sub(r'<[^>]+>', '', abs_match.group(1)).strip()
        
        abstract = abstract[:500] if abstract else ""
        
        # Extract submitted date
        submitted = ""
        date_match = re.search(r'Submitted\s+(.*?)(?:;|<)', block)
        if date_match:
            submitted = re.sub(r'<[^>]+>', '', date_match.group(1)).strip()
        
        # Determine month
        date_str = ""
        if "June 2026" in block:
            date_str = "2026-06"
        elif "May 2026" in block:
            date_str = "2026-05"
        elif "April 2026" in block:
            date_str = "2026-04"
        
        paper = {
            "title": title,
            "authors": authors[:10],  # Limit to first 10
            "abstract": abstract,
            "submitted": submitted,
            "date": date_str,
            "arxiv_id": arxiv_id,
        }
        papers.append(paper)
    
    return papers


def compute_relevance(paper):
    """Compute relevance score based on keyword matching."""
    text = (paper["title"] + " " + paper["abstract"]).lower()
    
    score = 0
    for kw in HIGH_REL_KEYWORDS:
        if kw in text:
            score += 3
    
    for kw in MED_REL_KEYWORDS:
        count = text.count(kw)
        score += min(count, 3)
    
    return score


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    results_dir = os.path.join(script_dir, "papers")
    os.makedirs(results_dir, exist_ok=True)
    
    all_papers = {}  # title_key -> paper dict
    
    for query_name, query_str in QUERIES:
        print(f"Searching: {query_name} ...")
        papers = fetch_arxiv_search(query_str)
        print(f"  Found {len(papers)} papers")
        
        for paper in papers:
            title_key = paper["title"].lower().strip()
            if title_key in all_papers:
                existing = all_papers[title_key]
                existing["source_queries"].append(query_name)
                existing["relevance"] = compute_relevance(existing) + len(existing["source_queries"]) * 2
            else:
                paper["source_queries"] = [query_name]
                paper["relevance"] = compute_relevance(paper) + 2
                all_papers[title_key] = paper
        
        time.sleep(1)  # Be polite
    
    # Convert to list and sort
    paper_list = list(all_papers.values())
    paper_list.sort(key=lambda x: x["relevance"], reverse=True)
    
    # Save
    today = datetime.now().strftime("%Y-%m-%d")
    output_path = os.path.join(results_dir, f"papers_{today}.json")
    
    output = {
        "date": today,
        "total_papers": len(paper_list),
        "queries": [q[0] for q in QUERIES],
        "papers": paper_list
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nTotal unique papers: {len(paper_list)}")
    print(f"Saved to: {output_path}")
    
    # Print stats
    june_count = sum(1 for p in paper_list if p["date"] == "2026-06")
    may_count = sum(1 for p in paper_list if p["date"] == "2026-05")
    print(f"June 2026 papers: {june_count}")
    print(f"May 2026 papers: {may_count}")
    
    print(f"\nTop 30 papers by relevance:")
    for i, p in enumerate(paper_list[:30], 1):
        queries = ",".join(p["source_queries"][:2])
        print(f"  {i:2d}. [{p['relevance']:3d}] ({queries}) {p['title'][:70]}")
    
    return paper_list


if __name__ == "__main__":
    papers = main()
