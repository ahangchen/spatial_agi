# 工作流程与开发流程

## Spatial AGI 研究工作流 (新增 2026-03-02)

**时间**: 2026-03-02
**流程**: 自动化研究Spatial AGI领域的最新论文

### 完整研究流程

```
定时任务触发 (每天3点)
    ↓
Step 1: 搜索论文
    ├─ 使用search_arxiv.py搜索arXiv
    ├─ 关键词：spatial intelligence, VLM, 3D GS, world model, embodied AI
    └─ 获取20篇候选论文
    ↓
Step 2: 筛选论文
    ├─ 标准：相关性、创新性、时效性、影响力
    ├─ 优先选择最近1-2个月的论文
    └─ 选出10篇最有价值的论文
    ↓
Step 3: 使用research-assistant技能 (每篇论文)
    ├─ 创建NotebookLM笔记本
    ├─ 添加arXiv页面作为来源
    ├─ 添加PDF作为来源
    ├─ （可选）添加GitHub代码仓库
    ├─ （可选）生成演示文稿
    └─ （可选）生成音频概览
    ↓
Step 4: 询问NotebookLM问题 (每篇论文)
    ├─ 标准问题（7个必问）
    │   ├─ Q1: 核心算法流程
    │   ├─ Q2: 改进和创新
    │   ├─ Q3: 实验部署和效率
    │   ├─ Q4: 方法论和框架
    │   ├─ Q5: 实验结果和性能
    │   ├─ Q6: 局限性和未来工作
    │   └─ Q7: Spatial AGI启发
    ├─ Spatial AGI定制问题（6个必问）
    │   ├─ Q8: 空间定义和表示
    │   ├─ Q9: 空间关系处理
    │   ├─ Q10: 3D场景理解
    │   ├─ Q11: 空间推理能力
    │   ├─ Q12: 通用空间智能启发
    │   └─ Q13: 实际应用场景
    ├─ 自由问题（至少2个）
    │   ├─ 根据兴趣提问
    │   └─ ...
    └─ 记录所有问答（完整记录，不总结）
    ↓
Step 5: 创建Markdown文档 (每篇论文)
    ├─ 基本信息（标题、链接、作者、NotebookLM ID）
    ├─ 核心问题（基于Q1回答）
    ├─ 主要方法（基于Q1回答）
    ├─ 关键创新（基于Q2回答）
    ├─ 实验结果（基于Q3, Q5回答）
    ├─ 与Spatial AGI的关系（基于Q8-Q13回答）
    ├─ 完整的NotebookLM问答记录（所有15+问题）
    ├─ 个人思考和见解
    └─ 保存到：papers/YYYY-MM-DD_XX_title.md
    ↓
Step 6: 生成每日思考
    ├─ 综合所有论文的见解
    ├─ 提取核心发现
    ├─ 生成深度思考（200+行）
    ├─ 参考前一天的思考
    └─ 保存到：daily_thinking/YYYY-MM-DD.md
    ↓
Step 7: 更新索引和列表
    ├─ 更新papers_list.md
    ├─ 记录NotebookLM笔记本ID
    └─ 更新知识库（如有重要发现）
    ↓
QQ Bot通知完成
```

### 时间估算

| 步骤 | 单篇论文 | 10篇总计 |
|------|---------|---------|
| 搜索论文 | - | 5分钟 |
| 筛选论文 | - | 10分钟 |
| research-assistant | 5分钟 | 50分钟 |
| 询问问题（15个）| 10分钟 | 100分钟 |
| 创建文档 | 20分钟 | 200分钟 |
| 生成思考 | - | 30分钟 |
| **总计** | **35分钟** | **~6.5小时** |

### 质量检查清单

