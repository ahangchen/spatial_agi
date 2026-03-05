#!/bin/bash

# NotebookLM with proxy support
# 设置你的代理地址和端口
PROXY_HOST=${PROXY_HOST:-"127.0.0.1"}
PROXY_PORT=${PROXY_PORT:-"7890"}
PROXY_TYPE=${PROXY_TYPE:-"http"}  # http, https, socks5

export NOTEBOOKLM_PROXY="${PROXY_TYPE}://${PROXY_HOST}:${PROXY_PORT}"

echo "Using proxy: $NOTEBOOKLM_PROXY"

# Run notebooklm with conda
~/miniconda3/bin/conda run -n base notebooklm "$@"
