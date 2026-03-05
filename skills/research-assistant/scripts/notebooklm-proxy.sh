#!/bin/bash
# NotebookLM Proxy脚本
# 自动配置代理并执行notebooklm命令

# 配置代理（可通过环境变量覆盖）
PROXY_HOST=${PROXY_HOST:-"127.0.0.1"}
PROXY_PORT=${PROXY_PORT:-"1080"}
PROXY_TYPE=${PROXY_TYPE:-"socks5"}

export NOTEBOOKLM_PROXY="${PROXY_TYPE}://${PROXY_HOST}:${PROXY_PORT}"

# 显示使用的代理
echo "Using proxy: $NOTEBOOKLM_PROXY"

# 执行notebooklm命令，传递所有参数
~/miniconda3/bin/conda run -n base notebooklm "$@"