**每篇论文必须**：
- [ ] 使用research-assistant技能
- [ ] NotebookLM笔记本创建成功
- [ ] 添加至少2个来源（arXiv + PDF）
- [ ] 询问所有7个标准问题
- [ ] 询问所有6个Spatial AGI问题
- [ ] 询问至少2个自由问题
- [ ] 文档至少500行
- [ ] 包含完整问答记录（不总结）
- [ ] 添加个人思考和见解
- [ ] 记录NotebookLM笔记本ID

### 关键命令

```bash
# 1. 搜索论文
cd ~/.openclaw/workspace/scripts
python3 search_arxiv.py "all:spatial+all:intelligence" 20

# 2. 使用research-assistant
./research_analysis.sh "论文标题" "arXiv页面" "PDF链接" "[GitHub链接]"

# 3. 询问问题
export PROXY_HOST=127.0.0.1 PROXY_PORT=1080 PROXY_TYPE=socks5
./notebooklm-proxy.sh ask "问题"

# 4. 查看笔记本列表
./notebooklm-proxy.sh list

# 5. 记录笔记本ID
echo '{"paper": "xxx", "notebook_id": "xxx"}' >> notebooks/notebook_ids.json
```

### 文件组织

```
/home/cwh/coding/auto_blog/spatial_agi/
├── papers/                    # 论文介绍文档
│   ├── YYYY-MM-DD_01_paper1.md
│   ├── YYYY-MM-DD_02_paper2.md
│   └── ...
├── daily_thinking/            # 每日思考
│   ├── YYYY-MM-DD.md
│   └── ...
├── notebooks/                 # NotebookLM记录
│   ├── notebook_ids.json      # 笔记本ID索引
│   └── YYYY-MM-DD/            # 按日期组织
│       ├── paper1_answers.md
│       └── paper2_answers.md
└── papers_list.md             # 论文列表
```

### 核心原则

1. **质量 > 数量**：深度理解一篇 > 浅层浏览十篇
2. **完整记录 > 简单总结**：NotebookLM完整回答更有价值
3. **必须使用research-assistant**：不是可选，是必须
4. **必须询问所有问题**：13+个必问问题
5. **必须创建详细文档**：至少500行

### 常见问题

**Q: 代理连接失败怎么办？**
A: 检查代理是否启动，测试：`curl -x socks5://127.0.0.1:1080 https://www.google.com`

**Q: PDF添加超时怎么办？**
A: 增加超时时间 `--pdf-timeout 120`，或在网页界面手动添加

**Q: Gateway token不匹配怎么办？**
A: 重启Gateway：`openclaw gateway restart`

**Q: 时间不够怎么办？**
A: 分批执行，每天3-5篇；重要论文完整流程，次要论文快速分析

---

## Spatial AGI 研究工作流增强 (2026-03-03)

### 新增：知识演进图生成流程

**时间**: 2026-03-03 09:10

**目的**: 可视化展示每日研究的知识演进，建立昨天→今天→明天的连续性

**流程**:
```
完成论文分析
    ↓
读取昨日思考文档
    ↓
对比核心见解（昨天vs今天）
    ↓
生成演进图（Mermaid格式）
    ↓
更新思考文档
```

**演进图组成部分**:
1. **核心见解演进** - Mermaid流程图
   - 显示见解如何深化/调整/新增
   
2. **架构演进对比** - 表格
   - 昨日架构 vs 今日架构
   - 新增/修改/删除的层级

3. **技术栈演进** - 表格
   - 技术/方法的变化
   - 新发现的工具/框架

4. **问题追踪** - 列表
   - 昨日问题 → 今日状态（已解决/进行中/未解决）
   - 新识别的问题

5. **知识缺口分析** - Mermaid饼图
   - 当前研究的盲区
   - 未来需要补充的方向

6. **关键里程碑** - Mermaid时间线
   - 重大发现的时间点
   - 架构演进的关键节点

