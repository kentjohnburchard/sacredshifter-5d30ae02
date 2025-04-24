
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface BackgroundCanvasProps {
  equations?: string[];
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ 
  equations = [
    'E = mc²',
    'eiπ + 1 = 0',
    'F = G(m₁m₂)/r²',
    'φ = (1 + √5)/2',
    '∫ e^x dx = e^x + C',
    'Σ 1/n² = π²/6',
    '∇×B = μ₀J + μ₀ε₀∂E/∂t',
  ]
}) => {
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
    
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      equation?: string;
      opacity: number;
      rotationSpeed: number;
      rotation: number;
      shape: 'circle' | 'triangle' | 'square' | 'equation' | 'pentagon' | 'hexagon';
    }> = [];
    
    // Create initial particles with more variety
    for (let i = 0; i < 150; i++) {
      const shape = Math.random() < 0.6 
        ? 'circle' 
        : Math.random() < 0.7 
          ? 'triangle' 
          : Math.random() < 0.8 
            ? 'square'
            : Math.random() < 0.9
              ? 'pentagon'
              : Math.random() < 0.95
                ? 'hexagon'
                : 'equation';

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + (shape === 'equation' ? 4 : 1),
        speed: Math.random() * 0.7 + 0.2, // Increased speed range
        opacity: Math.random() * 0.5 + 0.2, // Increased opacity
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        rotation: Math.random() * Math.PI * 2,
        shape,
        equation: shape === 'equation' ? equations[Math.floor(Math.random() * equations.length)] : undefined
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
          ctx.lineTo(0, -size * 1.5);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'square':
          ctx.fillRect(-size, -size, size * 2, size * 2);
          break;
          
        case 'pentagon':
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const pointX = Math.cos(angle) * size;
            const pointY = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
          }
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'hexagon':
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const pointX = Math.cos(angle) * size;
            const pointY = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
          }
          ctx.closePath();
          ctx.fill();
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
  }, [liftTheVeil, equations]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default BackgroundCanvas;
