
import React, { useRef, useEffect } from 'react';
import { VisualizerMode, ChakraType, getChakraColor } from './sacred-geometries';
import { isPrime } from '@/lib/primeUtils';
import { useTheme } from '@/context/ThemeContext';

interface CanvasBasedVisualizerProps {
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  visualizerMode?: VisualizerMode;
  intensity?: number;
  isActive?: boolean;
}

const CanvasBasedVisualizer: React.FC<CanvasBasedVisualizerProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'flowerOfLife',
  intensity = 0,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const { liftTheVeil } = useTheme?.() || { liftTheVeil: false };
  
  // Get the chakra color
  const chakraColor = getChakraColor(chakra);
  
  // Main drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw after resize
      draw(0);
    };
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Main animation variables
    let particles: {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      angle: number;
      isPrime?: boolean;
    }[] = [];
    
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let rotation = 0;
    let time = 0;
    
    // Generate particles based on the visualization mode
    const initializeParticles = () => {
      particles = [];
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      
      const totalParticles = visualizerMode === 'primeFlow' ? 200 : 100;
      
      for (let i = 0; i < totalParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150 + 50;
        const num = Math.floor(Math.random() * 1000);
        const isPrimeNum = isPrime(num);
        
        // Create particle with 3D coordinates
        particles.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: Math.random() * 200 - 100,
          size: Math.random() * 4 + 2,
          color: isPrimeNum ? '#ffd700' : chakraColor,
          speed: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          angle: angle,
          isPrime: isPrimeNum
        });
      }
    };
    
    // Draw flower of life pattern
    const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.1;
      const numCircles = 7;
      
      // Draw the background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Create flower of life pattern with pseudo 3D effect
      for (let i = 0; i < numCircles; i++) {
        const angle = (i / numCircles) * Math.PI * 2 + time * 0.1;
        const radius = baseRadius * 1.8;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Draw circles with glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, baseRadius);
        gradient.addColorStop(0, chakraColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw connecting lines
        for (let j = 0; j < i; j++) {
          const angle2 = (j / numCircles) * Math.PI * 2 + time * 0.1;
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.3)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      
      // Draw central circle with pulsing effect
      const pulseScale = 1 + Math.sin(time * 2) * 0.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = liftTheVeil ? '#ff1493' : chakraColor;
      ctx.fill();
      
      // Add particles orbiting around
      particles.forEach((particle, i) => {
        const orbit = baseRadius * 2.5;
        const speed = 0.001 * particle.speed;
        particle.angle += speed;
        
        const x = centerX + Math.cos(particle.angle) * orbit;
        const y = centerY + Math.sin(particle.angle) * orbit;
        
        ctx.beginPath();
        ctx.arc(x, y, particle.size * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : chakraColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw merkaba geometry
    const drawMerkaba = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.2;
      const rotation = time * 0.2;
      
      // Draw the two tetrahedrons
      const drawTetrahedron = (rotation: number, scale: number, color: string, opacity: number) => {
        // Define tetrahedron points in 3D space (simplified for 2D)
        const points = [
          { x: 0, y: -size * scale, z: 0 },
          { x: -size * scale * 0.866, y: size * scale * 0.5, z: 0 },
          { x: size * scale * 0.866, y: size * scale * 0.5, z: 0 },
          { x: 0, y: 0, z: size * scale }
        ];
        
        // Project 3D points onto the canvas with rotation
        const projectedPoints = points.map(p => {
          const rotX = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
          const rotZ = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
          return {
            x: centerX + rotX,
            y: centerY + p.y,
            z: rotZ
          };
        });
        
        // Draw the tetrahedron faces
        const faces = [
          [0, 1, 2],
          [0, 1, 3],
          [1, 2, 3],
          [0, 2, 3]
        ];
        
        faces.forEach(face => {
          const [a, b, c] = face;
          ctx.beginPath();
          ctx.moveTo(projectedPoints[a].x, projectedPoints[a].y);
          ctx.lineTo(projectedPoints[b].x, projectedPoints[b].y);
          ctx.lineTo(projectedPoints[c].x, projectedPoints[c].y);
          ctx.closePath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Fill with gradient
          const gradient = ctx.createLinearGradient(
            projectedPoints[a].x, projectedPoints[a].y,
            projectedPoints[c].x, projectedPoints[c].y
          );
          gradient.addColorStop(0, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity * 0.3})`);
          gradient.addColorStop(1, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity * 0.1})`);
          
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      };
      
      // Draw first tetrahedron (upward)
      drawTetrahedron(rotation, 1.0, chakraColor, 0.7);
      
      // Draw second tetrahedron (downward)
      drawTetrahedron(rotation + Math.PI, 1.0, liftTheVeil ? '#ff1493' : chakraColor, 0.5);
      
      // Add particles floating around
      particles.forEach((particle, i) => {
        // Calculate 3D position with rotation
        const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y + particle.z * particle.z);
        const orbitRadius = size * 2;
        const scale = orbitRadius / (distance || 1);
        
        // Update position
        particle.x = particle.x * 0.99 + Math.cos(particle.angle + time * particle.speed) * scale * particle.speed;
        particle.y = particle.y * 0.99 + Math.sin(particle.angle + time * particle.speed) * scale * particle.speed;
        particle.z = particle.z * 0.99 + Math.cos(particle.angle * 2 + time * particle.speed) * scale * particle.speed;
        
        // Project 3D to 2D
        const perspective = 400;
        const depth = perspective / (perspective + particle.z);
        const projX = centerX + particle.x * depth;
        const projY = centerY + particle.y * depth;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(projX, projY, particle.size * depth, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : chakraColor;
        ctx.globalAlpha = particle.opacity * depth;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw metatron's cube
    const drawMetatronCube = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3;
      const rotation = time * 0.1;
      
      // Define the 13 points of Metatron's Cube in 3D space
      const createPoint = (angle: number, radius: number, height: number) => {
        // Rotate in 3D space
        const x = Math.cos(angle + rotation) * radius;
        const z = Math.sin(angle + rotation) * radius;
        return {
          x: x,
          y: height,
          z: z
        };
      };
      
      // Create the points
      const points = [
        { x: 0, y: 0, z: 0 }, // Center
      ];
      
      // First ring - 6 points
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        points.push(createPoint(angle, baseSize * 0.5, 0));
      }
      
      // Second ring - 6 points
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        points.push(createPoint(angle, baseSize, 0));
      }
      
      // Project 3D points to 2D
      const projectedPoints = points.map(p => {
        const scale = 1 + p.z / 400; // Perspective scale
        return {
          x: centerX + p.x * scale,
          y: centerY + p.y * scale,
          z: p.z
        };
      });
      
      // Draw the connections between points
      const connections = [
        // Inner hexagon
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
        // Outer hexagon
        [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 7],
        // Connect inner to outer
        [1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12],
        // Connect to center
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        // Additional lines for the full Metatron's Cube
        [1, 3], [3, 5], [5, 1],
        [2, 4], [4, 6], [6, 2],
        [7, 9], [9, 11], [11, 7],
        [8, 10], [10, 12], [12, 8]
      ];
      
      // Draw connections
      connections.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projectedPoints[a].x, projectedPoints[a].y);
        ctx.lineTo(projectedPoints[b].x, projectedPoints[b].y);
        ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw the points
      projectedPoints.forEach((point, i) => {
        const size = i === 0 ? 5 : 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? (liftTheVeil ? '#ff1493' : chakraColor) : chakraColor;
        ctx.fill();
      });
      
      // Draw animated particles along the edges
      particles.forEach((particle, i) => {
        // Choose a random connection
        const connectionIndex = i % connections.length;
        const [a, b] = connections[connectionIndex];
        const pctAlong = (time * particle.speed) % 1;
        
        const x = projectedPoints[a].x + (projectedPoints[b].x - projectedPoints[a].x) * pctAlong;
        const y = projectedPoints[a].y + (projectedPoints[b].y - projectedPoints[a].y) * pctAlong;
        
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : chakraColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw Sri Yantra
    const drawSriYantra = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.35;
      const rotation = time * 0.05;
      
      // Draw the outer circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseSize * (1 - i * 0.15), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${0.3 - i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw the triangles
      const drawTriangle = (size: number, invert: boolean, opacity: number) => {
        const height = size * Math.sqrt(3) / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        if (invert) {
          ctx.moveTo(0, -height / 2);
          ctx.lineTo(-size / 2, height / 2);
          ctx.lineTo(size / 2, height / 2);
        } else {
          ctx.moveTo(0, height / 2);
          ctx.lineTo(-size / 2, -height / 2);
          ctx.lineTo(size / 2, -height / 2);
        }
        ctx.closePath();
        
        ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, invert ? -height/2 : height/2, 0, invert ? height/2 : -height/2);
        gradient.addColorStop(0, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${opacity * 0.1})`);
        gradient.addColorStop(1, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${opacity * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
      };
      
      // Draw a series of triangles with decreasing sizes
      for (let i = 0; i < 5; i++) {
        const size = baseSize * (1 - i * 0.15);
        drawTriangle(size, i % 2 === 0, 0.7 - i * 0.1);
      }
      
      // Draw the bindu (central point)
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseSize * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = liftTheVeil ? '#ff1493' : chakraColor;
      ctx.fill();
      
      // Add particles moving along the triangles
      particles.forEach((particle, i) => {
        const size = baseSize * (1 - (i % 5) * 0.15);
        const height = size * Math.sqrt(3) / 2;
        const invert = i % 2 === 0;
        
        // Calculate position along triangle edge
        const edge = i % 3;
        const pctAlong = (time * particle.speed) % 1;
        
        let x, y;
        if (invert) {
          switch (edge) {
            case 0: // top to right
              x = -size / 2 + size * pctAlong;
              y = height / 2;
              break;
            case 1: // right to left
              x = size / 2 - size * pctAlong;
              y = height / 2;
              break;
            case 2: // left to top
              x = -size / 2 + size / 2 * pctAlong;
              y = height / 2 - height * pctAlong;
              break;
          }
        } else {
          switch (edge) {
            case 0: // bottom to left
              x = -size / 2 + size * pctAlong;
              y = -height / 2;
              break;
            case 1: // left to right
              x = -size / 2 + size * pctAlong;
              y = -height / 2;
              break;
            case 2: // right to bottom
              x = size / 2 - size / 2 * pctAlong;
              y = -height / 2 + height * pctAlong;
              break;
          }
        }
        
        // Rotate and draw the particle
        const rotatedX = centerX + (x * Math.cos(rotation) - y * Math.sin(rotation));
        const rotatedY = centerY + (x * Math.sin(rotation) + y * Math.cos(rotation));
        
        ctx.beginPath();
        ctx.arc(rotatedX, rotatedY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : chakraColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw Fibonacci Spiral
    const drawFibonacciSpiral = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.005;
      const rotation = time * 0.1;
      
      // Draw the spiral
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      let a = 0;
      let b = 1;
      let radius = 0;
      let lastX = 0;
      let lastY = 0;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      for (let i = 0; i < 15; i++) {
        const temp = a;
        a = b;
        b = temp + b;
        radius = b * scale;
        
        // Draw an arc segment
        const startAngle = i * Math.PI / 2;
        const endAngle = (i + 1) * Math.PI / 2;
        
        const arcCenterX = lastX + (radius * Math.cos(startAngle + Math.PI));
        const arcCenterY = lastY + (radius * Math.sin(startAngle + Math.PI));
        
        ctx.arc(arcCenterX, arcCenterY, radius, startAngle, endAngle);
        
        lastX = arcCenterX + (radius * Math.cos(endAngle));
        lastY = arcCenterY + (radius * Math.sin(endAngle));
      }
      
      // Stroke the spiral
      ctx.strokeStyle = chakraColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw fibonacci squares
      a = 0;
      b = 1;
      lastX = 0;
      lastY = 0;
      
      for (let i = 0; i < 10; i++) {
        const temp = a;
        a = b;
        b = temp + b;
        const size = b * scale;
        
        // Calculate square position
        const angle = i * Math.PI / 2;
        const squareX = lastX;
        const squareY = lastY;
        
        ctx.save();
        ctx.translate(squareX, squareY);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.rect(0, 0, size, size);
        ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Update for next square
        const nextAngle = (i + 1) * Math.PI / 2;
        lastX = lastX + size * Math.cos(angle);
        lastY = lastY + size * Math.sin(angle);
      }
      
      ctx.restore();
      
      // Add particles moving along the spiral
      particles.forEach((particle, i) => {
        // Determine position along spiral
        const t = ((i / particles.length) + time * particle.speed * 0.1) % 1;
        const theta = t * Math.PI * 10;
        const radius = Math.pow(1.2, theta) * 5;
        
        const spiralX = centerX + radius * Math.cos(theta + rotation) * scale * 10;
        const spiralY = centerY + radius * Math.sin(theta + rotation) * scale * 10;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(spiralX, spiralY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : chakraColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw Chakra Beam
    const drawChakraBeam = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
      
      // Draw chakra lotus
      const petals = 8;
      const petalLength = baseRadius * 1.5;
      const innerRadius = baseRadius * 0.5;
      
      // Draw the lotus petals
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2 + time * 0.2;
        const petalWidth = Math.PI / petals;
        
        // Create path for petal
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        for (let j = -30; j <= 30; j++) {
          const a = angle + (j / 30) * petalWidth * 0.8;
          const r = innerRadius + Math.cos(j * Math.PI / 30) * petalLength;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        
        // Create gradient for petal
        const gradient = ctx.createRadialGradient(
          centerX, centerY, innerRadius,
          centerX, centerY, petalLength + innerRadius
        );
        gradient.addColorStop(0, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.8)`);
        gradient.addColorStop(1, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add petal outline
        ctx.strokeStyle = chakraColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw the central lotus part
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = liftTheVeil ? '#ff1493' : chakraColor;
      ctx.fill();
      
      // Draw beam of light
      const beamHeight = canvas.height;
      const beamWidth = baseRadius * 0.5;
      const beamGradient = ctx.createLinearGradient(
        centerX, centerY - beamHeight / 2,
        centerX, centerY + beamHeight / 2
      );
      beamGradient.addColorStop(0, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0)`);
      beamGradient.addColorStop(0.5, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.6)`);
      beamGradient.addColorStop(1, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0)`);
      
      ctx.fillStyle = beamGradient;
      ctx.fillRect(centerX - beamWidth / 2, centerY - beamHeight / 2, beamWidth, beamHeight);
      
      // Add particles floating in the beam
      particles.forEach((particle) => {
        // Update particle position
        particle.y = (particle.y + particle.speed) % canvas.height;
        const x = centerX + (Math.random() * 2 - 1) * beamWidth * 0.4;
        const y = particle.y;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : '#ffffff';
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Draw PrimeFlow visualization
    const drawPrimeFlow = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      // Create a spiraling number line
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw the spiral number line
      let angle = 0;
      let radius = 10;
      const radiusIncrement = 0.5;
      const angleIncrement = 0.1;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      for (let i = 1; i <= 100; i++) {
        angle += angleIncrement;
        radius += radiusIncrement;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.lineTo(x, y);
        
        // Mark prime numbers
        if (isPrime(i)) {
          ctx.fillStyle = liftTheVeil ? '#ff1493' : '#ffd700';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw connections between prime numbers
      ctx.beginPath();
      
      let lastPrimeX = 0;
      let lastPrimeY = 0;
      let foundFirst = false;
      
      angle = 0;
      radius = 10;
      
      for (let i = 1; i <= 100; i++) {
        angle += angleIncrement;
        radius += radiusIncrement;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (isPrime(i)) {
          if (foundFirst) {
            ctx.moveTo(lastPrimeX, lastPrimeY);
            ctx.lineTo(x, y);
          }
          
          lastPrimeX = x;
          lastPrimeY = y;
          foundFirst = true;
        }
      }
      
      ctx.strokeStyle = liftTheVeil ? 'rgba(255, 20, 147, 0.6)' : 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw central pattern
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.2)`;
      ctx.fill();
      
      // Add ripple effect from center
      for (let i = 0; i < 3; i++) {
        const pulseRadius = ((time * 10) % 100) + i * 30;
        ctx.beginPath();
        ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${0.5 - pulseRadius / 200})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Animate particles around prime numbers
      particles.forEach((particle, i) => {
        if (particle.isPrime) {
          // Calculate position based on prime spiral
          const particleNum = (i % 25) + 1;
          let pAngle = 0;
          let pRadius = 10;
          
          for (let j = 1; j <= particleNum; j++) {
            pAngle += angleIncrement;
            pRadius += radiusIncrement;
            
            if (isPrime(j)) {
              // Found a prime number
              const orbitAngle = time * particle.speed + i;
              const orbitRadius = 5 + Math.sin(time + i) * 2;
              
              const x = centerX + Math.cos(pAngle) * pRadius + Math.cos(orbitAngle) * orbitRadius;
              const y = centerY + Math.sin(pAngle) * pRadius + Math.sin(orbitAngle) * orbitRadius;
              
              ctx.beginPath();
              ctx.arc(x, y, particle.size, 0, Math.PI * 2);
              ctx.fillStyle = liftTheVeil ? '#ff69b4' : '#ffd700';
              ctx.globalAlpha = particle.opacity;
              ctx.fill();
              ctx.globalAlpha = 1;
              
              // Break after finding the prime
              break;
            }
          }
        }
      });
    };
    
    // Draw Chakra Spiral
    const drawChakraSpiral = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      // Chakra colors
      const chakraColors = [
        '#ef4444',  // root
        '#f97316',  // sacral
        '#facc15',  // solar plexus
        '#22c55e',  // heart
        '#3b82f6',  // throat
        '#6366f1',  // third eye
        '#a855f7'   // crown
      ];
      
      // Draw spiral with chakra points
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw spiral path
      ctx.beginPath();
      for (let angle = 0; angle < 8 * Math.PI; angle += 0.02) {
        const radius = 10 + angle * 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Create gradient for the spiral
      const gradient = ctx.createLinearGradient(-baseRadius, -baseRadius, baseRadius, baseRadius);
      chakraColors.forEach((color, i) => {
        gradient.addColorStop(i / (chakraColors.length - 1), color);
      });
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw chakra points along the spiral
      for (let i = 0; i < chakraColors.length; i++) {
        const angle = (i / chakraColors.length) * 5 * Math.PI;
        const radius = 10 + angle * 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // Draw chakra circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = chakraColors[i];
        ctx.fill();
        
        // Draw pulsing effect
        const pulseScale = 1 + Math.sin(time * 2 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, 15 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(chakraColors[i].slice(1, 3), 16)}, ${parseInt(chakraColors[i].slice(3, 5), 16)}, ${parseInt(chakraColors[i].slice(5, 7), 16)}, 0.2)`;
        ctx.fill();
      }
      
      // Draw center point
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = liftTheVeil ? '#ff1493' : '#ffffff';
      ctx.fill();
      
      ctx.restore();
      
      // Add particles flowing along the spiral
      particles.forEach((particle, i) => {
        const particleTime = (time * particle.speed + i / particles.length) % 1;
        const angle = particleTime * 8 * Math.PI;
        const radius = 10 + angle * 5;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Determine color based on position along spiral
        const colorIndex = Math.floor(particleTime * chakraColors.length);
        const color = chakraColors[Math.min(colorIndex, chakraColors.length - 1)];
        
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.isPrime ? '#ffd700' : color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Main draw function
    const draw = (timestamp: number) => {
      if (!ctx) return;
      
      // Calculate time delta
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Update time value
      time += deltaTime * 0.001;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, canvas.width / 1.5
      );
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualization based on selected mode
      switch (visualizerMode) {
        case 'flowerOfLife':
          drawFlowerOfLife(ctx, time);
          break;
        case 'merkaba':
          drawMerkaba(ctx, time);
          break;
        case 'metatronCube':
          drawMetatronCube(ctx, time);
          break;
        case 'sriYantra':
          drawSriYantra(ctx, time);
          break;
        case 'fibonacciSpiral':
          drawFibonacciSpiral(ctx, time);
          break;
        case 'chakraBeam':
          drawChakraBeam(ctx, time);
          break;
        case 'primeFlow':
          drawPrimeFlow(ctx, time);
          break;
        case 'chakraSpiral':
          drawChakraSpiral(ctx, time);
          break;
        default:
          drawFlowerOfLife(ctx, time);
      }
      
      // Apply audio data to animation if available
      if (frequencyData && frequencyData.length > 0) {
        // Calculate average frequency for intensity
        const freqArray = Array.from(frequencyData);
        const avgFreq = freqArray.reduce((acc, val) => acc + val, 0) / freqArray.length;
        const normalizedFreq = avgFreq / 255;
        
        // Draw audio frequency visualizer at bottom
        const barWidth = canvas.width / Math.min(64, freqArray.length);
        const barHeightMultiplier = canvas.height * 0.1;
        
        ctx.fillStyle = chakraColor;
        for (let i = 0; i < Math.min(64, freqArray.length); i++) {
          const barHeight = (freqArray[i] / 255) * barHeightMultiplier;
          ctx.fillRect(
            i * barWidth,
            canvas.height - barHeight,
            barWidth - 1,
            barHeight
          );
        }
      }
      
      // Continue animation if active
      if (isActive) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    
    // Initialize animation
    if (isActive) {
      initializeParticles();
      animationRef.current = requestAnimationFrame(draw);
    }
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [chakra, frequencyData, visualizerMode, isActive, intensity, liftTheVeil]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};

export default CanvasBasedVisualizer;
