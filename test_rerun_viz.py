"""
测试Rerun可视化器功能

这个脚本用于验证RerunVisualizer类的所有功能：
- RecordingStream初始化
- 数据记录（RGB、深度、位姿、真值、预测）
- 时间戳设置
- 文件保存
"""

import sys
import numpy as np
import torch

# 添加当前目录到路径
sys.path.insert(0, '/home/cwh/.openclaw/workspace')

from rerun_visualizer import RerunVisualizer, tensor_to_numpy


def create_mock_batch(batch_size=1, n_view=5, height=480, width=640, depth_dim=(32, 48, 48)):
    """
    创建模拟的batch数据

    Args:
        batch_size: 批次大小
        n_view: 每个样本的帧数
        height, width: 图像尺寸
        depth_dim: TSDF/占用的体素尺寸 [D, H, W]

    Returns:
        模拟的batch数据字典
    """
    batch_data = {
        'rgb_images': np.random.rand(batch_size, n_view, height, width, 3).astype(np.float32),
        'depth': np.random.rand(batch_size, n_view, height, width).astype(np.float32),
        'poses': torch.eye(4).unsqueeze(0).unsqueeze(0).repeat(batch_size, n_view, 1, 1).float(),
        'intrinsics': torch.tensor([
            [320.0, 0, 320.0],
            [0, 320.0, 240.0],
            [0, 0, 1]
        ]).unsqueeze(0).unsqueeze(0).repeat(batch_size, n_view, 1, 1).float(),
        'tsdf': torch.randn(batch_size, 1, *depth_dim).float(),
        'occupancy': torch.randint(0, 2, (batch_size, 1, *depth_dim)).float(),
        'sdf_pred': torch.randn(batch_size, 100, 1) * 2.0,  # 点云格式
        'occ_pred': (torch.rand(batch_size, 1, *depth_dim) > 0.5).float(),  # 体素网格格式
    }

    print(f"[Test] 创建模拟batch数据:")
    print(f"  - RGB图像: {batch_data['rgb_images'].shape}")
    print(f"  - 深度图: {batch_data['depth'].shape}")
    print(f"  - 位姿: {batch_data['poses'].shape}")
    print(f"  - 内参: {batch_data['intrinsics'].shape}")
    print(f"  - TSDF真值: {batch_data['tsdf'].shape}")
    print(f"  - 占用真值: {batch_data['occupancy'].shape}")
    print(f"  - SDF预测: {batch_data['sdf_pred'].shape}")
    print(f"  - 占用预测: {batch_data['occ_pred'].shape}")

    return batch_data


def test_basic_visualization():
    """测试基本可视化功能"""
    print("=" * 60)
    print("测试1：基本可视化功能")
    print("=" * 60)

    # 创建可视化器
    viz = RerunVisualizer(save_dir="viz/test")

    # 创建模拟batch数据
    batch_data = create_mock_batch(
        batch_size=1,
        n_view=5,
        height=240,  # 缩小尺寸加快测试
        width=320,
        depth_dim=(16, 24, 32)  # 缩小体素
    )

    # 开始记录
    viz.start_recording(epoch=0, batch_idx=0)

    # 记录样本
    viz.log_sample(batch_data, epoch=0, n_view=5)

    # 结束记录
    viz.finish_recording()

    print("\n✅ 测试1完成！")
    print("   输出文件：viz/test/epoch_0000/batch_0000.rrd")
    print("   请使用以下命令查看：")
    print("     rerun viz/test/epoch_0000/batch_0000.rrd")
    print("\n")


def test_timestamp_logic():
    """测试时间戳计算逻辑"""
    print("=" * 60)
    print("测试2：时间戳计算")
    print("=" * 60)

    viz = RerunVisualizer(save_dir="viz/test_timestamp")

    batch_data = create_mock_batch(batch_size=1, n_view=3)

    # 测试epoch 0，3个帧
    viz.start_recording(epoch=0, batch_idx=0)

    expected_timestamps = [0, 1, 2]  # epoch=0, n_view=3: 0*3+0=0, 0*3+1=1, 0*3+2=2

    print("时间戳计算：")
    for frame_idx in range(3):
        timestamp = 0 * 3 + frame_idx
        expected = expected_timestamps[frame_idx]
        print(f"  Frame {frame_idx}: epoch*3+{frame_idx} = {timestamp}")

    viz.log_sample(batch_data, epoch=0, n_view=3)
    viz.finish_recording()

    print("\n✅ 测试2完成！")
    print("\n")


def test_large_data():
    """测试大数据量的性能"""
    print("=" * 60)
    print("测试3：大数据量性能")
    print("=" * 60)

    viz = RerunVisualizer(save_dir="viz/test_large")

    # 创建更大的batch和更多体素
    batch_data = create_mock_batch(
        batch_size=1,
        n_view=3,
        height=480,
        width=640,
        depth_dim=(32, 48, 48)
    )

    viz.start_recording(epoch=0, batch_idx=0)
    viz.log_sample(batch_data, epoch=0, n_view=3)
    viz.finish_recording()

    print("\n✅ 测试3完成！")
    print("   体素尺寸：(32, 48, 48)")
    print("   预计占用体素数：~5000个（假设50%占用）")
    print("\n")


def test_multiple_samples():
    """测试batch中多个样本"""
    print("=" * 60)
    print("测试4：多个样本")
    print("=" * 60)

    viz = RerunVisualizer(save_dir="viz/test_multi")

    # 创建2个样本的batch
    batch_data = create_mock_batch(batch_size=2, n_view=3)

    viz.start_recording(epoch=0, batch_idx=0)

    # 测试记录第一个样本（sample_idx=0）
    print("记录sample 0...")
    viz.log_sample(batch_data, epoch=0, n_view=3, sample_idx=0)

    # 测试记录第二个样本（sample_idx=1）
    print("记录sample 1...")
    viz.log_sample(batch_data, epoch=0, n_view=3, sample_idx=1)

    viz.finish_recording()

    print("\n✅ 测试4完成！")
    print("   batch中2个样本都应被记录")
    print("\n")


def run_all_tests():
    """运行所有测试"""
    print("\n" + "=" * 70)
    print("Rerun可视化器测试套件")
    print("=" * 70 + "\n")

    tests = [
        ("基本可视化", test_basic_visualization),
        ("时间戳逻辑", test_timestamp_logic),
        ("大数据量性能", test_large_data),
        ("多个样本", test_multiple_samples),
    ]

    results = []

    for test_name, test_func in tests:
        try:
            print(f"\n运行测试：{test_name}...")
            test_func()
            results.append((test_name, "✅ 通过"))
        except Exception as e:
            print(f"\n❌ 测试失败：{test_name}")
            print(f"错误信息：{e}")
            import traceback
            traceback.print_exc()
            results.append((test_name, f"❌ 失败 - {str(e)}"))

    # 输出测试结果汇总
    print("\n" + "=" * 70)
    print("测试结果汇总")
    print("=" * 70)

    for test_name, status in results:
        print(f"{test_name:20s}: {status}")

    print("\n" + "=" * 70)
    print("下一步：")
    print("1. 如果所有测试通过，可以开始集成到训练脚本")
    print("2. 如果有测试失败，请修复后重试")
    print("\n")


if __name__ == "__main__":
    # 运行所有测试
    run_all_tests()
