#!/bin/bash

# 博客预览脚本

echo "=========================================="
echo "  OpenClaw + GLM-4.7 + QQ Bot 教程预览"
echo "=========================================="
echo ""

# 检查文件
if [ ! -f "ubuntu-openclaw-qqbot-guide.md" ]; then
    echo "错误: 找不到博客文章文件"
    exit 1
fi

echo "📄 博客文章: ubuntu-openclaw-qqbot-guide.md"
echo "   文件大小: $(du -h ubuntu-openclaw-qqbot-guide.md | cut -f1)"
echo ""

echo "📂 配图目录: images/"
echo "   架构图: $(ls -lh images/architecture.svg | awk '{print $5}')"
echo "   其他图片: $(ls -1 images/*.png 2>/dev/null | wc -l) 个PNG文件"
echo ""

echo "📋 文章统计:"
echo "   总行数: $(wc -l < ubuntu-openclaw-qqbot-guide.md)"
echo "   字符数: $(wc -c < ubuntu-openclaw-qqbot-guide.md)"
echo "   代码块: $(grep -c '```' ubuntu-openclaw-qqbot-guide.md | awk '{print $1/2}') 个"
echo "   章节数: $(grep -c '^## ' ubuntu-openclaw-qqbot-guide.md) 个"
echo ""

echo "🔗 外部链接:"
grep -oE '\[.*\]\(https?://[^)]+\)' ubuntu-openclaw-qqbot-guide.md | while read -r link; do
    echo "   $link"
done
echo ""

echo "📌 图片引用:"
grep -oE '!\[.*\]\(\./images/[^)]+\)' ubuntu-openclaw-qqbot-guide.md | while read -r img; do
    filename=$(echo "$img" | sed 's/.*(\.\/images\/\([^)]*\))/\1/')
    if [ -f "images/$filename" ]; then
        echo "   ✅ $img"
    else
        echo "   ❌ $img (文件不存在)"
    fi
done
echo ""

# 检查是否需要生成占位符
png_count=$(ls -1 images/*.png 2>/dev/null | wc -l)
if [ "$png_count" -eq 0 ]; then
    echo "⚠️  没有PNG图片文件"
    echo ""
    echo "提示: 运行以下命令生成占位符:"
    echo "  sudo apt install imagemagick"
    echo "  ./generate-placeholders.sh"
elif [ "$png_count" -lt 9 ]; then
    echo "⚠️  PNG图片不完整 ($png_count/9)"
    echo ""
    echo "提示: 运行以下命令生成占位符:"
    echo "  sudo apt install imagemagick"
    echo "  ./generate-placeholders.sh"
else
    echo "✅ 所有图片都已准备就绪！"
fi

echo ""
echo "=========================================="
echo "  预览完成"
echo "=========================================="
echo ""
echo "下一步:"
echo "  1. 在浏览器中查看: ./ubuntu-openclaw-qqbot-guide.md"
echo "  2. 在操作过程中用真实截图替换占位符"
echo "  3. 发布到目标平台"
