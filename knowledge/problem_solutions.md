# 问题解决方案 - 2026-03-12

## Subagent网络错误

**问题**: Subagent反复遇到network_error

**现象**:
- TiPToP: 网络错误失败（已重试2次）
- CourtSI: 网络错误失败（已尝试1次）

**根本原因**:
1. NotebookLM CLI连接超时
2. 网络不稳定
3. 资源竞争

**解决方案**:

**方案1: 重试机制**
- 立即重试（等待1-2分钟）
- 最多重试3次
- 记录失败时间

**方案2: 切换到GLM WebReader**
- NotebookLM失败时使用
- 直接基于arXiv HTML分析
- 不依赖NotebookLM索引

**方案3: 主session分析**
- Subagent反复失败时
- 在主session中直接分析
- 避免Subagent网络问题

**最佳实践**:
- 优先使用NotebookLM（质量高）
- 失败时快速切换（不浪费时间）
- 记录失败原因（便于分析）

---

## spatial-agi-research任务跳过论文分析

**问题**: 任务只生成了思考，跳过了论文分析

**现象**:
- 2026-03-12任务只生成272行思考
- 没有论文分析文档
- Git提交不完整

**根本原因**:
1. 执行顺序调整（思考优先）
2. 系统错误报告思考文档写入失败（实际成功）
3. 任务中断，论文分析步骤未执行

**解决方案**:

**调整执行顺序**（已实施）:
- 原顺序：思考 → 论文 → Git
- 新顺序：论文 → 思考 → Git
- 版本：v6.3 → v6.4

**增加完成度检查**:
- 检查昨天论文数量（应有5篇）
- 检查思考行数（应>200行）
- 未完成时先补充

**优先级调整**:
- 论文 > 思考（论文是核心产出）
- 确保论文分析一定完成

**更新位置**:
- SKILL.md: 更新执行顺序说明
- cron/jobs.json: 更新payload

---

## NotebookLM笔记本来源混乱

**问题**: ReCoSplat笔记本包含8个来源，其中6个是其他论文

**现象**:
- 笔记本ID: a7d7215a-a0d0-4410-a071-2ea3b6cf91ea
- 8个来源（应有2个）
- 6个不相关来源

**根本原因**:
1. NotebookLM CLI的会话管理bug
2. 来源添加时未正确隔离
3. Subagent执行时笔记本复用

**影响评估**:
- ✅ 文档质量很高（902、1006、1767行）
- ✅ 分析内容完整
- ❌ NotebookLM笔记本不干净
- ❌ 后续问答可能有干扰

**解决方案**:

**选项1: 重新创建笔记本**
- 为每篇论文重新创建
- 只添加正确的来源
- 优点：笔记本干净
- 缺点：需要5-10分钟/篇

**选项2: 手动清理**
- 保留现有文档
- 稍后手动清理来源
- 优点：不影响进度
- 缺点：需要手动操作

**选项3: 忽略笔记本**
- 文档已完整
- NotebookLM只是辅助工具
- 优点：最快
- 缺点：笔记本不干净

**推荐**: 选项2（先完成所有论文，再统一清理）

---

## NotebookLM问答返回空答案

**问题**: ask命令返回空答案

**现象**:
- BEACON: CLI执行成功，但答案为空
- C2FMAE: 同样问题
- 可能需要等待索引完成

**根本原因**:
1. 来源刚添加，索引未完成
2. NotebookLM处理时间不足
3. CLI工具的限制

**解决方案**:

**备选方案1: GLM WebReader MCP**
- 不依赖NotebookLM索引
- 直接分析arXiv HTML
- 快速获取内容

**备选方案2: 基于arXiv摘要分析**
- 深度理解摘要内容
- 结合领域知识
- 生成完整分析

**备选方案3: NotebookLM网页界面**
- 手动访问网页
- 等待索引完成
- 手动询问问题

**最佳实践**:
- 添加来源后等待30秒
- ask失败时立即切换方案
- 记录使用的方法


---

## arXiv API限流处理 (2026-03-13)

**问题**: Spatial AGI研究任务因arXiv API返回HTTP 429错误而中断

