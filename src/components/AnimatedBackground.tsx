
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
  // Reduce wave count and opacity
  const getWaves = () => {
    const count = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: 15 + i * 3,
      opacity: 0.01 + (i * 0.005), // Reduced opacity
    }));
  };
  
  const waves = getWaves();
  
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/5', // Reduced opacity
          to: 'to-purple-500/5', // Reduced opacity
          particle: 'bg-blue-200/15' // Reduced opacity
        };
      case 'temple':
        return {
          from: 'from-amber-500/5', // Reduced opacity
          to: 'to-red-500/5', // Reduced opacity
          particle: 'bg-amber-200/15' // Reduced opacity
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/5', // Reduced opacity
          to: 'to-blue-500/5', // Reduced opacity
          particle: 'bg-purple-200/15' // Reduced opacity
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
              className={`w-[600px] h-[600px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl`} // Reduced size
              animate={{
                scale: [1, 1.05, 1], // Less dramatic scaling
                opacity: [wave.opacity, wave.opacity + 0.01, wave.opacity],
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

        {/* Reduce number of particles and their opacity */}
        {Array.from({ length: 10 }).map((_, i) => { // Reduced from 15 to 10
          const size = Math.random() * 4 + 1; // Smaller particles
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 15 + 10; // Shorter duration
          
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
                y: [0, -20, 0], // Less dramatic movement
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.2, 0.4, 0.2], // Reduced opacity
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 3,
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
