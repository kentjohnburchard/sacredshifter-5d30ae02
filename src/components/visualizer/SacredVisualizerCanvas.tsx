
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, PointMaterial, Points, Trail, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { isPrime } from '@/lib/primeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useSpring, animated } from '@react-spring/three';

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
  visualizerMode?: VisualizerMode;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
  intensity?: number;
};

const chakraColors: Record<string, string> = {
  root: '#ef4444',
  sacral: '#f97316',
  'solar plexus': '#facc15',
  heart: '#22c55e',
  throat: '#3b82f6',
  'third eye': '#6366f1',
  crown: '#a855f7'
};

// Enhanced Flower of Life with more complex geometry and animation
const FlowerOfLifeGeometry = ({ chakra = 'crown', intensity = 0, frequencyData }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();
  
  // Create animated props based on the audio intensity
  const { rotation, scale } = useSpring({
    rotation: [0, intensity * Math.PI * 0.5, 0],
    scale: 1 + intensity * 0.2,
    config: { tension: 120, friction: 14 }
  });
  
  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      
      // Add some wave motion based on elapsed time
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      
      // If we have frequency data, modify rotation speed based on audio
      if (frequencyData && frequencyData.length > 0) {
        const avgFreq = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
        const normalizedFreq = avgFreq / 255;
        
        groupRef.current.rotation.y += normalizedFreq * 0.01;
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * normalizedFreq * 0.2;
      }
    }
  });
  
  const circles = useMemo(() => {
    const items = [];
    const radius = 0.5;
    const numCircles = 19;
    const emissiveIntensity = liftTheVeil ? 1.2 : 0.8;
    
    // Create more complex Flower of Life pattern with multiple rings
    for (let ring = 0; ring < 4; ring++) {
      const ringRadius = ring * radius * Math.sqrt(3);
      const numInRing = ring === 0 ? 1 : 6 * ring;
      
      for (let i = 0; i < numInRing; i++) {
        const angle = (i * 2 * Math.PI) / numInRing;
        const x = ringRadius * Math.cos(angle);
        const y = ringRadius * Math.sin(angle);
        
        // Make some circles into spheres for 3D effect
        if (ring % 2 === 0 || i % 3 === 0) {
          items.push(
            <mesh key={`circle-${ring}-${i}`} position={[x, y, 0]}>
              <circleGeometry args={[radius, 64]} />
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
              <sphereGeometry args={[radius * 0.3, 16, 16]} />
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
        
        // Add connecting lines for more intricate pattern
        if (ring > 0 && i % 2 === 0) {
          const innerAngle = ((i / numInRing) * 2 * Math.PI);
          const innerRingRadius = (ring - 1) * radius * Math.sqrt(3);
          const innerX = innerRingRadius * Math.cos(innerAngle);
          const innerY = innerRingRadius * Math.sin(innerAngle);
          
          items.push(
            <line key={`line-${ring}-${i}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([x, y, 0, innerX, innerY, 0])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={color} opacity={0.4} transparent />
            </line>
          );
        }
      }
    }
    
    return items;
  }, [color, liftTheVeil]);
  
  return (
    <animated.group 
      ref={groupRef} 
      rotation={rotation as any}
      scale={scale}
    >
      {circles}
      
      {/* Add a central sphere with glow */}
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
      
      {/* Outer ring */}
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

// Enhanced Merkaba with more detail and animation
const MerkabaGeometry = ({ chakra = 'crown', intensity = 0, frequencyData }) => {
  const merkabaRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();
  
  const emissiveIntensity = liftTheVeil ? 2.0 : 1.5;
  
  useFrame((state) => {
    if (merkabaRef.current) {
      // Base rotation
      merkabaRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      merkabaRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      
      if (innerRef.current) {
        // Counter-rotate inner shape
        innerRef.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
        innerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.2;
      }
      
      // If we have frequency data, add audio reactivity
      if (frequencyData && frequencyData.length > 0) {
        const avgFreq = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
        const normalizedFreq = avgFreq / 255;
        const scale = 1 + normalizedFreq * 0.3;
        
        merkabaRef.current.scale.set(scale, scale, scale);
      }
    }
  });
  
  return (
    <group ref={merkabaRef}>
      {/* Upper tetrahedron */}
      <mesh>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
          wireframe 
        />
      </mesh>
      
      {/* Lower tetrahedron */}
      <mesh rotation={[0, 0, Math.PI]}>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity * 0.8} 
          wireframe 
        />
      </mesh>
      
      {/* Inner rotating group with additional geometry */}
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
        
        {/* Particles inside */}
        <Points count={50} positions={Array.from({ length: 150 }).map(() => (Math.random() - 0.5) * 2)}>
          <PointMaterial 
            size={0.05} 
            color={liftTheVeil ? '#ff69b4' : '#9370db'} 
            sizeAttenuation 
            transparent 
            opacity={0.8} 
          />
        </Points>
      </group>
      
      {/* Outer shell */}
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

// Enhanced Torus with more detail and animation
const TorusGeometry = ({ chakra = 'crown', frequencyData, intensity = 0 }) => {
  const torusRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();
  
  // Create animated props for the torus
  const { scale, rotation } = useSpring({
    scale: [1 + intensity * 0.3, 1 + intensity * 0.3, 1 + intensity * 0.3],
    rotation: [intensity * Math.PI * 0.2, intensity * Math.PI * 0.2, 0],
    config: { tension: 100, friction: 10 }
  });
  
  // Create particles that flow around the torus
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r1 = 1; // major radius
      const r2 = 0.3; // minor radius
      
      const x = (r1 + r2 * Math.cos(theta)) * Math.cos(phi);
      const y = (r1 + r2 * Math.cos(theta)) * Math.sin(phi);
      const z = r2 * Math.sin(theta);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    return positions;
  }, []);
  
  useFrame((state) => {
    if (torusRef.current) {
      // Base rotation
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      
      // If we have frequency data, add audio reactivity
      if (frequencyData && frequencyData.length) {
        const avg = Array.from(frequencyData).reduce((acc, val) => acc + val, 0) / frequencyData.length;
        const intensity = avg / 255;
        
        // Modify material properties based on audio
        const material = torusRef.current.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity !== undefined) {
          material.emissiveIntensity = 0.5 + intensity * 2;
        }
      }
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      particlesRef.current.rotation.z = state.clock.getElapsedTime() * -0.2;
    }
  });
  
  return (
    <group>
      <animated.mesh ref={torusRef} rotation={rotation as any} scale={scale as any}>
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} 
          metalness={0.7}
          roughness={0.2}
        />
      </animated.mesh>
      
      {/* Particle system flowing around torus */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.02} 
          color={liftTheVeil ? '#ff69b4' : '#9370db'} 
          transparent 
          opacity={0.6} 
        />
      </points>
      
      {/* Add trails for extra effect */}
      <Trail
        width={0.05}
        length={5}
        color={liftTheVeil ? '#ff1493' : color}
        attenuation={(t) => t * t}
      >
        <mesh position={[1.3, 0, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={liftTheVeil ? '#ff1493' : color} />
        </mesh>
      </Trail>
    </group>
  );
};

// Enhanced PrimeFlow with more detail and animation
const PrimeFlowGeometry = ({ frequencyData, chakra = 'crown', intensity = 0 }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const ringsRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  const rings = useRef<{ ring: THREE.Mesh; scale: number; opacity: number }[]>([]);
  const lastPrimeTime = useRef<number>(0);
  const { liftTheVeil } = useTheme();
  
  // Create animated props for the group
  const { rotation } = useSpring({
    rotation: [intensity * Math.PI * 0.1, intensity * Math.PI * 0.2, 0],
    config: { tension: 80, friction: 10 }
  });
  
  useEffect(() => {
    rings.current = [];
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2; 
    }
    
    // Generate prime rings based on frequency data
    if (frequencyData && frequencyData.length && time - lastPrimeTime.current > 0.3) {
      let maxIndex = 0;
      let maxValue = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > maxValue) {
          maxValue = frequencyData[i];
          maxIndex = i;
        }
      }
      
      // Only create new rings for prime numbers and when audio is present
      if (isPrime(maxIndex + 20) && maxValue > 50) {
        lastPrimeTime.current = time;
        
        // Calculate ring position with some randomization
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.5;
        
        // Create a new ring with material based on consciousness mode
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: liftTheVeil ? '#ff1493' : color, 
          transparent: true, 
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.2, 32),
          ringMaterial
        );
        
        ring.position.set(x, y, z);
        ring.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        if (ringsRef.current) {
          ringsRef.current.add(ring);
          rings.current.push({ ring, scale: 0.1, opacity: 0.8 });
        }
      }
    }
    
    // Animate existing rings
    const toRemove: number[] = [];
    rings.current.forEach((item, index) => {
      item.scale += 0.03;
      item.opacity -= 0.012;
      if (item.ring) {
        item.ring.scale.set(item.scale, item.scale, item.scale);
        (item.ring.material as THREE.MeshBasicMaterial).opacity = item.opacity;
      }
      
      if (item.opacity <= 0) {
        toRemove.push(index);
      }
    });
    
    // Remove faded rings
    toRemove.reverse().forEach(index => {
      if (rings.current[index].ring && ringsRef.current) {
        ringsRef.current.remove(rings.current[index].ring);
      }
      rings.current.splice(index, 1);
    });
  });
  
  return (
    <animated.group ref={groupRef} rotation={rotation as any}>
      {/* Central geometry */}
      <mesh>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial 
          color={liftTheVeil ? '#ff1493' : color} 
          emissive={liftTheVeil ? '#ff1493' : color} 
          emissiveIntensity={1.5}
          wireframe 
        />
      </mesh>
      
      {/* Container for dynamic rings */}
      <group ref={ringsRef} />
      
      {/* Add orbiting particles */}
      <group>
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 1.2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <Trail
              key={i}
              width={0.02}
              length={10}
              color={liftTheVeil ? '#ff69b4' : color}
              attenuation={(t) => t * t}
            >
              <mesh position={[x, y, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color={liftTheVeil ? '#ff69b4' : color} />
              </mesh>
            </Trail>
          );
        })}
      </group>
    </animated.group>
  );
};

// Enhanced ChakraSpiral with more detail and animation
const ChakraSpiralGeometry = ({ frequencyData, intensity = 0 }) => {
  const spiralRef = useRef<THREE.Group>(null!);
  const chakraPoints = useRef<THREE.Mesh[]>([]);
  const chakraKeys = Object.keys(chakraColors);
  
  // Create animated props for the spiral
  const { rotation, scale } = useSpring({
    rotation: [0, intensity * Math.PI * 0.3, 0],
    scale: [1 + intensity * 0.2, 1 + intensity * 0.2, 1 + intensity * 0.2],
    config: { tension: 100, friction: 12 }
  });
  
  useEffect(() => {
    chakraPoints.current = [];
  }, []);
  
  useFrame((state) => {
    if (spiralRef.current) {
      // Base rotation
      spiralRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      spiralRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
    
    // Update chakra points based on audio frequency
    if (frequencyData && frequencyData.length) {
      const chunkSize = Math.floor(frequencyData.length / 7);
      
      chakraPoints.current.forEach((point, i) => {
        if (point) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          const chunk = frequencyData.slice(start, end);
          const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
          const intensity = avg / 255;
          
          // Scale based on frequency intensity
          point.scale.set(1 + intensity * 0.8, 1 + intensity * 0.8, 1 + intensity * 0.8);
          
          // Update emission intensity
          const material = point.material as THREE.MeshStandardMaterial;
          if (material) {
            material.emissiveIntensity = 0.5 + intensity * 2.5;
          }
        }
      });
    }
  });
  
  // Generate chakra points in a spiral pattern
  const chakraPointsElements = useMemo(() => {
    const points = [];
    const numPoints = 7;
    const radiusStart = 0.5;
    const radiusEnd = 2;
    const heightStart = -1.2;
    const heightEnd = 1.2;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const radius = radiusStart + (radiusEnd - radiusStart) * t;
      const theta = t * Math.PI * 4;
      const height = heightStart + (heightEnd - heightStart) * t;
      const chakraColor = chakraColors[chakraKeys[i]] || '#ffffff';
      
      const x = radius * Math.cos(theta);
      const y = height;
      const z = radius * Math.sin(theta);
      
      points.push(
        <group key={i} position={[x, y, z]}>
          {/* Main chakra sphere */}
          <mesh 
            ref={(mesh) => {
              if (mesh) chakraPoints.current[i] = mesh;
            }}
          >
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={chakraColor} 
              emissive={chakraColor} 
              emissiveIntensity={1.5} 
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          
          {/* Add orbiting particles */}
          <Trail
            width={0.03}
            length={10}
            color={chakraColor}
            attenuation={(t) => t * t}
          >
            <mesh position={[0.3, 0, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color={chakraColor} />
            </mesh>
          </Trail>
        </group>
      );
    }
    
    return points;
  }, []);
  
  return (
    <animated.group 
      ref={spiralRef}
      rotation={rotation as any}
      scale={scale as any}
    >
      {chakraPointsElements}
      
      {/* Central spiral path */}
      <mesh>
        <torusGeometry args={[1.25, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
      
      {/* Secondary spiral */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </mesh>
      
      {/* Background stars */}
      <Stars radius={10} depth={20} count={500} factor={2} fade speed={1} />
    </animated.group>
  );
};

const SacredGeometry = ({ frequencyData, chakra, visualizerMode = 'customPrimePulse', intensity = 0 }: SacredVisualizerCanvasProps) => {
  const { camera } = useThree();
  const { liftTheVeil } = useTheme();
  
  // Set camera position based on visualization mode
  useEffect(() => {
    if (camera) {
      switch (visualizerMode) {
        case 'flowerOfLife':
          camera.position.set(0, 0, 5);
          break;
        case 'merkaba':
          camera.position.set(0, 0, 4.5);
          break;
        case 'torus':
          camera.position.set(0, 0, 3.5);
          break;
        case 'chakraSpiral':
          camera.position.set(0, 0, 6);
          break;
        case 'primeFlow':
          camera.position.set(0, 0, 4);
          break;
        default:
          camera.position.set(0, 0, 5);
      }
    }
  }, [visualizerMode, camera]);
  
  switch (visualizerMode) {
    case 'flowerOfLife':
      return <FlowerOfLifeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
    case 'merkaba':
      return <MerkabaGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
    case 'torus':
      return <TorusGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
    case 'primeFlow':
      return <PrimeFlowGeometry frequencyData={frequencyData} chakra={chakra} intensity={intensity} />;
    case 'chakraSpiral':
      return <ChakraSpiralGeometry frequencyData={frequencyData} intensity={intensity} />;
    default:
      return <FlowerOfLifeGeometry chakra={chakra} frequencyData={frequencyData} intensity={intensity} />;
  }
};

const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'flowerOfLife',
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
}) => {
  const shouldRender = typeof visualizerMode === 'string';
  const chakraColor = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();

  if (!shouldRender) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <p className="text-white/50">Visualizer unavailable</p>
      </div>
    );
  }
  
  // Determine fog and ambient colors based on consciousness mode
  const fogColor = liftTheVeil ? '#330033' : '#110022';
  const ambientColor = liftTheVeil ? '#ff69b4' : chakraColor;
  const pointLightColor = liftTheVeil ? '#ff1493' : chakraColor;
  
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera position={[0, 0, 5]} fov={70} makeDefault />
        <ambientLight intensity={0.8} color={ambientColor} />
        <pointLight position={[10, 10, 10]} color={pointLightColor} intensity={2.5} />
        <pointLight position={[-10, -10, -10]} color="#ffffff" intensity={0.8} />
        
        <SacredGeometry
          frequencyData={frequencyData}
          chakra={chakra}
          visualizerMode={visualizerMode}
          intensity={intensity}
        />
        
        {enableControls && <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />}
        
        <fog attach="fog" color={fogColor} near={8} far={20} />
        
        {/* Background stars for cosmic effect */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default SacredVisualizerCanvas;
