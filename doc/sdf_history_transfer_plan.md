# SDF历史特征传递计划

## 📋 概述

在现有**多尺度特征传递**的基础上，增加**历史SDF值**的传递，同样使用pose-based投影进行对齐。这样可以充分利用历史时刻的几何信息（SDF），辅助当前帧的预测。

---

## 🎯 目标

### 当前状态
- ✅ 传递多尺度特征（coarse, medium, fine）
- ✅ 使用pose-based投影对齐
- ✅ 加权融合：fine + 0.5*medium + 0.25*coarse

### 新增目标
- ❌ 传递历史SDF值
- ❌ 使用pose-based投影对齐SDF
- ❌ 融合历史SDF到当前预测

---

## 🏗️ 架构设计

### 数据流

```
历史时刻 t-1                    当前时刻 t
    |                                |
    v                                v
+----------------+          +----------------+
| SDFFormer      |          | SDFFormer      |
| 输出:          |          | 输出:          |
| - 多尺度特征   |          | - 多尺度特征   |  ← 已实现
| - SDF (fine)   |          | - SDF (fine)   |  ← 需要保存
| - occupancy    |          | - occupancy    |
+----------------+          +----------------+
    |                                |
    v                                v
+----------------+          +----------------+
| _create_new_   |          | _create_new_   |
| state()         |          | state()         |
| 保存:           |          | 保存:           |
| - 多尺度特征网格|          | - 多尺度特征网格|  ← 已实现
| - pose          |          | - pose          |
| - SDF网格(新增) |  ← 需要 | - SDF网格(新增) |  ← 新增
+----------------+          +----------------+
    |                                |
    |--------------------------------|
              (传递历史状态)
                    |
                    v
          +----------------+
          | _apply_stream_ |
          | fusion()       |
          | 1. 投影历史多尺度特征  ← 已实现
          | 2. 投影历史SDF (新增) |  ← 新增
          | 3. 融合历史SDF到当前  |  ← 新增
          +----------------+
                    |
                    v
          +----------------+
          | 融合输出        |
          | - 多尺度特征融合 |
          | - SDF值融合      |  ← 新增
          +----------------+
```

---

## 📝 实施步骤

### Phase 1: 修改_create_new_state保存SDF

#### 目标
在保存多尺度特征的同时，保存fine分辨率的SDF值。

#### 修改文件
`former3d/stream_sdfformer_integrated.py`

#### 修改内容

**1. 提取SDF输出**
从SDFFormer的输出中提取fine分辨率的SDF值：

```python
def _create_new_state(self, output: Dict, current_pose: torch.Tensor) -> Dict:
    """创建新的历史状态（Phase 1：增加SDF保存）"""
    batch_size = current_pose.shape[0]
    device = current_pose.device

    # ... 现有多尺度特征保存代码 ...

    # 新增：提取SDF值
    if 'voxel_outputs' in output:
        fine_output = output['voxel_outputs'].get('fine')

        if fine_output is not None:
            # fine_output是SparseConvTensor，其features包含SDF值
            sdf_sparse = fine_output  # SparseConvTensor [N, 1]
            sdf_dense = self._sparse_to_dense_grid(sdf_sparse, batch_size)  # [B, 1, D, H, W]

            new_state['sdf_grid'] = sdf_dense
            new_state['sdf_indices'] = sdf_sparse.indices  # [N, 4]
            new_state['sdf_spatial_shape'] = sdf_sparse.spatial_shape  # [D, H, W]
            new_state['sdf_resolution'] = self.resolutions['fine']
```

**2. 更新状态字典**
```python
new_state = {
    'dense_grids': dense_grids,        # {resname: [B, C, D, H, W]}
    'sparse_indices': sparse_indices,     # {resname: [N, 4]}
    'spatial_shapes': spatial_shapes,      # {resname: [D, H, W]}
    'resolutions': resolutions,             # {resname: float}
    'sdf_grid': sdf_grid,               # [B, 1, D, H, W] ← 新增
    'sdf_indices': sdf_indices,         # [N, 4] ← 新增
    'sdf_spatial_shape': sdf_spatial_shape, # [D, H, W] ← 新增
    'sdf_resolution': sdf_resolution,     # float ← 新增
    'batch_size': batch_size,
    'pose': current_pose.detach().clone(),
}
```

#### 测试
```python
def test_create_state_with_sdf():
    """测试创建状态时保存SDF"""
    # 创建模拟输出
    output = {
        'multiscale_features': {...},
        'voxel_outputs': {
            'fine': SparseConvTensor(...)
        }
    }

    state = model._create_new_state(output, pose)

    # 验证SDF已保存
    assert 'sdf_grid' in state
    assert state['sdf_grid'].shape == [B, 1, D, H, W]
    assert 'sdf_indices' in state
    assert 'sdf_spatial_shape' in state
    assert 'sdf_resolution' in state
```

