# 环境配置 (cwh-u24)

> 记录工作电脑的硬件和软件配置

---

## 操作系统

| 项目 | 信息 |
|------|------|
| 系统 | Ubuntu 24.04.3 LTS (Noble) |
| 内核 | 6.17.0-14-generic |
| 架构 | x86_64 |

---

## 硬件配置

### 显卡

| GPU | 型号 | 显存 | 驱动 |
|-----|------|------|------|
| GPU 0 | NVIDIA P102-100 | 10GB | 580.126.09 |
| GPU 1 | NVIDIA P102-100 | 10GB | 580.126.09 |

- **双显卡配置**，适合多GPU训练
- P102-100 是矿卡，性价比较高

### 内存与存储

| 项目 | 信息 |
|------|------|
| 内存 | 62GB (可用约53GB) |
| Swap | 7.6GB |
| 磁盘(/home) | 505GB NVMe，已用39GB，可用441GB |

---

## Conda 环境

| 环境名 | 路径 | 用途 |
|--------|------|------|
| base | ~/miniconda3 | 基础环境 |
| former3d | ~/miniconda3/envs/former3d | **主要开发环境** - 3D深度学习 |
| mijia_auto | ~/miniconda3/envs/mijia_auto | 米家自动化 |

### former3d 环境

| 项目 | 版本 |
|------|------|
| PyTorch | 1.10.0+cu111 |
| CUDA (runtime) | 11.1 |
| cuDNN | 8.0.5 |
| GPU支持 | ✅ 2 GPUs 可用 |
| Compute Capability | 6.1 |

> **注意**: PyTorch版本较旧(1.10)，新项目可能需要升级

---

## CUDA 配置

### 系统安装的CUDA版本

| 版本 | 路径 | 备注 |
|------|------|------|
| **CUDA 11.1** (默认) | /usr/local/cuda-11.1 | `/usr/local/cuda` 链接至此 |
| CUDA 11.3 | /usr/local/cuda-11.3 | 可切换使用 |
| CUDA 11.7 | /usr/local/cuda-11.7 | 可切换使用 |

### CUDA Toolkit 11.1 详情

| 项目 | 信息 |
|------|------|
| 版本 | 11.1.74 |
| 构建日期 | 2020-09-15 |
| nvcc路径 | /usr/local/cuda/bin/nvcc |

### 切换CUDA版本

```bash
# 临时切换到CUDA 11.7
export PATH=/usr/local/cuda-11.7/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-11.7/lib64:$LD_LIBRARY_PATH

# 永久切换（修改 ~/.bashrc）
sudo rm /usr/local/cuda
sudo ln -s /usr/local/cuda-11.7 /usr/local/cuda
```

---

## 已安装软件

| 软件 | 版本 | 备注 |
|------|------|------|
| Git | 2.43.0 | ✅ |
| Node.js | v24.13.1 | ✅ |
| npm | 11.8.0 | ✅ |
| Docker | 未安装 | 如需容器化需安装 |
| CUDA Toolkit | 11.1 / 11.3 / 11.7 | nvcc需配置PATH |
| cuDNN | 8.0.5 | PyTorch环境内 |

---

## 工作目录

| 目录 | 用途 |
|------|------|
| `/home/cwh/coding/` | 代码项目 |
| `/home/cwh/coding/former3d/` | **主要项目** - 3D深度学习 |
| `/home/cwh/.openclaw/` | OpenClaw配置 |
| `/home/cwh/.openclaw/workspace/` | 工作空间（memory、knowledge等） |

---

## 注意事项

1. **CUDA版本**: 系统安装了11.1/11.3/11.7三个版本，默认使用11.1
2. **nvcc使用**: 需要手动配置PATH: `export PATH=/usr/local/cuda/bin:$PATH`
3. **显卡驱动**: 580.x 较新，支持最新CUDA (理论上支持到CUDA 12.x)
4. **PyTorch版本**: 1.10较旧，如需新特性（如compile、flex attention）需升级
5. **磁盘空间充足**: /home 分区还有441GB可用
6. **多CUDA版本**: 可根据项目需求切换不同CUDA版本

---

*最后更新: 2026-02-25*
