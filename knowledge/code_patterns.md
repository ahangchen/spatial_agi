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

## 多教师知识蒸馏模式

**时间**: 2026-03-04
**来源**: AM-RADIO论文（CVPR 2024）

### 适配器头设计

```python
class TeacherAdapter(nn.Module):
    """为每个教师设计2层MLP适配器"""
    def __init__(self, teacher_dim, student_dim, hidden_dim=512):
        super().__init__()
        self.summary_head = nn.Sequential(
            nn.Linear(student_dim, hidden_dim),
            nn.GELU(),
            nn.Linear(hidden_dim, teacher_dim)
        )
        self.spatial_head = nn.Sequential(
            nn.Conv2d(student_dim, hidden_dim, 1),
            nn.GELU(),
            nn.Conv2d(hidden_dim, teacher_dim, 1)
        )
    
    def forward(self, student_features):
        # 摘要向量（CLS token）
        summary = self.summary_head(student_features[:, 0])
        # 空间特征图（密集特征）
        spatial = self.spatial_head(student_features[:, 1:].transpose(1, 2))
        return summary, spatial
```

### 多损失函数组合

```python
def distillation_loss(teacher_feat, student_feat):
    # 余弦相似度损失：对齐特征方向
    cos_loss = 1 - F.cosine_similarity(
        teacher_feat, student_feat, dim=-1
    ).mean()
    
    # Smooth L1损失：匹配特征模长
    l1_loss = F.smooth_l1_loss(
        teacher_feat.norm(dim=-1),
        student_feat.norm(dim=-1)
    )
    
    return cos_loss + 0.5 * l1_loss
```

### 分阶段蒸馏策略

```python
# 阶段1: 256px - 学习基础特征
# 阶段2: 432px - 增加细节
# 阶段3: 1024px - 高分辨率优化
resolutions = [256, 432, 1024]

for stage, res in enumerate(resolutions):
    for batch in dataloader[res]:
        # 调整输入分辨率
        images = F.interpolate(batch['images'], size=res)
        
        # 获取教师特征
        with torch.no_grad():
            teacher_feats = [t(images) for t in teachers]
        
        # 学生前向传播
        student_feats = student(images)
        
        # 计算蒸馏损失
        loss = sum(
            distillation_loss(tf, sf)
            for tf, sf in zip(teacher_feats, student_feats)
        )
        
        # 反向传播
        loss.backward()
        optimizer.step()
```

**应用场景**: 融合多个预训练模型的能力到单一模型

**日期**: 2026-03-04 09:17-09:38
**标签**: `#knowledge-distillation` `#multi-teacher` `#vision-models`

---

## E-RADIO混合架构模式

**时间**: 2026-03-04
**来源**: AM-RADIO论文（CVPR 2024）

### CNN + Transformer混合架构

```python
class ERADIOHybrid(nn.Module):
    """E-RADIO混合架构：CNN捕获局部，Transformer捕获全局"""
    def __init__(self):
        super().__init__()
        
        # 输入阶段：4倍下采样
        self.stem = nn.Sequential(
            nn.Conv2d(3, 64, 4, stride=4),
            nn.BatchNorm2d(64),
            nn.GELU()
        )
        
        # 卷积阶段：YOLOv8 C2f块
        self.conv_stage1 = C2fBlock(64, 128)   # 56x56
        self.conv_stage2 = C2fBlock(128, 256)  # 28x28
        
        # Transformer阶段：多分辨率窗口注意力
        self.trans_stage3 = WindowAttention(256, 512)  # 14x14
        self.trans_stage4 = WindowAttention(512, 512)  # 7x7
        
        # 特征融合：反卷积上采样
        self.fusion = nn.ConvTranspose2d(512, 256, 4, stride=2)
    
    def forward(self, x):
        # 输入下采样
        x = self.stem(x)  # 224x224 -> 56x56
        
        # 卷积阶段：局部特征
        x = self.conv_stage1(x)  # 56x56
        x = self.conv_stage2(x)  # 28x28
        
        # Transformer阶段：全局依赖
        x = self.trans_stage3(x)  # 14x14
        x = self.trans_stage4(x)  # 7x7
        
        # 特征融合
        x = self.fusion(x)  # 14x14
        
        return x
```

