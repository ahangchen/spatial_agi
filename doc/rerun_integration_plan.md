# Rerun.io 可视化集成开发计划

## 项目概述
为Former3D流式训练添加Rerun.io可视化功能，实现训练数据的实时/离线可视化。

## 开发目标

### 核心功能
1. 每个epoch结束时，在`viz`目录保存当前batch最后一个样本的可视化数据
2. 使用`.rrd`格式保存（Rerun本地格式）
3. 支持以下数据类型：
   - RGB图像
   - 相机位姿（pose）
   - 深度图
   - SDF真值
   - 占用真值（occupancy）
   - 预测的占用
   - 预测的SDF
4. 时间戳格式：`epoch数 * n_view + frame_index`
5. 支持使用Rerun Viewer打开`.rrd`文件进行交互式可视化

## 技术方案

### Rerun.io 核心概念

#### 1. 实体（Entity）路径设计
采用分层结构设计：
```
training/epoch_{epoch}/
  └── batch_{batch_idx}/
        └── sample_{sample_idx}/
            ├── camera/                     # 相机相关
            │   ├── image              # RGB图像
            │   ├── depth              # 深度图
            │   ├── intrinsics          # 相机内参
            │   └── pose               # 相机位姿
            └── scene/                      # 场景相关
                ├── tsdf_gt            # SDF真值（点云/体素）
                ├── occ_gt             # 占用真值
                ├── sdf_pred            # SDF预测
                └── occ_pred            # 占用预测
```

#### 2. 时间线（Timeline）
- **Timeline名称**: `frame_nr`
- **时间戳计算**: `epoch * n_view + frame_idx`
- **Rationale**:
  - 同一batch内的帧按顺序排列
  - 不同epoch的帧不会重叠（时间戳递增）
  - 方便对比不同epoch的训练效果

#### 3. 数据格式

| 数据类型 | Rerun Archetype | 说明 |
|---------|------------------|------|
| RGB图像 | `rr.Image` | 原始图像，uint8格式 |
| 深度图 | `rr.DepthImage` | 单通道浮点深度，可映射到颜色 |
| 相机位姿 | `rr.Transform3D` | 4x4变换矩阵 |
| 相机内参 | `rr.Pinhole` | 3x3内参矩阵 |
| TSDF点云 | `rr.Points3D` | 带SDF值的3D点 |
| 占用网格 | `rr.Volume` | 3D体素网格 |
| 占用点云 | `rr.Points3D` | 占用的体素中心点 |

#### 4. 文件格式
- **保存格式**: `.rrd` (Rerun Recording Data)
- **保存方式**:
  - 方案A: `rr.RecordingStream.save(path)` - 保存完整的记录
  - 方案B: `rr.FileSink` - 实时写入到文件
- **目录结构**:
  ```
  viz/
  ├── epoch_0/
  │   └── batch_0.rrd
  ├── epoch_1/
  │   └── batch_0.rrd
  └── ...
  ```
- **命名规范**: `epoch_{epoch:04d}_batch_{batch_idx:04d}.rrd`

## 开发阶段

### 阶段1：环境准备（0.5天）
- [ ] 安装Rerun SDK
- [ ] 验证安装：运行示例代码
- [ ] 创建`viz/`目录
- [ ] 添加依赖到`requirements.txt`

**任务清单**：
```bash
# 安装rerun-sdk
pip install rerun-sdk

# 验证安装
python -c "import rerun as rr; print(rr.__version__)"

# 创建可视化目录
mkdir -p viz

# 添加到requirements.txt
echo "rerun-sdk>=0.15.0" >> requirements.txt
```

### 阶段2：核心可视化类设计（1天）
- [ ] 设计`RerunVisualizer`类
- [ ] 实现RecordingStream初始化
- [ ] 实现日志路径管理
- [ ] 实现时间戳计算逻辑
- [ ] 实现数据类型转换函数

