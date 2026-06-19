#!/usr/bin/env python3
"""Parse arXiv search results and compile deduplicated paper list with relevance scores."""
import json
import re
import os
from datetime import datetime

# Search queries used
QUERIES = [
    "gaussian_splatting_scene",
    "world_model_robot", 
    "embodied_AI_VLM",
    "spatial_intelligence_3D",
    "VLM_3D_understanding"
]

# High-relevance keywords for scoring
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
    "sim-to-real", "affordance", "agentic"
]

# Medium-relevance keywords  
MED_REL_KEYWORDS = [
    "3d", "vision", "language", "model", "learning",
    "neural", "deep", "transformer", "diffusion",
    "perception", "cognition", "reasoning", "planning",
    "geometry", "rendering", "reconstruction",
    "video", "image", "scene", "object",
    "action", "policy", "reinforcement", "imitation"
]

def parse_papers_from_text(text, query_name):
    """Parse paper entries from arXiv search result text."""
    papers = []
    
    # Split by "- " pattern that precedes each paper title
    # Papers start with "- Title:" pattern
    entries = re.split(r'\n- ', text)
    
    for entry in entries[1:]:  # Skip preamble
        lines = entry.strip().split('\n')
        if not lines:
            continue
            
        title = lines[0].strip()
        
        # Skip non-paper entries
        if not title or len(title) < 10:
            continue
        if title.startswith('Authors:') or title.startswith('Abstract:'):
            continue
        if 'arXiv' in title and len(title) < 20:
            continue
            
        # Clean title - remove trailing whitespace and newlines
        title = title.rstrip()
        
        # Extract authors
        authors = []
        author_section = False
        abstract = ""
        abstract_section = False
        submitted = ""
        
        full_entry = entry
        
        # Extract submitted date
        date_match = re.search(r'Submitted\s+(\d+\s+\w+,?\s+\d{4})', full_entry)
        if date_match:
            submitted = date_match.group(1)
        
        # Extract abstract (text after "Abstract:")
        abstract_match = re.search(r'Abstract:\s*\n*\s*(.+?)(?:▽ More|Submitted|\Z)', full_entry, re.DOTALL)
        if abstract_match:
            abstract = abstract_match.group(1).strip().replace('\n', ' ')[:500]
        
        # Determine date
        date_str = ""
        if "June 2026" in full_entry:
            date_str = "2026-06"
        elif "May 2026" in full_entry:
            date_str = "2026-05"
        elif "April 2026" in full_entry:
            date_str = "2026-04"
        
        # Generate arxiv ID placeholder (would need URL parsing for real ID)
        arxiv_id = ""
        id_match = re.search(r'arxiv\.org/abs/(\d+\.\d+)', full_entry)
        if id_match:
            arxiv_id = id_match.group(1)
        
        paper = {
            "title": title,
            "authors": authors,  # Will be filled from text
            "abstract": abstract,
            "submitted": submitted,
            "date": date_str,
            "source_query": query_name,
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
        score += min(count, 3) * 1  # Cap at 3 per keyword
    
    # Bonus for appearing in multiple queries
    score += 0  # Will be added during dedup
    
    return score


def main():
    data_dir = os.path.expanduser("~/.openclaw/workspace/skills/spatial-agi-research/data")
    results_dir = "/home/cwh/coding/spatial_agi/papers"
    
    # Read raw search result files
    all_papers = {}  # title -> paper dict
    
    for query_name in QUERIES:
        filepath = os.path.join(data_dir, f"search_{query_name}.txt")
        if not os.path.exists(filepath):
            print(f"Warning: {filepath} not found, skipping")
            continue
            
        with open(filepath, 'r') as f:
            text = f.read()
        
        papers = parse_papers_from_text(text, query_name)
        print(f"Parsed {len(papers)} papers from {query_name}")
        
        for paper in papers:
            title_key = paper["title"].lower().strip()
            if title_key in all_papers:
                # Already seen - add query source
                existing = all_papers[title_key]
                existing["source_queries"].add(query_name)
                existing["relevance"] = compute_relevance(existing) + len(existing["source_queries"]) * 2
            else:
                paper["source_queries"] = {query_name}
                paper["relevance"] = compute_relevance(paper) + 2  # base bonus
                all_papers[title_key] = paper
    
    # Convert to list and sort by relevance
    paper_list = list(all_papers.values())
    
    # Convert sets to lists for JSON serialization
    for p in paper_list:
        p["source_queries"] = list(p["source_queries"])
    
    paper_list.sort(key=lambda x: x["relevance"], reverse=True)
    
    # Save
    os.makedirs(results_dir, exist_ok=True)
    
    today = datetime.now().strftime("%Y-%m-%d")
    output_path = os.path.join(results_dir, f"papers_{today}.json")
    
    output = {
        "date": today,
        "total_papers": len(paper_list),
        "queries": QUERIES,
        "papers": paper_list
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nTotal unique papers: {len(paper_list)}")
    print(f"Saved to: {output_path}")
    
    # Print top 20
    print(f"\nTop 20 papers by relevance:")
    for i, p in enumerate(paper_list[:20], 1):
        print(f"  {i}. [{p['relevance']}] {p['title'][:80]}")


if __name__ == "__main__":
    main()
