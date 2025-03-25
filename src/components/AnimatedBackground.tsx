
import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground: React.FC = () => {
  // Create array of objects for the wave elements
  const waves = Array.from({ length: 5 }).map((_, i) => ({
    id: `wave-${i}`,
    delay: i * 0.7,
    duration: 15 + i * 3,
    opacity: 0.03 + (i * 0.01),
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
            className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 filter blur-3xl"
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
            className="absolute rounded-full bg-white/20"
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
  );
};

export default AnimatedBackground;
