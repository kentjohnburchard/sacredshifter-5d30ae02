
import React, { useRef, useEffect } from 'react';
import { VisualizerMode } from './SacredAudioPlayerWithVisualizer';

interface CanvasAudioVisualizerProps {
  audioData?: Uint8Array;
  colorScheme: string;
  visualizerMode: VisualizerMode;
  isPlaying: boolean;
}

const CanvasAudioVisualizer: React.FC<CanvasAudioVisualizerProps> = ({ 
  audioData, 
  colorScheme = '#a855f7', 
  visualizerMode = 'bars',
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Draw visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData || !isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    const drawVisualization = () => {
      if (!ctx || !audioData) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set canvas background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      // Choose visualization based on mode
      switch (visualizerMode) {
        case 'bars':
          drawBars(ctx, audioData, width, height, colorScheme);
          break;
        case 'wave':
          drawWave(ctx, audioData, width, height, colorScheme);
          break;
        case 'circle':
          drawCircle(ctx, audioData, width, height, colorScheme);
          break;
        case 'particles':
          drawParticles(ctx, audioData, width, height, colorScheme);
          break;
        default:
          drawBars(ctx, audioData, width, height, colorScheme);
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(drawVisualization);
    };
    
    // Start animation
    drawVisualization();
    
    // Clean up animation frame on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioData, colorScheme, visualizerMode, isPlaying]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Draw frequency bars visualization
  const drawBars = (ctx: CanvasRenderingContext2D, audioData: Uint8Array, width: number, height: number, color: string) => {
    const barCount = Math.min(audioData.length, 64);
    const barWidth = width / barCount;
    const barSpacing = 2;
    
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    for (let i = 0; i < barCount; i++) {
      const value = audioData[i] || 0;
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

  // Draw waveform visualization
  const drawWave = (ctx: CanvasRenderingContext2D, audioData: Uint8Array, width: number, height: number, color: string) => {
    const sliceWidth = width / audioData.length;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < audioData.length; i++) {
      const value = audioData[i] || 0;
      const percent = value / 255;
      const y = height / 2 + (percent * height / 2 - height / 4);
      const x = i * sliceWidth;
      
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  // Draw circular visualization
  const drawCircle = (ctx: CanvasRenderingContext2D, audioData: Uint8Array, width: number, height: number, color: string) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const segments = Math.min(audioData.length, 64);
    const angleStep = (Math.PI * 2) / segments;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    for (let i = 0; i < segments; i++) {
      const value = audioData[i] || 0;
      const percent = value / 255;
      const angle = i * angleStep;
      
      const innerRadius = radius * 0.4;
      const outerRadius = radius * (0.4 + percent * 0.6);
      
      const startX = centerX + Math.cos(angle) * innerRadius;
      const startY = centerY + Math.sin(angle) * innerRadius;
      const endX = centerX + Math.cos(angle) * outerRadius;
      const endY = centerY + Math.sin(angle) * outerRadius;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  // Draw particles visualization
  const drawParticles = (ctx: CanvasRenderingContext2D, audioData: Uint8Array, width: number, height: number, color: string) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const bassValue = audioData.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10;
    const bassPercent = bassValue / 255;
    const particleCount = 50;
    
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const amplitudeFactor = 0.3 + bassPercent * 0.7;
      const distance = Math.random() * width * 0.4 * amplitudeFactor;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = 2 + Math.random() * 4 * bassPercent;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-black/20"
    />
  );
};

export default CanvasAudioVisualizer;
