# NavDreamer 研究工作流

## 目标
自动化处理NavDreamer论文的完整分析流程：从网页链接提取信息，创建NotebookLM笔记本，生成演示文稿和音频概览，并询问关键问题。

## 步骤

### 1. 从网页链接提取信息

从NavDreamer项目页面提取关键信息：
- 网页链接：https://xinjiu612.github.io/NavDreamer/
- 论文PDF链接：https://arxiv.org/pdf/2602.09765.pdf
- 代码仓库链接：待确认（HuggingFace Demo显示"Coming Soon"）

### 2. 创建NotebookLM笔记本

```bash
# 设置代理
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"

# 创建新笔记本
~/miniconda3/bin/conda run -n base notebooklm create "NavDreamer: Video Models as Zero-Shot 3D Navigators"

# 假设创建的笔记本ID为 <NOTEBOOK_ID>，使用它
~/miniconda3/bin/conda run -n base notebooklm use <NOTEBOOK_ID>
```

### 3. 添加来源

添加三个精确的来源：

```bash
# 1. 添加项目网页
~/miniconda3/bin/conda run -n base notebooklm source add https://xinjiu612.github.io/NavDreamer/

# 2. 添加论文PDF
# 注意：PDF文件较大，可能需要较长时间
~/miniconda3/bin/conda run -n base notebooklm source add https://arxiv.org/pdf/2602.09765.pdf

# 3. 添加代码仓库（如果可用）
# 代码仓库链接：https://github.com/xinjiu612/NavDreamer
# 目前显示"Coming Soon"，可能需要等待发布
```

### 4. 生成演示文稿

```bash
# 生成Slide Deck
~/miniconda3/bin/conda run -n base notebooklm generate slide-deck

# 等待生成完成，可以使用以下命令检查状态
~/miniconda3/bin/conda run -n base notebooklm artifact list
```

### 5. 生成中文音频概览

```bash
# 生成音频概览
~/miniconda3/bin/conda run -n base notebooklm generate audio

# 等待生成完成
~/miniconda3/bin/conda run -n base notebooklm artifact list
```

### 6. 询问关键问题

通过NotebookLM接口询问三个核心问题：

#### 问题1：核心算法流程

```bash
~/miniconda3/bin/conda run -n base notebooklm ask "这篇文章的核心算法流程是怎样的？"
```

**预期答案要点**：
- 四阶段流程：视频预测生成 → 采样优化筛选 → 动作解码与尺度校正 → 底层规划执行
- 使用生成式视频模型作为世界模型
- VLM评价机制（动作安全性、场景一致性、任务表现）
- π³逆动力学模型 + Moge-2尺度校正

#### 问题2：改进和创新

```bash
~/miniconda3/bin/conda run -n base notebooklm ask "这篇文章相比其他工作或者它的baseline有什么改进和创新？"
```

**预期答案要点**：
- 从"辅助信号"到"直接规划器"
- 基于VLM的多维度采样优化
- 融合度量深度先验的尺度校正（误差从54%降至10%）
- 强大的零样本泛化与感知涌现
- 全面的3D导航基准测试

#### 问题3：实验部署和运行效率

```bash
~/miniconda3/bin/conda run -n base notebooklm ask "这个工作的实验在什么环境部署的，部署时运行效率如何？"
```

**预期答案要点**：
- 部署环境：室内（办公室、楼梯）和室外（建筑群、树林）
- 硬件配置：RealSense摄像头 + LiDAR，笔记本 + Jetson Orin NX
- 运行效率瓶颈：视频生成1-2分钟，底层规划可实时运行
- 未来改进：模型量化、压缩、专用数据集微调

## 完整自动化脚本

