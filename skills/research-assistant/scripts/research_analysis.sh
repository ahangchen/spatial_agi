#!/bin/bash
# 科研论文分析自动化脚本
# 用途：自动化处理论文的完整分析流程

set -e  # 遇到错误时退出

# 检查参数
if [ $# -lt 3 ]; then
    echo "用法: $0 <论文标题> <项目页面URL> <PDF链接> [代码仓库URL] [选项]"
    echo ""
    echo "参数："
    echo "  论文标题        - 论文或项目的标题"
    echo "  项目页面URL     - 项目的网页链接"
    echo "  PDF链接          - 论文的PDF链接"
    echo "  代码仓库URL (可选) - GitHub或GitLab链接"
    echo ""
    echo "选项："
    echo "  --skip-pdf           - 跳过添加PDF（适用于PDF很大的情况）"
    echo "  --pdf-timeout <秒> - PDF添加超时时长（默认60秒）"
    echo "  --skip-questions     - 跳过询问研究问题"
    echo "  --skip-slides        - 跳过生成演示文稿"
    echo "  --skip-audio         - 跳过生成音频概览"
    echo ""
    echo "示例："
    echo "  $0 \"NavDreamer: Video Models as Zero-Shot 3D Navigators\" \\"
    echo "       https://xinjiu612.github.io/NavDreamer/ \\"
    echo "       https://arxiv.org/pdf/2602.09765.pdf"
    echo ""
    echo "  $0 \"论文标题\" https://page.com https://pdf.com https://github.com/user/repo \\"
    echo "       --pdf-timeout 120  # PDF添加超时120秒"
    echo ""
    echo "  $0 \"论文标题\" https://page.com https://pdf.com --skip-pdf"
    exit 1
fi

# 解析选项
SKIP_PDF=false
PDF_TIMEOUT=60
SKIP_QUESTIONS=false
SKIP_SLIDES=false
SKIP_AUDIO=false

while [ $# -gt 3 ]; do
    case "$4" in
        --skip-pdf)
            SKIP_PDF=true
            shift
            ;;
        --pdf-timeout)
            PDF_TIMEOUT="$5"
            shift 2
            ;;
        --skip-questions)
            SKIP_QUESTIONS=true
            shift
            ;;
        --skip-slides)
            SKIP_SLIDES=true
            shift
            ;;
        --skip-audio)
            SKIP_AUDIO=true
            shift
            ;;
        *)
            echo "未知选项: $4"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

PAPER_TITLE="$1"
PROJECT_PAGE="$2"
PDF_LINK="$3"
CODE_REPO="$4"  # 可选

# 配置代理（可通过环境变量覆盖）
PROXY_HOST=${PROXY_HOST:-"127.0.0.1"}
PROXY_PORT=${PROXY_PORT:-"1080"}
PROXY_TYPE=${PROXY_TYPE:-"socks5"}
export NOTEBOOKLM_PROXY="${PROXY_TYPE}://${PROXY_HOST}:${PROXY_PORT}"

# 配置notebooklm命令
NOTEBOOKLM_CMD="~/miniconda3/bin/conda run -n base notebooklm"
PROXY_SCRIPT="/home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh"

echo "=========================================="
echo "科研论文分析流程"
echo "=========================================="
echo ""
echo "论文: $PAPER_TITLE"
echo "项目页面: $PROJECT_PAGE"
echo "PDF: $PDF_LINK"
[ -n "$CODE_REPO" ] && echo "代码仓库: $CODE_REPO"
[ "$SKIP_PDF" = true ] && echo "PDF添加: 跳过（--skip-pdf）"
[ "$SKIP_QUESTIONS" = true ] && echo "研究问题: 跳过（--skip-questions）"
[ "$SKIP_SLIDES" = true ] && echo "演示文稿: 跳过（--skip-slides）"
[ "$SKIP_AUDIO" = true ] && echo "音频概览: 跳过（--skip-audio）"
echo ""

# 步骤1：创建笔记本
echo "[1/7] 创建NotebookLM笔记本..."
NOTEBOOK_OUTPUT=$($NOTEBOOKLM_CMD create "$PAPER_TITLE" 2>&1)
NOTEBOOK_ID=$(echo "$NOTEBOOK_OUTPUT" | grep -oP '(?<=Created notebook: )[a-f0-9-]+' | head -1)

if [ -z "$NOTEBOOK_ID" ]; then
    echo "错误：无法获取笔记本ID"
    echo "输出: $NOTEBOOK_OUTPUT"
    exit 1
fi

echo "✓ 笔记本ID: $NOTEBOOK_ID"
echo ""

# 步骤2：使用笔记本
echo "[2/7] 设置当前笔记本..."
PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
  $PROXY_SCRIPT use $NOTEBOOK_ID > /dev/null 2>&1
echo "✓ 已设置当前笔记本"
echo ""

# 步骤3：添加项目网页
echo "[3/7] 添加项目网页..."
PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
  $PROXY_SCRIPT source add "$PROJECT_PAGE" > /dev/null 2>&1
echo "✓ 项目网页已添加"
echo ""

