
import React, { useRef, useEffect } from 'react';

interface SacredGridBackgroundProps {
  intensity?: number;
  color?: string;
  pulseSpeed?: number;
  responsive?: boolean;
}

const SacredGridBackground: React.FC<SacredGridBackgroundProps> = ({
  intensity = 0.5,
  color = '#9b87f5',
  pulseSpeed = 1.0,
  responsive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas dimensions
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    updateCanvasSize();
    
    if (responsive) {
      window.addEventListener('resize', updateCanvasSize);
    }
    
    // Animation setup
    const drawGrid = (timestamp: number) => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update time
      timeRef.current += 0.01 * pulseSpeed;
      const time = timeRef.current;
      
      // Draw sacred grid
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Parse color to RGB for manipulation
      let r = 155, g = 135, b = 245; // Default purple
      
      if (color.startsWith('#')) {
        if (color.length === 7) {
          r = parseInt(color.slice(1, 3), 16);
          g = parseInt(color.slice(3, 5), 16);
          b = parseInt(color.slice(5, 7), 16);
        }
      }
      
      // Draw flower of life grid pattern
      const drawFlowerOfLifeGrid = () => {
        const gridSize = Math.min(width, height) * 0.15;
        const cols = Math.ceil(width / gridSize) + 1;
        const rows = Math.ceil(height / gridSize) + 1;
        
        // Base opacity fluctuates with time
        const baseOpacity = (Math.sin(time * 0.5) * 0.2 + 0.5) * intensity;
        
        for (let i = -1; i <= cols; i++) {
          for (let j = -1; j <= rows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;
            
            // Skip some circles randomly to create a more organic pattern
            if (Math.random() > 0.85) continue;
            
            // Calculate distance from center for radial effect
            const centerX = width / 2;
            const centerY = height / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
            
            // Opacity decreases with distance from center
            const distanceOpacity = 1 - (distFromCenter / maxDist);
            
            // Size fluctuates slightly based on time
            const sizeFluctuation = Math.sin(i * 0.5 + j * 0.5 + time) * 0.2 + 0.8;
            
            // Create subtle animation by shifting positions slightly
            const shiftX = Math.sin(time + i * 0.5) * gridSize * 0.1;
            const shiftY = Math.cos(time + j * 0.5) * gridSize * 0.1;
            
            // Draw circle with gradient
            const circleRadius = gridSize * 0.5 * sizeFluctuation;
            const gradient = ctx.createRadialGradient(
              x + shiftX, y + shiftY, 0,
              x + shiftX, y + shiftY, circleRadius
            );
            
            const opacity = baseOpacity * distanceOpacity;
            
            // Inner glow color
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
            // Outer edge color - more transparent
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.beginPath();
            ctx.arc(x + shiftX, y + shiftY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw sacred geometry lines connecting nearby circles
            if (i > 0 && j > 0) {
              // Connect to adjacent circles with fading lines
              const lineOpacity = opacity * 0.3;
              ctx.beginPath();
              ctx.moveTo(x + shiftX, y + shiftY);
              ctx.lineTo(x - gridSize + shiftX, y + shiftY);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              
              ctx.beginPath();
              ctx.moveTo(x + shiftX, y + shiftY);
              ctx.lineTo(x + shiftX, y - gridSize + shiftY);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
              ctx.stroke();
            }
          }
        }
      };
      
      drawFlowerOfLifeGrid();
      
      // Request next frame
      animationRef.current = requestAnimationFrame(drawGrid);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(drawGrid);
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (responsive) {
        window.removeEventListener('resize', updateCanvasSize);
      }
    };
  }, [intensity, color, pulseSpeed, responsive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SacredGridBackground;
