
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
  // Create array of objects for the wave elements
  const getWaves = () => {
    const count = intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: 15 + i * 3,
      opacity: 0.03 + (i * 0.01),
    }));
  };
  
  const waves = getWaves();
  
  // Get theme colors
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/10',
          to: 'to-purple-500/10',
          particle: 'bg-blue-200/30'
        };
      case 'temple':
        return {
          from: 'from-amber-500/10',
          to: 'to-red-500/10',
          particle: 'bg-amber-200/30'
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/10',
          to: 'to-blue-500/10',
          particle: 'bg-purple-200/30'
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
              className={`w-[800px] h-[800px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [wave.opacity, wave.opacity + 0.02, wave.opacity],
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

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 6 + 2;
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
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.7, 0.3],
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
