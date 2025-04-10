
import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme,
  intensity = 'medium',
  children
}) => {
  // Apply different color schemes based on theme
  const getColors = () => {
    switch (theme) {
      case 'cosmic':
        return {
          primary: 'purple',
          secondary: 'blue',
          accent: 'indigo'
        };
      case 'ethereal':
        return {
          primary: 'teal',
          secondary: 'cyan',
          accent: 'emerald'
        };
      case 'temple':
        return {
          primary: 'amber',
          secondary: 'orange',
          accent: 'yellow'
        };
      default:
        return {
          primary: 'purple',
          secondary: 'blue',
          accent: 'indigo'
        };
    }
  };
  
  // Higher opacity values for better visibility
  const getOpacity = () => {
    switch (intensity) {
      case 'low': return { base: 0.35, hover: 0.40 };
      case 'medium': return { base: 0.45, hover: 0.55 };
      case 'high': return { base: 0.60, hover: 0.70 };
      default: return { base: 0.45, hover: 0.55 };
    }
  };

  const colors = getColors();
  const opacity = getOpacity();
  
  // Performance optimization: limit the number of wave elements and particles
  const [isVisible, setIsVisible] = useState(false);

  // Only render animations after component is mounted to prevent initial lag
  useEffect(() => {
    // Small delay to ensure the page has time to render static content first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  // Reduce waves to 5 for better performance
  const waves = Array.from({ length: 5 }).map((_, i) => ({
    id: `wave-${i}`,
    delay: i * 0.5,
    duration: 15 + i * 3,
    opacity: opacity.base - (i * 0.01), // Decrease opacity for distant waves
    size: 800 + (i * 50), // Varied sizes
  }));

  // Reduce particles to 20 for better performance
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 6 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    
    return {
      id: `particle-${i}`,
      size,
      x,
      y,
      duration,
      delay: Math.random() * 5
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-black via-[#0a0118] to-black">
      {isVisible && (
        <>
          {/* Reduce the number of animated elements to improve performance */}
          {waves.map((wave) => (
            <motion.div
              key={wave.id}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: wave.opacity }}
              transition={{ duration: 2 }}
            >
              <motion.div
                className={`rounded-full bg-gradient-to-br from-${colors.primary}-500/70 to-${colors.secondary}-500/70 filter blur-3xl`}
                style={{
                  width: wave.size,
                  height: wave.size
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [wave.opacity, wave.opacity + 0.10, wave.opacity], // Reduced opacity change
                }}
                transition={{
                  duration: wave.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: wave.delay,
                }}
              />
            </motion.div>
          ))}

          {/* Reduced number of particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white/80" 
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </>
      )}
      
      {children}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AnimatedBackground);
