
import React, { useEffect, useRef } from 'react';

const StarfieldBackground: React.FC = () => {
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

    // Create more stars for a denser starfield
    const stars = Array.from({ length: 600 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5, // Slightly larger stars for more visibility
      alpha: Math.random(),
      delta: Math.random() * 0.005 + 0.002,
      color: Math.random() > 0.8 ? 
        `rgba(${155 + Math.random() * 100}, ${155 + Math.random() * 100}, 255, ` : // Bluish stars
        Math.random() > 0.6 ? 
          `rgba(255, ${155 + Math.random() * 100}, ${155 + Math.random() * 100}, ` : // Reddish stars
          `rgba(255, 255, 255, ` // White stars
    }));

    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create subtle gradient background for more depth
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 1, 24, 1)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(15, 0, 30, 1)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each star with enhanced twinkling effect
      stars.forEach((star) => {
        // Update star opacity for twinkling effect
        star.alpha += star.delta;
        if (star.alpha > 1 || star.alpha < 0.1) star.delta *= -1;
        
        // Draw the star with enhanced brightness
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `${star.color}${star.alpha * 1.2})`;  // Increased brightness
        context.fill();
        
        // Add larger glow for brighter stars
        if (star.radius > 1.2) {
          context.beginPath();
          context.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
          context.fillStyle = `${star.color}${star.alpha * 0.15})`;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        opacity: 1, // Full opacity for stars
      }}
    />
  );
};

export default StarfieldBackground;
