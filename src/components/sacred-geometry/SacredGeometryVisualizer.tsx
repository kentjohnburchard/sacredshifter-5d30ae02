
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface SacredGeometryVisualizerProps {
  defaultShape?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  liftedVeil?: boolean;
}

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  defaultShape = 'flower-of-life',
  size = 'md',
  isAudioReactive = false,
  audioContext,
  analyser,
  chakra,
  frequency,
  mode = 'fractal',
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
    console.log("SacredVisualizer mounting shape:", defaultShape);
    
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
    
    // Create a simple shape for visualization
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: chakra === 'crown' ? 0x9966ff : 
             chakra === 'third-eye' ? 0x6600ff :
             chakra === 'throat' ? 0x0099ff :
             chakra === 'heart' ? 0x00ff99 :
             chakra === 'solar-plexus' ? 0xffcc00 :
             chakra === 'sacral' ? 0xff6600 :
             chakra === 'root' ? 0xff0000 :
             0x9966ff,
      emissive: 0x333333,
      shininess: 50,
      wireframe: true
    });
    
    const shape = new THREE.Mesh(torusGeometry, material);
    scene.add(shape);
    shapeRef.current = shape;
    
    // Start with a small scale and then animate to full size
    shape.scale.set(0.001, 0.001, 0.001);

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !shapeRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      
      if (isExpanding) {
        const progressDelta = delta * (0.5 + fractalProgress * 0.5);
        setFractalProgress(prev => {
          const newProgress = prev + progressDelta;
          if (newProgress >= 1) {
            setIsExpanding(false);
            return 1;
          }
          return newProgress;
        });
        
        const easeOutCubic = 1 - Math.pow(1 - fractalProgress, 3);
        const scale = 0.01 + easeOutCubic * 0.99;
        shapeRef.current.scale.set(scale, scale, scale);
      }
      
      // Rotate the shape
      if (shapeRef.current) {
        shapeRef.current.rotation.x += 0.01;
        shapeRef.current.rotation.y += 0.01;
        
        // Apply audio reactivity if enabled
        if (isAudioReactive && audioData.length > 0) {
          const avgAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
          const scaleFactor = 1 + avgAmplitude * 0.5;
          shapeRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
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
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [defaultShape, chakra]);

  // Handle audio data for visualizer reactivity
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

export default SacredGeometryVisualizer;
