#!/usr/bin/env python3
"""自动化notebooklm登录脚本"""

import subprocess
import time
import os
import signal
import sys

def auto_login():
    print("🔐 开始自动化NotebookLM登录流程")
    
    # 删除旧的认证文件
    storage_path = os.path.expanduser("~/.notebooklm/storage_state.json")
    if os.path.exists(storage_path):
        print(f"🗑️ 删除旧的认证文件: {storage_path}")
        os.remove(storage_path)
    
    # 删除浏览器配置文件
    browser_profile = os.path.expanduser("~/.notebooklm/browser_profile")
    if os.path.exists(browser_profile):
        print(f"🗑️ 删除旧的浏览器配置文件: {browser_profile}")
        import shutil
        shutil.rmtree(browser_profile, ignore_errors=True)
    
    # 构建命令
    cmd = [
        "xvfb-run", "--auto-servernum", "--server-args=-screen 0 1920x1080x24",
        "/home/cwh/miniconda3/bin/conda", "run", "-n", "base", "notebooklm", "login"
    ]
    
    print(f"🚀 启动命令: {' '.join(cmd[:5])}...")
    
    try:
        # 启动进程
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        print("⏳ 等待进程启动...")
        time.sleep(5)
        
        # 读取输出
        output_lines = []
        start_time = time.time()
        timeout = 180  # 3分钟超时
        
        while time.time() - start_time < timeout:
            line = process.stdout.readline()
            if line:
                output_lines.append(line)
                print(f"📄 输出: {line.strip()}")
                
                # 检查是否出现提示信息
                if "Press ENTER when logged in" in line:
                    print("✅ 检测到登录提示")
                    print("⏳ 等待30秒让浏览器完成登录...")
                    time.sleep(30)
                    
                    print("📝 模拟按下ENTER键...")
                    process.stdin.write("\n")
                    process.stdin.flush()
                    
                    print("⏳ 等待保存认证...")
                    time.sleep(10)
                    break
                    
                elif "Aborted" in line or "ERROR" in line:
                    print("❌ 检测到错误")
                    break
                    
            elif process.poll() is not None:
                print(f"进程已退出，返回码: {process.returncode}")
                break
                
            time.sleep(0.1)
        
        # 检查进程状态
        if process.poll() is None:
            print("⏳ 进程仍在运行，等待5秒后终止...")
            time.sleep(5)
            process.terminate()
            process.wait(timeout=10)
        
        # 检查认证文件是否创建
        if os.path.exists(storage_path):
            print(f"✅ 认证文件已创建: {storage_path}")
            print(f"📏 文件大小: {os.path.getsize(storage_path)} 字节")
            return True
        else:
            print(f"❌ 认证文件未创建: {storage_path}")
            return False
            
    except Exception as e:
        print(f"❌ 执行错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 60)
    success = auto_login()
    print("=" * 60)
    
    if success:
        print("🎉 自动化登录流程完成！")
        sys.exit(0)
    else:
        print("❌ 自动化登录流程失败")
        sys.exit(1)