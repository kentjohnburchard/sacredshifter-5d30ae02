
import React, { useEffect, useRef } from "react";

/**
 * Optimized starfield background with performance improvements
 * Uses static elements with minimal animations to prevent browser lockups
 */
const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create stars (static, no animation)
    const createStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      
      // Create fewer stars (200 instead of 1000+) for better performance
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });
    
    resizeCanvas();
    createStars();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050014] via-[#0a0118] to-[#050014]"></div>
      
      {/* Canvas for stars (static, rendered once) */}
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>
    </div>
  );
};

export default StarfieldBackground;
