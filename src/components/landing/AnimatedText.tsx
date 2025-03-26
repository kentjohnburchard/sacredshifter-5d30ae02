
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextProps {
  lines: string[];
  currentLine: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ lines, currentLine }) => {
  return (
    <div className="relative space-y-12 mb-10">
      <AnimatePresence mode="wait">
        {lines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index <= currentLine ? 1 : 0,
              y: index <= currentLine ? 0 : 20
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            className={`text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 max-w-2xl mx-auto absolute left-1/2 -translate-x-1/2 ${
              index === currentLine ? "relative" : "absolute"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
