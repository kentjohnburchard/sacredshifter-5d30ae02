import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { isPrime } from '@/lib/primeUtils';

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
  visualizerMode?: VisualizerMode;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
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

const FlowerOfLifeGeometry = ({ chakra = 'crown' }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });
  
  const circles = useMemo(() => {
    const items = [];
    const radius = 0.5;
    const numCircles = 19;
    
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = ring * radius * Math.sqrt(3);
      const numInRing = ring === 0 ? 1 : 6 * ring;
      
      for (let i = 0; i < numInRing; i++) {
        const angle = (i * 2 * Math.PI) / numInRing;
        const x = ringRadius * Math.cos(angle);
        const y = ringRadius * Math.sin(angle);
        
        items.push(
          <mesh key={`${ring}-${i}`} position={[x, y, 0]}>
            <circleGeometry args={[radius, 64]} />
            <meshBasicMaterial color={color} opacity={0.5} transparent wireframe />
          </mesh>
        );
      }
    }
    
    return items;
  }, [color]);
  
  return (
    <group ref={groupRef} scale={[2, 2, 2]}>
      {circles}
    </group>
  );
};

const MerkabaGeometry = ({ chakra = 'crown' }) => {
  const merkabaRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  
  useFrame((state) => {
    if (merkabaRef.current) {
      merkabaRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      merkabaRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <group ref={merkabaRef}>
      <mesh>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} wireframe />
      </mesh>
    </group>
  );
};

const TorusGeometry = ({ chakra = 'crown', frequencyData }) => {
  const torusRef = useRef<THREE.Mesh>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  
  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      
      if (frequencyData && frequencyData.length) {
        const avg = frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;
        const intensity = avg / 255;
        const scale = 1 + intensity * 0.2;
        torusRef.current.scale.set(scale, scale, scale);
        
        const material = torusRef.current.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity !== undefined) {
          material.emissiveIntensity = 0.2 + intensity;
        }
      }
    }
  });
  
  return (
    <mesh ref={torusRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
};

const PrimeFlowGeometry = ({ frequencyData, chakra = 'crown' }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const ringsRef = useRef<THREE.Group>(null!);
  const color = chakraColors[chakra] || '#a855f7';
  const rings = useRef<{ ring: THREE.Mesh; scale: number; opacity: number }[]>([]);
  const lastPrimeTime = useRef<number>(0);
  
  useEffect(() => {
    rings.current = [];
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
    
    if (frequencyData && frequencyData.length && time - lastPrimeTime.current > 0.5) {
      let maxIndex = 0;
      let maxValue = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > maxValue) {
          maxValue = frequencyData[i];
          maxIndex = i;
        }
      }
      
      if (isPrime(maxIndex + 20)) {
        lastPrimeTime.current = time;
        
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.2, 32),
          new THREE.MeshBasicMaterial({ 
            color, 
            transparent: true, 
            opacity: 0.8,
            side: THREE.DoubleSide
          })
        );
        
        if (ringsRef.current) {
          ringsRef.current.add(ring);
          rings.current.push({ ring, scale: 0.1, opacity: 0.8 });
        }
      }
    }
    
    const toRemove: number[] = [];
    rings.current.forEach((item, index) => {
      item.scale += 0.02;
      item.opacity -= 0.01;
      if (item.ring) {
        item.ring.scale.set(item.scale, item.scale, item.scale);
        (item.ring.material as THREE.MeshBasicMaterial).opacity = item.opacity;
      }
      
      if (item.opacity <= 0) {
        toRemove.push(index);
      }
    });
    
    toRemove.reverse().forEach(index => {
      if (rings.current[index].ring && ringsRef.current) {
        ringsRef.current.remove(rings.current[index].ring);
      }
      rings.current.splice(index, 1);
    });
  });
  
  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
      <group ref={ringsRef} />
    </group>
  );
};

