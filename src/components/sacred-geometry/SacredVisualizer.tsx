
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import { Vector3, MeshStandardMaterial, Mesh, Group } from 'three';
import * as THREE from 'three';

// Define the shape types
type GeometryShape = 
  'flower-of-life' | 
  'seed-of-life' | 
  'metatrons-cube' | 
  'merkaba' | 
  'torus' | 
  'tree-of-life' | 
  'sri-yantra' | 
  'vesica-piscis' | 
  'sphere';

// Props interface for the component
interface SacredVisualizerProps {
  shape: GeometryShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  liftedVeil?: boolean;
  colorScheme?: string;
}

// Helper function to get a color based on chakra or colorScheme
const getBaseColor = (chakra?: string, colorScheme?: string, liftedVeil?: boolean): string => {
  if (liftedVeil) return '#ff69b4';
  
  if (chakra) {
    switch (chakra.toLowerCase()) {
      case 'root': return '#ff0000';
      case 'sacral': return '#ff8000';
      case 'solar plexus': return '#ffff00';
      case 'heart': return '#00ff00';
      case 'throat': return '#00ffff';
      case 'third eye': return '#0000ff';
      case 'crown': return '#8a2be2';
      default: return '#9370db';
    }
  }
  
  switch (colorScheme) {
    case 'blue': return '#1e90ff';
    case 'gold': return '#ffd700';
    default: return '#9370db'; // Purple default
  }
};

// Helper function to get accent color
const getAccentColor = (chakra?: string, colorScheme?: string, liftedVeil?: boolean): string => {
  if (liftedVeil) return '#ff1493';
  
  if (chakra) {
    switch (chakra.toLowerCase()) {
      case 'root': return '#ff3333';
      case 'sacral': return '#ffa500';
      case 'solar plexus': return '#ffff66';
      case 'heart': return '#33ff33';
      case 'throat': return '#33ffff';
      case 'third eye': return '#3333ff';
      case 'crown': return '#9932cc';
      default: return '#b19cd9';
    }
  }
  
  switch (colorScheme) {
    case 'blue': return '#00bfff';
    case 'gold': return '#ffdf00';
    default: return '#b19cd9';
  }
};

