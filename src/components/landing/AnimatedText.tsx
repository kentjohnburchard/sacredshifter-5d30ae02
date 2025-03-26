
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
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 max-w-2xl mx-auto text-center"
            >
              {line}
            </motion.p>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
