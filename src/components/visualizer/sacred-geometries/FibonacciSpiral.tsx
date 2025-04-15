
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

  const { rotation: springRotation, scale: springScale } = useSpring({
    rotation: [rotation[0], rotation[1] + intensity * Math.PI * 0.3, rotation[2]] as any,
    scale: scale * (1 + intensity * 0.2),
    config: { tension: 100, friction: 14 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.005;
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * normalizedFreq * 0.3;
      }
    }
  });

  // Create the Fibonacci spiral using the golden ratio
  const spiralElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const goldenRatio = 1.618033988749895;
    const emissiveIntensity = liftTheVeil ? 1.5 : 0.8;
    const totalSegments = 24;
    
    // Create spiral segments
    const spiralPoints: THREE.Vector3[] = [];
    
    for (let i = 0; i < totalSegments; i++) {
      const angle = i * 0.5 * Math.PI;
      const radius = Math.pow(goldenRatio, i / 10) * 0.1;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      spiralPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    // Create curve from points
    const curve = new THREE.CatmullRomCurve3(spiralPoints);
    const curvePoints = curve.getPoints(100);
    
    // Create line from curve
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    elements.push(
      <line key="spiral-line">
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial 
          attach="material"
          color={color} 
          linewidth={2} 
        />
      </line>
    );
    
    // Add spheres along the spiral at Fibonacci points
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21];
    fibonacci.forEach((num, index) => {
      const scaledNum = num * 0.05;
      const point = curve.getPointAt(Math.min(scaledNum, 1));
      
      elements.push(
        <mesh key={`fib-sphere-${index}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.05 + index * 0.02, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      );
    });
    
    // Add golden rectangle to demonstrate golden ratio
    const rectSize = 0.8;
    elements.push(
      <group key="golden-rect" position={[0, 0, -0.01]}>
        <mesh>
          <planeGeometry args={[rectSize, rectSize]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.1} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        <mesh position={[-rectSize/4, -rectSize/4, 0]}>
          <planeGeometry args={[rectSize/2, rectSize/2]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.15} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>
    );
    
    // Add spiral helper circles
    for (let i = 0; i <= 4; i++) {
      const size = Math.pow(goldenRatio, i) * 0.1;
      const segmentAngle = i % 4;
      let position: [number, number, number] = [0, 0, 0];
      
      switch (segmentAngle) {
        case 0: position = [size/2, size/2, 0]; break;
        case 1: position = [-size/2, size/2, 0]; break;
        case 2: position = [-size/2, -size/2, 0]; break;
        case 3: position = [size/2, -size/2, 0]; break;
      }
      
      elements.push(
        <mesh key={`helper-circle-${i}`} position={position}>
          <circleGeometry args={[size, 32]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }
    
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
      {spiralElements}
    </animated.group>
  );
};

export default FibonacciSpiralGeometry;
