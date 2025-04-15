
import React, { useRef, useEffect, useState } from 'react';
import { VisualizerMode, ChakraType, getChakraColor } from './sacred-geometries';

interface CanvasBasedVisualizerProps {
  visualizerMode: VisualizerMode;
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  isActive?: boolean;
  intensity?: number;
  width?: number;
  height?: number;
}

const CanvasBasedVisualizer: React.FC<CanvasBasedVisualizerProps> = ({
  visualizerMode = 'flowerOfLife',
  frequencyData,
  chakra = 'crown',
  isActive = true,
  intensity = 0,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const chakraColor = getChakraColor(chakra);
  
  // Track time for animations
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [rotation, setRotation] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  
  // Drawing utilities
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create a 3D effect by projecting 3D coordinates to 2D
  const project3DTo2D = (x: number, y: number, z: number): [number, number] => {
    // Simple perspective projection
    const perspective = 500;
    const scale = perspective / (perspective + z);
    
    return [
      centerX + x * scale,
      centerY + y * scale
    ];
  };
  
  // Create a 3D rotation matrix
  const rotate3D = (x: number, y: number, z: number, rotX: number, rotY: number, rotZ: number): [number, number, number] => {
    // First rotate around X axis
    let x1 = x;
    let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
    
    // Then rotate around Y axis
    let x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
    let y2 = y1;
    let z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);
    
    // Finally rotate around Z axis
    let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
    let z3 = z2;
    
    return [x3, y3, z3];
  };
  
  // Draw functions for each geometry type
  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, time: number) => {
    const radius = 80;
    const colors = [chakraColor, '#ffffff', '#bbaaff'];
    
    // Clear the canvas with a subtle gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, `rgba(20, 10, 40, 0.9)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw central circle
    ctx.lineWidth = 2;
    ctx.strokeStyle = chakraColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw flower of life pattern
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw circle
      ctx.strokeStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add glow effect
      const glowIntensity = (Math.sin(time * 2 + i) + 1) * 0.5;
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.shadowColor = colors[i % colors.length];
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw second layer
      for (let j = 0; j < 6; j++) {
        const angle2 = (j / 6) * Math.PI * 2;
        const x2 = x + Math.cos(angle2) * radius;
        const y2 = y + Math.sin(angle2) * radius;
        
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = colors[(i + j) % colors.length];
        ctx.beginPath();
        ctx.arc(x2, y2, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw central mandala
    ctx.lineWidth = 1;
    const mandalaPts = 12;
    const innerRadius = radius * 0.6;
    const outerRadius = radius * 1.2;
    
    ctx.beginPath();
    for (let i = 0; i < mandalaPts * 2; i++) {
      const angle = (i / mandalaPts) * Math.PI;
      const r = i % 2 === 0 ? innerRadius : outerRadius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Add audio-reactive elements
    if (frequencyData && frequencyData.length > 0) {
      const avg = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedAvg = avg / 255;
      
      // Draw audio-reactive rings
      ctx.lineWidth = 2 + normalizedAvg * 3;
      ctx.strokeStyle = chakraColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (1.5 + normalizedAvg * 0.5), 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw frequency spikes
      ctx.lineWidth = 1;
      for (let i = 0; i < Math.min(frequencyData.length, 180); i += 3) {
        const angle = (i / 60) * Math.PI * 2;
        const value = frequencyData[i] / 255;
        const innerR = radius * 1.8;
        const outerR = innerR + value * 100;
        
        ctx.globalAlpha = value * 0.8 + 0.2;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * innerR,
          centerY + Math.sin(angle) * innerR
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * outerR,
          centerY + Math.sin(angle) * outerR
        );
        ctx.strokeStyle = `hsl(${(i / frequencyData.length) * 360 + time * 10}, 80%, 60%)`;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };
  
  const drawMerkaba = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear the canvas with a deep space background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, `rgba(40, 10, 60, 0.95)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Prepare rotation matrix based on time
    const rotX = rotation.x;
    const rotY = rotation.y;
    const rotZ = rotation.z;
    
    // Draw the merkaba (star tetrahedron)
    const size = 150;
    
    // Define tetrahedron points for upward tetrahedron
    let upPoints = [
      [0, -size * 0.8, 0],             // Top point
      [size, size * 0.5, -size * 0.3], // Bottom right
      [-size, size * 0.5, -size * 0.3], // Bottom left
      [0, size * 0.3, size]             // Bottom back
    ];
    
    // Define tetrahedron points for downward tetrahedron
    let downPoints = [
      [0, size * 0.8, 0],              // Bottom point
      [size, -size * 0.5, -size * 0.3], // Top right
      [-size, -size * 0.5, -size * 0.3], // Top left
      [0, -size * 0.3, size]            // Top back
    ];
    
    // Apply rotation and perspective to each point
    const rotatedUpPoints = upPoints.map(p => {
      const [x, y, z] = rotate3D(p[0], p[1], p[2], rotX, rotY, rotZ);
      return project3DTo2D(x, y, z);
    });
    
    const rotatedDownPoints = downPoints.map(p => {
      const [x, y, z] = rotate3D(p[0], p[1], p[2], rotX, rotY, rotZ);
      return project3DTo2D(x, y, z);
    });
    
    // Draw upward tetrahedron
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Connect all points to form tetrahedron faces
    for (let i = 0; i < rotatedUpPoints.length; i++) {
      for (let j = i + 1; j < rotatedUpPoints.length; j++) {
        ctx.moveTo(rotatedUpPoints[i][0], rotatedUpPoints[i][1]);
        ctx.lineTo(rotatedUpPoints[j][0], rotatedUpPoints[j][1]);
      }
    }
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = chakraColor;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw downward tetrahedron
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < rotatedDownPoints.length; i++) {
      for (let j = i + 1; j < rotatedDownPoints.length; j++) {
        ctx.moveTo(rotatedDownPoints[i][0], rotatedDownPoints[i][1]);
        ctx.lineTo(rotatedDownPoints[j][0], rotatedDownPoints[j][1]);
      }
    }
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw connecting lines between the two tetrahedrons
    ctx.strokeStyle = 'rgba(180, 180, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(rotatedUpPoints[i][0], rotatedUpPoints[i][1]);
      ctx.lineTo(rotatedDownPoints[i][0], rotatedDownPoints[i][1]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add particles
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 250 + 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = Math.random() * 2 + 1;
      
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Add audio-reactive elements
    if (frequencyData && frequencyData.length > 0) {
      const avg = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedAvg = avg / 255;
      
      // Pulsating aura
      ctx.globalAlpha = 0.3 + normalizedAvg * 0.4;
      ctx.lineWidth = 2 + normalizedAvg * 6;
      
      const auraRadius = 180 + normalizedAvg * 50;
      ctx.strokeStyle = chakraColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Energy beams
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const freq = i < frequencyData.length ? frequencyData[i] / 255 : 0.5;
        const angle = (i / 12) * Math.PI * 2;
        const beamLength = 200 + freq * 150;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * beamLength,
          centerY + Math.sin(angle) * beamLength
        );
        
        const gradient = ctx.createLinearGradient(
          centerX, centerY,
          centerX + Math.cos(angle) * beamLength,
          centerY + Math.sin(angle) * beamLength
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
        gradient.addColorStop(1, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };
  
  const drawMetatronCube = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear the canvas with a subtle gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, `rgba(30, 20, 50, 0.95)`);
    gradient.addColorStop(1, 'rgba(10, 5, 15, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Prepare rotation matrix based on time
    const rotX = rotation.x;
    const rotY = rotation.y;
    const rotZ = rotation.z;
    
    // Define the vertices of Metatron's Cube
    const radius = 150;
    const vertices = [
      [0, 0, 0], // Central point
      [radius, 0, 0], [-radius, 0, 0],
      [radius/2, radius*0.866, 0], [-radius/2, radius*0.866, 0],
      [radius/2, -radius*0.866, 0], [-radius/2, -radius*0.866, 0],
      [0, 0, radius], [0, 0, -radius],
      [radius/2, radius/3, radius*0.816], [-radius/2, radius/3, radius*0.816],
      [radius/2, -radius/3, radius*0.816], [-radius/2, -radius/3, radius*0.816]
    ];
    
    // Rotate and project all vertices
    const projectedVertices = vertices.map(v => {
      const [x, y, z] = rotate3D(v[0], v[1], v[2], rotX, rotY, rotZ);
      return project3DTo2D(x, y, z);
    });
    
    // Draw edges between all vertices (Metatron's Cube connects all points)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    
    for (let i = 0; i < projectedVertices.length; i++) {
      for (let j = i + 1; j < projectedVertices.length; j++) {
        ctx.beginPath();
        ctx.moveTo(projectedVertices[i][0], projectedVertices[i][1]);
        ctx.lineTo(projectedVertices[j][0], projectedVertices[j][1]);
        ctx.stroke();
      }
    }
    
    // Draw the vertices
    for (let i = 0; i < projectedVertices.length; i++) {
      ctx.beginPath();
      
      // Main glow around vertices
      const vertexRadius = i === 0 ? 8 : 5; // Larger central point
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = chakraColor;
      
      // Different colors for different points
      if (i === 0) {
        ctx.fillStyle = '#ffffff';
      } else if (i < 7) {
        ctx.fillStyle = chakraColor;
      } else {
        ctx.fillStyle = '#aabbff';
      }
      
      ctx.arc(projectedVertices[i][0], projectedVertices[i][1], vertexRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
    }
    
    // Draw the platonic solids within the cube
    // Tetrahedron
    ctx.strokeStyle = 'rgba(255, 150, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const tetrahedronPoints = [1, 3, 7, 1, 5, 7, 3, 5, 7, 1, 3, 5];
    for (let i = 0; i < tetrahedronPoints.length; i += 3) {
      ctx.moveTo(projectedVertices[tetrahedronPoints[i]][0], projectedVertices[tetrahedronPoints[i]][1]);
      ctx.lineTo(projectedVertices[tetrahedronPoints[i+1]][0], projectedVertices[tetrahedronPoints[i+1]][1]);
      ctx.lineTo(projectedVertices[tetrahedronPoints[i+2]][0], projectedVertices[tetrahedronPoints[i+2]][1]);
      ctx.closePath();
    }
    ctx.stroke();
    
    // Add audio reactivity
    if (frequencyData && frequencyData.length > 0) {
      const bassAvg = Array.from(frequencyData.slice(0, 10)).reduce((sum, val) => sum + val, 0) / 10;
      const normalizedBass = bassAvg / 255;
      
      // Create pulsating rings
      const pulseSize = 170 + normalizedBass * 70;
      ctx.lineWidth = 2 + normalizedBass * 4;
      ctx.strokeStyle = chakraColor;
      ctx.globalAlpha = 0.3 + normalizedBass * 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      
      // Create frequency bars along the cube edges
      ctx.lineWidth = 2;
      for (let i = 0; i < Math.min(frequencyData.length, projectedVertices.length); i++) {
        const value = frequencyData[i] / 255;
        const startIndex = i % projectedVertices.length;
        const endIndex = (i + 1) % projectedVertices.length;
        
        const startX = projectedVertices[startIndex][0];
        const startY = projectedVertices[startIndex][1];
        const endX = projectedVertices[endIndex][0];
        const endY = projectedVertices[endIndex][1];
        
        // Linear interpolation along the edge
        const t = value;
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * t;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `hsla(${(i / frequencyData.length) * 360}, 100%, 70%, 0.8)`;
        ctx.stroke();
      }
    }
  };
  
  const drawFibonacciSpiral = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear the canvas with a subtle gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, `rgba(20, 30, 40, 0.95)`);
    gradient.addColorStop(1, 'rgba(5, 10, 15, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Calculate the golden ratio
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    // Draw spiral
    ctx.lineWidth = 2;
    ctx.strokeStyle = chakraColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = chakraColor;
    
    ctx.beginPath();
    let scale = 5;
    let lastX = centerX;
    let lastY = centerY;
    
    for (let i = 0; i < 20; i++) {
      scale *= goldenRatio;
      const angle = i * 0.5 * Math.PI + time * 0.2;
      const x = centerX + Math.cos(angle) * scale;
      const y = centerY + Math.sin(angle) * scale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use bezier curves for smoother spiral
        const controlX = lastX + (x - lastX) * 0.5 - (y - lastY) * 0.2;
        const controlY = lastY + (y - lastY) * 0.5 + (x - lastX) * 0.2;
        ctx.quadraticCurveTo(controlX, controlY, x, y);
      }
      
      lastX = x;
      lastY = y;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw fibonacci squares
    const maxSquares = 12;
    let size = 5;
    let posX = centerX;
    let posY = centerY;
    let angle = 0;
    
    for (let i = 0; i < maxSquares; i++) {
      const nextSize = size * goldenRatio;
      
      // Calculate position for next square based on angle
      switch (i % 4) {
        case 0: // Right then up
          posX += size;
          break;
        case 1: // Up then left
          posY -= nextSize;
          break;
        case 2: // Left then down
          posX -= nextSize;
          break;
        case 3: // Down then right
          posY += nextSize;
          break;
      }
      
      // Draw square with rotation
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(angle);
      
      const hue = (i * 30 + time * 10) % 360;
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.rect(-size/2, -size/2, size, size);
      ctx.stroke();
      
      ctx.restore();
      
      // Update for next iteration
      size = nextSize;
      angle += Math.PI/2;
    }
    
    // Add golden ratio circles
    ctx.lineWidth = 1;
    scale = 5;
    for (let i = 0; i < 10; i++) {
      scale *= goldenRatio;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, scale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - i * 0.02})`;
      ctx.stroke();
    }
    
    // Add particles moving along the spiral
    if (frequencyData && frequencyData.length > 0) {
      const avgFreq = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedFreq = avgFreq / 255;
      
      const numParticles = 30 + Math.floor(normalizedFreq * 50);
      
      for (let i = 0; i < numParticles; i++) {
        const t = (i / numParticles) * 20 + time * 0.5;
        const angle = t * 0.5 * Math.PI;
        const radius = 5 * Math.pow(goldenRatio, t);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Draw particle with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = chakraColor;
        ctx.fillStyle = chakraColor;
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, 2 + normalizedFreq * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      // Draw audio reactive spiral rings
      ctx.lineWidth = 3 + normalizedFreq * 3;
      ctx.strokeStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, ${0.3 + normalizedFreq * 0.5})`;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100 + normalizedFreq * 50, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
  
  const drawSriYantra = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear the canvas with a subtle gradient background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, `rgba(30, 10, 30, 0.95)`);
    gradient.addColorStop(1, 'rgba(5, 0, 10, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Define Sri Yantra parameters
    const size = 200;
    const outerCircleRadius = size;
    const trianglesCount = 9; // 9 interlocking triangles in Sri Yantra
    
    // Draw outer circle
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerCircleRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw outer lotus petals
    const petalCount = 16;
    const petalOuterRadius = outerCircleRadius * 0.9;
    const petalInnerRadius = outerCircleRadius * 0.7;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const nextAngle = ((i + 1) / petalCount) * Math.PI * 2;
      
      const midAngle = (angle + nextAngle) / 2;
      const midRadius = petalOuterRadius * 1.05;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * petalInnerRadius,
        centerY + Math.sin(angle) * petalInnerRadius
      );
      
      ctx.quadraticCurveTo(
        centerX + Math.cos(midAngle) * midRadius,
        centerY + Math.sin(midAngle) * midRadius,
        centerX + Math.cos(nextAngle) * petalInnerRadius,
        centerY + Math.sin(nextAngle) * petalInnerRadius
      );
      
      ctx.stroke();
    }
    
    // Draw inner lotus petals
    const innerPetalCount = 8;
    const innerPetalOuterRadius = petalInnerRadius * 0.9;
    const innerPetalInnerRadius = petalInnerRadius * 0.7;
    
    for (let i = 0; i < innerPetalCount; i++) {
      const angle = (i / innerPetalCount) * Math.PI * 2;
      const nextAngle = ((i + 1) / innerPetalCount) * Math.PI * 2;
      
      const midAngle = (angle + nextAngle) / 2;
      const midRadius = innerPetalOuterRadius * 1.05;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * innerPetalInnerRadius,
        centerY + Math.sin(angle) * innerPetalInnerRadius
      );
      
      ctx.quadraticCurveTo(
        centerX + Math.cos(midAngle) * midRadius,
        centerY + Math.sin(midAngle) * midRadius,
        centerX + Math.cos(nextAngle) * innerPetalInnerRadius,
        centerY + Math.sin(nextAngle) * innerPetalInnerRadius
      );
      
      ctx.stroke();
    }
    
    // Draw the interlocking triangles
    // 5 downward triangles
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      const triangleSize = innerPetalInnerRadius * (0.9 - i * 0.1);
      
      ctx.beginPath();
      // Draw downward triangle
      ctx.moveTo(centerX, centerY - triangleSize);
      ctx.lineTo(centerX + triangleSize * 0.866, centerY + triangleSize * 0.5);
      ctx.lineTo(centerX - triangleSize * 0.866, centerY + triangleSize * 0.5);
      ctx.closePath();
      
      ctx.strokeStyle = i % 2 === 0 ? chakraColor : 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
    }
    
    // 4 upward triangles
    for (let i = 0; i < 4; i++) {
      const triangleSize = innerPetalInnerRadius * (0.85 - i * 0.1);
      
      ctx.beginPath();
      // Draw upward triangle
      ctx.moveTo(centerX, centerY + triangleSize);
      ctx.lineTo(centerX + triangleSize * 0.866, centerY - triangleSize * 0.5);
      ctx.lineTo(centerX - triangleSize * 0.866, centerY - triangleSize * 0.5);
      ctx.closePath();
      
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : chakraColor;
      ctx.stroke();
    }
    
    // Draw bindu (central point)
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = chakraColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Add audio reactive elements
    if (frequencyData && frequencyData.length > 0) {
      const avgFreq = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedFreq = avgFreq / 255;
      
      // Draw energy lines
      ctx.lineWidth = 1;
      const linesCount = 72;
      
      for (let i = 0; i < linesCount; i++) {
        const angle = (i / linesCount) * Math.PI * 2;
        
        // Get frequency data for this angle
        const freqIndex = Math.floor((i / linesCount) * frequencyData.length);
        const freqValue = frequencyData[freqIndex] / 255;
        
        const innerRadius = outerCircleRadius * 0.3;
        const outerRadius = outerCircleRadius * (1.0 + freqValue * 0.3);
        
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * innerRadius,
          centerY + Math.sin(angle) * innerRadius
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * outerRadius,
          centerY + Math.sin(angle) * outerRadius
        );
        
        const hue = (i / linesCount) * 360 + time * 10;
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${freqValue * 0.7})`;
        ctx.stroke();
      }
      
      // Pulsating aura
      ctx.lineWidth = 2 + normalizedFreq * 4;
      ctx.globalAlpha = 0.3 + normalizedFreq * 0.4;
      ctx.strokeStyle = chakraColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerCircleRadius * (1.1 + normalizedFreq * 0.2), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };
  
  const drawChakraBeam = (ctx: CanvasRenderingContext2D, time: number) => {
    // Clear the canvas with a dark background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, 'rgba(20, 5, 30, 0.95)');
    gradient.addColorStop(1, 'rgba(5, 0, 15, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw central beam
    const beamWidth = 30;
    const beamHeight = height * 0.8;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Central glowing beam
    const beamGradient = ctx.createLinearGradient(0, -beamHeight/2, 0, beamHeight/2);
    beamGradient.addColorStop(0, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.1)`);
    beamGradient.addColorStop(0.5, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.8)`);
    beamGradient.addColorStop(1, `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.1)`);
    
    ctx.fillStyle = beamGradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = chakraColor;
    ctx.beginPath();
    ctx.rect(-beamWidth/2, -beamHeight/2, beamWidth, beamHeight);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Add beam edges
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-beamWidth/2, -beamHeight/2);
    ctx.lineTo(-beamWidth/2, beamHeight/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(beamWidth/2, -beamHeight/2);
    ctx.lineTo(beamWidth/2, beamHeight/2);
    ctx.stroke();
    
    // Draw chakra symbols along the beam
    const chakraColors = [
      '#ef4444', // Root
      '#f97316', // Sacral
      '#facc15', // Solar Plexus
      '#22c55e', // Heart
      '#3b82f6', // Throat
      '#6366f1', // Third Eye
      '#a855f7'  // Crown
    ];
    
    // Position chakra symbols along the beam
    for (let i = 0; i < 7; i++) {
      const y = -beamHeight * 0.4 + i * beamHeight * 0.13;
      const color = chakraColors[i];
      const symbolSize = 15 + (i === chakraColors.indexOf(chakraColor) ? 10 : 0);
      
      // Draw chakra symbol (simplified as circles with unique patterns)
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      ctx.arc(0, y, symbolSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      
      // Different pattern for each chakra
      switch(i) {
        case 0: // Root - square
          ctx.strokeRect(-symbolSize * 0.6, y - symbolSize * 0.6, symbolSize * 1.2, symbolSize * 1.2);
          break;
        case 1: // Sacral - crescent
          ctx.beginPath();
          ctx.arc(symbolSize * 0.3, y, symbolSize * 0.8, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
          break;
        case 2: // Solar Plexus - triangle
          ctx.beginPath();
          ctx.moveTo(0, y - symbolSize * 0.8);
          ctx.lineTo(-symbolSize * 0.7, y + symbolSize * 0.4);
          ctx.lineTo(symbolSize * 0.7, y + symbolSize * 0.4);
          ctx.closePath();
          ctx.stroke();
          break;
        case 3: // Heart - six-pointed star
          for (let j = 0; j < 6; j++) {
            const angle = j * Math.PI / 3;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(Math.cos(angle) * symbolSize, y + Math.sin(angle) * symbolSize);
            ctx.stroke();
          }
          break;
        case 4: // Throat - circle with dot
          ctx.beginPath();
          ctx.arc(0, y, symbolSize * 0.6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, y, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 5: // Third Eye - eye shape
          ctx.beginPath();
          ctx.ellipse(0, y, symbolSize * 0.7, symbolSize * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, y, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 6: // Crown - lotus
          for (let j = 0; j < 8; j++) {
            const angle = j * Math.PI / 4;
            const x1 = Math.cos(angle) * symbolSize * 0.4;
            const y1 = y + Math.sin(angle) * symbolSize * 0.4;
            const x2 = Math.cos(angle) * symbolSize;
            const y2 = y + Math.sin(angle) * symbolSize;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          break;
      }
      
      ctx.shadowBlur = 0;
    }
    
    // Draw energy particles flowing up the beam
    if (frequencyData && frequencyData.length > 0) {
      const avgFreq = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedFreq = avgFreq / 255;
      
      const particleCount = 30 + Math.floor(normalizedFreq * 50);
      
      for (let i = 0; i < particleCount; i++) {
        // Random position inside beam with bias toward center
        const x = (Math.random() - 0.5) * beamWidth * 0.8;
        
        // Position moves upward over time, wraps around
        const speed = 2 + normalizedFreq * 5;
        const y = ((time * speed * (i % 3 + 1) + i * 30) % beamHeight) - beamHeight/2;
        
        // Size and opacity based on audio
        const size = 1 + normalizedFreq * 3 + Math.random() * 2;
        const opacity = 0.4 + normalizedFreq * 0.6;
        
        // Draw particle
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add horizontal bursts at the current chakra level
      const currentChakraIndex = chakraColors.indexOf(chakraColor);
      if (currentChakraIndex >= 0) {
        const chakraY = -beamHeight * 0.4 + currentChakraIndex * beamHeight * 0.13;
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = chakraColor;
        ctx.globalAlpha = 0.3 + normalizedFreq * 0.7;
        
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const len = 30 + normalizedFreq * 100 + Math.random() * 20;
          
          ctx.beginPath();
          ctx.moveTo(0, chakraY);
          ctx.lineTo(
            Math.cos(angle) * len,
            chakraY + Math.sin(angle) * len
          );
          ctx.stroke();
        }
      }
      
      ctx.globalAlpha = 1;
    }
    
    // Draw base platform
    const baseRadius = 60;
    const baseHeight = 15;
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = chakraColor;
    
    // Ellipse for top of platform
    ctx.fillStyle = chakraColor;
    ctx.beginPath();
    ctx.ellipse(0, beamHeight/2 - baseHeight, baseRadius, baseRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Side of platform
    ctx.fillStyle = `rgba(${parseInt(chakraColor.slice(1, 3), 16)}, ${parseInt(chakraColor.slice(3, 5), 16)}, ${parseInt(chakraColor.slice(5, 7), 16)}, 0.5)`;
    ctx.beginPath();
    ctx.ellipse(0, beamHeight/2, baseRadius, baseRadius * 0.4, 0, 0, Math.PI);
    ctx.lineTo(-baseRadius, beamHeight/2 - baseHeight);
    ctx.ellipse(0, beamHeight/2 - baseHeight, baseRadius, baseRadius * 0.4, 0, Math.PI, Math.PI * 2, true);
    ctx.lineTo(baseRadius, beamHeight/2);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.restore();
  };
  
  // Main animation function
  const animate = (timestamp: number = 0) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Calculate time difference for smooth animations
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    timeRef.current += deltaTime * 0.001; // Convert to seconds
    
    // Update rotation based on time and add slight user interaction effect
    setRotation(prev => ({
      x: prev.x + 0.002,
      y: prev.y + 0.003,
      z: prev.z + 0.001
    }));
    
    // Adjust canvas size to container
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Choose which visualization to render
    switch (visualizerMode) {
      case 'flowerOfLife':
        drawFlowerOfLife(ctx, timeRef.current);
        break;
      case 'merkaba':
        drawMerkaba(ctx, timeRef.current);
        break;
      case 'metatronCube':
        drawMetatronCube(ctx, timeRef.current);
        break;
      case 'sriYantra':
        drawSriYantra(ctx, timeRef.current);
        break;
      case 'fibonacciSpiral':
        drawFibonacciSpiral(ctx, timeRef.current);
        break;
      case 'chakraBeam':
        drawChakraBeam(ctx, timeRef.current);
        break;
      default:
        drawFlowerOfLife(ctx, timeRef.current);
    }
    
    // Continue animation loop if active
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  // Setup and cleanup animation loop
  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, visualizerMode, chakra, frequencyData]);
  
  return (
    <div className="w-full h-full bg-black/80 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
      />
    </div>
  );
};

export default CanvasBasedVisualizer;
