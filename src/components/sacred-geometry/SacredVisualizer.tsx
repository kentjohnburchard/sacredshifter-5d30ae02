
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createFlowerOfLife, createSeedOfLife, createMetatronsCube, createSriYantra, 
         createTreeOfLife, createVesicaPiscis, createMerkaba } from './sacredGeometryUtils';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

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
  const [energyField, setEnergyField] = useState<THREE.Object3D | null>(null);
  const [particleSystems, setParticleSystems] = useState<THREE.Points[]>([]);
  const [timeEmergedShapes, setTimeEmergedShapes] = useState<THREE.Object3D[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

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

  // Create mystical energy field around the main shape
  const createEnergyField = (scene: THREE.Scene, radius: number, color: THREE.Color) => {
    // Remove existing energy field if it exists
    if (energyField) {
      scene.remove(energyField);
    }

    const energyGroup = new THREE.Group();

    // Create glowing aura sphere
    const auraGeometry = new THREE.SphereGeometry(radius * 1.6, 32, 32);
    const auraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        intensity: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float edge = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
          edge = pow(1.0 - edge, 3.0);
          
          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          float glow = edge * (0.5 + pulse * 0.5) * intensity;
          
          vec3 finalColor = color * glow;
          gl_FragColor = vec4(finalColor, glow * 0.8);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });

    const auraSphere = new THREE.Mesh(auraGeometry, auraMaterial);
    energyGroup.add(auraSphere);

    // Create cosmic rays
    const rayCount = 30;
    for (let i = 0; i < rayCount; i++) {
      const rayGeometry = new THREE.CylinderGeometry(0.01, 0.01, radius * 4, 4, 1);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });

      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      
      // Random positioning
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      ray.position.x = radius * 1.5 * Math.sin(phi) * Math.cos(theta);
      ray.position.y = radius * 1.5 * Math.sin(phi) * Math.sin(theta);
      ray.position.z = radius * 1.5 * Math.cos(phi);
      
      // Orient towards center
      ray.lookAt(0, 0, 0);
      
      // Rotate 90 degrees to align cylinder with direction
      ray.rotateX(Math.PI / 2);
      
      energyGroup.add(ray);
    }
    
    // Create mystical particles around the main shape
    const particleCount = 2000;
    const particles = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * (1.5 + Math.random() * 0.5);
      
      particles[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particles[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particles[i * 3 + 2] = r * Math.cos(phi);
      
      particleSizes[i] = 0.5 + Math.random() * 1.5;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        pointTexture: { value: createCircleTexture() }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = vec3(0.5 + sin(time + position.x) * 0.5, 
                        0.5 + cos(time + position.y) * 0.5,
                        0.5 + sin(time + position.z) * 0.5);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    energyGroup.add(particleSystem);
    setParticleSystems(prev => [...prev, particleSystem]);

    scene.add(energyGroup);
    setEnergyField(energyGroup);
  };

  // Create a circle texture for particles
  const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d')!;
    context.beginPath();
    context.arc(64, 64, 64, 0, Math.PI * 2, false);
    
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fill();
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };
  
  // Function to create ethereal shapes emerging from time/space
  const createTimeEmergedShape = (scene: THREE.Scene, mainRadius: number, baseColor: THREE.Color) => {
    const shape = new THREE.Group();
    
    // Choose a random geometric shape
    const shapeType = Math.floor(Math.random() * 5);
    let geometry;
    
    switch(shapeType) {
      case 0: // Icosahedron (20-sided polyhedron)
        geometry = new THREE.IcosahedronGeometry(0.1 + Math.random() * 0.2);
        break;
      case 1: // Dodecahedron (12-sided polyhedron)
        geometry = new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.2);
        break;
      case 2: // Tetrahedron (4-sided polyhedron)
        geometry = new THREE.TetrahedronGeometry(0.1 + Math.random() * 0.3);
        break;
      case 3: // Octahedron (8-sided polyhedron)
        geometry = new THREE.OctahedronGeometry(0.1 + Math.random() * 0.25);
        break;
      case 4: // Torus Knot
        geometry = new THREE.TorusKnotGeometry(
          0.1 + Math.random() * 0.1, 
          0.03 + Math.random() * 0.02,
          64, 8, Math.floor(2 + Math.random() * 5), Math.floor(1 + Math.random() * 4)
        );
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(0.2);
    }
    
    // Create unique material with ethereal glow effect
    const hue = Math.random();
    const saturation = 0.5 + Math.random() * 0.5;
    const luminosity = 0.4 + Math.random() * 0.4;
    
    const color = new THREE.Color().setHSL(hue, saturation, luminosity);
    
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.5),
      shininess: 100,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    const glowMesh = new THREE.Mesh(geometry, glowMaterial);
    glowMesh.scale.multiplyScalar(1.2);
    mesh.add(glowMesh);
    
    // Position randomly around the main shape
    const distance = mainRadius * (2 + Math.random() * 2);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    mesh.position.x = distance * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = distance * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = distance * Math.cos(phi);
    
    // Add random rotation
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.rotation.z = Math.random() * Math.PI * 2;
    
    // Store orbit data as a property of the mesh
    mesh.userData = {
      orbitRadius: distance,
      orbitSpeed: 0.2 + Math.random() * 0.3,
      orbitAxis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      orbitAngle: Math.random() * Math.PI * 2
    };
    
    shape.add(mesh);
    scene.add(shape);
    
    return shape;
  };

  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", shape);
    
    setIsExpanding(true);
    setFractalProgress(0);
    clockRef.current.start();
    setReplicatedShapes([]);
    setTimeEmergedShapes([]);
    
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

    // Add lighting for mystical effect
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
    createEnergyField(scene, 1.5, colorSchemeColor);
    
    // Create initial time-emerged shapes
    for (let i = 0; i < 3; i++) {
      const timeShape = createTimeEmergedShape(scene, 2, colorSchemeColor);
      setTimeEmergedShapes(prev => [...prev, timeShape]);
    }

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
            setHasInitialized(true);
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
          (mode === 'spiral' || mode === 'fractal') && 
          shapeRef.current && 
          replicatedShapes.length < 12 && 
          fractalProgress > 0.4 && 
          Math.random() > 0.95
        ) {
          const replicaGeometry = shapeRef.current.clone();
          const scale = 0.1 + Math.random() * 0.4;
          replicaGeometry.scale.set(scale, scale, scale);
          
          const radius = 1.2 + Math.random() * 2.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          replicaGeometry.position.x = radius * Math.sin(phi) * Math.cos(theta);
          replicaGeometry.position.y = radius * Math.sin(phi) * Math.sin(theta);
          replicaGeometry.position.z = radius * Math.cos(phi);
          
          // Add unique orbit data
          replicaGeometry.userData = {
            orbitRadius: radius,
            orbitSpeed: 0.2 + Math.random() * 0.5,
            orbitAxis: new THREE.Vector3(
              Math.random() - 0.5,
              Math.random() - 0.5,
              Math.random() - 0.5
            ).normalize(),
            rotationSpeed: {
              x: (Math.random() - 0.5) * 0.03,
              y: (Math.random() - 0.5) * 0.03,
              z: (Math.random() - 0.5) * 0.03
            },
            orbitAngle: Math.random() * Math.PI * 2
          };
          
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
          
          // Update energy field elements based on audio
          if (energyField && energyField.children.length > 0) {
            // Update aura intensity based on audio
            const auraSphere = energyField.children[0];
            if (auraSphere instanceof THREE.Mesh && 
                auraSphere.material instanceof THREE.ShaderMaterial) {
              auraSphere.material.uniforms.time.value = time;
              auraSphere.material.uniforms.intensity.value = 0.5 + averageAmplitude * sensitivity;
            }
            
            // Update ray opacity based on audio
            for (let i = 1; i <= 30; i++) {
              if (energyField.children[i] instanceof THREE.Mesh && 
                  energyField.children[i].material instanceof THREE.MeshBasicMaterial) {
                
                const ray = energyField.children[i];
                const material = ray.material as THREE.MeshBasicMaterial;
                
                // Make rays pulse with the audio
                const bandIndex = (i % audioData.length);
                const bandValue = audioData[bandIndex] || 0.5;
                
                material.opacity = 0.2 + bandValue * 0.6;
                
                // Scale rays based on audio
                ray.scale.y = 1 + bandValue * 2;
              }
            }
            
            // Update particle systems
            particleSystems.forEach(particles => {
              if (particles.material instanceof THREE.ShaderMaterial) {
                particles.material.uniforms.time.value = time;
              }
            });
          }
          
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
          
          // If a prime number is detected in audio, create a mystical time-emerged shape
          if (audioContext && analyser) {
            const sampleRate = audioContext.sampleRate;
            const binCount = analyser.frequencyBinCount;
            
            // Find the dominant frequency
            let maxIndex = 0;
            let maxValue = 0;
            for (let i = 0; i < audioData.length; i++) {
              if (audioData[i] > maxValue) {
                maxValue = audioData[i];
                maxIndex = i;
              }
            }
            
            // Calculate actual frequency from bin index
            const frequency = maxIndex * sampleRate / (2 * binCount);
            const roundedFreq = Math.round(frequency);
            
            // Check if prime and add mystical object on prime frequencies
            if (maxValue > 0.7 && isPrime(roundedFreq) && Math.random() > 0.9) {
              if (timeEmergedShapes.length < 20) {
                const newShape = createTimeEmergedShape(
                  sceneRef.current, 
                  2, 
                  new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
                );
                setTimeEmergedShapes(prev => [...prev, newShape]);
              }
            }
          }
          
          // Animate mystical time-emerged shapes
          timeEmergedShapes.forEach((timeShape) => {
            if (timeShape.children[0]) {
              const mesh = timeShape.children[0];
              const userData = mesh.userData;
              
              // Update orbit angle
              userData.orbitAngle += userData.orbitSpeed * delta;
              
              // Calculate new position
              const orbit = new THREE.Vector3(0, 0, 1)
                .applyAxisAngle(userData.orbitAxis, userData.orbitAngle)
                .multiplyScalar(userData.orbitRadius);
              
              mesh.position.copy(orbit);
              
              // Update rotation
              mesh.rotation.x += userData.rotationSpeed.x;
              mesh.rotation.y += userData.rotationSpeed.y;
              mesh.rotation.z += userData.rotationSpeed.z;
              
              // Pulse effect
              const pulse = 1 + Math.sin(time * 3 + userData.orbitAngle) * 0.1;
              mesh.scale.set(pulse, pulse, pulse);
              
              // Update glow opacity
              if (mesh.children[0] && mesh.children[0].material instanceof THREE.MeshBasicMaterial) {
                mesh.children[0].material.opacity = 0.3 + Math.sin(time * 2 + userData.orbitAngle) * 0.2;
              }
            }
          });
          
          // Animate replicated shapes based on audio
          replicatedShapes.forEach((replica, index) => {
            const individualFreq = audioData[index % audioData.length] || 0.5; 
            const userData = replica.userData;
            
            // Update orbit angle
            userData.orbitAngle += userData.orbitSpeed * delta * (0.5 + individualFreq * 0.5);
            
            // Calculate new position based on orbital mechanics
            const orbit = new THREE.Vector3(0, 0, 1)
              .applyAxisAngle(userData.orbitAxis, userData.orbitAngle)
              .multiplyScalar(userData.orbitRadius * (0.9 + individualFreq * 0.2));
            
            replica.position.copy(orbit);
            
            // Update rotation
            replica.rotation.x += userData.rotationSpeed.x * (1 + individualFreq);
            replica.rotation.y += userData.rotationSpeed.y * (1 + individualFreq);
            replica.rotation.z += userData.rotationSpeed.z * (1 + individualFreq);
            
            // Scale with audio
            const replicaScale = 0.2 + (individualFreq * 0.3);
            replica.scale.set(replicaScale, replicaScale, replicaScale);
            
            // Apply color changes for rainbow mode
            if (colorScheme === 'rainbow') {
              const hue = (time * 20 + index * 20) % 360;
              replica.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                  child.material.color.setHSL(hue/360, 0.7, 0.5);
                  child.material.emissive.setHSL(hue/360, 0.7, 0.3);
                }
              });
            }
          });
        } else {
          shapeRef.current.scale.set(baseScale, baseScale, baseScale);
          shapeRef.current.rotation.x += 0.002;
          shapeRef.current.rotation.y += 0.002;
          
          // Update energy field for non-audio mode
          if (energyField && energyField.children.length > 0) {
            const auraSphere = energyField.children[0];
            if (auraSphere instanceof THREE.Mesh && 
                auraSphere.material instanceof THREE.ShaderMaterial) {
              auraSphere.material.uniforms.time.value = time;
            }
            
            particleSystems.forEach(particles => {
              if (particles.material instanceof THREE.ShaderMaterial) {
                particles.material.uniforms.time.value = time;
              }
            });
          }
          
          // Animate mystical time-emerged shapes with gentle motion
          timeEmergedShapes.forEach((timeShape) => {
            if (timeShape.children[0]) {
              const mesh = timeShape.children[0];
              const userData = mesh.userData;
              
              // Update orbit angle
              userData.orbitAngle += userData.orbitSpeed * delta * 0.5;
              
              // Calculate new position
              const orbit = new THREE.Vector3(0, 0, 1)
                .applyAxisAngle(userData.orbitAxis, userData.orbitAngle)
                .multiplyScalar(userData.orbitRadius);
              
              mesh.position.copy(orbit);
              
              // Update rotation
              mesh.rotation.x += userData.rotationSpeed.x * 0.5;
              mesh.rotation.y += userData.rotationSpeed.y * 0.5;
              mesh.rotation.z += userData.rotationSpeed.z * 0.5;
              
              // Pulse effect
              const pulse = 1 + Math.sin(time * 2 + userData.orbitAngle) * 0.1;
              mesh.scale.set(pulse, pulse, pulse);
            }
          });
          
          // Animate replicated shapes with gentle pulsing
          replicatedShapes.forEach((replica, index) => {
            const userData = replica.userData;
            
            // Update orbit angle
            userData.orbitAngle += userData.orbitSpeed * delta * 0.5;
            
            // Calculate new position
            const orbit = new THREE.Vector3(0, 0, 1)
              .applyAxisAngle(userData.orbitAxis, userData.orbitAngle)
              .multiplyScalar(userData.orbitRadius);
            
            replica.position.copy(orbit);
            
            // Update rotation
            replica.rotation.x += userData.rotationSpeed.x * 0.5;
            replica.rotation.y += userData.rotationSpeed.y * 0.5;
            replica.rotation.z += userData.rotationSpeed.z * 0.5;
            
            // Gentle pulse
            const pulse = 0.2 + Math.sin(time * 2 + index) * 0.05;
            replica.scale.set(pulse, pulse, pulse);
          });
        }
        
        // Natural flowing motion for main shape
        shapeRef.current.position.y = Math.sin(time) * 0.1;
        shapeRef.current.position.x = Math.cos(time * 0.8) * 0.1;
        
        // Add subtle camera movement for immersive effect
        if (cameraRef.current && hasInitialized) {
          cameraRef.current.position.x = Math.sin(time * 0.2) * 0.3;
          cameraRef.current.position.y = Math.cos(time * 0.3) * 0.2;
          cameraRef.current.lookAt(0, 0, 0);
        }
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
      
      // Remove time-emerged shapes
      timeEmergedShapes.forEach(shape => {
        if (sceneRef.current) {
          sceneRef.current.remove(shape);
        }
      });
      
      // Remove energy field
      if (energyField && sceneRef.current) {
        sceneRef.current.remove(energyField);
      }
      
      setReplicatedShapes([]);
      setTimeEmergedShapes([]);
      setParticleSystems([]);
      
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
        geometry = new THREE.TorusGeometry(1, 0.3, 64, 128); // Increased subdivision
        const torusMaterial = material.clone();
        const torus = new THREE.Mesh(geometry, torusMaterial);
        torusGroup.add(torus);
        
        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          wireframeMaterial
        );
        torus.add(wireframe);
        
        const originGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Increased subdivision
        const originMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          emissive: baseColor,
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
        geometry = new THREE.SphereGeometry(0.8, 64, 64); // Increased subdivision
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: baseColor,
          emissive: emissiveColor,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.7,
          wireframe: false,
          shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, sphereMaterial);
        
        const sphereWireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.3
          })
        );
        mesh.add(sphereWireframe);
        
        const sphereOrigin = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 32, 32), // Increased subdivision
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: baseColor,
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
