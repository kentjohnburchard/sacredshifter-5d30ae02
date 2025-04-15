
import React, { useRef, useEffect } from 'react';
import { getColorFromScheme } from '@/utils/audioVisuals';

interface SimpleFallbackVisualizerProps {
  audioData?: Uint8Array;
  colorScheme?: string;
}

const SimpleFallbackVisualizer: React.FC<SimpleFallbackVisualizerProps> = ({
  audioData,
  colorScheme = 'purple'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const baseColor = getColorFromScheme(colorScheme);
    
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Simple animation
      const time = Date.now() / 1000;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw circles
      for (let i = 0; i < 3; i++) {
        const radius = 30 + i * 25 + Math.sin(time * (0.5 + i * 0.2)) * 10;
        const alpha = 0.7 - i * 0.2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${Math.round(alpha * 99)}`;
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colorScheme]);
  
  return (
    <div className="w-full h-full overflow-hidden rounded-lg">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/10 backdrop-blur-sm" 
      />
    </div>
  );
};

export default SimpleFallbackVisualizer;
