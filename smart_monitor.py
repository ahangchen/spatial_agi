#!/usr/bin/env python3
"""
训练监控脚本 - 检查训练状态并生成报告
"""
import re
import os
from datetime import datetime
import subprocess

def get_training_status():
    """获取训练状态"""
    log_file = "/home/cwh/coding/former3d/logs/stream_training_20260217_131857.log"
    checkpoint_dir = "/home/cwh/coding/former3d/checkpoints/ddp"

    if not os.path.exists(log_file):
        return None, "日志文件不存在"

    # 读取日志文件
    with open(log_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 解析训练状态
    current_epoch = None
    current_batch = None
    current_loss = None
    current_lr = None
    eta = None

    # 从最后开始查找
    for line in reversed(lines):
        if "Epoch [" in line:
            match = re.search(r'Epoch \[(\d+)/(\d+)\] Batch \[(\d+)/(\d+)\] Loss: ([\d.]+) LR: ([\d.]+) ETA: ([\d.]+min)', line)
            if match:
                current_epoch = match.group(1)
                total_epochs = match.group(2)
                current_batch = match.group(3)
                total_batches = match.group(4)
                current_loss = match.group(5)
                current_lr = match.group(6)
                eta = match.group(7)
                break

    # 获取所有保存的检查点
    checkpoints = []
    if os.path.exists(checkpoint_dir):
        for f in os.listdir(checkpoint_dir):
            if f.startswith('checkpoint_epoch') and f.endswith('.pth'):
                match = re.search(r'checkpoint_epoch(\d+)\.pth', f)
                if match:
                    epoch_num = int(match.group(1))
                    full_path = os.path.join(checkpoint_dir, f)
                    checkpoints.append({
                        'epoch': epoch_num,
                        'file': f,
                        'size': os.path.getsize(full_path),
                        'time': datetime.fromtimestamp(os.path.getmtime(full_path))
                    })

    checkpoints.sort(key=lambda x: x['epoch'])

    # 检查训练是否还在运行
    try:
        result = subprocess.run(
            ['ps', 'aux'],
            capture_output=True,
            text=True
        )
        training_running = 'train_stream_ddp.py' in result.stdout
    except:
        training_running = False

    return {
        'current_epoch': current_epoch,
        'total_epochs': total_epochs if current_epoch else None,
        'current_batch': current_batch,
        'total_batches': total_batches if current_batch else None,
        'current_loss': current_loss,
        'current_lr': current_lr,
        'eta': eta,
        'checkpoints': checkpoints,
        'training_running': training_running,
        'log_file': log_file,
        'checkpoint_dir': checkpoint_dir
    }, None

def generate_report(status):
    """生成训练报告"""
    report = []
    report.append("=" * 60)
    report.append("📊 训练状态报告")
    report.append("=" * 60)
    report.append("")

    # 基本信息
    report.append("🏃 训练状态:")
    if status['training_running']:
        report.append("  ✅ 训练进行中")
    else:
        report.append("  ⏸️  训练未运行")

    report.append("")

    # 当前进度
    if status['current_epoch']:
        progress = (int(status['current_epoch']) - 1) / int(status['total_epochs']) * 100
        report.append("📍 当前进度:")
        report.append(f"  Epoch: {status['current_epoch']}/{status['total_epochs']} ({progress:.1f}%)")
        report.append(f"  Batch: {status['current_batch']}/{status['total_batches']}")
        report.append(f"  当前损失: {status['current_loss']}")
        report.append(f"  学习率: {status['current_lr']}")
        report.append(f"  预计剩余: {status['eta']}")
    else:
        report.append("📍 当前进度: 无法解析")

    report.append("")

    # 检查点信息
    if status['checkpoints']:
        report.append("💾 已保存的检查点:")
        for cp in status['checkpoints']:
            size_mb = cp['size'] / (1024 * 1024)
            report.append(f"  Epoch {cp['epoch']:2d}: {cp['file']} ({size_mb:.1f} MB, {cp['time'].strftime('%H:%M')})")
    else:
        report.append("💾 未找到检查点")

    report.append("")

    # 统计信息
    if status['checkpoints']:
        report.append("📈 统计信息:")
        report.append(f"  总检查点数: {len(status['checkpoints'])}")
        if status['checkpoints']:
            report.append(f"  最新检查点: Epoch {status['checkpoints'][-1]['epoch']}")
            if len(status['checkpoints']) >= 2:
                last_checkpoints = status['checkpoints'][-2:]
                time_diff = (last_checkpoints[1]['time'] - last_checkpoints[0]['time']).total_seconds() / 60
                report.append(f"  每个epoch平均耗时: ~{time_diff:.1f} 分钟")

    report.append("")
    report.append("=" * 60)

    return "\n".join(report)

def main():
    status, error = get_training_status()

    if error:
        print(f"错误: {error}")
        return 1

    report = generate_report(status)
    print(report)

    # 检查是否有新的epoch完成（与上次保存的检查点比较）
    # 这里可以添加逻辑来判断是否需要发送通知

    return 0

if __name__ == "__main__":
    main()