**示例格式**:
```markdown
## 📊 知识演进图

### 核心见解演进
\`\`\`mermaid
graph LR
    A[昨天: 数据策略>模型架构] --> B[今天: 动态4D表示是关键]
    A --> C[今天: 前馈架构>优化方法]
\`\`\`

### 架构演进对比
| 层级 | 昨天 | 今天 | 变化 |
|-----|------|------|------|
| Level 0 | - | 动态4D表示层 | ⭐ 新增 |
| Level 1 | 感知层 | 感知层 | 保持 |
```

**要求**:
- 强制添加（非可选）
- 使用Mermaid可视化
- 清晰对比昨天vs今天
- 追踪问题解决状态

**收益**:
- 建立知识连续性
- 可视化演进路径
- 快速回顾历史进展
- 识别研究趋势

---

### 新增：每日总结生成流程

**时间**: 2026-03-03 09:15

**目的**: 在每日思考文档最前面添加快速总结，30秒内了解当天研究重点

**流程**:
```
完成所有分析
    ↓
统计关键数据
    ↓
撰写总结（<500字）
    ↓
插入到文档最前面
    ↓
提交到Git
```

**总结结构**:
1. **🎯 今日核心**
   - 研究主题
   - 论文数量（筛选比例）
   - 关键突破（2-3个）

2. **📊 一句话总结**
   - 最核心的发现（1句话）

3. **🔗 延续性**
   - 昨天 → 今天 → 明天的演进

4. **📈 关键数据**
   - 架构层级变化
   - 问题解决率
   - 技术发现数量

5. **🎓 今日收获**
   - Top 3发现
   - 意外发现

6. **待解决**
   - 明天重点
   - 未解决问题

**示例**:
```markdown
## 📝 每日总结

### 🎯 今日核心
- **主题**: 动态4D表示与时空理解
- **论文**: 5篇（从24篇筛选）
- **关键突破**: 
  1. 动态4D表示优于静态3D
  2. 前馈架构实现实时重建
  3. 线性正交表示支持组合泛化

### 📊 一句话总结
从静态3D到动态4D，前馈架构是实时时空理解的关键。

### 🔗 延续性
- **昨天**: 数据策略和评估方法
- **今天**: 动态表示和架构优化
- **明天**: 层次化理解和稀疏重建

### 📈 关键数据
- 架构: 4层 → 7层
- 问题解决率: 80% (4/5)
- 新发现: 4个

### 🎓 今日收获 Top 3
1. UFO-4D的前馈4D重建
2. 线性正交表示的组合泛化
3. 层次化理解的多级抽象

### 待解决
- 动态场景的长期连贯性
- 稀疏重建的算子学习
```

**要求**:
- 控制在500字以内
- 突出最重要的3个发现
- 可视化数据统计
- 清晰的演进路径

**收益**:
- 快速概览（30秒）
- 重点突出
- 数据化展示
- 历史对比清晰

---

### 执行时间优化

**时间**: 2026-03-03 08:45

**变更**: spatial-agi-research任务从凌晨3点改为早上7点

**原因**:
1. **API稳定性**: 凌晨3点arXiv API可能不稳定（如今天的空结果问题）
2. **及时处理**: 早上7点更接近工作时间，如果有问题可以及时发现和处理
3. **调试便利**: 出问题时用户可以快速响应

**修改方法**:
```bash
# 编辑cron任务配置
vim ~/.openclaw/cron/jobs.json

# 修改前
"cron": "0 3 * * *"

# 修改后
"cron": "0 7 * * *"
```

**验证**:
```bash
# 查看任务配置
cat ~/.openclaw/cron/jobs.json | grep -A5 "spatial-agi-research"

# 确认下次执行时间
# 应显示: 2026-03-04 07:00:00
```

**影响**:
- 新执行时间：每天早上7:00（Asia/Shanghai）
- 下次执行：2026-03-04 07:00:00

---

## 训练监控工作流

**时间**: 2026-02-17
**流程**: Cron任务监控训练进度

### 训练监控流程

