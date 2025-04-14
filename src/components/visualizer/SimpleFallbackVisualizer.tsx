
import React, { useRef, useEffect } from 'react';

interface SimpleFallbackVisualizerProps {
  audioData?: Uint8Array;
  colorScheme?: string;
}

const SimpleFallbackVisualizer: React.FC<SimpleFallbackVisualizerProps> = ({
  audioData,
  colorScheme = 'purple'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const getColor = () => {
    switch (colorScheme) {
      case 'blue': return '#1e90ff';
      case 'gold': return '#ffd700';
      case 'pink': return '#ff69b4';
      default: return '#9370db'; // Purple default
    }
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
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw pulsing circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.3;
      const time = Date.now() / 1000;
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, maxRadius
      );
      
      const baseColor = getColor();
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      
      // Draw pulsing circle
      const pulseRadius = maxRadius * (0.6 + Math.sin(time * 2) * 0.2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw audio visualization bars if data available
      if (audioData && audioData.length > 0) {
        const barWidth = canvas.width / Math.min(64, audioData.length);
        const barHeight = canvas.height * 0.4;
        const barSpacing = 2;
        
        ctx.fillStyle = baseColor;
        
        for (let i = 0; i < Math.min(64, audioData.length); i++) {
          const normalized = audioData[i] / 255;
          const height = normalized * barHeight;
          
          if (height > 2) {
            ctx.fillRect(
              i * barWidth + barSpacing/2,
              canvas.height - height - 10,
              barWidth - barSpacing,
              height
            );
          }
        }
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
  }, [audioData, colorScheme]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default SimpleFallbackVisualizer;
