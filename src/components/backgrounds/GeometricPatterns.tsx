
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface GeometricPatternsProps {
  patternCount?: number;
}

// Force geometric shape color to always be white for visibility
const SHAPE_COLOR = "#fff";

const GeometricPatterns: React.FC<GeometricPatternsProps> = ({ patternCount = 7 }) => {
  const { liftTheVeil } = useTheme();

  React.useEffect(() => {
    console.log(`GeometricPatterns rendering with ${patternCount} patterns`);
  }, [patternCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
      >
        {Array.from({ length: patternCount }).map((_, i) => (
          <motion.svg
            key={`geo-${i}`}
            className="absolute"
            width={240 + i * 50}
            height={240 + i * 35}
            style={{
              top: `${12 + i * 6}%`,
              left: `${8 + i * 9}%`,
              zIndex: 0,
              filter: "blur(1.5px)",
            }}
            viewBox="0 0 100 100"
            fill="none"
            animate={{
              rotate: [0, i % 2 === 0 ? 360 : -360, 0],
              opacity: [0.8, 0.5, 0.8], // higher opacity for visibility
              x: [0, i % 2 === 0 ? 16 : -12, 0],
              y: [0, i % 2 === 0 ? -18 : 22, 0],
              scale: [1, 1.09, 1],
            }}
            transition={{
              duration: 22 + i * 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            {/* TRIANGLE */}
            <polygon points="50,15 90,85 10,85" fill="none" stroke={SHAPE_COLOR} strokeWidth="2.4" />
            {/* CIRCLE */}
            <circle cx="50" cy="50" r="30" fill="none" stroke={SHAPE_COLOR} strokeWidth="1.7" opacity="0.65" />
            {/* SQUARE */}
            <rect x="20" y="20" width="60" height="60" fill="none" stroke={SHAPE_COLOR} strokeWidth="1.2" opacity="0.52" rx="15"/>
            {/* DIAGONAL LINE */}
            <line x1="50" y1="10" x2="50" y2="90" stroke={SHAPE_COLOR} strokeWidth="1.1" opacity="0.42"/>
          </motion.svg>
        ))}
        {/* Animated overlays, always in white for max contrast */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='50' cy='50' r='30' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='50' cy='20' r='15' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3C/svg%3E")`
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
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,10 90,50 50,90 10,50' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Cpolygon points='50,20 80,50 50,80 20,50' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3C/svg%3E")`
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
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-27" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='67' cy='100' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='133' cy='100' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='83.5' cy='71.5' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='116.5' cy='71.5' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='83.5' cy='128.5' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3Ccircle cx='116.5' cy='128.5' r='33' stroke='${encodeURIComponent(SHAPE_COLOR)}' stroke-width='1.5' fill='none' /%3E%3C/svg%3E")`
          }}
          animate={{
            rotate: [0, -120, 0],
            opacity: [0.27, 0.38, 0.27],
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

