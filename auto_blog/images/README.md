# 占位符图片说明

此目录用于存放博客文章的配图。

## 当前状态

- ✅ **architecture.svg** - 系统架构图（已提供）
- ⏳ **其他图片** - 需要用户自行截图

## 如何生成占位符

如果你希望先生成占位符图片预览效果，可以运行：

```bash
# 1. 安装 ImageMagick
sudo apt install imagemagick

# 2. 运行生成脚本
cd /home/cwh/.openclaw/workspace/auto_blog
./generate-placeholders.sh
```

这会生成9个占位符图片，每个图片都标明了应该截图的内容。

## 建议的截图时机

在按照博客文章操作的过程中，可以在以下步骤进行截图：

### 1. Node.js安装完成后
```bash
# 验证安装后
node -v
npm -v
```
截图保存为：`nodejs-install.png`

### 2. Z.AI平台创建API Key
访问 https://z.ai/manage-apikey/apikey-list
截图保存为：`glm-apikey.png`

### 3. OpenClaw安装成功
```bash
openclaw --version
```
截图保存为：`openclaw-install.png`

### 4. OpenClaw配置向导
运行 `openclaw onboard --install-daemon` 时
截图保存为：`openclaw-config.png`

### 5. OpenClaw TUI界面
在终端界面与AI助手交互时
截图保存为：`openclaw-tui.png`

### 6. QQ开放平台注册
访问 https://open.qq.com/
截图保存为：`qq-platform-register.png`

### 7. 机器人凭证信息
在QQ开放平台应用详情页
截图保存为：`qqbot-credentials.png`

### 8. 配置文件编辑
编辑 `~/.openclaw/config.yaml`
截图保存为：`config-file.png`

### 9. QQ Bot测试
在QQ中与机器人对话
截图保存为：`qqbot-test.png`

## 截图工具推荐

### Ubuntu桌面环境

```bash
# GNOME截图工具（默认安装）
gnome-screenshot -a

# 直接保存到images目录
gnome-screenshot -a -f ./images/your-name.png
```

### 命令行工具

```bash
# 安装scrot
sudo apt install scrot
scrot -s ./images/your-name.png

# 安装ImageMagick
sudo apt install imagemagick
import ./images/your-name.png
```

## 图片规范

- **尺寸**: 宽度800-1200像素
- **格式**: PNG（推荐）
- **命名**: 参考上述列表
- **大小**: 建议<500KB

## 快捷操作

如果想批量生成占位符后再逐一替换：

```bash
cd /home/cwh/.openclaw/workspace/auto_blog
./generate-placeholders.sh
# 然后在操作过程中用真实截图替换对应的PNG文件
```