**类设计**：
```python
class RerunVisualizer:
    def __init__(self, save_dir="viz"):
        """初始化可视化器"""
        self.save_dir = save_dir
        os.makedirs(save_dir, exist_ok=True)
        self.recording_stream = None

    def start_recording(self, epoch, batch_idx):
        """开始一个新的记录"""
        output_path = os.path.join(
            self.save_dir,
            f"epoch_{epoch:04d}",
            f"batch_{batch_idx:04d}.rrd"
        )

        self.recording_stream = rr.RecordingStream(
            application_id="former3d_training",
            recording_id=f"epoch{epoch}_batch{batch_idx}"
        )
        self.recording_stream.set_sinks(rr.FileSink(output_path))

        # 设置时间线
        rr.set_time("frame_nr")

    def log_sample(self, batch_data, epoch, n_view):
        """记录一个样本的所有帧"""
        # 取batch中最后一个样本
        sample_idx = batch_data['rgb_images'].shape[0] - 1

        for frame_idx in range(n_view):
            timestamp = epoch * n_view + frame_idx
            rr.set_time("frame_nr", sequence=timestamp)

            # 记录RGB图像
            self._log_rgb_image(batch_data, frame_idx, sample_idx)

            # 记录深度图
            self._log_depth_image(batch_data, frame_idx, sample_idx)

            # 记录相机参数
            self._log_camera(batch_data, frame_idx, sample_idx)

            # 记录真值
            self._log_ground_truth(batch_data, frame_idx, sample_idx)

            # 记录预测
            if 'sdf_pred' in batch_data:
                self._log_predictions(batch_data, frame_idx, sample_idx)

    def _log_rgb_image(self, batch_data, frame_idx, sample_idx):
        """记录RGB图像"""
        rgb = batch_data['rgb_images'][sample_idx, frame_idx]  # [H, W, 3]
        rr.log(
            "batch/sample/camera/image",
            rr.Image(rgb)
        )

    def _log_depth_image(self, batch_data, frame_idx, sample_idx):
        """记录深度图"""
        depth = batch_data['depth'][sample_idx, frame_idx]  # [H, W]
        # 将深度映射到颜色以便可视化
        depth_normalized = (depth - depth.min()) / (depth.max() - depth.min() + 1e-6)
        rr.log(
            "batch/sample/camera/depth",
            rr.DepthImage(depth, meter=1.0, colormap="Viridis")
        )

    def _log_camera(self, batch_data, frame_idx, sample_idx):
        """记录相机参数"""
        # 记录内参
        K = batch_data['intrinsics'][sample_idx, frame_idx]  # [3, 3]
        width, height = 640, 480  # 或从图像shape推断

        rr.log(
            "batch/sample/camera",
            rr.Pinhole(
                resolution=[width, height],
                intrinsics_matrix=K
            )
        )

        # 记录位姿
        pose = batch_data['poses'][sample_idx, frame_idx]  # [4, 4]
        rr.log(
            "batch/sample/camera/pose",
            rr.Transform3D(mat=pose, from_parent=True, axis_length=0.5)
        )

    def _log_ground_truth(self, batch_data, frame_idx, sample_idx):
        """记录真值"""
        # TSDF真值 - 从体素网格中提取
        tsdf_gt = batch_data['tsdf'][sample_idx]  # [1, D, H, W]
        # 转换为点云格式
        occ_mask = torch.abs(tsdf_gt) < 0.5
        occupied_indices = torch.nonzero(occ_mask[0].t())  # [N, 3]

        if len(occupied_indices) > 0:
            # 提取体素坐标
            grid_shape = tsdf_gt.shape[1:]  # (D, H, W)
            d, h, w = grid_shape

            # 创建体素坐标
            voxel_coords = occupied_indices.float()
            # 将索引转换为世界坐标（需要origin信息）
            # 这里简化处理，直接记录SDF值
            sdf_values = tsdf_gt[0][
                occupied_indices[:, 0],  # d
                occupied_indices[:, 1],  # h
                occupied_indices[:, 2]   # w
            ]

            rr.log(
                "batch/sample/scene/tsdf_gt",
                rr.Points3D(
                    positions=occupied_indices,
                    colors=sdf_values,
                    radii=0.05
                )
            )

        # 占用真值
        occ_gt = batch_data['occupancy'][sample_idx]  # [1, D, H, W]
        rr.log(
            "batch/sample/scene/occ_gt",
            rr.Volume(
                data=occ_gt,
                colormap="Turbo"
            )
        )

    def _log_predictions(self, batch_data, frame_idx, sample_idx):
        """记录预测结果"""
        # SDF预测 - 从模型输出提取
        if 'sdf_pred' in batch_data:
            sdf_pred = batch_data['sdf_pred'][sample_idx]  # [N, 1]
            rr.log(
                "batch/sample/scene/sdf_pred",
                rr.Points3D(
                    positions=sdf_pred[:, :3],
                    colors=sdf_pred[:, :1],
                    radii=0.05
                )
            )

        # 占用预测
        if 'occ_pred' in batch_data:
            occ_pred = batch_data['occ_pred'][sample_idx]  # [D, H, W] or [N]
            if len(occ_pred.shape) == 3:
                rr.log(
                    "batch/sample/scene/occ_pred",
                    rr.Points3D(
                        positions=occ_pred,
                        radii=0.05,
                        colors=[0, 255, 0]  # 绿色表示占用
                    )
                )
            else:
                rr.log(
                    "batch/sample/scene/occ_pred",
                    rr.Volume(
                        data=occ_pred,
                        colormap="Turbo"
                    )
                )

    def finish_recording(self):
        """结束记录并保存"""
        if self.recording_stream:
            self.recording_stream.flush()
            self.recording_stream.disconnect()
            self.recording_stream = None
```

