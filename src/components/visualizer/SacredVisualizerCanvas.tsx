import React, { useRef, useEffect } from 'react';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { useTheme } from '@/context/ThemeContext';
import { ChakraType, SacredGeometryType, getChakraColor } from './sacred-geometries';

interface GeometryConfig {
  type: SacredGeometryType;
  chakra?: ChakraType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  visualizerMode?: VisualizerMode | SacredGeometryType;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
  intensity?: number;
  multiView?: boolean;
  geometryConfigs?: GeometryConfig[];
  isActive?: boolean;
};

// This is now a canvas-based visualizer rather than a Three.js component
const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'flowerOfLife', 
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
  multiView = false,
  geometryConfigs = [],
  isActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Only include the geometry types we know we properly support
  const supportedGeometryTypes: SacredGeometryType[] = [
    'flowerOfLife', 'merkaba', 'metatronCube', 'sriYantra', 'fibonacciSpiral', 'chakraBeam',
    'primeFlow', 'chakraSpiral', 'multi'
  ];
  
  // Check if visualizerMode is one of our supported types
  const isSupportedGeometry = supportedGeometryTypes.includes(visualizerMode as SacredGeometryType);
  const shouldRender = typeof visualizerMode === 'string';
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shouldRender) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match its display size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Animation parameters
    let angle = 0;
    let scale = 1;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
    }> = [];

    // Initialize particles for certain visualizers
    if (['primeFlow', 'chakraSpiral'].includes(visualizerMode as string)) {
      const particleCount = 150;
      const chakraColor = getChakraColor(chakra);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 4 + 1,
          color: chakraColor,
          speed: Math.random() * 2 + 0.5,
          angle: Math.random() * Math.PI * 2
        });
      }
    }
    
    // Main draw function
    const draw = (timestamp: number) => {
      if (!ctx) return;
      
      // Calculate delta time for smooth animations
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get audio intensity from frequency data
      let audioIntensity = intensity || 0;
      if (frequencyData && frequencyData.length > 0) {
        const sum = Array.from(frequencyData).reduce((a, b) => a + b, 0);
        audioIntensity = sum / (frequencyData.length * 255); // Normalize to 0-1
      }

      // Update animation parameters based on audio reactivity
      angle += 0.01 * (1 + audioIntensity * 3);
      scale = 0.8 + audioIntensity * 0.7;
      
      // Draw based on visualizer mode
      switch(visualizerMode) {
        case 'flowerOfLife':
          drawFlowerOfLife(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'merkaba':
          drawMerkaba(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'metatronCube':
          drawMetatronCube(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'sriYantra':
          drawSriYantra(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'fibonacciSpiral':
          drawFibonacciSpiral(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'chakraBeam':
          drawChakraBeam(ctx, canvas.width, canvas.height, angle, chakra, audioIntensity);
          break;
          
        case 'primeFlow':
          updateAndDrawParticles(ctx, particles, canvas.width, canvas.height, deltaTime, audioIntensity);
          break;
          
        case 'chakraSpiral':
          drawChakraSpiral(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra, audioIntensity);
          break;
          
        case 'multi':
          drawMultiVisualizer(ctx, canvas.width, canvas.height, angle, chakra, audioIntensity);
          break;
          
        default:
          // Fallback to simple visualization
          drawSimpleVisualizer(ctx, canvas.width, canvas.height, audioIntensity, chakra);
      }
      
      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    animationFrameId.current = requestAnimationFrame(draw);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [chakra, visualizerMode, shouldRender, frequencyData, intensity, liftTheVeil, isActive]);

  // Enhanced Flower of Life pattern with audio reactivity
  const drawFlowerOfLife = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    
    // Create a glow effect based on audio intensity
    ctx.shadowBlur = 15 + audioIntensity * 15;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 + audioIntensity * 2;
    
    // Draw central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw surrounding circles - add more circles for more detail
    const circleCount = 12;
    const ringCount = 2;
    
    for (let ring = 1; ring <= ringCount; ring++) {
      for (let i = 0; i < circleCount; i++) {
        const a = angle * 0.5 + (i * Math.PI * 2) / circleCount;
        const distance = (radius / 2) * ring / ringCount;
        const x = centerX + distance * Math.cos(a);
        const y = centerY + distance * Math.sin(a);
        const pulseRadius = (radius / 3) * (0.9 + audioIntensity * 0.5 * Math.sin(angle * 3 + i));
        
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Draw outer circle with pulsing effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (0.9 + audioIntensity * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    
    // Add subtle particle effects
    const particleCount = Math.floor(20 * (1 + audioIntensity * 2));
    
    for (let i = 0; i < particleCount; i++) {
      const particleAngle = Math.random() * Math.PI * 2;
      const particleRadius = Math.random() * radius;
      const x = centerX + particleRadius * Math.cos(particleAngle);
      const y = centerY + particleRadius * Math.sin(particleAngle);
      const particleSize = 1 + Math.random() * 3 * audioIntensity;
      
      ctx.fillStyle = `${color}${Math.floor(Math.random() * 100 + 155).toString(16)}`;
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Enhanced Merkaba with audio reactivity
  const drawMerkaba = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    
    ctx.shadowBlur = 15 + audioIntensity * 10;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 + audioIntensity * 3;
    
    // Draw two triangles (Merkaba) with rotation and pulsing
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // Dynamic scaling based on audio
    const pulseScale = 1 + audioIntensity * 0.5 * Math.sin(Date.now() / 200);
    
    // First triangle (pointing up)
    ctx.beginPath();
    const upPoints = [];
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      const r = radius * pulseScale;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      upPoints.push({x, y});
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Add glow effect based on audio intensity
    ctx.fillStyle = `${color}${Math.floor(audioIntensity * 40).toString(16)}`;
    ctx.fill();
    
    // Second triangle (pointing down) - counter-rotate
    ctx.rotate(Math.PI / 3 + angle * 0.5);
    
    ctx.beginPath();
    const downPoints = [];
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      const r = radius * pulseScale;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      downPoints.push({x, y});
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Add glow effect based on audio intensity
    ctx.fillStyle = `${color}${Math.floor(audioIntensity * 40).toString(16)}`;
    ctx.fill();
    
    // Draw internal lines connecting the triangles for more detail
    if (audioIntensity > 0.2) {
      ctx.lineWidth = 1 + audioIntensity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(upPoints[i].x, upPoints[i].y);
          ctx.lineTo(downPoints[j].x, downPoints[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.restore();
  };
  
  // Enhanced Metatron's Cube with audio reactivity
  const drawMetatronCube = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    ctx.shadowBlur = 10 + audioIntensity * 15;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 + audioIntensity * 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 3);
    
    // Calculate inner circle points
    const vertexCount = 13; // Enhanced detail
    const vertices = [];
    
    // First add center point
    vertices.push({x: 0, y: 0});
    
    // Add outer ring of vertices
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const x = radius * Math.cos(a);
      const y = radius * Math.sin(a);
      vertices.push({x, y});
    }
    
    // Add inner ring of vertices
    const innerRadius = radius * 0.5;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 + Math.PI / 6;
      const x = innerRadius * Math.cos(a);
      const y = innerRadius * Math.sin(a);
      vertices.push({x, y});
    }
    
    // Draw all connections between vertices
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        // Skip some connections based on audio intensity for a dynamic effect
        if (Math.random() < audioIntensity * 0.5) continue;
        
        ctx.beginPath();
        ctx.moveTo(vertices[i].x, vertices[i].y);
        ctx.lineTo(vertices[j].x, vertices[j].y);
        ctx.stroke();
      }
    }
    
    // Draw vertices as circles with pulse
    for (let i = 0; i < vertices.length; i++) {
      const pulseSize = (1 + audioIntensity * Math.sin(angle * 5 + i)) * 4;
      
      ctx.beginPath();
      ctx.arc(vertices[i].x, vertices[i].y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    // Draw enclosing shape
    ctx.beginPath();
    for (let i = 1; i <= 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const x = radius * Math.cos(a);
      const y = radius * Math.sin(a);
      i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };
  
  // Enhanced Sri Yantra with audio reactivity
  const drawSriYantra = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    ctx.shadowBlur = 15 + audioIntensity * 10;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 + audioIntensity * 1.5;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 6);
    
    // Draw multiple triangles with dynamic scaling
    const triangleCount = 5; // More triangles for more detail
    for (let i = 0; i < triangleCount; i++) {
      const scale = 1 - (i / triangleCount) * 0.7;
      const pulseScale = scale * (0.9 + audioIntensity * 0.3 * Math.sin(angle * 3 + i));
      
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(0, -radius * pulseScale);
      ctx.lineTo(radius * pulseScale, radius * pulseScale / 2);
      ctx.lineTo(-radius * pulseScale, radius * pulseScale / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Add glow effect based on audio intensity
      if (audioIntensity > 0.3) {
        ctx.fillStyle = `${color}${Math.floor(audioIntensity * 20).toString(16)}`;
        ctx.fill();
      }
      
      // Downward triangle
      ctx.beginPath();
      ctx.moveTo(0, radius * pulseScale);
      ctx.lineTo(radius * pulseScale, -radius * pulseScale / 2);
      ctx.lineTo(-radius * pulseScale, -radius * pulseScale / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Add glow effect based on audio intensity
      if (audioIntensity > 0.3) {
        ctx.fillStyle = `${color}${Math.floor(audioIntensity * 20).toString(16)}`;
        ctx.fill();
      }
    }
    
    // Draw lotus petals around the yantra
    const petalCount = 8 + Math.floor(audioIntensity * 8);
    for (let i = 0; i < petalCount; i++) {
      const a = (i * Math.PI * 2) / petalCount;
      const x = (radius * 1.1) * Math.cos(a);
      const y = (radius * 1.1) * Math.sin(a);
      
      // Draw petal
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw center bindu (dot)
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1 * (1 + audioIntensity), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  };
  
  // Enhanced Fibonacci Spiral with audio reactivity
  const drawFibonacciSpiral = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    ctx.shadowBlur = 20 + audioIntensity * 20;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 + audioIntensity * 3;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 2);
    
    // Golden ratio
    const phi = 1.618033988749895;
    
    // Draw multiple spiral arms
    const spiralCount = 3;
    for (let s = 0; s < spiralCount; s++) {
      ctx.save();
      ctx.rotate((s * Math.PI * 2) / spiralCount);
      
      // Draw spiral
      ctx.beginPath();
      let a = 0;
      let r = 1;
      
      for (let i = 0; i < 300; i++) {
        a += 0.1;
        r = Math.pow(phi, a / Math.PI) * 5;
        
        if (r > radius) break;
        
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw golden ratio squares along spiral for extra detail
      if (audioIntensity > 0.3) {
        let a = 0;
        let r = 1;
        
        for (let i = 0; i < 10; i++) {
          a += Math.PI / 2;
          r = Math.pow(phi, a / Math.PI) * 5;
          
          if (r > radius * 0.8) break;
          
          const x = r * Math.cos(a);
          const y = r * Math.sin(a);
          const size = r / (phi * 2);
          
          ctx.strokeRect(x - size/2, y - size/2, size, size);
        }
      }
      
      ctx.restore();
    }
    
    // Add particles along spiral path based on audio
    const particleCount = Math.floor(20 + audioIntensity * 80);
    for (let i = 0; i < particleCount; i++) {
      const particleAngle = Math.random() * Math.PI * 12;
      const r = Math.pow(phi, particleAngle / Math.PI) * 5;
      
      if (r > radius) continue;
      
      const x = r * Math.cos(particleAngle);
      const y = r * Math.sin(particleAngle);
      const particleSize = 1 + Math.random() * 3 * audioIntensity;
      
      ctx.fillStyle = `${color}${Math.floor(Math.random() * 100 + 155).toString(16)}`;
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  // Enhanced Chakra Beam with audio reactivity
  const drawChakraBeam = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 1.8;
    
    // Create subtle background glow
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    bgGradient.addColorStop(0, `${color}33`);
    bgGradient.addColorStop(0.7, `${color}11`);
    bgGradient.addColorStop(1, `${color}00`);
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw concentric circles with gradient
    const circleCount = 7; // Chakra circles
    for (let i = 0; i < circleCount; i++) {
      const radius = (maxRadius * (i + 1)) / circleCount;
      const alpha = 0.5 - i / circleCount * 0.3;
      
      // Pulsing effect based on audio
      const pulseRadius = radius * (0.9 + audioIntensity * 0.3 * Math.sin(angle * 3 + i));
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16)}`;
      ctx.lineWidth = 2 + (circleCount - i) + audioIntensity * 4;
      ctx.stroke();
    }
    
    // Draw beams
    const beamCount = 7; // Chakra beams
    for (let i = 0; i < beamCount; i++) {
      const beamAngle = angle * 0.5 + (i * Math.PI * 2) / beamCount;
      
      // Dynamic beam length based on audio
      const beamScale = 0.8 + audioIntensity * 0.5;
      
      const x1 = centerX + Math.cos(beamAngle) * maxRadius * 0.2;
      const y1 = centerY + Math.sin(beamAngle) * maxRadius * 0.2;
      const x2 = centerX + Math.cos(beamAngle) * maxRadius * beamScale;
      const y2 = centerY + Math.sin(beamAngle) * maxRadius * beamScale;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `${color}ff`);
      gradient.addColorStop(1, `${color}00`);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 5 + audioIntensity * 12;
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }
    
    // Draw center orb with pulsing effect
    const centerSize = 15 + audioIntensity * 25;
    const centerGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, centerSize * 1.5
    );
    centerGlow.addColorStop(0, `${color}ff`);
    centerGlow.addColorStop(0.6, `${color}66`);
    centerGlow.addColorStop(1, `${color}00`);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
    ctx.fillStyle = centerGlow;
    ctx.fill();
    
    // Add additional particle effects based on audio intensity
    if (audioIntensity > 0.3) {
      const particleCount = Math.floor(audioIntensity * 50);
      
      for (let i = 0; i < particleCount; i++) {
        const particleAngle = Math.random() * Math.PI * 2;
        const particleDistance = Math.random() * maxRadius * 0.8;
        const x = centerX + particleDistance * Math.cos(particleAngle);
        const y = centerY + particleDistance * Math.sin(particleAngle);
        const size = 1 + Math.random() * 4 * audioIntensity;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(Math.random() * 100 + 155).toString(16)}`;
        ctx.fill();
      }
    }
  };
  
  // Update and draw particles for PrimeFlow visualizer
  const updateAndDrawParticles = (
    ctx: CanvasRenderingContext2D,
    particles: Array<{ x: number; y: number; radius: number; color: string; speed: number; angle: number }>,
    width: number,
    height: number,
    deltaTime: number,
    audioIntensity: number = 0
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw background glow
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.min(width, height) / 1.5
    );
    
    const baseColor = getChakraColor(chakra);
    bgGradient.addColorStop(0, `${baseColor}33`);
    bgGradient.addColorStop(0.7, `${baseColor}11`);
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw each particle
    particles.forEach(particle => {
      // Update particle position
      const speed = particle.speed * (1 + audioIntensity * 5) * deltaTime / 16;
      particle.x += Math.cos(particle.angle) * speed;
      particle.y += Math.sin(particle.angle) * speed;
      
      // Make particles gravitate toward center with audio influence
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        // More chaotic movement with higher audio intensity
        const chaos = 0.1 + audioIntensity * 0.8;
        particle.angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * chaos;
      }
      
      // Keep particles within bounds
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Draw the particle with dynamic sizing
      const dynamicRadius = particle.radius * (1 + audioIntensity * 2);
      
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        dynamicRadius, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Draw trail with glow effect
      const trailSize = dynamicRadius * 3;
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, trailSize
      );
      gradient.addColorStop(0, `${particle.color}99`);
      gradient.addColorStop(1, `${particle.color}00`);
      
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        trailSize, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw connecting lines between nearby particles for web effect
      if (audioIntensity > 0.4) {
        particles.forEach(otherParticle => {
          if (particle === otherParticle) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect nearby particles
          if (distance < 50 + audioIntensity * 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 150) * 50).toString(16)}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    });
  };
  
  // Enhanced Chakra Spiral with audio reactivity
  const drawChakraSpiral = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const baseColor = getChakraColor(chakraType);
    ctx.lineWidth = 3 + audioIntensity * 7;
    
    // Create background glow
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 1.5
    );
    bgGradient.addColorStop(0, `${baseColor}22`);
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, centerX * 2, centerY * 2);
    
    // Draw multiple spirals with audio reactivity
    const spiralCount = 7; // One for each chakra
    for (let s = 0; s < spiralCount; s++) {
      // Each spiral has a slightly different color
      const hueShift = (s / spiralCount) * 60;
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      
      // Simple color shift algorithm
      const shiftedColor = `rgba(${r}, ${Math.min(g + hueShift, 255)}, ${Math.min(b + hueShift * 2, 255)}, ${0.7 + audioIntensity * 0.3})`;
      
      const spiralAngle = angle + (s * Math.PI * 2) / spiralCount;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(spiralAngle);
      
      ctx.beginPath();
      
      const maxPoints = 150;
      let spiralA = 0;
      let spiralR = 0;
      
      // Dynamic spiral growth based on audio
      const growthFactor = 0.2 + audioIntensity * 0.15;
      
      for (let i = 0; i < maxPoints; i++) {
        spiralA += 0.15;
        spiralR += growthFactor;
        
        if (spiralR > radius) break;
        
        // Add subtle wobble based on audio
        const wobble = audioIntensity * Math.sin(spiralA * 5) * spiralR * 0.1;
        
        const x = (spiralR + wobble) * Math.cos(spiralA);
        const y = (spiralR + wobble) * Math.sin(spiralA);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = shiftedColor;
      ctx.shadowBlur = 10 + audioIntensity * 10;
      ctx.shadowColor = shiftedColor;
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw center circle pulse
    const pulseSize = 15 + audioIntensity * 30;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    
    // Radial gradient for the center
    const centerGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, pulseSize
    );
    centerGradient.addColorStop(0, `${baseColor}ff`);
    centerGradient.addColorStop(0.7, `${baseColor}99`);
    centerGradient.addColorStop(1, `${baseColor}33`);
    
    ctx.fillStyle = centerGradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = baseColor;
    ctx.fill();
    
    // Add particles emanating from center based on audio intensity
    if (audioIntensity > 0.3) {
      const particleCount = Math.floor(audioIntensity * 50);
      
      for (let i = 0; i < particleCount; i++) {
        const particleAngle = Math.random() * Math.PI * 2;
        const particleDistance = Math.random() * radius * 0.8;
        const x = centerX + particleDistance * Math.cos(particleAngle);
        const y = centerY + particleDistance * Math.sin(particleAngle);
        const size = 1 + Math.random() * 3 * audioIntensity;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${Math.floor(Math.random() * 100 + 155).toString(16)}`;
        ctx.fill();
      }
    }
  };
  
  // Draw combined visualizer for multi mode
  const drawMultiVisualizer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    angle: number,
    chakraType: ChakraType,
    audioIntensity: number = 0
  ) => {
    const gridSize = 2;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    const radius = Math.min(cellWidth, cellHeight) * 0.4;
    
    // Draw four different patterns in a grid
    drawFlowerOfLife(ctx, cellWidth * 0.5, cellHeight * 0.5, radius, angle, chakraType, audioIntensity);
    drawMerkaba(ctx, cellWidth * 1.5, cellHeight * 0.5, radius, angle, chakraType, audioIntensity);
    drawSriYantra(ctx, cellWidth * 0.5, cellHeight * 1.5, radius, angle, chakraType, audioIntensity);
    drawMetatronCube(ctx, cellWidth * 1.5, cellHeight * 1.5, radius, angle, chakraType, audioIntensity);
  };
  
  // Simple fallback visualizer with audio reactivity
  const drawSimpleVisualizer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number = 0,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3 * (0.8 + intensity * 0.6);
    
    // Create a glow effect
    ctx.shadowBlur = 15 + intensity * 15;
    ctx.shadowColor = color;
    
    // Main circle with pulsation
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 + intensity * 8;
    ctx.stroke();
    
    // Add some pulsing circles
    const pulseCount = 5;
    for (let i = 0; i < pulseCount; i++) {
      const pulseRadius = radius * (0.3 + i * 0.18) * (0.9 + Math.sin(Date.now() / 500 + i) * 0.1 + intensity * 0.3);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}${Math.floor(80 - i * 15).toString(16)}`;
      ctx.lineWidth = 2 - i * 0.2 + intensity * 2;
      ctx.stroke();
    }
    
    // Add dynamic particles based on audio intensity
    if (intensity > 0.2) {
      const particleCount = Math.floor(intensity * 50);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 1.2;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        const size = 1 + Math.random() * 3 * intensity;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(Math.random() * 100 + 155).toString(16)}`;
        ctx.fill();
      }
    }
    
    // Add a subtle background glow
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 2
    );
    bgGradient.addColorStop(0, `${color}11`);
    bgGradient.addColorStop(0.5, `${color}08`);
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  };
  
  if (!shouldRender) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <p className="text-white/50">Visualizer unavailable</p>
      </div>
    );
  }
  
  // If multiView is enabled, use a grid layout
  if (multiView || visualizerMode === 'multi') {
    return (
      <div className="w-full h-full relative">
        <canvas
          id="geometry-canvas"
          ref={canvasRef} 
          className="w-full h-full absolute top-0 left-0"
        />
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 relative">
      <canvas 
        id="geometry-canvas"
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0"
        style={{ 
          opacity: 0.9
        }}
      />
      <div className="absolute bottom-2 left-2 text-white text-xs opacity-50 z-10">
        {visualizerMode} • {chakra} chakra
      </div>
    </div>
  );
};

export default SacredVisualizerCanvas;
