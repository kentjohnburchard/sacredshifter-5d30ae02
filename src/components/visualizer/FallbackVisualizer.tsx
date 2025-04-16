
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';

interface FallbackVisualizerProps {
  colorScheme?: string;
  fallbackType?: 'bars' | 'wave' | 'dots';
  height?: number;
  width?: number;
  isPlaying?: boolean;
}

const FallbackVisualizer: React.FC<FallbackVisualizerProps> = ({
  colorScheme = '#a855f7',
  fallbackType = 'bars',
  height = 200,
  width = 400,
  isPlaying = true
}) => {
  const { frequencyData } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set up visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Fill with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      // Use mock data if no frequency data available or if not playing
      const dataArray = (frequencyData?.length > 0 && isPlaying) ? frequencyData : generateMockData();
      
      if (fallbackType === 'bars') {
        drawBars(ctx, dataArray, width, height, colorScheme);
      } else if (fallbackType === 'wave') {
        drawWave(ctx, dataArray, width, height, colorScheme);
      } else {
        drawDots(ctx, dataArray, width, height, colorScheme);
      }
      
      requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
  }, [colorScheme, fallbackType, height, width, frequencyData, isPlaying]);
  
  const generateMockData = (): Uint8Array => {
    const mockData = new Uint8Array(64);
    const time = Date.now() / 1000;
    
    for (let i = 0; i < mockData.length; i++) {
      // Generate smooth wave patterns
      const value = 128 + 
                    60 * Math.sin(time + i * 0.1) + 
                    40 * Math.sin(time * 0.5 + i * 0.2);
      mockData[i] = Math.min(255, Math.max(0, Math.floor(value)));
    }
    
    return mockData;
  };
  
  const drawBars = (
    ctx: CanvasRenderingContext2D, 
    dataArray: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const barWidth = width / Math.min(64, dataArray.length);
    const barSpacing = 2;
    
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    for (let i = 0; i < Math.min(64, dataArray.length); i++) {
      const value = dataArray[i];
      const percent = value / 255;
      const barHeight = percent * height;
      
      ctx.fillRect(
        i * barWidth + barSpacing/2, 
        height - barHeight, 
        barWidth - barSpacing, 
        barHeight
      );
    }
  };
  
  const drawWave = (
    ctx: CanvasRenderingContext2D, 
    dataArray: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const sliceWidth = width / dataArray.length;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      const percent = value / 255;
      const y = height / 2 + (percent * height / 2 - height / 4);
      const x = i * sliceWidth;
      
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };
  
  const drawDots = (
    ctx: CanvasRenderingContext2D, 
    dataArray: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 10;
    
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    const numDots = Math.min(64, dataArray.length);
    const angleStep = (Math.PI * 2) / numDots;
    
    for (let i = 0; i < numDots; i++) {
      const value = dataArray[i];
      const percent = value / 255;
      const angle = i * angleStep;
      const radius = maxRadius * (0.3 + percent * 0.7);
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 2 + percent * 4, 0, Math.PI * 2);
      ctx.fill();
    }
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
        style={{ width: '100%', height: '100%' }} 
        className="rounded-lg"
      />
    </motion.div>
  );
};

export default FallbackVisualizer;
