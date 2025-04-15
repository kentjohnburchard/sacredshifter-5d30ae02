
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { SacredGeometryProps } from './types';
import { useTheme } from '@/context/ThemeContext';

const SriYantraGeometry: React.FC<SacredGeometryProps> = ({
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
    scale: scale * (1 + intensity * 0.15),
    config: { tension: 100, friction: 12 }
  });

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.002;
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * normalizedFreq * 0.2;
      }
    }
  });

  // Create the Sri Yantra triangles
  const sriYantraElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const outerRadius = 1;
    const emissiveIntensity = liftTheVeil ? 1.5 : 1.0;
    
    // Create upward-pointing triangles
    for (let i = 0; i < 4; i++) {
      const scale = 1 - (i * 0.15);
      
      const trianglePoints = [
        new THREE.Vector2(0, outerRadius * scale),
        new THREE.Vector2(-outerRadius * scale * 0.866, -outerRadius * scale * 0.5),
        new THREE.Vector2(outerRadius * scale * 0.866, -outerRadius * scale * 0.5),
      ];
      
      const triangleShape = new THREE.Shape(trianglePoints);
      const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
      
      // Create edges correctly with React Three Fiber
      const edges = new THREE.EdgesGeometry(triangleGeometry);
      const positions = edges.attributes.position.array;
      
      elements.push(
        <line key={`upward-triangle-${i}`}>
          <bufferGeometry>
            <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            transparent={true}
            opacity={0.6}
          />
        </line>
      );
    }
    
    // Create downward-pointing triangles
    for (let i = 0; i < 5; i++) {
      const scale = 0.95 - (i * 0.15);
      
      const trianglePoints = [
        new THREE.Vector2(0, -outerRadius * scale),
        new THREE.Vector2(-outerRadius * scale * 0.866, outerRadius * scale * 0.5),
        new THREE.Vector2(outerRadius * scale * 0.866, outerRadius * scale * 0.5),
      ];
      
      const triangleShape = new THREE.Shape(trianglePoints);
      const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
      
      // Create edges correctly with React Three Fiber
      const edges = new THREE.EdgesGeometry(triangleGeometry);
      const positions = edges.attributes.position.array;
      
      elements.push(
        <line key={`downward-triangle-${i}`}>
          <bufferGeometry>
            <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            transparent={true}
            opacity={0.6}
          />
        </line>
      );
    }
    
    // Create outer circle
    const circleGeometry = new THREE.CircleGeometry(outerRadius, 64);
    const circleEdges = new THREE.EdgesGeometry(circleGeometry);
    const circlePositions = circleEdges.attributes.position.array;
    
    elements.push(
      <line key="outer-circle">
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[circlePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent={true}
          opacity={0.4}
        />
      </line>
    );
    
    // Add central dot (bindu)
    elements.push(
      <mesh key="bindu" position={[0, 0, 0.1]}>
        <circleGeometry args={[0.05, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 2}
          transparent
          opacity={0.8}
        />
      </mesh>
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
      {sriYantraElements}
    </animated.group>
  );
};

export default SriYantraGeometry;
