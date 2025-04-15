
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
  visualizerMode?: 'flowerOfLife' | 'merkaba' | 'torus' | 'customPrimePulse';
};

const chakraColors: Record<string, string> = {
  root: '#ef4444',
  sacral: '#f97316',
  'solar plexus': '#facc15',
  heart: '#22c55e',
  throat: '#3b82f6',
  'third eye': '#6366f1',
  crown: '#a855f7'
};

const SacredGeometry = ({ frequencyData, chakra, visualizerMode = 'merkaba' }: SacredVisualizerCanvasProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pulseRef = useRef<number>(0);

  const getColor = chakraColors[chakra || 'crown'] || '#a855f7';

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    pulseRef.current += 0.01;

    if (visualizerMode === 'customPrimePulse') {
      const scale = 1 + Math.sin(pulseRef.current * 2) * 0.2;
      mesh.scale.set(scale, scale, scale);
    } else {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
    }

    if (frequencyData && frequencyData.length) {
      const avg =
        frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;
      const intensity = avg / 255;
      mesh.material.emissiveIntensity = intensity * 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color={getColor} emissive={getColor} emissiveIntensity={0.5} />
    </mesh>
  );
};

const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra,
  visualizerMode
}) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <SacredGeometry
          frequencyData={frequencyData}
          chakra={chakra}
          visualizerMode={visualizerMode}
        />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default SacredVisualizerCanvas;
