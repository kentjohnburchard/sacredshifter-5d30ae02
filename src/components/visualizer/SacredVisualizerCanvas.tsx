import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Trail, Stars } from '@react-three/drei';
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

const FlowerOfLifeGeometry = ({
  chakra = 'crown',
  intensity = 0,
  frequencyData
}: {
  chakra?: string;
  intensity?: number;
  frequencyData?: Uint8Array
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();

  const { rotation, scale } = useSpring({
    rotation: [0, intensity * Math.PI * 0.5, 0] as any,
    scale: 1 + intensity * 0.2,
    config: { tension: 120, friction: 14 }
  });

  useFrame((state) => {
    if (groupRef.current) {
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

  const circles = useMemo(() => {
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
          
          items.push(
            <primitive 
              key={`line-${ring}-${i}`} 
              object={new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(x, y, 0),
                  new THREE.Vector3(innerX, innerY, 0)
                ]),
                new THREE.LineBasicMaterial({ color: color, opacity: 0.4, transparent: true })
              )} 
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
      rotation={rotation}
      scale={scale}
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

const MerkabaGeometry = ({ chakra = 'crown', intensity = 0, frequencyData }: { chakra?: string; intensity?: number; frequencyData?: Uint8Array }) => {
  const merkabaRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();
  
  const emissiveIntensity = liftTheVeil ? 2.0 : 1.5;
  
  useFrame((state) => {
    if (merkabaRef.current) {
      merkabaRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      merkabaRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      
      if (innerRef.current) {
        innerRef.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
        innerRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.2;
      }
      
      if (frequencyData && frequencyData.length > 0) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avgFreq = freqArray.reduce((sum, val) => sum + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        const scale = 1 + normalizedFreq * 0.3;
        
        merkabaRef.current.scale.set(scale, scale, scale);
      }
    }
  });
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  }, []);
  
  return (
    <group ref={merkabaRef}>
      <mesh>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
          wireframe 
        />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI]}>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity * 0.8} 
          wireframe 
        />
      </mesh>
      
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
        
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlePositions.length / 3}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.05} 
            color={liftTheVeil ? '#ff69b4' : '#9370db'} 
            sizeAttenuation 
            transparent 
            opacity={0.8} 
          />
        </points>
      </group>
      
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