### 多分辨率窗口注意力（MRA）

```python
class WindowAttention(nn.Module):
    """多分辨率窗口注意力机制"""
    def __init__(self, dim, out_dim, window_sizes=[7, 14]):
        super().__init__()
        self.window_sizes = window_sizes
        self.attentions = nn.ModuleList([
            nn.MultiheadAttention(dim, num_heads=8)
            for _ in window_sizes
        ])
    
    def forward(self, x):
        B, C, H, W = x.shape
        outputs = []
        
        for ws, attn in zip(self.window_sizes, self.attentions):
            # 划分窗口
            windows = partition_windows(x, ws)
            
            # 窗口内注意力
            attn_out = attn(windows, windows, windows)
            
            # 合并窗口
            out = merge_windows(attn_out, H, W)
            outputs.append(out)
        
        # 多分辨率融合
        return sum(outputs) / len(outputs)
```

**优势**:
- 6-10x推理加速
- 保留局部细节和全局上下文
- 适合实时应用

**日期**: 2026-03-04 09:17-09:38
**标签**: `#hybrid-architecture` `#cnn-transformer` `#efficient-inference`

---

## 前后端协同模式（SLAM-Former）

**时间**: 2026-03-04
**来源**: SLAM-Former论文

### 统一Transformer架构

```python
class SLAMFormer(nn.Module):
    """统一Transformer处理前端感知和后端优化"""
    def __init__(self, dim=512):
        super().__init__()
        
        # 共享骨干网络
        self.backbone = TransformerEncoder(dim, num_layers=6)
        
        # 地图标记（隐式状态表示）
        self.map_tokens = nn.Parameter(torch.randn(100, dim))
        
        # 前端：因果注意力（实时增量）
        self.frontend = CausalAttention(dim)
        
        # 后端：全注意力（全局优化）
        self.backend = FullAttention(dim)
        
        # 解码头
        self.point_head = nn.Linear(dim, 3)      # 点云
        self.pose_head = nn.Linear(dim, 7)       # 位姿
        self.confidence_head = nn.Linear(dim, 1)  # 置信度
```

### KV缓存共享机制

```python
class KVCacheManager:
    """管理前后端的KV缓存共享"""
    def __init__(self, max_frames=1000):
        self.cache = {}
        self.max_frames = max_frames
    
    def update_frontend(self, frame_id, key, value):
        """前端增量更新KV缓存"""
        self.cache[frame_id] = (key, value)
        
        # 滚动裁剪（可选）
        if len(self.cache) > self.max_frames:
            oldest = min(self.cache.keys())
            del self.cache[oldest]
    
    def get_backend_cache(self):
        """后端获取全局KV缓存"""
        keys = torch.cat([k for k, v in self.cache.values()])
        values = torch.cat([v for k, v in self.cache.values()])
        return keys, values
```

### 前后端同步执行

```python
def forward_frontend_backend(model, frames, T=10):
    """
    前后端交替执行
    T: 每T个关键帧触发一次后端优化
    """
    for i, frame in enumerate(frames):
        # 前端：实时增量更新
        map_update = model.frontend(
            frame,
            kv_cache=model.kv_manager.get_recent(T)
        )
        model.map_tokens += map_update
        
        # 每T帧触发后端
        if (i + 1) % T == 0:
            # 后端：全局优化
            global_update = model.backend(
                model.map_tokens,
                kv_cache=model.kv_manager.get_backend_cache()
            )
            model.map_tokens = global_update
            
            # KV缓存回传（感知-优化反馈）
            model.kv_manager.update_from_backend(global_update)
    
    return model.map_tokens
```

### 隐式地图表示解码

```python
def decode_map(map_tokens, heads):
    """从地图标记解码显式表示"""
    # 点云解码
    points = heads['point'](map_tokens)  # [N, 3]
    
    # 位姿解码
    poses = heads['pose'](map_tokens)    # [N, 7] (quat + trans)
    
    # 置信度解码
    confidence = heads['confidence'](map_tokens)  # [N, 1]
    
    return {
        'points': points,
        'poses': poses,
        'confidence': confidence
    }
```