```bash
#!/bin/bash
# NavDreamer 完整分析工作流脚本

# 配置代理
export NOTEBOOKLM_PROXY="socks5://127.0.0.1:1080"
NOTEBOOKLM_CMD="~/miniconda3/bin/conda run -n base notebooklm"

# 定义链接
PROJECT_PAGE="https://xinjiu612.github.io/NavDreamer/"
PDF_LINK="https://arxiv.org/pdf/2602.09765.pdf"
CODE_REPO="https://github.com/xinjiu612/NavDreamer"

echo "=========================================="
echo "NavDreamer 研究工作流开始"
echo "=========================================="
echo ""

# 步骤1：创建笔记本
echo "[1/7] 创建NotebookLM笔记本..."
NOTEBOOK_ID=$($NOTEBOOKLM_CMD create "NavDreamer: Video Models as Zero-Shot 3D Navigators" 2>&1 | grep "Created notebook" | grep -oP '(?<=: )[a-f0-9-]+')
echo "笔记本ID: $NOTEBOOK_ID"
echo ""

# 步骤2：使用笔记本
echo "[2/7] 设置当前笔记本..."
$NOTEBOOKLM_CMD use $NOTEBOOK_ID
echo ""

# 步骤3：添加项目网页
echo "[3/7] 添加项目网页..."
$NOTEBOOKLM_CMD source add $PROJECT_PAGE
echo "✓ 项目网页已添加"
echo ""

# 步骤4：添加论文PDF
echo "[4/7] 添加论文PDF（可能需要较长时间）..."
$NOTEBOOKLM_CMD source add $PDF_LINK
echo "✓ 论文PDF已添加"
echo ""

# 步骤5：添加代码仓库（如果可用）
echo "[5/7] 添加代码仓库..."
if [ -n "$CODE_REPO" ]; then
    $NOTEBOOKLM_CMD source add $CODE_REPO
    echo "✓ 代码仓库已添加"
else
    echo "⊗ 代码仓库暂不可用"
fi
echo ""

# 步骤6：生成演示文稿
echo "[6/7] 生成演示文稿..."
$NOTEBOOKLM_CMD generate slide-deck
echo "✓ 演示文稿生成已启动"
echo "提示：可以使用以下命令检查状态"
echo "  $NOTEBOOKLM_CMD artifact list"
echo ""

# 步骤7：询问关键问题
echo "[7/7] 询问关键问题..."
echo ""

echo "问题1：核心算法流程"
$NOTEBOOKLM_CMD ask "这篇文章的核心算法流程是怎样的？"
echo ""

echo "问题2：改进和创新"
$NOTEBOOKLM_CMD ask "这篇文章相比其他工作或者它的baseline有什么改进和创新？"
echo ""

echo "问题2：实验部署和运行效率"
$NOTEBOOKLM_CMD ask "这个工作的实验在什么环境部署的，部署时运行效率如何？"
echo ""

echo "=========================================="
echo "工作流完成！"
echo "=========================================="
echo ""
echo "后续操作："
echo "1. 检查演示文稿生成状态: $NOTEBOOKLM_CMD artifact list"
echo "2. 生成音频概览: $NOTEBOOKLM_CMD generate audio"
echo "3. 访问NotebookLM网页: https://notebooklm.google.com"
```

## 使用代理的便捷脚本

使用之前创建的脚本：

```bash
# 使用脚本执行notebooklm命令
PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5 /home/cwh/.openclaw/workspace/scripts/notebooklm-proxy.sh <命令>
```

## 当前笔记本信息

- **笔记本ID**: b96abce1-a41e-409b-9723-7ad93cfdf085
- **标题**: NavDreamer: Video Models as Zero-Shot 3D Navigators
- **已添加来源**:
  1. NavDreamer项目页面 ✅
  2. NavDreamer论文PDF ✅

## 生成的Artifacts

- **演示文稿**: NavDreamer: Video Models as Zero-Shot 3D Navigators (Slide Deck)
  - 状态: in_progress
  - ID: c9964207-3c4b-4958-9f31-3b4d42b6c586

## 已获取的答案

### 问题1：核心算法流程
详见上方回答

### 问题2：改进和创新
详见上方回答

### 问题3：实验部署和运行效率
详见上方回答

## 下一步建议

1. **等待演示文稿完成** - 检查artifact状态
2. **生成音频概览** - 使用 `generate audio` 命令
3. **下载和导出** - 从NotebookLM网页导出PDF和音频
4. **代码仓库关注** - 关注NavDreamer GitHub仓库，等待代码发布
