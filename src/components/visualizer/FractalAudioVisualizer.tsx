
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { isPrime } from '@/lib/mathUtils';

interface FractalAudioVisualizerProps {
  audioAnalyser?: AnalyserNode | null;
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  chakra?: string;
  frequency?: number;
  onPrimeDetected?: (prime: number) => void;
  onFrequencyDataAvailable?: (frequency: number) => void;
  isPlaying?: boolean;
  audioData?: Uint8Array | null;
  liftedVeil?: boolean;
  visualizerMode?: 'cosmic-ocean' | 'fractal-flow' | 'flower-of-life' | 'merkaba' | 'vesica-piscis' | 'sri-yantra';
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioAnalyser,
  colorScheme = 'purple',
  chakra,
  frequency,
  onPrimeDetected,
  onFrequencyDataAvailable,
  isPlaying = false,
  audioData = null,
  liftedVeil = false,
  visualizerMode = 'cosmic-ocean'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const lastPrimeRef = useRef<number | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.Material | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const primeDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [geometryType, setGeometryType] = useState<string>(visualizerMode);
  const [primesFound, setPrimesFound] = useState<number[]>([]);
  const [glowIntensity, setGlowIntensity] = useState<number>(0.5);
  const [isPrimeActive, setIsPrimeActive] = useState<boolean>(false);

  // Effect to handle changes in visualizerMode
  useEffect(() => {
    setGeometryType(visualizerMode);
    
    // Only reset the scene when mode changes to prevent flickering
    if (sceneRef.current && groupRef.current) {
      sceneRef.current.remove(groupRef.current);
      createGeometry();
    }
  }, [visualizerMode]);

  // Convert chakra name to color
  const getChakraColor = useMemo(() => {
    if (liftedVeil) {
      return {
        baseColor: new THREE.Color(0xec4899),
        accentColor: new THREE.Color(0xfb7185),
        emissiveColor: new THREE.Color(0xf472b6)
      };
    }
    
    if (!chakra) {
      // Default purple theme
      return {
        baseColor: new THREE.Color(0x8b5cf6),
        accentColor: new THREE.Color(0xa78bfa),
        emissiveColor: new THREE.Color(0x7c3aed)
      };
    }
    
    // Chakra-based colors
    switch (chakra.toLowerCase()) {
      case 'root':
        return {
          baseColor: new THREE.Color(0xef4444),
          accentColor: new THREE.Color(0xfca5a5),
          emissiveColor: new THREE.Color(0xdc2626)
        };
      case 'sacral':
        return {
          baseColor: new THREE.Color(0xf97316),
          accentColor: new THREE.Color(0xfdba74),
          emissiveColor: new THREE.Color(0xea580c)
        };
      case 'solar plexus':
        return {
          baseColor: new THREE.Color(0xfacc15),
          accentColor: new THREE.Color(0xfef08a),
          emissiveColor: new THREE.Color(0xeab308)
        };
      case 'heart':
        return {
          baseColor: new THREE.Color(0x22c55e),
          accentColor: new THREE.Color(0x86efac),
          emissiveColor: new THREE.Color(0x16a34a)
        };
      case 'throat':
        return {
          baseColor: new THREE.Color(0x3b82f6),
          accentColor: new THREE.Color(0x93c5fd),
          emissiveColor: new THREE.Color(0x2563eb)
        };
      case 'third eye':
        return {
          baseColor: new THREE.Color(0x6366f1),
          accentColor: new THREE.Color(0xa5b4fc),
          emissiveColor: new THREE.Color(0x4f46e5)
        };
      case 'crown':
        return {
          baseColor: new THREE.Color(0x8b5cf6),
          accentColor: new THREE.Color(0xc4b5fd),
          emissiveColor: new THREE.Color(0x7c3aed)
        };
      default:
        // Default purple theme
        return {
          baseColor: new THREE.Color(0x8b5cf6),
          accentColor: new THREE.Color(0xa78bfa),
          emissiveColor: new THREE.Color(0x7c3aed)
        };
    }
  }, [chakra, liftedVeil]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);
    
