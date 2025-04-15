
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const FlowerOfLifeGeometry: React.FC<SacredGeometryProps> = ({
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
    rotation: [rotation[0], rotation[1] + intensity * Math.PI * 0.5, rotation[2]] as any,
    scale: scale * (1 + intensity * 0.2),
    config: { tension: 120, friction: 14 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;

      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;

        groupRef.current.rotation.y += normalizedFreq * 0.01;
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * normalizedFreq * 0.2;
      }
    }
  });

  const circles = React.useMemo(() => {
    const items: JSX.Element[] = [];
    const circleRadius = 0.5;
    const emissiveIntensity = liftTheVeil ? 1.2 : 0.8;

    for (let ring = 0; ring < 4; ring++) {
      const ringRadius = ring * circleRadius * Math.sqrt(3);
      const numInRing = ring === 0 ? 1 : 6 * ring;

      for (let i = 0; i < numInRing; i++) {
        const angle = (i * 2 * Math.PI) / numInRing;
        const x = ringRadius * Math.cos(angle);
        const y = ringRadius * Math.sin(angle);

        if (ring % 2 === 0 || i % 3 === 0) {
          items.push(
            <mesh key={`circle-${ring}-${i}`} position={[x, y, 0]}>
              <circleGeometry args={[circleRadius, 64]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={emissiveIntensity}
                wireframe
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        } else {
          items.push(
            <mesh key={`sphere-${ring}-${i}`} position={[x, y, 0]}>
              <sphereGeometry args={[circleRadius * 0.3, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={emissiveIntensity}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
          );
        }

        if (ring > 0 && i % 2 === 0) {
          const innerAngle = ((i / numInRing) * 2 * Math.PI);
          const innerRingRadius = (ring - 1) * circleRadius * Math.sqrt(3);
          const innerX = innerRingRadius * Math.cos(innerAngle);
          const innerY = innerRingRadius * Math.sin(innerAngle);
          
          // Create line using THREE.Line with BufferGeometry
          const points = [
            new THREE.Vector3(x, y, 0),
            new THREE.Vector3(innerX, innerY, 0)
          ];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: color, 
            opacity: 0.4, 
            transparent: true 
          });
          
          items.push(
            <primitive 
              key={`line-${ring}-${i}`} 
              object={new THREE.Line(lineGeometry, lineMaterial)} 
            />
          );
        }
      }
    }

    return items;
  }, [color, liftTheVeil]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={springRotation}
      scale={springScale}
      visible={isActive}
    >
      {circles}

      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </animated.group>
  );
};

export default FlowerOfLifeGeometry;
