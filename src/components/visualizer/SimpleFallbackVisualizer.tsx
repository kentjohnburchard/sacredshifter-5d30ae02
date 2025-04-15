
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
  
  // Get color based on scheme
  const getColor = () => {
    switch (colorScheme) {
      case 'blue':
        return '#3490dc';
      case 'pink':
        return '#ff69b4';
      case 'green':
        return '#38c172';
      default:
        return '#9b87f5'; // Purple default
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
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation function
    const animate = () => {
      if (!canvas || !ctx) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set styles
      ctx.fillStyle = getColor();
      ctx.strokeStyle = getColor();
      ctx.lineWidth = 2;
      
      // Draw simple bars
      if (audioData && audioData.length > 0) {
        const barWidth = canvas.width / (audioData.length / 2);
        const barSpacing = 2;
        
        for (let i = 0; i < audioData.length / 2; i++) {
          const value = audioData[i];
          const percent = value / 255;
          const barHeight = canvas.height * percent * 0.8;
          
          const x = i * (barWidth + barSpacing);
          const y = (canvas.height - barHeight) / 2;
          
          // Draw bar
          ctx.globalAlpha = 0.7;
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Draw outline
          ctx.globalAlpha = 1;
          ctx.strokeRect(x, y, barWidth, barHeight);
        }
      } else {
        // Draw placeholder animation
        const time = Date.now() / 1000;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(
          centerX, 
          centerY, 
          50 + Math.sin(time * 2) * 10, 
          0, 
          Math.PI * 2
        );
        ctx.stroke();
        
        // Draw some circles
        for (let i = 0; i < 5; i++) {
          const angle = time + (i * Math.PI * 0.4);
          const distance = 100;
          
          ctx.beginPath();
          ctx.arc(
            centerX + Math.cos(angle) * distance,
            centerY + Math.sin(angle) * distance,
            10 + Math.sin(time * 3 + i) * 5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
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
    />
  );
};

export default SimpleFallbackVisualizer;
