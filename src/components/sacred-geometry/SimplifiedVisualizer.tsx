
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface VisualizerProps {
  shape?: string;
  colorScheme?: string;
  chakra?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  liftedVeil?: boolean;
}

const Scene: React.FC<{
  color: string;
  audioData?: Uint8Array;
}> = ({ color, audioData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Apply audio reactivity if available
      if (audioData && audioData.length > 0) {
        const average = Array.from(audioData).reduce((sum, value) => sum + value, 0) / audioData.length;
        const scale = 1 + (average / 255) * 0.3;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
    </mesh>
  );
};

export const SimplifiedVisualizer: React.FC<VisualizerProps> = ({
  shape = 'torus',
  colorScheme = 'purple',
  size = 'md',
  isAudioReactive = false,
  analyser,
  chakra,
  liftedVeil = false,
}) => {
  const [audioData, setAudioData] = useState<Uint8Array | undefined>();
  const animationRef = useRef<number | null>(null);

  // Get color based on chakra or colorScheme
  const getColor = () => {
    if (liftedVeil) return '#ff69b4'; // Pink for lifted veil
    
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root': return '#ff0000';
        case 'sacral': return '#ff8000';
        case 'solar plexus': return '#ffff00';
        case 'heart': return '#00ff00';
        case 'throat': return '#00ffff';
        case 'third eye': return '#0000ff';
        case 'crown': return '#8a2be2';
        default: return '#9370db';
      }
    }
    
    switch (colorScheme) {
      case 'blue': return '#1e90ff';
      case 'gold': return '#ffd700';
      default: return '#9370db'; // Purple default
    }
  };

  // Process audio data if audio reactive is enabled
  useEffect(() => {
    if (!isAudioReactive || !analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      animationRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAudioReactive, analyser]);

  // Set canvas size based on prop
  const canvasSizeClass = {
    sm: 'h-[150px]',
    md: 'h-[250px]',
    lg: 'h-full w-full',
    xl: 'h-full w-full'
  }[size] || 'h-full w-full';

  return (
    <div className={`w-full ${canvasSizeClass} relative overflow-hidden`}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={getColor()} />
        <Scene color={getColor()} audioData={audioData} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SimplifiedVisualizer;
