
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

interface FallbackVisualizerProps {
  colorScheme?: string;
  isPlaying?: boolean;
}

const FallbackVisualizer: React.FC<FallbackVisualizerProps> = ({
  colorScheme = '#9b87f5',
  isPlaying = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { frequencyData } = useAppStore();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (frequencyData && isPlaying) {
        // Use frequency data to create audio-reactive visualization
        const avgFrequency = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
        const normalizedAvg = avgFrequency / 255;
        
        // Draw circle that pulses with audio
        const baseRadius = Math.min(canvas.width, canvas.height) * 0.2;
        const pulseRadius = baseRadius * (1 + normalizedAvg * 0.5);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = colorScheme;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        // Draw frequency bars in a circle
        const barCount = Math.min(32, frequencyData.length);
        const barWidth = Math.PI * 2 / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const value = frequencyData[i] || 0;
          const normalized = value / 255;
          
          const innerRadius = pulseRadius * 1.2;
          const outerRadius = innerRadius + normalized * baseRadius;
          
          const startAngle = i * barWidth;
          const endAngle = startAngle + barWidth * 0.8;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
          ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
          ctx.closePath();
          
          ctx.fillStyle = colorScheme;
          ctx.globalAlpha = 0.3 + normalized * 0.5;
          ctx.fill();
        }
      } else {
        // Draw pulsing circle when no audio is playing
        const time = Date.now() / 1000;
        const pulseSize = 0.8 + Math.sin(time * 2) * 0.2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(canvas.width, canvas.height) * 0.15 * pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = colorScheme;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        // Draw orbiting particles
        for (let i = 0; i < 8; i++) {
          const angle = time + (i * Math.PI / 4);
          const x = centerX + Math.cos(angle) * canvas.width * 0.2;
          const y = centerY + Math.sin(angle) * canvas.height * 0.2;
          
          ctx.beginPath();
          ctx.arc(x, y, 5 + Math.sin(time * 3 + i) * 3, 0, Math.PI * 2);
          ctx.fillStyle = colorScheme;
          ctx.globalAlpha = 0.7;
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [frequencyData, isPlaying, colorScheme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'rgba(0, 0, 0, 0.2)' }}
    />
  );
};

export default FallbackVisualizer;
