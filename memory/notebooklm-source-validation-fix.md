# NotebookLM 来源验证强制检查 - v6.7

**修复日期**: 2026-03-16 09:40
**严重程度**: 🔴 Critical（导致3个Subagent失败）
**影响范围**: paper-analysis skill + spatial-agi-research skill

---

## 问题描述

### 发现的问题

在2026-03-16的论文分析任务中，发现3个"已完成"的Subagent实际上NotebookLM笔记本里**没有来源**：

```
✅ Subagent显示"完成"
❌ NotebookLM笔记本：无来源
❌ 问答环节：使用fallback方案
❌ 演示文稿/音频：无法生成
```

### 根本原因

1. **来源添加失败** - NotebookLM无法添加arXiv来源（网络/代理/URL限制）
2. **无验证机制** - 没有检查来源是否真的添加成功
3. **直接问答** - 来源添加失败后继续问问题（得到空答案）
4. **假成功** - 使用fallback方案创建文档，标记为"完成"

### 失败的3个Subagent

1. **DreamVideo-Omni** - 无来源，fallback完成
2. **Ψ₀** - 无来源，fallback完成
3. **EndoCoT** - 无来源，fallback完成

---

## 修复方案

### v6.7 关键改进

#### 1. **强制验证来源数量**

```bash
# 提取来源数量
SOURCE_COUNT=$(notebooklm source list -n "$NOTEBOOK_ID" | grep -c "http" || echo "0")

# 必须有≥2个来源
if [ "$SOURCE_COUNT" -lt 2 ]; then
  echo "❌ 错误：来源数量不足（$SOURCE_COUNT < 2）"
  NEED_FALLBACK=true
fi
```

#### 2. **验证PDF链接存在**

```bash
# 检查是否包含PDF链接
if echo "$SOURCE_STATUS" | grep -qi "pdf\|arxiv.org/pdf"; then
  echo "✅ 确认包含PDF链接"
  SOURCES_READY=true
else
  echo "⚠️ 来源不包含PDF链接"
  NEED_FALLBACK=true
fi
```

#### 3. **明确来源状态输出**

```bash
echo "📋 最终来源列表："
notebooklm source list -n "$NOTEBOOK_ID"

# 示例输出：
# ✅ https://arxiv.org/abs/2603.xxxxx
# ✅ https://arxiv.org/pdf/2603.xxxxx
```

#### 4. **Fallback机制**

当来源验证失败时：

```bash
if [ "$SOURCES_READY" = false ]; then
  echo "❌ 来源添加失败或未就绪"
  echo "⚠️ 切换到web_fetch方案"
  NEED_FALLBACK=true
fi
```

---

## 完整验证流程（v6.7）

### Step 1: 创建笔记本
```bash
NOTEBOOK_ID=$(notebooklm create "论文标题" | grep -oP 'Created notebook: \K[a-f0-9-]+')
```

### Step 2: 添加来源（强制--type url）
```bash
# 添加arXiv页面
notebooklm source add -n "$NOTEBOOK_ID" --type url "$ARXIV_URL"

# 添加PDF链接
if notebooklm source add -n "$NOTEBOOK_ID" --type url "$PDF_URL"; then
  echo "✅ PDF链接添加成功"
else
  # Fallback: HTML版本
  HTML_URL=$(echo "$ARXIV_URL" | sed 's|/abs/|/html/|')
  notebooklm source add -n "$NOTEBOOK_ID" --type url "$HTML_URL"
fi
```

### Step 3: 等待处理（最多5分钟）
```bash
MAX_WAIT=300
WAIT_INTERVAL=15
ELAPSED=0
SOURCES_READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
  SOURCE_STATUS=$(notebooklm source list -n "$NOTEBOOK_ID")
  
  if echo "$SOURCE_STATUS" | grep -qiE "processing|pending"; then
    echo "⏳ 来源还在处理中..."
    sleep 15
    ELAPSED=$((ELAPSED + 15))
  else
    # ⚠️ 【关键验证】
    SOURCE_COUNT=$(echo "$SOURCE_STATUS" | grep -c "http" || echo "0")
    
    if [ "$SOURCE_COUNT" -ge 2 ]; then
      echo "✅ 检测到 $SOURCE_COUNT 个来源"
      
      if echo "$SOURCE_STATUS" | grep -qi "pdf"; then
        echo "✅ 确认包含PDF链接"
        SOURCES_READY=true
        break
      fi
    fi
    
    sleep 15
    ELAPSED=$((ELAPSED + 15))
  fi
done
```

