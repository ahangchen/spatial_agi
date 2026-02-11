# StreamSDFFormerIntegrated 多尺度特征状态管理改进计划

## 问题分析

### 当前问题
1. **`_create_new_state`函数实现错误**
   - 当前保存的是模型的输出（SDF和occupancy）
   - 应该保存计算SDF和occ之前的多尺度特征
   - 历史特征是multi scale feature，不是occ或tsdf结果

2. **缺乏pose-based特征对齐**
   - 没有根据历史和当前时刻的pose差异计算映射关系
   - 无法将历史特征投影到当前坐标系
   - 流式融合的效果受限

### 正确的架构理解
```
输入图像
   ↓
2D CNN (多尺度特征提取)
   ↓
Back-projection (多尺度体素特征)
   ↓
3D Former网络 (多尺度处理)
   ├─ Coarse分辨率特征
   ├─ Medium分辨率特征
   └─ Fine分辨率特征 ← 需要保存这些中间特征
   ↓
输出层 (SDF/Occ预测)
```

## 数学原理

### 1. Pose变换原理

#### 1.1 世界坐标与相机坐标转换

对于世界坐标系中的3D点 `P_w = (X, Y, Z, 1)^T`，其在相机坐标系中的坐标为：

```
P_c = T_cw * P_w
```

其中 `T_cw` 是从世界到相机的变换矩阵（4x4）：

```
T_cw = [ R_cw  | t_cw ]
       [ 0 0 0 |  1   ]
```

其中：
- `R_cw` 是3x3旋转矩阵
- `t_cw` 是3x1平移向量

#### 1.2 历史到当前pose的变换

假设历史时刻的pose为 `T_h`，当前时刻的pose为 `T_c`。

历史点 `P_h` 在历史相机坐标系中的坐标：

```
P_h_cam = T_h * P_h_w
```

其中 `P_h_w` 是历史点在世界坐标系中的坐标。

历史点在世界坐标系中的坐标：

```
P_h_w = T_h^{-1} * P_h_cam
```

将历史点转换到当前相机坐标系：

```
P_c_cam = T_c * P_h_w = T_c * T_h^{-1} * P_h_cam
```

定义变换矩阵 `T_ch = T_c * T_h^{-1}`，表示从历史相机坐标系到当前相机坐标系的变换。

#### 1.3 体素坐标变换

对于体素索引 `v = (x, y, z, batch_idx)`，其对应的体素坐标为：

```
P_v = (x * voxel_size, y * voxel_size, z * voxel_size, 1)^T
```

变换到当前相机坐标系：

```
P_v' = T_ch * P_v
```

然后转换回体素索引：

```
v' = (P_v'[0] / voxel_size, P_v'[1] / voxel_size, P_v'[2] / voxel_size, batch_idx)
```

### 2. GridSample实现原理

#### 2.1 GridSample概述

`torch.nn.functional.grid_sample` 用于在规则网格上进行插值采样：

```python
torch.nn.functional.grid_sample(
    input,        # [N, C, D_in, H_in, W_in] 输入特征网格
    grid,         # [N, D_out, H_out, W_out, 3] 采样坐标
    mode='bilinear',
    padding_mode='zeros',
    align_corners=False
)
```

#### 2.2 采样坐标归一化

GridSample的坐标需要归一化到 `[-1, 1]` 范围：

```
normalized_coord = (coord - min_coord) / (max_coord - min_coord) * 2 - 1
```

对于体素坐标 `(x, y, z)`，假设网格范围为 `(D, H, W)`：

```python
x_norm = (x / (D - 1)) * 2 - 1
y_norm = (y / (H - 1)) * 2 - 1
z_norm = (z / (W - 1)) * 2 - 1
```

#### 2.3 从历史特征采样到当前特征

1. 将历史体素坐标变换到当前坐标系
2. 将变换后的坐标归一化到 `[-1, 1]`
3. 使用grid_sample从历史特征网格中采样

