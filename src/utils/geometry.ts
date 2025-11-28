import * as THREE from 'three';
import { ParticleShape, ImageParticleData } from '../types';

// Helper: Generate random 3D chaos for the "Scatter" state (Explosion)
// This applies to BOTH images and shapes so they explode volumetrically.
const setRandomScatterPosition = (positions: Float32Array, i3: number) => {
  const range = 100; // Large explosion range
  const depth = 100; // Deep Z-axis volume
  positions[i3] = (Math.random() - 0.5) * range;
  positions[i3 + 1] = (Math.random() - 0.5) * range;
  positions[i3 + 2] = (Math.random() - 0.5) * depth;
};

// --- MODE 1: IMAGE GENERATION ---
// Rule: Target positions must be strictly flat (Z = 0) to match the 2D photo.
const generateImageParticles = (
  count: number,
  imageData: ImageParticleData
) => {
  const positions = new Float32Array(count * 3);       // Scatter (Start)
  const targetPositions = new Float32Array(count * 3); // Target (End - Flat)
  const colors = new Float32Array(count * 3);

  const totalImagePixels = imageData.positions.length / 3;
  const maxDim = Math.max(imageData.originalWidth, imageData.originalHeight);
  // Scale to fit in view (approx 16 units wide/tall)
  const scale = 16.0 / maxDim; 
  
  // Strided Sampling
  const step = Math.max(1, totalImagePixels / count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Cyclic sampling
    let pixelIndex = Math.floor(i * step);
    if (pixelIndex >= totalImagePixels) pixelIndex = i % totalImagePixels;
    const srcIndex = pixelIndex * 3;

    // 1. Target Position (FLAT 2D GRID)
    const px = imageData.positions[srcIndex];
    const py = imageData.positions[srcIndex + 1];

    // Center the image at (0,0,0)
    targetPositions[i3] = (px - imageData.originalWidth / 2) * scale;
    targetPositions[i3 + 1] = -(py - imageData.originalHeight / 2) * scale; // Invert Y
    targetPositions[i3 + 2] = 0; // CRITICAL: Z is ALWAYS 0 for images.

    // 2. Scatter Position (3D CHAOS)
    setRandomScatterPosition(positions, i3);

    // 3. Colors (From Pixel)
    colors[i3] = imageData.colors[srcIndex];
    colors[i3 + 1] = imageData.colors[srcIndex + 1];
    colors[i3 + 2] = imageData.colors[srcIndex + 2];
  }

  return { positions, targetPositions, colors };
};

// --- MODE 2: SHAPE GENERATION ---
// Rule: Target positions follow 3D mathematical formulas.
const generateShapeParticles = (
  shape: ParticleShape,
  count: number
) => {
  const positions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // 1. Target Position (3D MATH)
    let tx = 0, ty = 0, tz = 0;

    if (shape === ParticleShape.Heart) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()); 
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const scale = 0.35; 
      tx = x * scale * r;
      ty = y * scale * r;
      tz = (Math.random() - 0.5) * 4 * r; // Volume for Heart

    } else if (shape === ParticleShape.Flower) {
      const k = 5; 
      const theta = Math.random() * Math.PI * 2;
      const r = Math.cos(k * theta); 
      const radiusVar = Math.random() * 2 + 2;
      tx = r * Math.cos(theta) * radiusVar * 1.5;
      ty = r * Math.sin(theta) * radiusVar * 1.5;
      tz = (Math.random() - 0.5) * 2.0;

    } else if (shape === ParticleShape.Planet) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const rad = 6.0;
      tx = rad * Math.sin(phi) * Math.cos(theta);
      ty = rad * Math.sin(phi) * Math.sin(theta);
      tz = rad * Math.cos(phi);
      
      // Rings
      if (i % 5 === 0) {
           const angle = Math.random() * Math.PI * 2;
           const dist = 8.0 + Math.random() * 3.0;
           tx = Math.cos(angle) * dist;
           ty = Math.sin(angle) * dist;
           tz = (Math.random() - 0.5) * 0.2;
      }

    } else if (shape === ParticleShape.Fireworks) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const rad = Math.cbrt(Math.random()) * 8; 
        tx = rad * Math.sin(phi) * Math.cos(theta);
        ty = rad * Math.sin(phi) * Math.sin(theta);
        tz = rad * Math.cos(phi);
    }

    targetPositions[i3] = tx;
    targetPositions[i3 + 1] = ty;
    targetPositions[i3 + 2] = tz;

    // 2. Scatter Position (3D CHAOS)
    setRandomScatterPosition(positions, i3);

    // 3. Colors (Synthetic Defaults)
    colors[i3] = 1.0;
    colors[i3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i3 + 2] = 0.8 + Math.random() * 0.2;
  }

  return { positions, targetPositions, colors };
};

// Main Entry Point
export const generateParticles = (
  shape: ParticleShape,
  count: number,
  imageData?: ImageParticleData
) => {
  // 1. IMAGE MODE
  if (shape === ParticleShape.Image) {
      // If we have data, generate the real image
      if (imageData && imageData.positions.length > 0) {
          return generateImageParticles(count, imageData);
      }
      
      // --- CRITICAL FIX: LOADING STATE (FALLBACK) ---
      // Do NOT return a Heart/Star. Return a FLAT Placeholder Grid.
      // We create a dummy imageData object with 0s to force a flat layout.
      const placeholderSize = 100; // arbitrary
      const placeholderData: ImageParticleData = {
          positions: new Float32Array(count * 3).fill(0), // All zeros = Flat
          colors: new Float32Array(count * 3).fill(1),    // White
          originalWidth: placeholderSize,
          originalHeight: placeholderSize
      };
      
      // Run the image generator with this dummy flat data
      // This ensures particles stay Z=0 while waiting for the real image.
      return generateImageParticles(count, placeholderData);
  }
  
  // 2. SHAPE PRESET MODE
  return generateShapeParticles(shape, count);
};

export const processImageToParticles = (
  source: File | string,
  callback: (data: ImageParticleData) => void
) => {
  const processImage = (src: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const maxDim = 500; 
        let w = img.width;
        let h = img.height;
        
        if (w > h) {
          if (w > maxDim) { h *= maxDim / w; w = maxDim; }
        } else {
          if (h > maxDim) { w *= maxDim / h; h = maxDim; }
        }
        
        w = Math.floor(w);
        h = Math.floor(h);

        canvas.width = w;
        canvas.height = h;
        
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;
        
        const positions: number[] = [];
        const colors: number[] = [];
        
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const a = pixels[index + 3];

            if (a > 20) { 
              const r = pixels[index] / 255;
              const g = pixels[index + 1] / 255;
              const b = pixels[index + 2] / 255;

              positions.push(x, y, 0);
              colors.push(r, g, b);
            }
          }
        }

        callback({
          positions: new Float32Array(positions),
          colors: new Float32Array(colors),
          originalWidth: w,
          originalHeight: h
        });
      };
      
      img.src = src;
  };

  if (typeof source === 'string') {
      processImage(source);
  } else if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
            processImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(source);
  }
};