
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const FibonacciSpiralGeometry: React.FC<SacredGeometryProps> = ({
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
  const color = chakra ? chakraColors[chakra] || '#a855f7' : '#a855f7';
  const { liftTheVeil } = useTheme();

  const { rotation: springRotation, scale: springScale } = useSpring({
    rotation: [rotation[0], rotation[1] + intensity * Math.PI * 0.3, rotation[2]],
    scale: scale * (1 + intensity * 0.15),
    config: { tension: 90, friction: 13 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.003;
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * normalizedFreq * 0.2;
      }
    }
  });

  // Create the Fibonacci spiral points
  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numPoints = 100;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const maxRadius = 2;
    
    for (let i = 0; i < numPoints; i++) {
      const theta = i * 0.1;
      const radius = Math.min((Math.pow(goldenRatio, (2 * theta) / Math.PI) - 1) / 10, maxRadius);
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    return points;
  }, []);

  // Create the geometry from the points
  const spiralGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(spiralPoints);
  }, [spiralPoints]);

  // Create inner glow circles along the spiral
  const glowCircles = useMemo(() => {
    return spiralPoints.filter((_, i) => i % 6 === 0).map((point, i) => {
      const size = 0.05 + (i / spiralPoints.length) * 0.15;
      return (
        <mesh key={`glow-${i}`} position={[point.x, point.y, 0]}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={liftTheVeil ? 1.5 : 1.0}
            transparent
            opacity={0.7}
          />
        </mesh>
      );
    });
  }, [spiralPoints, color, liftTheVeil]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={springRotation}
      scale={springScale}
      visible={isActive}
    >
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={spiralPoints.length}
            array={new Float32Array(spiralPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={color}
          transparent={true}
          opacity={0.7}
          linewidth={1}
        />
      </line>
      
      {glowCircles}
      
      {/* Additional decorative elements */}
      <mesh>
        <ringGeometry args={[1.8, 2.0, 64]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ff69b4' : color} 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Inner decorative circle */}
      <mesh>
        <ringGeometry args={[0.1, 0.2, 32]} />
        <meshBasicMaterial 
          color={liftTheVeil ? '#ff1493' : color} 
          transparent 
          opacity={0.8} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </animated.group>
  );
};

export default FibonacciSpiralGeometry;
