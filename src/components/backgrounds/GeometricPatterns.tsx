
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface GeometricPatternsProps {
  patternCount?: number;
}

const GeometricPatterns: React.FC<GeometricPatternsProps> = ({ patternCount = 5 }) => {
  const { liftTheVeil } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
      >
        {Array.from({ length: patternCount }).map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${40 + i * 15}% ${30 + i * 15}%, 
                ${liftTheVeil ? '#FF70E9' : '#8B5CF6'} 0%, 
                transparent ${70 + i * 5}%)`
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Sacred geometry pattern overlays */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='0.5' fill='none' /%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='0.5' fill='none' /%3E%3Ccircle cx='50' cy='20' r='15' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='0.5' fill='none' /%3E%3C/svg%3E")`
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,10 90,50 50,90 10,50' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='0.5' fill='none' /%3E%3Cpolygon points='50,20 80,50 50,80 20,50' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='0.5' fill='none' /%3E%3C/svg%3E")`
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 180,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
};

export default GeometricPatterns;
