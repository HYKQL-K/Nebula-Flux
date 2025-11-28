# Nebula Flux - 3D Gesture Interactive Particle System

<div align="center">
  <h3>🌌 3D 手势交互粒子系统</h3>
  <p>基于 Web 的实时视觉交互实验 / A Web-based Real-time Visual Interaction Experiment</p>

  <p>
    <a href="#-中文说明">中文说明</a> •
    <a href="#-english-readme">English Readme</a>
  </p>

  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Three.js-r160-000000?logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MediaPipe-Vision-0075FA?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white" />
</div>

<br />

---

<a name="-中文说明"></a>
## 🇨🇳 中文说明

### 📖 简介
**Nebula Flux** 是一个极具视觉冲击力的 Web 3D 交互项目。它结合了计算机视觉技术（MediaPipe）与高性能 WebGL 渲染（Three.js），允许用户通过**手势**“隔空”控制成千上万个 3D 粒子。

你可以像魔法师一样，挥手让粒子聚合、爆炸，或者通过摄像头捕捉将自己的照片瞬间转化为粒子流。

### ✨ 核心功能

* **🖐 手势识别控制 (Gesture Control)**
    * **张开手掌**：粒子受到感召，平滑聚合成当前目标形状（爱心、星球等）。
    * **握拳 / 捏合**：触发“爆炸”效果，粒子受惊扰向屏幕四周混沌发散。
    * **手腕转动**：实时映射手部姿态，控制 3D 模型进行 Pitch/Yaw/Roll 旋转。
* **❤️ 多样化粒子形态**
    * 内置多种数学模型：爱心 (Heart)、繁花 (Flower)、星球 (Planet)、烟花 (Fireworks)。
* **🖼 图片粒子化 (Image to Particles)**
    * 支持上传本地图片，算法自动采样像素颜色与坐标，生成独一无二的粒子画像。
* **🎨 高度可定制**
    * 提供控制面板，实时调节粒子数量、颜色、大小、力场强度及扩散速度。
* **⚡ 极致性能**
    * 基于 `React Three Fiber` 和自定义 `Shader` (着色器)，在浏览器中流畅渲染万级粒子。

### 🛠 技术栈

* **核心框架**: React + TypeScript + Vite
* **3D 引擎**: Three.js / @react-three/fiber / @react-three/drei
* **视觉算法**: Google MediaPipe (Hand Landmarker)
* **UI/样式**: Tailwind CSS
* **状态管理**: Leva (GUI Controls)

### 📂 目录结构
```text
Nebula-Flux/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # React 组件 (Canvas, UI等)
│   ├── shaders/         # 自定义 GLSL 着色器
│   ├── utils/           # 数学计算与工具函数
│   ├── App.tsx          # 主入口
│   └── main.tsx         # 渲染入口
├── public/              # 公共资源
├── index.html           # HTML 模板
└── vite.config.ts       # Vite 配置
````

### 🚀 快速开始 (必读)

> ⚠️ **注意**：本项目基于 React 框架，**无法**通过直接双击 `index.html` 运行。请按照以下步骤启动：

1.  **克隆项目**

    ```bash
    git clone [https://github.com/HYKQL-K/Nebula-Flux.git](https://github.com/HYKQL-K/Nebula-Flux.git)
    cd Nebula-Flux
    ```

2.  **安装依赖** (需要 Node.js 环境)

    ```bash
    npm install
    # 或者使用 yarn
    yarn install
    ```

3.  **启动开发服务器**

    ```bash
    npm run dev
    ```

4.  **开始体验**

      * 打开浏览器访问终端显示的地址（通常是 `http://localhost:5173`）。
      * **允许浏览器使用摄像头权限**以开启手势控制。

### 🎮 操作指南

| 手势动作 | 视觉效果 |
| :--- | :--- |
| **🖐 张开手掌 (Open Palm)** | **聚合**：粒子从混沌状态汇聚成模型。 |
| **✊ 握拳 / 👌 捏合 (Fist)** | **发散**：粒子产生斥力，向四周炸裂/逃逸。 |
| **👋 移动/转动手掌** | **旋转**：模型跟随手掌方向实时旋转。 |

-----



## English Readme

### Introduction

**Nebula Flux** is a web-based real-time 3D interactive experiment. Powered by Computer Vision (**MediaPipe**), it enables users to control a massive swarm of 3D particles using only **Hand Gestures**.

Experience the magic of manipulating digital matter: make particles coalesce, explode, or rotate simply by moving your hands in front of the webcam. You can even upload your own photos to convert them into 3D particle models.

### ✨ Features

  * **🖐 Gesture Control**: Zero-touch interaction.
      * **Open Palm**: Particles smoothly gather into the target shape.
      * **Fist / Pinch**: Particles "explode" and scatter outward due to repulsive forces.
      * **Wrist Rotation**: Real-time control of the 3D model's orientation (Pitch/Yaw/Roll).
  * **❤️ Multiple Shapes**: Built-in mathematical models including Heart, Flower, Planet, and Fireworks.
  * **🖼 Image to Particles**: Upload a local image to generate a particle representation based on pixel colors and positions.
  * **🎨 Highly Customizable**: Real-time adjustment of particle count, color, size, spread speed, and range.
  * **⚡ High Performance**: Smooth rendering of thousands of particles using React Three Fiber and custom Shaders.

### 🚀 Getting Started

> ⚠️ **Note**: This is a React application. It **cannot** be run by simply opening `index.html`.

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/HYKQL-K/Nebula-Flux.git](https://github.com/HYKQL-K/Nebula-Flux.git)
    cd Nebula-Flux
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start development server**

    ```bash
    npm run dev
    ```

4.  **Open in Browser**

      * Visit `http://localhost:5173`.
      * **Allow camera access** when prompted.

### 🎮 Controls

| Gesture | Effect |
| :--- | :--- |
| **Open Palm** | Particles smoothly gather into the selected shape. |
| **Fist / Pinch** | Particles scatter and explode outwards. |
| **Rotate Hand** | The 3D model rotates in sync with your hand's orientation. |

-----

### License

MIT License.

