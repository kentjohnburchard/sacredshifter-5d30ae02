
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
    opacity: 0.06 + (i * 0.02), // Further increased opacity by 25%
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
            className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [wave.opacity, wave.opacity + 0.035, wave.opacity], // Increased opacity here too
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
        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/40" // Increased from bg-white/30
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.5, 0.9, 0.5], // Increased from [0.4, 0.8, 0.4]
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
