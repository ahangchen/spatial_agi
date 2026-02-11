"""
Rerun可视化模块

为Former3D流式训练提供Rerun.io可视化功能，支持：
- 实时/离线保存可视化数据到.rrd文件
- 可视化RGB图像、深度、位姿、真值和预测
- 时间戳格式：epoch * n_view + frame_index

使用方法：
    1. 在训练脚本中初始化可视化器
    2. 在epoch结束时调用log_sample记录最后一个batch
    3. 调用finish_recording保存并关闭
    4. 使用Rerun Viewer打开.rrd文件查看
"""

import os
import numpy as np
import torch
from typing import Dict, Optional, Union

import rerun as rr


class RerunVisualizer:
    """
    Rerun.io可视化器

    支持将训练数据记录到.rrd文件，并用Rerun Viewer交互式查看
    """

    def __init__(self, save_dir: str = "viz"):
        """
        初始化可视化器

        Args:
            save_dir: 可视化数据保存目录
        """
        self.save_dir = save_dir
        os.makedirs(save_dir, exist_ok=True)
        self.recording_stream = None

    def start_recording(self, epoch: int, batch_idx: int):
        """
        开始一个新的epoch记录

        Args:
            epoch: 当前epoch数
            batch_idx: 当前batch索引
        """
        output_path = os.path.join(
            self.save_dir,
            f"epoch_{epoch:04d}",
            f"batch_{batch_idx:04d}.rrd"
        )

        # 确保输出目录存在
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)

        print(f"[RerunViz] 开始记录 epoch {epoch}, batch {batch_idx} 到 {output_path}")

        # 初始化rerun应用
        rr.init("former3d_training", recording_id=f"epoch{epoch}_batch{batch_idx}")

        # 保存到文件
        rr.save(output_path)

        # 设置时间线，使用sequence类型确保帧按顺序排列
        # 使用set_time_sequence设置序列时间
        rr.set_time_sequence("frame_nr", 0)

    def log_sample(self, batch_data: Dict, epoch: int, n_view: int, sample_idx: Optional[int] = None):
        """
        记录一个样本的所有帧

        Args:
            batch_data: 包含所有数据的batch字典
            epoch: 当前epoch数
            n_view: 每个样本的帧数
            sample_idx: 样本在batch中的索引（默认使用最后一个）
        """
        # 如果没有指定sample_idx，使用最后一个样本
        if sample_idx is None:
            sample_idx = batch_data['rgb_images'].shape[0] - 1

        for frame_idx in range(n_view):
            # 计算时间戳：epoch * n_view + frame_idx
            timestamp = epoch * n_view + frame_idx
            rr.set_time_sequence("frame_nr", timestamp)

            # 记录RGB图像
            self._log_rgb_image(batch_data, frame_idx, sample_idx)

            # 记录深度图
            self._log_depth_image(batch_data, frame_idx, sample_idx)

            # 记录相机参数
            self._log_camera(batch_data, frame_idx, sample_idx)

            # 记录真值
            self._log_ground_truth(batch_data, frame_idx, sample_idx)

            # 记录预测
            if 'sdf_pred' in batch_data or 'occ_pred' in batch_data:
                self._log_predictions(batch_data, frame_idx, sample_idx)

    def _log_rgb_image(self, batch_data: Dict, frame_idx: int, sample_idx: int):
        """
        记录RGB图像

        Entity: batch/sample/camera/image
        """
        rgb = batch_data['rgb_images'][sample_idx, frame_idx]  # [H, W, 3]

        # 确保RGB在0-255范围内
        rgb_uint8 = (rgb * 255).astype(np.uint8)

        rr.log(
            "batch/sample/camera/image",
            rr.Image(rgb_uint8)
        )

    def _log_depth_image(self, batch_data: Dict, frame_idx: int, sample_idx: int):
        """
        记录深度图

        Entity: batch/sample/camera/depth
        """
        depth = batch_data['depth'][sample_idx, frame_idx]  # [H, W]

        # 归一化深度到[0, 1]以便用颜色映射
        depth_min = depth.min()
        depth_max = depth.max()

        if depth_max > depth_min:
            depth_normalized = (depth - depth_min) / (depth_max - depth_min + 1e-6)
        else:
            depth_normalized = np.zeros_like(depth)

        rr.log(
            "batch/sample/camera/depth",
            rr.DepthImage(depth_normalized, meter=1.0)
        )

    def _log_camera(self, batch_data: Dict, frame_idx: int, sample_idx: int):
        """
        记录相机参数（内参和位姿）

        Entity: batch/sample/camera
        """
        # 记录内参
        K = batch_data['intrinsics'][sample_idx, frame_idx]  # [3, 3]

        # 从图像shape推断分辨率（如果没有在batch中）
        rgb_shape = batch_data['rgb_images'][sample_idx, frame_idx].shape
        height, width = rgb_shape[-2], rgb_shape[-3]

        rr.log(
            "batch/sample/camera",
            rr.Pinhole(
                resolution=[width, height],
                image_from_camera=K
            )
        )

        # 记录位姿（4x4变换矩阵）
        pose = batch_data['poses'][sample_idx, frame_idx]  # [4, 4]

        # 提取4x4变换矩阵的平移和旋转部分
        translation = pose[:3, 3]  # 平移向量
        rotation_matrix = pose[:3, :3]  # 旋转矩阵
        
        rr.log(
            "batch/sample/camera/pose",
            rr.Transform3D(translation=translation, mat3x3=rotation_matrix, from_parent=True)
        )

    def _log_ground_truth(self, batch_data: Dict, frame_idx: int, sample_idx: int):
        """
        记录真值（TSDF和占用）

        Entity: batch/sample/scene
        """
        # 记录TSDF真值
        if 'tsdf' in batch_data:
            tsdf_gt = batch_data['tsdf'][sample_idx]  # [1, D, H, W] or [D, H, W]

            if tsdf_gt.ndim == 4:  # [1, D, H, W]
                tsdf_gt = tsdf_gt[0]  # [D, H, W]

            # 转换为点云格式：只记录占用区域（SDF绝对值小于阈值）
            occ_mask = np.abs(tsdf_gt) < 0.5

            if occ_mask.any():
                # 获取占用体素的索引
                occupied_indices = np.argwhere(occ_mask)

                if len(occupied_indices) > 0:
                    # 将索引转换为浮点坐标
                    voxel_coords = np.asarray(occupied_indices, dtype=np.float32)

                    # 提取SDF值用于颜色映射
                    sdf_values = tsdf_gt[occ_mask].reshape(-1, 1)

                    rr.log(
                        "batch/sample/scene/tsdf_gt",
                        rr.Points3D(
                            positions=voxel_coords,
                            colors=sdf_values,
                            radii=0.05
                        )
                    )

        # 记录占用真值
        if 'occupancy' in batch_data:
            occ_gt = batch_data['occupancy'][sample_idx]  # [1, D, H, W] or [D, H, W]

            if occ_gt.ndim == 4:  # [1, D, H, W]
                occ_gt = occ_gt[0]  # [D, H, W]

            # 将占用网格转换为点云进行可视化
            occupied_indices = np.argwhere(occ_gt > 0.5)
            
            if len(occupied_indices) > 0:
                voxel_coords = np.asarray(occupied_indices, dtype=np.float32)

                rr.log(
                    "batch/sample/scene/occ_gt",
                    rr.Points3D(
                        positions=voxel_coords,
                        radii=0.05,
                        colors=[255, 0, 0]  # 红色
                    )
                )

    def _log_predictions(self, batch_data: Dict, frame_idx: int, sample_idx: int):
        """
        记录预测结果（SDF和占用）

        Entity: batch/sample/scene
        """
        # 记录SDF预测
        if 'sdf_pred' in batch_data:
            sdf_pred = batch_data['sdf_pred'][sample_idx]  # [N, 1] or [N_points]

            if sdf_pred.ndim == 2 and sdf_pred.shape[1] == 1:
                # 点云格式：[N, 3]
                rr.log(
                    "batch/sample/scene/sdf_pred",
                    rr.Points3D(
                        positions=sdf_pred[:, :3],
                        colors=sdf_pred[:, 0:1],
                        radii=0.05
                    )
                )
            else:
                # 其他格式：尝试直接记录
                print(f"[RerunViz] Warning: 未知SDF预测格式 {sdf_pred.shape}")

        # 记录占用预测
        if 'occ_pred' in batch_data:
            occ_pred = batch_data['occ_pred'][sample_idx]  # [D, H, W] or [N, 3]

            if occ_pred.ndim == 3:  # [D, H, W] - 体素网格格式
                # 转换为点云以便可视化
                occupied_indices = np.argwhere(occ_pred > 0.5)

                if len(occupied_indices) > 0:
                    voxel_coords = occupied_indices.astype(np.float32)

                    rr.log(
                        "batch/sample/scene/occ_pred",
                        rr.Points3D(
                            positions=voxel_coords,
                            radii=0.05,
                            colors=[0, 255, 0]  # 绿色
                        )
                    )
            elif occ_pred.ndim == 2:  # [N, 3] - 已是点云格式
                rr.log(
                    "batch/sample/scene/occ_pred",
                    rr.Points3D(
                        positions=occ_pred,
                        radii=0.05,
                        colors=[0, 255, 0]  # 绿色
                    )
                )
            else:
                print(f"[RerunViz] Warning: 未知占用预测格式 {occ_pred.shape}")

    def finish_recording(self):
        """
        结束记录
        """
        print(f"[RerunViz] 完成记录")
        # rr.save会自动处理保存