```python
# 假设历史特征网格: [batch, C, D, H, W]
historical_features_grid = historical_features  # [B, C, D, H, W]

# 1. 变换历史坐标到当前坐标系
current_coords = T_ch @ historical_coords_homo  # [N, 4]

# 2. 归一化坐标
normalized_coords = normalize_coords(current_coords)  # [N, 3]

# 3. 使用grid_sample采样
# 需要将[N, 3]重塑为[1, 1, 1, N, 3]以匹配grid_sample输入
grid = normalized_coords.view(1, 1, 1, -1, 3)

# 采样
sampled_features = F.grid_sample(
    historical_features_grid,  # [B, C, D, H, W]
    grid,                      # [1, 1, 1, N, 3]
    mode='bilinear',
    padding_mode='zeros',
    align_corners=False
)  # [B, C, 1, 1, N]

# 重塑为[N, C]
sampled_features = sampled_features.permute(0, 4, 1, 2, 3).squeeze(-1).squeeze(-1).squeeze(0)
# [N, C]
```

### 3. 多尺度特征投影

#### 3.1 多尺度特征定义

SDFFormer产生三个分辨率级别的特征：

```
Coarse:   [N_c, C_c]   # 低分辨率，大感受野
Medium:   [N_m, C_m]   # 中分辨率
Fine:     [N_f, C_f]   # 高分辨率，小感受野
```

每个级别的特征有对应的体素坐标：

```
VoxelCoords_c = [N_c, 3]  # coarse级别体素坐标
VoxelCoords_m = [N_m, 3]  # medium级别体素坐标
VoxelCoords_f = [N_f, 3]  # fine级别体素坐标
```

#### 3.2 跨尺度特征对齐

当相机移动时，不同尺度的特征需要根据pose变化进行对齐：

对于分辨率级别 `res ∈ {coarse, medium, fine}`：

1. 历史特征在历史相机坐标系中：`F_h_res @ V_h_res`
2. 变换到当前相机坐标系：`V_c_res = T_ch @ V_h_res`
3. 从当前时刻的res级别特征网格中采样：`F_c_res = Sample(F_h_res_grid, V_c_res)`

#### 3.3 稀疏特征到密集网格的转换

由于SDFFormer使用稀疏卷积，需要先将稀疏特征转换为密集网格：

```python
def sparse_to_dense(sparse_features, sparse_indices, grid_shape, fill_value=0):
    """
    将稀疏特征转换为密集网格

    Args:
        sparse_features: [N, C] 稀疏特征
        sparse_indices: [N, 4] 稀疏索引 (x, y, z, batch_idx)
        grid_shape: [D, H, W] 网格形状

    Returns:
        dense_grid: [batch_size, C, D, H, W] 密集网格
    """
    batch_size = sparse_indices[:, 3].max().item() + 1
    num_voxels = sparse_features.shape[0]
    num_channels = sparse_features.shape[1]

    # 创建密集网格
    dense_grid = torch.full(
        (batch_size, num_channels, *grid_shape),
        fill_value,
        device=sparse_features.device,
        dtype=sparse_features.dtype
    )

    # 填充稀疏特征
    for i in range(num_voxels):
        x, y, z, b = sparse_indices[i]
        if 0 <= x < grid_shape[0] and 0 <= y < grid_shape[1] and 0 <= z < grid_shape[2]:
            dense_grid[b, :, x, y, z] = sparse_features[i]

    return dense_grid
```

### 4. 特征融合策略

#### 4.1 基于pose的加权融合

由于pose变换可能导致特征对齐不完美，可以使用基于pose距离的加权：

