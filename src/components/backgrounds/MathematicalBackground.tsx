
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

interface MathematicalBackgroundProps {
  children: React.ReactNode;
}

const MathematicalBackground: React.FC<MathematicalBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Mathematical equations to display
    const equations = [
      'E = mc²',
      'eiπ + 1 = 0',
      'F = G(m₁m₂)/r²',
      'φ = (1 + √5)/2',
      '∫ e^x dx = e^x + C',
    ];
    
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      equation?: string;
      opacity: number;
      rotationSpeed: number;
      rotation: number;
      shape: 'circle' | 'triangle' | 'square' | 'equation';
    }> = [];
    
    // Create initial particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        rotation: Math.random() * Math.PI * 2,
        shape: Math.random() < 0.7 
          ? 'circle' 
          : Math.random() < 0.8 
            ? 'triangle' 
            : Math.random() < 0.9 
              ? 'square' 
              : 'equation'
      });
    }
    
    const drawShape = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number, 
      shape: string,
      rotation: number,
      opacity: number,
      equation?: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const color = liftTheVeil ? '#FF70E9' : '#8B5CF6';
      ctx.fillStyle = `rgba${color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',')},${opacity})`;
      ctx.strokeStyle = ctx.fillStyle;
      
      switch(shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(-size, size);
          ctx.lineTo(size, size);
          ctx.lineTo(0, -size);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'square':
          ctx.fillRect(-size, -size, size * 2, size * 2);
          break;
          
        case 'equation':
          if (equation) {
            ctx.font = `${size * 4}px "Computer Modern", serif`;
            ctx.fillText(equation, -ctx.measureText(equation).width / 2, size);
          }
          break;
      }
      
      ctx.restore();
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.rotation += particle.rotationSpeed;
        
        // Reset particle when it goes off screen
        if (particle.y < -20) {
          particle.y = canvas.height + 20;
          particle.x = Math.random() * canvas.width;
          if (particle.shape === 'equation') {
            particle.equation = equations[Math.floor(Math.random() * equations.length)];
          }
        }
        
        drawShape(
          ctx, 
          particle.x, 
          particle.y, 
          particle.size, 
          particle.shape,
          particle.rotation,
          particle.opacity,
          particle.equation
        );
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [liftTheVeil]);
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Mathematical canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full opacity-50"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Geometric patterns overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`geo-${i}`}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${50 + i * 20}% ${50 + i * 20}%, 
                  ${liftTheVeil ? '#FF70E9' : '#8B5CF6'} 0%, 
                  transparent 70%)`
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {children}
    </div>
  );
};

export default MathematicalBackground;
