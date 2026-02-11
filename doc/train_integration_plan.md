# Rerun可视化集成到训练脚本 - 开发计划

## 目标
将RerunVisualizer集成到`train_stream_integrated.py`，在训练过程中自动保存可视化数据。

## 当前状态
- ✅ RerunVisualizer类已实现并测试通过
- ✅ 训练脚本结构已了解
- ❌ 可视化功能尚未集成

## 任务分解

### 任务1：添加命令行参数
- [ ] 添加`--enable-rerun-viz`参数（启用可视化开关）
- [ ] 添加`--rerun-viz-dir`参数（可视化输出目录）
- [ ] 添加`--rerun-viz-freq`参数（可视化频率，每N个epoch记录一次）

### 任务2：导入和初始化可视化器
- [ ] 导入RerunVisualizer类
- [ ] 将rerun_visualizer.py复制到former3d目录
- [ ] 在main函数中根据命令行参数创建可视化器实例

### 任务3：修改train_epoch_stream函数
- [ ] 添加visualizer参数
- [ ] 在epoch结束时记录最后一个batch
- [ ] 准备符合RerunVisualizer期望的数据格式
- [ ] 调用viz.log_sample和viz.finish_recording

### 任务4：数据格式适配
- [ ] 处理batch数据的格式转换（Tensor -> numpy）
- [ ] 处理模型输出的格式（outputs -> sdf_pred, occ_pred）
- [ ] 添加深度图提取（从TSDF中估算或直接使用）
- [ ] 处理TSDF和占用真值的格式

### 任务5：测试集成
- [ ] 干运行测试（不训练，只测试可视化）
- [ ] 小规模训练测试（1个epoch，小batch）
- [ ] 验证.rrd文件生成
- [ ] 使用Rerun Viewer打开验证

### 任务6：清理和文档
- [ ] 清理测试文件
- [ ] 更新使用文档
- [ ] 添加示例命令

## 数据格式分析

### 当前训练脚本输出
```python
# Batch数据
batch = {
    'rgb_images': (batch, n_view, 3, H, W)  # [batch, n_view, 3, H, W]
    'poses': (batch, n_view, 4, 4)            # [batch, n_view, 4, 4]
    'intrinsics': (batch, n_view, 3, 3)       # [batch, n_view, 3, 3]
    'tsdf': (batch, 1, D, H, W)               # [batch, 1, D, H, W]
}

# 模型输出（可能格式）
outputs = {
    'sdf': (batch, n_view, num_points, 1)  # [batch, n_view, N, 1]
    # 或其他格式
}
```

### RerunVisualizer期望格式
```python
batch_data = {
    'rgb_images': (batch, n_view, H, W, 3)   # 注意：通道在最后
    'depth': (batch, n_view, H, W)             # 需要计算或提取
    'poses': (batch, n_view, 4, 4)
    'intrinsics': (batch, n_view, 3, 3)
    'tsdf': (batch, 1, D, H, W)
    'occupancy': (batch, 1, D, H, W)          # 从TSDF计算
    'sdf_pred': (batch, num_points, 1)         # 可选
    'occ_pred': (batch, 1, D, H, W)            # 可选
}
```

### 需要进行的转换
1. **RGB图像**: (batch, n_view, 3, H, W) -> (batch, n_view, H, W, 3)
   - 使用`permute(0, 1, 3, 4, 2)`

2. **深度图**: 从TSDF计算或使用模拟数据
   - 方案A: 使用TSDF的第一层作为深度近似
   - 方案B: 从TSDF反投影深度
   - 方案C: 使用零深度（简化）

3. **占用真值**: 从TSDF计算
   - `occupancy = (abs(tsdf) < threshold).float()`

4. **模型输出**: 需要实际运行查看格式

## 集成点设计

### 方案A：在train_epoch_stream中直接记录
```python
def train_epoch_stream(..., visualizer=None, epoch=0):
    # ... 训练代码 ...

    for batch_idx, batch in enumerate(dataloader):
        # ... 训练逻辑 ...
        last_batch = batch
        last_outputs = outputs

    # epoch结束时记录
    if visualizer and (epoch % viz_freq == 0):
        # 准备可视化数据
        viz_data = prepare_visualization_data(last_batch, last_outputs)
        # 记录
        visualizer.start_recording(epoch, batch_idx)
        visualizer.log_sample(viz_data, epoch, n_view)
        visualizer.finish_recording()
```

### 方案B：在main函数中处理
```python
# 在训练循环中
for epoch in range(args.epochs):
    train_loss, last_data = train_epoch_stream(..., return_data=True)

    if viz_enabled and (epoch % viz_freq == 0):
        visualizer.start_recording(epoch, 0)
        visualizer.log_sample(last_data, epoch, n_view)
        visualizer.finish_recording()
```

**决定**: 使用方案B，保持train_epoch_stream的简洁性。

## 实现步骤

1. ✅ 阅读和理解CLAUDE.md编程规范
2. ✅ 理解train_stream_integrated.py结构
3. ⬜ 创建集成计划文档（本文档）
4. ⬜ 修改train_stream_integrated.py
5. ⬜ 创建测试脚本
6. ⬜ 测试集成
7. ⬜ 清理和提交

## 风险和挑战

### 风险1：深度图缺失
**影响**: 可视化不完整
**缓解**: 使用TSDF的第一层作为深度近似

### 风险2：模型输出格式不确定
**影响**: 预测数据无法记录
**缓解**: 添加日志输出实际格式，根据实际情况适配

### 风险3：显存占用
**影响**: 训练时显存不足
**缓解**: 使用小batch测试，或只在特定epoch可视化

### 风险4：训练循环被中断
**影响**: 可视化文件损坏
**缓解**: 添加try-except保护可视化代码

## 成功标准
- [ ] 命令行参数正确解析
- [ ] 可视化器正确初始化
- [ ] 训练循环正常运行
- [ ] .rrd文件成功生成
- [ ] Rerun Viewer可以打开文件
- [ ] 至少RGB图像和相机位姿正确显示
