
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
  // Increase wave count and opacity compared to the previous reduction
  const getWaves = () => {
    const count = intensity === 'high' ? 5 : intensity === 'medium' ? 4 : 3;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: 15 + i * 3,
      opacity: 0.03 + (i * 0.015), // Increased opacity from previous reduction
    }));
  };
  
  const waves = getWaves();
  
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/15', // Increased opacity from /5
          to: 'to-purple-500/15', // Increased opacity from /5
          particle: 'bg-blue-200/30' // Increased opacity from /15
        };
      case 'temple':
        return {
          from: 'from-amber-500/15', // Increased opacity from /5
          to: 'to-red-500/15', // Increased opacity from /5
          particle: 'bg-amber-200/30' // Increased opacity from /15
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/15', // Increased opacity from /5
          to: 'to-blue-500/15', // Increased opacity from /5
          particle: 'bg-purple-200/30' // Increased opacity from /15
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
              className={`w-[900px] h-[900px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl`} // Increased size from 600px
              animate={{
                scale: [1, 1.08, 1], // Slightly more dramatic scaling
                opacity: [wave.opacity, wave.opacity + 0.03, wave.opacity], // Increased opacity change
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

        {/* Increase number of particles, their size, and their opacity compared to previous reduction */}
        {Array.from({ length: 15 }).map((_, i) => { // Keeping 15 particles
          const size = Math.random() * 5 + 2; // Larger particles than before
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 18 + 10; 
          
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
                y: [0, -25, 0], // More dramatic movement
                x: [0, Math.random() * 15 - 7.5, 0], // More horizontal movement
                opacity: [0.3, 0.6, 0.3], // Increased opacity
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 4,
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
