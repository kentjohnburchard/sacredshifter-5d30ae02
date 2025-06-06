
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme?: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  colorScheme?: string;
  isActive?: boolean;
  staticBackground?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme = 'cosmic',
  intensity = 'medium',
  children,
  colorScheme,
  isActive = true,
  staticBackground = false
}) => {
  // Create array of objects for the wave elements
  const getWaves = () => {
    // Reduced number of waves to decrease visual noise
    const count = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `wave-${i}`,
      delay: i * 0.7,
      duration: staticBackground ? 0 : 15 + i * 3, // No animation if static, otherwise slow animation
      opacity: 0.2 + (i * 0.05), // Reduced base opacity for better transparency
    }));
  };
  
  const waves = getWaves();
  
  // Get theme colors with reduced opacity for better transparency
  const getThemeColors = () => {
    switch(theme) {
      case 'ethereal':
        return {
          from: 'from-blue-500/30',   // Standardized opacity
          to: 'to-purple-500/30',     // Standardized opacity
          particle: 'bg-blue-200/40'  // Standardized opacity
        };
      case 'temple':
        return {
          from: 'from-amber-500/30',  // Standardized opacity
          to: 'to-red-500/30',        // Standardized opacity
          particle: 'bg-amber-200/40' // Standardized opacity
        };
      case 'cosmic':
      default:
        return {
          from: 'from-purple-500/30', // Standardized opacity
          to: 'to-blue-500/30',       // Standardized opacity
          particle: 'bg-purple-200/40' // Standardized opacity
        };
    }
  };
  
  const colors = getThemeColors();

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {waves.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute inset-0 flex items-center justify-center motion-reduce"
            initial={{ opacity: 0 }}
            animate={{ opacity: wave.opacity }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className={`w-[1800px] h-[1800px] rounded-full bg-gradient-to-br ${colors.from} ${colors.to} filter blur-3xl motion-reduce`} // Increased size for better coverage
              animate={staticBackground ? {} : {
                scale: [1, 1.05, 1], // Reduced scale animation
                opacity: [wave.opacity, wave.opacity + 0.05, wave.opacity], // Subtle opacity change
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

        {/* Floating particles with reduced number and opacity */}
        {!staticBackground && Array.from({ length: 5 }).map((_, i) => {
          const size = Math.random() * 4 + 2;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 20 + 15;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className={`absolute rounded-full ${colors.particle} motion-reduce`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={staticBackground ? {} : {
                y: [0, -20, 0], 
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.4, 0.6, 0.4], // Reduced opacity values
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
      
      {/* Add accessibility support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
