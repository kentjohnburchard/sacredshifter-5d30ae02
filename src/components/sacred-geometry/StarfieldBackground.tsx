
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
    // Prevent huge array sizes that could cause errors
    const maxStars = 5000;
    const minStars = 100;
    
    const width = window.innerWidth || 1000;
    const height = window.innerHeight || 1000;
    
    // Use a base value proportional to the screen size, but capped
    const screenArea = width * height;
    const baseValue = Math.min(Math.sqrt(screenArea) / 4, 500); 
    
    let count;
    switch (density) {
      case 'low': count = baseValue * 0.5; break;
      case 'high': count = baseValue * 2; break;
      default: count = baseValue; break;
    }
    
    // Ensure the count is within safe limits
    return Math.min(Math.max(Math.floor(count), minStars), maxStars);
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
        console.log(`Initializing ${count} stars for density: ${density}`);
        
        try {
          starsRef.current = Array(count).fill(0).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2
          }));
          isInitializedRef.current = true;
        } catch (error) {
          console.error("Error initializing stars:", error);
          // Fallback to a safer number of stars
          const safeCount = 200;
          starsRef.current = Array(safeCount).fill(0).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2
          }));
          isInitializedRef.current = true;
        }
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