### 阶段3：集成到训练脚本（1天）
- [ ] 修改`train_stream_integrated.py`
- [ ] 添加可视化器初始化
- [ ] 在epoch结束时调用可视化
- [ ] 添加命令行参数控制可视化开关
- [ ] 处理模型输出数据格式

**集成点**：
```python
# 在train_stream_integrated.py中添加

# 导入可视化模块
from rerun_visualizer import RerunVisualizer

# 在__init__中添加
parser.add_argument('--enable-rerun-viz', action='store_true',
                    help='启用Rerun可视化')
parser.add_argument('--rerun-viz-dir', type=str, default='viz',
                    help='Rerun可视化输出目录')

# 在train_epoch_stream函数中添加可视化逻辑
def train_epoch_stream(model, dataloader, optimizer, device, args, epoch, visualizer=None):
    """
    原有：...
    """

    if visualizer is None:
        visualizer = RerunVisualizer(save_dir=args.rerun_viz_dir)

    for batch_idx, batch in enumerate(dataloader):
        # ... 原有训练逻辑 ...

    # epoch结束时保存可视化
    if visualizer:
        visualizer.finish_recording()

# 修改train_epoch_stream函数签名，添加visualizer参数
# 并在epoch开始时调用visualizer.start_recording(epoch, last_batch_idx)
```

### 阶段4：数据适配与转换（0.5天）
- [ ] 实现Tensor到Numpy转换
- [ ] 处理SDF体素网格到点云的转换
- [ ] 处理占用网格的格式转换
- [ ] 处理相机位姿格式（4x4 vs 3x4）

**关键转换函数**：
```python
def tensor_to_numpy(tensor):
    """安全地将Tensor转换为Numpy数组"""
    if isinstance(tensor, torch.Tensor):
        return tensor.detach().cpu().numpy()
    return np.asarray(tensor)

def convert_pose_matrix(pose_tensor):
    """转换相机位姿格式"""
    # PyTorch: [4, 4] (row-major)
    # Rerun需要: row-major或column-major都可以，但最好明确
    pose_np = tensor_to_numpy(pose_tensor)
    return pose_np

def extract_sdf_points(tsdf_tensor, threshold=0.5):
    """从TSDF体素网格提取占用点"""
    tsdf_np = tensor_to_numpy(tsdf_tensor)
    occ_mask = np.abs(tsdf_np) < threshold

    if occ_mask.ndim == 4:  # [1, D, H, W]
        occ_mask = occ_mask[0]

    # 获取占用体素的索引
    indices = np.argwhere(occ_mask)

    if len(indices) == 0:
        return None, None  # 没有占用体素

    # 索引格式: [N, 3] (d, h, w)
    points = indices.astype(np.float32)
    # SDF值用于颜色
    sdf_values = tsdf_np[occ_mask].reshape(-1, 1)

    return points, sdf_values
```

### 阶段5：蓝图（Blueprint）配置（0.5天）
- [ ] 设计默认3D视图布局
- [ ] 设计2D图像视图布局
- [ ] 设计空间关系可视化
- [ ] 配置颜色映射方案

**蓝图设计**：
```python
from rerun.blueprint import Blueprint, Blueprint3D, View2D, SpatialRelationView

def create_default_blueprint():
    """创建默认的可视化蓝图"""

    # 3D视图 - 显示场景
    view_3d = Blueprint3D(
        name="Scene 3D",
        contents=[
            # 占用真值（红色）
            rr.log("batch/sample/scene/occ_gt"),
            # 占用预测（绿色）
            rr.log("batch/sample/scene/occ_pred"),
            # SDF真值（蓝色）
            rr.log("batch/sample/scene/tsdf_gt"),
            # SDF预测（黄色）
            rr.log("batch/sample/scene/sdf_pred"),
            # 相机轨迹
            rr.log("batch/sample/camera/pose"),
        ],
    )

    # 2D视图 - 图像面板
    # RGB图像
    rgb_view = View2D(
        name="RGB Image",
        contents=[
            rr.log("batch/sample/camera/image"),
        ],
    )

    # 深度图
    depth_view = View2D(
        name="Depth Image",
        contents=[
            rr.log("batch/sample/camera/depth"),
        ],
    )

    # 空间关系 - 显示相机与场景
    spatial_view = SpatialRelationView(
        name="Camera-Scene Relation",
        contents=[
            # 相机位姿
            rr.log("batch/sample/camera/pose"),
            # 相机内参
            rr.log("batch/sample/camera"),
            # 场景点云
            rr.log("batch/sample/scene/tsdf_gt"),
        ],
    )

    # 组合蓝图
    blueprint = Blueprint(
        panels=[view_3d, rgb_view, depth_view, spatial_view],
    )

    return blueprint
```