---

### Phase 2: 在PoseBasedFeatureProjection中增加SDF投影方法

#### 目标
扩展现有的PoseBasedFeatureProjection类，增加专门投影SDF的方法。

#### 修改文件
`former3d/stream_sdfformer_integrated.py`

#### 新增方法

**1. project_sdf()**
```python
def project_sdf(self,
                historical_sdf_grid: torch.Tensor,
                historical_indices: torch.Tensor,
                current_indices: torch.Tensor,
                T_ch: torch.Tensor,
                spatial_shape: Tuple[int, int, int],
                resolution: float) -> torch.Tensor:
    """
    投影历史SDF到当前体素坐标

    Args:
        historical_sdf_grid: [B, 1, D, H, W] 历史SDF密集网格
        historical_indices: [N, 4] 历史体素索引 (b, x, y, z)
        current_indices: [N, 4] 当前体素索引 (b, x, y, z)
        T_ch: [B, 4, 4] 从历史到当前pose的变换
        spatial_shape: (D, H, W) 空间形状
        resolution: 体素分辨率

    Returns:
        projected_sdf: [N, 1] 投影到当前坐标的SDF值
    """
    device = historical_sdf_grid.device
    num_points = current_indices.shape[0]
    batch_size = historical_sdf_grid.shape[0]

    # 获取历史坐标并转换为世界坐标
    historical_coords = historical_indices[:, 1:4].float()  # [N, 3]
    historical_coords = historical_coords * self.voxel_size  # 世界坐标

    # 添加齐次坐标
    ones = torch.ones(num_points, 1, device=device, dtype=historical_coords.dtype)
    historical_coords_homo = torch.cat([historical_coords, ones], dim=1)  # [N, 4]

    # 提取batch索引
    batch_indices = current_indices[:, 0].long()  # [N]
    T_ch_batch = T_ch[batch_indices]  # [N, 4, 4]

    # 变换坐标到当前相机坐标系
    transformed_coords_homo = torch.bmm(T_ch_batch, historical_coords_homo.unsqueeze(-1))
    transformed_coords = transformed_coords_homo.squeeze(-1)[:, :3]  # [N, 3]

    # 转换回体素坐标
    transformed_voxel_coords = transformed_coords / resolution

    # 归一化坐标到[-1, 1]
    normalized_coords = self.normalize_coords(transformed_voxel_coords, spatial_shape)

    # 裁剪坐标到有效范围
    normalized_coords = torch.clamp(normalized_coords, -1.0, 1.0)

    # 使用grid_sample采样
    grid = normalized_coords.view(1, 1, 1, num_points, 3)  # [1, 1, 1, N, 3]
    grid = grid.expand(batch_size, -1, -1, -1, -1)  # [B, 1, 1, N, 3]

    # 采样
    sampled = F.grid_sample(
        historical_sdf_grid,  # [B, 1, D, H, W]
        grid,                  # [B, 1, 1, N, 3]
        mode='bilinear',
        padding_mode='zeros',
        align_corners=False
    )  # [B, 1, 1, 1, N]

    # 提取采样的SDF值
    projected_sdf = []
    for b in range(batch_size):
        mask = batch_indices == b
        if mask.any():
            projected_sdf.append(sampled[b, 0, 0, 0, mask])
        else:
            projected_sdf.append(torch.zeros(
                (0, 1),
                device=device,
                dtype=historical_sdf_grid.dtype
            ))

    projected_sdf = torch.cat(projected_sdf, dim=0)  # [N, 1]

    return projected_sdf
```

#### 测试
```python
def test_project_sdf():
    """测试SDF投影"""
    # 创建模拟数据
    historical_sdf_grid = torch.randn(2, 1, 32, 32, 32).cuda()
    historical_indices = torch.randint(0, 32, (1000, 4)).cuda()
    current_indices = torch.randint(0, 32, (1000, 4)).cuda()
    T_ch = torch.eye(4).unsqueeze(0).repeat(2, 1, 1).cuda()
    spatial_shape = (32, 32, 32)
    resolution = 0.0625

    # 投影
    projected = projection.project_sdf(
        historical_sdf_grid, historical_indices, current_indices,
        T_ch, spatial_shape, resolution
    )

    # 验证形状
    assert projected.shape == (1000, 1)
    assert not torch.isnan(projected).any()
```

---

### Phase 3: 修改_apply_stream_fusion融合SDF