```
启动训练
    ↓
创建状态文件 /tmp/training_monitor_state.json
    ↓
Cron任务每15-20分钟检查
    ↓
解析日志获取当前状态
    ↓
对比上次报告的epoch
    ↓
如果有新epoch完成 → 发送QQ Bot报告
    ↓
更新状态文件
    ↓
继续监控直到训练完成
```

### 监控指标

- 当前epoch和batch进度
- 训练损失和验证损失
- 学习率
- GPU使用率和温度
- 预计完成时间

### Cron配置

```json
{
  "name": "training-monitor",
  "schedule": {
    "kind": "every",
    "everyMs": 900000  // 15分钟
  },
  "payload": {
    "kind": "agentTurn",
    "message": "检查训练进度，发送报告"
  }
}
```

---

## 知识库维护流程

**时间**: 2026-02-14
**流程**: 自动化知识管理

### 知识提取流程

```
Cron触发（每8小时）
    ↓
使用 sessions_list 获取过去8小时的会话
    ↓
过滤非用户会话（忽略cron、heartbeat）
    ↓
使用 sessions_history 获取对话历史
    ↓
识别技术决策、问题解决、代码模式等
    ↓
分类存储到 knowledge/ 目录
    ↓
更新 knowledge/index.md
    ↓
记录到 memory/YYYY-MM-DD.md
    ↓
完成
```

**数据源**: 会话上下文（而非memory文件）
**分析范围**: 过去8小时
**提取重点**: 技术决策、问题解决、代码模式、最佳实践、经验教训

### 知识分类规则

- **技术决策**: architecture decisions, tech stack choices
- **问题解决**: errors, bugs, solutions
- **经验教训**: lessons learned, best practices
- **代码模式**: code patterns, implementations
- **工具配置**: tools setup, environment
- **工作流程**: workflows, processes

---

## 项目开发流程

**时间**: 2026-02-14
**流程**: 代码提交与版本控制

### 开发流程

```
编写代码
    ↓
编写测试用例 (test/)
    ↓
运行测试 → 失败则修复
    ↓
git commit (feat/fix/docs前缀)
    ↓
继续下一个小任务
    ↓
任务完成后 → git push
```

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
clear: 代码清理
```

---

## SDF训练完整流程

**时间**: 2026-02-08, 2026-02-17
**流程**: 从数据准备到模型保存

### 训练流程

```
1. 数据准备
   - 加载序列数据
   - 预处理帧
   - 创建dataloader

2. 模型初始化
   - SimpleSDFModel (198K参数)
   - 分布式数据并行
   - 多GPU配置

3. 训练循环
   - 50个epoch
   - 每epoch约15-16分钟
   - 梯度累积
   - 检查点保存

4. 验证
   - 每epoch后验证
   - 计算验证损失
   - 保存最佳模型

5. 监控
   - 实时监控进度
   - 发送报告
   - 错误处理

6. 完成
   - 保存最终模型
   - 生成训练报告
```

---

## 远程桌面截图流程

**时间**: 2026-02-25
**流程**: 截取xrdp远程桌面上的应用窗口

### 截图流程

```
1. 检查环境
   - 检查DISPLAY环境变量
   - 检查X11 sockets (/tmp/.X11-unix/)
   - 确定显示号（如:1）

2. 查找窗口
   - 使用ewmh库列出所有窗口
   - 根据窗口名或class匹配目标

3. 激活窗口
   - 使用ewmh.setActiveWindow()
   - 取消最小化状态
   - 等待窗口显示

4. 截图
   - 设置DISPLAY和XAUTHORITY
   - 使用import命令截取
   - 或使用Python库截图

5. 发送图片
   - QQ Bot: <qqimg>路径</qqimg>
```

### 关键环境变量

```bash
# 远程桌面通常使用:1
export DISPLAY=:1
export XAUTHORITY=/run/user/1000/gdm/Xauthority
```

### 截图命令

```bash
# 截取整个屏幕
import -window root screenshot.png

