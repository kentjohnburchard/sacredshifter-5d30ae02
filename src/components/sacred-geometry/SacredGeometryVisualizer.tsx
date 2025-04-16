
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
  mode?: 'fractal' | 'spiral' | 'mandala' | 'liquid-crystal';
  liftedVeil?: boolean;
  showControls?: boolean;
  isVisible?: boolean;
  className?: string;
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
  liftedVeil = false,
  showControls = false,
  isVisible = true,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shapeRef = useRef<THREE.Mesh | null>(null); // Use THREE.Mesh type
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
    
    if (!mountRef.current || !isVisible) return;
    
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
    
    // Determine material color based on mode and chakra
    let materialColor, emissiveColor;
    
    if (mode === 'liquid-crystal') {
      materialColor = new THREE.Color(0x00bfff); // Bright cyan for liquid crystal mode
      emissiveColor = new THREE.Color(0x0080ff); // Slight blue glow
    } else if (chakra === 'crown') {
      materialColor = new THREE.Color(0x9966ff);
      emissiveColor = new THREE.Color(0x6600ff);
    } else if (chakra === 'third-eye') {
      materialColor = new THREE.Color(0x6600ff);
      emissiveColor = new THREE.Color(0x4b0082);
    } else if (chakra === 'throat') {
      materialColor = new THREE.Color(0x0099ff);
      emissiveColor = new THREE.Color(0x0066cc);
    } else if (chakra === 'heart') {
      materialColor = new THREE.Color(0x00ff99);
      emissiveColor = new THREE.Color(0x00cc66);
    } else if (chakra === 'solar-plexus') {
      materialColor = new THREE.Color(0xffcc00);
      emissiveColor = new THREE.Color(0xcc9900);
    } else if (chakra === 'sacral') {
      materialColor = new THREE.Color(0xff6600);
      emissiveColor = new THREE.Color(0xcc3300);
    } else if (chakra === 'root') {
      materialColor = new THREE.Color(0xff0000);
      emissiveColor = new THREE.Color(0xcc0000);
    } else {
      materialColor = new THREE.Color(0x9966ff);
      emissiveColor = new THREE.Color(0x6600ff);
    }
    
    // Create a geometric shape for visualization
    let geometry;
    
    // Choose the geometry based on the shape name
    if (defaultShape === 'flower-of-life') {
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3);
    } else if (defaultShape === 'seed-of-life') {
      geometry = new THREE.SphereGeometry(1, 32, 32);
    } else if (defaultShape === 'metatrons-cube') {
      geometry = new THREE.OctahedronGeometry(1, 0);
    } else if (defaultShape === 'merkaba') {
      geometry = new THREE.TetrahedronGeometry(1, 0);
    } else if (defaultShape === 'torus') {
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    } else if (defaultShape === 'tree-of-life') {
      geometry = new THREE.IcosahedronGeometry(1, 0);
    } else if (defaultShape === 'sri-yantra') {
      geometry = new THREE.ConeGeometry(1, 2, 3);
    } else if (defaultShape === 'vesica-piscis') {
      geometry = new THREE.RingGeometry(0.5, 1, 32);
    } else if (defaultShape === 'sphere') {
      geometry = new THREE.SphereGeometry(1, 32, 32);
    } else if (mode === 'liquid-crystal') {
      // Water-like geometry with more segments for fluid appearance
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 3, 4); 
    } else if (mode === 'spiral') {
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16, 2, 3);
    } else if (mode === 'mandala') {
      geometry = new THREE.CylinderGeometry(1, 1, 0.2, 16, 1, true);
    } else {
      // Default fractal mode
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    }
    
    // Special liquid crystal material with water-like properties
    const material = mode === 'liquid-crystal' 
      ? new THREE.MeshPhysicalMaterial({ 
          color: materialColor,
          emissive: emissiveColor,
          metalness: 0.9,
          roughness: 0.2,
          transmission: 0.95, // High transparency
          thickness: 0.5, // Glass-like thickness
          clearcoat: 1.0, // Polished look
          clearcoatRoughness: 0.1,
          wireframe: false
        })
      : new THREE.MeshPhongMaterial({ 
          color: materialColor,
          emissive: emissiveColor,
          emissiveIntensity: 0.5,
          shininess: 50,
          wireframe: mode === 'mandala' ? false : true
        });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shapeRef.current = shape;
    
    // Start with a small scale and then animate to full size
    shape.scale.set(0.001, 0.001, 0.001);

    // Add particle system for liquid mode
    if (mode === 'liquid-crystal') {
      const particles = new THREE.BufferGeometry();
      const particleCount = 1000;
      
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        // Create a sphere of particles
        const radius = 1.5 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        sizes[i] = Math.random() * 0.05 + 0.01;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x40e0d0, // Turquoise
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
    }

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !shapeRef.current || !isVisible) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();
      
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
      
      // Animate based on mode
      if (mode === 'liquid-crystal') {
        // More fluid, water-like movement
        shapeRef.current.rotation.x += delta * 0.1;
        shapeRef.current.rotation.y += delta * 0.15;
        
        // Apply wave-like deformation
        if (shapeRef.current.geometry instanceof THREE.BufferGeometry) {
          const positions = shapeRef.current.geometry.attributes.position;
          const count = positions.count;
          
          if (count > 0) {
            for (let i = 0; i < count; i++) {
              const x = positions.getX(i);
              const y = positions.getY(i);
              const z = positions.getZ(i);
              
              // Add sine wave distortion
              const offset = Math.sin(x * 2 + time) * 0.05 + 
                             Math.cos(y * 2 + time * 1.5) * 0.05;
              
              positions.setZ(i, z + offset);
            }
            
            positions.needsUpdate = true;
          }
        }
      } else {
        // Standard rotation
        shapeRef.current.rotation.x += 0.01;
        shapeRef.current.rotation.y += 0.01;
      }
      
      // Apply audio reactivity if enabled
      if (isAudioReactive && audioData.length > 0) {
        const avgAmplitude = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
        const scaleFactor = 1 + avgAmplitude * 0.5;
        
        if (mode === 'liquid-crystal') {
          // For liquid crystal mode, apply pulsating effect
          const pulseFactor = 1 + avgAmplitude * Math.sin(time * 3) * 0.1;
          shapeRef.current.scale.set(scaleFactor * pulseFactor, scaleFactor * pulseFactor, scaleFactor);
          
          // Change material properties based on audio
          if (shapeRef.current.material instanceof THREE.MeshPhysicalMaterial) {
            shapeRef.current.material.transmission = 0.9 + avgAmplitude * 0.1;
            shapeRef.current.material.clearcoat = 0.8 + avgAmplitude * 0.2;
          }
        } else {
          // Standard scaling for other modes
          shapeRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    if (isVisible) {
      animate();
    }
    
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
  }, [defaultShape, chakra, isVisible, mode]);

  // Handle audio data for visualizer reactivity
  useEffect(() => {
    if (!isAudioReactive || !audioContext || !analyser || !isVisible) return;
    
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
  }, [isAudioReactive, audioContext, analyser, isVisible]);

  const sizeClass = {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[500px]',
    xl: 'h-[600px]'
  }[size] || 'h-96';

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`sacred-visualizer w-full h-full overflow-hidden ${
      mode === 'liquid-crystal' ? 'liquid-crystal-container' :
      liftedVeil ? 'sacred-lifted' : 'sacred-standard'
    } ${className}`}>
      {mode === 'liquid-crystal' && (
        <>
          {/* Add liquid crystal ripple effects */}
          <div className="liquid-ripple ripple-1" style={{width: '50%', height: '50%', left: '25%', top: '25%'}}></div>
          <div className="liquid-ripple ripple-2" style={{width: '70%', height: '70%', left: '15%', top: '15%'}}></div>
          <div className="liquid-ripple ripple-3" style={{width: '90%', height: '90%', left: '5%', top: '5%'}}></div>
          <div className="crystal-lattice"></div>
          
          {/* Add floating water droplets */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="water-droplet" 
              style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 4}s`,
                width: `${5 + Math.random() * 8}px`,
                height: `${5 + Math.random() * 8}px`,
              }}
            ></div>
          ))}
        </>
      )}
      
      <motion.div 
        ref={mountRef} 
        className={`w-full ${sizeClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
          <div className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-black/30 text-white/80">
            {mode === 'liquid-crystal' ? 'Liquid Living Geometry' : defaultShape.replace(/-/g, ' ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default SacredGeometryVisualizer;
