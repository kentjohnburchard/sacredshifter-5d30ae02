
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme?: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  colorScheme?: string;
  isActive?: boolean;
  staticBackground?: boolean;  // This prop name is fine, no need to change
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme = 'cosmic',
  intensity = 'medium',
  children,
  colorScheme,
  isActive = true,
  staticBackground = false  // This is fine, keep as is
}) => {
  // Create array of objects for the wave elements
  const getWaves = () => {
    // Reduced number of waves to decrease visual noise
    const count = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: staticBackground ? 0 : 15 + i * 3, // No animation if static
      opacity: 0.15 + (i * 0.05), // Increased base opacity for better visibility
    }));
  };
  
  const waves = getWaves();
  
  // Get theme colors with increased opacity
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/40',   // Increased opacity
          to: 'to-purple-500/40',     // Increased opacity
          particle: 'bg-blue-200/60'  // Increased opacity
        };
      case 'temple':
        return {
          from: 'from-amber-500/40',  // Increased opacity
          to: 'to-red-500/40',        // Increased opacity
          particle: 'bg-amber-200/60' // Increased opacity
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/40', // Increased opacity
          to: 'to-blue-500/40',       // Increased opacity
          particle: 'bg-purple-200/60' // Increased opacity
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
              className={`w-[1500px] h-[1500px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl`} // Increased size significantly
              animate={staticBackground ? {} : {
                scale: [1, 1.05, 1], // Reduced scale animation
                opacity: [wave.opacity, wave.opacity + 0.05, wave.opacity], // Increased opacity change
              }}
              transition={{
                duration: wave.duration,
                repeat: staticBackground ? 0 : Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: wave.delay,
              }}
            />
          </motion.div>
        ))}

        {/* Increased number of floating particles and made them more visible */}
        {!staticBackground && Array.from({ length: 8 }).map((_, i) => { // Increased from 5 to 8
          const size = Math.random() * 6 + 3; // Increased size
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
              animate={staticBackground ? {} : {
                y: [0, -20, 0], 
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.7, 0.9, 0.7], // Increased opacity
              }}
              transition={{
                duration: staticBackground ? 0 : duration,
                repeat: staticBackground ? 0 : Infinity,
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
