
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const MerkabaGeometry: React.FC<SacredGeometryProps> = ({ 
  chakra = 'crown', 
  intensity = 0, 
  frequencyData,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isActive = true
}) => {
  const merkabaRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const color = chakra ? {
    root: '#ef4444',
    sacral: '#f97316',
    'solar plexus': '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    'third eye': '#6366f1',
    crown: '#a855f7'
  }[chakra] : '#a855f7';
  const { liftTheVeil } = useTheme();
  
  const emissiveIntensity = liftTheVeil ? 2.0 : 1.5;
  
  useFrame((state) => {
    if (merkabaRef.current && isActive) {
      merkabaRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      merkabaRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      
      if (innerRef.current) {
        innerRef.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
        innerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.2;
      }
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        const dynamicScale = 1 + normalizedFreq * 0.3;
        
        merkabaRef.current.scale.set(
          scale * dynamicScale, 
          scale * dynamicScale, 
          scale * dynamicScale
        );
      }
    }
  });
  
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  }, []);
  
  return (
    <group 
      ref={merkabaRef}
      position={position}
      rotation={rotation}
      scale={scale}
      visible={isActive}
    >
      <mesh>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
          wireframe 
        />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI]}>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity * 0.8} 
          wireframe 
        />
      </mesh>
      
      <group ref={innerRef} scale={[0.6, 0.6, 0.6]}>
        <mesh>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={liftTheVeil ? '#ff1493' : '#9400d3'} 
            emissive={liftTheVeil ? '#ff1493' : '#9400d3'} 
            emissiveIntensity={emissiveIntensity * 1.2} 
            wireframe 
          />
        </mesh>
        
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
            color={liftTheVeil ? '#ff69b4' : '#9370db'} 
            sizeAttenuation 
            transparent 
            opacity={0.8} 
          />
        </points>
      </group>
      
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ff69b4' : '#9370db'} 
          wireframe 
          transparent 
          opacity={0.2} 
        />
      </mesh>
    </group>
  );
};

export default MerkabaGeometry;
