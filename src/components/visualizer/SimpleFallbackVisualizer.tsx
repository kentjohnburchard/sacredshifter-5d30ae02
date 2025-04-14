
import React, { useRef, useEffect, useState } from 'react';
import { isPrime } from '@/lib/mathUtils';

interface SimpleFallbackVisualizerProps {
  audioData?: Uint8Array;
  colorScheme?: string;
  sensitivity?: number;
  showPrimeIndicators?: boolean;
  geometryComplexity?: 'simple' | 'medium' | 'complex';
  activePrimes?: number[];
}

const SimpleFallbackVisualizer: React.FC<SimpleFallbackVisualizerProps> = ({
  audioData,
  colorScheme = 'purple',
  sensitivity = 1.0,
  showPrimeIndicators = true,
  geometryComplexity = 'medium',
  activePrimes = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    hue: number;
    sides: number;
    isPrime?: boolean;
  }>>([]);
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle color scheme selection
  const getBaseColor = () => {
    switch (colorScheme) {
      case 'blue': return { r: 30, g: 144, b: 255, hue: 210 };
      case 'gold': return { r: 255, g: 215, b: 0, hue: 50 };
      case 'pink': return { r: 255, g: 105, b: 180, hue: 330 };
      case 'rainbow': return { r: 148, g: 0, b: 211, hue: 270 }; // Will use dynamic hues
      case 'chakra': return { r: 138, g: 43, b: 226, hue: 270 }; // Will adjust based on frequency
      default: return { r: 147, g: 112, b: 219, hue: 260 }; // Purple default
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize particles
  useEffect(() => {
    // Determine number of particles based on complexity
    const particleCount = geometryComplexity === 'simple' ? 20 : 
                         geometryComplexity === 'medium' ? 35 : 50;
    
    particlesRef.current = Array(particleCount).fill(0).map((_, i) => {
      const isPrimeParticle = i % 10 === 0; // Make some particles prime-related
      return {
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: 5 + Math.random() * 10,
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (0.002 + Math.random() * 0.01) * (Math.random() > 0.5 ? 1 : -1),
        opacity: 0.4 + Math.random() * 0.4,
        hue: getBaseColor().hue + (Math.random() * 60 - 30),
        sides: Math.floor(Math.random() * 5) + 3, // 3-7 sides for polygons
        isPrime: isPrimeParticle
      };
    });
  }, [windowSize, geometryComplexity]);

  // Draw a polygon with specified sides
  const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number, rotation: number) => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI / sides);
      const pointX = x + radius * Math.cos(angle);
      const pointY = y + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    ctx.closePath();
  };
  
  // Draw a sacred geometry mandala
  const drawMandala = (ctx: CanvasRenderingContext2D, x: number, y: number, outerRadius: number, innerRadius: number, petals: number, rotation: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    for (let i = 0; i < petals; i++) {
      const angle = (i * 2 * Math.PI / petals);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        outerRadius * 0.5 * Math.cos(angle - 0.2),
        outerRadius * 0.5 * Math.sin(angle - 0.2),
        outerRadius * Math.cos(angle),
        outerRadius * Math.sin(angle)
      );
      ctx.quadraticCurveTo(
        outerRadius * 0.5 * Math.cos(angle + 0.2),
        outerRadius * 0.5 * Math.sin(angle + 0.2),
        0, 0
      );
      
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  };
  
  // Draw flower of life pattern - a sacred geometry classic
  const drawSacredFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, layers: number, rotation: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw the seed of life pattern
    for (let layer = 1; layer <= layers; layer++) {
      const circleRadius = radius * (layer / layers);
      const circlesToDraw = layer * 6;
      
      for (let i = 0; i < circlesToDraw; i++) {
        const angle = rotation + (i * Math.PI * 2 / circlesToDraw);
        const distanceFromCenter = circleRadius * 0.5;
        
        ctx.beginPath();
        ctx.arc(
          distanceFromCenter * Math.cos(angle),
          distanceFromCenter * Math.sin(angle),
          circleRadius * 0.5,
          0,
          Math.PI * 2
        );
        
        ctx.fillStyle = `${color}${Math.floor(40 / layer).toString(16)}`;
        ctx.fill();
      }
    }
    
    // Draw center
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  };

  // Draw Sri Yantra - more complex sacred geometry
  const drawSriYantra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    const drawTriangle = (innerPct: number, outerPct: number, pointUp: boolean) => {
      const innerSize = size * innerPct;
      const outerSize = size * outerPct;
      
      ctx.beginPath();
      if (pointUp) {
        ctx.moveTo(0, -outerSize); // Top point
        ctx.lineTo(innerSize, innerSize/1.5); // Bottom right
        ctx.lineTo(-innerSize, innerSize/1.5); // Bottom left
      } else {
        ctx.moveTo(0, outerSize); // Bottom point
        ctx.lineTo(innerSize, -innerSize/1.5); // Top right
        ctx.lineTo(-innerSize, -innerSize/1.5); // Top left
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
    };
    
    // Draw multiple triangles
    for (let i = 0; i < 5; i++) {
      // Upward triangles
      drawTriangle(0.4 + i * 0.1, 0.7 - i * 0.05, true);
      // Downward triangles
      drawTriangle(0.4 + i * 0.1, 0.7 - i * 0.05, false);
    }
    
    // Draw central dot (bindu)
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, size * (0.2 * i), 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    
    ctx.restore();
  };
  
  // Draw fractal tree - recursive
  const drawFractalTree = (ctx: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, depth: number, branchWidth: number, color: string) => {
    if (depth === 0) return;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Draw branch
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.lineWidth = branchWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    
    if (depth === 1) {
      // Draw leaf at endpoints
      ctx.beginPath();
      ctx.arc(0, -length, length * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else {
      // Recursively draw branches
      const newLength = length * 0.67;
      const newWidth = branchWidth * 0.7;
      
      // Right branch
      drawFractalTree(
        ctx, 
        0, 
        -length, 
        newLength, 
        angle + 0.4, 
        depth - 1, 
        newWidth,
        color
      );
      
      // Left branch
      drawFractalTree(
        ctx, 
        0, 
        -length, 
        newLength, 
        angle - 0.4, 
        depth - 1, 
        newWidth,
        color
      );
    }
    
    ctx.restore();
  };

  // Draw Metatron's Cube - advanced sacred geometry
  const drawMetatronsCube = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Draw 13 circles (Fruit of Life pattern)
    const drawCircle = (offsetX: number, offsetY: number) => {
      ctx.beginPath();
      ctx.arc(offsetX * size, offsetY * size, size * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.stroke();
    };
    
    // Center circle
    drawCircle(0, 0);
    
    // First ring - 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 2 * (i / 6);
      drawCircle(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4);
    }
    
    // Connect lines of cube
    ctx.beginPath();
    
    // Draw the platonic solids embedded in the pattern
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = Math.PI * 2 * (i / 10);
      points.push({
        x: Math.cos(angle) * size * 0.8,
        y: Math.sin(angle) * size * 0.8
      });
    }
    
    // Connect all points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = `${color}40`; // Semi-transparent
        ctx.stroke();
      }
    }
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation state
    let time = 0;
    const baseColor = getBaseColor();
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;
      
      // Calculate audio reactivity
      let audioAmplitude = 0.5; // Default for no audio
      let bassValue = 0;
      let midValue = 0;
      let trebleValue = 0;
      let isPrimeFrequency = false;
      
      if (audioData && audioData.length > 0) {
        // Calculate different frequency bands
        const bassRange = audioData.slice(0, Math.min(8, audioData.length));
        const midRange = audioData.slice(Math.min(8, audioData.length), Math.min(24, audioData.length));
        const trebleRange = audioData.slice(Math.min(24, audioData.length));
        
        bassValue = bassRange.reduce((acc, val) => acc + val, 0) / bassRange.length / 255;
        midValue = midRange.reduce((acc, val) => acc + val, 0) / midRange.length / 255;
        trebleValue = trebleRange.reduce((acc, val) => acc + val, 0) / trebleRange.length / 255;
        
        audioAmplitude = (bassValue + midValue + trebleValue) / 3;
        
        // Check for prime frequency energy peaks
        isPrimeFrequency = activePrimes.length > 0;
      }
      
      // Apply sensitivity multiplier
      audioAmplitude = Math.min(1.0, audioAmplitude * sensitivity);
      bassValue = Math.min(1.0, bassValue * sensitivity);
      midValue = Math.min(1.0, midValue * sensitivity);
      trebleValue = Math.min(1.0, trebleValue * sensitivity);
      
      // Center of the canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Create main radial gradient
      const gradientSize = Math.min(canvas.width, canvas.height) * (0.4 + audioAmplitude * 0.3);
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, gradientSize
      );
      
      if (colorScheme === 'rainbow') {
        const hue = (time * 20) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${0.7 + audioAmplitude * 0.3})`);
        gradient.addColorStop(0.8, `hsla(${(hue + 60) % 360}, 100%, 50%, 0.3)`);
        gradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 100%, 40%, 0)`);
      } else {
        let colorString = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}`;
        gradient.addColorStop(0, `${colorString}, ${0.7 + audioAmplitude * 0.3})`);
        gradient.addColorStop(0.7, `${colorString}, 0.2)`);
        gradient.addColorStop(1, `${colorString}, 0)`);
      }
      
      // Draw main circular glow
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, gradientSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw sacred geometry patterns
      const pulsingFactor = 1 + 0.2 * Math.sin(time * 2);
      const reactiveRadius = gradientSize * 0.7 * pulsingFactor * (1 + audioAmplitude * 0.3);
      
      // Draw flower of life pattern
      if (colorScheme === 'rainbow') {
        const cycleHue = (time * 20) % 360;
        const hueString = `hsla(${cycleHue}, 100%, 60%, 0.6)`;
        drawSacredFlower(
          ctx, 
          centerX, 
          centerY, 
          reactiveRadius * 0.8,
          2 + Math.floor(audioAmplitude * 3),
          time * 0.2,
          hueString
        );
      } else {
        const colorString = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.6)`;
        drawSacredFlower(
          ctx, 
          centerX, 
          centerY, 
          reactiveRadius * 0.8,
          2 + Math.floor(audioAmplitude * 3),
          time * 0.2,
          colorString
        );
      }
      
      // Draw mandala
      const mandalaPetals = 6 + Math.floor(midValue * 12);
      if (colorScheme === 'rainbow') {
        const cycleHue = ((time * 20) + 120) % 360;
        const hueString = `hsla(${cycleHue}, 100%, 60%, 0.5)`;
        drawMandala(
          ctx, 
          centerX, 
          centerY, 
          reactiveRadius * (0.6 + midValue * 0.4), 
          reactiveRadius * 0.2 * (1 + bassValue * 0.5),
          mandalaPetals,
          time * 0.3 * (isPrimeFrequency ? 2 : 1),
          hueString
        );
      } else {
        const colorString = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.5)`;
        drawMandala(
          ctx, 
          centerX, 
          centerY, 
          reactiveRadius * (0.6 + midValue * 0.4), 
          reactiveRadius * 0.2 * (1 + bassValue * 0.5),
          mandalaPetals,
          time * 0.3 * (isPrimeFrequency ? 2 : 1),
          colorString
        );
      }
      
      // Draw more complex geometry based on complexity setting
      if (geometryComplexity === 'complex') {
        // Draw Metatron's Cube
        if (colorScheme === 'rainbow') {
          const cycleHue = ((time * 20) + 180) % 360;
          const hueString = `hsla(${cycleHue}, 100%, 70%, 0.3)`;
          drawMetatronsCube(
            ctx,
            centerX,
            centerY,
            reactiveRadius * 0.9,
            time * 0.1,
            hueString
          );
        } else {
          const colorString = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.3)`;
          drawMetatronsCube(
            ctx,
            centerX,
            centerY,
            reactiveRadius * 0.9,
            time * 0.1,
            colorString
          );
        }
      } else if (geometryComplexity === 'medium') {
        // Draw Sri Yantra for medium complexity
        if (colorScheme === 'rainbow') {
          const cycleHue = ((time * 20) + 240) % 360;
          const hueString = `hsla(${cycleHue}, 100%, 70%, 0.3)`;
          drawSriYantra(
            ctx,
            centerX,
            centerY,
            reactiveRadius * 0.8,
            time * 0.05,
            hueString
          );
        } else {
          const colorString = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.3)`;
          drawSriYantra(
            ctx,
            centerX,
            centerY,
            reactiveRadius * 0.8,
            time * 0.05,
            colorString
          );
        }
      }
      
      // Draw frequency bands
      if (audioData && audioData.length > 0) {
        const totalBars = Math.min(32, audioData.length / 4);
        const barWidth = canvas.width / totalBars;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighten';
        
        for (let i = 0; i < totalBars; i++) {
          const audioIndex = Math.floor(i * audioData.length / totalBars);
          const value = audioData[audioIndex] / 255.0;
          
          if (value < 0.05) continue;
          
          const barHeight = value * canvas.height * 0.25 * sensitivity;
          const angle = (i / totalBars) * Math.PI * 2;
          const distance = reactiveRadius * 0.8;
          
          const x1 = centerX + Math.cos(angle) * distance;
          const y1 = centerY + Math.sin(angle) * distance;
          
          const x2 = centerX + Math.cos(angle) * (distance + barHeight);
          const y2 = centerY + Math.sin(angle) * (distance + barHeight);
          
          // Highlight prime frequencies
          const isCurrentFreqPrime = isPrime(i + 2);
          
          // Create line gradient
          const lineGradient = ctx.createLinearGradient(x1, y1, x2, y2);
          
          if (colorScheme === 'rainbow') {
            const hue = (i / totalBars * 360 + time * 10) % 360;
            lineGradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.1)`);
            lineGradient.addColorStop(1, `hsla(${hue}, 100%, 70%, ${isCurrentFreqPrime && showPrimeIndicators ? 0.9 : 0.7})`);
          } else {
            lineGradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`);
            lineGradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${isCurrentFreqPrime && showPrimeIndicators ? 0.9 : 0.7})`);
          }
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = barWidth * 0.8;
          ctx.strokeStyle = lineGradient;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        
        ctx.restore();
      }
      
      // Draw particles with sacred geometry shapes
      ctx.save();
      ctx.globalCompositeOperation = 'lighten';
      
      particlesRef.current.forEach(particle => {
        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.speed * (1 + audioAmplitude);
        particle.y += Math.sin(particle.angle) * particle.speed * (1 + audioAmplitude);
        particle.rotation += particle.rotationSpeed * (1 + midValue * 2);
        
        // Reset particles that go off-screen
        if (particle.x < -50 || particle.x > canvas.width + 50 || 
            particle.y < -50 || particle.y > canvas.height + 50) {
          particle.x = centerX + (Math.random() - 0.5) * canvas.width * 0.5;
          particle.y = centerY + (Math.random() - 0.5) * canvas.height * 0.5;
          particle.size = 5 + Math.random() * 10 + (audioAmplitude * 15);
          particle.angle = Math.random() * Math.PI * 2;
        }
        
        // Draw the shape
        const reactiveSize = particle.size * (1 + audioAmplitude * 0.5);
        
        if (colorScheme === 'rainbow') {
          const hue = (particle.hue + time * 10) % 360;
          const colorString = `hsla(${hue}, 100%, 70%, ${particle.opacity})`;
          ctx.fillStyle = colorString;
        } else {
          ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${particle.opacity})`;
        }
        
        // If prime particle, draw a special shape
        if (particle.isPrime && showPrimeIndicators && isPrimeFrequency) {
          if (geometryComplexity === 'complex') {
            // Draw mini fractal trees
            drawFractalTree(
              ctx, 
              particle.x, 
              particle.y, 
              reactiveSize * 2, 
              0, 
              3, 
              1.5, 
              ctx.fillStyle
            );
          } else {
            // Draw a star
            const points = 5;
            const outerRadius = reactiveSize;
            const innerRadius = reactiveSize * 0.5;
            
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / points + particle.rotation;
              
              const x = particle.x + radius * Math.cos(angle);
              const y = particle.y + radius * Math.sin(angle);
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.fill();
          }
        } else {
          drawPolygon(
            ctx, 
            particle.x, 
            particle.y, 
            reactiveSize, 
            particle.sides, 
            particle.rotation
          );
          
          ctx.fill();
        }
      });
      
      ctx.restore();
      
      // Special effect for prime frequencies
      if (isPrimeFrequency && showPrimeIndicators) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const primeRadius = reactiveRadius * 1.2;
        const primeGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, primeRadius
        );
        
        // Strong pink/magenta pulse for prime frequencies
        const pulseIntensity = 0.4 + 0.2 * Math.sin(time * 6);
        
        if (colorScheme === 'rainbow') {
          const hue = (time * 100) % 360;
          primeGradient.addColorStop(0, `hsla(300, 100%, 70%, ${pulseIntensity})`);
          primeGradient.addColorStop(0.7, `hsla(330, 100%, 60%, ${pulseIntensity * 0.5})`);
          primeGradient.addColorStop(1, `hsla(350, 100%, 50%, 0)`);
        } else {
          primeGradient.addColorStop(0, `rgba(255, 105, 180, ${pulseIntensity})`);
          primeGradient.addColorStop(0.7, `rgba(238, 130, 238, ${pulseIntensity * 0.5})`);
          primeGradient.addColorStop(1, `rgba(199, 21, 133, 0)`);
        }
        
        ctx.fillStyle = primeGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, primeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sacred geometry burst
        const burstPoints = 8;
        for (let i = 0; i < burstPoints; i++) {
          const angle = (i / burstPoints) * Math.PI * 2 + time;
          const innerRadius = reactiveRadius * 0.6;
          const outerRadius = reactiveRadius * 0.9;
          
          const ix1 = centerX + Math.cos(angle) * innerRadius;
          const iy1 = centerY + Math.sin(angle) * innerRadius;
          
          const ox1 = centerX + Math.cos(angle) * outerRadius;
          const oy1 = centerY + Math.sin(angle) * outerRadius;
          
          const ix2 = centerX + Math.cos(angle + 0.2) * innerRadius;
          const iy2 = centerY + Math.sin(angle + 0.2) * innerRadius;
          
          const ox2 = centerX + Math.cos(angle + 0.2) * outerRadius;
          const oy2 = centerY + Math.sin(angle + 0.2) * outerRadius;
          
          ctx.beginPath();
          ctx.moveTo(ix1, iy1);
          ctx.lineTo(ox1, oy1);
          ctx.lineTo(ox2, oy2);
          ctx.lineTo(ix2, iy2);
          ctx.closePath();
          
          if (colorScheme === 'rainbow') {
            const hue = (i / burstPoints * 360 + time * 50) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.6)`;
          } else {
            ctx.fillStyle = `rgba(255, 105, 180, 0.6)`;
          }
          
          ctx.fill();
        }
        
        // Draw active prime numbers as visual elements
        if (activePrimes.length > 0) {
          ctx.font = `bold ${Math.floor(reactiveRadius * 0.1)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          activePrimes.forEach((prime, idx) => {
            const angle = (idx / activePrimes.length) * Math.PI * 2;
            const distance = reactiveRadius * 0.5;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Draw a glowing circle behind the text
            const glowRadius = reactiveRadius * 0.08;
            
            const glowGradient = ctx.createRadialGradient(
              x, y, 0,
              x, y, glowRadius
            );
            
            glowGradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
            glowGradient.addColorStop(0.7, `rgba(255, 105, 180, 0.6)`);
            glowGradient.addColorStop(1, `rgba(255, 20, 147, 0)`);
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw the prime number
            ctx.fillStyle = '#ffffff';
            ctx.fillText(prime.toString(), x, y);
          });
        }
        
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, colorScheme, sensitivity, showPrimeIndicators, geometryComplexity, activePrimes]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default SimpleFallbackVisualizer;