**根本原因**:
- 短时间内发送过多请求（6个关键词×3次重试=最多18次请求）
- arXiv限流策略触发，返回429 Too Many Requests
- 原有重试机制等待时间过短（固定5秒）

**解决方案**:
1. **Python脚本改进** (search_arxiv.py):
   - 检测429错误并识别为限流
   - 限流时使用递增等待时间：20s → 40s → 60s
   - 普通错误使用标准等待：5s → 10s → 15s

2. **Bash脚本改进** (spatial_agi_daily_robust.sh):
   - 添加`consecutive_failures`计数器
   - 连续失败≥3次时等待60秒（全局限流）
   - 连续失败<3次时等待10秒
   - 成功后重置计数器
   - 搜索间隔根据失败情况动态调整（5-10秒）

**效果**:
- ✅ 重新执行任务时未再遇到429错误
- ✅ 成功完成86篇论文的搜索和筛选
- ✅ 任务稳定性显著提升

**代码位置**:
- `/home/cwh/.openclaw/workspace/skills/spatial-agi-research/scripts/search_arxiv.py`
- `/home/cwh/.openclaw/workspace/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh`

**适用场景**: 
- arXiv API批量调用
- 任何有速率限制的API调用
- 网络爬虫和批量请求任务

---

## 任务健康检查机制创建 (2026-03-15)

**需求**: 需要一个机制来自动检查定时任务和心跳任务的执行状态，识别失败任务并自动重试

**解决方案**:
1. **创建健康检查脚本** (`~/.openclaw/workspace/scripts/task_health_check.sh`):
   - 检查spatial-agi-research任务（每天凌晨3点）
   - 检查knowledge-extract任务（每8小时）
   - 检查cron任务配置
   - 自动重试失败任务
   - 生成详细健康日志

2. **更新HEARTBEAT.md**:
   - 添加"定时任务健康检查"章节
   - 每8小时自动执行健康检查
   - 失败原因分析和修复建议

3. **创建状态追踪**:
   - `heartbeat-state.json` 记录健康检查时间
   - `task-health-log.md` 记录详细日志

**效果**:
- ✅ 自动检测今天spatial-agi-research任务失败
- ✅ 自动重试并成功完成
- ✅ 发现cron任务配置问题并记录

**适用场景**:
- 定时任务监控
- 自动化运维
- 任务失败自动恢复

---

## JSON多数组解析失败修复 (2026-03-15)

**问题**: spatial-agi-research脚本的论文筛选步骤失败，错误：`JSON解析失败: Extra data: line 228 column 1`

**根本原因**:
- Bash脚本使用`>>`追加9次搜索结果到同一文件
- 每次搜索生成一个独立JSON数组
- 文件包含9个JSON数组：`[...][...][...]...`
- Python脚本`spatial_agi_filter_papers.py`期望单个JSON数组
- 在遇到第二个数组时解析失败

**解决方案**:
修改`spatial_agi_daily_robust.sh`的搜索逻辑：

```bash
# 旧代码（有问题）
for keyword in "${KEYWORDS[@]}"; do
    python3 search_arxiv.py "all:$keyword" 15 >> "$PAPERS_RAW_FILE"
done

# 新代码（已修复）
TEMP_DIR=$(mktemp -d)
search_index=0

for keyword in "${KEYWORDS[@]}"; do
    python3 search_arxiv.py "all:$keyword" 15 > "$TEMP_DIR/search_${search_index}.json"
    ((search_index++))
done

# 合并所有搜索结果为一个JSON数组
jq -s 'add' "$TEMP_DIR"/*.json > "$PAPERS_RAW_FILE"
rm -rf "$TEMP_DIR"
```

**效果**:
- ❌ 修复前：论文筛选失败，0篇新论文
- ✅ 修复后：成功筛选，找到15篇新论文，跳过64篇重复

**关键改进**:
1. 使用临时目录存储每次搜索结果
2. 使用`jq -s 'add'`合并多个JSON数组
3. 清理临时文件避免磁盘占用

**代码位置**:
- `/home/cwh/.openclaw/workspace/skills/spatial-agi-research/scripts/spatial_agi_daily_robust.sh` (第100-157行)

**适用场景**:
- 多次API调用结果合并
- JSON数据处理
- Bash脚本中的数据聚合
