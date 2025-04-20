
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const MetatronScene: React.FC<SceneProps> = ({ analyzer }) => {
  const cubeRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const linesRef = useRef<THREE.LineSegments[]>([]);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  useFrame(() => {
    if (!cubeRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const bandSize = Math.floor(dataArray.current.length / 7);
    const bands = Array(7).fill(0);
    
    for (let i = 0; i < 7; i++) {
      let sum = 0;
      for (let j = 0; j < bandSize; j++) {
        const index = i * bandSize + j;
        if (index < dataArray.current.length) {
          sum += dataArray.current[index];
        }
      }
      bands[i] = sum / bandSize / 256;
    }
    
    // Apply to Metatron's Cube
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      
      const index = i % 7;
      const scale = 1 + bands[index] * 0.5;
      
      // Pulse the lines based on the frequency bands
      if (line.material instanceof THREE.LineBasicMaterial) {
        const hue = (index / 7) * 0.8 + 0.6; // Shift toward blue/purple spectrum
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + bands[index] * 0.5);
        line.material.color = color;
        
        // Pulse thickness by scaling the group
        line.scale.set(scale, scale, scale);
      }
    });
    
    // Rotate slowly
    cubeRef.current.rotation.y += 0.002;
    cubeRef.current.rotation.x += 0.001;
  });
  
  // Create Metatron's Cube
  const createMetatronsCube = () => {
    // Points for the 13 circles
    const points = [];
    
    // Center point
    points.push(new THREE.Vector3(0, 0, 0));
    
    // First ring (6 points)
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push(new THREE.Vector3(
        Math.cos(angle) * 1,
        Math.sin(angle) * 1,
        0
      ));
    }
    
    // Second ring (6 points)
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      points.push(new THREE.Vector3(
        Math.cos(angle) * 2,
        Math.sin(angle) * 2,
        0
      ));
    }
    
    // Create lines connecting all points
    const lines = [];
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          points[i],
          points[j]
        ]);
        
        const material = new THREE.LineBasicMaterial({ 
          color: new THREE.Color().setHSL(i / points.length, 0.8, 0.5),
          linewidth: 1
        });
        
        const line = new THREE.Line(geometry, material);
        lines.push(line);
      }
    }
    
    return lines.map((line, i) => (
      <primitive 
        key={i} 
        object={line} 
        ref={el => { if (el) linesRef.current[i] = el; }}
      />
    ));
  };
  
  return (
    <group ref={cubeRef}>
      {createMetatronsCube()}
    </group>
  );
};

export default MetatronScene;