```python
def compute_pose_weights(T_ch, current_coords, sigma=1.0):
    """
    根据pose变换计算权重

    Args:
        T_ch: [4, 4] 从历史到当前pose的变换矩阵
        current_coords: [N, 3] 当前体素坐标
        sigma: 权重衰减参数

    Returns:
        weights: [N] 权重
    """
    # 计算平移距离
    translation = T_ch[:3, 3]  # [3]
    distances = torch.norm(current_coords, dim=1)  # [N]

    # 计算旋转角度（简化）
    rotation = T_ch[:3, :3]  # [3, 3]
    angle = torch.acos(torch.clamp((torch.trace(rotation) - 1) / 2, -1, 1))

    # 综合权重
    weights = torch.exp(-(distances**2) / (2 * sigma**2))
    weights *= torch.exp(-(angle**2) / (2 * (sigma * 0.1)**2))

    return weights
```

#### 4.2 多尺度融合

将不同尺度的投影特征进行融合：

```python
def fuse_multiscale_features(
    coarse_features,    # [N_c, C_c]
    medium_features,    # [N_m, C_m]
    fine_features,      # [N_f, C_f]
    target_coords       # [N_t, 3] 目标坐标
):
    """
    融合多尺度特征

    Args:
        coarse_features: coarse级别特征
        medium_features: medium级别特征
        fine_features: fine级别特征
        target_coords: 目标体素坐标

    Returns:
        fused_features: [N_t, C_f] 融合后的特征
    """
    # 对齐所有特征到目标坐标
    aligned_coarse = align_features(coarse_features, target_coords)
    aligned_medium = align_features(medium_features, target_coords)

    # 融合
    fused = fine_features + 0.5 * aligned_medium + 0.25 * aligned_coarse

    return fused
```

## 实现方案

### Phase 1: 提取并保存多尺度特征

#### 1.1 修改SDFFormer返回中间特征

修改`former3d/sdfformer.py`，保存3D网络的中间输出：

```python
def forward(self, batch, voxel_inds_16, return_multiscale_features=True):
    # ... 现有代码 ...

    if return_multiscale_features:
        # 保存每个分辨率的中间特征
        multiscale_features = {}
        for resname in ["coarse", "medium", "fine"]:
            if resname in voxel_outputs:
                multiscale_features[resname] = {
                    'features': voxel_outputs[resname],  # SparseConvTensor
                    'indices': voxel_outputs[resname].indices,  # [N, 4]
                    'batch_size': voxel_outputs[resname].batch_size,
                    'spatial_shape': voxel_outputs[resname].spatial_shape,
                    'resolution': self.resolutions[resname]
                }

        # 返回多尺度特征
        return voxel_outputs, proj_occ_logits, bp_data, multiscale_features

    return voxel_outputs, proj_occ_logits, bp_data
```

#### 1.2 创建稀疏到密集转换工具

```python
class SparseFeatureGrid:
    """稀疏特征到密集网格的转换"""

    @staticmethod
    def to_dense_grid(sparse_tensor, batch_size, fill_value=0.0):
        """
        将SparseConvTensor转换为密集网格

        Args:
            sparse_tensor: SparseConvTensor
            batch_size: 批次大小
            fill_value: 填充值

        Returns:
            dense_grid: [batch_size, C, D, H, W]
        """
        features = sparse_tensor.features  # [N, C]
        indices = sparse_tensor.indices    # [N, 4] (b, x, y, z) 或 (b, z, y, x)
        spatial_shape = sparse_tensor.spatial_shape  # [D, H, W]
        num_channels = features.shape[1]

        # 创建密集网格
        dense_grid = torch.full(
            (batch_size, num_channels, *spatial_shape),
            fill_value,
            device=features.device,
            dtype=features.dtype
        )

        # 填充稀疏特征
        for i in range(len(features)):
            b, x, y, z = indices[i].tolist()
            if 0 <= b < batch_size and \
               0 <= x < spatial_shape[0] and \
               0 <= y < spatial_shape[1] and \
               0 <= z < spatial_shape[2]:
                dense_grid[b, :, x, y, z] = features[i]

        return dense_grid
```

### Phase 2: 实现Pose-based特征投影

#### 2.1 创建Pose-based特征投影模块

