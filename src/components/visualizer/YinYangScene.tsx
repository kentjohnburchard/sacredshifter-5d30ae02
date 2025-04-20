
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const YinYangScene: React.FC<SceneProps> = ({ analyzer }) => {
  const yinYangRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  useFrame(() => {
    if (!yinYangRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate average for different frequency bands
    const lowAvg = getAverageVolume(dataArray.current, 0, 8);
    const midAvg = getAverageVolume(dataArray.current, 8, 24);
    const highAvg = getAverageVolume(dataArray.current, 24, dataArray.current.length - 1);
    
    // Apply to yin yang
    const children = yinYangRef.current.children;
    
    // Yin (dark) part
    if (children[0] instanceof THREE.Mesh) {
      children[0].scale.set(1 + lowAvg * 0.5, 1 + lowAvg * 0.5, 1 + lowAvg * 0.5);
    }
    
    // Yang (light) part
    if (children[1] instanceof THREE.Mesh) {
      children[1].scale.set(1 + midAvg * 0.5, 1 + midAvg * 0.5, 1 + midAvg * 0.5);
    }
    
    // Center dots
    if (children[2] instanceof THREE.Mesh) {
      children[2].scale.set(1 + highAvg, 1 + highAvg, 1 + highAvg);
    }
    
    if (children[3] instanceof THREE.Mesh) {
      children[3].scale.set(1 + highAvg, 1 + highAvg, 1 + highAvg);
    }
    
    // Rotate based on audio intensity
    const rotationSpeed = 0.002 + (lowAvg + midAvg) * 0.01;
    yinYangRef.current.rotation.y += rotationSpeed;
    yinYangRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.2;
  });
  
  // Helper function to get average volume for a frequency range
  const getAverageVolume = (array: Uint8Array, start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += array[i];
    }
    return sum / (end - start) / 256;
  };
  
  return (
    <group ref={yinYangRef}>
      {/* Yin (dark) half */}
      <mesh>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#000000" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Yang (light) half */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Yin dot in Yang */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Yang dot in Yin */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export default YinYangScene;