### Step 4: 最终验证
```bash
if [ "$SOURCES_READY" = false ]; then
  echo "❌ 来源添加失败"
  echo "📋 最终来源状态："
  notebooklm source list -n "$NOTEBOOK_ID"
  
  # 标记fallback
  NEED_FALLBACK=true
else
  echo "✅ 来源验证通过"
  echo "📋 最终来源列表："
  notebooklm source list -n "$NOTEBOOK_ID"
fi
```

### Step 5: 问答或Fallback

**路径A: NotebookLM成功（SOURCES_READY=true）**
```bash
if [ "$NEED_FALLBACK" != true ]; then
  # 开始NotebookLM问答
  Q1_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "核心算法原理？")
  Q2_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "与Spatial AGI关系？")
  Q3_ANSWER=$(notebooklm ask -n "$NOTEBOOK_ID" "创新点和局限性？")
  
  # 生成演示文稿和音频
  notebooklm generate slide-deck -n "$NOTEBOOK_ID"
  # 生成音频...
fi
```

**路径B: Fallback方案（NEED_FALLBACK=true）**
```bash
if [ "$NEED_FALLBACK" = true ]; then
  echo "🔄 启动Fallback方案"
  
  # 使用web_fetch获取论文内容
  PAPER_CONTENT=$(web_fetch "$ARXIV_URL" extractMode="markdown")
  
  # 手动分析3个问题
  # [AI分析论文内容，回答问题]
  
  # 创建文档（标记fallback方法）
  # ⚠️ 无法生成演示文稿和音频
fi
```

---

## 验证检查清单

在执行论文分析前，必须确认：

### 来源添加阶段
- [ ] 使用`--type url`参数
- [ ] 添加arXiv页面成功
- [ ] 添加PDF链接成功（或HTML fallback）
- [ ] 等待处理完成（2-5分钟）

### 来源验证阶段（v6.7新增）
- [ ] 检查来源数量（≥2个）
- [ ] 确认包含PDF链接
- [ ] 查看source list输出
- [ ] 测试问题验证（可选）

### 问答阶段
- [ ] SOURCES_READY=true
- [ ] NEED_FALLBACK=false
- [ ] 开始正式提问

### Fallback阶段（如果需要）
- [ ] 确认SOURCES_READY=false
- [ ] 设置NEED_FALLBACK=true
- [ ] 使用web_fetch获取内容
- [ ] 手动分析3个问题
- [ ] 文档标记fallback方法

---

## 预期效果

### 修复前（v6.6）
```
❌ 来源添加失败 → 无验证 → 继续问答 → 空答案 → fallback → 假成功
```

### 修复后（v6.7）
```
✅ 来源添加 → 验证数量 → 确认PDF → 真实问答 → 完整文档
   ↓（失败）
   └→ 明确fallback → 手动分析 → 标记方法
```

---

## 统计数据

### 修复前（2026-03-16任务）
- 总任务: 5个
- 成功（NotebookLM）: 2个（40%）
- Fallback（web_fetch）: 3个（60%）
- **问题**: 3个fallback任务标记为"完成"，但无NotebookLM来源

### 预期修复后
- 真实NotebookLM成功率: 明确统计
- Fallback任务: 明确标记
- 无假成功情况

---

## 相关文档

1. `notebooklm-source-requirements.md` - 来源添加强制要求
2. `paper-analysis/SKILL.md` - v1.2（包含验证机制）
3. `spatial-agi-research/SKILL.md` - v6.7（包含验证机制）

---

**维护者**: OpenClaw AI
**修复版本**: v6.7
**下次检查**: 2026-03-17（验证修复效果）
