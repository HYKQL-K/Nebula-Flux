export enum ParticleShape {
  Heart = 'HEART',
  Flower = 'FLOWER',
  Planet = 'PLANET',
  Fireworks = 'FIREWORKS',
  Image = 'IMAGE'
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  spreadSpeed: number; // Speed of expansion
  returnSpeed: number; // Speed of contraction
  maxSpread: number; // How far they explode
  shape: ParticleShape;
}

export interface HandLandmarkResult {
  landmarks: { x: number; y: number; z: number }[][];
}

export interface ImageParticleData {
  positions: Float32Array;
  colors: Float32Array;
  originalWidth: number;
  originalHeight: number;
}

export interface GestureData {
  factor: number; // 0 to 1 (Closed to Open)
  rotation: { x: number; y: number; z: number }; // Euler angles
}