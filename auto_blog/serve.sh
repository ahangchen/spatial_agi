#!/bin/bash

# 简单的HTTP服务器，用于预览博客

PORT=${1:-8000}

echo "=========================================="
echo "  启动博客预览服务器"
echo "=========================================="
echo ""
echo "端口: $PORT"
echo "访问地址: http://localhost:$PORT"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 检查Python3是否可用
if command -v python3 &> /dev/null; then
    echo "使用 Python3 HTTP 服务器..."
    cd "$(dirname "$0")"
    python3 -m http.server $PORT
# 检查Python2是否可用
elif command -v python &> /dev/null; then
    echo "使用 Python2 HTTP 服务器..."
    cd "$(dirname "$0")"
    python -m SimpleHTTPServer $PORT
# 检查Node.js的http-server是否可用
elif command -v npx &> /dev/null; then
    echo "使用 Node.js http-server..."
    cd "$(dirname "$0")"
    npx http-server -p $PORT
else
    echo "错误: 没有找到可用的HTTP服务器"
    echo ""
    echo "请安装以下工具之一:"
    echo "  - Python3 (推荐): sudo apt install python3"
    echo "  - Node.js: npm install -g http-server"
    echo ""
    exit 1
fi
