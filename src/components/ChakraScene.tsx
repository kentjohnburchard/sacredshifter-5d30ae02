
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SceneProps } from '@/types/audio';
import * as THREE from 'three';

const ChakraScene: React.FC<SceneProps> = ({ analyzer }) => {
  const chakraGroupRef = useRef<THREE.Group>(null);
  const chakraMatrices = useRef<THREE.Mesh[]>([]);
  
  // Chakra colors
  const chakraColors = [
    '#FF0000', // Root - Red
    '#FF7F00', // Sacral - Orange
    '#FFFF00', // Solar Plexus - Yellow
    '#00FF00', // Heart - Green
    '#0000FF', // Throat - Blue
    '#4B0082', // Third Eye - Indigo
    '#8B00FF', // Crown - Violet
  ];
  
  // Setup frequency data array
  const dataArray = useRef<Uint8Array | null>(null);
  
  // Initialize the data array if analyzer is available
  if (analyzer && !dataArray.current) {
    dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
  }
  
  useFrame(() => {
    if (!chakraGroupRef.current || !analyzer || !dataArray.current) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray.current);
    
    // Animate chakras based on audio
    chakraMatrices.current.forEach((chakra, index) => {
      const bandSize = Math.floor(dataArray.current!.length / 7);
      const start = bandSize * index;
      const end = start + bandSize;
      
      // Calculate average value for this chakra's frequency range
      let sum = 0;
      for (let i = start; i < end; i++) {
        sum += dataArray.current![i];
      }
      const average = sum / bandSize;
      
      // Scale the chakra based on frequency intensity
      const scale = 1 + (average / 256) * 0.5;
      chakra.scale.set(scale, scale, scale);
      
      // Rotate the chakra
      chakra.rotation.z += 0.01 + (average / 256) * 0.02;
    });
    
    // Rotate the entire chakra system
    chakraGroupRef.current.rotation.y += 0.001;
  });
  
  return (
    <group ref={chakraGroupRef}>
      {chakraColors.map((color, i) => (
        <mesh 
          key={i} 
          position={[0, i * 0.8 - 2.4, 0]}
          ref={(mesh) => {
            if (mesh && !chakraMatrices.current.includes(mesh)) {
              chakraMatrices.current[i] = mesh;
            }
          }}
        >
          <torusGeometry args={[0.5 + i * 0.08, 0.2, 16, 50]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ChakraScene;
