
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { VisualizationSettings, AudioAnalysisResult } from '@/types/visualization';
import { chakraFrequencyToColor } from '@/utils/visualizationMath';

interface SacredGrid3DVisualizerProps {
  width: number | string;
  height: number | string;
  settings: VisualizationSettings;
  audioAnalysis: AudioAnalysisResult;
  className?: string;
}

const SacredGrid3DVisualizer: React.FC<SacredGrid3DVisualizerProps> = ({
  width,
  height,
  settings,
  audioAnalysis,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  
  // Geometry references
  const flowerOfLifeRef = useRef<THREE.Group | null>(null);
  const metatronsCubeRef = useRef<THREE.Group | null>(null);
  const primeSpiralRef = useRef<THREE.Group | null>(null);
  const fibonacciSpiralRef = useRef<THREE.Group | null>(null);
  
  // Set up Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate dimensions
    const updateContainerSize = () => {
      if (!containerRef.current) return { width: 0, height: 0 };
      
      const targetWidth = typeof width === 'number'
        ? width
        : containerRef.current.clientWidth;
        
      const targetHeight = typeof height === 'number'
        ? height
        : containerRef.current.clientHeight;
        
      return { width: targetWidth, height: targetHeight };
    };
    
    const { width: containerWidth, height: containerHeight } = updateContainerSize();
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create sacred geometry objects
    createFlowerOfLife();
    createMetatronsCube();
    createPrimeSpiral();
    createFibonacciSpiral();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const { width: newWidth, height: newHeight } = updateContainerSize();
      
      // Update camera
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      updateGeometries();
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    return () => {
      // Clean up
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update geometries based on audio analysis and settings
  const updateGeometries = () => {
    if (!sceneRef.current) return;
    
    // Update visibility
    if (flowerOfLifeRef.current) {
      flowerOfLifeRef.current.visible = settings.activeShapes.includes('flower-of-life');
      
      if (flowerOfLifeRef.current.visible) {
        // Update rotation
        flowerOfLifeRef.current.rotation.y += 0.005 * settings.speed;
        flowerOfLifeRef.current.rotation.z += 0.002 * settings.speed;
        
        // Update scale based on audio amplitude
        const scale = 1 + (audioAnalysis.amplitude * 0.3);
        flowerOfLifeRef.current.scale.set(scale, scale, scale);
        
        // Update material color
        const color = settings.chakraAlignmentMode
          ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
          : '#9b87f5';
          
        flowerOfLifeRef.current.traverse(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            child.material.color.set(color);
            // Adjust opacity based on amplitude
            child.material.opacity = 0.6 + (audioAnalysis.amplitude * 0.4);
          }
        });
      }
    }
    
    if (metatronsCubeRef.current) {
      metatronsCubeRef.current.visible = settings.activeShapes.includes('metatron-cube');
      
      if (metatronsCubeRef.current.visible) {
        // Update rotation
        metatronsCubeRef.current.rotation.y += 0.003 * settings.speed;
        metatronsCubeRef.current.rotation.x += 0.002 * settings.speed;
        
        // Update scale based on audio amplitude
        const scale = 1 + (audioAnalysis.amplitude * 0.2);
        metatronsCubeRef.current.scale.set(scale, scale, scale);
        
        // Update material color
        const color = settings.chakraAlignmentMode
          ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
          : '#7E69AB';
          
        metatronsCubeRef.current.traverse(child => {
          if (child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
            child.material.color.set(color);
          }
        });
      }
    }
    
    if (primeSpiralRef.current) {
      primeSpiralRef.current.visible = settings.activeShapes.includes('prime-spiral');
      
      if (primeSpiralRef.current.visible) {
        // Update rotation
        primeSpiralRef.current.rotation.z += 0.004 * settings.speed;
        
        // Update material color
        const color = settings.chakraAlignmentMode
          ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
          : '#FFD700'; // Gold
          
        primeSpiralRef.current.traverse(child => {
          if (child instanceof THREE.Points && child.material instanceof THREE.PointsMaterial) {
            child.material.color.set(color);
            
            // Update size based on amplitude
            child.material.size = 0.05 + (audioAnalysis.amplitude * 0.05);
          }
        });
      }
    }
    
    if (fibonacciSpiralRef.current) {
      fibonacciSpiralRef.current.visible = settings.activeShapes.includes('fibonacci-spiral');
      
      if (fibonacciSpiralRef.current.visible) {
        // Update rotation
        fibonacciSpiralRef.current.rotation.z += 0.002 * settings.speed;
        
        // Update material color
        const color = settings.chakraAlignmentMode
          ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
          : '#9c27b0'; // Purple
          
        fibonacciSpiralRef.current.traverse(child => {
          if (child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
            child.material.color.set(color);
          }
        });
      }
    }
  };
  
  // Create a 3D flower of life
  const createFlowerOfLife = () => {
    if (!sceneRef.current) return;
    
    // Create a group for flower of life
    const group = new THREE.Group();
    flowerOfLifeRef.current = group;
    
    // Create a geometric representation
    const iterations = 4;
    const radius = 0.2;
    const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x9b87f5,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });
    
    // Generate flowers of life (simplified)
    const createCircle = (x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.position.set(x, y, z);
      return mesh;
    };
    
    // Create center circle
    group.add(createCircle(0, 0, 0));
    
    // Create first ring
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = radius * 2 * Math.cos(angle);
      const y = radius * 2 * Math.sin(angle);
      group.add(createCircle(x, y, 0));
    }
    
    // Create second ring (simplified)
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const x = radius * 4 * Math.cos(angle);
      const y = radius * 4 * Math.sin(angle);
      group.add(createCircle(x, y, 0));
    }
    
    // Add to scene
    sceneRef.current.add(group);
  };
  
  // Create a 3D Metatron's Cube
  const createMetatronsCube = () => {
    if (!sceneRef.current) return;
    
    // Create a group for Metatron's Cube
    const group = new THREE.Group();
    metatronsCubeRef.current = group;
    
    // Define vertices
    const vertices = [
      new THREE.Vector3(0, 0, 0), // Center
      // Outer vertices in 3D space
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0.5, 0.866, 0),
      new THREE.Vector3(-0.5, 0.866, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-0.5, -0.866, 0),
      new THREE.Vector3(0.5, -0.866, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1)
    ];
    
    // Define lines
    const lines = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
      [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
      [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8]
    ];
    
    // Create lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7E69AB });
    
    lines.forEach(line => {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        vertices[line[0]],
        vertices[line[1]]
      ]);
      
      const lineObj = new THREE.Line(lineGeometry, lineMaterial);
      group.add(lineObj);
    });
    
    // Add vertices as small spheres
    const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xD6BCFA });
    
    vertices.forEach(vertex => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(vertex);
      group.add(sphere);
    });
    
    // Add to scene
    sceneRef.current.add(group);
  };
  
  // Create a 3D prime spiral
  const createPrimeSpiral = () => {
    if (!sceneRef.current) return;
    
    // Create a group for prime spiral
    const group = new THREE.Group();
    primeSpiralRef.current = group;
    
    // Generate prime points
    const points: THREE.Vector3[] = [];
    const primePoints: THREE.Vector3[] = [];
    
    // Calculate points on a spiral and check for primes
    for (let i = 1; i <= 200; i++) {
      const isPrimeNum = isPrime(i);
      const theta = Math.sqrt(i) * 0.8;
      const r = Math.sqrt(i) * 0.1;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = 0;
      
      const point = new THREE.Vector3(x, y, z);
      points.push(point);
      
      if (isPrimeNum) {
        primePoints.push(point);
      }
    }
    
    // Create spiral line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x333333,
      transparent: true,
      opacity: 0.3
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);
    
    // Create prime number points
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(primePoints);
    const pointsObj = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(pointsObj);
    
    // Add to scene
    sceneRef.current.add(group);
  };
  
  // Create a 3D Fibonacci spiral
  const createFibonacciSpiral = () => {
    if (!sceneRef.current) return;
    
    // Create a group for Fibonacci spiral
    const group = new THREE.Group();
    fibonacciSpiralRef.current = group;
    
    // Generate Fibonacci spiral points
    const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i < 150; i++) {
      const theta = i * 0.1;
      const r = Math.pow(PHI, theta / Math.PI) * 0.05;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = r * 0.1; // Add some 3D effect
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // Create line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x9c27b0 
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);
    
    // Add to scene
    sceneRef.current.add(group);
  };
  
  // Helper function for prime checking
  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    
    return true;
  };

  return (
    <div 
      ref={containerRef} 
      className={`sacred-grid-3d-container ${className || ''}`}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
};

export default SacredGrid3DVisualizer;
