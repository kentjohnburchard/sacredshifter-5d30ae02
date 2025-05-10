
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SceneProps } from '@/types/audio';
import * as THREE from 'three';

// Define chakra colors as constants
const CHAKRA_COLORS = [
  '#FF0000', // Root - Red
  '#FF7F00', // Sacral - Orange
  '#FFFF00', // Solar Plexus - Yellow
  '#00FF00', // Heart - Green
  '#0000FF', // Throat - Blue
  '#4B0082', // Third Eye - Indigo
  '#8B00FF', // Crown - Violet
];

const ChakraScene: React.FC<SceneProps> = ({ analyzer }) => {
  const chakraGroupRef = useRef<THREE.Group>(null);
  const chakraMatrices = useRef<THREE.Mesh[]>([]);
  
  // Setup frequency data array once and reuse it
  const dataArray = useMemo(() => {
    if (analyzer) {
      return new Uint8Array(analyzer.frequencyBinCount);
    }
    return null;
  }, [analyzer]);
  
  useFrame(() => {
    if (!chakraGroupRef.current || !analyzer || !dataArray) return;
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray);
    
    // Calculate band size once
    const bandSize = Math.floor(dataArray.length / CHAKRA_COLORS.length);
    
    // Animate chakras based on audio
    chakraMatrices.current.forEach((chakra, index) => {
      const start = bandSize * index;
      const end = start + bandSize;
      
      // Calculate average value for this chakra's frequency range
      let sum = 0;
      for (let i = start; i < end; i++) {
        sum += dataArray[i];
      }
      const average = sum / bandSize;
      
      // Normalize the intensity value between 0 and 1
      const intensity = average / 256;
      
      // Scale the chakra based on frequency intensity
      const scale = 1 + intensity * 0.5;
      chakra.scale.set(scale, scale, scale);
      
      // Rotate the chakra - faster rotation with higher frequencies
      chakra.rotation.z += 0.01 + intensity * 0.02;
    });
    
    // Rotate the entire chakra system slowly
    chakraGroupRef.current.rotation.y += 0.001;
  });
  
  // Create the chakra meshes
  const chakraMeshes = CHAKRA_COLORS.map((color, i) => (
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
  ));
  
  return (
    <group ref={chakraGroupRef}>
      {chakraMeshes}
    </group>
  );
};

export default ChakraScene;
