
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface GeometricPatternsProps {
  patternCount?: number;
}

const GeometricPatterns: React.FC<GeometricPatternsProps> = ({ patternCount = 3 }) => {
  const { liftTheVeil } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
      >
        {Array.from({ length: patternCount }).map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + i * 20}% ${50 + i * 20}%, 
                ${liftTheVeil ? '#FF70E9' : '#8B5CF6'} 0%, 
                transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GeometricPatterns;
