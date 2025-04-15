
import React, { useRef, useEffect } from 'react';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  isStatic: boolean; // Controls animation
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  density = 'medium', 
  opacity = 0.3, 
  isStatic = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Calculate stars count based on density
    const getStarCount = () => {
      switch(density) {
        case 'low': return 100;
        case 'high': return 500;
        case 'medium':
        default: return 250;
      }
    };
    
    const starCount = getStarCount();
    
    // Create stars with positions, sizes and brightness
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.05 + 0.01
    }));
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness * opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Only move stars if animation is enabled
        if (!isStatic) {
          star.y = (star.y + star.speed) % rect.height;
        }
      });
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!canvas) return;
      
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [density, opacity, isStatic]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default StarfieldBackground;
