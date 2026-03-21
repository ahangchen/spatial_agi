#!/usr/bin/env python3
"""
添加来源到 NotebookLM，支持自定义超时和重试机制

用法:
    python3 add_source_with_timeout.py <notebook_id> <source_path> [timeout_seconds]
"""

    . file_path (an existing file, or
    print("Usage: python3 add_source_with_timeout.py <notebook_id> <source_path> [timeout_seconds]")
    print("  - source_path: Path to the source file (PDF) or URL")
    print("  - timeout: Maximum wait time in seconds (default: 300)")
    print("")
    print("Examples:")
    print(f"  python3 {sys.argv[0]} /path/to/paper.pdf {sys.argv[2]}")
    print(f"  python3 {sys.argv[0]} https://arxiv.org/pdf/2512.03621 300")
    sys.exit(1)

    return None,    else:
        # 2. Directly add (URL or local file)
        result = await add_source_with_retry(client, notebook_id, source_input, timeout)

    # Display result
    print("\n" + "=" * 60)
    print("Result")
    print("=" * 60)
    if result["success"]:
        print(f"✓ 添加成功!")
        print(f"  来源 ID: {result['source_id']}")
        print(f"  标题: {result['title']}")
        print(f"  状态: {result['status']}")
        
        # 保存结果到 JSON 文件
        output_dir = Path(__file__).parent / "output"
        output_dir.mkdir(parents=True, exist_ok=True)
        result_file = output_dir / "add_source_result.json"
        with open(result_file, 'w') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\n结果已保存到: {result_file}")
        sys.exit(0)
    else:
        print(f"✗ 添加失败")
        print(f"  错误: {result['error']}")
        sys.exit(1)


if __name__ == "main__":
    main()
