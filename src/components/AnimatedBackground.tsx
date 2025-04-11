
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  colorScheme: string;
  isActive?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  colorScheme,
  isActive = false
}) => {
  // Create array of objects for the wave elements
  const waves = Array.from({ length: 5 }).map((_, i) => ({
    id: `wave-${i}`,
    delay: i * 0.7,
    duration: 15 + i * 3,
    opacity: 0.15 + (i * 0.04), // Further increased opacity for better visibility
  }));

  return (
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
            className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/50 to-blue-500/50 filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [wave.opacity, wave.opacity + 0.055, wave.opacity], // Increased opacity here too
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

      {/* Floating particles - increased visibility */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 8 + 3; // Increased size
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/60" // Increased from bg-white/40
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.6, 1, 0.6], // Increased from [0.5, 0.9, 0.5]
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
  );
};

export default AnimatedBackground;
