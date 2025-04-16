
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextProps {
  lines: string[];
  currentLine: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ lines, currentLine }) => {
  return (
    <div className="relative h-[180px] mb-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {lines.map((line, index) => (
          index === currentLine && (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p
                className="text-2xl sm:text-3xl md:text-4xl font-light text-white max-w-2xl mx-auto text-center"
              >
                {line}
              </motion.p>
              
              {/* Sacred Shimmer Underline Effect */}
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full mt-3 mx-auto"
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: "100%", 
                  opacity: [0, 0.7, 0],
                  x: ["-50%", "0%", "50%"]
                }}
                transition={{ 
                  duration: 2.5,
                  times: [0, 0.5, 1],
                  repeat: 1,
                  repeatDelay: 1
                }}
              />
              
              {/* Subtle Sacred Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rounded-lg -z-10 blur-xl"
                animate={{ 
                  opacity: [0, 0.3, 0],
                  scale: [0.8, 1.05, 0.8]
                }}
                transition={{ 
                  duration: 3,
                  repeat: 1,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
