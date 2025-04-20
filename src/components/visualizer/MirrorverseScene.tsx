
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const MirrorverseScene: React.FC<SceneProps> = ({ analyzer }) => {
  const groupRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Create mirrored particles
  const particleCount = 1000;
  
  // Create particle geometries
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 10;  // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z
      
      // Color
      colors[i * 3] = 0.5 + Math.random() * 0.5;  // r
      colors[i * 3 + 1] = Math.random() * 0.5;    // g
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;  // b
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);
  
  useFrame(() => {
    if (!groupRef.current || !analyzer || !dataArray.current || !particlesRef.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate average
    let sum = 0;
    for (let i = 0; i < dataArray.current.length; i++) {
      sum += dataArray.current[i];
    }
    const average = sum / dataArray.current.length / 256;
    
    // Update particles
    const positions = particlesRef.current.geometry.attributes.position;
    const initialPositions = particleGeometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      // Get initial position
      const ix = initialPositions.getX(i);
      const iy = initialPositions.getY(i);
      const iz = initialPositions.getZ(i);
      
      // Get frequency value for this particle
      const freqIndex = Math.floor(i / positions.count * dataArray.current.length);
      const freqValue = dataArray.current[freqIndex] / 256;
      
      // Create mirroring effect with audio reactivity
      const scale = 1 + average * 2;
      
      positions.setX(i, ix * scale * (1 + freqValue * 0.2));
      positions.setY(i, iy * scale * (1 + freqValue * 0.1));
      positions.setZ(i, iz * scale * (1 + freqValue * 0.3));
    }
    
    positions.needsUpdate = true;
    
    // Rotate
    groupRef.current.rotation.y += 0.001;
    groupRef.current.rotation.x += 0.0005;
  });
  
  return (
    <group ref={groupRef}>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial 
          size={0.05} 
          vertexColors 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default MirrorverseScene;
