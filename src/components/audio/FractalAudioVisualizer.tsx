import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface FractalAudioVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  isVisible: boolean;
  intensity?: number; // 0-1 controls the intensity of visualizations
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold' | 'green' | 'red';
  pauseWhenStopped?: boolean; // Whether to pause animation when audio is stopped
  chakra?: string; // Optional chakra association
  frequency?: number; // Optional frequency in Hz
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isVisible,
  intensity = 1,
  colorScheme = 'purple',
  pauseWhenStopped = false,
  chakra,
  frequency
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const fractalsRef = useRef<THREE.Object3D[]>([]);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const visualizerActiveRef = useRef<boolean>(false);
  const primeIndexRef = useRef<number>(0);
  const beatDetectedRef = useRef<boolean>(false);
  const timeRef = useRef<number>(0);
  
  // Prime number sequence generation
  const primes = useMemo(() => {
    // Generate first 1000 prime numbers
    const primeArray: number[] = [];
    let num = 2;
    
    function isPrime(n: number): boolean {
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      
      const sqrtN = Math.sqrt(n);
      for (let i = 5; i <= sqrtN; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    }
    
    while (primeArray.length < 1000) {
      if (isPrime(num)) {
        primeArray.push(num);
      }
      num++;
    }
    
    return primeArray;
  }, []);

  // Get color scheme based on chakra or provided scheme
  const getColorScheme = () => {
    // If chakra is specified, use chakra-based colors
    if (chakra) {
      switch (chakra.toLowerCase()) {
        case 'root':
          return { 
            primary: new THREE.Color(0xea384c),
            accent: new THREE.Color(0xff6b6b),
            highlight: new THREE.Color(0xff8e8e)
          };
        case 'sacral':
          return {
            primary: new THREE.Color(0xf97316),
            accent: new THREE.Color(0xffa94d),
            highlight: new THREE.Color(0xffc078)
          };
        case 'solar plexus':
          return {
            primary: new THREE.Color(0xfacc15),
            accent: new THREE.Color(0xfde047),
            highlight: new THREE.Color(0xfef08a)
          };
        case 'heart':
          return {
            primary: new THREE.Color(0x22c55e),
            accent: new THREE.Color(0x4ade80),
            highlight: new THREE.Color(0x86efac)
          };
        case 'throat':
          return {
            primary: new THREE.Color(0x3b82f6),
            accent: new THREE.Color(0x60a5fa),
            highlight: new THREE.Color(0x93c5fd)
          };
        case 'third eye':
          return {
            primary: new THREE.Color(0x6366f1),
            accent: new THREE.Color(0x818cf8),
            highlight: new THREE.Color(0xa5b4fc)
          };
        case 'crown':
          return {
            primary: new THREE.Color(0x8b5cf6),
            accent: new THREE.Color(0xa78bfa),
            highlight: new THREE.Color(0xc4b5fd)
          };
      }
    }
    
    // Otherwise use the provided color scheme
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
      case 'green':
        return {
          primary: new THREE.Color(0x22c55e),
          accent: new THREE.Color(0x4ade80),
          highlight: new THREE.Color(0x86efac)
        };
      case 'red':
        return {
          primary: new THREE.Color(0xea384c),
          accent: new THREE.Color(0xff6b6b),
          highlight: new THREE.Color(0xff8e8e)
        };
      default: // purple
        return {
          primary: new THREE.Color(0x7e22ce),
          accent: new THREE.Color(0xa855f7),
          highlight: new THREE.Color(0xd8b4fe)
        };
    }
  };

  // Frequency to color mapping (for specific frequency input)
  const getFrequencyColor = (freq: number) => {
    if (!freq) return null;
    
    // Solfeggio frequencies mapping to colors
    if (freq >= 396 && freq < 417) return new THREE.Color(0xea384c); // Red - Root
    if (freq >= 417 && freq < 528) return new THREE.Color(0xf97316); // Orange - Sacral
    if (freq >= 528 && freq < 639) return new THREE.Color(0xfacc15); // Yellow - Solar Plexus
    if (freq >= 639 && freq < 741) return new THREE.Color(0x22c55e); // Green - Heart
    if (freq >= 741 && freq < 852) return new THREE.Color(0x3b82f6); // Blue - Throat
    if (freq >= 852 && freq < 963) return new THREE.Color(0x6366f1); // Indigo - Third Eye
    if (freq >= 963) return new THREE.Color(0x8b5cf6);               // Violet - Crown
    
    // Default
    return null;
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
    
    // Generate prime-based fractal elements
    createPrimeFractals();
    
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
      geometriesRef.current.forEach(geometry => {
        geometry.dispose();
      });
      
      materialsRef.current.forEach(material => {
        material.dispose();
      });
      
      // Clean up scene objects
      if (sceneRef.current) {
        fractalsRef.current.forEach(obj => {
          sceneRef.current?.remove(obj);
        });
      }
      
      console.log("FractalVisualizer: Cleanup complete");
    };
  }, [isVisible, colorScheme, chakra]);
  
  // Generate prime-based fractal patterns
  const createPrimeFractals = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const colors = getColorScheme();
    
    // Clear existing objects
    fractalsRef.current.forEach(obj => {
      scene.remove(obj);
    });
    
    geometriesRef.current.forEach(geometry => {
      geometry.dispose();
    });
    
    materialsRef.current.forEach(material => {
      material.dispose();
    });
    
    fractalsRef.current = [];
    geometriesRef.current = [];
    materialsRef.current = [];
    
    // Override colors with frequency-specific color if available
    if (frequency) {
      const freqColor = getFrequencyColor(frequency);
      if (freqColor) {
        colors.primary = freqColor;
        colors.accent = freqColor.clone().multiplyScalar(1.2);
        colors.highlight = freqColor.clone().multiplyScalar(1.4);
      }
    }
    
    // Create prime-number based spiral structure (Ulam Spiral concept)
    const createPrimeSpiral = () => {
      const points = [];
      const spiralGroup = new THREE.Group();
      
      // Use prime numbers to generate points on a spiral
      for (let i = 0; i < 200; i++) {
        const prime = primes[i % primes.length];
        const angle = i * 0.1 * Math.PI;
        const radius = 0.02 * i;
        
        // Modulate with prime numbers
        const x = Math.cos(angle * (prime % 7)) * radius;
        const y = Math.sin(angle * (prime % 5)) * radius;
        const z = (prime % 3) * 0.01;
        
        points.push(new THREE.Vector3(x, y, z));
        
        // Add prime point indicators
        if (i % 5 === 0) {
          const dotGeometry = new THREE.SphereGeometry(0.02 + (prime % 5) * 0.01, 8, 8);
          geometriesRef.current.push(dotGeometry);
          
          const dotMaterial = new THREE.MeshPhongMaterial({
            color: colors.highlight,
            emissive: colors.primary,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
          });
          materialsRef.current.push(dotMaterial);
          
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          dot.position.set(x, y, z);
          spiralGroup.add(dot);
        }
      }
      
      // Create curve through points
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.02, 8, false);
      geometriesRef.current.push(tubeGeometry);
      
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: colors.primary,
        emissive: colors.accent,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        shininess: 80
      });
      materialsRef.current.push(tubeMaterial);
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      spiralGroup.add(tube);
      
      return spiralGroup;
    };
    
    // Create prime-based rose curve
    const createPrimeRose = () => {
      const roseGroup = new THREE.Group();
      
      // Use different prime numbers for the rose parameters
      const n = primes[3] % 7; // Use the 4th prime (7) modulo 7
      const d = primes[4] % 9; // Use the 5th prime (11) modulo 9
      
      const points = [];
      const segments = 500;
      
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2 * d;
        const radius = Math.cos(n / d * theta) * 1.2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = 0;
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.03, 8, false);
      geometriesRef.current.push(tubeGeometry);
      
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: colors.accent,
        emissive: colors.highlight,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        shininess: 90
      });
      materialsRef.current.push(tubeMaterial);
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      roseGroup.add(tube);
      
      // Add accent points at prime positions
      for (let i = 0; i < 20; i++) {
        const prime = primes[i];
        const index = prime % segments;
        const point = points[index];
        
        if (point) {
          const dotGeometry = new THREE.SphereGeometry(0.06, 12, 12);
          geometriesRef.current.push(dotGeometry);
          
          const dotMaterial = new THREE.MeshPhongMaterial({
            color: colors.highlight,
            emissive: colors.highlight,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.9
          });
          materialsRef.current.push(dotMaterial);
          
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          dot.position.copy(point);
          roseGroup.add(dot);
        }
      }
      
      return roseGroup;
    };
    
    // Create prime-based fractal tree (L-system concept)
    const createPrimeTree = () => {
      const treeGroup = new THREE.Group();
      
      // Use prime numbers to influence branch patterns
      function createBranch(startPoint: THREE.Vector3, direction: THREE.Vector3, length: number, thickness: number, depth: number) {
        if (depth <= 0) return;
        
        // Calculate endpoint
        const endPoint = startPoint.clone().add(direction.clone().multiplyScalar(length));
        
        // Create branch segment
        const branchGeometry = new THREE.CylinderGeometry(thickness * 0.5, thickness, length, 6, 1);
        geometriesRef.current.push(branchGeometry);
        
        const branchMaterial = new THREE.MeshPhongMaterial({
          color: colors.primary,
          emissive: colors.accent,
          emissiveIntensity: 0.2 + (depth / 5) * 0.5,
          transparent: true,
          opacity: 0.7 + depth * 0.05
        });
        materialsRef.current.push(branchMaterial);
        
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        
        // Position and orient branch
        const midPoint = startPoint.clone().add(endPoint.clone().sub(startPoint).multiplyScalar(0.5));
        branch.position.copy(midPoint);
        branch.lookAt(endPoint);
        branch.rotateX(Math.PI / 2);
        
        treeGroup.add(branch);
        
        // Create sub-branches using prime numbers to influence angles
        if (depth > 0) {
          const prime1 = primes[depth % primes.length];
          const prime2 = primes[(depth + 1) % primes.length];
          
          const branchCount = 2 + (depth % 3);
          
          for (let i = 0; i < branchCount; i++) {
            // Use primes to create variations in branch angles
            const angle1 = (i * Math.PI * 2 / branchCount) + (prime1 % 10) * 0.05;
            const angle2 = (prime2 % 10) * 0.05;
            
            const newDirection = direction.clone();
            newDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle1);
            newDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle2);
            
            // Length reduction based on golden ratio and prime factor
            const newLength = length * (0.6 + (prime1 % 10) * 0.01);
            const newThickness = thickness * 0.7;
            
            createBranch(endPoint, newDirection, newLength, newThickness, depth - 1);
          }
        }
      }
      
      // Start the recursive tree
      const startPoint = new THREE.Vector3(0, -1.2, 0);
      const direction = new THREE.Vector3(0, 1, 0);
      const startLength = 0.8;
      const startThickness = 0.06;
      const maxDepth = 4;
      
      createBranch(startPoint, direction, startLength, startThickness, maxDepth);
      
      return treeGroup;
    };
    
    // Create particles based on prime number positions
    const createPrimeParticles = () => {
      const particleGroup = new THREE.Group();
      const particleCount = 300;
      
      const particlesGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      const particleColors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        // Use prime numbers to influence particle positions
        const prime = primes[i % primes.length];
        
        // Create a spiral distribution based on primes
        const angle = i * 0.1 * (prime % 5) * 0.1;
        const radius = 0.1 * i * 0.02 * (prime % 3);
        
        particlePositions[i * 3] = Math.cos(angle) * radius;       // x
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius;   // y
        particlePositions[i * 3 + 2] = (prime % 7) * 0.01 - 0.03;  // z
        
        // Size variation based on prime factors
        particleSizes[i] = 0.04 + (prime % 7) * 0.01;
        
        // Color variation
        if (i % 3 === 0) {
          particleColors[i * 3] = colors.primary.r;
          particleColors[i * 3 + 1] = colors.primary.g;
          particleColors[i * 3 + 2] = colors.primary.b;
        } else if (i % 3 === 1) {
          particleColors[i * 3] = colors.accent.r;
          particleColors[i * 3 + 1] = colors.accent.g;
          particleColors[i * 3 + 2] = colors.accent.b;
        } else {
          particleColors[i * 3] = colors.highlight.r;
          particleColors[i * 3 + 1] = colors.highlight.g;
          particleColors[i * 3 + 2] = colors.highlight.b;
        }
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
      geometriesRef.current.push(particlesGeometry);
      
      // Create shader material
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      materialsRef.current.push(particleMaterial);
      
      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      particleGroup.add(particles);
      
      return particleGroup;
    };
    
    // Create and add all fractals to the scene
    const spiral = createPrimeSpiral();
    const rose = createPrimeRose();
    const tree = createPrimeTree();
    const particles = createPrimeParticles();
    
    // Initial positioning
    spiral.position.set(0, 0, 0);
    rose.position.set(0, 0, 0.5);
    tree.position.set(0, 0, -0.5);
    
    // Initial scale
    spiral.scale.set(1, 1, 1);
    rose.scale.set(0.8, 0.8, 0.8);
    tree.scale.set(0.6, 0.6, 0.6);
    
    scene.add(spiral);
    scene.add(rose);
    scene.add(tree);
    scene.add(particles);
    
    fractalsRef.current = [spiral, rose, tree, particles];
  };
  
  // Detect beats in audio data
  const detectBeat = (dataArray: Uint8Array): boolean => {
    // Simple beat detection by looking at low frequency energy
    const bassSum = dataArray.slice(0, 5).reduce((sum, val) => sum + val, 0);
    const bassAvg = bassSum / 5;
    
    // Threshold for beat detection (can be tuned)
    const threshold = 150;
    
    return bassAvg > threshold;
  };
  
  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !visualizerActiveRef.current) return;
    
    timeRef.current += 0.01;
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Get audio data if available
    let audioDataAvailable = false;
    let frequencyData = new Array(128).fill(0);
    let beatDetected = false;
    
    if (analyser && dataArrayRef.current) {
      analyser.getByteFrequencyData(dataArrayRef.current);
      audioDataAvailable = true;
      
      // Copy data to our array for processing
      for (let i = 0; i < dataArrayRef.current.length && i < frequencyData.length; i++) {
        frequencyData[i] = dataArrayRef.current[i] / 255;
      }
      
      // Beat detection
      beatDetected = detectBeat(dataArrayRef.current);
      if (beatDetected && !beatDetectedRef.current) {
        // Beat just started
        beatDetectedRef.current = true;
        
        // Advance to next prime sequence on beats
        primeIndexRef.current = (primeIndexRef.current + 1) % primes.length;
      } else if (!beatDetected && beatDetectedRef.current) {
        // Beat ended
        beatDetectedRef.current = false;
      }
    }
    
    // Process frequency bands
    const bassFreq = audioDataAvailable ? 
      frequencyData.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10 : 
      0.1;
    
    const midFreq = audioDataAvailable ? 
      frequencyData.slice(10, 40).reduce((sum, val) => sum + val, 0) / 30 : 
      0.1;
    
    const highFreq = audioDataAvailable ? 
      frequencyData.slice(40, 100).reduce((sum, val) => sum + val, 0) / 60 : 
      0.1;
    
    // Get the current prime number to use
    const currentPrime = primes[primeIndexRef.current];
    
    // Update all fractal objects
    fractalsRef.current.forEach((fractal, index) => {
      // Apply different effects to different fractal types
      if (index === 0) { // Prime Spiral
        // Rotate based on audio and prime modulation
        fractal.rotation.z += 0.001 + bassFreq * 0.005 * intensity;
        fractal.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1 * midFreq;
        
        // Scale pulse on beats
        if (beatDetected) {
          fractal.scale.set(
            1 + bassFreq * 0.2 * intensity,
            1 + bassFreq * 0.2 * intensity,
            1 + bassFreq * 0.2 * intensity
          );
        } else {
          // Smooth scale back
          fractal.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
        
        // Use prime numbers to modulate rotation
        fractal.rotation.y += 0.0003 * (currentPrime % 7);
      }
      else if (index === 1) { // Rose Curve
        // Rotate based on mid frequencies
        fractal.rotation.z -= 0.002 + midFreq * 0.008 * intensity;
        
        // Scale based on high frequencies
        const scaleFactor = 0.8 + highFreq * 0.2 * intensity;
        fractal.scale.lerp(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor), 0.1);
        
        // Use prime numbers to shift position slightly
        fractal.position.x = Math.sin(timeRef.current * 0.2) * 0.1 * (currentPrime % 5) * 0.01;
        fractal.position.y = Math.cos(timeRef.current * 0.3) * 0.1 * (currentPrime % 3) * 0.01;
      }
      else if (index === 2) { // Fractal Tree
        // Rotate slowly with subtle animation
        fractal.rotation.y += 0.001 + midFreq * 0.002 * intensity;
        
        // Subtle breathing motion
        const breatheScale = 0.6 + Math.sin(timeRef.current * 0.5) * 0.05 + bassFreq * 0.1;
        fractal.scale.set(breatheScale, breatheScale, breatheScale);
        
        // Prime number influence on position
        fractal.position.z = -0.5 + Math.sin(timeRef.current * 0.1) * (currentPrime % 11) * 0.01;
      }
      else if (index === 3) { // Particles
        // Rotate based on high frequencies
        fractal.rotation.y += 0.0005 + highFreq * 0.003 * intensity;
        fractal.rotation.x += 0.0003 + midFreq * 0.002 * intensity;
        
        // Pulse size on beat
        if (beatDetected) {
          const pointMaterial = fractal.children[0].material as THREE.PointsMaterial;
          pointMaterial.size = 0.08 + bassFreq * 0.1;
          pointMaterial.opacity = 0.7 + bassFreq * 0.3;
        }
      }
      
      // Apply prime modulation to all fractals
      if (audioDataAvailable && index < 3) {
        // Use prime numbers to create subtle modulation
        const modFactor = (currentPrime % 13) * 0.0001;
        fractal.rotation.z += modFactor;
        fractal.rotation.x += modFactor * 0.7;
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
