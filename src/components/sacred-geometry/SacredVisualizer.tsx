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
  const sceneRef = useRef<THREE.Scene>();
  const shapeRef = useRef<THREE.Object3D>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameIdRef = useRef<number>();

  // State for audio reactivity (to be implemented)
  const [audioData, setAudioData] = useState<number[]>([]);

  // Handle audio reactivity
  useEffect(() => {
    if (!isAudioReactive || !audioContext || !analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateAudioData = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Convert to normalized array (0-1 values)
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

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Add starfield background
    createStarfield(scene);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6; // Increased from 5 to create better view of larger geometry

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0.3);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Increased intensity
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0); // Increased intensity
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.5); // Increased intensity
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create the selected sacred geometry
    createSacredGeometry(shape, scene);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (shapeRef.current) {
        shapeRef.current.rotation.x += 0.005;
        shapeRef.current.rotation.y += 0.005;
        
        // Apply audio reactivity if enabled
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const scaleFactor = 1 + (averageAmplitude * 0.2 * (sensitivity || 1));
          shapeRef.current.scale.set(
            scaleFactor,
            scaleFactor,
            scaleFactor
          );
        }
      }
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (shapeRef.current) scene.remove(shapeRef.current);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [shape, isAudioReactive, audioData]);

  // Function to create starfield background
  const createStarfield = (scene: THREE.Scene) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });

    const starsVertices = [];
    for (let i = 0; i < 1500; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
  };

  // Function to create sacred geometry based on selection
  const createSacredGeometry = (shape: string, scene: THREE.Scene) => {
    if (shapeRef.current) {
      scene.remove(shapeRef.current);
      shapeRef.current = undefined;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a56eff'),
      emissive: new THREE.Color('#8a43ff'),
      roughness: 0.2,
      metalness: 0.8,
    });

    let geometry: THREE.BufferGeometry | undefined;
    let object: THREE.Object3D | undefined;

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
        geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
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
        geometry = new THREE.SphereGeometry(1, 64, 64);
        break;
    }

    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      object = mesh;
    }

    if (object) {
      object.scale.set(3.0, 3.0, 3.0);
      scene.add(object);
      shapeRef.current = object;

      addGlowEffect(object, scene);
    }
  };

  // Add glow effect to object
  const addGlowEffect = (object: THREE.Object3D, scene: THREE.Scene) => {
    if (object instanceof THREE.Mesh) {
      const edges = new THREE.EdgesGeometry(object.geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.8
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      object.add(wireframe);
    }
  };

  // Generate size class based on prop
  const sizeClass = {
    sm: 'h-64',
    md: 'h-160',
    lg: 'h-240',
    xl: 'h-screen',
  }[size];

  return <div ref={mountRef} className={`w-full ${sizeClass} absolute inset-0`} />;
};

export default SacredVisualizer;
