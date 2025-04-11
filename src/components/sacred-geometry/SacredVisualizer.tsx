
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

  const [audioData, setAudioData] = useState<number[]>([]);

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

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any previous instance
    if (mountRef.current.childNodes.length > 0) {
      mountRef.current.innerHTML = '';
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create a camera with a better position to see objects
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 10; // Position camera farther back

    // Create a renderer with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Add stronger lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 6.0);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 10.0);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 10.0);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Add a directional light for better illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8.0);
    directionalLight.position.set(0, 0, 10);
    scene.add(directionalLight);

    createSacredGeometry(shape, scene);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (shapeRef.current) {
        // Make rotation very slow for better visibility
        shapeRef.current.rotation.x += 0.001;
        shapeRef.current.rotation.y += 0.001;
        
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

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (shapeRef.current && scene) scene.remove(shapeRef.current);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [shape, isAudioReactive, audioData]);

  const createSacredGeometry = (shape: string, scene: THREE.Scene) => {
    if (shapeRef.current) {
      scene.remove(shapeRef.current);
      shapeRef.current = undefined;
    }

    // Create a bright, vibrant material with higher opacity
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e6c9ff'),
      emissive: new THREE.Color('#d4a7ff'),
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide // Ensure both sides of geometry are visible
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
      // Make the object much larger and more visible
      object.scale.set(8.0, 8.0, 8.0);
      scene.add(object);
      shapeRef.current = object;

      addGlowEffect(object, scene);
    }
  };

  const addGlowEffect = (object: THREE.Object3D, scene: THREE.Scene) => {
    if (object instanceof THREE.Mesh) {
      const edges = new THREE.EdgesGeometry(object.geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 1.0,
        linewidth: 3
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      object.add(wireframe);
      
      if (object.geometry) {
        // Add a highly visible glow around the object
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xe5d1ff,
          transparent: true,
          opacity: 0.9
        });
        
        // Make the glow much larger
        const glowMesh = new THREE.Mesh(object.geometry, glowMaterial);
        glowMesh.scale.set(1.25, 1.25, 1.25);
        object.add(glowMesh);
      }
    }
  };

  const sizeClass = {
    sm: 'h-64',
    md: 'h-160',
    lg: 'h-240',
    xl: 'h-screen',
  }[size];

  return <div ref={mountRef} className={`w-full ${sizeClass} absolute inset-0`} />;
};

export default SacredVisualizer;
