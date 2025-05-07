
import React, { useEffect, useRef } from 'react';

const ComingSoon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sacred geometry animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation properties
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.8;
    
    // Create sacred geometry points
    const points: Array<{x: number; y: number; angle: number; radius: number; speed: number}> = [];
    const numPoints = 12;
    const numLayers = 4;
    
    // Generate points in sacred geometry pattern
    for (let layer = 1; layer <= numLayers; layer++) {
      for (let i = 0; i < numPoints * layer; i++) {
        const angle = (i * Math.PI * 2) / (numPoints * layer);
        const radius = (maxRadius * layer) / numLayers;
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          angle: angle,
          radius: radius,
          speed: 0.0002 + (Math.random() * 0.0005)
        });
      }
    }
    
    // Animation variables
    let time = 0;
    let animationFrameId: number;
    
    // Draw function
    const draw = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'; // slate-900 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update time
      time += 1;
      
      // Draw connections between points
      for (let i = 0; i < points.length; i++) {
        const point1 = points[i];
        
        // Update point positions - slight movement
        point1.angle += point1.speed;
        point1.x = centerX + Math.cos(point1.angle) * point1.radius;
        point1.y = centerY + Math.sin(point1.angle) * point1.radius;
        
        // Connect to nearby points
        for (let j = i + 1; j < points.length; j++) {
          const point2 = points[j];
          const dx = point2.x - point1.x;
          const dy = point2.y - point1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect close points
          if (distance < maxRadius / 3) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / (maxRadius / 3);
            
            // Get pulsing effect
            const pulse = Math.sin(time * 0.01) * 0.5 + 0.5;
            
            // Draw line with gradient
            const gradient = ctx.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.7 * pulse})`); // Purple
            gradient.addColorStop(1, `rgba(79, 70, 229, ${opacity * 0.7 * pulse})`); // Indigo
            
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        // Draw point with glow
        const glowSize = 2 + Math.sin(time * 0.01 + point1.angle) * 1;
        const glow = ctx.createRadialGradient(
          point1.x, point1.y, 0,
          point1.x, point1.y, glowSize * 4
        );
        glow.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
        glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(point1.x, point1.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
      
      // Draw central sacred geometry pattern
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.001);
      
      // Flower of life pattern
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.arc(0, maxRadius / 6, maxRadius / 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time * 0.01) * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Additional geometric patterns
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius / 4 * i, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 + Math.sin(time * 0.01 + i) * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Rotating triangles
      ctx.rotate(time * 0.0005);
      ctx.beginPath();
      const triangleSize = maxRadius / 5;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * triangleSize;
        const y = Math.sin(angle) * triangleSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 0.02) * 0.1})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 text-center bg-slate-900 text-white">
      {/* Animated Sacred Geometry Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-950/50 to-slate-900/80 z-0"></div>
      
      {/* Content Container with Glass Effect */}
      <div className="relative z-10 max-w-lg mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl animate-fade-in">
        {/* Sacred Shifter Logo */}
        <div className="mb-6">
          <img
            src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
            alt="Sacred Shifter Logo"
            className="h-24 mx-auto animate-pulse-subtle"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-200">
          Sacred Shifter
        </h1>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-purple-200/90 mb-8 max-w-md mx-auto">
          We're tuning the frequencies behind the scenes
        </p>
        
        {/* Sacred Symbol */}
        <div className="my-8 relative flex justify-center">
          <svg 
            className="h-24 w-24 text-purple-300/80 animate-spin-slow"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path 
              d="M50 5 L50 95 M5 50 L95 50 M19.1 19.1 L80.9 80.9 M19.1 80.9 L80.9 19.1" 
              stroke="currentColor" 
              strokeWidth="0.5" 
            />
          </svg>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center">
        <p className="text-xs sm:text-sm text-purple-300/60">
          Made with love & light 🌟 — SacredShifter.com
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
