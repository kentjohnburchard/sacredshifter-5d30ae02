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
  liftedVeil = false
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

  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", shape);
    
    setIsExpanding(true);
    setFractalProgress(0);
    clockRef.current.start();
    
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
    
    const pointLight1 = new THREE.PointLight(0xff00ff, 2.0);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00ffff, 2.0);
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
        
        shapeRef.current.rotation.x += delta * Math.sin(time * 3) * 0.3;
        shapeRef.current.rotation.y += delta * Math.cos(time * 2) * 0.4;
        
        if (cameraRef.current) {
          cameraRef.current.position.z = 5 - (easeOutElastic(fractalProgress) * 1.5);
        }
      } else {
        const pulseAmount = Math.sin(time * 2) * 0.1;
        const baseScale = 1 + pulseAmount;
        
        if (isAudioReactive && audioData.length > 0) {
          const averageAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const reactivePulse = averageAmplitude * 0.3 * (sensitivity || 1);
          const finalScale = baseScale + reactivePulse;
          shapeRef.current.scale.set(finalScale, finalScale, finalScale);
          
          shapeRef.current.rotation.x += 0.002 + (averageAmplitude * 0.01);
          shapeRef.current.rotation.y += 0.002 + (averageAmplitude * 0.01);
        } else {
          shapeRef.current.scale.set(baseScale, baseScale, baseScale);
          shapeRef.current.rotation.x += 0.002;
          shapeRef.current.rotation.y += 0.002;
        }
        
        shapeRef.current.position.y = Math.sin(time) * 0.1;
        shapeRef.current.position.x = Math.cos(time * 0.8) * 0.1;
      }
      
      if (shapeRef.current) {
        const primePulse = (
          Math.sin(time * 2) * 0.02 +
          Math.sin(time * 3) * 0.015 +
          Math.sin(time * 5) * 0.01 +
          Math.sin(time * 7) * 0.005
        );
        
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
      
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [shape]);

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

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xae94f6),
      emissive: new THREE.Color(0x6f42c1),
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      wireframe: shape === 'sphere' ? false : true
    });
    
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xb794f6,
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
        emissive: 0xb794f6,
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
