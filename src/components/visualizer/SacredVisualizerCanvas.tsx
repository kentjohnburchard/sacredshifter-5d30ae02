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
      const particleCount = 100;
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

      // Update animation parameters
      angle += 0.01 * (1 + audioIntensity * 2);
      scale = 0.8 + audioIntensity * 0.4;
      
      // Draw based on visualizer mode
      switch(visualizerMode) {
        case 'flowerOfLife':
          drawFlowerOfLife(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra);
          break;
          
        case 'merkaba':
          drawMerkaba(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra);
          break;
          
        case 'metatronCube':
          drawMetatronCube(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra);
          break;
          
        case 'sriYantra':
          drawSriYantra(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra);
          break;
          
        case 'fibonacciSpiral':
          drawFibonacciSpiral(ctx, canvas.width / 2, canvas.height / 2, canvas.height / 3 * scale, angle, chakra);
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
          drawMultiVisualizer(ctx, canvas.width, canvas.height, angle, chakra);
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
  }, [chakra, visualizerMode, shouldRender, frequencyData, intensity, liftTheVeil]);

  // Simplified Flower of Life pattern
  const drawFlowerOfLife = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw surrounding circles
    const circleCount = 6;
    for (let i = 0; i < circleCount; i++) {
      const a = angle + (i * Math.PI * 2) / circleCount;
      const x = centerX + (radius / 2) * Math.cos(a);
      const y = centerY + (radius / 2) * Math.sin(a);
      
      ctx.beginPath();
      ctx.arc(x, y, radius / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  };
  
  // Simplified Merkaba
  const drawMerkaba = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw two triangles (simplified Merkaba)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // First triangle (pointing up)
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * Math.cos(Math.PI / 6), radius * Math.sin(Math.PI / 6));
    ctx.lineTo(-radius * Math.cos(Math.PI / 6), radius * Math.sin(Math.PI / 6));
    ctx.closePath();
    ctx.stroke();
    
    // Second triangle (pointing down)
    ctx.beginPath();
    ctx.moveTo(0, radius);
    ctx.lineTo(radius * Math.cos(Math.PI / 6), -radius * Math.sin(Math.PI / 6));
    ctx.lineTo(-radius * Math.cos(Math.PI / 6), -radius * Math.sin(Math.PI / 6));
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };
  
  // Simplified Metatron's Cube
  const drawMetatronCube = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 3);
    
    // Draw a hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const x = radius * Math.cos(a);
      const y = radius * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Draw internal lines
    for (let i = 0; i < 6; i++) {
      const a1 = (i * Math.PI * 2) / 6;
      const x1 = radius * Math.cos(a1);
      const y1 = radius * Math.sin(a1);
      
      for (let j = i + 1; j < 6; j++) {
        const a2 = (j * Math.PI * 2) / 6;
        const x2 = radius * Math.cos(a2);
        const y2 = radius * Math.sin(a2);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  };
  
  // Simplified Sri Yantra
  const drawSriYantra = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 4);
    
    // Draw triangles
    const triangleCount = 3;
    for (let i = 0; i < triangleCount; i++) {
      const scale = 1 - i * 0.25;
      
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(0, -radius * scale);
      ctx.lineTo(radius * scale, radius * scale / 2);
      ctx.lineTo(-radius * scale, radius * scale / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Downward triangle
      ctx.beginPath();
      ctx.moveTo(0, radius * scale);
      ctx.lineTo(radius * scale, -radius * scale / 2);
      ctx.lineTo(-radius * scale, -radius * scale / 2);
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  };
  
  // Fibonacci Spiral
  const drawFibonacciSpiral = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const color = getChakraColor(chakraType);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle / 2);
    
    // Golden ratio
    const phi = 1.618033988749895;
    
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
    
    ctx.restore();
  };
  
  // Chakra Beam
  const drawChakraBeam = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    angle: number,
    chakraType: ChakraType,
    intensity: number = 0
  ) => {
    const color = getChakraColor(chakraType);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    
    // Draw concentric circles with gradient
    const circleCount = 10;
    for (let i = 0; i < circleCount; i++) {
      const radius = (maxRadius * (i + 1)) / circleCount;
      const alpha = 1 - i / circleCount;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha * 0.5})`;
      ctx.lineWidth = 2 + intensity * 3;
      ctx.stroke();
    }
    
    // Draw beams
    const beamCount = 8;
    for (let i = 0; i < beamCount; i++) {
      const beamAngle = angle + (i * Math.PI * 2) / beamCount;
      const x1 = centerX + Math.cos(beamAngle) * maxRadius * 0.2;
      const y1 = centerY + Math.sin(beamAngle) * maxRadius * 0.2;
      const x2 = centerX + Math.cos(beamAngle) * maxRadius;
      const y2 = centerY + Math.sin(beamAngle) * maxRadius;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `${color}ff`);
      gradient.addColorStop(1, `${color}00`);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 3 + intensity * 8;
      ctx.strokeStyle = gradient;
      ctx.stroke();
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
      centerX, centerY, Math.min(width, height) / 2
    );
    bgGradient.addColorStop(0, 'rgba(100, 100, 255, 0.2)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw each particle
    particles.forEach(particle => {
      // Update particle position
      const speed = particle.speed * (1 + audioIntensity * 3) * deltaTime / 16;
      particle.x += Math.cos(particle.angle) * speed;
      particle.y += Math.sin(particle.angle) * speed;
      
      // Make particles gravitate toward center
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        particle.angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;
      }
      
      // Keep particles within bounds
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Draw the particle
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        particle.radius * (1 + audioIntensity), 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Draw trail
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, `${particle.color}99`);
      gradient.addColorStop(1, `${particle.color}00`);
      
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        particle.radius * 3 * (1 + audioIntensity), 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };
  
  // Chakra Spiral
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
    ctx.lineWidth = 3 + audioIntensity * 5;
    
    // Draw multiple spirals
    const spiralCount = 7;
    for (let s = 0; s < spiralCount; s++) {
      const spiralAngle = angle + (s * Math.PI * 2) / spiralCount;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(spiralAngle);
      
      ctx.beginPath();
      
      const maxPoints = 100;
      let a = 0;
      let r = 0;
      const growthFactor = 0.2 + audioIntensity * 0.1;
      
      for (let i = 0; i < maxPoints; i++) {
        a += 0.2;
        r += growthFactor;
        
        if (r > radius) break;
        
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Create color with varying transparency
      const hue = parseInt(baseColor.slice(1), 16);
      const red = (hue >> 16) & 255;
      const green = (hue >> 8) & 255;
      const blue = hue & 255;
      ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.7 + audioIntensity * 0.3})`;
      
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw center circle pulse
    const pulseSize = 10 + audioIntensity * 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = baseColor + 'aa';
    ctx.fill();
  };
  
  // Draw combined visualizer for multi mode
  const drawMultiVisualizer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    angle: number,
    chakraType: ChakraType
  ) => {
    const gridSize = 2;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    const radius = Math.min(cellWidth, cellHeight) * 0.4;
    
    // Draw four different patterns in a grid
    drawFlowerOfLife(ctx, cellWidth * 0.5, cellHeight * 0.5, radius, angle, chakraType);
    drawMerkaba(ctx, cellWidth * 1.5, cellHeight * 0.5, radius, angle, chakraType);
    drawSriYantra(ctx, cellWidth * 0.5, cellHeight * 1.5, radius, angle, chakraType);
    drawMetatronCube(ctx, cellWidth * 1.5, cellHeight * 1.5, radius, angle, chakraType);
  };
  
  // Simple fallback visualizer
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
    const radius = Math.min(width, height) * 0.3 * (0.8 + intensity * 0.4);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 + intensity * 5;
    ctx.stroke();
    
    // Add some pulsing circles
    const pulseCount = 3;
    for (let i = 0; i < pulseCount; i++) {
      const pulseRadius = radius * (0.5 + i * 0.2) * (0.9 + Math.sin(Date.now() / 500 + i) * 0.1);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}${Math.floor(80 - i * 20).toString(16)}`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
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
