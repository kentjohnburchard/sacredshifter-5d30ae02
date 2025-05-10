
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';

interface AmbientBackgroundProps {
  activeChakra?: ChakraTag;
  intensity?: number;
  pulsing?: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  activeChakra = 'Crown',
  intensity = 0.5,
  pulsing = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { liftTheVeil } = useTheme();
  
  // Animation properties
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    const initParticles = () => {
      const particles = [];
      const particleCount = Math.floor(window.innerWidth / 10); // Responsive particle count
      
      const chakraColor = CHAKRA_COLORS[activeChakra] || '#a855f7';
      const secondaryColor = liftTheVeil ? '#ec4899' : '#8b5cf6';
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.3 ? chakraColor : secondaryColor
        });
      }
      
      particlesRef.current = particles;
    };

    initParticles();

    // Animation function
    let time = 0;
    const draw = () => {
      // Clear canvas with a slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check with wrap-around
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Pulsing effect
        let currentOpacity = particle.opacity;
        if (pulsing) {
          currentOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(time * 0.001 + particle.x * 0.01));
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(currentOpacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      // Create connections between close particles
      ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.1})`;
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      time++;
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [activeChakra, intensity, pulsing, liftTheVeil]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70" 
    />
  );
};

export default AmbientBackground;