```python
class PoseBasedFeatureProjection:
    """基于Pose的特征投影"""

    def __init__(self, voxel_size=0.0625):
        self.voxel_size = voxel_size

    def compute_transform(self, historical_pose, current_pose):
        """
        计算从历史pose到当前pose的变换矩阵

        Args:
            historical_pose: [B, 4, 4] 历史pose
            current_pose: [B, 4, 4] 当前pose

        Returns:
            T_ch: [B, 4, 4] 从历史到当前pose的变换
        """
        # T_cw: 从世界到当前相机的变换
        T_cw = current_pose  # [B, 4, 4]

        # T_hw: 从世界到历史相机的变换
        T_hw = historical_pose  # [B, 4, 4]

        # T_ch = T_cw * T_hw^{-1}: 从历史相机到当前相机的变换
        T_hw_inv = torch.inverse(T_hw)  # [B, 4, 4]
        T_ch = torch.bmm(T_cw, T_hw_inv)  # [B, 4, 4]

        return T_ch

    def transform_voxel_coords(self, voxel_coords, T_ch):
        """
        变换体素坐标

        Args:
            voxel_coords: [N, 3] 体素坐标
            T_ch: [4, 4] 或 [B, 4, 4] 变换矩阵

        Returns:
            transformed_coords: [N, 3] 或 [N, B, 3] 变换后的坐标
        """
        # 添加齐次坐标
        ones = torch.ones(voxel_coords.shape[0], 1, device=voxel_coords.device)
        coords_homo = torch.cat([voxel_coords, ones], dim=1)  # [N, 4]

        # 应用变换
        if T_ch.dim() == 2:  # [4, 4]
            transformed = (T_ch @ coords_homo.T).T  # [N, 4]
        else:  # [B, 4, 4]
            coords_homo = coords_homo.unsqueeze(1)  # [N, 1, 4]
            transformed = torch.bmm(T_ch.unsqueeze(0), coords_homo.transpose(0, 1))
            transformed = transformed.squeeze(-1).transpose(0, 1)  # [N, B, 4]

        # 只返回前3个坐标
        return transformed[..., :3]

    def normalize_coords(self, coords, grid_shape):
        """
        将坐标归一化到[-1, 1]范围

        Args:
            coords: [N, 3] 坐标
            grid_shape: [D, H, W] 网格形状

        Returns:
            normalized_coords: [N, 3] 归一化后的坐标
        """
        D, H, W = grid_shape

        x_norm = (coords[:, 0] / (D - 1)) * 2 - 1
        y_norm = (coords[:, 1] / (H - 1)) * 2 - 1
        z_norm = (coords[:, 2] / (W - 1)) * 2 - 1

        normalized_coords = torch.stack([x_norm, y_norm, z_norm], dim=1)

        return normalized_coords

    def project_features(self,
                        historical_features_grid,  # [B, C, D, H, W]
                        historical_indices,        # [N, 4] (b, x, y, z)
                        current_indices,          # [N, 4] (b, x, y, z)
                        T_ch,                     # [B, 4, 4]
                        grid_shape):              # [D, H, W]
        """
        使用grid_sample从历史特征投影到当前坐标

        Args:
            historical_features_grid: [B, C, D, H, W] 历史特征密集网格
            historical_indices: [N, 4] 历史体素索引
            current_indices: [N, 4] 当前体素索引
            T_ch: [B, 4, 4] 变换矩阵
            grid_shape: [D, H, W] 网格形状

        Returns:
            projected_features: [N, C] 投影后的特征
        """
        device = historical_features_grid.device
        num_points = current_indices.shape[0]

        # 提取历史体素坐标并转换为世界坐标
        historical_coords = historical_indices[:, 1:4].float()  # [N, 3]
        historical_coords = historical_coords * self.voxel_size  # 世界坐标

        # 添加齐次坐标
        ones = torch.ones(num_points, 1, device=device)
        historical_coords_homo = torch.cat([historical_coords, ones], dim=1)  # [N, 4]

        # 根据batch索引选择对应的变换矩阵
        batch_indices = current_indices[:, 0].long()  # [N]
        T_ch_batch = T_ch[batch_indices]  # [N, 4, 4]

        # 变换坐标到当前相机坐标系
        transformed_coords_homo = torch.bmm(T_ch_batch, historical_coords_homo.unsqueeze(-1))
        transformed_coords = transformed_coords_homo.squeeze(-1)[:, :3]  # [N, 3]

        # 转换回体素坐标
        transformed_voxel_coords = transformed_coords / self.voxel_size  # [N, 3]

        # 归一化坐标到[-1, 1]
        normalized_coords = self.normalize_coords(transformed_voxel_coords, grid_shape)

        # 使用grid_sample采样
        # grid_sample期望grid形状为[N_out, D_out, H_out, W_out, 3]
        # 这里我们只需要对N个点采样，所以使用[1, 1, 1, N, 3]
        grid = normalized_coords.view(1, 1, 1, num_points, 3)  # [1, 1, 1, N, 3]

        # 扩展batch维度
        batch_size = historical_features_grid.shape[0]
        grid = grid.expand(batch_size, -1, -1, -1, -1)  # [B, 1, 1, N, 3]

        # 采样
        sampled = F.grid_sample(
            historical_features_grid,  # [B, C, D, H, W]
            grid,                      # [B, 1, 1, N, 3]
            mode='bilinear',
            padding_mode='zeros',
            align_corners=False
        )  # [B, C, 1, 1, N]

        # 提采样的特征：[N, C]
        # 需要根据batch索引提取对应的特征
        projected_features = []
        for b in range(batch_size):
            mask = batch_indices == b
            if mask.any():
                projected_features.append(sampled[b, :, 0, 0, mask])
            else:
                projected_features.append(torch.zeros(
                    (0, historical_features_grid.shape[1]),
                    device=device
                ))

        projected_features = torch.cat(projected_features, dim=0)  # [N, C]

        return projected_features
```

