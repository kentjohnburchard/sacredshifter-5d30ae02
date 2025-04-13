
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface FractalAudioVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  isVisible: boolean;
  intensity?: number; // 0-1 controls the intensity of visualizations
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  pauseWhenStopped?: boolean; // Whether to pause animation when audio is stopped
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isVisible,
  intensity = 1,
  colorScheme = 'purple',
  pauseWhenStopped = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fractalsRef = useRef<THREE.Mesh[]>([]);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const visualizerActiveRef = useRef<boolean>(false);
  
  // Generate a color based on the chosen scheme
  const getColorScheme = () => {
    switch (colorScheme) {
      case 'blue': 
        return { 
          primary: new THREE.Color(0x1a56db),
          accent: new THREE.Color(0x3b82f6),
          highlight: new THREE.Color(0x93c5fd)
        };
      case 'rainbow':
        return {
          primary: new THREE.Color(0xff3366),
          accent: new THREE.Color(0x33ccff),
          highlight: new THREE.Color(0xffcc33)
        };
      case 'gold':
        return {
          primary: new THREE.Color(0xffc857),
          accent: new THREE.Color(0xf9a826),
          highlight: new THREE.Color(0xffb74d)
        };
      default: // purple
        return {
          primary: new THREE.Color(0x7e22ce),
          accent: new THREE.Color(0xa855f7),
          highlight: new THREE.Color(0xd8b4fe)
        };
    }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    
    console.log("FractalVisualizer: Initializing Three.js scene");
    visualizerActiveRef.current = true;
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Setup renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const colors = getColorScheme();
    
    // Point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(colors.accent, 1.5);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(colors.highlight, 1.5);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);
    
    // Create audio data buffer if we have an analyzer
    if (analyser) {
      console.log("FractalVisualizer: Analyzer available, creating data buffer");
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    } else {
      console.log("FractalVisualizer: No analyzer provided");
    }
    
    // Generate fractal elements
    createFractals();
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    if (isVisible) {
      animate();
    }
    
    // Cleanup
    return () => {
      visualizerActiveRef.current = false;
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch (err) {
          console.error("Error cleaning up renderer:", err);
        }
      }
      
      // Clean up geometries and materials
      if (sceneRef.current) {
        fractalsRef.current.forEach(mesh => {
          sceneRef.current?.remove(mesh);
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        });
      }
      
      console.log("FractalVisualizer: Cleanup complete");
    };
  }, [isVisible, colorScheme]);
  
  // Create fractal shapes
  const createFractals = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const colors = getColorScheme();
    
    // Clear any existing fractals
    fractalsRef.current.forEach(mesh => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    fractalsRef.current = [];
    
    // Create main fractal shapes
    
    // Mandelbulb-inspired shape (complex fractal)
    const complexGeometry = new THREE.IcosahedronGeometry(1, 4);
    const complexMaterial = new THREE.MeshPhongMaterial({
      color: colors.primary,
      emissive: colors.accent,
      shininess: 80,
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });
    const complexMesh = new THREE.Mesh(complexGeometry, complexMaterial);
    complexMesh.position.set(0, 0, 0);
    scene.add(complexMesh);
    fractalsRef.current.push(complexMesh);
    
    // Add wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.01, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: colors.highlight,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    wireframeMesh.position.set(0, 0, 0);
    scene.add(wireframeMesh);
    fractalsRef.current.push(wireframeMesh);
    
    // Add orbital rings
    for (let i = 0; i < 3; i++) {
      const torusGeometry = new THREE.TorusGeometry(1.5 + i * 0.5, 0.03, 16, 100);
      const torusMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.7 - i * 0.2
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      
      // Position each ring at a different angle
      torus.rotation.x = Math.PI / 2 + i * Math.PI / 3;
      torus.rotation.y = i * Math.PI / 4;
      
      scene.add(torus);
      fractalsRef.current.push(torus);
    }
    
    // Add particles for enhanced effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create particles in a spherical distribution
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i + 2] = radius * Math.cos(phi);                   // z
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: colors.highlight,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    fractalsRef.current.push(particles as unknown as THREE.Mesh); // Type cast for consistency
  };
  
  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !visualizerActiveRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Get audio data if available
    let audioDataAvailable = false;
    let frequencyData: number[] = [];
    
    if (analyser && dataArrayRef.current) {
      analyser.getByteFrequencyData(dataArrayRef.current);
      audioDataAvailable = true;
      
      // Process frequency data for visualization
      frequencyData = Array.from(dataArrayRef.current).map(val => val / 255);
    }
    
    // Update fractals based on audio
    fractalsRef.current.forEach((mesh, index) => {
      // Update rotation speed based on average frequency
      let rotationSpeed = 0.001;
      let scaleFactor = 1;
      
      if (audioDataAvailable && frequencyData.length) {
        // Different frequency bands for different effects
        const bassFreq = frequencyData.slice(0, 8).reduce((sum, val) => sum + val, 0) / 8;
        const midFreq = frequencyData.slice(8, 24).reduce((sum, val) => sum + val, 0) / 16;
        const highFreq = frequencyData.slice(24, 40).reduce((sum, val) => sum + val, 0) / 16;
        
        // Adjust speed and pulse based on different frequencies
        if (index === 0) { // Main fractal body - affected by bass
          rotationSpeed = 0.001 + bassFreq * 0.003 * intensity;
          scaleFactor = 1 + bassFreq * 0.15 * intensity;
          
          mesh.rotation.y += rotationSpeed;
          mesh.rotation.z += rotationSpeed * 0.7;
          mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
          
          // Adjust material properties - fixed TypeScript error by casting to MeshPhongMaterial
          if (!Array.isArray(mesh.material)) {
            // Ensure we're working with a MeshPhongMaterial
            const material = mesh.material as THREE.MeshPhongMaterial;
            if (material.emissive) {
              material.emissiveIntensity = 0.2 + bassFreq * 0.3 * intensity;
            }
          }
        } 
        else if (index === 1) { // Wireframe - affected by mids
          rotationSpeed = 0.0015 + midFreq * 0.004 * intensity;
          scaleFactor = 1 + midFreq * 0.1 * intensity;
          
          mesh.rotation.y -= rotationSpeed;
          mesh.rotation.x += rotationSpeed * 0.5;
          mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
          
          // Adjust material properties
          if (!Array.isArray(mesh.material)) {
            mesh.material.opacity = 0.3 + midFreq * 0.4 * intensity;
          }
        }
        else if (index >= 2 && index <= 4) { // Torus rings - affected by highs
          rotationSpeed = 0.002 + highFreq * 0.005 * intensity;
          const ringIndex = index - 2;
          
          mesh.rotation.x += rotationSpeed * (ringIndex % 2 ? 1 : -1);
          mesh.rotation.z += rotationSpeed * 0.7 * (ringIndex % 2 ? -1 : 1);
          
          // Pulse opacity based on high frequencies
          if (!Array.isArray(mesh.material)) {
            mesh.material.opacity = Math.max(0.1, Math.min(0.7, 0.3 + highFreq * 0.5 * intensity));
          }
        }
        else if (index === 5) { // Particles
          // Move particles based on overall frequency
          const overallFreq = (bassFreq + midFreq + highFreq) / 3;
          
          if (mesh instanceof THREE.Points) {
            mesh.rotation.y += 0.001 + overallFreq * 0.003 * intensity;
            mesh.rotation.x += 0.0005 + overallFreq * 0.002 * intensity;
            
            // Pulse size based on beat
            if (!Array.isArray(mesh.material) && mesh.material instanceof THREE.PointsMaterial) {
              mesh.material.size = 0.05 + overallFreq * 0.1 * intensity;
              mesh.material.opacity = 0.5 + overallFreq * 0.5 * intensity;
            }
          }
        }
      } else {
        // Default animation when no audio data
        if (index === 0 || index === 1) {
          mesh.rotation.y += 0.001;
          mesh.rotation.x += 0.0005;
        } 
        else if (index >= 2 && index <= 4) {
          mesh.rotation.x += 0.002 * (index % 2 ? 1 : -1);
          mesh.rotation.z += 0.001 * (index % 2 ? -1 : 1);
        }
        else if (index === 5 && mesh instanceof THREE.Points) {
          mesh.rotation.y += 0.0005;
        }
      }
    });
    
    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default FractalAudioVisualizer;
