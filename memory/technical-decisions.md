# 技术决策与问题解决

## Batch Size问题 (2026-02-10)
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

## 代码架构优化
**显式投影模式**:
- 使用`PoseAwareFeatureProjector`替代`PoseProjection`
- 删除未使用的`_create_legacy_state`方法
- 移除`lightweight_state_mode`模式

**状态管理**:
- 总是创建`dense_grids`
- 总是保存`dense_grids`到状态
- 简化`_create_new_state`逻辑
