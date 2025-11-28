import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleConfig, ParticleShape, ImageParticleData, GestureData } from './types';
import ParticleSystem from './components/ParticleSystem';
import HandTracker from './components/HandTracker';
import { processImageToParticles } from './utils/geometry';

// Icons
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
);

const App: React.FC = () => {
  // State
  const [config, setConfig] = useState<ParticleConfig>({
    count: 15000, 
    color: '#ff88cc',
    size: 4.0, 
    spreadSpeed: 1.0,
    returnSpeed: 1.5,
    maxSpread: 15,
    shape: ParticleShape.Heart
  });

  const [gestureData, setGestureData] = useState<GestureData>({
      factor: -1,
      rotation: { x: 0, y: 0, z: 0 }
  });
  
  // Manual Progress: 0 = Scatter, 1 = Assemble
  const [manualProgress, setManualProgress] = useState(1);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  
  // Image Data
  const [imageData, setImageData] = useState<ImageParticleData | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // CRITICAL: Key to force remounting of ParticleSystem when image changes
  const [resetKey, setResetKey] = useState(0); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Image URLs
  const PRESET_IMAGES = [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&w=500&q=80', // Colorful Face
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=500&q=80', // Portrait
  ];

  let targetProgress = manualProgress;

  if (isCameraActive && gestureData.factor >= 0) {
      // Gesture Factor: 1.0 = Open Hand, 0.0 = Pinch/Fist
      // Target Progress: 0.0 = Scatter (Open), 1.0 = Assemble (Pinch)
      targetProgress = 1.0 - gestureData.factor;
  }

  const activeRotation = isCameraActive && gestureData.factor >= 0 
      ? gestureData.rotation 
      : { x: 0, y: 0, z: 0 };

  // STRICT MODE DEFINITION: Anything that is NOT Image is Shape Mode
  const isShapeMode = config.shape !== ParticleShape.Image;

  const handleStart = (useImage: boolean) => {
    setShowStartModal(false);
    if (useImage && fileInputRef.current) {
        setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  const handleImageSource = (source: File | string) => {
      // 1. Determine URL
      let url = '';
      if (typeof source === 'string') {
          url = source;
      } else if (source instanceof File) {
          url = URL.createObjectURL(source);
      }
      
      // 2. Set Basic State
      setImageUrl(url);
      setImageData(undefined); // Clear old data to prevent flickering

      // 3. CRITICAL FIX: Set Shape to 'Image' SYNCHRONOUSLY
      // This ensures that when the component remounts in the next line, 
      // it ALREADY knows it should be flat (ParticleShape.Image).
      setConfig(prev => ({ 
          ...prev, 
          shape: ParticleShape.Image, 
          color: '#ffffff', 
          count: 20000 
      }));

      // 4. Force Remount
      setResetKey(prev => prev + 1);

      // 5. Process Image Data (Async)
      processImageToParticles(source, (data) => {
          setImageData(data);
          // Note: We do NOT need to setConfig here anymore.
      });
  };

  const handlePreset = (url: string) => {
      handleImageSource(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          handleImageSource(file);
      }
      e.target.value = '';
  };

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
      } else {
          document.exitFullscreen();
      }
  };

  return (
    <div className="w-full h-full relative font-sans text-white bg-black">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 25], fov: 60 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          
          <React.Suspense fallback={null}>
            {/* CRITICAL: isShapeMode forces the component to hide image planes */}
            <ParticleSystem 
                key={resetKey} 
                config={config} 
                progress={targetProgress}
                rotation={activeRotation}
                imageData={imageData}
                imageUrl={imageUrl}
                isShapeMode={isShapeMode}
            />
          </React.Suspense>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            autoRotate={!isCameraActive && targetProgress > 0.8} 
            autoRotateSpeed={0.8}
            enableDamping={true}
          />
        </Canvas>
      </div>

      {/* Start Modal */}
      {showStartModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              3D 粒子交互空间
            </h1>
            <p className="text-gray-400 mb-8">
              使用摄像头手势控制粒子扩散与3D旋转。
            </p>
            
            <div className="space-y-4">
               <button 
                onClick={() => handleStart(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-900/20"
               >
                 使用预设模型 (爱心/星球/花朵)
               </button>
               <div className="relative">
                   <button 
                    onClick={() => handleStart(true)}
                    className="w-full py-3 bg-zinc-800 border border-zinc-700 rounded-xl font-medium hover:bg-zinc-700 transition-all"
                   >
                     上传照片生成粒子
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />

      <HandTracker 
        isCameraEnabled={isCameraActive} 
        onGestureChange={setGestureData} 
      />

      {/* UI Overlay */}
      {!showStartModal && !isUIHidden && (
        <div className="absolute top-4 left-4 z-40 w-80 bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl transition-all duration-300 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-100">控制面板</h2>
            <button onClick={() => setIsUIHidden(true)} className="text-xs text-gray-500 hover:text-white">隐藏</button>
          </div>

          <div className="space-y-5">
            
            <div>
              <label className="text-xs text-gray-400 uppercase font-semibold mb-2 block">几何模型</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                    { l: '❤', v: ParticleShape.Heart },
                    { l: '🌸', v: ParticleShape.Flower },
                    { l: '🪐', v: ParticleShape.Planet },
                    { l: '✨', v: ParticleShape.Fireworks },
                ].map((item) => (
                  <button
                    key={item.v}
                    onClick={() => {
                        setConfig(c => ({...c, shape: item.v}));
                        // Strictly clear image data when switching to shape
                        if (item.v !== ParticleShape.Image) {
                            setImageData(undefined);
                            setImageUrl('');
                        }
                        // Reset immediately for synchronous shape switch
                        setResetKey(prev => prev + 1);
                    }}
                    className={`p-2 rounded-lg text-lg transition-colors ${config.shape === item.v ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {item.l}
                  </button>
                ))}
              </div>
              
              <label className="text-xs text-gray-400 uppercase font-semibold mb-2 block">图片模型</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                   <button onClick={() => handlePreset(PRESET_IMAGES[0])} className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded text-left border border-white/10">
                       Model 1 (Face)
                   </button>
                   <button onClick={() => handlePreset(PRESET_IMAGES[1])} className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded text-left border border-white/10">
                       Model 2 (Portrait)
                   </button>
              </div>

              <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-xs w-full py-2 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white transition rounded flex justify-center items-center gap-2">
                  <span>🖼</span> 上传照片
              </button>
            </div>

            <div>
                 <label className="text-xs text-gray-400 uppercase font-semibold mb-2 block">交互模式</label>
                 <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        isCameraActive 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                    }`}
                 >
                     <CameraIcon />
                     {isCameraActive ? "关闭摄像头" : "开启摄像头控制"}
                 </button>
                 
                 {isCameraActive && (
                     <div className="mt-2 text-xs text-gray-300 text-center bg-white/5 p-2 rounded">
                         ✋ <strong>张开手掌</strong>：炸开 (Scatter)<br/>
                         ✊ <strong>捏合/握拳</strong>：聚合 (Assemble)<br/>
                         🔄 <strong>转动手腕</strong>：旋转视角
                     </div>
                 )}

                 {!isCameraActive && (
                     <div className="mt-3">
                         <div className="flex justify-between text-xs mb-1">
                             <span className="text-gray-400">手动控制状态</span>
                             <span>{Math.round(manualProgress * 100)}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="1" step="0.01"
                            value={manualProgress}
                            onChange={(e) => setManualProgress(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                         />
                         <div className="flex justify-between text-xs mt-1 text-gray-500">
                             <span>💥 炸开</span>
                             <span>🧩 聚合</span>
                         </div>
                     </div>
                 )}
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400">颜色 (预设模型)</span>
                     <input 
                        type="color" 
                        value={config.color} 
                        onChange={(e) => setConfig(c => ({...c, color: e.target.value}))}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                     />
                </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                        <span>粒子数量</span>
                        <span>{config.count}</span>
                    </div>
                    <input 
                        type="range" min="2000" max="50000" step="1000"
                        value={config.count}
                        onChange={(e) => setConfig(c => ({...c, count: parseFloat(e.target.value)}))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                        <span>粒子大小</span>
                        <span>{config.size.toFixed(1)}</span>
                    </div>
                    <input 
                        type="range" min="1.0" max="8.0" step="0.1"
                        value={config.size}
                        onChange={(e) => setConfig(c => ({...c, size: parseFloat(e.target.value)}))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>

          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-40">
          {isUIHidden && (
              <button 
                onClick={() => setIsUIHidden(false)}
                className="bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
              >
                  显示控制
              </button>
          )}
          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-black/50 backdrop-blur rounded-full border border-white/20 text-white hover:bg-white/10 transition"
          >
              <ExpandIcon />
          </button>
      </div>

    </div>
  );
};

export default App;