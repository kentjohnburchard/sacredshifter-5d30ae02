
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface GeometricPatternsProps {
  patternCount?: number;
}

const GeometricPatterns: React.FC<GeometricPatternsProps> = ({ patternCount = 7 }) => {
  const { liftTheVeil } = useTheme();

  // Log to help with debugging
  React.useEffect(() => {
    console.log(`GeometricPatterns rendering with ${patternCount} patterns`);
  }, [patternCount]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }} // INCREASED OPACITY
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
              opacity: [0.7, 0.5, 0.7], // INCREASED OPACITY VALUES
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Sacred geometry pattern overlays - MORE VISIBLE NOW */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-35" // INCREASED OPACITY
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='50' cy='20' r='15' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3C/svg%3E")`
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
          className="absolute inset-0 bg-cover bg-center opacity-35" // INCREASED OPACITY
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,10 90,50 50,90 10,50' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Cpolygon points='50,20 80,50 50,80 20,50' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3C/svg%3E")`
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
        
        {/* NEW: Added additional sacred geometry patterns */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='45' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1.2' fill='none' /%3E%3Cline x1='5' y1='50' x2='95' y2='50' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1.2' /%3E%3Cline x1='50' y1='5' x2='50' y2='95' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1.2' /%3E%3C/svg%3E")`
          }}
          animate={{
            rotate: [0, 180, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* NEW: Added flower of life pattern */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-25" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='67' cy='100' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='133' cy='100' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='83.5' cy='71.5' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='116.5' cy='71.5' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='83.5' cy='128.5' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3Ccircle cx='116.5' cy='128.5' r='33' stroke='%23${liftTheVeil ? 'FF70E9' : '8B5CF6'}' stroke-width='1' fill='none' /%3E%3C/svg%3E")`
          }}
          animate={{
            rotate: [0, -120, 0],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 90,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default GeometricPatterns;
