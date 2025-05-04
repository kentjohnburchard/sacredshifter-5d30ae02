
import React, { useEffect, useRef, useState } from 'react';

interface StarfieldBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  isStatic?: boolean;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  density = 'medium',
  opacity = 0.7,
  isStatic = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const requestIdRef = useRef<number | null>(null);
  const starsRef = useRef<{ x: number; y: number; radius: number; opacity: number }[]>([]);
  const isInitializedRef = useRef(false);

  // Set star count based on density
  const getStarCount = () => {
    const base = Math.min(window.innerWidth, window.innerHeight) / 4;
    switch (density) {
      case 'low': return base * 0.5;
      case 'high': return base * 2;
      default: return base;
    }
  };

  useEffect(() => {
    console.log("Rendering starfield background, isStatic:", isStatic);
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        // If static, only redraw on resize but don't start animation loop
        if (isStatic && isInitializedRef.current) {
          drawStars();
        }
      }
    };

    const initializeStars = () => {
      if (!isInitializedRef.current) {
        const count = getStarCount();
        starsRef.current = Array(count).fill(0).map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        }));
        isInitializedRef.current = true;
      }
    };

    const drawStars = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * opacity})`;
        ctx.fill();
      });
    };

    const animate = () => {
      drawStars();
      if (!isStatic) {
        requestIdRef.current = requestAnimationFrame(animate);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Initialize stars once
    initializeStars();
    
    // If static, just draw once and don't animate
    if (isStatic) {
      drawStars();
    } else {
      // Start animation loop only if not static
      requestIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [density, opacity, isStatic]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default StarfieldBackground;
