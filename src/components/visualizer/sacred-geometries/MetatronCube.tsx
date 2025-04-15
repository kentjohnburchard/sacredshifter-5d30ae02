
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const MetatronCubeGeometry: React.FC<SacredGeometryProps> = ({
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
    rotation: [rotation[0] + intensity * Math.PI * 0.1, rotation[1] + intensity * Math.PI * 0.2, rotation[2]] as any,
    scale: scale * (1 + intensity * 0.2),
    config: { tension: 80, friction: 15 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.003;
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * normalizedFreq * 0.3;
      }
    }
  });

  // Create 13 vertices for Metatron's Cube
  const vertices = useMemo(() => {
    // Define the positions of the vertices
    const positions = [
      [0, 0, 0], // Center
      [1, 0, 0], [-1, 0, 0], 
      [0.5, 0.866, 0], [-0.5, 0.866, 0], 
      [0.5, -0.866, 0], [-0.5, -0.866, 0],
      [0, 0, 1], [0, 0, -1],
      [0.5, 0.289, 0.816], [-0.5, 0.289, 0.816],
      [0.5, -0.289, 0.816], [-0.5, -0.289, 0.816]
    ];
    
    return positions.map(pos => new THREE.Vector3(pos[0], pos[1], pos[2]));
  }, []);

  // Create the geometry components
  const geometryComponents = useMemo(() => {
    const components: JSX.Element[] = [];
    const emissiveIntensity = liftTheVeil ? 1.2 : 0.8;
    
    // Add vertices (points)
    vertices.forEach((vertex, i) => {
      components.push(
        <mesh key={`vertex-${i}`} position={[vertex.x, vertex.y, vertex.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      );
    });
    
    // Connect all vertices with lines
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const points = [vertices[i], vertices[j]];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4
        });
        
        components.push(
          <primitive
            key={`line-${i}-${j}`}
            object={new THREE.Line(lineGeometry, lineMaterial)}
          />
        );
      }
    }
    
    return components;
  }, [vertices, color, liftTheVeil]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={springRotation}
      scale={springScale}
      visible={isActive}
    >
      {geometryComponents}
    </animated.group>
  );
};

export default MetatronCubeGeometry;