### Phase 3: 修改_create_new_state函数

```python
def _create_new_state(self, output: Dict, current_pose: torch.Tensor) -> Dict:
    """
    从当前输出创建新的历史状态（修改版）

    保存多尺度特征而不是最终输出
    """
    if 'multiscale_features' not in output:
        print("警告：输出中没有多尺度特征")
        return self._create_legacy_state(output, current_pose)

    multiscale_features = output['multiscale_features']

    # 将每个分辨率的稀疏特征转换为密集网格
    sparse_grid_converter = SparseFeatureGrid()
    dense_grids = {}

    for resname, features_data in multiscale_features.items():
        sparse_tensor = features_data['features']  # SparseConvTensor
        batch_size = features_data['batch_size']

        # 转换为密集网格
        dense_grid = sparse_grid_converter.to_dense_grid(sparse_tensor, batch_size)
        dense_grids[resname] = dense_grid  # [B, C, D, H, W]

    # 保存稀疏索引和密集网格
    new_state = {
        'dense_grids': dense_grids,        # {resname: [B, C, D, H, W]}
        'sparse_indices': {                # {resname: [N, 4]}
            resname: features_data['indices']
            for resname, features_data in multiscale_features.items()
        },
        'spatial_shapes': {                 # {resname: [D, H, W]}
            resname: features_data['spatial_shape']
            for resname, features_data in multiscale_features.items()
        },
        'resolutions': {                    # {resname: float}
            resname: features_data['resolution']
            for resname, features_data in multiscale_features.items()
        },
        'batch_size': multiscale_features['fine']['batch_size'],
        'pose': current_pose.detach().clone(),
    }

    return new_state
```

### Phase 4: 修改流式融合逻辑

