
import React, { useRef, useEffect } from 'react';
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

  const [audioData, setAudioData] = React.useState<number[]>([]);

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

    // Set up camera with appropriate field of view
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3; // Position the camera at a safe distance
    cameraRef.current = camera;

    // Create renderer with transparency enabled
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

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xff00ff, 2.0); // Purple light
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00ffff, 2.0); // Cyan light
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    // Create the sacred geometry
    createSacredGeometry(shape, scene);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (shapeRef.current) {
        // Standard rotation speeds
        shapeRef.current.rotation.x += 0.01;
        shapeRef.current.rotation.y += 0.01;
        
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const scaleFactor = 1 + (averageAmplitude * 0.3 * (sensitivity || 1));
          shapeRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      
      // Re-render after resize
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
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

    // Create a standard material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xae94f6), // Purple
      emissive: new THREE.Color(0x6f42c1), // Emissive color
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      wireframe: shape === 'sphere' ? false : true // Only sphere is not wireframe
    });
    
    // Wireframe material
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xb794f6,
      transparent: true, 
      opacity: 0.8
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
        // Fixed torus implementation
        geometry = new THREE.TorusGeometry(1, 0.3, 32, 64);
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
        // Fixed sphere implementation - smaller and with better materials
        geometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x9f7aea,
          emissive: 0x4c1d95,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.7,
          wireframe: false,
          shininess: 50
        });
        const mesh = new THREE.Mesh(geometry, sphereMaterial);
        
        // Add wireframe on top for better visibility
        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0xb794f6,
            transparent: true,
            opacity: 0.3
          })
        );
        mesh.add(wireframe);
        
        object = mesh;
        break;
    }

    // Create mesh if we have geometry and no object yet
    if (geometry && !object) {
      const mesh = new THREE.Mesh(geometry, material);
      object = mesh;
      
      // Add wireframe for better visibility
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        wireframeMaterial
      );
      object.add(wireframe);
    }

    // Add object to scene
    if (object) {
      if (shape !== 'sphere') {
        // Make non-sphere objects smaller for better visibility
        object.scale.set(0.8, 0.8, 0.8);
      }
      scene.add(object);
      shapeRef.current = object;
    }
  };

  // Determine size class based on props
  const sizeClass = {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[500px]',
    xl: 'h-[600px]',
  }[size] || 'h-96';

  return <div ref={mountRef} className={`w-full ${sizeClass}`} />;
};

export default SacredVisualizer;
