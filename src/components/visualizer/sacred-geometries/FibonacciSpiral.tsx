
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
  const color = chakraColors[chakra || 'crown'];
  const { liftTheVeil } = useTheme();

  const { rotation: springRotation, scale: springScale } = useSpring({
    rotation: [rotation[0], rotation[1] + intensity * Math.PI * 0.3, rotation[2]] as any,
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
      const radius = Math.pow(goldenRatio, (2 * theta) / Math.PI) * 0.1;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      
      if (radius > maxRadius) break;
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    return points;
  }, []);

  // Create the spiral elements
  const spiralElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const emissiveIntensity = liftTheVeil ? 1.5 : 1.0;
    const threeColor = new THREE.Color(color);
    
    // Create the main spiral line using proper THREE.js approach
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: threeColor,
      transparent: true,
      opacity: 0.8
    });
    
    elements.push(
      <primitive
        key="main-spiral"
        object={new THREE.Line(lineGeometry, lineMaterial)}
      />
    );
    
    // Add points along the spiral
    spiralPoints.forEach((point, i) => {
      if (i % 5 === 0) {
        const pointSize = ((i / spiralPoints.length) * 0.1) + 0.02;
        
        elements.push(
          <mesh key={`point-${i}`} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[pointSize, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        );
      }
    });
    
    // Add some decorative elements
    elements.push(
      <mesh key="center-point" position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );
    
    // Add golden ratio circles
    for (let i = 1; i <= 5; i++) {
      const radius = i * 0.3;
      
      const circlePoints = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        circlePoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            -0.01
          )
        );
      }
      
      const circleGeometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const circleMaterial = new THREE.LineBasicMaterial({
        color: threeColor,
        transparent: true,
        opacity: 0.3
      });
      
      elements.push(
        <primitive
          key={`circle-${i}`}
          object={new THREE.Line(circleGeometry, circleMaterial)}
        />
      );
    }
    
    return elements;
  }, [spiralPoints, color, liftTheVeil]);

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