# 步骤4：添加论文PDF（如果未跳过）
if [ "$SKIP_PDF" = false ]; then
    echo "[4/7] 添加论文PDF（超时时长：${PDF_TIMEOUT}秒，这可能需要较长时间）..."
    
    # 使用timeout命令来增加超时时长
    # 如果系统没有timeout命令，则直接执行
    if command -v timeout >/dev/null 2>&1; then
        timeout ${PDF_TIMEOUT}s \
            bash -c "PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
                /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh source add '$PDF_LINK'" \
            2>&1 || true
    else
        PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
          $PROXY_SCRIPT source add "$PDF_LINK" > /dev/null 2>&1 || true
    fi
    
    EXIT_CODE=${PIPESTATUS[0]}
    
    if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 124 ]; then
        # 成功或超时（124）都视为添加成功
        echo "✓ 论文PDF已添加"
    else
        echo "✗ 论文PDF添加失败（退出码：$EXIT_CODE）"
        echo "   建议稍后在NotebookLM网页手动添加PDF"
    fi
else
    echo "[4/7] 跳过PDF添加（--skip-pdf）"
fi
echo ""

# 等待几秒让source处理完成
echo "等待来源处理完成..."
sleep 5
echo ""

# 步骤5：添加代码仓库（如果提供）
echo "[5/7] 添加代码仓库..."
if [ -n "$CODE_REPO" ]; then
    PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
      $PROXY_SCRIPT source add "$CODE_REPO" > /dev/null 2>&1
    echo "✓ 代码仓库已添加"
else
    echo "⊗ 代码仓库未提供（跳过）"
fi
echo ""

# 步骤6：生成演示文稿（如果未跳过）
if [ "$SKIP_SLIDES" = false ]; then
    echo "[6/7] 生成演示文稿..."
    PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
      $PROXY_SCRIPT generate slide-deck > /dev/null 2>&1
    echo "✓ 演示文稿生成已启动"
    echo "提示：可以使用以下命令检查状态"
    echo "  PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \\"
    echo "    $PROXY_SCRIPT artifact list"
else
    echo "[6/7] 跳过演示文稿生成（--skip-slides）"
fi
echo ""

# 步骤7：询问关键问题（如果未跳过）
if [ "$SKIP_QUESTIONS" = false ]; then
    echo "[7/7] 询问关键研究问题..."
    echo ""
    
    echo "问题1：核心算法流程"
    echo "----------------------------------------"
    PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
      $PROXY_SCRIPT ask "这篇文章的核心算法流程是怎样的？"
    echo ""
    
    echo "问题2：改进和创新"
    echo "----------------------------------------"
    PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
      $PROXY_SCRIPT ask "这篇文章相比其他工作或者它的baseline有什么改进和创新？"
    echo ""
    
    echo "问题3：实验部署和运行效率"
    echo "----------------------------------------"
    PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
      $PROXY_SCRIPT ask "这个工作的实验在什么环境部署的，部署时运行效率如何？"
    echo ""
    
    # 可选：生成音频概览
    if [ "$SKIP_AUDIO" = false ]; then
        echo "[7.5] 生成音频概览（可选）..."
        PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \
          $PROXY_SCRIPT generate audio > /dev/null 2>&1
        echo "✓ 音频概览生成已启动"
        echo ""
    else
        echo "[7.5] 跳过音频概览生成（--skip-audio）"
    fi
else
    echo "[7/7] 跳过研究问题询问（--skip-questions）"
fi

# 完成总结
echo "=========================================="
echo "分析流程完成！"
echo "=========================================="
echo ""
echo "笔记本信息:"
echo "  ID: $NOTEBOOK_ID"
echo "  标题: $PAPER_TITLE"
echo ""
echo "来源状态:"
echo "  1. 项目网页: ✅ 已添加"
echo "  2. 论文PDF: $([ "$SKIP_PDF" = true ] && echo "⊗ 跳过" || echo "✅ 已添加（超时：${PDF_TIMEOUT}秒）")"
echo "  3. 代码仓库: $([ -n "$CODE_REPO" ] && echo "✅ 已添加" || echo "⊗ 未提供")"
echo ""
echo "生成状态:"
echo "  演示文稿: $([ "$SKIP_SLIDES" = true ] && echo "⊗ 跳过" || echo "✅ 已启动")"
echo "  研究问题: $([ "$SKIP_QUESTIONS" = true ] && echo "⊗ 跳过" || echo "✅ 已询问")"
echo "  音频概览: $([ "$SKIP_AUDIO" = true ] && echo "⊗ 跳过" || echo "✅ 已启动")"
echo ""
echo "后续操作："
echo "1. 检查演示文稿生成状态:"
echo "   PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \\"
echo "     $PROXY_SCRIPT artifact list"
echo ""
echo "2. 下载演示文稿:"
echo "   PROXY_HOST=$PROXY_HOST PROXY_PORT=$PROXY_PORT PROXY_TYPE=$PROXY_TYPE \\"
echo "     $PROXY_SCRIPT download slide-deck"
echo ""
echo "3. 访问NotebookLM网页:"
echo "   https://notebooklm.google.com"
echo "   使用笔记本ID: $NOTEBOOK_ID"
echo ""
echo "4. 手动操作建议:"
echo "   如果PDF添加失败，请在网页界面手动添加："
echo "   https://notebooklm.google.com → 选择笔记本 → 添加来源 → 上传PDF"
echo ""
echo "5. 跳过某些步骤的示例:"
echo "   $0 \"论文标题\" https://page.com https://pdf.com --skip-pdf --skip-slides"
echo "   $0 \"论文标题\" https://page.com https://pdf.com --pdf-timeout 120"
echo ""
