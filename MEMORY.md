# MEMORY.md - Long-Term Memory

*This is your curated memory. Write significant events, decisions, context, things to remember.*

---

## 关于 Weihang

**基本信息**
- 姓名: Weihang
- 职业: DJI 计算机视觉科学家
- 性格类型: INTJ
- 时区: 中国 (GMT+8)
- GitHub: ahangchen (https://github.com/ahangchen)
- 邮箱: cweihang@foxmail.com

**工作风格**
- 重视简单高效 - 用简单等效任务替换复杂任务
- 追求简洁 - 用更少的变化达到目标
- 注重质量 - 彻底的自测试

**技术栈**
- PyTorch + CUDA
- 3D深度学习
- SDF (符号距离函数) 训练
- 多GPU训练 (双GPU配置)
- Git版本控制

**主要项目**
- 项目目录: `/home/cwh/coding/former3d`
- 主要模型: 3DFormer, SDFFormer
- 核心技术: 流式训练、显式投影、特征对齐

---

## 重要里程碑

### 2026-03-02: Spatial AGI 每日研究系统建立
- **创建Research Skill**: spatial-agi-research技能（完善版）
- **首次研究**: 分析10篇最新论文，创建完整的研究文档
- **定时任务**: 每天凌晨3点自动执行研究任务
- **产出**:
  - 10篇论文介绍文档
  - 1篇深度思考文档
  - 研究技能和自动化脚本
  - 完整示例文档（1,542行）
- **核心发现**:
  - 数据策略 > 模型架构
  - 显式表示 > 潜在学习
  - 多模态融合 > 单一模态
  - 效率优化 > 精度提升
- **目录**: `/home/cwh/coding/auto_blog/spatial_agi/`
- **完善内容**:
  - 必须使用research-assistant技能
  - 必须使用NotebookLM询问13+个问题（7标准+6 Spatial AGI+自由）
  - 必须创建详细markdown文档（至少500行）
  - 完整的NotebookLM问答记录

### 2026-02-08: SDF训练成功
- SimpleSDFModel (198K参数) 训练完成
- 最佳验证损失: 0.066599 (下降69.6%)
- 训练时长: 6秒
- 数据集: abandonedfactory_sample_P001序列, 4帧, 32×32×24体素
- 保存检查点: 7个

### 2026-02-14: 代码清理优化
- 删除冗余代码约468行
- 清理内容:
  - PoseProjection类 (251行)
  - _create_legacy_state方法 (79行)
  - lightweight_state_mode相关代码 (50行)
  - extract_historical_features简化 (30行)
- 改进点:
  - 状态管理简化
  - 错误处理改进
  - 保留fusion_3d网络

### 2026-02-14: 知识库机制建立
- 创建 `knowledge/` 目录用于存储持久知识
- 实现自动知识提取（每8小时）
- 实现自动知识清理（每周五晚12点）
- 知识分类:
  - technical_decisions.md - 技术决策
  - problem_solutions.md - 问题解决方案
  - lessons_learned.md - 经验教训
  - code_patterns.md - 代码模式
  - tools_config.md - 工具配置
  - workflow_processes.md - 工作流程
- Cron任务:
  - knowledge-extract: 每8小时提取知识
  - knowledge-cleanup: 每周五清理过期信息
- 规则写入HEARTBEAT.md，执行任务时主动查询knowledge

### 2026-02-24: 知识提取源改进
- **问题**: 从memory文件提取知识，内容有限（主要是例行监控）
- **改进**: 改为从会话上下文中提取知识
  - 使用 sessions_list 获取近期会话
  - 使用 sessions_history 获取对话历史
  - 重点提取：技术决策、问题解决、代码模式等
  - 过滤：cron任务、heartbeat、例行监控
- **优势**: 会话上下文包含更丰富的技术讨论和问题解决过程

---

## 技术决策与问题解决

### Batch Size问题 (2026-02-10)
**问题**: 训练中batch size被意外拆分至1
- 错误: `ValueError: Expected more than 1 value per channel when training, got input size torch.Size([1, 128])`

**根本原因**:
- `global_avg`中使用`torch.cat`创建5D张量
- BatchNorm只接受2D/3D输入
- 稀疏张量与密集张量维度不匹配

**解决方案**:
- 使用`BatchNorm2d`或`BatchNorm3d`
- 保持batch_size=4, 双GPU配置
- 确保张量维度正确

### 代码架构优化
**显式投影模式**:
- 使用`PoseAwareFeatureProjector`替代`PoseProjection`
- 删除未使用的`_create_legacy_state`方法
- 移除`lightweight_state_mode`模式

**状态管理**:
- 总是创建`dense_grids`
- 总是保存`dense_grids`到状态
- 简化`_create_new_state`逻辑

---

## 工具与配置

### QQ Bot集成
- 主要通过QQ机器人进行交互
- 支持图片发送: `<qqimg>图片路径</qqimg>`
- 格式要求: 本地绝对路径 (png/jpg/jpeg/gif/webp)

### Cron任务
- 使用cron系统进行训练完成提醒
- 按HEARTBEAT.md规则处理优先级
- 需要配置正确的channel target
- **知识库任务**:
  - knowledge-extract: 每8小时自动提取知识
  - knowledge-cleanup: 每周五清理过期信息（90天以上）
- **Spatial AGI研究任务** (新增 2026-03-02):
  - spatial-agi-research: 每天凌晨3点执行
  - 自动搜索arXiv论文
  - 生成论文介绍和深度思考
  - 保存到 `/home/cwh/coding/auto_blog/spatial_agi/`

### Git工作流
- 定期commit: 每完成一个小任务
- 提交信息: feat/fix/docs/clear前缀
- 详细文档保存在`doc/`目录

---

## 开发原则

1. **代码质量优先**
   - 删除冗余代码
   - 保持逻辑清晰
   - 彻底测试

2. **文档驱动**
   - 重要决策记录在doc目录
   - 代码注释说明意图
   - MEMORY.md维护长期记忆

3. **简洁高效**
   - 用简单方法解决问题
   - 避免过度设计
   - 优先等效替换而非复杂实现

4. **知识库驱动**
   - 执行任务前先查询knowledge目录
   - 将重要决策和解决方案记录到知识库
   - 定期更新和清理过时信息

---

## 待改进事项

- [ ] 继续优化训练流程和代码结构
- [ ] 探索更高效的SDF训练方法

---

*最后更新: 2026-02-14*
