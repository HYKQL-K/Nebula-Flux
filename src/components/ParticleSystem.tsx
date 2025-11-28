import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleConfig, ParticleShape, ImageParticleData } from '../types';
import { generateParticles } from '../utils/geometry';

interface ParticleSystemProps {
  config: ParticleConfig;
  progress: number; // 0 = Scatter (Open Hand), 1 = Assemble (Pinch)
  rotation: { x: number; y: number; z: number };
  imageData?: ImageParticleData;
  imageUrl?: string;
  isShapeMode: boolean; // STRICT MODE FLAG
}

// Custom Shader Material
const ParticleShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') },
    uProgress: { value: 0 }, // 0: Scattered, 1: Assembled
    uSize: { value: 4.0 },
    uIsImage: { value: 0.0 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    uniform float uSize;
    uniform float uIsImage;
    
    attribute vec3 aTargetPos;
    attribute vec3 aColor;
    
    varying vec3 vColor;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vColor = aColor;
      
      vec3 scatterPos = position; // Original 'position' attribute is the chaotic start
      vec3 targetPos = aTargetPos; // The organized end state
      
      float t = smoothstep(0.0, 1.0, uProgress);
      
      // Interpolate between Scatter (Chaos) and Target (Order)
      vec3 pos = mix(scatterPos, targetPos, t);
      
      // Add some noise movement during transition
      float noiseIntensity = sin(t * 3.1415) * 5.0; 
      
      float nx = sin(uTime * 2.0 + scatterPos.y) * noiseIntensity;
      float ny = cos(uTime * 1.5 + scatterPos.x) * noiseIntensity;
      float nz = sin(uTime * 2.2 + scatterPos.z) * noiseIntensity;
      
      pos += vec3(nx, ny, nz) * (1.0 - t) * 0.2;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Perspective size attenuation
      gl_PointSize = uSize * (30.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uIsImage;
    varying vec3 vColor;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if(dist > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      
      // If it's an image, use pixel color. If shape, use uniform color mixed with random var.
      vec3 finalColor = mix(uColor, vColor, uIsImage);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

interface HybridOverlayProps {
    imageUrl: string;
    targetProgress: number;
    rotation: { x: number; y: number; z: number };
    spreadSpeed: number;
    returnSpeed: number;
    originalWidth: number;
    originalHeight: number;
}

// Sub-component for Image Overlay (Only used in Image Mode)
const HybridOverlay: React.FC<HybridOverlayProps> = ({ 
    imageUrl, targetProgress, rotation, spreadSpeed, returnSpeed, originalWidth, originalHeight 
}) => {
    const texture = useLoader(THREE.TextureLoader, imageUrl);
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    
    // Track local progress for smooth animation
    const progressRef = useRef(0);

    // Calculate plane size to match particle scale
    const [width, height] = useMemo(() => {
        const maxDim = Math.max(originalWidth, originalHeight);
        const scale = 16.0 / maxDim;
        return [originalWidth * scale, originalHeight * scale];
    }, [originalWidth, originalHeight]);

    useFrame((state, delta) => {
        // 1. Lerp Progress (Sync with particles)
        const current = progressRef.current;
        const speed = targetProgress > current ? returnSpeed : spreadSpeed;
        const next = THREE.MathUtils.lerp(current, targetProgress, speed * 0.05);
        progressRef.current = next;

        // 2. Update Opacity (Snap Effect)
        if (materialRef.current) {
            // Opacity Logic: 
            // Only visible when assembled (> 0.85). 
            // Fully opaque at 1.0.
            const opacityTarget = next > 0.85 ? (next - 0.85) * 6.66 : 0.0;
            const clampedOpacity = Math.max(0, Math.min(1, opacityTarget));

            materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, clampedOpacity, 0.1);
            materialRef.current.visible = materialRef.current.opacity > 0.01;
        }

        // 3. Sync Rotation
        if (meshRef.current) {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation.x, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation.y, 0.1);
            meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, rotation.z, 0.1);
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial 
                ref={materialRef}
                map={texture} 
                transparent 
                opacity={0} 
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
};

const ParticleSystem: React.FC<ParticleSystemProps> = ({ config, progress, rotation, imageData, imageUrl, isShapeMode }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Memoize geometry generation
  const { positions, targetPositions, colors } = useMemo(() => {
    // This calls the STRICT logic in geometry.ts
    return generateParticles(config.shape, config.count, imageData);
  }, [config.shape, config.count, imageData]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update Particles Shader
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      
      const currentProg = materialRef.current.uniforms.uProgress.value;
      const targetProg = progress;
      const speed = targetProg > currentProg ? config.returnSpeed : config.spreadSpeed;
      
      const nextProg = THREE.MathUtils.lerp(
        currentProg, 
        targetProg, 
        speed * 0.05
      );
      materialRef.current.uniforms.uProgress.value = nextProg;
      
      materialRef.current.uniforms.uSize.value = config.size;
      materialRef.current.uniforms.uColor.value.set(config.color);
      // Tells shader if we are using pixel colors (Image) or solid colors (Shape)
      materialRef.current.uniforms.uIsImage.value = !isShapeMode ? 1.0 : 0.0;
    }

    // Update Particle Rotation
    if (pointsRef.current) {
        const r = pointsRef.current.rotation;
        r.x = THREE.MathUtils.lerp(r.x, rotation.x, 0.1);
        r.y = THREE.MathUtils.lerp(r.y, rotation.y, 0.1);
        r.z = THREE.MathUtils.lerp(r.z, rotation.z, 0.1);
    }
  });

  return (
    <group>
        {/* Particles Points Cloud */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-aTargetPos"
              count={targetPositions.length / 3}
              array={targetPositions}
              itemSize={3}
            />
            <bufferAttribute
                attach="attributes-aColor"
                count={colors.length / 3}
                array={colors}
                itemSize={3}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={materialRef}
            args={[ParticleShaderMaterial]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* 
            STRICT VISIBILITY: 
            Only render HybridOverlay if isShapeMode is FALSE (i.e. Image Mode). 
            Geometric shapes (Heart, Flower) must NOT render this mesh.
        */}
        {!isShapeMode && imageUrl && imageData && (
            <HybridOverlay 
                imageUrl={imageUrl}
                targetProgress={progress}
                rotation={rotation}
                spreadSpeed={config.spreadSpeed}
                returnSpeed={config.returnSpeed}
                originalWidth={imageData.originalWidth}
                originalHeight={imageData.originalHeight}
            />
        )}
    </group>
  );
};

export default ParticleSystem;