
import React from "react";
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
  
  // Increased opacity values for better visibility
  const getOpacity = () => {
    switch (intensity) {
      case 'low': return { base: 0.15, hover: 0.20 };
      case 'medium': return { base: 0.25, hover: 0.35 };
      case 'high': return { base: 0.40, hover: 0.50 };
      default: return { base: 0.25, hover: 0.35 };
    }
  };

  const colors = getColors();
  const opacity = getOpacity();
  
  // Create array of objects for the wave elements
  const waves = Array.from({ length: 5 }).map((_, i) => ({
    id: `wave-${i}`,
    delay: i * 0.7,
    duration: 15 + i * 3,
    opacity: opacity.base + (i * 0.02), // Increased multiplier for better visibility
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-black via-[#0a0118] to-black">
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: wave.opacity }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className={`w-[800px] h-[800px] rounded-full bg-gradient-to-br from-${colors.primary}-500/50 to-${colors.secondary}-500/50 filter blur-3xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [wave.opacity, wave.opacity + 0.1, wave.opacity], // Increased opacity change
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

      {/* Floating particles with higher opacity */}
      {Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className={`absolute rounded-full bg-white/60`} // Increased opacity
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.5, 0.9, 0.5], // Increased opacity values
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        );
      })}
      
      {children}
    </div>
  );
};

export default AnimatedBackground;