### 阶段6：测试与验证（0.5天）
- [ ] 单元测试：创建RerunVisualizer并记录数据
- [ ] 集成测试：运行训练1个epoch并检查输出
- [ ] 文件验证：检查.rrd文件是否可正常打开
- [ ] 可视化验证：使用Rerun Viewer打开.rrd文件

**测试脚本**：
```python
# test_rerun_viz.py
import numpy as np
import torch
from rerun_visualizer import RerunVisualizer

def test_visualizer():
    """测试可视化器功能"""
    # 创建可视化器
    viz = RerunVisualizer(save_dir="viz/test")

    # 开始记录
    viz.start_recording(epoch=0, batch_idx=0)

    # 创建模拟batch数据
    batch_data = {
        'rgb_images': torch.randn(1, 5, 3, 480, 640),  # [batch, n_view, C, H, W]
        'depth': torch.rand(1, 5, 480, 640),
        'poses': torch.eye(4).unsqueeze(0).unsqueeze(0).repeat(1, 5, 1, 1),
        'intrinsics': torch.eye(3).unsqueeze(0).unsqueeze(0).repeat(1, 5, 1, 1),
        'tsdf': torch.randn(1, 1, 48, 48, 32),
        'occupancy': torch.randint(0, 2, (1, 48, 48, 32)).float(),
        'sdf_pred': torch.randn(100, 1) * 2,
        'occ_pred': torch.rand(100, 3),
    }

    # 记录样本
    viz.log_sample(batch_data, epoch=0, n_view=5)

    # 结束记录
    viz.finish_recording()

    print("✅ 测试完成，请用Rerun Viewer打开 viz/test/epoch_0/batch_0.rrd")

if __name__ == "__main__":
    test_visualizer()
```

### 阶段7：文档与使用指南（0.5天）
- [ ] 编写`doc/rerun_visualization_guide.md`
- [ ] 创建示例可视化截图
- [ ] 编写README说明如何使用
- [ ] 添加交互式查看指南

**文档结构**：
```markdown
# Rerun可视化使用指南

## 安装
```bash
pip install rerun-sdk
```

## 运行训练时启用可视化
```bash
python train_stream_integrated.py \
    --enable-rerun-viz \
    --rerun-viz-dir viz
```

## 查看可视化结果

### 方法1：使用Rerun Viewer（推荐）
```bash
# 启动Viewer
rerun

# 打开.rrd文件
File -> Open -> viz/epoch_0/batch_0.rrd
```

### 方法2：命令行直接打开
```bash
rerun viz/epoch_0/batch_0.rrd
```

## 可视化内容

每个epoch的batch可视化包含：
- **RGB图像**：每一帧的输入图像
- **深度图**：每一帧的深度信息（带颜色映射）
- **相机位姿**：相机的位置和朝向（3D坐标系）
- **相机内参**：内参矩阵和分辨率
- **SDF真值**：作为点云或体素网格的SDF真值
- **占用真值**：二值占用网格
- **SDF预测**：模型预测的SDF值（点云）
- **占用预测**：模型预测的占用（网格或点云）

## 时间线操作

- **时间线名称**: `frame_nr`
- **时间戳计算**: `epoch * n_view + frame_index`
- 例如：
  - Epoch 0, Frame 0: timestamp = 0
  - Epoch 0, Frame 4: timestamp = 4
  - Epoch 1, Frame 0: timestamp = 5
  - Epoch 1, Frame 4: timestamp = 9

## 自定义可视化

### 修改颜色映射
在`RerunVisualizer`类中可以自定义颜色：
```python
# 在_log_depth_image方法中
depth_colormap = "Turbo"  # 或 "Viridis", "Plasma", "Inferno"

