#!/bin/bash
# 简单的xvfb测试脚本

echo "=== 测试1: 检查xvfb是否工作 ==="
xvfb-run --auto-servernum --server-args="-screen 0 1024x768x16" xdpyinfo 2>&1 | head -5

echo -e "\n=== 测试2: 尝试运行notebooklm list ==="
# 设置DISPLAY环境变量
export DISPLAY=:99

# 启动xvfb
Xvfb :99 -screen 0 1024x768x16 &
XVFB_PID=$!
sleep 2

echo "XVFB进程ID: $XVFB_PID"

# 尝试运行notebooklm list
timeout 60 /home/cwh/miniconda3/bin/conda run -n base notebooklm list --json 2>&1 | head -20

# 清理
kill $XVFB_PID 2>/dev/null
wait $XVFB_PID 2>/dev/null

echo -e "\n=== 测试完成 ==="