```python
def _apply_stream_fusion(self,
                         current_features: Dict,
                         historical_state: Dict,
                         current_pose: torch.Tensor) -> torch.Tensor:
    """
    应用流式融合（使用GridSample进行pose-based投影）
    """
    # 创建pose-based特征投影器
    projector = PoseBasedFeatureProjection(voxel_size=self.resolutions['fine'])

    # 计算变换矩阵
    historical_pose = self.historical_pose  # [B, 4, 4]
    T_ch = projector.compute_transform(historical_pose, current_pose)  # [B, 4, 4]

    # 对每个分辨率级别投影历史特征
    projected_features = {}

    for resname in ['coarse', 'medium', 'fine']:
        if resname not in historical_state['dense_grids']:
            continue

        # 获取历史特征网格和索引
        historical_grid = historical_state['dense_grids'][resname]  # [B, C, D, H, W]
        historical_indices = historical_state['sparse_indices'][resname]  # [N, 4]
        grid_shape = historical_state['spatial_shapes'][resname]  # [D, H, W]

        # 获取当前特征和索引
        if 'fine' in current_features:
            current_indices = current_features['indices']  # [N, 4]
        else:
            # 如果没有当前索引，使用历史索引
            current_indices = historical_indices

        # 投影历史特征
        projected = projector.project_features(
            historical_grid,
            historical_indices,
            current_indices,
            T_ch,
            grid_shape
        )  # [N, C]

        projected_features[resname] = projected

    # 融合多尺度特征
    current_fine = current_features['features']  # [N, C]
    if 'fine' in projected_features:
        fused = self.fuse_multiscale(
            current_fine,
            projected_features.get('fine'),
            projected_features.get('medium'),
            projected_features.get('coarse')
        )
    else:
        fused = current_fine

    return fused
```

## 测试计划

### 1. 单元测试

#### 1.1 测试稀疏到密集转换
```python
def test_sparse_to_dense():
    # 创建稀疏特征
    sparse_features = torch.randn(100, 64)
    sparse_indices = torch.randint(0, 32, (100, 4))

    # 转换
    dense_grid = SparseFeatureGrid.to_dense_grid(
        SparseConvTensor(sparse_features, sparse_indices, spatial_shape=(32, 32, 32), batch_size=2),
        batch_size=2
    )

    # 验证
    assert dense_grid.shape == (2, 64, 32, 32, 32)
```

#### 1.2 测试pose变换
```python
def test_pose_transform():
    # 创建历史和当前pose
    historical_pose = torch.eye(4).unsqueeze(0)
    current_pose = torch.eye(4).unsqueeze(0)
    current_pose[0, 0, 3] = 1.0  # X方向平移1米

    # 计算变换
    projector = PoseBasedFeatureProjection()
    T_ch = projector.compute_transform(historical_pose, current_pose)

    # 验证
    expected_translation = torch.tensor([[1.0, 0.0, 0.0]])
    assert torch.allclose(T_ch[0, :3, 3], expected_translation)
```

#### 1.3 测试特征投影
```python
def test_feature_projection():
    # 创建历史特征网格
    historical_grid = torch.randn(2, 64, 32, 32, 32)
    historical_indices = torch.randint(0, 32, (100, 4))
    current_indices = torch.randint(0, 32, (100, 4))

    # 创建变换矩阵
    T_ch = torch.eye(4).unsqueeze(0).repeat(2, 1, 1)

    # 投影
    projector = PoseBasedFeatureProjection()
    projected = projector.project_features(
        historical_grid,
        historical_indices,
        current_indices,
        T_ch,
        grid_shape=(32, 32, 32)
    )

    # 验证
    assert projected.shape == (100, 64)
```

### 2. 集成测试

