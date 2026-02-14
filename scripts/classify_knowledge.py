#!/usr/bin/env python3
"""
Knowledge Base Classifier
Categorizes extracted knowledge into specific markdown files based on content type.
"""

import sys
import os
import re
from datetime import datetime
from pathlib import Path

def classify_knowledge(input_file, output_dir):
    """
    Read extracted knowledge and categorize it into different files.

    Categories:
    - technical_decisions.md - Technical decisions and architecture choices
    - problem_solutions.md - Problem solutions and troubleshooting
    - lessons_learned.md - Lessons learned and best practices
    - code_patterns.md - Code patterns and coding standards
    - tools_config.md - Tools, configuration, and setup information
    - workflow_processes.md - Workflow and process documentation
    """

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into sections based on common delimiters
    sections = re.split(r'\n-{3,}\n|\n#{1,3} ', content)

    # Initialize category dictionaries
    categories = {
        'technical_decisions': [],
        'problem_solutions': [],
        'lessons_learned': [],
        'code_patterns': [],
        'tools_config': [],
        'workflow_processes': []
    }

    # Keywords for each category
    keywords = {
        'technical_decisions': ['决策', '架构', '设计', '选择', '方案', '技术栈'],
        'problem_solutions': ['问题', '错误', 'bug', '失败', '原因', '解决', '修复'],
        'lessons_learned': ['教训', '经验', '注意', '避免', '建议', '改进'],
        'code_patterns': ['代码', '函数', '类', '模式', '实现', '优化'],
        'tools_config': ['工具', '配置', '安装', '设置', '环境', '依赖'],
        'workflow_processes': ['流程', '步骤', '工作流', '开发', '测试', '部署']
    }

    # Classify each section
    for section in sections:
        section = section.strip()
        if not section or len(section) < 10:
            continue

        # Count keyword matches for each category
        scores = {}
        for category, kw_list in keywords.items():
            score = sum(1 for kw in kw_list if kw in section)
            scores[category] = score

        # Assign to category with highest score
        max_category = max(scores, key=scores.get)
        if scores[max_category] > 0:
            categories[max_category].append(section)
        else:
            # Default to workflow_processes if no clear match
            categories['workflow_processes'].append(section)

    # Write categorized knowledge
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for category, sections in categories.items():
        if not sections:
            continue

        output_file = output_path / f'{category}.md'

        # Create or append to file
        with open(output_file, 'a', encoding='utf-8') as f:
            # Add separator if file exists
            if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                f.write('\n\n---\n\n')

            f.write(f'## 提取时间: {timestamp}\n\n')
            for section in sections:
                f.write(section + '\n\n')

        print(f"✓ Wrote {len(sections)} sections to {output_file}")

    # Create an index file
    index_file = output_path / 'index.md'
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write('# 知识库索引\n\n')
        f.write(f'最后更新: {timestamp}\n\n')
        f.write('## 分类文件\n\n')

        for category, sections in categories.items():
            if sections:
                count = len(sections)
                f.write(f'- **{category}.md**: {count} 条目\n')

        f.write('\n---\n\n')
        f.write('## 使用说明\n\n')
        f.write('在执行任务时，可以查询以下分类：\n\n')
        f.write('1. `technical_decisions.md` - 技术决策和架构选择\n')
        f.write('2. `problem_solutions.md` - 问题和解决方案\n')
        f.write('3. `lessons_learned.md` - 经验教训和最佳实践\n')
        f.write('4. `code_patterns.md` - 代码模式和实现方式\n')
        f.write('5. `tools_config.md` - 工具和配置信息\n')
        f.write('6. `workflow_processes.md` - 工作流程和开发流程\n')

    print(f"✓ Updated index at {index_file}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: classify_knowledge.py <input_file> <output_dir>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_dir = sys.argv[2]

    classify_knowledge(input_file, output_dir)
