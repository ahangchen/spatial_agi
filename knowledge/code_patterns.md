# 代码模式与实现方式

## 分布式训练模式

**时间**: 2026-02-08, 2026-02-17
**相关代码**: `distributed_utils.py`

### 多GPU配置

```python
# GPU配置
batch_size = 4  # 总batch size
num_gpus = 2
batch_size_per_gpu = batch_size // num_gpus

# 初始化分布式环境
torch.distributed.init_process_group(
    backend='nccl',
    init_method='env://'
)
```

### 梯度累积模式

```python
# 梯度累积配置
gradient_accumulation_steps = 4

# 训练循环
for i, batch in enumerate(dataloader):
    loss = model(batch)
    loss = loss / gradient_accumulation_steps
    loss.backward()
    
    if (i + 1) % gradient_accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

---

## 特征投影模式

**时间**: 2026-02-14
**相关代码**: 显式投影模式

### PoseAwareFeatureProjector

```python
class PoseAwareFeatureProjector:
    def __init__(self, feature_dim, grid_dim):
        self.feature_dim = feature_dim
        self.grid_dim = grid_dim
    
    def project(self, features, poses):
        # 显式投影特征到3D网格
        # 使用pose信息进行对齐
        pass
```

**优势**:
- 显式状态管理
- 易于调试
- 避免隐式依赖

---

## SDF训练模式

**时间**: 2026-02-08
**相关代码**: SimpleSDFModel

### SDF损失计算

```python
class SimpleSDFModel(nn.Module):
    def forward(self, points, gt_sdf):
        # 预测SDF值
        pred_sdf = self.network(points)
        
        # SDF损失
        sdf_loss = F.l1_loss(pred_sdf, gt_sdf)
        
        return sdf_loss
```

### 流式训练

```python
def train_one_epoch(model, dataloader, optimizer):
    for batch_idx, batch in enumerate(dataloader):
        # 前向传播
        loss = model(batch)
        
        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # 定期保存检查点
        if batch_idx % save_interval == 0:
            save_checkpoint(model, batch_idx)
```

---

## 错误处理模式

**时间**: 2026-02-17
**相关代码**: OOM错误恢复

### 自动重试机制

```python
def train_with_retry(model, dataloader, max_retries=3):
    for batch in dataloader:
        retry_count = 0
        while retry_count < max_retries:
            try:
                loss = model(batch)
                loss.backward()
                optimizer.step()
                break
            except RuntimeError as e:
                if "out of memory" in str(e):
                    torch.cuda.empty_cache()
                    model.reset_history_state()
                    retry_count += 1
                else:
                    raise
```

---

## X11窗口激活模式

**时间**: 2026-02-25
**相关任务**: 远程桌面截图

### 使用python-xlib/ewmh激活窗口

```python
from Xlib import X, display
from ewmh import EWMH

# 连接到X显示
disp = display.Display(':1')
ewmh = EWMH(disp)

# 获取所有窗口
windows = ewmh.getClientList()

# 查找目标窗口
for w in windows:
    name = ewmh.getWmName(w)
    wm_class = w.get_wm_class()
    if 'TargetAppName' in str(name):
        # 激活窗口
        ewmh.setActiveWindow(w)
        ewmh.display.flush()
        # 取消最小化
        ewmh.setWmState(w, 0, '_NET_WM_STATE_HIDDEN', '_NET_WM_STATE_HIDDEN')
        ewmh.display.flush()
        break

disp.close()
```

**依赖**: `pip install python-xlib ewmh`

**注意事项**:
- 需要正确的DISPLAY环境变量
- 可能需要Xauthority权限
- 适用于xrdp远程桌面环境

---

## Agent Skill设计模式

**时间**: 2026-03-01
**相关代码**: `/home/cwh/.openclaw/workspace/ml_skill/`

### Skill目录结构

```
skill_name/
├── SKILL.md                    # 主文件，包含完整工作流程
├── agents/                     # Subagent定义
│   ├── agent1.md
│   └── agent2.md
└── references/                 # 参考文档
```

### Agent文件标准格式

```markdown
---
name: agent-name
description: Agent描述
---

# Agent Name

## 触发时机
- 主会话何时应该委派任务

## 输入
| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| task_type | string | 是 | 任务类型 |

### 输入示例
```json
{"task_type": "xxx", ...}
```

## 输出
| 字段 | 类型 | 说明 |
|------|------|------|

### 输出示例
```json
{...}
```

## 工作流程
ASCII流程图 + 详细步骤

## 注意事项
### ✅ 必须做
### ❌ 禁止做
### ⚠️ 常见错误

## 知识参考
具体知识内容
```

### SKILL.md调用格式

```markdown
使用 XXX subagent
完成 XXXX任务

输入: ...
输出: ...
```

---

*最后更新: 2026-03-01 00:53*
