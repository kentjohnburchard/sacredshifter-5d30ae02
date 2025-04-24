
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
    'ψ(r,t) = Ae^{i(k·r-ωt)}',
    'ds² = gᵢⱼdxⁱdxʲ',
    'H|ψ⟩ = E|ψ⟩',
    'δS = 0',
    'R_μν - ½Rg_μν = 8πG T_μν',
    '∇⋅E = ρ/ε₀',
  ]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up the animation
    let animationFrameId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // INCREASED particle count to 400
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      equation?: string;
      opacity: number;
      rotationSpeed: number;
      rotation: number;
      shape: 'circle' | 'triangle' | 'square' | 'equation' | 'pentagon' | 'hexagon' | 'star';
    }> = [];
    
    // Create initial particles with more variety
    for (let i = 0; i < 400; i++) {
      const shape = Math.random() < 0.3 
        ? 'circle' 
        : Math.random() < 0.45 
          ? 'triangle' 
          : Math.random() < 0.6 
            ? 'square'
            : Math.random() < 0.7
              ? 'pentagon'
              : Math.random() < 0.8
                ? 'hexagon'
                : Math.random() < 0.9
                  ? 'star'
                  : 'equation';

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + (shape === 'equation' ? 9 : 4), // INCREASED SIZE
        speed: Math.random() * 0.9 + 0.5, // INCREASED SPEED
        opacity: Math.random() * 0.95 + 0.5, // INCREASED OPACITY
        rotationSpeed: (Math.random() - 0.5) * 0.08, // INCREASED ROTATION SPEED
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
      
      // ENHANCED COLOR WITH HIGHER OPACITY
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
            const pointX = Math.cos(angle) * size * 1.5;
            const pointY = Math.sin(angle) * size * 1.5;
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
            const pointX = Math.cos(angle) * size * 1.5;
            const pointY = Math.sin(angle) * size * 1.5;
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
          }
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'star':
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
            const length = i % 2 === 0 ? size * 2 : size;
            const pointX = Math.cos(angle) * length;
            const pointY = Math.sin(angle) * length;
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
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Log to help with debugging
    console.log(`BackgroundCanvas initialized with ${particles.length} particles and ${equations.length} equations`);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [liftTheVeil, equations]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full opacity-95" // INCREASED OPACITY
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default BackgroundCanvas;