#### 目标
在融合多尺度特征的基础上，融合历史SDF值到当前预测。

#### 修改文件
`former3d/stream_sdfformer_integrated.py`

#### 修改内容

**1. 投影历史SDF**
```python
def _apply_stream_fusion(self, current_features: Dict, historical_features: Dict, current_pose: torch.Tensor) -> torch.Tensor:
    """应用流式融合（Phase 3：增加SDF融合）"""

    # ... 现有多尺度特征融合代码 ...

    # 新增：投影历史SDF
    projected_sdf = None

    if 'sdf_grid' in historical_features:
        sdf_grid = historical_features['sdf_grid']  # [B, 1, D, H, W]
        sdf_indices = historical_features['sdf_indices']  # [N, 4]
        sdf_spatial_shape = historical_features['sdf_spatial_shape']  # [D, H, W]
        sdf_resolution = historical_features['sdf_resolution']  # float

        # 投影SDF
        projected_sdf = self.pose_projection.project_sdf(
            sdf_grid,
            sdf_indices,
            current_coords,  # 使用当前特征的坐标
            T_ch,
            sdf_spatial_shape,
            sdf_resolution
        )  # [N, 1]

        print(f"[StreamFusion] SDF投影结果: {projected_sdf.shape}")

    # ... 现有多尺度特征融合代码 ...

    # 新增：融合历史SDF
    if projected_sdf is not None and projected_sdf.shape[0] == fused.shape[0]:
        # SDF融合策略：加权平均或作为额外特征
        # 方案1：加权平均（历史SDF + 当前SDF）
        # 方案2：作为额外特征拼接

        # 使用方案1：加权平均
        sdf_weight = 0.3  # 历史SDF权重
        current_sdf = fused[:, :1]  # 假设第一维是SDF

        fused_sdf = sdf_weight * projected_sdf + (1 - sdf_weight) * current_sdf

        # 替换融合后的SDF
        fused[:, :1] = fused_sdf

        print(f"[StreamFusion] SDF融合完成，权重={sdf_weight}")
    else:
        print("[StreamFusion] 跳过SDF融合")

    return fused
```

#### 融合策略选项

**方案1：加权平均（推荐）**
```python
fused_sdf = alpha * historical_sdf + (1 - alpha) * current_sdf
```
- 优点：简单直接，易于调试
- 缺点：需要手动调参

**方案2：动态加权**
```python
# 根据历史置信度动态调整权重
confidence = compute_confidence(historical_pose, current_pose)
fused_sdf = confidence * historical_sdf + (1 - confidence) * current_sdf
```
- 优点：自适应
- 缺点：需要实现置信度计算

**方案3：作为额外特征**
```python
# 拼接历史SDF到特征
augmented_features = torch.cat([fused, projected_sdf], dim=1)
```
- 优点：保留更多信息
- 缺点：增加计算量和参数

#### 测试
```python
def test_fusion_with_sdf():
    """测试SDF融合"""
    # 创建模拟数据
    current_features = {'features': torch.randn(1000, 128).cuda()}
    historical_features = {
        'dense_grids': {...},
        'sdf_grid': torch.randn(2, 1, 32, 32, 32).cuda(),
        'sdf_indices': torch.randint(0, 32, (1000, 4)).cuda(),
        'sdf_spatial_shape': (32, 32, 32),
        'sdf_resolution': 0.0625
    }

    # 融合
    fused = model._apply_stream_fusion(current_features, historical_features, pose)

    # 验证融合成功
    assert fused.shape == (1000, 128)
    assert not torch.isnan(fused).any()
```

---

### Phase 4: 可视化和验证

#### 目标
可视化SDF投影和融合效果，验证实现正确性。

#### 修改文件
`viz/rerun_visualizer.py`

#### 新增可视化内容

**1. 可视化历史SDF投影**
```python
def log_sdf_projection(self, historical_sdf: torch.Tensor, projected_sdf: torch.Tensor,
                      historical_coords: torch.Tensor, projected_coords: torch.Tensor):
    """记录SDF投影过程"""
    # 原始SDF
    self.log_sdf_grid("Historical SDF", historical_sdf)

    # 投影后的SDF
    self.log_sdf_grid("Projected SDF", projected_sdf)

    # 坐标变换
    self.log_coords("Historical Coords", historical_coords)
    self.log_coords("Projected Coords", projected_coords)
```

