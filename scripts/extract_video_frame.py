#!/usr/bin/env python3
"""
从视频中提取关键帧
"""
import sys
import os
import subprocess

def extract_frame(video_path, output_path, timestamp="00:00:01"):
    """使用gst-launch提取视频帧"""
    cmd = f'gst-launch-1.0 -q filesrc location="{video_path}" ! decodebin ! videoconvert ! pngenc ! filesink location="{output_path}"'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        if result.returncode == 0 and os.path.exists(output_path):
            print(f"✅ 成功提取帧: {output_path}")
            return True
        else:
            print(f"❌ 提取失败: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 extract_video_frame.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    output_path = "/tmp/video_frame.png"
    
    extract_frame(video_path, output_path)
