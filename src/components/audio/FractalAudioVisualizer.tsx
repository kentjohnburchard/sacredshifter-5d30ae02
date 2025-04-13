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
  onPrimeSequence?: (primes: number[]) => void; // New callback to expose primes
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
  onPrimeSequence
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
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  
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

  useEffect(() => {
    if (isVisible && onPrimeSequence) {
      const initialPrimes = primes.slice(0, 5);
      setActivePrimes(initialPrimes);
      onPrimeSequence(initialPrimes);
    }
  }, [isVisible, primes, onPrimeSequence]);

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

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    
    console.log("FractalVisualizer: Initializing Three.js scene");
    visualizerActiveRef.current = true;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    
    containerRef.current.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const colors = getColorScheme();
    
    const pointLight1 = new THREE.PointLight(colors.accent, 1.5);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(colors.highlight, 1.5);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);
    
    if (analyser) {
      console.log("FractalVisualizer: Analyzer available, creating data buffer");
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    } else {
      console.log("FractalVisualizer: No analyzer provided");
    }
    
    createPrimeFractals();
    
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    if (isVisible) {
      animate();
    }
    
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
      
      geometriesRef.current.forEach(geometry => {
        geometry.dispose();
      });
      
      materialsRef.current.forEach(material => {
        material.dispose();
      });
      
      if (sceneRef.current) {
        fractalsRef.current.forEach(obj => {
          sceneRef.current?.remove(obj);
        });
      }
      
      console.log("FractalVisualizer: Cleanup complete");
    };
  }, [isVisible, colorScheme, chakra]);
  
  const createPrimeFractals = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const colors = getColorScheme();
    
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
    
    if (frequency) {
      const freqColor = getFrequencyColor(frequency);
      if (freqColor) {
        colors.primary = freqColor;
        colors.accent = freqColor.clone().multiplyScalar(1.2);
        colors.highlight = freqColor.clone().multiplyScalar(1.4);
      }
    }
    
    const createFlowingPrimeSpiral = () => {
      const spiralGroup = new THREE.Group();
      
      const curvePoints = [];
      const segmentCount = 300;
      
      for (let i = 0; i < segmentCount; i++) {
        const prime = primes[i % primes.length];
        const theta = i * 0.04 * Math.PI;
        
        const radius = 0.01 * Math.sqrt(i) * (1 + Math.sin(i * 0.05) * 0.2);
        const x = Math.cos(theta) * radius * (1 + Math.sin(prime * 0.01) * 0.1);
        const y = Math.sin(theta) * radius * (1 + Math.cos(prime * 0.01) * 0.1);
        const z = Math.sin(i * 0.01) * 0.05;
        
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      curve.tension = 0.3;
      
      const tubeGeometry = new THREE.TubeGeometry(curve, 300, 0.015, 8, false);
      geometriesRef.current.push(tubeGeometry);
      
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: colors.primary,
        emissive: colors.accent,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        side: THREE.DoubleSide
      });
      materialsRef.current.push(tubeMaterial);
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      spiralGroup.add(tube);
      
      const particlesCount = 150;
      const particlesMaterial = new THREE.PointsMaterial({
        color: colors.highlight,
        size: 0.03,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
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
    
    const createFlowerOfLifePattern = () => {
      const flowerGroup = new THREE.Group();
      const circleRadius = 0.12;
      const circleDetail = 32;
      
      const createCircleAt = (x: number, y: number, z: number, primeIndex: number) => {
        const prime = primes[primeIndex % primes.length];
        const variationFactor = (prime % 5) * 0.04;
        
        const circleGeometry = new THREE.TorusGeometry(
          circleRadius * (1 + variationFactor), 
          0.005, 
          2, 
          circleDetail
        );
        geometriesRef.current.push(circleGeometry);
        
        const circleMaterial = new THREE.MeshPhongMaterial({
          color: colors.accent,
          emissive: colors.highlight,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        materialsRef.current.push(circleMaterial);
        
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(x, y, z);
        flowerGroup.add(circle);
      };
      
      createCircleAt(0, 0, 0, 0);
      
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius;
        const y = Math.sin(angle) * circleRadius;
        createCircleAt(x, y, 0, i + 1);
      }
      
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius * 2;
        const y = Math.sin(angle) * circleRadius * 2;
        createCircleAt(x, y, 0, i + 7);
      }
      
      return flowerGroup;
    };
    
    const createPrimePetals = () => {
      const petalGroup = new THREE.Group();
      
      const petalCount = 12;
      
      for (let i = 0; i < petalCount; i++) {
        const primeIndex = i % primes.length;
        const prime = primes[primeIndex];
        const nextPrime = primes[(primeIndex + 1) % primes.length];
        
        const startAngle = (i / petalCount) * Math.PI * 2;
        const endAngle = ((i + 1) / petalCount) * Math.PI * 2;
        
        const curvePoints = [];
        const segments = 20;
        
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const angle = startAngle * (1 - t) + endAngle * t;
          
          const radius = 0.6 * (1 - Math.abs(t - 0.5) * 1.8) * (prime % 7) / 7 + 0.2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const z = (Math.sin(t * Math.PI) * 0.05) + ((nextPrime % 5) * 0.01);
          
          curvePoints.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        curve.tension = 0.4;
        
        const tubeGeometry = new THREE.TubeGeometry(
          curve, segments * 2, 0.01 + (prime % 5) * 0.002, 6, false
        );
        geometriesRef.current.push(tubeGeometry);
        
        const tubeMaterial = new THREE.MeshPhongMaterial({
          color: i % 2 === 0 ? colors.primary : colors.accent,
          emissive: colors.highlight,
          emissiveIntensity: 0.3 + (i % 3) * 0.1,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide
        });
        materialsRef.current.push(tubeMaterial);
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        petalGroup.add(tube);
      }
      
      return petalGroup;
    };
    
    const createFlowingParticles = () => {
      const particleGroup = new THREE.Group();
      const particleCount = 300;
      
      const particlesGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      const particleColors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const prime = primes[i % primes.length];
        
        const t = i / particleCount;
        const radius = 0.8 * Math.pow(t, 0.5) + (prime % 5) * 0.01;
        const spiralT = t * 15 + (prime % 7) * 0.5;
        const angle = spiralT * 2.4;
        
        particlePositions[i * 3] = Math.cos(angle) * radius * (1 + Math.sin(prime * 0.01) * 0.1);
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius * (1 + Math.cos(prime * 0.01) * 0.1);
        particlePositions[i * 3 + 2] = Math.sin(spiralT * 0.3) * 0.1;
        
        particleSizes[i] = 0.03 + (prime % 7) * 0.004;
        
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
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      materialsRef.current.push(particleMaterial);
      
      const particles = new THREE.Points(particlesGeometry, particleMaterial);
      particleGroup.add(particles);
      
      return particleGroup;
    };
    
    const spiral = createFlowingPrimeSpiral();
    const flower = createFlowerOfLifePattern();
    const petals = createPrimePetals();
    const particles = createFlowingParticles();
    
    spiral.position.set(0, 0, 0.1);
    flower.position.set(0, 0, -0.1);
    petals.position.set(0, 0, 0);
    
    scene.add(spiral);
    scene.add(flower);
    scene.add(petals);
    scene.add(particles);
    
    fractalsRef.current = [spiral, flower, petals, particles];
  };
  
  const detectBeat = (dataArray: Uint8Array): boolean => {
    const bassSum = dataArray.slice(0, 5).reduce((sum, val) => sum + val, 0);
    const bassAvg = bassSum / 5;
    
    const threshold = 150;
    
    return bassAvg > threshold;
  };
  
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !visualizerActiveRef.current) return;
    
    timeRef.current += 0.01;
    animationFrameRef.current = requestAnimationFrame(animate);
    
    let audioDataAvailable = false;
    let frequencyData = new Array(128).fill(0);
    let beatDetected = false;
    
    if (analyser && dataArrayRef.current) {
      analyser.getByteFrequencyData(dataArrayRef.current);
      audioDataAvailable = true;
      
      for (let i = 0; i < dataArrayRef.current.length && i < frequencyData.length; i++) {
        frequencyData[i] = dataArrayRef.current[i] / 255;
      }
      
      beatDetected = detectBeat(dataArrayRef.current);
      if (beatDetected && !beatDetectedRef.current) {
        beatDetectedRef.current = true;
        primeIndexRef.current = (primeIndexRef.current + 1) % primes.length;
        
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
      } else if (!beatDetected && beatDetectedRef.current) {
        beatDetectedRef.current = false;
      }
    }
    
    const bassFreq = audioDataAvailable ? 
      frequencyData.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10 : 
      0.1;
    
    const midFreq = audioDataAvailable ? 
      frequencyData.slice(10, 40).reduce((sum, val) => sum + val, 0) / 30 : 
      0.1;
    
    const highFreq = audioDataAvailable ? 
      frequencyData.slice(40, 100).reduce((sum, val) => sum + val, 0) / 60 : 
      0.1;
    
    const currentPrime = primes[primeIndexRef.current];
    
    fractalsRef.current.forEach((fractal, index) => {
      if (index === 0) {
        fractal.rotation.z += 0.001 + bassFreq * 0.005 * intensity;
        fractal.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1 * midFreq;
        
        if (beatDetected) {
          fractal.scale.set(
            1 + bassFreq * 0.2 * intensity,
            1 + bassFreq * 0.2 * intensity,
            1 + bassFreq * 0.2 * intensity
          );
        } else {
          fractal.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
        
        fractal.rotation.y += 0.0003 * (currentPrime % 7);
      }
      else if (index === 1) {
        fractal.rotation.z -= 0.002 + midFreq * 0.008 * intensity;
        
        const scaleFactor = 0.8 + highFreq * 0.2 * intensity;
        fractal.scale.lerp(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor), 0.1);
        
        fractal.position.x = Math.sin(timeRef.current * 0.2) * 0.1 * (currentPrime % 5) * 0.01;
        fractal.position.y = Math.cos(timeRef.current * 0.3) * 0.1 * (currentPrime % 3) * 0.01;
      }
      else if (index === 2) {
        fractal.rotation.y += 0.001 + midFreq * 0.002 * intensity;
        
        const breatheScale = 0.6 + Math.sin(timeRef.current * 0.5) * 0.05 + bassFreq * 0.1;
        fractal.scale.set(breatheScale, breatheScale, breatheScale);
        
        fractal.position.z = -0.5 + Math.sin(timeRef.current * 0.1) * (currentPrime % 11) * 0.01;
      }
      else if (index === 3) {
        fractal.rotation.y += 0.0005 + highFreq * 0.003 * intensity;
        fractal.rotation.x += 0.0003 + midFreq * 0.002 * intensity;
        
        if (beatDetected) {
          const particles = fractal.children[0];
          if (particles instanceof THREE.Points) {
            const material = particles.material as THREE.PointsMaterial;
            material.size = 0.08 + bassFreq * 0.1;
            material.opacity = 0.7 + bassFreq * 0.3;
          }
        }
      }
      
      if (audioDataAvailable && index < 3) {
        const modFactor = (currentPrime % 13) * 0.0001;
        fractal.rotation.z += modFactor;
        fractal.rotation.x += modFactor * 0.7;
      }
    });
    
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
