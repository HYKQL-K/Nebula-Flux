# 🌌 **Nebula Flux**

### *3D Gesture Interactive Particle System*

**3D 手势交互粒子系统 | 基于 Web 的实时视觉交互实验**

<p align="center">
  <a href="#中文说明-cn">🇨🇳 中文说明</a> •
  <a href="#english-readme-en">🇺🇸 English Readme</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Three.js-r160-000000?logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MediaPipe-Vision-0075FA?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white" />
</p>

---

<a name="中文说明-cn"></a>

## 🇨🇳 中文说明

### 📖 简介

**Nebula Flux** 是一个极具视觉冲击力的 Web 3D 交互项目。它结合计算机视觉技术（MediaPipe）与高性能 WebGL 渲染（Three.js），允许用户通过 **手势** 来控制成千上万个 3D 粒子。

你可以像魔法师一样挥手让粒子聚合、爆炸，或将照片瞬间转化成粒子流。

### ✨ 核心功能

* **🖐 手势识别控制**

  * 张开手掌：粒子聚合成目标形状
  * 握拳 / 捏合：粒子爆炸发散
  * 手腕转动：控制 3D 模型 Pitch/Yaw/Roll
* **❤️ 多种粒子形态**（爱心、星球、花朵、烟花等）
* **🖼 图片粒子化**
* **🎨 可调节粒子数量、颜色、力场等参数**
* **⚡ 高性能 Shader 粒子渲染**

### 🛠 技术栈

React、TypeScript、Three.js、R3F、MediaPipe、Tailwind、Leva

### 📂 目录结构

```text
Nebula-Flux/
├── src/
│   ├── assets/
│   ├── components/
│   ├── shaders/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
└── vite.config.ts
```

### 🚀 快速开始

```bash
git clone https://github.com/HYKQL-K/Nebula-Flux.git
cd Nebula-Flux

npm install
npm run dev
```

访问 `http://localhost:5173` 并允许摄像头权限。

### 🎮 操作指南

| 手势动作         | 效果   |
| ------------ | ---- |
| 🖐 张开手掌      | 粒子聚合 |
| ✊ 握拳 / 👌 捏合 | 粒子爆散 |
| 👋 手掌转动      | 模型旋转 |

---

<a name="english-readme-en"></a>

## 🇺🇸 English Readme

### Introduction

**Nebula Flux** is a real-time 3D interactive web experiment using **MediaPipe Hand Tracking** + **Three.js** to let users control huge particle systems using **hand gestures**.

### ✨ Features

* Gesture Control (open palm gather, fist explode, rotation sync)
* Multiple particle shapes
* Image-to-particle converter
* Highly customizable particle parameters
* GPU-accelerated shaders for smooth performance

### 🚀 Getting Started

```bash
git clone https://github.com/HYKQL-K/Nebula-Flux.git
cd Nebula-Flux

npm install
npm run dev
```

Visit `http://localhost:5173` and allow camera access.

### 🎮 Controls

| Gesture      | Effect            |
| ------------ | ----------------- |
| Open Palm    | Gather into shape |
| Fist / Pinch | Scatter outward   |
| Rotate Hand  | Rotate 3D model   |

---

### License

MIT License.

---
