import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SacredGeometryVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  chakra?: string;
  frequency?: number;
  isVisible?: boolean;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  geometryType?: 'flowerOfLife' | 'metatronsCube' | 'merkaba' | 'sriYantra';
  isPlaying?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  audioContext,
  analyser,
  chakra = 'crown',
  frequency = 528,
  isVisible = true,
  mode = 'fractal',
  sensitivity = 1.0,
  geometryType,
  isPlaying: isPlayingProp,
  size = 'md'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    if (isPlayingProp !== undefined) {
      setIsPlaying(isPlayingProp);
    }
  }, [isPlayingProp]);

  const getChakraColor = (chakraName?: string): { main: string, shadow: string, glow: string } => {
    switch(chakraName?.toLowerCase()) {
      case 'root':
        return { main: 'rgba(255, 0, 0, 0.8)', shadow: '#ff0000', glow: 'rgba(255, 0, 0, 0.5)' };
      case 'sacral':
        return { main: 'rgba(255, 128, 0, 0.8)', shadow: '#ff8000', glow: 'rgba(255, 128, 0, 0.5)' };
      case 'solar plexus':
        return { main: 'rgba(255, 255, 0, 0.8)', shadow: '#ffff00', glow: 'rgba(255, 255, 0, 0.5)' };
      case 'heart':
        return { main: 'rgba(0, 255, 0, 0.8)', shadow: '#00ff00', glow: 'rgba(0, 255, 0, 0.5)' };
      case 'throat':
        return { main: 'rgba(0, 191, 255, 0.8)', shadow: '#00bfff', glow: 'rgba(0, 191, 255, 0.5)' };
      case 'third eye':
        return { main: 'rgba(75, 0, 130, 0.8)', shadow: '#4b0082', glow: 'rgba(75, 0, 130, 0.5)' };
      case 'crown':
      default:
        return { main: 'rgba(138, 43, 226, 0.8)', shadow: '#8a2be2', glow: 'rgba(138, 43, 226, 0.5)' };
    }
  };

  useEffect(() => {
    if ((!audioContext || !analyser) && (!isPlayingProp && !geometryType)) {
      return;
    }
    
    if (!canvasRef.current || !isVisible) return;
    
    setIsPlaying(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let dataArray: Uint8Array | null = null;
    
    if (analyser) {
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const drawFractal = () => {
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
      }
      
      const chakraColors = getChakraColor(chakra);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const minDimension = Math.min(canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      let average = 50;
      
      if (dataArray) {
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        average = sum / dataArray.length;
      } else if (geometryType) {
        average = 50 + 30 * Math.sin(Date.now() / 1000);
      }
      
      ctx.beginPath();
      const points = [];
      const numPoints = dataArray ? dataArray.length : 32;
      
      for (let i = 0; i < numPoints; i++) {
        const value = dataArray ? dataArray[i] * sensitivity : 30 + 20 * Math.sin(i / 5 + Date.now() / 1000);
        const percent = i / numPoints;
        const angle = percent * Math.PI * 2;
        
        const radiusBase = minDimension * (size === 'sm' ? 0.15 : size === 'lg' ? 0.4 : 0.3);
        const radius = radiusBase + (value * 0.5);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        points.push({ x, y, value });
      }
      ctx.closePath();
      
      ctx.strokeStyle = chakraColors.main;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15 + (average * 0.1);
      ctx.shadowColor = chakraColors.shadow;
      ctx.stroke();
      
      const selectedMode = geometryType ? mapGeometryTypeToMode(geometryType) : mode;
      
      if (selectedMode === 'fractal') {
        drawFractalPattern(ctx, centerX, centerY, minDimension * 0.25, average, chakraColors);
      } else if (selectedMode === 'spiral') {
        drawSpiralPattern(ctx, centerX, centerY, minDimension * 0.25, average, chakraColors);
      } else {
        drawMandalaPattern(ctx, centerX, centerY, minDimension * 0.25, average, chakraColors);
      }
      
      animationRef.current = requestAnimationFrame(drawFractal);
    };

    const mapGeometryTypeToMode = (type: string): 'fractal' | 'spiral' | 'mandala' => {
      switch (type) {
        case 'flowerOfLife':
          return 'fractal';
        case 'merkaba':
          return 'spiral';
        case 'metatronsCube':
        case 'sriYantra':
          return 'mandala';
        default:
          return 'fractal';
      }
    };
    
    drawFractal();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    };
  }, [audioContext, analyser, isVisible, chakra, mode, sensitivity, geometryType, isPlayingProp, size]);
  
  const drawFractalPattern = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    size: number,
    intensity: number,
    colors: { main: string, shadow: string, glow: string }
  ) => {
    const numShapes = 6;
    const angleStep = (Math.PI * 2) / numShapes;
    
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < numShapes; i++) {
      const angle = i * angleStep;
      const x = centerX + Math.cos(angle) * (size * 0.5);
      const y = centerY + Math.sin(angle) * (size * 0.5);
      
      const pulseSize = size * 0.5 + (intensity * 0.05);
      
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = colors.main;
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.shadow;
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.3 + (intensity * 0.02), 0, Math.PI * 2);
    ctx.strokeStyle = colors.main;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.shadow;
    ctx.stroke();
    
    ctx.beginPath();
    for (let i = 0; i < numShapes; i++) {
      const angle = i * angleStep;
      const x = centerX + Math.cos(angle) * size;
      const y = centerY + Math.sin(angle) * size;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };
  
  const drawSpiralPattern = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    size: number,
    intensity: number,
    colors: { main: string, shadow: string, glow: string }
  ) => {
    const maxTurns = 5;
    const spacing = 5;
    const startRadius = 10 + (intensity * 0.1);
    
    ctx.beginPath();
    for (let angle = 0; angle < maxTurns * Math.PI * 2; angle += 0.1) {
      const radius = startRadius + spacing * angle / (Math.PI * 2);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = colors.main;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.shadow;
    ctx.stroke();
  };
  
  const drawMandalaPattern = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    size: number,
    intensity: number,
    colors: { main: string, shadow: string, glow: string }
  ) => {
    const numPetals = 12;
    const innerRadius = size * 0.4;
    const outerRadius = size + (intensity * 0.3);
    const angleStep = (Math.PI * 2) / numPetals;
    
    ctx.beginPath();
    for (let i = 0; i < numPetals; i++) {
      const angle1 = i * angleStep;
      const angle2 = (i + 1) * angleStep;
      const midAngle = (angle1 + angle2) / 2;
      
      const x1 = centerX + Math.cos(angle1) * innerRadius;
      const y1 = centerY + Math.sin(angle1) * innerRadius;
      
      const xMid = centerX + Math.cos(midAngle) * outerRadius;
      const yMid = centerY + Math.sin(midAngle) * outerRadius;
      
      const x2 = centerX + Math.cos(angle2) * innerRadius;
      const y2 = centerY + Math.sin(angle2) * innerRadius;
      
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(xMid, yMid, x2, y2);
    }
    
    ctx.strokeStyle = colors.main;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.shadow;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'lg': return 'w-full h-full';
      default: return 'w-32 h-32';
    }
  };

  return (
    <motion.div 
      className={`sacred-geometry-container ${isPlaying ? 'is-playing' : ''} ${!size ? 'w-full h-full' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className={`sacred-geometry-canvas absolute inset-0 ${size ? getSizeClasses() : 'w-full h-full'} z-0 pointer-events-none`}
      />
      <div className="sacred-geometry-overlay absolute inset-0 z-0 pointer-events-none" />
    </motion.div>
  );
};

export default SacredGeometryVisualizer;
