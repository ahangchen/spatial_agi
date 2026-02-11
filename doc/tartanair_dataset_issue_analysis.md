# TartanAir数据集加载问题分析

## 问题描述
用户报告：TartanAir目录下有12个序列，但Former3D流式训练时只能看到2个序列。

## 调查结果

### 1. 数据集目录结构
```
/home/cwh/Study/dataset/tartanair/
├── abandonedfactory_sample_P001/
│   └── P001/
├── amusement_sample_P008/
│   └── P008/
├── carwelding_sample_P007/
│   └── P007/
├── endofworld_sample_P001/ (可能是缺失的)
├── gascola_sample_P001/
│   └── P001/
├── japanesealley_sample_P007/
│   └── P007/
├── neighborhood_sample_P002/
│   └── P002/
├── office2_sample_P003/
│   └── P003/
├── seasidetown_sample_P003/
│   └── P003/
├── seasonsforest_sample_P002/
│   └── P002/
├── soulcity_sample_P003/
│   └── P003/
└── westerndesert_sample_P002/
    └── P002/
```

**实际存在的序列数：11个**

### 2. 数据集代码问题

在`/home/cwh/coding/former3d/multi_sequence_tartanair_dataset.py`的`_discover_sequences`方法中：

```python
def _discover_sequences(self) -> List[Dict]:
    """发现所有可用的序列"""
    sequences = []

    # 遍历data_root下的所有目录
    for item in os.listdir(self.data_root):
        item_path = os.path.join(self.data_root, item)
        if os.path.isdir(item_path):
            # 检查是否是序列目录（包含P001子目录）
            p001_path = os.path.join(item_path, "P001")  # ← 问题在这里！
            if os.path.exists(p001_path):  # ← 只检查P001
                # 检查必要的子目录
                rgb_dir = os.path.join(p001_path, "image_left")
                depth_dir = os.path.join(p001_path, "depth_left")
                pose_file = os.path.join(p001_path, "pose_left.txt")

                if (os.path.exists(rgb_dir) and
                    os.path.exists(depth_dir) and
                    os.path.exists(pose_file)):
                    # ... 添加到序列列表
```

**问题根源：**
代码硬编码检查`P001`子目录，但实际上TartanAir数据集的每个序列有不同的Pxxx编号（P001, P002, P003, P007, P008等）。

### 3. 实际加载结果

运行测试显示：
```
发现 2 个序列:
  - abandonedfactory_sample_P001: 434 帧
  - gascola_sample_P001: 382 帧
多序列TartanAir数据集初始化完成:
  总序列数: 2
  总片段数: 808
```

只找到了2个包含`P001`子目录的序列，其他9个序列都被忽略了。

## 解决方案

修改`_discover_sequences`方法，使其能够识别任何`Pxxx`格式的子目录：

```python
def _discover_sequences(self) -> List[Dict]:
    """发现所有可用的序列"""
    sequences = []

    # 遍历data_root下的所有目录
    for item in os.listdir(self.data_root):
        item_path = os.path.join(self.data_root, item)
        if os.path.isdir(item_path):
            # 查找任何Pxxx格式的子目录
            p_dirs = []
            for sub_item in os.listdir(item_path):
                if sub_item.startswith('P') and os.path.isdir(os.path.join(item_path, sub_item)):
                    p_dirs.append(sub_item)

            if not p_dirs:
                continue  # 没有找到Pxxx子目录，跳过

            # 使用第一个找到的Pxxx目录
            p_dir = p_dirs[0]
            p_path = os.path.join(item_path, p_dir)

            # 检查必要的子目录
            rgb_dir = os.path.join(p_path, "image_left")
            depth_dir = os.path.join(p_path, "depth_left")
            pose_file = os.path.join(p_path, "pose_left.txt")

            if (os.path.exists(rgb_dir) and
                os.path.exists(depth_dir) and
                os.path.exists(pose_file)):

                # 获取RGB文件列表
                rgb_files = sorted(glob.glob(os.path.join(rgb_dir, "*.png")))
                if len(rgb_files) >= self.n_view:
                    sequences.append({
                        'name': item,
                        'path': item_path,
                        'p_path': p_path,  # 使用通用的p_path
                        'p_dir': p_dir,     # 记录实际使用的Pxxx目录
                        'rgb_dir': rgb_dir,
                        'depth_dir': depth_dir,
                        'pose_file': pose_file,
                        'rgb_files': rgb_files,
                        'num_frames': len(rgb_files)
                    })
```

同时需要修改`__getitem__`方法中引用`p001_path`的地方，改为使用`p_path`：

```python
def _load_frame_data(self, seq_info: Dict, frame_idx: int) -> Dict:
    # 使用 seq_info['p_path'] 而不是 seq_info['p001_path']
    ...
    # 加载深度图
    depth_path = os.path.join(
        seq_info['depth_dir'],
        os.path.basename(rgb_path).replace('image', 'depth')
    )
    ...
```

## 测试验证

修复后，应该能看到所有11个序列：

```python
发现 11 个序列:
  - abandonedfactory_sample_P001: 434 帧
  - amusement_sample_P008: XXX 帧
  - carwelding_sample_P007: XXX 帧
  - gascola_sample_P001: 382 帧
  - japanesealley_sample_P007: XXX 帧
  - neighborhood_sample_P002: XXX 帧
  - office2_sample_P003: XXX 帧
  - seasidetown_sample_P003: XXX 帧
  - seasonsforest_sample_P002: XXX 帧
  - soulcity_sample_P003: XXX 帧
  - westerndesert_sample_P002: XXX 帧
多序列TartanAir数据集初始化完成:
  总序列数: 11
  总片段数: XXXX
```

## 影响

这个问题导致：
1. 训练数据量大幅减少（从11个序列降到2个序列）
2. 数据多样性降低，可能影响模型泛化能力
3. 训练效率降低（更多重复数据）
