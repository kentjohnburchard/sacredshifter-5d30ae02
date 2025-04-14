
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, useHelper, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import SacredGeometryCanvas from './SacredGeometryCanvas';

// Sacred geometry components
const Merkaba = ({ position, rotation, scale, color, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const merkaba = useMemo(() => {
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    return geometry;
  }, []);

  return (
    <mesh 
      ref={meshRef} 
      position={position as [number, number, number]} 
      rotation={rotation as [number, number, number]} 
      scale={scale}
    >
      <primitive object={merkaba} />
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

const Torus = ({ position, rotation, scale, color, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position as [number, number, number]} 
      rotation={rotation as [number, number, number]} 
      scale={scale}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

const Dodecahedron = ({ position, rotation, scale, color, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position as [number, number, number]} 
      rotation={rotation as [number, number, number]} 
      scale={scale}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        metalness={0.8}
        roughness={0.2}
        wireframe={true}
      />
    </mesh>
  );
};

// Interface for component props
interface FlowerOfLifeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

const FlowerOfLife: React.FC<FlowerOfLifeProps> = ({ position, rotation, scale, color, opacity }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const circles = [];
  const radius = 0.5;
  const center = new THREE.Vector2(0, 0);
  
  // Create center circle
  circles.push(
    <mesh key="center" position={[0, 0, 0]}>
      <circleGeometry args={[radius, 32]} />
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        metalness={0.8}
        roughness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
  
  // Create surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    
    circles.push(
      <mesh key={`circle-${i}`} position={[x, y, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial 
          color={color} 
          transparent={true} 
          opacity={opacity}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  return (
    <group 
      ref={groupRef} 
      position={position as [number, number, number]} 
      rotation={rotation as [number, number, number]} 
      scale={scale}
    >
      {circles}
    </group>
  );
};

// Define proper types for the shape properties
interface ShapeProps {
  id: number | string;
  type: 'torus' | 'dodecahedron' | 'merkaba' | 'flowerOfLife';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

// Define types for the VisualizerScene props
interface VisualizerSceneProps {
  audioData?: Uint8Array;
  isPlaying: boolean;
  liftTheVeil?: boolean;
  primes?: number[];
}

// The main visualizer scene
const VisualizerScene: React.FC<VisualizerSceneProps> = ({ 
  audioData, 
  isPlaying, 
  liftTheVeil = false, 
  primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
}) => {
  const { camera } = useThree();
  const [shapes, setShapes] = useState<ShapeProps[]>([]);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  
  // Helper for directional light (visible only during development)
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 0.5, 'white');
  
  useFrame((state) => {
    // Gentle camera movement
    if (camera && isPlaying) {
      camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.5;
      camera.position.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.5;
      camera.lookAt(0, 0, 0);
    }
    
    // Update shapes
    setShapes(prevShapes => prevShapes
      .map(shape => ({
        ...shape,
        scale: shape.scale + 0.01,
        opacity: shape.opacity - 0.005
      }))
      .filter(shape => shape.opacity > 0)
    );
  });

  // Process audio data and create shapes based on dominant frequencies
  useEffect(() => {
    if (!audioData || !isPlaying) return;
    
    // Calculate dominant frequency from audio data
    const bufferLength = audioData.length;
    let maxAmplitude = 0;
    let dominantFreqIndex = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      if (audioData[i] > maxAmplitude) {
        maxAmplitude = audioData[i];
        dominantFreqIndex = i;
      }
    }
    
    // Calculate approximate frequency value (rough estimation)
    // This is a simplified approach - real frequency analysis would be more complex
    const dominantFreq = dominantFreqIndex * (22050 / bufferLength);
    const amplitude = maxAmplitude / 255; // Normalize to 0-1
    
    // Only create shapes if amplitude is significant
    if (amplitude > 0.6 && Math.random() > 0.7) {
      // Check if the frequency is close to a prime number
      const isPrimeOrClose = primes.some(prime => 
        Math.abs(dominantFreq % prime) < 5 || 
        Math.abs((dominantFreq / 10) % prime) < 1 ||
        Math.abs((dominantFreq / 100) % prime) < 0.1
      );
      
      if (isPrimeOrClose || Math.random() > 0.85) {
        // Determine shape type based on frequency
        let shapeType: ShapeProps['type'];
        if (dominantFreq < 200) shapeType = 'torus';
        else if (dominantFreq < 500) shapeType = 'dodecahedron';
        else if (dominantFreq < 1000) shapeType = 'merkaba';
        else shapeType = 'flowerOfLife';
        
        // Determine position based on audio data and randomness
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        ];
        
        // Determine color based on frequency and theme
        let color;
        if (liftTheVeil) {
          // Pink-themed colors for liftTheVeil mode
          const hue = 300 + Math.random() * 60; // 300-360 is pink/magenta range
          const saturation = 70 + Math.random() * 30;
          const lightness = 50 + Math.random() * 40;
          color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
          // Default purple-blue gradient
          const hue = 220 + (dominantFreq % 80); // 220-300 is blue to purple range
          const saturation = 70 + amplitude * 30;
          const lightness = 50 + amplitude * 40;
          color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
        
        // Add new shape
        setShapes(prevShapes => [...prevShapes, {
          id: Date.now() + Math.random(),
          type: shapeType,
          position,
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
          scale: 0.1 + amplitude * 0.5,
          color,
          opacity: 0.8
        }]);
      }
    }
  }, [audioData, isPlaying, liftTheVeil, primes]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        ref={directionalLightRef}
        position={[5, 5, 5] as [number, number, number]} 
        intensity={1.5} 
        castShadow 
      />
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 0] as [number, number, number]} 
        intensity={2}
        color={liftTheVeil ? "#ff69b4" : "#9b87f5"} 
      />
      
      {/* Background stars */}
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Sacred geometry shapes */}
      {shapes.map(shape => {
        if (shape.type === 'torus')
          return <Torus key={shape.id} {...shape} />;
        else if (shape.type === 'dodecahedron')
          return <Dodecahedron key={shape.id} {...shape} />;
        else if (shape.type === 'merkaba')
          return <Merkaba key={shape.id} {...shape} />;
        else if (shape.type === 'flowerOfLife')
          return <FlowerOfLife key={shape.id} {...shape} />;
        return null;
      })}
    </>
  );
};

interface SacredThreeVisualizerProps {
  isPlaying: boolean;
  audioData?: Uint8Array;
  liftTheVeil?: boolean;
  fullscreen?: boolean;
}

const SacredThreeVisualizer: React.FC<SacredThreeVisualizerProps> = ({
  isPlaying,
  audioData,
  liftTheVeil = false,
  fullscreen = false,
}) => {
  // Only render when we have audio data and player is playing
  const shouldRender = isPlaying || fullscreen;
  
  // Camera settings based on fullscreen state
  const cameraPosition: [number, number, number] = fullscreen ? [0, 0, 5] : [0, 0, 4];
  const cameraFov = fullscreen ? 75 : 60;
  
  // Track THREE.js availability and errors
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [threeError, setThreeError] = useState<string | null>(null);
  
  // Use a ref to track initialization attempts
  const initAttemptedRef = useRef(false);
  
  // Check if THREE is properly loaded
  useEffect(() => {
    if (initAttemptedRef.current) return;
    initAttemptedRef.current = true;
    
    try {
      // Check if THREE is available globally
      if (typeof window !== 'undefined' && window.THREE) {
        console.log("THREE is available in SacredThreeVisualizer:", window.THREE.REVISION);
        setThreeLoaded(true);
      } else if (typeof THREE !== 'undefined') {
        // Use imported THREE if global is not available
        console.log("Using imported THREE in SacredThreeVisualizer:", THREE.REVISION);
        // Set THREE globally if it doesn't exist
        if (typeof window !== 'undefined' && !window.THREE) {
          window.THREE = THREE;
        }
        setThreeLoaded(true);
      } else {
        console.warn("THREE is not available in SacredThreeVisualizer component");
        setThreeError("THREE.js could not be initialized");
      }
    } catch (error) {
      console.error("Error initializing THREE:", error);
      setThreeError("Error initializing 3D engine");
    }
  }, []);
  
  // Use 2D canvas fallback if THREE.js fails to load or when not rendering
  if (!shouldRender || !audioData) {
    return (
      <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center">
        <p className="text-white/50 text-xs">Visualizer paused</p>
      </div>
    );
  }
  
  if (threeError || !threeLoaded) {
    // Fallback to 2D canvas-based visualizer
    return (
      <SacredGeometryCanvas 
        audioAnalyser={null}
        colorScheme="purple"
        chakra={undefined}
        expanded={fullscreen}
      />
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Canvas className="rounded-lg" shadows>
        <PerspectiveCamera 
          makeDefault
          position={cameraPosition}
          fov={cameraFov}
        />
        <VisualizerScene
          audioData={audioData}
          isPlaying={isPlaying}
          liftTheVeil={liftTheVeil}
        />
        <OrbitControls 
          enableZoom={fullscreen}
          enablePan={fullscreen}
          enableRotate
          rotateSpeed={0.5}
          maxDistance={20}
          minDistance={3}
        />
      </Canvas>
    </div>
  );
};

export default SacredThreeVisualizer;