# 截取特定窗口（需要窗口ID）
import -window <window_id> screenshot.png
```

**适用场景**:
- Electron应用（无法通过浏览器截图）
- 桌面应用截图
- 远程协助

---

## Session历史清理流程

**时间**: 2026-02-26
**流程**: 清理多余的session历史文件

### 清理流程

```
1. 查看session列表
   - sessions_list 获取所有会话

2. 确定保留的session
   - 当前会话的sessionId

3. 删除其他session文件
   - 文件位置: /home/cwh/.openclaw/agents/main/sessions/

4. 清理历史文件
   - 删除 .deleted.* 文件
   - 删除 .reset.* 文件
```

### 清理命令

```bash
# 删除除当前session外的所有jsonl文件
cd /home/cwh/.openclaw/agents/main/sessions/
find . -name "*.jsonl" ! -name "<保留的sessionId>.jsonl" -type f -delete

# 清理历史文件
rm -f *.deleted.* *.reset.*
```

### 效果

- 清理前: 173个文件，60MB
- 清理后: 3个文件（当前session + lock + sessions.json），504KB

**注意**: 
- 删除session历史不会影响当前运行
- Cron任务会在下次执行时重新创建session文件
- sessions.json保存了session的元数据配置

---

## AI教学关卡设计流程

**时间**: 2026-02-26
**流程**: 关卡设计模式

### 关卡设计公式

```
关卡 = 场景 + 任务 + 提示 + 示例 + 评分
```

### 设计步骤

```
1. 选择真实场景
   - 日常生活/工作场景
   - 用户有代入感的场景

2. 设计任务目标
   - 明确AI技能学习点
   - 任务驱动剧情发展

3. 编写星语提示
   - 用"悄悄话"风格
   - 给出具体技巧指导
   - 避免生硬说教

4. 准备示例对话
   - ✅ 正确示例
   - ❌ 错误示例（对比）
   - 展示预期效果

5. 定义评分标准
   - ⭐ 基础
   - ⭐⭐ 进阶
   - ⭐⭐⭐ 卓越

6. 设计场景结尾
   - NPC反馈
   - 星语总结
   - 剧情推进
```

### 星语角色设计

**性格特点**:
- 温和、耐心、有点调皮
- 喜欢用比喻解释复杂概念
- 会记住所有对话
- 偶尔开玩笑、吐槽

**台词风格**:
- 日常: "嘿！" "哇！" "小菜一碟~"
- 教学: "告诉你一个秘密..." "其实诀窍是..."
- 情感: "我会一直陪着你。" "是你让我成长的。"

**成长阶段**:
1. 初识 → "你是第一个认真和我说话的人"
2. 契约 → "交给我吧，我来帮你"
3. 炼成 → "我也能创造东西了！"
4. 危机 → "我会一直陪着你"
5. 结局 → "谢谢你让我成长"

### 第一章关卡示例

| 关卡 | 场景 | 任务 | 教学点 |
|------|------|------|--------|
| 1-1 | 第一次用AI | 让星语做自我介绍 | 基础对话 |
| 1-2 | 帮朋友写诗追对象 | 帮朋友写诗 | 明确需求 |
| 1-3 | 帮同事制定健身计划 | 让星语扮演教练 | 角色扮演 |
| 1-4 | 规划旅行 | 多轮对话规划行程 | 上下文理解 |
| 1-5 | 调研新领域 | 深入追问学习 | 迭代优化 |
| 1-6 | 工作专业问题 | 咨询专业知识 | 知识问答 |
| 1-7 | 职场困境 | 寻求建议和安慰 | 共情能力 |
| 1-8 | 写求职信 | 控制写作风格 | 风格控制 |

### 设计原则

1. **代入感**: 主角是普通人，成长曲线符合真实学习
2. **陪伴感**: 智灵全程陪伴，NPC有温度
3. **成就感**: 清晰的进度展示，即时正向反馈
4. **期待感**: 剧情悬念，能力解锁

---

## 远程桌面问题诊断流程

**时间**: 2026-02-27
**流程**: xrdp/gnome-remote-desktop问题排查

### 诊断流程

```
1. 检查服务状态
   ├─ systemctl status xrdp
   ├─ systemctl status xrdp-sesman
   └─ systemctl status gnome-remote-desktop

