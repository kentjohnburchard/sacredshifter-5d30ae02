
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const LeylineScene: React.FC<SceneProps> = ({ analyzer }) => {
  const linesRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  useFrame(() => {
    if (!linesRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Apply to lines
    linesRef.current.children.forEach((line, i) => {
      const freqIndex = Math.floor(i / linesRef.current!.children.length * dataArray.current!.length);
      const value = dataArray.current![freqIndex] / 128.0;
      
      // Scale lines based on frequency
      if (line instanceof THREE.Mesh) {
        line.scale.z = 0.5 + value;
        line.material.opacity = 0.5 + value * 0.5;
      }
    });
    
    // Rotate slowly
    linesRef.current.rotation.y += 0.001;
  });
  
  const createLeylines = () => {
    const lines = [];
    const count = 50;
    const radius = 10;
    
    for (let i = 0; i < count; i++) {
      // Create random points within a sphere
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + Math.PI * (0.5 + Math.random() * 1.5);
      
      const startX = Math.cos(startAngle) * radius * Math.random();
      const startY = (Math.random() - 0.5) * radius;
      const startZ = Math.sin(startAngle) * radius * Math.random();
      
      const endX = Math.cos(endAngle) * radius * Math.random();
      const endY = (Math.random() - 0.5) * radius;
      const endZ = Math.sin(endAngle) * radius * Math.random();
      
      // Create the line
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(endX, endY, endZ)
      );
      
      const color = new THREE.Color(0.2 + Math.random() * 0.5, 0.2, 0.8 + Math.random() * 0.2);
      
      lines.push(
        <mesh key={i}>
          <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      );
    }
    
    return lines;
  };
  
  return (
    <group ref={linesRef}>
      {createLeylines()}
    </group>
  );
};

export default LeylineScene;
