
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createFlowerOfLife, createSeedOfLife, createMetatronsCube, createSriYantra, 
         createTreeOfLife, createVesicaPiscis, createMerkaba } from './sacredGeometryUtils';
import { motion } from 'framer-motion';

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
  mode = 'fractal',
  sensitivity = 1
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shapeRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Animation progress state for fractal expansion
  const [fractalProgress, setFractalProgress] = useState<number>(0);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [isExpanding, setIsExpanding] = useState<boolean>(true);

  // Clear previous renders and set up new scene
  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", shape);
    
    // Reset fractal expansion on shape change
    setIsExpanding(true);
    setFractalProgress(0);
    clockRef.current.start();
    
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
    camera.position.z = 5; // Start with a wider view to see the fractal expansion
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
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !shapeRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      
      // Handle fractal expansion animation
      if (isExpanding) {
        // Accelerate expansion based on progress
        const progressDelta = delta * (0.5 + fractalProgress * 0.5); // Speeds up as it progresses
        setFractalProgress(prev => {
          const newProgress = prev + progressDelta;
          if (newProgress >= 1) {
            setIsExpanding(false);
            return 1;
          }
          return newProgress;
        });
        
        // Scale the geometry based on fractal progress with easing
        const easeOutCubic = 1 - Math.pow(1 - fractalProgress, 3);
        const scale = 0.01 + easeOutCubic * 0.99; // Start tiny (0.01) and expand to full size (1.0)
        shapeRef.current.scale.set(scale, scale, scale);
        
        // Add rotation during expansion
        shapeRef.current.rotation.x += delta * 0.2;
        shapeRef.current.rotation.y += delta * 0.3;
        
        // Camera zoom effect during expansion
        if (cameraRef.current) {
          cameraRef.current.position.z = 5 - (easeOutCubic * 1.5); // Zoom in as the shape expands
        }
      } else {
        // Standard rotation after expansion is complete
        shapeRef.current.rotation.x += 0.005;
        shapeRef.current.rotation.y += 0.005;
        
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const scaleFactor = 1 + (averageAmplitude * 0.3 * (sensitivity || 1));
          shapeRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
      }
      
      // Add pulsing glow effect for prime positions
      if (shapeRef.current) {
        // Apply subtle prime-based pulse
        const time = clockRef.current.getElapsedTime();
        const primePulse = (
          Math.sin(time * 2) * 0.02 + // Prime 2
          Math.sin(time * 3) * 0.015 + // Prime 3
          Math.sin(time * 5) * 0.01 + // Prime 5
          Math.sin(time * 7) * 0.005   // Prime 7
        );
        
        // Apply pulse to shape opacity or scale
        if (shapeRef.current.children.length > 0) {
          shapeRef.current.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
              if ('emissiveIntensity' in child.material) {
                child.material.emissiveIntensity = 0.5 + primePulse;
              }
            }
          });
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
        object = createFlowerOfLife(true); // Pass fractal flag
        break;
        
      case 'seed-of-life':
        object = createSeedOfLife(true); // Pass fractal flag
        break;
        
      case 'metatrons-cube':
        object = createMetatronsCube(true); // Pass fractal flag
        break;
        
      case 'merkaba':
        object = createMerkaba(true); // Pass fractal flag
        break;
        
      case 'torus':
        // Fractal torus implementation
        const torusGroup = new THREE.Group();
        geometry = new THREE.TorusGeometry(1, 0.3, 32, 64);
        const torusMaterial = material.clone();
        const torus = new THREE.Mesh(geometry, torusMaterial);
        torusGroup.add(torus);
        
        // Add wireframe for better visibility
        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          wireframeMaterial
        );
        torus.add(wireframe);
        
        // Origin point (central node)
        const originGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const originMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: 0xb794f6,
          emissiveIntensity: 1.0
        });
        const origin = new THREE.Mesh(originGeometry, originMaterial);
        torusGroup.add(origin);
        
        object = torusGroup;
        break;
        
      case 'tree-of-life':
        object = createTreeOfLife(true); // Pass fractal flag
        break;
        
      case 'sri-yantra':
        object = createSriYantra(true); // Pass fractal flag
        break;
        
      case 'vesica-piscis':
        object = createVesicaPiscis(true); // Pass fractal flag
        break;
        
      case 'sphere':
        // Fractal sphere implementation
        const sphereGroup = new THREE.Group();
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
        const sphereWireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0xb794f6,
            transparent: true,
            opacity: 0.3
          })
        );
        mesh.add(sphereWireframe);
        
        // Origin point (central node)
        const sphereOrigin = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xb794f6,
            emissiveIntensity: 1.0
          })
        );
        sphereGroup.add(sphereOrigin);
        sphereGroup.add(mesh);
        
        object = sphereGroup;
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
      
      // Add origin point (central node)
      const originGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const originMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xb794f6,
        emissiveIntensity: 1.0
      });
      const origin = new THREE.Mesh(originGeometry, originMaterial);
      object.add(origin);
    }

    // Add object to scene
    if (object) {
      // Start as a tiny point at the center for fractal expansion
      object.scale.set(0.01, 0.01, 0.01);
      
      if (shape !== 'sphere') {
        // Make non-sphere objects smaller for better visibility when fully expanded
        object.scale.multiplyScalar(0.8);
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

  return (
    <motion.div 
      ref={mountRef} 
      className={`w-full ${sizeClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default SacredVisualizer;
