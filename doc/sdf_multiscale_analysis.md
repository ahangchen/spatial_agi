# 多尺度SDF分析

## 📋 核心问题

**fine分辨率的SDF是否包含了最完整的SDF信息？**

---

## ✅ 答案

**是的，fine分辨率的SDF包含了最完整的SDF信息。**

---

## 🔍 详细分析

### 多尺度架构（3D Former）

| 分辨率 | 体素大小 | 预测内容 | 作用 |
|--------|---------|---------|------|
| **coarse** | 25cm (0.25m) | 占用概率 | 过滤空闲体素，粗略定位 |
| **medium** | 12.5cm (0.125m) | 占用概率 | 进一步过滤，细化区域 |
| **fine** | 6.25cm (0.0625m) | **SDF/TSDF值** | **完整几何信息** |

### 为什么只有fine尺度预测SDF？

#### 1. 设计原理

```
coarse (占用概率)
    ↓ (占用率>0.5)
medium (占用概率)
    ↓ (占用率>0.5)
fine (SDF/TSDF值) ← 只有这一层预测SDF
```

**占用引导（Occupancy Guiding）**：
- 粗/中尺度预测**占用概率**（0~1之间）
- 只有占用概率>0.5的体素才传递到下一层
- **目的**：过滤空闲体素，节省显存和计算

#### 2. 计算效率

- **占用概率**：单通道，计算快
- **SDF值**：需要连续回归，计算慢

如果所有尺度都预测SDF：
- 显存增加3倍（每个尺度都要存储SDF）
- 计算量增加5-10倍（每个尺度都要回归SDF）
- 收益有限（粗尺度的SDF质量差）

#### 3. 几何质量

| 尺度 | SDF质量 | 适用场景 |
|------|---------|---------|
| coarse | 差（25cm分辨率） | 不适合最终重建 |
| medium | 中（12.5cm分辨率） | 可以做粗略约束 |
| fine | 最好（6.25cm分辨率） | **最终几何重建** |

---

## 🎯 对历史特征传递的影响

### 当前的多尺度特征保存

```python
dense_grids = {
    'coarse': [B, C_coarse, D_coarse, H_coarse, W_coarse],   # 特征
    'medium': [B, C_medium, D_medium, H_medium, W_medium],  # 特征
    'fine': [B, C_fine, D_fine, H_fine, W_fine],            # 特征
}
```

**特点**：保存的是**特征**（C通道），不是SDF

### 新增的SDF保存

#### 方案1：只保存fine分辨率SDF ✅（推荐）

```python
new_state = {
    'dense_grids': {...},  # 多尺度特征
    'sdf_grid': [B, 1, D_fine, H_fine, W_fine],  # 只有fine SDF
    'sdf_resolution': 0.0625,
}
```

**优点**：
- 显存占用小（单通道）
- SDF质量最好
- 符合模型设计

**缺点**：
- 投影时只有单一分辨率

#### 方案2：保存所有分辨率SDF ❌（不推荐）

```python
new_state = {
    'dense_grids': {...},
    'sdf_grids': {
        'coarse': [B, 1, D_coarse, H_coarse, W_coarse],
        'medium': [B, 1, D_medium, H_medium, W_medium],
        'fine': [B, 1, D_fine, H_fine, W_fine],
    }
}
```

**优点**：
- 多尺度SDF约束

**缺点**：
- 显存占用大（3倍）
- 粗/中尺度SDF质量差
- 模型不预测这些SDF，需要从fine下采样
- **违背模型设计初衷**

#### 方案3：保存fine SDF + 粗/中占用概率 ⚠️（可选）

```python
new_state = {
    'dense_grids': {...},
    'sdf_grid': [B, 1, D_fine, H_fine, W_fine],
    'occupancy_grids': {
        'coarse': [B, 1, D_coarse, H_coarse, W_coarse],  # 占用概率
        'medium': [B, 1, D_medium, H_medium, W_medium],  # 占用概率
    }
}
```

**优点**：
- 完整保存模型输出
- 占用概率可用于优化过滤

**缺点**：
- 实现复杂
- 需要额外的融合逻辑
- 收益不确定

---

## 📊 显存对比

