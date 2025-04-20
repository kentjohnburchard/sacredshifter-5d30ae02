
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneProps } from '@/types/audio';

const FractalScene: React.FC<SceneProps> = ({ analyzer }) => {
  const fractalRef = useRef<THREE.Group>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  // Create a simple recursive fractal pattern (Koch snowflake-inspired)
  const createFractalElements = (depth: number): JSX.Element[] => {
    if (depth <= 0) return [];
    
    const elements: JSX.Element[] = [];
    const scale = 1 / (1.5 ** (3 - depth));
    const angleIncrement = (Math.PI * 2) / 6;
    
    // Create a ring of objects
    for (let i = 0; i < 6; i++) {
      const angle = i * angleIncrement;
      const x = Math.cos(angle) * (2 * scale);
      const y = Math.sin(angle) * (2 * scale);
      const z = 0;
      
      const hue = (i / 6) * 0.1 + 0.7; // Blue-purple range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      
      elements.push(
        <mesh 
          key={`level-${depth}-${i}`}
          position={[x, y, z]}
          rotation={[0, 0, angle]}
          scale={[scale, scale, scale]}
          ref={el => { if (el) meshRefs.current.push(el); }}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.8}
            wireframe={depth > 2}
          />
        </mesh>
      );
      
      // Recursively add child elements
      if (depth > 1) {
        const childGroup = createFractalElements(depth - 1);
        elements.push(
          <group key={`group-${depth}-${i}`} position={[x * 0.8, y * 0.8, z]} scale={[0.35, 0.35, 0.35]}>
            {childGroup}
          </group>
        );
      }
    }
    
    return elements;
  };
  
  const fractalElements = useMemo(() => createFractalElements(3), []);
  
  useFrame(() => {
    if (!fractalRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Calculate frequency bands
    const bandSize = Math.floor(dataArray.current.length / 6);
    const bands = Array(6).fill(0);
    
    for (let i = 0; i < 6; i++) {
      let sum = 0;
      for (let j = 0; j < bandSize; j++) {
        const index = i * bandSize + j;
        if (index < dataArray.current.length) {
          sum += dataArray.current[index];
        }
      }
      bands[i] = sum / bandSize / 256;
    }
    
    // Apply to fractal elements
    meshRefs.current.forEach((mesh, i) => {
      const bandIndex = i % 6;
      const value = bands[bandIndex];
      
      // Scale and rotate based on audio
      mesh.scale.set(
        1 + value * 0.5,
        1 + value * 0.5,
        1 + value * 0.5
      );
      
      // Update material properties
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissiveIntensity = 0.5 + value * 2;
      }
    });
    
    // Rotate the entire fractal
    fractalRef.current.rotation.z += 0.002;
    fractalRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
  });
  
  return (
    <group ref={fractalRef}>
      {fractalElements}
    </group>
  );
};

export default FractalScene;
