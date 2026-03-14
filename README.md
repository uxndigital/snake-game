# 🐍 贪吃蛇 Snake Game

一个使用 TypeScript 构建的经典贪吃蛇游戏，适合 Web 浏览器运行。

![Game Preview](preview.png)

## 🎮 特性

- 经典贪吃蛇玩法
- 流畅的动画效果
- 分数和最高分记录 (本地存储)
- 难度递增 (吃到食物后速度加快)
- 键盘控制 (方向键 或 WASD)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 默认端口 3000
npm run dev

# 自定义端口 (例如 7654)
PORT=7654 npm run dev
```

然后打开浏览器访问 `http://localhost:PORT`

### 构建生产版本

```bash
npm run build
```

构建完成后，在浏览器中打开 `index.html` 即可游玩。

## 🎯 操作说明

- **↑ ↓ ← →** - 方向键控制
- **W A S D** - 键盘控制
- 吃到食物得分，蛇身会变长
- 撞墙或撞到自己游戏结束

## 🛠️ 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | 开发服务器端口 |

## 🛠️ 技术栈

- TypeScript
- HTML5 Canvas
- ESBuild (构建工具)

## 📝 许可证

MIT