### 当前配置（多尺度特征）
```
coarse特征:  [2, 128, 96, 96, 48]  ≈ 1.1 GiB
medium特征:  [2, 128, 192, 192, 96] ≈ 4.5 GiB
fine特征:    [2, 128, 384, 384, 192]≈ 18.0 GiB
────────────────────────────────────────
总计:                              ≈ 23.6 GiB ❌ (超出显存)
```

### 实际稀疏存储（稀疏卷积）
```
coarse特征:  10%占用  ≈ 0.11 GiB
medium特征:  10%占用  ≈ 0.45 GiB
fine特征:    10%占用  ≈ 1.80 GiB
────────────────────────────────────────
总计:                              ≈ 2.36 GiB ✅
```

### 新增fine SDF（稀疏）
```
fine SDF:    [2, 1, 384, 384, 192] 10%占用  ≈ 0.014 GiB ✅
```

### 方案对比

| 方案 | 显存占用 | 优势 | 劣势 |
|------|---------|------|------|
| 当前（仅特征） | 2.36 GiB | 已实现 | 无几何约束 |
| 方案1（+fine SDF） | 2.37 GiB | 低开销，高质量 | 单分辨率 |
| 方案2（+多尺度SDF） | 2.40 GiB | 多尺度约束 | 显存大，质量差 |
| 方案3（+占用概率） | 2.40 GiB | 完整信息 | 复杂度高 |

---

## 🎯 结论与建议

### 1. 是否保存多尺度SDF？

**不建议保存多尺度SDF**，原因：

1. **模型设计**：只有fine尺度预测SDF，其他尺度预测占用概率
2. **质量差**：粗/中尺度如果下采样SDF，分辨率低，质量差
3. **显存浪费**：占用量大但收益小
4. **实现复杂**：需要额外的下采样和融合逻辑

### 2. 推荐方案

**使用方案1：只保存fine分辨率SDF**

```python
def _create_new_state(self, output: Dict, current_pose: torch.Tensor) -> Dict:
    """创建新的历史状态（只保存fine SDF）"""
    # ... 多尺度特征保存 ...

    # 提取fine分辨率的SDF
    if 'voxel_outputs' in output and 'fine' in output['voxel_outputs']:
        fine_output = output['voxel_outputs']['fine']  # SparseConvTensor
        sdf_grid = self._sparse_to_dense_grid(fine_output, batch_size)  # [B, 1, D, H, W]

        new_state['sdf_grid'] = sdf_grid
        new_state['sdf_resolution'] = self.resolutions['fine']

    return new_state
```

### 3. 投影策略

**使用单尺度SDF投影**：
```python
def _apply_stream_fusion(self, current_features, historical_features, current_pose):
    # ... 多尺度特征投影 ...

    # 投影历史fine SDF
    if 'sdf_grid' in historical_features:
        historical_sdf = historical_features['sdf_grid']  # [B, 1, D_fine, H_fine, W_fine]
        historical_spatial_shape = historical_sdf.shape[2:]  # [D_fine, H_fine, W_fine]

        projected_sdf = self.pose_projection.project_sdf(
            historical_sdf,
            historical_indices,
            current_coords,
            T_ch,
            historical_spatial_shape,
            historical_features['sdf_resolution']
        )  # [N, 1]

        # 融合SDF
        fused[:, :1] = alpha * projected_sdf + (1 - alpha) * current_sdf

    return fused
```

---

## 🚀 更新计划

### 修改Phase 1：只保存fine SDF

之前计划中提到保存"fine分辨率的SDF"，这个是正确的。不需要修改。

### 修改Phase 2：单尺度SDF投影

`project_sdf()`方法保持不变，只需明确这是fine分辨率的投影。

### 修改Phase 3：单尺度SDF融合

融合逻辑保持不变，明确这是fine分辨率的SDF融合。

---

## ✅ 最终确认

**问题**：fine分辨率的SDF是否包含了最完整的SDF信息？

**答案**：
- ✅ **是的，fine分辨率SDF是最完整的**
- ✅ 粗/中尺度不预测SDF，只预测占用概率
- ✅ 历史特征传递中应该只保存和投影fine SDF
- ✅ 不需要保存多尺度SDF（显存浪费、质量差）

---

**计划保持不变，继续实施！**