**2. 可视化SDF融合结果**
```python
def log_sdf_fusion(self, current_sdf: torch.Tensor, historical_sdf: torch.Tensor,
                   fused_sdf: torch.Tensor):
    """记录SDF融合结果"""
    self.log_sdf_grid("Current SDF", current_sdf)
    self.log_sdf_grid("Historical SDF (Projected)", historical_sdf)
    self.log_sdf_grid("Fused SDF", fused_sdf)

    # 差异图
    diff = fused_sdf - current_sdf
    self.log_sdf_grid("SDF Difference", diff)
```

#### 测试
```python
def test_visualization():
    """测试可视化"""
    visualizer = RerunVisualizer()

    # 创建模拟数据
    current_sdf = torch.randn(32, 32, 32)
    historical_sdf = torch.randn(32, 32, 32)
    fused_sdf = (current_sdf + historical_sdf) / 2

    # 可视化
    visualizer.log_sdf_fusion(current_sdf, historical_sdf, fused_sdf)
```

---

## 📊 显存影响分析

### 新增显存占用

| 组件 | 显存占用 | 说明 |
|------|---------|------|
| SDF网格 | ~0.5 GiB | [B, 1, D, H, W] 单通道 |
| SDF索引 | ~0.01 GiB | [N, 4] 稀疏索引 |
| 投影中间结果 | ~0.1 GiB | 坐标变换、采样等 |
| **总计** | **~0.6 GiB** | 相比现有多尺度特征 |

### 显存优化建议

1. **降低SDF分辨率**：使用medium而不是fine分辨率
2. **SDF量化**：使用float16而不是float32
3. **稀疏保存**：只保存有效体素的SDF值

---

## 🎯 预期效果

### 准确率提升
- **预期**：+3~5% 准确率提升（因更好的几何约束）
- **原理**：历史SDF提供了可靠的几何先验

### 一致性提升
- **预期**：大幅减少相机运动时的SDF跳跃
- **原理**：通过pose对齐确保几何一致性

### 计算开销
- **预期**：每个batch增加2~3ms（SDF投影）
- **原理**：单通道SDF比多通道特征投影更快

---

## ✅ 合规性检查

### 编程规范
- ✅ 0. 开发前写计划 → 本文档
- ✅ 1. 开发前写测试用例 → 每个Phase都有测试
- ✅ 2. 开发后必须测试 → 每个Phase后测试
- ✅ 3. 每个小任务后提交 → 分4个Phase提交
- ✅ 4. 分解大任务为小任务 → 已分解为4个Phase
- ✅ 5. 禁止简化问题 → 完整实现SDF投影和融合
- ✅ 7. 禁止创建简化版本 → 实现完整功能
- ✅ 8. 禁止重复代码 → 复用现有投影逻辑
- ✅ 10. 完成后清理中间文件 → 清理测试文件
- ✅ 13. 使用conda环境 → 使用`/home/cwh/miniconda3/envs/former3d`

---

## 📁 文件修改清单

### 修改的文件
1. `former3d/stream_sdfformer_integrated.py`
   - Phase 1: 修改`_create_new_state()`保存SDF
   - Phase 2: 新增`PoseBasedFeatureProjection.project_sdf()`
   - Phase 3: 修改`_apply_stream_fusion()`融合SDF

2. `viz/rerun_visualizer.py`（可选）
   - Phase 4: 新增SDF可视化方法

### 测试文件
- `test_sdf_projection.py` - SDF投影测试
- `test_sdf_fusion.py` - SDF融合测试

---

## 🚀 时间计划

| Phase | 任务 | 预计时间 |
|-------|------|---------|
| Phase 1 | 修改_create_new_state保存SDF | 30分钟 |
| Phase 2 | 实现SDF投影方法 | 1小时 |
| Phase 3 | 实现SDF融合逻辑 | 1小时 |
| Phase 4 | 可视化和验证 | 30分钟 |
| **总计** | | **~3小时** |

---

## 🔧 实施建议

### 优先级
1. **Phase 1 & 2**：必须完成（核心功能）
2. **Phase 3**：必须完成（融合逻辑）
3. **Phase 4**：可选（调试和可视化）

### 风险控制
1. **回滚机制**：每个Phase完成后提交Git，便于回滚
2. **渐进测试**：每个Phase都独立测试，避免累积错误
3. **显存监控**：实时监控显存占用，防止OOM

### 融合策略
建议从**加权平均**开始（简单、易调试），如果效果不佳再尝试动态加权或额外特征。

---

## 📚 参考资料

- 现有多尺度特征投影：`PoseBasedFeatureProjection`
- 现有融合逻辑：`_apply_stream_fusion()`
- Grid Sample文档：https://pytorch.org/docs/stable/generated/nn.functional.grid_sample.html

---

**🎯 计划制定完成！**

分4个Phase实施，预计总时长~3小时，新增显存占用~0.6 GiB。
