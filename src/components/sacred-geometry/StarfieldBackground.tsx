
import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  static?: boolean;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  density = 'medium',
  opacity = 0.7,
  static = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Adjust star count based on density
    const getStarCount = () => {
      switch(density) {
        case 'low': return 350;
        case 'high': return 1000;
        case 'medium':
        default: return 650;
      }
    };

    // Create stars with appropriate density
    const stars = Array.from({ length: getStarCount() }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5, // Same size stars
      alpha: Math.random() * 0.8, 
      delta: Math.random() * 0.005 + 0.001,
      color: Math.random() > 0.8 ? 
        `rgba(${155 + Math.random() * 100}, ${155 + Math.random() * 100}, 255, ` : 
        Math.random() > 0.6 ? 
          `rgba(255, ${155 + Math.random() * 100}, ${155 + Math.random() * 100}, ` : 
          `rgba(255, 255, 255, `
    }));

    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Make background fully transparent to show through all layers
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each star with enhanced twinkling effect
      stars.forEach((star) => {
        // Update star opacity for twinkling effect (unless static)
        if (!static) {
          star.alpha += star.delta;
          if (star.alpha > 1 || star.alpha < 0.1) star.delta *= -1;
        }
        
        // Draw the star with enhanced brightness
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `${star.color}${star.alpha * opacity * 2})`;  // Apply opacity modifier
        context.fill();
        
        // Add larger glow for brighter stars
        if (star.radius > 1.2) {
          context.beginPath();
          context.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
          context.fillStyle = `${star.color}${star.alpha * opacity * 0.4})`;  // Apply opacity modifier
          context.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, opacity, static]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarfieldBackground;
