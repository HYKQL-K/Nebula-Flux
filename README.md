# 3D Gesture Interactive Particle System / 3D 手势交互粒子系统

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Three.js-r160-black?logo=three.js" />
  <img src="https://img.shields.io/badge/MediaPipe-Vision-teal?logo=google" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" />
</div>

<br />

**[English](#english-readme) | [中文说明](#中文说明)**

---

<a name="中文说明"></a>

## 🇨🇳 中文说明

### 简介
这是一个基于 Web 的实时 3D 交互项目。通过计算机视觉技术（MediaPipe），该项目允许用户使用**手势**来控制 3D 粒子群的运动。你可以通过摄像头控制粒子的聚合、发散以及旋转，或者上传自己的照片将其转化为粒子模型。

### ✨ 核心功能

*   **🖐 手势识别控制**：无需鼠标，使用摄像头即可交互。
    *   **张开手掌**：粒子聚合成目标形状。
    *   **握拳/捏合**：粒子向外“爆炸”发散。
    *   **手腕转动**：实时控制 3D 模型的旋转角度 (Pitch/Yaw/Roll)。
*   **❤️ 多种粒子形态**：内置爱心、花朵、星球、烟花等多种数学模型形状。
*   **🖼 图片粒子化**：支持上传本地图片，自动分析像素颜色与位置，生成对应的粒子画像。
*   **🎨 高度可定制**：可实时调节粒子数量、颜色、大小、扩散速度及范围。
*   **⚡ 高性能渲染**：基于 React Three Fiber 和自定义 Shader (着色器) 实现流畅的万级粒子渲染。

### 🛠 技术栈

*   **前端框架**: React + TypeScript
*   **3D 渲染**: Three.js / @react-three/fiber / @react-three/drei
*   **视觉算法**: Google MediaPipe (Hand Landmarker)
*   **样式**: Tailwind CSS

### 🚀 快速开始

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **安装依赖**
    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```

4.  打开浏览器访问 `http://localhost:5173`，并允许摄像头权限。

### 🎮 操作指南

| 手势动作 | 效果 |
| :--- | :--- |
| **张开手掌 (Open Palm)** | 粒子平滑聚合成当前选择的形状（如爱心、图片）。 |
| **握拳 / 捏合 (Fist / Pinch)** | 粒子群受到惊扰，向四周发散/爆炸。 |
| **移动/转动手掌** | 3D 模型会跟随手掌的朝向进行旋转。 |

---

<a name="english-readme"></a>

## 🇺🇸 English Readme

### Introduction
This is a web-based real-time 3D interactive project. Powered by Computer Vision (MediaPipe), it allows users to control a swarm of 3D particles using **Hand Gestures**. You can control the cohesion, diffusion, and rotation of particles via your webcam, or upload your own photos to convert them into particle models.

### ✨ Features

*   **🖐 Gesture Control**: Interact without a mouse.
    *   **Open Palm**: Particles gather into the target shape.
    *   **Fist / Pinch**: Particles "explode" and scatter outward.
    *   **Wrist Rotation**: Real-time control of the 3D model's orientation (Pitch/Yaw/Roll).
*   **❤️ Multiple Shapes**: Built-in mathematical models including Heart, Flower, Planet, and Fireworks.
*   **🖼 Image to Particles**: Upload a local image to generate a particle representation based on pixel colors and positions.
*   **🎨 Highly Customizable**: Real-time adjustment of particle count, color, size, spread speed, and range.
*   **⚡ High Performance**: Smooth rendering of thousands of particles using React Three Fiber and custom Shaders.

### 🛠 Tech Stack

*   **Framework**: React + TypeScript
*   **3D Engine**: Three.js / @react-three/fiber / @react-three/drei
*   **Computer Vision**: Google MediaPipe (Hand Landmarker)
*   **Styling**: Tailwind CSS

### 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start development server**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser and allow camera access.

### 🎮 Controls

| Gesture | Effect |
| :--- | :--- |
| **Open Palm** | Particles smoothly gather into the selected shape. |
| **Fist / Pinch** | Particles scatter and explode outwards. |
| **Rotate Hand** | The 3D model rotates in sync with your hand's orientation. |

---

### License

MIT License.
