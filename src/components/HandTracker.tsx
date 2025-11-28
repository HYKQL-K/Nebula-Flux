import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { GestureData } from '../types';

interface HandTrackerProps {
  onGestureChange: (data: GestureData) => void;
  isCameraEnabled: boolean;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onGestureChange, isCameraEnabled }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!isCameraEnabled) return;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        landmarkerRef.current = landmarker;
        setIsLoaded(true);
        startDetection();
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
      }
    };

    setupMediaPipe();

    return () => {
        cancelAnimationFrame(requestRef.current);
        landmarkerRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraEnabled]);

  const startDetection = () => {
    const detect = () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        landmarkerRef.current
      ) {
        const video = webcamRef.current.video;
        const startTimeMs = performance.now();
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          const worldLandmarks = results.worldLandmarks?.[0];

          // --- Pinch Detection (Scaling) ---
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const wrist = landmarks[0];
          const middleFingerMCP = landmarks[9];

          // Reference scale: Wrist to Middle MCP (approx hand size)
          const handSize = Math.sqrt(
            Math.pow(middleFingerMCP.x - wrist.x, 2) +
            Math.pow(middleFingerMCP.y - wrist.y, 2)
          );

          const pinchDist = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2)
          );

          // Normalize pinch based on hand size
          let factor = (pinchDist / handSize);
          const minVal = 0.2;
          const maxVal = 0.9; 
          factor = (factor - minVal) / (maxVal - minVal);
          factor = Math.max(0, Math.min(1, factor));

          // --- Rotation Detection (Orientation) ---
          let rotX = 0, rotY = 0, rotZ = 0;

          if (worldLandmarks) {
            // World landmarks are in meters, centered at 0,0,0
            // Wrist
            const wWrist = worldLandmarks[0];
            // Index MCP
            const wIndex = worldLandmarks[5];
            // Pinky MCP
            const wPinky = worldLandmarks[17];
            
            // Calculate Palm Normal Vector
            // V1: Wrist -> Index
            const v1 = { 
                x: wIndex.x - wWrist.x, 
                y: wIndex.y - wWrist.y, 
                z: wIndex.z - wWrist.z 
            };
            // V2: Wrist -> Pinky
            const v2 = { 
                x: wPinky.x - wWrist.x, 
                y: wPinky.y - wWrist.y, 
                z: wPinky.z - wWrist.z 
            };

            // Cross Product (v1 x v2) -> Normal perpendicular to palm
            const normal = {
                x: v1.y * v2.z - v1.z * v2.y,
                y: v1.z * v2.x - v1.x * v2.z,
                z: v1.x * v2.y - v1.y * v2.x
            };
            
            // Normalize
            const len = Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z*normal.z);
            const n = { x: normal.x/len, y: normal.y/len, z: normal.z/len };

            // Rotation Logic:
            // MediaPipe World Coords: +Y is down, +Z is camera looking at hand
            
            // Pitch (Up/Down): Corresponds to normal Y
            rotX = n.y * 2.5; 

            // Yaw (Left/Right): Corresponds to normal X
            rotY = -n.x * 2.5; 

            // Roll (Tilt): Angle of vector (Wrist -> Middle Finger) in X-Y plane
            // We use screen landmarks for Z rotation as it maps better to 2D screen tilt
            const sWrist = landmarks[0];
            const sMiddle = landmarks[9];
            const dx = sMiddle.x - sWrist.x;
            const dy = sMiddle.y - sWrist.y;
            
            // atan2(x, y) gives angle from Y-axis. 
            // Negative because screen Y is inverted compared to standard Cartesian
            rotZ = -Math.atan2(dx, -dy);
          }

          onGestureChange({ 
              factor, 
              rotation: { x: rotX, y: rotY, z: rotZ } 
          });

        } else {
            // No hand detected
            onGestureChange({ factor: -1, rotation: { x: 0, y: 0, z: 0 } });
        }
      }
      requestRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  if (!isCameraEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border border-white/20 shadow-lg pointer-events-none">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
          Loading AI...
        </div>
      )}
      <Webcam
        ref={webcamRef}
        className="w-full h-full object-cover transform scale-x-[-1]"
        mirrored
        audio={false}
        width={256}
        height={192}
      />
    </div>
  );
};

export default HandTracker;