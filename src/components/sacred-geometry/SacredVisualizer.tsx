
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createFlowerOfLife, createSeedOfLife, createMetatronsCube, createSriYantra, 
         createTreeOfLife, createVesicaPiscis, createMerkaba } from './sacredGeometryUtils';
import { motion } from 'framer-motion';

interface SacredVisualizerProps {
  shape: string;
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

const SacredVisualizer: React.FC<SacredVisualizerProps> = ({
  shape,
  size = 'md',
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
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shapeRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const [fractalProgress, setFractalProgress] = useState<number>(0);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [isExpanding, setIsExpanding] = useState<boolean>(true);
  const [replicatedShapes, setReplicatedShapes] = useState<THREE.Object3D[]>([]);

  // Get the base color for visualizations based on colorScheme
  const getBaseColor = () => {
    if (liftedVeil) return new THREE.Color(0xff36ab); // Pink for lifted veil
    
    switch(colorScheme) {
      case 'purple': return new THREE.Color(0x8b5cf6);
      case 'blue': return new THREE.Color(0x3b82f6);
      case 'gold': return new THREE.Color(0xf59e0b);
      case 'rainbow': return new THREE.Color(0xffffff); // Will be handled specially in animation
      case 'chakra':
        switch(chakra) {
          case 'root': return new THREE.Color(0xff0000);
          case 'sacral': return new THREE.Color(0xffa500);
          case 'solar': return new THREE.Color(0xffff00);
          case 'heart': return new THREE.Color(0x00ff00);
          case 'throat': return new THREE.Color(0x00ffff);
          case 'third-eye': return new THREE.Color(0x0000ff);
          case 'crown': return new THREE.Color(0xee82ee);
          default: return new THREE.Color(0x8b5cf6);
        }
      default:
        return new THREE.Color(0x8b5cf6);
    }
  };
  
  // Get emissive color (usually a darker variant of base color)
  const getEmissiveColor = () => {
    if (liftedVeil) return new THREE.Color(0xd946ef); // Darker pink for lifted veil
    
    switch(colorScheme) {
      case 'purple': return new THREE.Color(0x6f42c1);
      case 'blue': return new THREE.Color(0x1e40af);
      case 'gold': return new THREE.Color(0xd97706);
      case 'rainbow': return new THREE.Color(0x000000); // Will be handled specially in animation
      case 'chakra':
        switch(chakra) {
          case 'root': return new THREE.Color(0x8B0000);
          case 'sacral': return new THREE.Color(0xD2691E);
          case 'solar': return new THREE.Color(0xFFD700);
          case 'heart': return new THREE.Color(0x008000);
          case 'throat': return new THREE.Color(0x008B8B);
          case 'third-eye': return new THREE.Color(0x0000CD);
          case 'crown': return new THREE.Color(0x9400D3);
          default: return new THREE.Color(0x6f42c1);
        }
      default:
        return new THREE.Color(0x6f42c1);
    }
  };

  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", shape);
    
    setIsExpanding(true);
    setFractalProgress(0);
    clockRef.current.start();
    setReplicatedShapes([]);
    
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

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);
    
    // Dynamic colors based on color scheme
    const colorSchemeColor = getBaseColor();
    const primaryColor = liftedVeil ? 0xff36ab : colorSchemeColor.getHex();
    
    const pointLight1 = new THREE.PointLight(primaryColor, 2.0);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(primaryColor, 2.0);
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    createSacredGeometry(shape, scene);

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !shapeRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();
      
      if (isExpanding) {
        const progressDelta = delta * (0.3 + fractalProgress * 0.4);
        setFractalProgress(prev => {
          const newProgress = prev + progressDelta;
          if (newProgress >= 1) {
            setIsExpanding(false);
            return 1;
          }
          return newProgress;
        });
        
        const easeOutElastic = (x: number): number => {
          const c4 = (2 * Math.PI) / 3;
          return x === 0 ? 0 : x === 1 ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
        };
        
        const scale = 0.01 + easeOutElastic(fractalProgress) * 0.99;
        shapeRef.current.scale.set(scale, scale, scale);
        
        // Add more organic, flowing motion during expansion
        shapeRef.current.rotation.x += delta * Math.sin(time * 3) * 0.3;
        shapeRef.current.rotation.y += delta * Math.cos(time * 2) * 0.4;
        
        if (cameraRef.current) {
          cameraRef.current.position.z = 5 - (easeOutElastic(fractalProgress) * 1.5);
        }
        
        // Replicate the shape when it reaches certain expansion thresholds
        if (
          mode === 'spiral' && 
          shapeRef.current && 
          replicatedShapes.length < 8 && 
          fractalProgress > 0.4 && 
          Math.random() > 0.97
        ) {
          const replicaGeometry = shapeRef.current.clone();
          const scale = 0.1 + Math.random() * 0.3;
          replicaGeometry.scale.set(scale, scale, scale);
          
          const radius = 1 + Math.random() * 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          replicaGeometry.position.x = radius * Math.sin(phi) * Math.cos(theta);
          replicaGeometry.position.y = radius * Math.sin(phi) * Math.sin(theta);
          replicaGeometry.position.z = radius * Math.cos(phi);
          
          sceneRef.current.add(replicaGeometry);
          setReplicatedShapes(prev => [...prev, replicaGeometry]);
        }
      } else {
        // Audio reactivity for main shape
        let pulseAmount = Math.sin(time * 2) * 0.1;
        let baseScale = 1 + pulseAmount;
        
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const reactivePulse = averageAmplitude * 0.3 * (sensitivity || 1);
          const finalScale = baseScale + reactivePulse;
          shapeRef.current.scale.set(finalScale, finalScale, finalScale);
          
          // More dramatic rotation based on audio intensity
          shapeRef.current.rotation.x += 0.002 + (averageAmplitude * 0.01 * sensitivity);
          shapeRef.current.rotation.y += 0.002 + (averageAmplitude * 0.01 * sensitivity);
          
          // Dynamic color based on frequency spectrum for rainbow mode
          if (colorScheme === 'rainbow' && shapeRef.current) {
            // Sample different frequency bands
            const bassLevel = audioData.slice(0, Math.floor(audioData.length/6)).reduce((sum, val) => sum + val, 0) 
              / Math.floor(audioData.length/6);
            const midLevel = audioData.slice(Math.floor(audioData.length/6), Math.floor(audioData.length/2)).reduce((sum, val) => sum + val, 0) 
              / (Math.floor(audioData.length/2) - Math.floor(audioData.length/6));
            const highLevel = audioData.slice(Math.floor(audioData.length/2)).reduce((sum, val) => sum + val, 0) 
              / (audioData.length - Math.floor(audioData.length/2));
              
            // Create a color that shifts based on frequency spectrum
            const hue = (time * 20) % 360; // Base hue rotation over time
            const saturation = 0.5 + midLevel * 0.5;
            const lightness = 0.4 + highLevel * 0.4;
            
            // Update material colors across the shape
            shapeRef.current.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (child.material instanceof THREE.MeshStandardMaterial) {
                  // HSL to RGB conversion happens in the material
                  child.material.color.setHSL(hue/360, saturation, lightness);
                  child.material.emissive.setHSL(hue/360, saturation * 0.8, lightness * 0.5);
                }
                if (child.material instanceof THREE.LineBasicMaterial) {
                  child.material.color.setHSL((hue + 180) % 360 / 360, saturation, lightness);
                }
              }
            });
          }
          
          // Animate replicated shapes based on audio
          replicatedShapes.forEach((replica, index) => {
            const individualFreq = audioData[index % audioData.length] || 0.5; 
            const scaleMultiplier = 0.5 + (individualFreq * 0.5);
            const rotationSpeed = 0.005 + (individualFreq * 0.01);
            
            replica.rotation.x += rotationSpeed;
            replica.rotation.y += rotationSpeed * 0.7;
            
            // Orbit around main shape
            const orbitRadius = 1.5 + (individualFreq * 0.5);
            const orbitSpeed = time * (0.2 + index * 0.1);
            
            replica.position.x = Math.cos(orbitSpeed) * orbitRadius;
            replica.position.y = Math.sin(orbitSpeed) * orbitRadius * 0.8;
            replica.position.z = Math.sin(time + index) * 0.5;
            
            // Pulse scale with audio
            const replicaScale = 0.2 + (individualFreq * 0.2);
            replica.scale.set(replicaScale, replicaScale, replicaScale);
          });
        } else {
          shapeRef.current.scale.set(baseScale, baseScale, baseScale);
          shapeRef.current.rotation.x += 0.002;
          shapeRef.current.rotation.y += 0.002;
          
          // Animate replicated shapes with gentle pulsing
          replicatedShapes.forEach((replica, index) => {
            const orbitSpeed = time * (0.2 + index * 0.1);
            const orbitRadius = 1.5;
            
            replica.position.x = Math.cos(orbitSpeed) * orbitRadius;
            replica.position.y = Math.sin(orbitSpeed) * orbitRadius * 0.8;
            replica.position.z = Math.sin(time + index) * 0.5;
            
            replica.rotation.x += 0.005;
            replica.rotation.y += 0.003;
          });
        }
        
        // Natural flowing motion for main shape
        shapeRef.current.position.y = Math.sin(time) * 0.1;
        shapeRef.current.position.x = Math.cos(time * 0.8) * 0.1;
      }
      
      // Enhance material glow and pulsing
      if (shapeRef.current) {
        // Create harmonic pulsing using prime number frequencies
        const primePulse = (
          Math.sin(time * 2) * 0.02 +
          Math.sin(time * 3) * 0.015 +
          Math.sin(time * 5) * 0.01 +
          Math.sin(time * 7) * 0.005 +
          Math.sin(time * 11) * 0.003
        );
        
        // Apply harmonics to all children
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
    
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
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
      
      // Also remove any replicated shapes
      replicatedShapes.forEach(replica => {
        if (sceneRef.current) {
          sceneRef.current.remove(replica);
        }
      });
      setReplicatedShapes([]);
      
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [shape, colorScheme]);

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

  const createSacredGeometry = (shape: string, scene: THREE.Scene) => {
    if (shapeRef.current) {
      scene.remove(shapeRef.current);
      shapeRef.current = null;
    }

    const baseColor = getBaseColor();
    const emissiveColor = getEmissiveColor();

    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      wireframe: shape === 'sphere' ? false : true
    });
    
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: baseColor,
      transparent: true, 
      opacity: 0.8
    });

    let geometry: THREE.BufferGeometry | undefined;
    let object: THREE.Object3D | undefined;

    switch (shape) {
      case 'flower-of-life':
        object = createFlowerOfLife(true);
        break;
        
      case 'seed-of-life':
        object = createSeedOfLife(true);
        break;
        
      case 'metatrons-cube':
        object = createMetatronsCube(true);
        break;
        
      case 'merkaba':
        object = createMerkaba(true);
        break;
        
      case 'torus':
        const torusGroup = new THREE.Group();
        geometry = new THREE.TorusGeometry(1, 0.3, 32, 64);
        const torusMaterial = material.clone();
        const torus = new THREE.Mesh(geometry, torusMaterial);
        torusGroup.add(torus);
        
        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          wireframeMaterial
        );
        torus.add(wireframe);
        
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
        object = createTreeOfLife(true);
        break;
        
      case 'sri-yantra':
        object = createSriYantra(true);
        break;
        
      case 'vesica-piscis':
        object = createVesicaPiscis(true);
        break;
        
      case 'sphere':
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
        
        const sphereWireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0xb794f6,
            transparent: true,
            opacity: 0.3
          })
        );
        mesh.add(sphereWireframe);
        
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

    if (geometry && !object) {
      const mesh = new THREE.Mesh(geometry, material);
      object = mesh;
      
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        wireframeMaterial
      );
      object.add(wireframe);
      
      const originGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const originMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: baseColor,
        emissiveIntensity: 1.0
      });
      const origin = new THREE.Mesh(originGeometry, originMaterial);
      object.add(origin);
    }

    if (object) {
      object.scale.set(0.01, 0.01, 0.01);
      
      if (shape !== 'sphere') {
        object.scale.multiplyScalar(0.8);
      }
      
      scene.add(object);
      shapeRef.current = object;
    }
  };

  const sizeClass = {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[500px]',
    xl: 'h-[600px]'
  }[size] || 'h-96';

  return (
    <div className={`sacred-visualizer w-full h-full overflow-hidden ${
      liftedVeil ? 'sacred-lifted' : 'sacred-standard'
    }`}>
      <motion.div 
        ref={mountRef} 
        className={`w-full ${sizeClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default SacredVisualizer;