// Component to render the sacred geometry shape
const GeometryShape: React.FC<{
  shape: GeometryShape;
  audioData?: Uint8Array;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  baseColor: string;
  accentColor: string;
}> = ({ shape, audioData, frequency, mode = 'fractal', baseColor, accentColor }) => {
  const groupRef = useRef<Group>(null);
  const shapeRef = useRef<Group>(null);
  const particlesRef = useRef<THREE.Mesh[]>([]);
  const frameCount = useRef(0);
  
  const { camera } = useThree();
  
  // Set up camera position
  useEffect(() => {
    camera.position.z = 8;
  }, [camera]);

  // Animation frame loop
  useFrame((state, delta) => {
    frameCount.current += 1;
    
    if (groupRef.current) {
      // Base rotation for all shapes
      groupRef.current.rotation.y += delta * 0.2;
      
      // Calculate audio reactivity factors
      let bassEnergy = 0;
      let midEnergy = 0;
      let highEnergy = 0;
      
      if (audioData && audioData.length > 0) {
        // Process audio data into frequency bands
        const bassRange = Math.min(10, Math.floor(audioData.length / 5));
        const midRange = Math.min(20, Math.floor(audioData.length / 2));
        
        for (let i = 0; i < audioData.length; i++) {
          const normalized = audioData[i] / 255;
          
          if (i < bassRange) {
            bassEnergy += normalized;
          } else if (i < midRange) {
            midEnergy += normalized;
          } else {
            highEnergy += normalized;
          }
        }
        
        // Normalize the energy values
        bassEnergy = bassEnergy / bassRange;
        midEnergy = midEnergy / (midRange - bassRange);
        highEnergy = highEnergy / (audioData.length - midRange);
        
        // Apply audio reactivity
        if (shapeRef.current) {
          // Pulse with bass
          shapeRef.current.scale.x = 1 + bassEnergy * 0.3;
          shapeRef.current.scale.y = 1 + bassEnergy * 0.3;
          shapeRef.current.scale.z = 1 + bassEnergy * 0.3;
          
          // Additional rotations based on audio
          shapeRef.current.rotation.x += delta * midEnergy * 0.5;
          shapeRef.current.rotation.z += delta * highEnergy * 0.3;
        }
      } else {
        // Default animation when no audio data
        if (shapeRef.current) {
          const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
          shapeRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
          
          // Gentle rotation
          shapeRef.current.rotation.x += delta * 0.1;
          shapeRef.current.rotation.z += delta * 0.05;
        }
      }
      
      // Animate particles based on mode
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach((particle, i) => {
          if (particle && particle.position) {
            const time = state.clock.elapsedTime;
            const index = i / particlesRef.current.length;
            
            switch (mode) {
              case 'spiral':
                // Spiral motion
                const angle = time * 0.5 + index * Math.PI * 2;
                const radius = 3 + Math.sin(time * 0.5 + index * Math.PI * 5) * 1;
                particle.position.x = Math.cos(angle) * radius * (1 + index * 0.3);
                particle.position.y = Math.sin(angle) * radius * (1 + index * 0.3);
                particle.position.z = Math.sin(time + index * Math.PI * 4) * 2;
                break;
                
              case 'mandala':
                // Mandala pattern
                const circle = 3 + Math.sin(time * 0.3 + index * Math.PI * 10) * 0.5;
                const x = circle * Math.cos(index * Math.PI * 2 + time * 0.2);
                const y = circle * Math.sin(index * Math.PI * 2 + time * 0.2);
                particle.position.x = x;
                particle.position.y = y;
                particle.position.z = Math.cos(time * 0.5 + index * Math.PI * 5) * 2;
                break;
                
              case 'fractal':
              default:
                // Fractal-like movement
                const t = time * 0.5;
                const scale = 3.5;
                particle.position.x = scale * Math.sin(t + index * 5) * Math.cos(t * 0.5 + index);
                particle.position.y = scale * Math.cos(t + index * 5) * Math.sin(t * 0.5 + index);
                particle.position.z = scale * Math.sin(t * 0.7 + index * 3);
                break;
            }
            
            // Fix TypeScript errors by properly checking if particle is a Mesh with material
            if (particle instanceof THREE.Mesh && particle.material instanceof THREE.MeshStandardMaterial && audioData) {
              const energyFactor = bassEnergy * 0.5 + midEnergy * 0.3 + highEnergy * 0.2;
              particle.material.emissiveIntensity = 0.5 + energyFactor * 2;
            }
          }
        });
      }
    }
  });

  // Create particles for the visualization
  const createParticles = () => {
    const particles: THREE.Mesh[] = [];
    const count = 30;
    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    
    for (let i = 0; i < count; i++) {
      const index = i / count;
      const hue = index * 360;
      
      // Create particle with emissive material for glow effect
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${hue}, 100%, 70%)`),
        emissive: new THREE.Color(`hsl(${hue}, 100%, 70%)`),
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(particleGeometry, material);
      
      // Position in a circle initially
      const angle = index * Math.PI * 2;
      const radius = 3;
      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = Math.sin(angle) * radius;
      particle.position.z = 0;
      
      particles.push(particle);
    }
    
    return particles;
  };

  // Render different geometries based on the selected shape
  const renderGeometry = () => {
    switch (shape) {
      case 'flower-of-life':
        return <FlowerOfLife baseColor={baseColor} accentColor={accentColor} />;
      case 'seed-of-life':
        return <SeedOfLife baseColor={baseColor} accentColor={accentColor} />;
      case 'metatrons-cube':
        return <MetatronsCube baseColor={baseColor} accentColor={accentColor} />;
      case 'merkaba':
        return <Merkaba baseColor={baseColor} accentColor={accentColor} />;
      case 'torus':
        return <TorusShape baseColor={baseColor} accentColor={accentColor} />;
      case 'tree-of-life':
        return <TreeOfLife baseColor={baseColor} accentColor={accentColor} />;
      case 'sri-yantra':
        return <SriYantra baseColor={baseColor} accentColor={accentColor} />;
      case 'vesica-piscis':
        return <VesicaPiscis baseColor={baseColor} accentColor={accentColor} />;
      case 'sphere':
        return <EnergyBall baseColor={baseColor} accentColor={accentColor} />;
      default:
        return <FlowerOfLife baseColor={baseColor} accentColor={accentColor} />;
    }
  };

  // Effect to create particles
  useEffect(() => {
    if (shapeRef.current) {
      // Clear any existing particles
      while (shapeRef.current.children.length > 0) {
        shapeRef.current.remove(shapeRef.current.children[0]);
      }
      
      // Add new particles
      const particles = createParticles();
      particles.forEach(particle => {
        if (shapeRef.current) {
          shapeRef.current.add(particle);
        }
      });
      
      particlesRef.current = particles;
    }
    
    return () => {
      particlesRef.current = [];
    };
  }, [shape, mode]);

  return (
    <group ref={groupRef}>
      {renderGeometry()}
      <group ref={shapeRef} position={[0, 0, 0]} />
    </group>
  );
};

// Ambient light with colors matching the shape
const AmbientLighting: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={baseColor} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={accentColor} />
      <directionalLight position={[0, 5, 5]} intensity={1} color="white" />
    </>
  );
};

// Individual shape components
const FlowerOfLife: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  
  // Create flower of life pattern
  const circlePositions = [];
  const centerCircle = new Vector3(0, 0, 0);
  circlePositions.push(centerCircle);
  
  // First ring of 6 circles
  const firstRingRadius = 0.5;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = Math.cos(angle) * firstRingRadius;
    const y = Math.sin(angle) * firstRingRadius;
    circlePositions.push(new Vector3(x, y, 0));
  }
  
  return (
    <group ref={groupRef}>
      {/* Center circle */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Surrounding circles */}
      {circlePositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <torusGeometry args={[0.33, 0.05, 16, 100]} />
          <meshStandardMaterial color={i === 0 ? accentColor : baseColor} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Connecting lines */}
      {circlePositions.map((pos1, i) => (
        circlePositions.slice(i + 1).map((pos2, j) => (
          <Line 
            key={`${i}-${j}`} 
            points={[pos1, pos2]} 
            color={accentColor} 
            lineWidth={0.01} 
          />
        ))
      ))}
    </group>
  );
};

const SeedOfLife: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });
  
  // Create seed of life pattern (7 overlapping circles)
  const circlePositions = [];
  
  // Center circle
  circlePositions.push(new Vector3(0, 0, 0));
  
  // Six circles around the center
  const radius = 0.5;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    circlePositions.push(new Vector3(x, y, 0));
  }
  
  return (
    <group ref={groupRef}>
      {circlePositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshStandardMaterial
            color={i === 0 ? accentColor : baseColor}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Central sphere */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color={accentColor} 
          emissive={accentColor} 
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const MetatronsCube: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  
  // Create vertices for Metatron's cube
  const vertices = [];
  
  // Center point
  vertices.push(new Vector3(0, 0, 0));
  
  // First shell of vertices (fruit of life pattern)
  const firstShellRadius = 1;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = Math.cos(angle) * firstShellRadius;
    const y = Math.sin(angle) * firstShellRadius;
    vertices.push(new Vector3(x, y, 0));
  }
  
  // Second shell vertices
  const secondShellRadius = 2;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + (Math.PI / 6);
    const x = Math.cos(angle) * secondShellRadius;
    const y = Math.sin(angle) * secondShellRadius;
    vertices.push(new Vector3(x, y, 0));
  }
  
  // Add top and bottom vertices for the platonic solids
  vertices.push(new Vector3(0, 0, 1.5));
  vertices.push(new Vector3(0, 0, -1.5));
  
  return (
    <group ref={groupRef}>
      {/* Vertices */}
      {vertices.map((vertex, i) => (
        <mesh key={i} position={[vertex.x, vertex.y, vertex.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? accentColor : baseColor}
            metalness={0.8}
            roughness={0.2}
            emissive={i === 0 ? accentColor : baseColor}
            emissiveIntensity={i === 0 ? 1 : 0.5}
          />
        </mesh>
      ))}
      
      {/* Edges connecting vertices */}
      {vertices.map((v1, i) => (
        vertices.slice(i + 1).map((v2, j) => {
          // Skip some connections to make it less cluttered
          if ((i + j) % 3 === 0 || i === 0) {
            return (
              <Line 
                key={`${i}-${j}`} 
                points={[v1, v2]} 
                color={i === 0 ? accentColor : baseColor} 
                lineWidth={i === 0 ? 0.03 : 0.01} 
              />
            );
          }
          return null;
        })
      ))}
    </group>
  );
};

const Merkaba: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  // Create two tetrahedrons (star tetrahedron/merkaba)
  return (
    <group ref={groupRef}>
      {/* Upward tetrahedron */}
      <mesh>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
      
      {/* Downward tetrahedron */}
      <mesh rotation={[0, Math.PI, 0]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
      
      {/* Central energy sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Outer energy field */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.8}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const TorusShape: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const torusRef = useRef<Mesh>(null);
  const innerTorusRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    if (innerTorusRef.current) {
      innerTorusRef.current.rotation.x = state.clock.elapsedTime * -0.3;
      innerTorusRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });
  
  return (
    <group>
      {/* Outer torus */}
      <mesh ref={torusRef}>
        <torusGeometry args={[1.5, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color={baseColor} 
          metalness={0.8} 
          roughness={0.2} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Inner torus */}
      <mesh ref={innerTorusRef} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color={accentColor} 
          metalness={0.8} 
          roughness={0.2} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Center energy sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

const TreeOfLife: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });
  
  // Define the sephiroth positions
  const positions = [
    [0, 2, 0],      // Kether
    [-1, 1, 0],     // Chokmah
    [1, 1, 0],      // Binah
    [-1, 0, 0],     // Chesed
    [1, 0, 0],      // Geburah
    [0, -0.5, 0],   // Tiphareth
    [-1, -1, 0],    // Netzach
    [1, -1, 0],     // Hod
    [0, -2, 0],     // Yesod
    [0, -3, 0]      // Malkuth
  ];
  
  // Define the connections between sephiroth (indices)
  const connections = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4],
    [3, 4], [3, 5], [4, 5], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8], [8, 9]
  ];
  
  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      {/* Sephiroth (the nodes) */}
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color={i === 0 || i === 9 ? accentColor : baseColor}
            emissive={i === 0 || i === 5 || i === 9 ? accentColor : baseColor}
            emissiveIntensity={i === 0 || i === 5 || i === 9 ? 1 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Paths connecting the sephiroth */}
      {connections.map((conn, i) => {
        const start = new Vector3(
          positions[conn[0]][0], 
          positions[conn[0]][1], 
          positions[conn[0]][2]
        );
        const end = new Vector3(
          positions[conn[1]][0], 
          positions[conn[1]][1], 
          positions[conn[1]][2]
        );
        
        return (
          <Line 
            key={i}
            points={[start, end]} 
            color={accentColor} 
            lineWidth={0.05} 
          />
        );
      })}
      
      {/* Background pillar lines */}
      <Line 
        points={[
          new Vector3(0, 2, -0.1),
          new Vector3(0, -3, -0.1)
        ]} 
        color={baseColor} 
        lineWidth={0.08} 
      />
      <Line 
        points={[
          new Vector3(-1, 1, -0.1),
          new Vector3(-1, -1, -0.1)
        ]} 
        color={baseColor} 
        lineWidth={0.08} 
      />
      <Line 
        points={[
          new Vector3(1, 1, -0.1),
          new Vector3(1, -1, -0.1)
        ]} 
        color={baseColor} 
        lineWidth={0.08} 
      />
    </group>
  );
};

const SriYantra: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Outer circle */}
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[1.8, 1.9, 32]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner triangles */}
      {[...Array(9)].map((_, i) => {
        const isDownward = i % 2 === 0;
        const scale = 1.6 - i * 0.15;
        return (
          <mesh 
            key={i} 
            position={[0, isDownward ? -0.05 * i : 0.05 * i, -0.1 + 0.02 * i]}
            rotation={[0, 0, isDownward ? Math.PI : 0]}
          >
            <cylinderGeometry args={[scale, scale, 0.01, 3]} />
            <meshStandardMaterial
              color={isDownward ? baseColor : accentColor}
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      
      {/* Center bindu (point) */}
      <mesh>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Energy aura */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const VesicaPiscis: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Two overlapping circles */}
      <mesh position={[-0.5, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          wireframe={true}
        />
      </mesh>
      
      <mesh position={[0.5, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          wireframe={true}
        />
      </mesh>
      
      {/* Energy in the center (the vesica piscis shape) */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

const EnergyBall: React.FC<{baseColor: string, accentColor: string}> = ({baseColor, accentColor}) => {
  const sphereRef = useRef<Mesh>(null);
  const outerRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
      outerRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group>
      {/* Inner energy core */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer energy field */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={0.4}
          wireframe={true}
        />
      </mesh>
      
      {/* Ambient energy particles */}
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle * 3) * 0.5;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? baseColor : accentColor}
              emissive={i % 2 === 0 ? baseColor : accentColor}
              emissiveIntensity={0.5 + (i / 20)}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Custom line component using vanilla three.js
const Line: React.FC<{
  points: Vector3[];
  color: string;
  lineWidth: number;
}> = ({ points, color, lineWidth }) => {
  const ref = useRef<THREE.Line>(null);
  
  useEffect(() => {
    if (ref.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color, linewidth: lineWidth });
      
      if (ref.current.geometry) {
        ref.current.geometry.dispose();
      }
      
      if (ref.current.material && 'dispose' in ref.current.material) {
        (ref.current.material as THREE.Material).dispose();
      }
      
      ref.current.geometry = geometry;
      ref.current.material = material;
    }
  }, [points, color, lineWidth]);
  
  return <primitive ref={ref} object={new THREE.Line()} />;
};

// Main component
const SacredVisualizer: React.FC<SacredVisualizerProps> = ({
  shape = 'flower-of-life',
  size = 'lg',
  isAudioReactive = false,
  audioContext,
  analyser,
  chakra,
  frequency,
  mode = 'fractal',
  sensitivity = 1,
  liftedVeil = false,
  colorScheme = 'purple'
}) => {
  const [audioData, setAudioData] = useState<Uint8Array | undefined>();
  const animationRef = useRef<number | null>(null);
  
  console.log(`SacredVisualizer mounting shape: ${shape}`);
  
  // Set up canvas size based on the size prop
  const canvasSizeClass = {
    sm: 'h-[150px]',
    md: 'h-[250px]',
    lg: 'h-full w-full',
    xl: 'h-full w-full',
  }[size] || 'h-full w-full';
  
  // Process audio data if audio reactive is enabled
  useEffect(() => {
    if (!isAudioReactive || !analyser) {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Apply sensitivity
      const processedData = dataArray.map(value => {
        return Math.min(255, value * sensitivity);
      });
      
      setAudioData(new Uint8Array(processedData));
      animationRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAudioReactive, analyser, sensitivity]);
  
  // Get colors based on theme settings
  const baseColor = getBaseColor(chakra, colorScheme, liftedVeil);
  const accentColor = getAccentColor(chakra, colorScheme, liftedVeil);
  
  return (
    <div className={`w-full ${canvasSizeClass} relative overflow-hidden`}>
      <Canvas shadows>
        <AmbientLighting baseColor={baseColor} accentColor={accentColor} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          enableRotate={true} 
          autoRotate={false} 
          autoRotateSpeed={0.5} 
        />
        
        <GeometryShape 
          shape={shape} 
          audioData={audioData} 
          frequency={frequency} 
          mode={mode}
          baseColor={baseColor}
          accentColor={accentColor}
        />
        
        {frequency && (
          <Text
            position={[0, -2.5, 0]}
            color="white"
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
          >
            {`${frequency}Hz`}
          </Text>
        )}
      </Canvas>
    </div>
  );
};

export default SacredVisualizer;