const TorusGeometry = ({ chakra = 'crown', frequencyData, intensity = 0 }: { chakra?: string; frequencyData?: Uint8Array; intensity?: number }) => {
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const color = chakraColors[chakra] || '#a855f7';
  const { liftTheVeil } = useTheme();
  
  const { scale, rotation } = useSpring({
    scale: [1 + intensity * 0.3, 1 + intensity * 0.3, 1 + intensity * 0.3] as any,
    rotation: [intensity * Math.PI * 0.2, intensity * Math.PI * 0.2, 0] as any,
    config: { tension: 100, friction: 10 }
  });
  
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r1 = 1;
      const r2 = 0.3;
      
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
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      
      if (frequencyData && frequencyData.length) {
        const freqArray = Array.from(frequencyData).map(Number);
        const avg = freqArray.reduce((acc, val) => acc + val, 0) / freqArray.length;
        const intensity = avg / 255;
        
        const material = torusRef.current.material as THREE.MeshStandardMaterial;
        if (material && material.emissiveIntensity !== undefined) {
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
      <animated.mesh ref={torusRef} rotation={rotation} scale={scale}>
        <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} 
          metalness={0.7}
          roughness={0.2}
        />
      </animated.mesh>
      
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

const PrimeFlowGeometry = ({ frequencyData, chakra = 'crown', intensity = 0 }: { frequencyData?: Uint8Array; chakra?: string; intensity?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const color = chakraColors[chakra] || '#a855f7';
  const [rings, setRings] = useState<{ ring: THREE.Mesh; scale: number; opacity: number }[]>([]);
  const lastPrimeTime = useRef<number>(0);
  const lastActivePrime = useRef<number | null>(null);
  const ringGroupRef = useRef<THREE.Group>(new THREE.Group());
  const { liftTheVeil } = useTheme();
  
  const { rotation } = useSpring({
    rotation: [intensity * Math.PI * 0.1, intensity * Math.PI * 0.2, 0] as any,
    config: { tension: 80, friction: 10 }
  });
  
  useEffect(() => {
    rings.forEach(item => {
      if (item.ring) {
        if (item.ring.geometry) item.ring.geometry.dispose();
        if (item.ring.material) {
          if (Array.isArray(item.ring.material)) {
            item.ring.material.forEach(m => m.dispose());
          } else {
            item.ring.material.dispose();
          }
        }
      }
    });
    setRings([]);
    
    if (ringsRef.current && ringGroupRef.current) {
      ringsRef.current.add(ringGroupRef.current);
    }
    
    return () => {
      if (ringsRef.current && ringGroupRef.current) {
        ringsRef.current.remove(ringGroupRef.current);
      }
      
      rings.forEach(item => {
        if (item.ring) {
          if (item.ring.geometry) item.ring.geometry.dispose();
          if (item.ring.material) {
            if (Array.isArray(item.ring.material)) {
              item.ring.material.forEach(m => m.dispose());
            } else {
              item.ring.material.dispose();
            }
          }
        }
      });
    };
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2; 
    }
    
    if (frequencyData && frequencyData.length && time - lastPrimeTime.current > 0.3) {
      let maxIndex = 0;
      let maxValue = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > maxValue) {
          maxValue = frequencyData[i];
          maxIndex = i;
        }
      }
      
      if (isPrime(maxIndex + 20) && maxValue > 50) {
        lastPrimeTime.current = time;
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.5;
        
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
        
        if (ringGroupRef.current) {
          ringGroupRef.current.add(ring);
          setRings(prev => [...prev, { ring, scale: 0.1, opacity: 0.8 }]);
        }
      }
    }
    
    if (rings.length > 0) {
      setRings(prev => {
        const updatedRings = prev.map(item => {
          return {
            ...item,
            scale: item.scale + 0.03,
            opacity: item.opacity - 0.012
          };
        });
        
        updatedRings.forEach(item => {
          if (item.ring) {
            item.ring.scale.set(item.scale, item.scale, item.scale);
            const material = item.ring.material as THREE.MeshBasicMaterial;
            if (material && material.opacity !== undefined) {
              material.opacity = item.opacity;
            }
          }
        });
        
        const visibleRings = updatedRings.filter(item => {
          if (item.opacity <= 0 && item.ring && ringGroupRef.current) {
            ringGroupRef.current.remove(item.ring);
            if (item.ring.geometry) item.ring.geometry.dispose();
            if (item.ring.material) {
              if (Array.isArray(item.ring.material)) {
                item.ring.material.forEach(m => m.dispose());
              } else {
                item.ring.material.dispose();
              }
            }
            return false;
          }
          return true;
        });
        
        return visibleRings;
      });
    }
  });
  
  return (
    <animated.group ref={groupRef} rotation={rotation}>
      <mesh>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial 
          color={liftTheVeil ? '#ff1493' : color} 
          emissive={liftTheVeil ? '#ff1493' : color} 
          emissiveIntensity={1.5}
          wireframe 
        />
      </mesh>
      
      <group ref={ringsRef} />
      
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

const ChakraSpiralGeometry = ({ frequencyData, intensity = 0 }: { frequencyData?: Uint8Array; intensity?: number }) => {
  const spiralRef = useRef<THREE.Group>(null);
  const [chakraPoints, setChakraPoints] = useState<THREE.Mesh[]>([]);
  const chakraKeys = Object.keys(chakraColors);
  
  const { rotation, scale } = useSpring({
    rotation: [0, intensity * Math.PI * 0.3, 0] as any,
    scale: [1 + intensity * 0.2, 1 + intensity * 0.2, 1 + intensity * 0.2] as any,
    config: { tension: 100, friction: 12 }
  });
  
  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      spiralRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
    
    if (frequencyData && frequencyData.length > 0 && chakraPoints.length > 0) {
      const chunkSize = Math.floor(frequencyData.length / 7);
      
      chakraPoints.forEach((point, i) => {
        if (point) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          if (start < frequencyData.length) {
            try {
              const chunk = Array.from(
                frequencyData.slice(start, Math.min(end, frequencyData.length))
              ).map(Number);
              
              if (chunk.length > 0) {
                const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
                const intensity = avg / 255;
                
                point.scale.set(1 + intensity * 0.8, 1 + intensity * 0.8, 1 + intensity * 0.8);
                
                if (point.material) {
                  const material = point.material as THREE.MeshStandardMaterial;
                  if (material && material.emissiveIntensity !== undefined) {
                    material.emissiveIntensity = 0.5 + intensity * 2.5;
                  }
                }
              }
            } catch (e) {
              console.error("Error processing frequency data:", e);
            }
          }
        }
      });
    }
  });
  
  const chakraPointsElements = useMemo(() => {
    const points = [];
    const numPoints = Math.min(7, chakraKeys.length);
    const radiusStart = 0.5;
    const radiusEnd = 2;
    const heightStart = -1.2;
    const heightEnd = 1.2;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / Math.max(1, (numPoints - 1));
      const radius = radiusStart + (radiusEnd - radiusStart) * t;
      const theta = t * Math.PI * 4;
      const height = heightStart + (heightEnd - heightStart) * t;
      const chakraColor = chakraColors[chakraKeys[i]] || '#ffffff';
      
      const x = radius * Math.cos(theta);
      const y = height;
      const z = radius * Math.sin(theta);
      
      points.push(
        <group key={i} position={[x, y, z]}>
          <mesh 
            ref={(mesh) => {
              if (mesh) {
                setChakraPoints(prev => {
                  const newPoints = [...prev];
                  newPoints[i] = mesh;
                  return newPoints;
                });
              }
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
  }, [chakraKeys]);
  
  return (
    <animated.group 
      ref={spiralRef}
      rotation={rotation}
      scale={scale}
    >
      {chakraPointsElements}
      
      <mesh>
        <torusGeometry args={[1.25, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
      
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </mesh>
      
      <Stars radius={10} depth={20} count={500} factor={2} fade speed={1} />
    </animated.group>
  );
};

const SacredGeometry = ({ frequencyData, chakra, visualizerMode = 'customPrimePulse', intensity = 0 }: SacredVisualizerCanvasProps) => {
  const { camera } = useThree();
  const { liftTheVeil } = useTheme();
  
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
  
  const fogColor = liftTheVeil ? '#330033' : '#110022';
  const ambientColor = liftTheVeil ? '#ff69b4' : chakraColor;
  const pointLightColor = liftTheVeil ? '#ff1493' : chakraColor;
  
  return (
    <div className="w-full h-full">
      <Canvas frameloop="demand">
        <PerspectiveCamera position={[0, 0, 5]} fov={70} makeDefault />
        <ambientLight intensity={0.5} color={ambientColor} />
        <pointLight position={[10, 10, 10]} intensity={1} color={pointLightColor} />
        <fog attach="fog" args={[fogColor, 1, 20]} />
        
        <SacredGeometry 
          frequencyData={frequencyData}
          chakra={chakra}
          visualizerMode={visualizerMode}
          intensity={intensity}
        />
        
        {enableControls && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true} 
          />
        )}
      </Canvas>
    </div>
  );
};

export default SacredVisualizerCanvas;
