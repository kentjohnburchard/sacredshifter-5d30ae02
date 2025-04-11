
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createFlowerOfLife, createSeedOfLife, createMetatronsCube, createSriYantra, 
         createTreeOfLife, createVesicaPiscis, createMerkaba } from './sacredGeometryUtils';

interface SacredVisualizerProps {
  shape: 'flower-of-life' | 'seed-of-life' | 'metatrons-cube' | 'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 'vesica-piscis' | 'sphere';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
}

const SacredVisualizer: React.FC<SacredVisualizerProps> = ({ 
  shape, 
  size = 'md',
  isAudioReactive = false,
  audioContext,
  analyser,
  chakra,
  frequency,
  mode,
  sensitivity = 1
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shapeRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [audioData, setAudioData] = useState<number[]>([]);

  // Clear previous renders and set up new scene
  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", shape);
    
    // Clean up previous scene if it exists
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    
    if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    if (!width || !height) {
      console.error("Container has zero width or height");
      return;
    }

    // Set up scene with transparent background
    const scene = new THREE.Scene();
    scene.background = null; // Make background transparent
    sceneRef.current = scene;

    // Set up camera with wider field of view
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3.5; // Move camera closer
    cameraRef.current = camera;

    // Set up renderer with transparency enabled
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Add the renderer to the DOM
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Set up lights with MUCH higher intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8.0);
    directionalLight.position.set(0, 1, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 8.0);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 8.0);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create the sacred geometry
    createSacredGeometry(shape, scene);

    // Animation loop with much faster rotation
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (shapeRef.current) {
        // Increased rotation speed for better visibility
        shapeRef.current.rotation.x += 0.005;
        shapeRef.current.rotation.y += 0.008;
        
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const scaleFactor = 1 + (averageAmplitude * 0.2 * (sensitivity || 1));
          shapeRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    animate();
    
    // Handle window resizing
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (shapeRef.current && sceneRef.current) {
        sceneRef.current.remove(shapeRef.current);
        shapeRef.current = null;
      }
      
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [shape]);

  // Handle audio reactivity
  useEffect(() => {
    if (!isAudioReactive || !audioContext || !analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      const normalizedData = Array.from(dataArray).map(value => value / 255);
      setAudioData(normalizedData);
      frameIdRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isAudioReactive, audioContext, analyser]);

  // Create sacred geometry based on selected shape
  const createSacredGeometry = (shape: string, scene: THREE.Scene) => {
    if (shapeRef.current) {
      scene.remove(shapeRef.current);
      shapeRef.current = null;
    }

    // Create a MUCH more visible material with better lighting properties
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xae94f6), // Brighter purple color
      emissive: new THREE.Color(0x9370db), // Emissive purple glow
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      wireframe: false
    });
    
    // Secondary material for additional visibility
    const emissiveMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe9d8fd), // Lighter purple
      emissive: new THREE.Color(0xe9d8fd),
      emissiveIntensity: 1.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      wireframe: false
    });

    // Wireframe material for extra visibility
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, 
      opacity: 0.7,
      linewidth: 2
    });

    let geometry: THREE.BufferGeometry | undefined;
    let object: THREE.Object3D | undefined;

    // Create the shape
    switch (shape) {
      case 'flower-of-life':
        object = createFlowerOfLife();
        break;
        
      case 'seed-of-life':
        object = createSeedOfLife();
        break;
        
      case 'metatrons-cube':
        object = createMetatronsCube();
        break;
        
      case 'merkaba':
        object = createMerkaba();
        break;
        
      case 'torus':
        geometry = new THREE.TorusGeometry(1.5, 0.4, 32, 100);
        break;
        
      case 'tree-of-life':
        object = createTreeOfLife();
        break;
        
      case 'sri-yantra':
        object = createSriYantra();
        break;
        
      case 'vesica-piscis':
        object = createVesicaPiscis();
        break;
        
      case 'sphere':
      default:
        geometry = new THREE.SphereGeometry(1.5, 64, 64);
        break;
    }

    // Create mesh if we have geometry
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      object = mesh;
    }

    // Add object to scene with MUCH larger scale
    if (object) {
      // Make the object much larger for better visibility - crucial for visibility
      object.scale.set(30.0, 30.0, 30.0);
      scene.add(object);
      shapeRef.current = object;

      // Add glow and wireframe for better visibility
      addGlowEffect(object, scene, emissiveMaterial, wireframeMaterial);
    }
  };

  // Add glow effect to make the shape more visible
  const addGlowEffect = (object: THREE.Object3D, scene: THREE.Scene, glowMaterial: THREE.Material, wireframeMaterial: THREE.LineBasicMaterial) => {
    if (object instanceof THREE.Mesh && object.geometry) {
      // Add wireframe for extra visibility - critical for visibility
      const wireGeometry = object.geometry.clone();
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(wireGeometry),
        wireframeMaterial
      );
      object.add(wireframe);
      
      // Add a slightly larger glowing mesh
      const glowMesh = new THREE.Mesh(object.geometry, glowMaterial);
      glowMesh.scale.set(1.05, 1.05, 1.05);
      object.add(glowMesh);
      
      // Add point lights at key vertices for additional glow
      const vertices = object.geometry.attributes.position;
      const vertexCount = vertices.count;
      
      if (vertexCount > 20) {
        // Only add lights for some key vertices to avoid performance issues
        for (let i = 0; i < Math.min(10, vertexCount); i += Math.max(1, Math.floor(vertexCount / 10))) {
          const vertex = new THREE.Vector3(
            vertices.getX(i),
            vertices.getY(i),
            vertices.getZ(i)
          );
          
          const pointLight = new THREE.PointLight(0xb794f6, 15, 0.5);
          pointLight.position.copy(vertex);
          object.add(pointLight);
        }
      }
    }
  };

  // Determine size class based on props
  const sizeClass = {
    sm: 'h-64',
    md: 'h-160',
    lg: 'h-240',
    xl: 'h-screen',
  }[size] || 'h-160';

  return <div ref={mountRef} className={`w-full ${sizeClass} absolute inset-0 z-10`} />;
};

export default SacredVisualizer;
