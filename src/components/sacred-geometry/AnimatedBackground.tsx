
import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  
  // Only apply full animations on homepage-like pages
  const isHomePage = ['/', '/dashboard', '/welcome', '/sacred-shifter-landing'].includes(location.pathname);
  
  // Use minimal animations for non-home pages
  const actualIntensity = isHomePage ? intensity : 'low';
  
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
  
  // Higher opacity values for better visibility, but reduce for non-homepages
  const getOpacity = () => {
    if (!isHomePage) {
      return { base: 0.2, hover: 0.25 }; // Minimal values for non-homepages
    }
    
    switch (actualIntensity) {
      case 'low': return { base: 0.35, hover: 0.40 };
      case 'medium': return { base: 0.45, hover: 0.55 };
      case 'high': return { base: 0.60, hover: 0.70 };
      default: return { base: 0.45, hover: 0.55 };
    }
  };

  const colors = getColors();
  const opacity = getOpacity();
  
  // Reduce number of waves for non-home pages
  const waveCount = isHomePage ? 8 : 3;
  
  // Create array of objects for the wave elements
  const waves = Array.from({ length: waveCount }).map((_, i) => ({
    id: `wave-${i}`,
    delay: i * 0.5,
    duration: 15 + i * 3,
    opacity: opacity.base + (i * 0.04),
    size: 800 + (i * 50),
  }));

  // Reduce particle count for non-home pages
  const particleCount = isHomePage ? 50 : 5;

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
            className={`w-[${wave.size}px] h-[${wave.size}px] rounded-full bg-gradient-to-br from-${colors.primary}-500/70 to-${colors.secondary}-500/70 filter blur-3xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [wave.opacity, wave.opacity + 0.20, wave.opacity],
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

      {/* Only show particles on homepages */}
      {isHomePage && Array.from({ length: particleCount }).map((_, i) => {
        const size = Math.random() * 10 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/80"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.7, 1, 0.7],
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
