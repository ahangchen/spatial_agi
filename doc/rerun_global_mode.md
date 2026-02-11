# Rerun可视化 - 全局模式说明

## 更新内容

### v2.0 - 全局模式 (2026-02-11)

实现了全局模式的Rerun可视化，所有epoch的数据都保存到单个.rrd文件中。

#### 主要改进

1. **单文件输出**
   - 之前：每个epoch一个.rrd文件
   - 现在：所有数据保存到`training.rrd`一个文件
   - 优势：文件管理更简单，便于查看整体训练过程

2. **全局时间戳**
   - 时间戳计算：`epoch * n_view + frame_index`
   - 确保不同epoch的数据在时间轴上不重叠
   - 例如：
     - Epoch 0, Frame 0: timestamp = 0
     - Epoch 0, Frame 4: timestamp = 4
     - Epoch 1, Frame 0: timestamp = 5
     - Epoch 1, Frame 4: timestamp = 9

3. **性能优化**
   - 只初始化一次recording
   - 持续追加数据到同一文件
   - 减少I/O开销

#### 代码修改

**RerunVisualizer类**
```python
class RerunVisualizer:
    def __init__(self, save_dir: str = "viz", global_mode: bool = True):
        self.global_mode = global_mode
        self.recording_started = False

        if global_mode:
            self.output_path = os.path.join(save_dir, "training.rrd")
        else:
            self.output_path = None

    def start_recording(self, epoch: int = 0, batch_idx: int = 0):
        if self.global_mode and self.recording_started:
            return  # 全局模式且已初始化，跳过
        # ... 初始化recording

    def log_sample(self, batch_data: Dict, epoch: int, n_view: int):
        # 计算全局时间戳
        timestamp = epoch * n_view + frame_idx
        rr.set_time_sequence("frame_nr", timestamp)
        # ... 记录数据
```

**训练脚本**
```python
# 创建可视化器（全局模式）
visualizer = RerunVisualizer(save_dir=args.rerun_viz_dir, global_mode=True)
visualizer.start_recording()  # 只初始化一次

# 训练循环
for epoch in range(args.epochs):
    # ... 训练代码 ...

    if visualizer and (epoch % args.rerun_viz_freq == 0):
        viz_data = prepare_visualization_data(last_batch, last_outputs, seq_len)
        visualizer.log_sample(viz_data, epoch, n_view=seq_len)  # 只调用log_sample

# 训练结束后
visualizer.finish_recording()
```

#### 使用方法

**启用全局模式（默认）**
```bash
cd /home/cwh/coding/former3d

# 训练并启用可视化
python train_stream_integrated.py \
    --enable-rerun-viz \
    --data-root /path/to/tartanair \
    --epochs 10 \
    --batch-size 2

# 每5个epoch记录一次
python train_stream_integrated.py \
    --enable-rerun-viz \
    --rerun-viz-freq 5 \
    --data-root /path/to/tartanair
```

**使用分散模式（向后兼容）**
```python
from rerun_visualizer import RerunVisualizer

# 创建可视化器时指定global_mode=False
visualizer = RerunVisualizer(save_dir='viz', global_mode=False)
```

#### 输出文件

**全局模式（默认）**
```
viz/
└── training.rrd  # 包含所有epoch的数据
```

**分散模式**
```
viz/
├── epoch_0000/
│   └── batch_XXXX.rrd
├── epoch_0001/
│   └── batch_XXXX.rrd
└── ...
```

#### 查看可视化

```bash
# 使用Rerun Viewer打开训练文件
rerun viz/training.rrd

# 或启动Viewer后打开文件
rerun
# 然后在界面中 File -> Open -> 选择training.rrd文件
```

#### 在Viewer中查看

1. **时间轴操作**
   - 使用时间轴控制器浏览不同epoch
   - 时间戳显示：`0, 1, 2, ..., N`
   - 每个epoch有`n_view`个时间点

2. **对比不同epoch**
   - 可以在同一时间轴上查看不同epoch的效果
   - 方便观察训练过程中的变化
   - 例如：
     - 时间戳0-4: Epoch 0的帧
     - 时间戳5-9: Epoch 1的帧
     - 时间戳10-14: Epoch 2的帧

3. **3D和2D视图**
   - 3D视图：查看场景、相机位姿、点云
   - 2D视图：查看RGB图像、深度图
   - 可以调整视图布局和颜色映射

#### 时间戳设计

**公式**
```
timestamp = epoch * n_view + frame_index
```

**示例（n_view=5）**
| Epoch | Frame | Timestamp |
|-------|--------|-----------|
| 0     | 0      | 0         |
| 0     | 1      | 1         |
| 0     | 2      | 2         |
| 0     | 3      | 3         |
| 0     | 4      | 4         |
| 1     | 0      | 5         |
| 1     | 1      | 6         |
| 1     | 2      | 7         |
| ...   | ...    | ...       |

**特性**
- ✅ 时间戳严格递增
- ✅ 不同epoch不重叠
- ✅ 方便定位特定epoch的帧
- ✅ 适合查看训练进度

#### 性能对比

| 特性 | 分散模式 | 全局模式 |
|------|---------|---------|
| 文件数量 | 每epoch一个 | 全部一个 |
| 初始化次数 | 每epoch一次 | 训练开始一次 |
| I/O操作 | 频繁 | 少 |
| 文件大小 | 每个文件小 | 单个文件大 |
| 查看方便度 | 需要打开多个文件 | 一个文件查看全部 |

#### 测试结果

```
测试结果汇总
============================================================
全局模式                : ✅ 通过
时间戳计算               : ✅ 通过

总计: 2/2 测试通过
```

- ✅ 全局模式测试 - 单个文件生成成功
- ✅ 时间戳计算 - 无重复且严格递增
- ✅ 3个epoch数据正确记录到training.rrd（299.58 KB）

#### 已知限制

1. **sdf_pred警告**
   - 警告：`Position3DBatch: ValueError(Expected either a flat array with a length multiple of 3 elements...)`
   - 原因：sdf_pred格式可能不匹配
   - 影响：预测数据可能无法正确显示
   - 建议：根据实际模型输出格式调整

2. **文件大小**
   - 长期训练时，training.rrd会变得很大
   - 建议：使用--rerun-viz-freq减少记录频率

3. **中断恢复**
   - 如果训练中断，已记录的数据会保存在.rrd文件中
   - 重新训练时会覆盖现有文件

#### 常见问题

**Q: 如何只查看特定epoch的数据？**
A: 在Rerun Viewer中，使用时间轴控制器跳转到对应的时间戳范围。

**Q: 如何减少.rrd文件大小？**
A: 使用`--rerun-viz-freq`参数减少记录频率，例如`--rerun-viz-freq 5`每5个epoch记录一次。

**Q: 可以同时使用全局模式和分散模式吗？**
A: 可以，通过`global_mode`参数控制。默认使用全局模式。

**Q: 如何在训练过程中实时查看？**
A: 当前版本只支持离线保存。实时可视化需要使用gRPC连接，这是未来功能。

#### 向后兼容性

- ✅ 完全向后兼容分散模式
- ✅ 可以通过`global_mode=False`切换
- ✅ 现有代码无需修改即可使用

#### Git提交

```
commit e2fc73f
feat: 实现全局模式Rerun可视化
```

## 参考资料

- Rerun文档: https://rerun.io/docs
- Python API: https://ref.rerun.io/docs/python
- 示例代码: https://github.com/rerun-io/rerun/tree/latest/examples/python
