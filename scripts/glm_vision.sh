#!/bin/bash

# GLM Vision MCP 便捷脚本
# 用法: ./scripts/glm_vision.sh <命令> [参数]

COMMAND="$1"

# 检查命令
if [ -z "$COMMAND" ]; then
    echo "用法: $0 <命令> [参数]"
    echo ""
    echo "命令:"
    echo "  analyze_image    分析图片"
    echo "  analyze_video    分析视频"
    echo "  ocr           OCR提取文本"
    echo "  diagram        分析技术图"
    echo "  dashboard      分析数据可视化"
    echo ""
    echo "参数说明:"
    echo "  analyze_image: <图片路径或URL>"
    echo "  analyze_video: <视频路径> [remote: true|false]"
    echo "  ocr: <图片路径或URL>"
    echo "  diagram: <图片路径或URL>"
    echo "  dashboard: <图片路径或URL>"
    echo ""
    echo "示例:"
    echo "  $0 analyze_image /path/to/image.png"
    echo "  $0 analyze_video /path/to/video.mp4"
    echo "  $0 ocr https://example.com/screenshot.png"
    echo "  $0 diagram /path/to/architecture.png"
    exit 1
fi

echo "👁 GLM Vision MCP"
echo "命令: $COMMAND"
echo "---"

# 设置环境变量
export Z_AI_API_KEY="9ba36d7227c24614ba3132fa122b389b.qcvoB6kL0dqIcM88"
export Z_AI_MODE="ZAI"

case "$COMMAND" in
    analyze_image)
        if [ -z "$2" ]; then
            echo "错误: 需要提供图片路径"
            exit 1
        fi
        echo "📸 分析图片: $2"
        npx -y @z_ai/mcp-server analyze_image "$2"
        ;;
    analyze_video)
        if [ -z "$2" ]; then
            echo "错误: 需要提供视频路径"
            exit 1
        fi
        REMOTE="${3:-false}"
        echo "🎬 分析视频: $2 (远程: $REMOTE)"
        if [ "$REMOTE" = "true" ]; then
            npx -y @z_ai/mcp-server analyze_video "$2" remote="true"
        else
            npx -y @z_ai/mcp-server analyze_video "$2"
        fi
        ;;
    ocr)
        if [ -z "$2" ]; then
            echo "错误: 需要提供图片路径"
            exit 1
        fi
        echo "📝 OCR提取: $2"
        npx -y @z_ai/mcp-server ocr "$2"
        ;;
    diagram)
        if [ -z "$2" ]; then
            echo "错误: 需要提供图片路径"
            exit 1
        fi
        echo "📊 分析技术图: $2"
        npx -y @z_ai/mcp-server understand_technical_diagram "$2"
        ;;
    dashboard)
        if [ -z "$2" ]; then
            echo "错误: 需要提供图片路径"
            exit 1
        fi
        echo "📈 分析数据可视化: $2"
        npx -y @z_ai/mcp-server analyze_data_visualization "$2"
        ;;
    *)
        echo "错误: 未知命令 '$COMMAND'"
        echo "可用命令: analyze_image, analyze_video, ocr, diagram, dashboard"
        exit 1
        ;;
esac

echo ""
echo "✅ 命令完成"
