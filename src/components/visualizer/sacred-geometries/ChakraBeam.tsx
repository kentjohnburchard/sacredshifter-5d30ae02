
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';
import { Trail } from '@react-three/drei';

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
  const beamRef = useRef<THREE.Group>(null);
  const chakraColors = {
    root: '#ef4444',
    sacral: '#f97316',
    'solar plexus': '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    'third eye': '#6366f1',
    crown: '#a855f7'
  };
  const { liftTheVeil } = useTheme();
  
  const [chakraPoints, setChakraPoints] = useState<THREE.Mesh[]>([]);
  
  const { scale: springScale } = useSpring({
    scale: scale * (1 + intensity * 0.3),
    config: { tension: 80, friction: 10 }
  });
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      
      if (beamRef.current) {
        beamRef.current.rotation.y = -state.clock.getElapsedTime() * 0.2;
      }
      
      // Handle audio reactivity for each chakra point
      if (frequencyData && frequencyData.length > 0 && chakraPoints.length > 0) {
        const chunkSize = Math.floor(frequencyData.length / 7);
        
        chakraPoints.forEach((point, i) => {
          if (point) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            if (start < frequencyData.length) {
              const chunk = Array.from(
                frequencyData.slice(start, Math.min(end, frequencyData.length))
              ).map(Number);
              
              if (chunk.length > 0) {
                const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
                const intensity = avg / 255;
                
                point.scale.set(1 + intensity * 0.5, 1 + intensity * 0.5, 1 + intensity * 0.5);
                
                if (point.material) {
                  const material = point.material as THREE.MeshStandardMaterial;
                  if (material && material.emissiveIntensity !== undefined) {
                    material.emissiveIntensity = 0.8 + intensity * 2;
                  }
                }
              }
            }
          }
        });
      }
    }
  });
  
  // Create chakra visualization
  const chakraElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const chakraKeys = Object.keys(chakraColors);
    const beamHeight = 4;
    const beamRadius = 0.05;
    
    // Create main beam
    elements.push(
      <mesh key="main-beam" position={[0, 0, 0]}>
        <cylinderGeometry args={[beamRadius, beamRadius, beamHeight, 16]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ffffff' : '#dddddd'}
          transparent
          opacity={0.3}
        />
      </mesh>
    );
    
    // Create chakra points along the beam
    chakraKeys.forEach((key, i) => {
      const t = i / (chakraKeys.length - 1);
      const height = -beamHeight/2 + beamHeight * t;
      const chakraColor = chakraColors[key as keyof typeof chakraColors];
      
      elements.push(
        <group key={`chakra-${i}`} position={[0, height, 0]}>
          <mesh 
            ref={(mesh) => {
              if (mesh) {
                setChakraPoints(prev => {
                  const newPoints = [...prev];
                  newPoints[i] = mesh;
                  return newPoints;
                });
              }
            }}
          >
            <sphereGeometry args={[beamRadius * 3, 32, 32]} />
            <meshStandardMaterial 
              color={chakraColor} 
              emissive={chakraColor} 
              emissiveIntensity={1.5} 
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          
          <Trail
            width={0.02}
            length={10}
            color={chakraColor}
            attenuation={(t) => t * t}
          >
            <mesh position={[0.3, 0, 0]}>
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color={chakraColor} />
            </mesh>
          </Trail>
        </group>
      );
      
      // Add circular disk at each chakra point
      elements.push(
        <mesh key={`disk-${i}`} position={[0, height, 0]} rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[beamRadius * 2, beamRadius * 4, 32]} />
          <meshBasicMaterial 
            color={chakraColor} 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    });
    
    return elements;
  }, [liftTheVeil]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={springScale}
      visible={isActive}
    >
      <group ref={beamRef}>
        {chakraElements}
      </group>
    </animated.group>
  );
};

export default ChakraBeamGeometry;