# 在_log_ground_truth方法中
tsdf_colormap = "CoolWarm"  # SDF真值颜色
occ_colormap = "Greys"     # 占用真值颜色

# 在_log_predictions方法中
pred_colormap = "Green"  # 预测颜色
```

### 调整视图布局
可以修改`create_default_blueprint`函数来调整视图布局。
```

## 时间估算

| 阶段 | 预计时间 | 实际时间 | 说明 |
|--------|----------|---------|------|
| 阶段1 | 0.5天 | 环境准备 |
| 阶段2 | 1天 | 核心类设计与实现 |
| 阶段3 | 1天 | 集成到训练脚本 |
| 阶段4 | 0.5天 | 数据适配与转换 |
| 阶段5 | 0.5天 | 蓝图配置 |
| 阶段6 | 0.5天 | 测试与验证 |
| 阶段7 | 0.5天 | 文档编写 |
| **总计** | **4.5天** | |

## 技术挑战与解决方案

### 挑战1：模型输出数据格式不确定
**问题**：模型输出的SDF/占用可能是：
- 稀疏张量（spconv格式）
- 密集张量
- 点云格式

**解决方案**：
1. 在`train_epoch_stream`中添加日志输出，打印模型输出格式
2. 根据实际格式实现多个转换函数
3. 添加类型判断逻辑：
```python
def handle_model_output(output):
    """处理模型输出，支持多种格式"""
    if isinstance(output, dict):
        # 检查输出键
        if 'sdf' in output:
            # 稀疏格式
            return process_sparse_sdf(output['sdf'])
        elif 'fine' in output and isinstance(output['fine'], spconv.SparseConvTensor):
            # spconv格式
            return process_spconv_output(output['fine'])
        else:
            # 其他格式
            return process_dense_output(output)
    else:
        # Tensor格式
        return process_tensor_output(output)
```

### 挑战2：体素坐标转换
**问题**：从索引坐标转换到世界坐标需要origin信息

**解决方案**：
1. 在数据集类中记录并传递origin信息
2. 在可视化时使用origin进行坐标转换
3. 如果origin不可用，使用简化方案（仅记录体素索引+颜色）

### 挑战3：大型数据的性能
**问题**：大量体素点可能导致Rerun性能问题

**解决方案**：
1. 下采样：只记录部分占用点（如1000-5000个）
2. 使用`rr.Points3D`的batch记录功能
3. 添加日志级别控制：只在特定帧记录详细信息

### 挑战4：多GPU训练的batch索引
**问题**：DataParallel时batch索引与实际GPU的关系

**解决方案**：
1. 使用batch的最后一维的索引（已正确）
2. 不依赖batch_idx参数（可能不准确）

## 文件结构

```
former3d/
├── rerun_visualizer.py          # 新增：可视化核心类
├── train_stream_integrated.py    # 修改：集成可视化
├── test_rerun_viz.py           # 新增：测试脚本
└── doc/
    └── rerun_visualization_guide.md  # 新增：使用文档
```

## 成功标准

- [ ] Rerun SDK安装成功
- [ ] 可视化器可以正常初始化和记录
- [ ] 可以成功保存.rrd文件
- [ ] Rerun Viewer可以打开并显示.rrd文件内容
- [ ] 时间戳计算正确，不同epoch不重叠
- [ ] 所有数据类型（RGB、深度、位姿、真值、预测）都正确显示
- [ ] 3D视图和2D视图布局合理
- [ ] 文档完整，用户可以独立使用可视化功能

## 后续扩展

### Phase 8（可选）：实时可视化（1天）
- [ ] 实现gRPC实时流式可视化
- [ ] 在训练过程中实时更新可视化
- [ ] 添加训练曲线可视化（loss、accuracy等）

### Phase 9（可选）：对比可视化（0.5天）
- [ ] 实现epoch对比功能
- [ ] 支持同时查看多个epoch
- [ ] 添加差异高亮显示

## 风险评估

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| Rerun安装失败 | 无法可视化 | 低 | 提前检查pip版本 |
| .rrd文件损坏 | 数据丢失 | 低 | 添加异常处理 |
| 性能问题 | 训练变慢 | 中 | 限制下采样、异步保存 |
| 时间戳冲突 | 可视化混乱 | 低 | 使用唯一recording_id |
| 数据格式不匹配 | 可视化错误 | 中 | 详细日志输出 |

## 参考

- Rerun文档: https://rerun.io/docs
- Python API参考: https://ref.rerun.io/docs/python
- 示例代码: https://github.com/rerun-io/rerun/tree/latest/examples/python
