
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme?: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  colorScheme?: string;
  isActive?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme = 'cosmic',
  intensity = 'medium',
  children,
  colorScheme,
  isActive = true
}) => {
  // Create array of objects for the wave elements with increased number and opacity
  const getWaves = () => {
    const count = intensity === 'high' ? 6 : intensity === 'medium' ? 4 : 3;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: 15 + i * 3,
      opacity: 0.05 + (i * 0.02), // Increased opacity
    }));
  };
  
  const waves = getWaves();
  
  // Get theme colors with increased opacity
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/20', // Increased opacity from /10
          to: 'to-purple-500/20', // Increased opacity from /10
          particle: 'bg-blue-200/40' // Increased opacity from /30
        };
      case 'temple':
        return {
          from: 'from-amber-500/20', // Increased opacity from /10
          to: 'to-red-500/20', // Increased opacity from /10
          particle: 'bg-amber-200/40' // Increased opacity from /30
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/20', // Increased opacity from /10
          to: 'to-blue-500/20', // Increased opacity from /10
          particle: 'bg-purple-200/40' // Increased opacity from /30
        };
    }
  };
  
  const colors = getThemeColors();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {waves.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: wave.opacity }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className={`w-[1200px] h-[1200px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl`} // Increased size from 800px
              animate={{
                scale: [1, 1.15, 1], // More dramatic scaling
                opacity: [wave.opacity, wave.opacity + 0.04, wave.opacity], // Increased opacity change
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

        {/* Floating particles with increased size and opacity */}
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 8 + 3; // Increased size from 6+2
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 20 + 15;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className={`absolute rounded-full ${colors.particle}`}
              style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                y: [0, -40, 0], // Increased movement from -30
                x: [0, Math.random() * 30 - 15, 0], // Increased movement
                opacity: [0.4, 0.8, 0.4], // Increased opacity from 0.3, 0.7, 0.3
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
      </div>
      {children}
    </div>
  );
};

export default AnimatedBackground;