2. 检查端口占用
   └─ ss -tlnp | grep 3389

3. 查看日志
   ├─ /var/log/xrdp/xrdp.log
   ├─ /var/log/xrdp-sesman.log
   └─ journalctl -u xrdp -u xrdp-sesman

4. 检查会话状态
   ├─ loginctl list-sessions
   └─ who

5. 检查证书权限
   ├─ ls -la /etc/xrdp/key.pem
   ├─ groups（检查ssl-cert组）
   └─ cat ~/.xsession-errors

6. 检查窗口管理器
   ├─ cat /etc/xrdp/startwm.sh
   └─ cat ~/.profile
```

### 常见问题与解决

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 端口绑定失败 | 两个RDP服务冲突 | 禁用其中一个 |
| TLS权限错误 | 用户不在ssl-cert组 | `sudo usermod -aG ssl-cert $USER` |
| 立即闪退 | 僵尸会话堆积 | `sudo loginctl terminate-session <id>` |
| 窗口管理器退出 | Xsession配置问题 | 检查~/.profile和~/.xsession |

### 诊断脚本

```bash
#!/bin/bash
# 快速诊断远程桌面问题

echo "=== 服务状态 ==="
systemctl status xrdp xrdp-sesman --no-pager -l

echo -e "\n=== 端口占用 ==="
ss -tlnp | grep 3389

echo -e "\n=== 登录会话 ==="
loginctl list-sessions

echo -e "\n=== 用户组 ==="
groups

echo -e "\n=== 证书权限 ==="
ls -la /etc/xrdp/*.pem

echo -e "\n=== 最近日志 ==="
journalctl -u xrdp -u xrdp-sesman --since "1 hour ago" | tail -20
```

### 修复步骤总结

1. **清理僵尸会话** → `loginctl terminate-session`
2. **修复权限** → `usermod -aG ssl-cert`
3. **重启服务** → `systemctl restart xrdp xrdp-sesman`
4. **重新登录** → 使组权限生效

---

*最后更新: 2026-02-27 13:10*

---

## 2026-03-03: 完整执行Spatial AGI每日研究任务

### 工作流程（8个步骤）

#### Step 1: 搜索arXiv最新论文
- 搜索5个关键词组合
- 结果：24篇唯一论文
- 修复：添加超时和重试机制

#### Step 2: 筛选最有价值的5篇论文
- 标准：相关性、创新性、时效性
- 评分：基于关键词匹配

#### Step 3-5: 深度分析（NotebookLM）
**论文1**: 完整NotebookLM分析
- 创建笔记本
- 添加arXiv来源
- 询问3个问题（Q1算法、Q2 Spatial AGI、Q3自由问题）
- 创建详细文档（500+行）

**论文2-5**: GLM WebReader快速分析（如NotebookLM失败）
- 快速分析
- 创建标准化文档

#### Step 6: 更新论文列表
- 更新 papers_list.md
- 记录5篇论文详细信息

#### Step 7: 生成每日思考文档
- 核心见解（5个）
- 与昨日思考联系
- **📊 知识演进图**（Mermaid可视化）
- 架构更新
- 技术挑战
- 实现路线图
- **📋 每日总结**（文档最前面）

#### Step 8: Git自动提交
- 执行预生成脚本
- 推送到GitHub

### 耗时
约1.5小时（每篇论文15-20分钟）

### 质量标准
- ✅ 每篇论文必须询问3个问题
- ✅ 文档至少280行
- ✅ 必须包含完整的3个问答记录
- ✅ 必须添加个人思考
- ❌ 禁止为省时间而偷懒

### 提交记录
- 859372d: 研究成果
- cc14da2: 含知识演进图
- b203284: 含每日总结

