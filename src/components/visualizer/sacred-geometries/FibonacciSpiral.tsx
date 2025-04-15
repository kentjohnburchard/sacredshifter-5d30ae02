
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';
import { Trail } from '@react-three/drei';

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
  const pointsRef = useRef<THREE.Points>(null);
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
    rotation: [rotation[0] + intensity * Math.PI * 0.1, rotation[1] + intensity * Math.PI * 0.2, rotation[2]] as any,
    scale: scale * (1 + intensity * 0.2),
    config: { tension: 100, friction: 12 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.002;
      
      if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      }
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * normalizedFreq * 0.2;
      }
    }
  });

  // Create Fibonacci spiral points
  const spiralPoints = useMemo(() => {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const points: THREE.Vector3[] = [];
    const numPoints = 200;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = 0.1 * i;
      const radius = 0.04 * Math.pow(phi, angle / Math.PI);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = i * 0.002;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    return points;
  }, []);

  // Create the spiral line
  const spiralLine = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7
    });
    
    return new THREE.Line(lineGeometry, lineMaterial);
  }, [spiralPoints, color]);

  // Create particle system using the spiral points
  const spiralParticles = useMemo(() => {
    const numParticles = 500;
    const particlePositions = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const theta = 0.15 * i;
      const phi = (1 + Math.sqrt(5)) / 2;
      const radius = 0.05 * Math.pow(phi, theta / Math.PI);
      
      particlePositions[i * 3] = radius * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(theta);
      particlePositions[i * 3 + 2] = (i / numParticles) * 0.5;
    }
    
    return particlePositions;
  }, []);

  // Calculate Fibonacci squares for visualization
  const fibonacciSquares = useMemo(() => {
    const squares: JSX.Element[] = [];
    const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];
    let posX = 0;
    let posY = 0;
    
    for (let i = 0; i < fibSequence.length; i++) {
      const size = fibSequence[i] * 0.05;
      
      squares.push(
        <mesh key={`square-${i}`} position={[posX + size/2, posY + size/2, 0]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.1} 
            wireframe 
          />
        </mesh>
      );
      
      // Update position for next square based on the fibonacci sequence
      if (i % 4 === 0) posX += fibSequence[i] * 0.05;
      else if (i % 4 === 1) posY -= fibSequence[i] * 0.05;
      else if (i % 4 === 2) posX -= fibSequence[i] * 0.05;
      else posY += fibSequence[i] * 0.05;
    }
    
    return squares;
  }, [color]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={springRotation}
      scale={springScale}
      visible={isActive}
    >
      {/* Fibonacci spiral line */}
      <primitive object={spiralLine} />
      
      {/* Particle system */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={spiralParticles.length / 3}
            array={spiralParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={liftTheVeil ? '#ff69b4' : color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Fibonacci squares */}
      {fibonacciSquares}
      
      {/* Animated trail point */}
      <Trail
        width={0.02}
        length={20}
        color={liftTheVeil ? '#ff1493' : color}
        attenuation={(t) => t * t}
      >
        <mesh position={[spiralPoints[spiralPoints.length - 1].x, spiralPoints[spiralPoints.length - 1].y, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={liftTheVeil ? '#ff1493' : color} />
        </mesh>
      </Trail>
    </animated.group>
  );
};

export default FibonacciSpiralGeometry;
