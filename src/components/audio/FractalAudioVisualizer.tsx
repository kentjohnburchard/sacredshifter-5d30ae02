
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { generatePrimeSequence, isPrime } from '@/utils/primeCalculations';

interface FractalAudioVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  isVisible: boolean;
  intensity?: number; // 0-1 controls the intensity of visualizations
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold' | 'green' | 'red';
  pauseWhenStopped?: boolean; // Whether to pause animation when audio is stopped
  chakra?: string; // Optional chakra association
  frequency?: number; // Optional frequency in Hz
  onPrimeSequence?: (primes: number[]) => void; // Callback to expose primes
  showEqualizer?: boolean; // Whether to show the equalizer
  onToggleEqualizer?: () => void; // Callback when equalizer is toggled
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isVisible,
  intensity = 1,
  colorScheme = 'purple',
  pauseWhenStopped = false,
  chakra,
  frequency,
  onPrimeSequence,
  showEqualizer = true,
  onToggleEqualizer
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const equalizerRef = useRef<HTMLCanvasElement>(null);
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
  const lastAudioDataRef = useRef<{ bass: number, mid: number, high: number }>({ bass: 0.1, mid: 0.1, high: 0.1 });
  const equalizerDataRef = useRef<Uint8Array | null>(null);
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  
  // Generate prime numbers sequence
  const primes = useMemo(() => {
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

  // Initialize prime sequence
  useEffect(() => {
    if (isVisible && onPrimeSequence) {
      const initialPrimes = primes.slice(0, 5);
      setActivePrimes(initialPrimes);
      onPrimeSequence(initialPrimes);
    }
  }, [isVisible, primes, onPrimeSequence]);

  // Update active primes periodically
  useEffect(() => {
    const updateActivePrimes = () => {
      if (!isVisible || !onPrimeSequence) return;

      const updatedPrimes = [
        primes[primeIndexRef.current % primes.length],
        primes[(primeIndexRef.current + 1) % primes.length],
        primes[(primeIndexRef.current + 2) % primes.length],
        primes[(primeIndexRef.current + 3) % primes.length],
        primes[(primeIndexRef.current + 4) % primes.length],
      ];
      setActivePrimes(updatedPrimes);
      onPrimeSequence(updatedPrimes);
    };

    const interval = setInterval(updateActivePrimes, 1000);
    return () => clearInterval(interval);
  }, [isVisible, primes, onPrimeSequence]);

  // Get appropriate color scheme based on chakra or selected color
  const getColorScheme = () => {
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

  // Get color based on frequency
  const getFrequencyColor = (freq: number) => {
    if (!freq) return null;
    
    if (freq >= 396 && freq < 417) return new THREE.Color(0xea384c);
    if (freq >= 417 && freq < 528) return new THREE.Color(0xf97316);
    if (freq >= 528 && freq < 639) return new THREE.Color(0xfacc15);
    if (freq >= 639 && freq < 741) return new THREE.Color(0x22c55e);
    if (freq >= 741 && freq < 852) return new THREE.Color(0x3b82f6);
    if (freq >= 852 && freq < 963) return new THREE.Color(0x6366f1);
    if (freq >= 963) return new THREE.Color(0x8b5cf6);
    
    return null;
  };

  // Set up Three.js scene
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    
    console.log("FractalVisualizer: Initializing Three.js scene");
    visualizerActiveRef.current = true;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup with appropriate field of view for immersion
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    camera.position.z = 10;
    cameraRef.current = camera;
    
    // Create WebGL renderer with anti-aliasing for smooth edges
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    // Set pixel ratio for sharper rendering on high-DPI displays
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    
    // Make renderer fill entire container
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    // Append renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Apply styles to make the container fill available space
    if (containerRef.current) {
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '100%';
      containerRef.current.style.position = 'absolute';
      containerRef.current.style.top = '0';
      containerRef.current.style.left = '0';
      containerRef.current.style.right = '0';
      containerRef.current.style.bottom = '0';
      containerRef.current.style.overflow = 'hidden';
      containerRef.current.style.zIndex = '10';
    }
    
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const colors = getColorScheme();
    
    // Create dynamic point lights for a richer look
    const pointLight1 = new THREE.PointLight(colors.accent, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(colors.highlight, 2);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Create a subtle point light for additional depth
    const pointLight3 = new THREE.PointLight(colors.primary, 1.5);
    pointLight3.position.set(0, 0, 8);
    scene.add(pointLight3);
    
    // Set up audio analyzer
    if (analyser) {
      console.log("FractalVisualizer: Analyzer available, creating data buffer");
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      equalizerDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    } else {
      console.log("FractalVisualizer: No analyzer provided");
    }
    
    // Create fractal objects
    createFractals();
    
    // Handle window resizing
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const width = containerRef.current.clientWidth || window.innerWidth;
      const height = containerRef.current.clientHeight || window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation loop if visible
    if (isVisible) {
      animate();
    }
    
    // Cleanup function
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
      
      // Dispose of all geometries and materials to prevent memory leaks
      geometriesRef.current.forEach(geometry => {
        geometry.dispose();
      });
      
      materialsRef.current.forEach(material => {
        material.dispose();
      });
      
      // Remove objects from scene
      if (sceneRef.current) {
        fractalsRef.current.forEach(obj => {
          sceneRef.current?.remove(obj);
        });
      }
      
      console.log("FractalVisualizer: Cleanup complete");
    };
  }, [isVisible, colorScheme, chakra]);

  // Render the equalizer
  useEffect(() => {
    if (!isVisible || !showEqualizer || !equalizerRef.current || !analyser) return;

    const canvas = equalizerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeEqualizer = () => {
      if (!canvas || !containerRef.current) return;
      
      canvas.width = containerRef.current.clientWidth;
      canvas.height = 100; // Fixed height for equalizer
    };

    resizeEqualizer();
    window.addEventListener('resize', resizeEqualizer);

    // Create the data array for the equalizer if it doesn't exist
    if (!equalizerDataRef.current) {
      equalizerDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    // Function to draw equalizer
    const drawEqualizer = () => {
      if (!ctx || !canvas || !analyser || !equalizerDataRef.current) return;
      
      // Get frequency data
      analyser.getByteFrequencyData(equalizerDataRef.current);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up variables
      const bufferLength = 64; // Use a fixed number of bars for better performance
      const barWidth = (canvas.width / bufferLength) * 0.8; // 80% width to leave space between bars
      const barSpacing = (canvas.width / bufferLength) * 0.2; // 20% spacing
      
      // Get colors based on selected color scheme
      const colors = getColorScheme();
      const primaryColor = `rgb(${Math.floor(colors.primary.r * 255)}, ${Math.floor(colors.primary.g * 255)}, ${Math.floor(colors.primary.b * 255)})`;
      const accentColor = `rgb(${Math.floor(colors.accent.r * 255)}, ${Math.floor(colors.accent.g * 255)}, ${Math.floor(colors.accent.b * 255)})`;
      const highlightColor = `rgb(${Math.floor(colors.highlight.r * 255)}, ${Math.floor(colors.highlight.g * 255)}, ${Math.floor(colors.highlight.b * 255)})`;
      
      // Draw bars
      for (let i = 0; i < bufferLength; i++) {
        const dataIndex = Math.floor((i / bufferLength) * equalizerDataRef.current.length);
        const value = equalizerDataRef.current[dataIndex];
        const barHeight = (value / 255) * canvas.height * 0.9; // 90% of canvas height
        
        const x = i * (barWidth + barSpacing);
        const y = canvas.height - barHeight;
        
        // Check if this bar index is a prime number (add special effects)
        const isPrimeBar = isPrime(i + 1); // +1 because we want to start from 1, not 0
        
        if (isPrimeBar) {
          // Prime number bars get special treatment
          
          // Add glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = highlightColor;
          
          // Create gradient for prime bars
          const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
          gradient.addColorStop(0, highlightColor);
          gradient.addColorStop(1, accentColor);
          
          ctx.fillStyle = gradient;
          
          // Draw bar with rounded top
          ctx.beginPath();
          ctx.moveTo(x, canvas.height);
          ctx.lineTo(x, y + 5);
          ctx.arc(x + barWidth / 2, y + 5, barWidth / 2, Math.PI, 0, true);
          ctx.lineTo(x + barWidth, canvas.height);
          ctx.fill();
          
          // Add the prime number as text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '8px Arial';
          ctx.fillText((i + 1).toString(), x + barWidth / 2 - 3, canvas.height - 5);
          
          // Reset shadow for non-prime bars
          ctx.shadowBlur = 0;
        } else {
          // Regular bars
          const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
    };

    // Animation loop for equalizer
    const animateEqualizer = () => {
      if (!isVisible || !showEqualizer) return;
      
      drawEqualizer();
      requestAnimationFrame(animateEqualizer);
    };

    animateEqualizer();

    return () => {
      window.removeEventListener('resize', resizeEqualizer);
    };
  }, [isVisible, showEqualizer, analyser]);
  
  // Create fractal objects with enhanced geometry and materials
  const createFractals = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const colors = getColorScheme();
    
    // Clean up existing objects
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
    
    // Use frequency to modify colors if available
    if (frequency) {
      const freqColor = getFrequencyColor(frequency);
      if (freqColor) {
        colors.primary = freqColor;
        colors.accent = freqColor.clone().multiplyScalar(1.2);
        colors.highlight = freqColor.clone().multiplyScalar(1.4);
      }
    }
    
    // Create a flowing spiral based on prime numbers
    const createFlowingSpiral = () => {
      const spiralGroup = new THREE.Group();
      
      // Create a much smoother curve with more points
      const curvePoints = [];
      const segmentCount = 500; // Increased for smoothness
      
      for (let i = 0; i < segmentCount; i++) {
        const prime = primes[i % primes.length];
        const theta = i * 0.04 * Math.PI;
        
        // Golden spiral inspired formula
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        const radius = 0.02 * Math.pow(phi, i * 0.02) * (1 + Math.sin(i * 0.05) * 0.1);
        
        const x = Math.cos(theta) * radius * (1 + Math.sin(prime * 0.01) * 0.05);
        const y = Math.sin(theta) * radius * (1 + Math.cos(prime * 0.01) * 0.05);
        const z = Math.sin(i * 0.01) * 0.1; // Subtle depth variation
        
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
      
      // Create a smooth curve through the points
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      curve.tension = 0.2; // Lower tension for smoother curves
      
      // Create a tube geometry with more radial segments for smoothness
      const tubeGeometry = new THREE.TubeGeometry(curve, 400, 0.03, 12, false);
      geometriesRef.current.push(tubeGeometry);
      
      // Create a glossy material with bloom potential
      const tubeMaterial = new THREE.MeshPhysicalMaterial({
        color: colors.primary,
        emissive: colors.accent,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        side: THREE.DoubleSide
      });
      materialsRef.current.push(tubeMaterial);
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      spiralGroup.add(tube);
      
      // Add glow particles along the spiral
      const particlesCount = 300;
      const particlesMaterial = new THREE.PointsMaterial({
        color: colors.highlight,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      materialsRef.current.push(particlesMaterial);
      
      const particlesGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount; i++) {
        const curvePoint = curve.getPoint(i / particlesCount);
        particlePositions[i * 3] = curvePoint.x;
        particlePositions[i * 3 + 1] = curvePoint.y;
        particlePositions[i * 3 + 2] = curvePoint.z;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      geometriesRef.current.push(particlesGeometry);
      
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      spiralGroup.add(particles);
      
      return spiralGroup;
    };
    
    // Create a flower of life pattern with smoother circles
    const createFlowerOfLifePattern = () => {
      const flowerGroup = new THREE.Group();
      const circleRadius = 0.25; // Larger radius
      const circleDetail = 64; // Much higher detail for smoother circles
      
      const createCircleAt = (x: number, y: number, z: number, primeIndex: number) => {
        const prime = primes[primeIndex % primes.length];
        const variationFactor = (prime % 7) * 0.02; // Subtle variation
        
        // Use TorusGeometry for smoother rings
        const circleGeometry = new THREE.TorusGeometry(
          circleRadius * (1 + variationFactor), 
          0.01, // Thinner tube for elegance
          16, // Tube segments
          circleDetail // Radial segments
        );
        geometriesRef.current.push(circleGeometry);
        
        // Use physically-based material for better light interaction
        const circleMaterial = new THREE.MeshPhysicalMaterial({
          color: colors.accent,
          emissive: colors.highlight,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.7,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
        materialsRef.current.push(circleMaterial);
        
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(x, y, z);
        flowerGroup.add(circle);
      };
      
      // Create center circle
      createCircleAt(0, 0, 0, 0);
      
      // First ring - 6 circles
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius * 2;
        const y = Math.sin(angle) * circleRadius * 2;
        createCircleAt(x, y, 0, i + 1);
      }
      
      // Second ring - 12 circles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius * 4;
        const y = Math.sin(angle) * circleRadius * 4;
        createCircleAt(x, y, 0, i + 7);
      }
      
      // Add connecting lines between circles for structure
      const createConnectingLine = (x1: number, y1: number, x2: number, y2: number) => {
        const points = [];
        points.push(new THREE.Vector3(x1, y1, 0));
        points.push(new THREE.Vector3(x2, y2, 0));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        geometriesRef.current.push(lineGeometry);
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: colors.primary,
          transparent: true,
          opacity: 0.3
        });
        materialsRef.current.push(lineMaterial);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        flowerGroup.add(line);
      };
      
      // Connect center to first ring
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius * 2;
        const y = Math.sin(angle) * circleRadius * 2;
        createConnectingLine(0, 0, x, y);
      }
      
      return flowerGroup;
    };
    
    // Create a mandala-like pattern with flowing petals
    const createMandala = () => {
      const mandalaGroup = new THREE.Group();
      
      const petalCount = 18; // More petals for detail
      
      // Create petals in a circular arrangement
      for (let i = 0; i < petalCount; i++) {
        const primeIndex = i % primes.length;
        const prime = primes[primeIndex];
        const nextPrime = primes[(primeIndex + 1) % primes.length];
        
        const startAngle = (i / petalCount) * Math.PI * 2;
        const endAngle = ((i + 1) / petalCount) * Math.PI * 2;
        
        const curvePoints = [];
        const segments = 30;
        
        // Create a more complex petal shape
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const angle = startAngle * (1 - t) + endAngle * t;
          
          // Base radius modulated by prime number
          const baseRadius = 0.7 + ((prime % 11) * 0.02);
          
          // Shape the petal with a sine curve
          const radiusFactor = Math.sin(t * Math.PI) * 0.8 + 0.2;
          const radius = baseRadius * radiusFactor;
          
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          // Create depth variations using prime numbers
          const depthFactor = Math.sin(t * Math.PI * 2) * ((nextPrime % 7) * 0.01);
          const z = depthFactor;
          
          curvePoints.push(new THREE.Vector3(x, y, z));
        }
        
        // Create a smooth curve through points
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        curve.tension = 0.3;
        
        // Create a tube with varying thickness
        const thickness = 0.02 + (prime % 7) * 0.003;
        const tubeGeometry = new THREE.TubeGeometry(curve, 48, thickness, 8, false);
        geometriesRef.current.push(tubeGeometry);
        
        // Alternate colors for visual interest
        const colorIndex = i % 3;
        let tubeMaterial;
        
        if (colorIndex === 0) {
          tubeMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.primary,
            emissive: colors.primary.clone().multiplyScalar(0.5),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.6,
            side: THREE.DoubleSide
          });
        } else if (colorIndex === 1) {
          tubeMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.accent,
            emissive: colors.accent.clone().multiplyScalar(0.5),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.6,
            side: THREE.DoubleSide
          });
        } else {
          tubeMaterial = new THREE.MeshPhysicalMaterial({
            color: colors.highlight,
            emissive: colors.highlight.clone().multiplyScalar(0.5),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.6,
            side: THREE.DoubleSide
          });
        }
        
        materialsRef.current.push(tubeMaterial);
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        mandalaGroup.add(tube);
      }
      
      return mandalaGroup;
    };
    
    // Create particles for additional visual interest and depth
    const createAmbientParticles = () => {
      const particleGroup = new THREE.Group();
      const particleCount = 500;
      
      // Create a geometry with individual particle positions
      const particlesGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      const particleColors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const prime = primes[i % primes.length];
        
        // Distribute particles in a spherical volume
        const radius = 5 + (prime % 11) * 0.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi) * 0.5; // Flatten slightly
        
        // Vary particle sizes
        particleSizes[i] = 0.05 + Math.random() * 0.15;
        
        // Assign colors from the color scheme
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
      
      // Create a point material with custom point size and texture
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      materialsRef.current.push(particleMaterial);
      
      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      particleGroup.add(particles);
      
      return particleGroup;
    };
    
    // Create and add all fractal elements
    const spiral = createFlowingSpiral();
    const flower = createFlowerOfLifePattern();
    const mandala = createMandala();
    const particles = createAmbientParticles();
    
    // Position elements for depth and layering
    spiral.position.set(0, 0, 0.5);
    flower.position.set(0, 0, -0.5);
    mandala.position.set(0, 0, 0);
    particles.position.set(0, 0, -2);
    
    // Add elements to scene
    scene.add(spiral);
    scene.add(flower);
    scene.add(mandala);
    scene.add(particles);
    
    // Store references for animation
    fractalsRef.current = [spiral, flower, mandala, particles];
  };
  
  // Enhanced beat detection with frequency analysis
  const analyzeAudio = (dataArray: Uint8Array): { 
    bassEnergy: number, 
    midEnergy: number, 
    highEnergy: number, 
    beatDetected: boolean 
  } => {
    // Frequency ranges (approximate)
    const bassRange = [0, 10];   // Low frequencies
    const midRange = [10, 30];   // Mid frequencies
    const highRange = [30, 50];  // High frequencies
    
    // Calculate energy in each frequency range
    let bassSum = 0;
    for (let i = bassRange[0]; i < Math.min(bassRange[1], dataArray.length); i++) {
      bassSum += dataArray[i];
    }
    const bassAvg = bassSum / (bassRange[1] - bassRange[0]);
    const bassEnergy = bassAvg / 255; // Normalize to 0-1
    
    let midSum = 0;
    for (let i = midRange[0]; i < Math.min(midRange[1], dataArray.length); i++) {
      midSum += dataArray[i];
    }
    const midAvg = midSum / (midRange[1] - midRange[0]);
    const midEnergy = midAvg / 255; // Normalize to 0-1
    
    let highSum = 0;
    for (let i = highRange[0]; i < Math.min(highRange[1], dataArray.length); i++) {
      highSum += dataArray[i];
    }
    const highAvg = highSum / (highRange[1] - highRange[0]);
    const highEnergy = highAvg / 255; // Normalize to 0-1
    
    // Beat detection (bass threshold adjusted for better sensitivity)
    const beatThreshold = 0.6;
    const beatDetected = bassEnergy > beatThreshold;
    
    return { bassEnergy, midEnergy, highEnergy, beatDetected };
  };
  
  // Animation loop with audio reactivity
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !visualizerActiveRef.current) return;
    
    timeRef.current += 0.005; // Slower time progression for more graceful movement
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Default values if no audio data
    let audioAnalysis = {
      bassEnergy: 0.1,
      midEnergy: 0.1,
      highEnergy: 0.1,
      beatDetected: false
    };
    
    // Get audio data if available
    if (analyser && dataArrayRef.current) {
      analyser.getByteFrequencyData(dataArrayRef.current);
      audioAnalysis = analyzeAudio(dataArrayRef.current);
      
      // Track beat detection
      if (audioAnalysis.beatDetected && !beatDetectedRef.current) {
        beatDetectedRef.current = true;
        primeIndexRef.current = (primeIndexRef.current + 1) % primes.length;
        
        // Update prime sequence on beat
        if (onPrimeSequence) {
          const currentPrimes = [
            primes[primeIndexRef.current % primes.length],
            primes[(primeIndexRef.current + 1) % primes.length],
            primes[(primeIndexRef.current + 2) % primes.length],
            primes[(primeIndexRef.current + 3) % primes.length],
            primes[(primeIndexRef.current + 4) % primes.length],
          ];
          setActivePrimes(currentPrimes);
          onPrimeSequence(currentPrimes);
        }
      } else if (!audioAnalysis.beatDetected && beatDetectedRef.current) {
        beatDetectedRef.current = false;
      }
    }
    
    // Apply lerp (linear interpolation) for smooth transitions
    const lerpFactor = 0.1; // Lower for smoother transitions
    
    lastAudioDataRef.current = {
      bass: lastAudioDataRef.current.bass + (audioAnalysis.bassEnergy - lastAudioDataRef.current.bass) * lerpFactor,
      mid: lastAudioDataRef.current.mid + (audioAnalysis.midEnergy - lastAudioDataRef.current.mid) * lerpFactor,
      high: lastAudioDataRef.current.high + (audioAnalysis.highEnergy - lastAudioDataRef.current.high) * lerpFactor
    };
    
    // Use smoothed audio data for animations
    const { bass, mid, high } = lastAudioDataRef.current;
    
    // Get current prime for additional modulation
    const currentPrime = primes[primeIndexRef.current % primes.length];
    const primeModulation = (currentPrime % 13) * 0.001; // Very subtle modulation
    
    // Animate each fractal element
    fractalsRef.current.forEach((fractal, index) => {
      // Spiral animation (index 0)
      if (index === 0) {
        // Base rotation speed with audio reactivity
        fractal.rotation.z += 0.001 + (bass * 0.01 * intensity);
        
        // Subtle undulation
        fractal.rotation.x = Math.sin(timeRef.current * 0.2) * 0.1 * mid;
        
        // Beat reaction
        if (audioAnalysis.beatDetected) {
          // Pulse on beat
          fractal.scale.set(
            1 + bass * 0.3 * intensity,
            1 + bass * 0.3 * intensity,
            1 + bass * 0.3 * intensity
          );
        } else {
          // Smoothly return to original scale
          fractal.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
        }
        
        // Add prime number based rotation
        fractal.rotation.y += 0.0003 * (currentPrime % 7);
      }
      // Flower of Life animation (index 1)
      else if (index === 1) {
        // Counter-rotate for interesting effect
        fractal.rotation.z -= 0.001 + (mid * 0.005 * intensity);
        
        // Scale with high frequencies
        const targetScale = 0.7 + high * 0.4 * intensity;
        fractal.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale), 
          0.05
        );
        
        // Gentle undulation
        fractal.position.x = Math.sin(timeRef.current * 0.15) * 0.1 * (currentPrime % 5) * 0.02;
        fractal.position.y = Math.cos(timeRef.current * 0.2) * 0.1 * (currentPrime % 3) * 0.02;
      }
      // Mandala animation (index 2)
      else if (index === 2) {
        // Slow rotation
        fractal.rotation.y += 0.0005 + (mid * 0.001 * intensity);
        
        // "Breathing" effect
        const breatheScale = 0.6 + Math.sin(timeRef.current * 0.3) * 0.05 + (bass * 0.2);
        fractal.scale.set(breatheScale, breatheScale, breatheScale);
        
        // Z-position variation for depth
        fractal.position.z = Math.sin(timeRef.current * 0.1) * (currentPrime % 11) * 0.01;
      }
      // Particle cloud animation (index 3)
      else if (index === 3) {
        // Very slow rotation
        fractal.rotation.y += 0.0002 + (high * 0.001 * intensity);
        fractal.rotation.x += 0.0001 + (mid * 0.001 * intensity);
        
        // Change particle size and opacity on beat
        if (audioAnalysis.beatDetected) {
          const particles = fractal.children[0];
          if (particles instanceof THREE.Points) {
            const material = particles.material as THREE.PointsMaterial;
            // Pulse particle size with bass
            material.size = 0.1 + bass * 0.2;
            // Increase opacity with beat
            material.opacity = 0.5 + bass * 0.5;
          }
        }
      }
      
      // Add subtle prime-number-based modulation to all objects
      fractal.rotation.z += primeModulation;
      fractal.rotation.x += primeModulation * 0.7;
    });
    
    // Render the scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  // Toggle equalizer visibility
  const handleToggleEqualizer = () => {
    if (onToggleEqualizer) {
      onToggleEqualizer();
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main fractal visualizer */}
      <div 
        ref={containerRef} 
        className="fixed inset-0 pointer-events-none w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden'
        }}
      />

      {/* Equalizer at the bottom */}
      {showEqualizer && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <canvas 
            ref={equalizerRef} 
            className="w-full h-full"
            style={{ position: 'absolute', bottom: 0 }}
          ></canvas>
        </motion.div>
      )}

      {/* Sacred Toggle Symbol */}
      <motion.div 
        className="absolute top-4 right-4 z-30 cursor-pointer pointer-events-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleEqualizer}
      >
        <div className="relative group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-radial from-indigo-400 via-purple-500 to-fuchsia-600 shadow-lg ${showEqualizer ? 'animate-spin-slow' : ''}`}>
            {/* Flower of Life design for toggle */}
            <svg width="32" height="32" viewBox="0 0 100 100" className="text-white">
              <circle cx="50" cy="50" r="8" fill="white" className="animate-pulse-slow" />
              {/* Inner ring */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <circle
                  key={`inner-${i}`}
                  cx={50 + Math.cos(angle * Math.PI / 180) * 16}
                  cy={50 + Math.sin(angle * Math.PI / 180) * 16}
                  r="6"
                  fill="rgba(255,255,255,0.8)"
                  className={isPrime(i + 1) ? 'animate-pulse-slow' : ''}
                />
              ))}
              {/* Outer ring */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <circle
                  key={`outer-${i}`}
                  cx={50 + Math.cos(angle * Math.PI / 180) * 30}
                  cy={50 + Math.sin(angle * Math.PI / 180) * 30}
                  r="4"
                  fill="rgba(255,255,255,0.6)"
                  className={isPrime(i + 1) ? 'animate-pulse-slow' : ''}
                />
              ))}
            </svg>
          </div>
          {/* Ripple effect when active */}
          {showEqualizer && (
            <div className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ripple"></div>
          )}
          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            {showEqualizer ? "Hide Equalizer" : "Show Equalizer"}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FractalAudioVisualizer;
