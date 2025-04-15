
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const ChakraBeamGeometry: React.FC<SacredGeometryProps> = ({
  chakra = 'crown',
  intensity = 0,
  frequencyData,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isActive = true
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const chakraColors = {
    root: '#ef4444',
    sacral: '#f97316',
    'solar plexus': '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    'third eye': '#6366f1',
    crown: '#a855f7'
  };
  
  const color = chakraColors[chakra || 'crown'];
  const { liftTheVeil } = useTheme();
  
  // Create particles
  const particlePositions = useMemo(() => {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;
    }
    
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.005;

      // Apply frequency data to particle animation if available
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const bassFreq = freqArray.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
        const normalizedBass = bassFreq / 255;
        
        // Scale the group based on frequency
        const dynamicScale = 1 + normalizedBass * 0.3;
        groupRef.current.scale.set(
          scale * dynamicScale,
          scale * dynamicScale,
          scale * dynamicScale
        );
      }
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      rotation={rotation}
      scale={scale}
      visible={isActive}
    >
      {/* Central beam */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.3, 4, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={liftTheVeil ? 2.0 : 1.5} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Energy particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent={true}
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Base platform */}
      <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ff69b4' : color} 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Top glow */}
      <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.3, 32]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ff1493' : color} 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default ChakraBeamGeometry;
