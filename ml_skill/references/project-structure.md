# ML训练项目目录结构

综合 torch_base、vggt、GaussianOcc 最佳实践。

---

## 推荐结构

```
project/
├── configs/              # 配置文件 (yaml)
├── networks/             # 网络模型
│   ├── __init__.py
│   ├── encoder.py       # 编码器
│   ├── decoder.py       # 解码器
│   └── layers.py        # 通用层
├── datasets/             # 数据处理
│   ├── __init__.py
│   └── xxx_dataset.py
├── utils/                # 工具函数
│   ├── __init__.py
│   ├── logger.py
│   └── viz.py
├── options.py            # 参数配置
├── runner.py             # 训练逻辑
├── run.py                # 训练入口
├── eval.py               # 评估入口
├── run.sh                # 运行脚本
└── README.md
```

---

## 核心文件

### options.py

```python
import argparse

class Options:
    def __init__(self):
        self.parser = argparse.ArgumentParser()
        # 模型
        self.parser.add_argument('--model', type=str, default='resnet50')
        # 数据
        self.parser.add_argument('--data', type=str, default='cifar10')
        self.parser.add_argument('--batch_size', type=int, default=64)
        # 训练
        self.parser.add_argument('--lr', type=float, default=0.01)
        self.parser.add_argument('--epochs', type=int, default=100)
        # 存储
        self.parser.add_argument('--exp', type=str, default='exp001')
        self.parser.add_argument('--resume', type=str, default='')

    def parse(self):
        return self.parser.parse_args()
```

### run.py (入口)

```python
from options import Options
from runner import Runner

if __name__ == '__main__':
    opts = Options().parse()
    trainer = Runner(opts)
    trainer.train()
```

### runner.py (训练逻辑)

```python
import torch
from networks import build_model
from datasets import get_dataloader

class Runner:
    def __init__(self, opts):
        self.opts = opts
        self.model = build_model(opts).cuda()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=opts.lr)
        self.train_loader, self.val_loader = get_dataloader(opts)

    def train(self):
        for epoch in range(self.opts.epochs):
            self.train_epoch(epoch)
            self.val_epoch(epoch)
            self.save_checkpoint(epoch)

    def train_epoch(self, epoch):
        self.model.train()
        for x, y in self.train_loader:
            pred = self.model(x.cuda())
            loss = self.compute_loss(pred, y.cuda())
            loss.backward()
            self.optimizer.step()

    def val_epoch(self, epoch):
        self.model.eval()
        # ... 验证逻辑

    def compute_loss(self, pred, gt):
        return torch.nn.functional.cross_entropy(pred, gt)

    def save_checkpoint(self, epoch):
        torch.save(self.model.state_dict(), f'checkpoints/{self.opts.exp}/{epoch}.pth')
```

### eval.py

```python
from options import Options
from networks import build_model
from datasets import get_dataloader

if __name__ == '__main__':
    opts = Options().parse()
    model = build_model(opts).cuda()
    model.load_state_dict(torch.load(opts.resume))
    _, test_loader = get_dataloader(opts)

    model.eval()
    with torch.no_grad():
        for x, y in test_loader:
            pred = model(x.cuda())
            # 计算指标
```

---

## Agent 输出位置

| Agent | 输出 | 位置 |
|-------|------|------|
| model-architect | 网络定义 | `networks/` |
| algorithm-designer | 损失函数 | `runner.py` 内 |
| performance-tuner | 训练优化 | `runner.py` |
| accuracy-tuner | 配置调整 | `configs/`, `options.py` |
| test-engineer | 评估代码 | `eval.py` |
| doc-writer | 文档 | `README.md` |

---

## 命名约定

| 类型 | 命名 | 示例 |
|------|------|------|
| 入口 | `run.py` / `train.py` | |
| 训练器 | `runner.py` / `trainer.py` | |
| 配置 | `options.py` + `configs/` | |
| 模型 | `networks/` | encoder.py, decoder.py |
| 数据 | `datasets/` | xxx_dataset.py |
| 工具 | `utils/` | logger.py, viz.py |

---

## 简化版 (小项目)

```
project/
├── networks.py       # 或 model.py
├── datasets.py       # 或 data.py
├── options.py
├── runner.py
├── run.py
└── README.md
```

---

## 关键原则

1. **入口分离** - `run.py` 简单，逻辑在 `runner.py`
2. **配置分离** - `options.py` (命令行) + `configs/` (yaml)
3. **模块独立** - `networks/`, `datasets/`, `utils/` 各司其职
4. **渐进扩展** - 从单文件到目录自然演进
