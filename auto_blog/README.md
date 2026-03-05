# Auto Blog - OpenClaw + GLM-4.7 + QQ Bot 教程

## 目录说明

```
auto_blog/
├── ubuntu-openclaw-qqbot-guide.md  # 主博客文章
├── images/                         # 配图目录
│   └── architecture.svg           # 系统架构图
└── README.md                      # 本文件
```

## 关于配图

### 已提供的图片

- **architecture.svg**: 系统架构示意图（矢量图，可缩放）

### 需要用户自行截图的图片

由于无法直接访问用户的桌面环境，以下图片需要用户在实际操作过程中自行截图：

1. **nodejs-install.png** - Node.js安装完成后的终端截图
2. **glm-apikey.png** - Z.AI平台创建API Key的界面截图
3. **openclaw-install.png** - OpenClaw安装成功的终端截图
4. **openclaw-config.png** - OpenClaw配置向导的截图
5. **openclaw-tui.png** - OpenClaw TUI界面的截图
6. **qq-platform-register.png** - QQ开放平台注册界面
7. **qqbot-credentials.png** - 机器人凭证信息截图
8. **config-file.png** - 配置文件编辑界面截图
9. **qqbot-test.png** - QQ Bot交互测试截图

### 如何截图

#### Ubuntu桌面环境

```bash
# 使用gnome-screenshot（默认安装）
gnome-screenshot -a  # 区域截图
gnome-screenshot     # 全屏截图

# 保存到images目录
gnome-screenshot -a -f ./images/your-screenshot.png
```

#### 命令行环境

```bash
# 使用scrot（需要安装）
sudo apt install scrot
scrot -s ./images/your-screenshot.png  # 选择区域截图

# 使用import（ImageMagick）
sudo apt install imagemagick
import ./images/your-screenshot.png
```

### 图片命名规范

请按照以下规范命名截图文件：

- `nodejs-install.png` - Node.js安装验证
- `glm-apikey.png` - API Key创建界面
- `openclaw-install.png` - OpenClaw安装完成
- `openclaw-config.png` - 配置向导界面
- `openclaw-tui.png` - TUI交互界面
- `qq-platform-register.png` - QQ平台注册
- `qqbot-credentials.png` - 机器人凭证
- `config-file.png` - 配置文件编辑
- `qqbot-test.png` - QQ Bot测试

### 图片尺寸建议

- 宽度：800-1200像素
- 高度：400-800像素
- 格式：PNG（推荐）或JPG
- 文件大小：建议小于500KB

### 替换架构图

如果不喜欢提供的SVG架构图，可以：

1. 使用在线工具创建更好的架构图：
   - https://draw.io
   - https://www.figma.com
   - https://www.processon.com

2. 创建后导出为PNG格式：
   ```bash
   # 将SVG转换为PNG（使用inkscape）
   inkscape images/architecture.svg --export-type=png --export-filename=images/architecture.png
   ```

3. 更新博客文章中的图片引用：
   ```markdown
   ![整体架构](./images/architecture.png)
   ```

### 使用占位符

在准备截图期间，可以使用占位符图片：

```bash
# 创建简单的占位符
convert -size 800x400 xc:#f0f0f0 -pointsize 30 -gravity center -fill "#666" -annotate 0 "占位符：[图片描述]" ./images/placeholder.png
```

## 发布建议

### 发布到平台

1. **知乎**
   - 复制Markdown内容
   - 上传图片到知乎图床
   - 替换本地图片链接为线上链接

2. **掘金**
   - 支持Markdown + 本地图片上传
   - 直接使用提供的图片

3. **个人博客**
   - 使用Hugo、Hexo等静态站点生成器
   - 将图片放置在正确的资源目录

### 图片CDN

建议将图片上传到CDN或图床服务：

- 阿里云OSS
- 腾讯云COS
- GitHub（免费但有流量限制）
- 图床服务（如SM.MS、Imgur等）

上传后替换图片链接：

```markdown
# 原本地链接
![整体架构](./images/architecture.png)

# 替换为CDN链接
![整体架构](https://your-cdn.com/architecture.png)
```

## 许可

本教程可自由转载和修改，请保留原作者信息。

---

**创建时间**: 2026年2月17日
