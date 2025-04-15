
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
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
  const color = chakraColors[chakra || 'crown'];
  const { liftTheVeil } = useTheme();

  const { rotation: springRotation, scale: springScale } = useSpring({
    rotation: [rotation[0], rotation[1] + intensity * Math.PI * 0.4, rotation[2]] as any,
    scale: scale * (1 + intensity * 0.15),
    config: { tension: 100, friction: 14 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.002;
      
      if (beamRef.current) {
        // Make the beam pulse
        beamRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      }
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        // Apply audio reactivity
        if (beamRef.current) {
          beamRef.current.scale.x = 1 + normalizedFreq * 0.3;
          beamRef.current.scale.z = 1 + normalizedFreq * 0.3;
          beamRef.current.position.y = normalizedFreq * 0.5;
        }
      }
    }
  });

  // Create chakra beam elements
  const chakraBeamElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const emissiveIntensity = liftTheVeil ? 1.5 : 1.0;
    
    // Create the main beam
    elements.push(
      <group ref={beamRef} key="beam-group" position={[0, 0, 0]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.1, 0.5, 2, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity * 2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    );
    
    // Create chakra discs at different heights
    const chakraPoints = [
      { y: -0.6, scale: 0.5, color: '#ef4444' }, // Root
      { y: -0.4, scale: 0.45, color: '#f97316' }, // Sacral
      { y: -0.2, scale: 0.4, color: '#facc15' }, // Solar Plexus
      { y: 0, scale: 0.35, color: '#22c55e' }, // Heart
      { y: 0.2, scale: 0.3, color: '#3b82f6' }, // Throat
      { y: 0.4, scale: 0.25, color: '#6366f1' }, // Third Eye
      { y: 0.6, scale: 0.2, color: '#a855f7' }  // Crown
    ];
    
    chakraPoints.forEach((point, index) => {
      elements.push(
        <mesh key={`chakra-disc-${index}`} position={[0, point.y, 0]}>
          <cylinderGeometry args={[point.scale, point.scale, 0.05, 16]} />
          <meshStandardMaterial
            color={point.color}
            emissive={point.color}
            emissiveIntensity={emissiveIntensity}
            transparent
            opacity={0.8}
          />
        </mesh>
      );
      
      // Add particle effects for each chakra
      const particleCount = 10;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = point.scale * 1.2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        elements.push(
          <mesh key={`chakra-particle-${index}-${i}`} position={[x, point.y, z]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={point.color}
              emissive={point.color}
              emissiveIntensity={emissiveIntensity * 2}
            />
          </mesh>
        );
      }
    });
    
    // Add vertical line connecting chakras
    // Create points for the line
    const positions = new Float32Array(chakraPoints.length * 3);
    chakraPoints.forEach((point, i) => {
      positions[i * 3] = 0; // x
      positions[i * 3 + 1] = point.y; // y
      positions[i * 3 + 2] = 0; // z
    });
    
    elements.push(
      <line key="chakra-line">
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          linewidth={1}
        />
      </line>
    );
    
    return elements;
  }, [color, liftTheVeil]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={springRotation}
      scale={springScale}
      visible={isActive}
    >
      {chakraBeamElements}
    </animated.group>
  );
};

export default ChakraBeamGeometry;
