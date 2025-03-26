
import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  lines: string[];
  currentLine: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ lines, currentLine }) => {
  return (
    <div className="space-y-12 mb-10">
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: index <= currentLine ? 1 : 0,
            y: index <= currentLine ? 0 : 20
          }}
          transition={{ 
            duration: 1.5,
            delay: index <= currentLine ? 0 : 0.5 
          }}
          className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 max-w-2xl mx-auto"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
};

export default AnimatedText;