#### 2.1 测试流式推理
```python
def test_stream_inference():
    model = StreamSDFFormerIntegrated(...)
    model.eval()

    # 创建序列
    images_seq = [torch.randn(2, 3, 256, 256) for _ in range(3)]
    poses_seq = [create_pose(i) for i in range(3)]

    # 流式推理
    outputs = []
    for t in range(3):
        output, state = model.forward_single_frame(
            images_seq[t],
            poses_seq[t],
            torch.eye(3).unsqueeze(0).repeat(2, 1, 1),
            reset_state=(t == 0)
        )
        outputs.append(output)

    # 验证状态包含多尺度特征
    assert 'dense_grids' in state
    assert 'coarse' in state['dense_grids']
    assert 'medium' in state['dense_grids']
    assert 'fine' in state['dense_grids']
```

#### 2.2 测试pose变化时的特征对齐
```python
def test_pose_change_alignment():
    model = StreamSDFFormerIntegrated(...)
    model.eval()

    # 创建第一帧
    img1 = torch.randn(2, 3, 256, 256)
    pose1 = torch.eye(4).unsqueeze(0).repeat(2, 1, 1)

    # 创建第二帧（pose变化）
    img2 = torch.randn(2, 3, 256, 256)
    pose2 = torch.eye(4).unsqueeze(0).repeat(2, 1, 1)
    pose2[:, 0, 3] = 0.5  # X方向平移0.5米

    # 推理
    _, state1 = model.forward_single_frame(img1, pose1, ...)
    output2, state2 = model.forward_single_frame(img2, pose2, ...)

    # 验证特征对齐
    # 可以检查历史特征是否正确投影到当前坐标系
```

### 3. 性能测试

#### 3.1 显存占用测试
```python
def test_memory_usage():
    model = StreamSDFFormerIntegrated(...).cuda()

    # 记录初始显存
    torch.cuda.reset_peak_memory_stats()

    # 运行流式推理
    for t in range(10):
        # ... 推理代码 ...

    # 检查峰值显存
    peak_memory = torch.cuda.max_memory_allocated() / 1024**3
    print(f"峰值显存: {peak_memory:.2f} GB")
```

#### 3.2 速度测试
```python
def test_inference_speed():
    model = StreamSDFFormerIntegrated(...).cuda()
    model.eval()

    # 预热
    for _ in range(5):
        # ... 推理代码 ...

    # 计时
    start_time = time.time()
    for _ in range(100):
        # ... 推理代码 ...
    end_time = time.time()

    avg_time = (end_time - start_time) / 100
    print(f"平均推理时间: {avg_time:.3f} s")
```

## 实现步骤

1. **修改SDFFormer** - 添加返回多尺度特征的选项
2. **实现SparseFeatureGrid** - 稀疏到密集转换工具
3. **实现PoseBasedFeatureProjection** - pose-based特征投影
4. **修改StreamSDFFormerIntegrated** - 更新_create_new_state和流式融合
5. **编写测试** - 单元测试和集成测试
6. **性能优化** - 显存和速度优化

## 风险与缓解

### 风险1: 显存占用增加
**描述**: 保存密集网格会大幅增加显存占用

**缓解措施**:
- 使用稀疏特征代替密集网格（需要修改grid_sample实现）
- 降低特征分辨率
- 使用特征压缩技术

### 风险2: 计算开销增加
**描述**: GridSample操作计算开销大

**缓解措施**:
- 只投影关键区域的特征
- 使用更小的分辨率进行投影
- 实现稀疏grid_sample

### 风险3: 特征对齐不完美
**描述**: Pose变换后的特征可能无法完美对齐

**缓解措施**:
- 使用多尺度融合
- 基于pose距离的加权
- 可学习的对齐模块

## 预期效果

1. **准确率提升**: 更好的历史信息利用
2. **一致性提升**: pose变化时的特征一致性更好
3. **稳定性提升**: 减少由于pose变化导致的不稳定

## 时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 1 | 修改SDFFormer | 2小时 |
| 2 | 实现工具类 | 3小时 |
| 3 | 修改StreamSDFFormerIntegrated | 4小时 |
| 4 | 编写测试 | 4小时 |
| 5 | 调试和优化 | 4小时 |
| **总计** | | **17小时** |