const ChakraSpiralGeometry = ({ frequencyData }) => {
  const spiralRef = useRef<THREE.Group>(null!);
  const chakraPoints = useRef<THREE.Mesh[]>([]);
  const chakraKeys = Object.keys(chakraColors);
  
  useEffect(() => {
    chakraPoints.current = [];
  }, []);
  
  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
    
    if (frequencyData && frequencyData.length) {
      const chunkSize = Math.floor(frequencyData.length / 7);
      
      chakraPoints.current.forEach((point, i) => {
        if (point) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          const chunk = frequencyData.slice(start, end);
          const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
          const intensity = avg / 255;
          
          point.scale.set(1 + intensity * 0.5, 1 + intensity * 0.5, 1 + intensity * 0.5);
          
          const material = point.material as THREE.MeshStandardMaterial;
          if (material) {
            material.emissiveIntensity = 0.2 + intensity * 0.8;
          }
        }
      });
    }
  });
  
  const chakraPointsElements = useMemo(() => {
    const points = [];
    const numPoints = 7;
    const radiusStart = 0.5;
    const radiusEnd = 2;
    const heightStart = -1;
    const heightEnd = 1;
    
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
        <mesh 
          key={i} 
          position={[x, y, z]}
          ref={(mesh) => {
            if (mesh) chakraPoints.current[i] = mesh;
          }}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={chakraColor} 
            emissive={chakraColor} 
            emissiveIntensity={0.5} 
          />
        </mesh>
      );
    }
    
    return points;
  }, []);
  
  return (
    <group ref={spiralRef}>
      {chakraPointsElements}
      <mesh>
        <torusGeometry args={[1.25, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

const CustomPrimePulseGeometry = ({ frequencyData, chakra = 'crown' }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pulseRef = useRef<number>(0);
  const color = chakraColors[chakra] || '#a855f7';

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    pulseRef.current += 0.01;
    const scale = 1 + Math.sin(pulseRef.current * 2) * 0.2;
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;

    if (frequencyData && frequencyData.length) {
      const avg = frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;
      const intensity = avg / 255;
      
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = intensity * 2;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
};

const SacredGeometry = ({ frequencyData, chakra, visualizerMode = 'customPrimePulse' }: SacredVisualizerCanvasProps) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (camera) {
      switch (visualizerMode) {
        case 'flowerOfLife':
          camera.position.set(0, 0, 6);
          break;
        case 'merkaba':
          camera.position.set(0, 0, 5);
          break;
        case 'torus':
          camera.position.set(0, 0, 4);
          break;
        case 'chakraSpiral':
          camera.position.set(0, 0, 7);
          break;
        default:
          camera.position.set(0, 0, 5);
      }
    }
  }, [visualizerMode, camera]);
  
  switch (visualizerMode) {
    case 'flowerOfLife':
      return <FlowerOfLifeGeometry chakra={chakra} />;
    case 'merkaba':
      return <MerkabaGeometry chakra={chakra} />;
    case 'torus':
      return <TorusGeometry chakra={chakra} frequencyData={frequencyData} />;
    case 'primeFlow':
      return <PrimeFlowGeometry frequencyData={frequencyData} chakra={chakra} />;
    case 'chakraSpiral':
      return <ChakraSpiralGeometry frequencyData={frequencyData} />;
    case 'customPrimePulse':
    default:
      return <CustomPrimePulseGeometry frequencyData={frequencyData} chakra={chakra} />;
  }
};

const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'customPrimePulse',
  enableControls = true,
  enablePostProcessing = false,
}) => {
  const shouldRender = typeof visualizerMode === 'string';
  const chakraColor = chakraColors[chakra] || '#a855f7';

  if (!shouldRender) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <p className="text-white/50">Visualizer unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera position={[0, 0, 5]} fov={75} makeDefault />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color={chakraColors[chakra] || '#a855f7'} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#ffffff" intensity={0.5} />
        
        <SacredGeometry
          frequencyData={frequencyData}
          chakra={chakra}
          visualizerMode={visualizerMode}
        />
        
        {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
        
        <fog attach="fog" color={chakraColors[chakra] || '#a855f7'} near={8} far={20} />
      </Canvas>
    </div>
  );
};

export default SacredVisualizerCanvas;