def tensor_to_numpy(tensor: torch.Tensor) -> np.ndarray:
    """
    安全地将PyTorch Tensor转换为Numpy数组

    Args:
        tensor: PyTorch Tensor或Numpy数组

    Returns:
        Numpy数组
    """
    if isinstance(tensor, torch.Tensor):
        return tensor.detach().cpu().numpy()
    return np.asarray(tensor)


def convert_pose_matrix(pose_tensor: torch.Tensor) -> np.ndarray:
    """
    转换相机位姿格式

    Args:
        pose_tensor: [4, 4]位姿矩阵（PyTorch或Numpy）

    Returns:
        [4, 4]位姿矩阵（Numpy）
    """
    pose_np = tensor_to_numpy(pose_tensor)

    # Rerun的Transform3D接受任何格式的4x4矩阵
    return pose_np


def extract_sdf_points(tsdf_tensor: torch.Tensor, threshold: float = 0.5) -> tuple:
    """
    从TSDF体素网格提取占用点

    Args:
        tsdf_tensor: TSDF体素网格 [1, D, H, W] 或 [D, H, W]
        threshold: SDF阈值，小于此值的体素被认为占用

    Returns:
        (points, sdf_values): 点云坐标和对应的SDF值
    """
    tsdf_np = tensor_to_numpy(tsdf_tensor)

    if tsdf_np.ndim == 4:  # [1, D, H, W]
        tsdf_np = tsdf_np[0]  # [D, H, W]

    occ_mask = np.abs(tsdf_np) < threshold

    if not occ_mask.any():
        return None, None  # 没有占用体素

    # 获取占用体素的索引 [N, 3]
    indices = np.argwhere(occ_mask)

    if len(indices) == 0:
        return np.zeros((0, 3)), np.zeros((0, 1))  # 返回空结果

    # 提取SDF值并reshape
    sdf_values = tsdf_np[occ_mask].reshape(-1, 1)

    # 将索引转换为浮点坐标
    points = indices.astype(np.float32)

    return points, sdf_values