    // Add colored point lights
    const pointLight1 = new THREE.PointLight(getChakraColor.baseColor, 1, 100);
    pointLight1.position.set(0, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(getChakraColor.accentColor, 0.6, 100);
    pointLight2.position.set(5, -5, 0);
    scene.add(pointLight2);
    
    // Add back light for better definition
    const backLight = new THREE.PointLight(0xffffff, 0.5, 100);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Create the initial geometry
    createGeometry();
    
    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && cameraRef.current && rendererRef.current) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      timeRef.current += 0.01;
      
      if (groupRef.current && isPlaying) {
        updateGeometryWithAudio();
        
        // Base rotation regardless of audio
        groupRef.current.rotation.x += 0.002;
        groupRef.current.rotation.y += 0.003;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (primeDetectionTimeoutRef.current) {
        clearTimeout(primeDetectionTimeoutRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        disposeScene(sceneRef.current);
      }
      
      if (groupRef.current) {
        disposeObject(groupRef.current);
      }
    };
  }, []);

  // Main function to create the appropriate geometry based on mode
  const createGeometry = () => {
    if (!sceneRef.current) return;
    
    // Clean up existing geometry
    if (groupRef.current) {
      sceneRef.current.remove(groupRef.current);
      disposeObject(groupRef.current);
    }
    
    // Create a new group to hold all elements
    const group = new THREE.Group();
    groupRef.current = group;
    
    // Base material properties
    const materialOptions: THREE.MeshPhongMaterialParameters = {
      color: getChakraColor.baseColor,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 0.5,
      specular: 0xffffff,
      shininess: 50,
      transparent: true,
      opacity: 0.85,
      wireframe: geometryType === 'fractal-flow'
    };
    
    let geometry: THREE.BufferGeometry;
    
    switch (geometryType) {
      case 'cosmic-ocean':
        createCosmicOceanGeometry(group, materialOptions);
        break;
      
      case 'flower-of-life':
        createFlowerOfLifeGeometry(group, materialOptions);
        break;
        
      case 'merkaba':
        createMerkabaGeometry(group, materialOptions);
        break;
      
      case 'vesica-piscis':
        createVesicaPiscisGeometry(group, materialOptions);
        break;
        
      case 'sri-yantra':
        createSriYantraGeometry(group, materialOptions);
        break;
      
      case 'fractal-flow':
      default:
        createFractalFlowGeometry(group, materialOptions);
        break;
    }
    
    // Add the group to the scene
    sceneRef.current.add(group);
  };
  
  // Cosmic Ocean - Torus with particle system and smooth waves
  const createCosmicOceanGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    // Main torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 32, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      wireframe: false,
      side: THREE.DoubleSide
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    group.add(torus);
    
    // Add wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: getChakraColor.accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframeTorus = new THREE.Mesh(torusGeometry, wireframeMaterial);
    torus.add(wireframeTorus);
    
    // Inner sphere
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      opacity: 0.6,
      wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    // Particle system
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 2;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: getChakraColor.accentColor,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particles);
  };
  
  // Flower of Life - Overlapping circles in sacred pattern
  const createFlowerOfLifeGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    // Center circle
    const circleGeometry = new THREE.CircleGeometry(1, 32);
    const circleMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      side: THREE.DoubleSide,
      wireframe: false,
      opacity: 0.7
    });
    
    // Create the pattern of overlapping circles
    const centerCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    centerCircle.rotation.x = Math.PI / 2;
    group.add(centerCircle);
    
    // Create 6 surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(x, y, 0);
      circle.rotation.x = Math.PI / 2;
      group.add(circle);
    }
    
    // Create outer ring of 12 circles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(x, y, 0);
      circle.rotation.x = Math.PI / 2;
      circle.scale.setScalar(0.85);
      group.add(circle);
    }
    
    // Add connecting lines
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: getChakraColor.accentColor,
      transparent: true,
      opacity: 0.4
    });
    
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    
    // Connect center to first ring
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      
      linePositions.push(0, 0, 0);
      linePositions.push(x, y, 0);
    }
    
    // Connect points on first ring
    for (let i = 0; i < 6; i++) {
      const angle1 = (i / 6) * Math.PI * 2;
      const angle2 = ((i + 1) % 6 / 6) * Math.PI * 2;
      
      const x1 = Math.cos(angle1);
      const y1 = Math.sin(angle1);
      const x2 = Math.cos(angle2);
      const y2 = Math.sin(angle2);
      
      linePositions.push(x1, y1, 0);
      linePositions.push(x2, y2, 0);
    }
    
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    group.add(lines);
    
    // Add central glowing sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: getChakraColor.accentColor,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.8
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
  };
  
  // Merkaba - Star tetrahedron (two interlocking tetrahedra)
  const createMerkabaGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    // Create two tetrahedra
    const tetraGeometry = new THREE.TetrahedronGeometry(1.5);
    
    const tetraMaterial1 = new THREE.MeshPhongMaterial({
      ...materialOptions,
      wireframe: true,
      opacity: 0.7
    });
    
    const tetraMaterial2 = new THREE.MeshPhongMaterial({
      ...materialOptions,
      wireframe: true,
      color: getChakraColor.accentColor,
      opacity: 0.7
    });
    
    const tetra1 = new THREE.Mesh(tetraGeometry, tetraMaterial1);
    const tetra2 = new THREE.Mesh(tetraGeometry, tetraMaterial2);
    
    tetra2.rotation.z = Math.PI;
    tetra2.scale.set(0.9, 0.9, 0.9);
    
    group.add(tetra1);
    group.add(tetra2);
    
    // Add inner sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: getChakraColor.emissiveColor,
      transparent: true,
      opacity: 0.6,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 0.8
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    // Add outer ring
    const ringGeometry = new THREE.RingGeometry(2.4, 2.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: getChakraColor.accentColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  };
  
  // Vesica Piscis - Two overlapping circles
  const createVesicaPiscisGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    const offset = 0.5; // How much the circles overlap
    
    // Create two overlapping circles
    const circleGeometry = new THREE.CircleGeometry(1, 64);
    const circleMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      side: THREE.DoubleSide,
      wireframe: false
    });
    
    const circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
    circle1.position.x = -offset;
    circle1.rotation.y = Math.PI / 2;
    group.add(circle1);
    
    const circle2 = new THREE.Mesh(circleGeometry, circleMaterial);
    circle2.position.x = offset;
    circle2.rotation.y = Math.PI / 2;
    group.add(circle2);
    
    // Add wireframes
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: getChakraColor.accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    
    const wireframe1 = new THREE.Mesh(circleGeometry, wireframeMaterial);
    wireframe1.position.copy(circle1.position);
    wireframe1.rotation.copy(circle1.rotation);
    group.add(wireframe1);
    
    const wireframe2 = new THREE.Mesh(circleGeometry, wireframeMaterial);
    wireframe2.position.copy(circle2.position);
    wireframe2.rotation.copy(circle2.rotation);
    group.add(wireframe2);
    
    // Add connecting lines for vesica piscis shape
    const lensPoints = [];
    const resolution = 50;
    const radius = 1;
    
    for (let i = 0; i <= resolution; i++) {
      const theta = (i / resolution) * Math.PI - Math.PI/2;
      const x = -offset + radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      lensPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    for (let i = 0; i <= resolution; i++) {
      const theta = Math.PI - (i / resolution) * Math.PI - Math.PI/2;
      const x = offset + radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      lensPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const lensGeometry = new THREE.BufferGeometry().setFromPoints(lensPoints);
    const lensMaterial = new THREE.LineBasicMaterial({
      color: getChakraColor.emissiveColor,
      transparent: true,
      opacity: 0.8
    });
    
    const lens = new THREE.LineLoop(lensGeometry, lensMaterial);
    group.add(lens);
    
    // Add central point
    const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: getChakraColor.accentColor,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 1.0
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
  };
  
  // Sri Yantra - Sacred geometry with triangles
  const createSriYantraGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    // Create concentric triangles
    const triangleMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      side: THREE.DoubleSide,
      wireframe: true
    });
    
    // Create triangles pointing up and down
    for (let i = 0; i < 5; i++) {
      const size = 1.0 + i * 0.3;
      
      // Upward triangle
      const upGeometry = new THREE.BufferGeometry();
      const upVertices = new Float32Array([
        0, size, 0,
        -size * 0.866, -size * 0.5, 0,
        size * 0.866, -size * 0.5, 0
      ]);
      upGeometry.setAttribute('position', new THREE.BufferAttribute(upVertices, 3));
      const upTriangle = new THREE.Mesh(upGeometry, triangleMaterial);
      group.add(upTriangle);
      
      // Downward triangle
      const downGeometry = new THREE.BufferGeometry();
      const downVertices = new Float32Array([
        0, -size, 0,
        -size * 0.866, size * 0.5, 0,
        size * 0.866, size * 0.5, 0
      ]);
      downGeometry.setAttribute('position', new THREE.BufferAttribute(downVertices, 3));
      const downTriangle = new THREE.Mesh(downGeometry, triangleMaterial);
      group.add(downTriangle);
    }
    
    // Create outer circles
    for (let i = 0; i < 3; i++) {
      const radius = 2.0 + i * 0.2;
      const ringGeometry = new THREE.RingGeometry(radius, radius + 0.03, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: getChakraColor.accentColor,
        transparent: true,
        opacity: 0.4 - i * 0.1,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
    
    // Add central bindu point
    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: getChakraColor.accentColor,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 1.0
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
  };
  
  // Fractal Flow - Complex geometry with recursive patterns
  const createFractalFlowGeometry = (group: THREE.Group, materialOptions: THREE.MeshPhongMaterialParameters) => {
    // Base icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const icoMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      wireframe: true,
      opacity: 0.8
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    group.add(icosahedron);
    
    // Inner dodecahedron
    const dodecGeometry = new THREE.DodecahedronGeometry(1.0, 0);
    const dodecMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      color: getChakraColor.accentColor,
      wireframe: true,
      opacity: 0.6
    });
    const dodecahedron = new THREE.Mesh(dodecGeometry, dodecMaterial);
    group.add(dodecahedron);
    
    // Innermost octahedron
    const octGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const octMaterial = new THREE.MeshPhongMaterial({
      ...materialOptions,
      emissive: getChakraColor.emissiveColor,
      emissiveIntensity: 1.0,
      wireframe: false,
      opacity: 0.9
    });
    const octahedron = new THREE.Mesh(octGeometry, octMaterial);
    group.add(octahedron);
    
    // Add particles around the shapes
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.5 + Math.random() * 1.0;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: getChakraColor.accentColor,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particles);
  };
  
  // Process audio data and update the visualization
  const updateGeometryWithAudio = () => {
    if (!groupRef.current || !audioData) return;
    
    // Extract frequency data
    const bufferLength = audioData.length;
    
    // Calculate average levels for different frequency bands
    const bands = {
      bass: 0,      // 0-200 Hz
      midLow: 0,    // 200-800 Hz
      midHigh: 0,   // 800-2000 Hz
      treble: 0     // 2000+ Hz
    };
    
    const bassEnd = Math.floor(bufferLength * 0.1);
    const midLowEnd = Math.floor(bufferLength * 0.3);
    const midHighEnd = Math.floor(bufferLength * 0.6);
    
    let bassSum = 0, midLowSum = 0, midHighSum = 0, trebleSum = 0;
    let maxValue = 0, maxIndex = 0;
    
    // Calculate averages for each band
    for (let i = 0; i < bufferLength; i++) {
      const value = audioData[i] / 255; // Normalize to 0-1
      
      if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
      
      if (i < bassEnd) {
        bassSum += value;
      } else if (i < midLowEnd) {
        midLowSum += value;
      } else if (i < midHighEnd) {
        midHighSum += value;
      } else {
        trebleSum += value;
      }
    }
    
    bands.bass = bassSum / bassEnd;
    bands.midLow = midLowSum / (midLowEnd - bassEnd);
    bands.midHigh = midHighSum / (midHighEnd - midLowEnd);
    bands.treble = trebleSum / (bufferLength - midHighEnd);
    
    // Detect dominant frequency for prime number detection
    const dominantFrequency = Math.floor(maxIndex * (22050 / bufferLength));
    
    // Check for prime numbers at appropriate intervals
    if (dominantFrequency > 20) { // Only check audible frequencies
      if (onFrequencyDataAvailable) {
        onFrequencyDataAvailable(dominantFrequency);
      }
      
      if (isPrime(dominantFrequency) && 
          (!lastPrimeRef.current || dominantFrequency !== lastPrimeRef.current)) {
        lastPrimeRef.current = dominantFrequency;
        
        if (onPrimeDetected) {
          onPrimeDetected(dominantFrequency);
        }
        
        setIsPrimeActive(true);
        setGlowIntensity(1.5);
        
        // Clear existing timeout
        if (primeDetectionTimeoutRef.current) {
          clearTimeout(primeDetectionTimeoutRef.current);
        }
        
        // Set timeout to reset prime activation
        primeDetectionTimeoutRef.current = setTimeout(() => {
          setIsPrimeActive(false);
          setGlowIntensity(0.5);
        }, 3000);
      }
    }
    
    // Apply audio reactive effects based on visualization mode
    switch (geometryType) {
      case 'cosmic-ocean':
        applyCosmicOceanAudioEffects(bands);
        break;
        
      case 'flower-of-life':
        applyFlowerOfLifeAudioEffects(bands);
        break;
        
      case 'merkaba':
        applyMerkabaAudioEffects(bands);
        break;
        
      case 'vesica-piscis':
        applyVesicaPiscisAudioEffects(bands);
        break;
        
      case 'sri-yantra':
        applySriYantraAudioEffects(bands);
        break;
        
      case 'fractal-flow':
      default:
        applyFractalFlowAudioEffects(bands);
        break;
    }
    
    // Apply prime number effects if active
    if (isPrimeActive && groupRef.current) {
      groupRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 10) * 0.05);
      
      // Increase emissive intensity for all materials in the group
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
          if ('emissiveIntensity' in child.material) {
            child.material.emissiveIntensity = 1.0 + Math.sin(timeRef.current * 15) * 0.5;
          }
        }
      });
    }
  };
  
  // Apply audio effects for each geometry type
  const applyCosmicOceanAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    // Get the torus (first child) and sphere (second child)
    const torus = groupRef.current.children[0] as THREE.Mesh;
    const sphere = groupRef.current.children[2] as THREE.Mesh;
    const particles = groupRef.current.children[3] as THREE.Points;
    
    if (torus && torus instanceof THREE.Mesh) {
      // Scale the torus based on bass
      const bassScale = 1 + bands.bass * 0.5;
      torus.scale.set(bassScale, bassScale, bassScale);
      
      // Rotate based on mid frequencies
      torus.rotation.x += 0.01 * bands.midLow;
      torus.rotation.y += 0.01 * bands.midHigh;
    }
    
    if (sphere && sphere instanceof THREE.Mesh) {
      // Pulse the sphere based on treble
      const trebleScale = 1 + bands.treble * 0.8;
      sphere.scale.set(trebleScale, trebleScale, trebleScale);
    }
    
    if (particles && particles instanceof THREE.Points) {
      // Move particles based on overall volume
      const overallVolume = (bands.bass + bands.midLow + bands.midHigh + bands.treble) / 4;
      
      if ('material' in particles && particles.material instanceof THREE.PointsMaterial) {
        particles.material.size = 0.05 + overallVolume * 0.1;
      }
      
      // Rotate the particle system
      particles.rotation.y += 0.002 * (1 + bands.midHigh);
    }
  };
  
  const applyFlowerOfLifeAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    // Get circles
    const centerCircle = groupRef.current.children[0] as THREE.Mesh;
    const sphere = groupRef.current.children[groupRef.current.children.length - 1] as THREE.Mesh;
    
    // Scale all circles based on frequencies
    for (let i = 0; i < 7; i++) {  // Center + 6 surrounding
      const circle = groupRef.current.children[i] as THREE.Mesh;
      if (circle && circle instanceof THREE.Mesh) {
        const scale = 1 + bands.midLow * 0.3;
        circle.scale.set(scale, scale, 1);
      }
    }
    
    // Scale outer circles differently
    for (let i = 7; i < 19; i++) {  // 12 outer circles
      const circle = groupRef.current.children[i] as THREE.Mesh;
      if (circle && circle instanceof THREE.Mesh) {
        const scale = 0.85 + bands.midHigh * 0.3;
        circle.scale.set(scale, scale, 1);
      }
    }
    
    // Rotate the entire pattern
    groupRef.current.rotation.z += 0.005 * (1 + bands.bass * 2);
    
    // Pulse the center sphere
    if (sphere && sphere instanceof THREE.Mesh) {
      const trebleScale = 0.3 + bands.treble * 0.5;
      sphere.scale.set(trebleScale, trebleScale, trebleScale);
      
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.emissiveIntensity = 1 + bands.treble * 2;
      }
    }
  };
  
  const applyMerkabaAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    const tetra1 = groupRef.current.children[0] as THREE.Mesh;
    const tetra2 = groupRef.current.children[1] as THREE.Mesh;
    const sphere = groupRef.current.children[2] as THREE.Mesh;
    const ring = groupRef.current.children[3] as THREE.Mesh;
    
    // Adjust tetrahedron rotations
    if (tetra1 && tetra1 instanceof THREE.Mesh) {
      tetra1.rotation.x += 0.01 * bands.bass;
      tetra1.rotation.z += 0.01 * bands.midLow;
      
      const scale = 1 + bands.bass * 0.3;
      tetra1.scale.set(scale, scale, scale);
    }
    
    if (tetra2 && tetra2 instanceof THREE.Mesh) {
      tetra2.rotation.x -= 0.01 * bands.midHigh;
      tetra2.rotation.z -= 0.01 * bands.treble;
      
      const scale = 0.9 + bands.midHigh * 0.3;
      tetra2.scale.set(scale, scale, scale);
    }
    
    // Pulse center sphere
    if (sphere && sphere instanceof THREE.Mesh) {
      const pulseScale = 0.5 + bands.treble * 0.8;
      sphere.scale.set(pulseScale, pulseScale, pulseScale);
      
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.emissiveIntensity = 0.8 + bands.treble * 1.5;
      }
    }
    
    // Expand/contract outer ring
    if (ring && ring instanceof THREE.Mesh) {
      const overallVolume = (bands.bass + bands.midLow + bands.midHigh + bands.treble) / 4;
      ring.scale.set(1 + overallVolume * 0.2, 1 + overallVolume * 0.2, 1);
    }
  };
  
  const applyVesicaPiscisAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    const circle1 = groupRef.current.children[0] as THREE.Mesh;
    const circle2 = groupRef.current.children[1] as THREE.Mesh;
    const wireframe1 = groupRef.current.children[2] as THREE.Mesh;
    const wireframe2 = groupRef.current.children[3] as THREE.Mesh;
    const lens = groupRef.current.children[4] as THREE.LineLoop;
    const sphere = groupRef.current.children[5] as THREE.Mesh;
    
    // Adjust circle positions based on bass
    const posOffset = 0.5 + bands.bass * 0.3;
    
    if (circle1 && circle1 instanceof THREE.Mesh) {
      circle1.position.x = -posOffset;
      if (circle1.material instanceof THREE.MeshPhongMaterial) {
        circle1.material.opacity = 0.7 + bands.bass * 0.3;
      }
    }
    
    if (circle2 && circle2 instanceof THREE.Mesh) {
      circle2.position.x = posOffset;
      if (circle2.material instanceof THREE.MeshPhongMaterial) {
        circle2.material.opacity = 0.7 + bands.bass * 0.3;
      }
    }
    
    // Update wireframe positions to match circles
    if (wireframe1 && wireframe1 instanceof THREE.Mesh) {
      wireframe1.position.x = -posOffset;
    }
    
    if (wireframe2 && wireframe2 instanceof THREE.Mesh) {
      wireframe2.position.x = posOffset;
    }
    
    // Pulse center sphere based on treble
    if (sphere && sphere instanceof THREE.Mesh) {
      const sphereScale = 0.1 + bands.treble * 0.3;
      sphere.scale.set(sphereScale, sphereScale, sphereScale);
      
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.emissiveIntensity = 1 + bands.treble * 2;
      }
    }
    
    // Rotate entire structure based on mid frequencies
    groupRef.current.rotation.z += 0.01 * bands.midHigh;
    groupRef.current.rotation.y += 0.01 * bands.midLow;
  };
  
  const applySriYantraAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    // Scale triangles based on bass and mids
    for (let i = 0; i < 10; i++) {  // 5 upward + 5 downward triangles
      const triangle = groupRef.current.children[i] as THREE.Mesh;
      if (triangle && triangle instanceof THREE.Mesh) {
        let scale;
        if (i % 2 === 0) {  // Upward triangles
          scale = 1 + bands.bass * 0.3;
        } else {  // Downward triangles
          scale = 1 + bands.midLow * 0.3;
        }
        triangle.scale.set(scale, scale, scale);
      }
    }
    
    // Rotate the geometry based on mid-high frequencies
    groupRef.current.rotation.z += 0.01 * bands.midHigh;
    
    // Pulse the rings based on treble
    for (let i = 10; i < 13; i++) {  // 3 outer rings
      const ring = groupRef.current.children[i] as THREE.Mesh;
      if (ring && ring instanceof THREE.Mesh) {
        const scale = 1 + bands.treble * 0.2;
        ring.scale.set(scale, scale, 1);
      }
    }
    
    // Pulse the central bindu point
    const sphere = groupRef.current.children[13] as THREE.Mesh;
    if (sphere && sphere instanceof THREE.Mesh) {
      const sphereScale = 0.15 + bands.treble * 0.3;
      sphere.scale.set(sphereScale, sphereScale, sphereScale);
      
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.emissiveIntensity = 1 + bands.treble * 2;
      }
    }
  };
  
  const applyFractalFlowAudioEffects = (bands: { bass: number; midLow: number; midHigh: number; treble: number; }) => {
    if (!groupRef.current) return;
    
    const icosahedron = groupRef.current.children[0] as THREE.Mesh;
    const dodecahedron = groupRef.current.children[1] as THREE.Mesh;
    const octahedron = groupRef.current.children[2] as THREE.Mesh;
    const particles = groupRef.current.children[3] as THREE.Points;
    
    // Scale outer shape based on bass
    if (icosahedron && icosahedron instanceof THREE.Mesh) {
      const icoScale = 1.5 + bands.bass * 0.8;
      icosahedron.scale.set(icoScale, icoScale, icoScale);
      icosahedron.rotation.x += 0.01 * bands.bass;
      icosahedron.rotation.y += 0.01 * bands.bass;
    }
    
    // Rotate middle shape based on mid frequencies
    if (dodecahedron && dodecahedron instanceof THREE.Mesh) {
      const dodecScale = 1.0 + bands.midLow * 0.5;
      dodecahedron.scale.set(dodecScale, dodecScale, dodecScale);
      dodecahedron.rotation.x -= 0.02 * bands.midLow;
      dodecahedron.rotation.z += 0.02 * bands.midHigh;
    }
    
    // Pulse inner shape based on treble
    if (octahedron && octahedron instanceof THREE.Mesh) {
      const octScale = 0.5 + bands.treble * 0.8;
      octahedron.scale.set(octScale, octScale, octScale);
      
      if (octahedron.material instanceof THREE.MeshPhongMaterial) {
        octahedron.material.emissiveIntensity = 1.0 + bands.treble * 1.5;
      }
    }
    
    // Adjust particles
    if (particles && particles instanceof THREE.Points) {
      const overallVolume = (bands.bass + bands.midLow + bands.midHigh + bands.treble) / 4;
      
      if (particles.material instanceof THREE.PointsMaterial) {
        particles.material.size = 0.03 + overallVolume * 0.08;
        particles.material.opacity = 0.7 + overallVolume * 0.3;
      }
    }
  };
  
  // Helper function to dispose Three.js objects correctly
  const disposeObject = (obj: THREE.Object3D) => {
    if (!obj) return;
    
    // Handle children
    while (obj.children.length > 0) {
      disposeObject(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    
    // Dispose materials
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => disposeMaterial(material));
        } else {
          disposeMaterial(obj.material);
        }
      }
    }
  };
  
  const disposeMaterial = (material: THREE.Material) => {
    material.dispose();
    
    // Handle textures
    // @ts-ignore
    if (material.map) material.map.dispose();
    // @ts-ignore
    if (material.lightMap) material.lightMap.dispose();
    // @ts-ignore
    if (material.bumpMap) material.bumpMap.dispose();
    // @ts-ignore
    if (material.normalMap) material.normalMap.dispose();
    // @ts-ignore
    if (material.specularMap) material.specularMap.dispose();
    // @ts-ignore
    if (material.envMap) material.envMap.dispose();
  };
  
  const disposeScene = (scene: THREE.Scene) => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
          } else {
            disposeMaterial(object.material);
          }
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default FractalAudioVisualizer;
