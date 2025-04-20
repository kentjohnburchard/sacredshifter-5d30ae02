
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const SacredGeometryScene: React.FC<SceneProps> = ({ analyzer }) => {
  const geometryRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  useFrame(() => {
    if (!geometryRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate average frequency value
    let sum = 0;
    for (let i = 0; i < dataArray.current.length; i++) {
      sum += dataArray.current[i];
    }
    const average = sum / dataArray.current.length;
    
    // Apply to geometry
    geometryRef.current.rotation.y += 0.001;
    geometryRef.current.rotation.z += 0.0005;
    
    // Scale based on audio intensity
    const scale = 1 + (average / 256) * 0.2;
    geometryRef.current.scale.set(scale, scale, scale);
  });
  
  // Create Flower of Life pattern
  const createFlowerOfLife = () => {
    const radius = 0.3;
    const circles = [];
    
    // Center circle
    circles.push(
      <mesh key="center" position={[0, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} />
      </mesh>
    );
    
    // First ring (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      circles.push(
        <mesh key={`first-${i}`} position={[x, y, 0]}>
          <circleGeometry args={[radius, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} />
        </mesh>
      );
    }
    
    // Second ring (12 circles)
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const x = Math.cos(angle) * radius * 2;
      const y = Math.sin(angle) * radius * 2;
      
      circles.push(
        <mesh key={`second-${i}`} position={[x, y, 0]}>
          <circleGeometry args={[radius, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} />
        </mesh>
      );
    }
    
    return circles;
  };
  
  return (
    <group ref={geometryRef}>
      {createFlowerOfLife()}
    </group>
  );
};

export default SacredGeometryScene;