**应用场景**:
- 实时SLAM系统
- 长序列环境扫描
- 多传感器融合

**日期**: 2026-03-04 09:51-10:27
**标签**: `#slam` `#frontend-backend` `#kv-cache` `#implicit-representation`

---

## 滚动记忆模式（InfiniteVGGT）

**时间**: 2026-03-04
**来源**: InfiniteVGGT论文

### 不可变锚点

```python
class RollingMemory:
    """滚动记忆机制，支持无限视野"""
    def __init__(self, budget_per_layer):
        self.budget = budget_per_layer  # 每层的存储预算
        self.anchor = None  # 首帧锚点（永不丢弃）
        self.rolling_cache = {}  # 滚动缓存
```

### 键空间多样性代理

```python
def compute_key_diversity(keys):
    """
    计算键向量的多样性作为token重要性指标
    不依赖注意力权重，兼容FlashAttention
    """
    # keys: [num_tokens, dim]
    
    # 计算键向量间的余弦相似度
    keys_norm = F.normalize(keys, dim=-1)
    similarity = torch.mm(keys_norm, keys_norm.t())
    
    # 多样性 = 1 - 平均相似度
    diversity = 1 - similarity.mean()
    
    return diversity
```

### 层级自适应预算分配

```python
def adaptive_budget_allocation(kv_cache, total_budget):
    """
    根据各层特性动态分配存储预算
    """
    num_layers = len(kv_cache)
    budget_per_layer = []
    
    for layer_idx in range(num_layers):
        # 计算该层的平均多样性
        keys = kv_cache[layer_idx]['key']
        diversity = compute_key_diversity(keys)
        
        # 多样性高的层分配更多预算
        budget = int(total_budget * diversity / num_layers)
        budget_per_layer.append(budget)
    
    return budget_per_layer
```

### 动态预算裁剪

```python
def rolling_clip(kv_cache, anchor, budget_per_layer):
    """
    滚动裁剪KV缓存，保留重要token
    """
    clipped_cache = {}
    
    for layer_idx, (key, value) in enumerate(kv_cache.items()):
        budget = budget_per_layer[layer_idx]
        
        # 计算每个token的重要性得分
        importance_scores = compute_token_importance(key)
        
        # 选择Top-K个最重要的token
        top_k_indices = torch.topk(
            importance_scores, 
            min(budget, len(importance_scores))
        ).indices
        
        # 保留锚点 + Top-K token
        if anchor is not None:
            anchor_key, anchor_value = anchor[layer_idx]
            clipped_key = torch.cat([anchor_key, key[top_k_indices]])
            clipped_value = torch.cat([anchor_value, value[top_k_indices]])
        else:
            clipped_key = key[top_k_indices]
            clipped_value = value[top_k_indices]
        
        clipped_cache[layer_idx] = {
            'key': clipped_key,
            'value': clipped_value
        }
    
    return clipped_cache
```

### 完整流程

```python
class InfiniteVGGT:
    def __init__(self, total_budget=1000):
        self.memory = RollingMemory(budget_per_layer=[])
        self.total_budget = total_budget
    
    def process_frame(self, frame, frame_idx):
        # 前向传播，获取KV缓存
        kv_cache = self.backbone(frame)
        
        # 第一帧：设置为锚点
        if frame_idx == 0:
            self.memory.anchor = kv_cache
            self.memory.rolling_cache = kv_cache
            return
        
        # 计算层级自适应预算
        budget_per_layer = adaptive_budget_allocation(
            kv_cache, 
            self.total_budget
        )
        
        # 滚动裁剪
        self.memory.rolling_cache = rolling_clip(
            kv_cache,
            self.memory.anchor,
            budget_per_layer
        )
    
    def get_memory(self):
        """获取当前记忆状态"""
        return self.memory.rolling_cache
```

**效果**:
- 显存占用恒定 O(1)
- 支持无限视野
- 有效抑制长期漂移

**日期**: 2026-03-04 09:51-10:27
**标签**: `#memory-management` `#streaming` `#adaptive-budget` `#infinite-horizon`

---

*最后更新: 2026-03-04 13:10*
