#!/bin/bash

# 检查训练状态
echo "=== 训练监控报告 ==="
echo "时间: $(date +%Y-%m-%d %H:%M:%S)"
echo ""
echo "当前状态:"
cd /home/cwh/coding/former3d && python3 /home/cwh/.openclaw/workspace/smart_monitor.py
echo ""
echo "GPU状态:"
nvidia-smi --query-gpu=index,name,memory.used,memory.total,utilization.gpu,temperature.gpu --format=csv

