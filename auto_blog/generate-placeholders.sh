#!/bin/bash

# 占位符图片生成脚本
# 需要安装 ImageMagick: sudo apt install imagemagick

IMAGES=(
    "nodejs-install"
    "glm-apikey"
    "openclaw-install"
    "openclaw-config"
    "openclaw-tui"
    "qq-platform-register"
    "qqbot-credentials"
    "config-file"
    "qqbot-test"
)

cd "$(dirname "$0")/images"

echo "生成占位符图片..."

for img in "${IMAGES[@]}"; do
    if command -v convert &> /dev/null; then
        convert -size 800x400 xc:#f8f9fa \
            -pointsize 30 \
            -gravity center \
            -fill "#e0e0e0" \
            -draw "rectangle 20,20 780,380" \
            -pointsize 24 \
            -fill "#666" \
            -gravity center \
            -annotate +0+0 "占位符：${img}" \
            -pointsize 16 \
            -fill "#999" \
            -gravity south \
            -annotate +0+20 "请在实际操作时替换此图片" \
            "${img}.png"

        if [ $? -eq 0 ]; then
            echo "✓ 已生成: ${img}.png"
        else
            echo "✗ 生成失败: ${img}.png"
        fi
    else
        echo "错误: 需要安装 ImageMagick"
        echo "运行: sudo apt install imagemagick"
        exit 1
    fi
done

echo ""
echo "完成！已生成 ${#IMAGES[@]} 个占位符图片。"
echo "请在实际操作时使用真实截图替换这些占位符。"
