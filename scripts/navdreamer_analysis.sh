#!/bin/bash
# NavDreamer 完整分析工作流自动化脚本
# 用途：自动化处理NavDreamer论文的完整分析流程

set -e  # 遇到错误时退出

# 配置代理
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"
NOTEBOOKLM_CMD="~/miniconda3/bin/conda run -n base notebooklm"

# 定义链接
PROJECT_PAGE="https://xinjiu612.github.io/NavDreamer/"
PDF_LINK="https://arxiv.org/pdf/2602.09765.pdf"
CODE_REPO=""  # 代码仓库暂不可用，HuggingFace Demo显示"Coming Soon"

echo "=========================================="
echo "NavDreamer 研究工作流"
echo "=========================================="
echo ""

# 步骤1：创建笔记本
echo "[1/8] 创建NotebookLM笔记本..."
NOTEBOOK_OUTPUT=$($NOTEBOOKLM_CMD create "NavDreamer: Video Models as Zero-Shot 3D Navigators" 2>&1)
NOTEBOOK_ID=$(echo "$NOTEBOOK_OUTPUT" | grep -oP '(?<=Created notebook: )[a-f0-9-]+|(?<=Notebook ID: )[a-f0-9-]+' || echo "")

if [ -z "$NOTEBOOK_ID" ]; then
    echo "错误：无法获取笔记本ID"
    echo "输出: $NOTEBOOK_OUTPUT"
    exit 1
fi

echo "✓ 笔记本ID: $NOTEBOOK_ID"
echo ""

# 步骤2：使用笔记本
echo "[2/8] 设置当前笔记本..."
$NOTEBOOKLM_CMD use $NOTEBOOK_ID > /dev/null 2>&1
echo "✓ 已设置当前笔记本"
echo ""

# 步骤3：添加项目网页
echo "[3/8] 添加项目网页..."
$NOTEBOOKLM_CMD source add $PROJECT_PAGE > /dev/null 2>&1
echo "✓ 项目网页已添加"
echo ""

# 步骤4：添加论文PDF
echo "[4/8] 添加论文PDF（这可能需要1-2分钟）..."
$NOTEBOOKLM_CMD source add $PDF_LINK > /dev/null 2>&1
echo "✓ 论文PDF已添加"
echo ""

# 步骤5：检查代码仓库
echo "[5/8] 添加代码仓库..."
if [ -n "$CODE_REPO" ]; then
    $NOTEBOOKLM_CMD source add $CODE_REPO > /dev/null 2>&1
    echo "✓ 代码仓库已添加"
else
    echo "⊗ 代码仓库暂不可用（HuggingFace Demo显示Coming Soon）"
fi
echo ""

# 等待几秒让source处理完成
echo "等待来源处理完成..."
sleep 5
echo ""

# 步骤6：生成演示文稿
echo "[6/8] 生成演示文稿..."
$NOTEBOOKLM_CMD generate slide-deck > /dev/null 2>&1
echo "✓ 演示文稿生成已启动"
echo ""

# 步骤7：询问关键问题
echo "[7/8] 询问关键问题..."
echo ""

echo "问题1：核心算法流程"
echo "----------------------------------------"
$NOTEBOOKLM_CMD ask "这篇文章的核心算法流程是怎样的？"
echo ""
echo ""

echo "问题2：改进和创新"
echo "----------------------------------------"
$NOTEBOOKLM_CMD ask "这篇文章相比其他工作或者它的baseline有什么改进和创新？"
echo ""
echo ""

echo "问题3：实验部署和运行效率"
echo "----------------------------------------"
$NOTEBOOKLM_CMD ask "这个工作的实验在什么环境部署的，部署时运行效率如何？"
echo ""
echo ""

# 步骤8：显示状态和后续操作
echo "[8/8] 检查Artifacts状态..."
echo "=========================================="
$NOTEBOOKLM_CMD artifact list
echo ""
echo ""

echo "=========================================="
echo "工作流完成！"
echo "=========================================="
echo ""
echo "笔记本ID: $NOTEBOOK_ID"
echo ""
echo "后续操作："
echo "1. 检查演示文稿生成状态:"
echo "   $NOTEBOOKLM_CMD artifact list"
echo ""
echo "2. 生成音频概览:"
echo "   $NOTEBOOKLM_CMD generate audio"
echo ""
echo "3. 访问NotebookLM网页:"
echo "   https://notebooklm.google.com"
echo ""
echo "4. 查看或下载artifacts:"
echo "   $NOTEBOOKLM_CMD artifact get <artifact-id>"
echo "   $NOTEBOOKLM_CMD download slide-deck"
echo ""
echo "5. 导航到 https://notebooklm.google.com 并使用笔记本ID: $NOTEBOOK_ID"
