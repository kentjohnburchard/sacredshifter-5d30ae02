
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface VisualizerProps {
  shape?: string;
  colorScheme?: string;
  chakra?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  liftedVeil?: boolean;
}

export const SimplifiedVisualizer: React.FC<VisualizerProps> = ({
  shape = 'torus',
  colorScheme = 'purple',
  size = 'md',
  isAudioReactive = false,
  analyser,
  chakra,
  liftedVeil = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.Material | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | undefined>();
  const animationRef = useRef<number | null>(null);

  // Get color based on chakra or colorScheme
  const getColor = () => {
    if (liftedVeil) return '#ff69b4'; // Pink for lifted veil
    
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

  // Initialize Three.js scene
  const initializeScene = () => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(getColor(), 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create geometry based on shape
    let geometry;
    
    switch (shape) {
      case 'flower-of-life':
      case 'seed-of-life':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'merkaba':
        geometry = new THREE.OctahedronGeometry(1.5);
        break;
      case 'torus':
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        break;
      default:
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    }
    
    geometryRef.current = geometry;

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: getColor(),
      metalness: 0.7,
      roughness: 0.2
    });
    materialRef.current = material;

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Start animation
    const animate = () => {
      if (meshRef.current && sceneRef.current && cameraRef.current && rendererRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
        
        // Apply audio reactivity if available
        if (audioData && audioData.length > 0) {
          const average = Array.from(audioData).reduce((sum, value) => sum + value, 0) / audioData.length;
          const scale = 1 + (average / 255) * 0.3;
          meshRef.current.scale.set(scale, scale, scale);
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    frameIdRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  };

  // Process audio data if audio reactive is enabled
  useEffect(() => {
    if (!isAudioReactive || !analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      animationRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAudioReactive, analyser]);

  // Initialize scene on mount
  useEffect(() => {
    const cleanup = initializeScene();
    return cleanup;
  }, []);

  // Update colors when props change
  useEffect(() => {
    if (materialRef.current) {
      (materialRef.current as THREE.MeshStandardMaterial).color = new THREE.Color(getColor());
    }
  }, [colorScheme, chakra, liftedVeil]);

  // Set canvas size based on prop
  const canvasSizeClass = {
    sm: 'h-[150px]',
    md: 'h-[250px]',
    lg: 'h-full w-full',
    xl: 'h-full w-full'
  }[size] || 'h-full w-full';

  return (
    <div ref={containerRef} className={`w-full ${canvasSizeClass} relative overflow-hidden`}></div>
  );
};

export default SimplifiedVisualizer;
