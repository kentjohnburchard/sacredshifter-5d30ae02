
import React, { memo } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

// Extremely optimized background that won't lock up the browser
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme,
  intensity = 'medium',
  children
}) => {
  // Apply different color schemes based on theme but with minimal computation
  const getColors = () => {
    switch (theme) {
      case 'cosmic':
        return {
          primary: 'purple',
          secondary: 'blue',
        };
      case 'ethereal':
        return {
          primary: 'teal',
          secondary: 'cyan',
        };
      case 'temple':
        return {
          primary: 'amber',
          secondary: 'orange',
        };
      default:
        return {
          primary: 'purple',
          secondary: 'blue',
        };
    }
  };
  
  const colors = getColors();
  
  // Drastically reduced animation elements for performance
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-black via-[#0a0118] to-black">
      {/* Drastically reduced number of waves */}
      {[1, 2].map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === 1 ? 0.4 : 0.2 }}
          transition={{ duration: 2 }}
        >
          <div
            className={`rounded-full bg-gradient-to-br from-${colors.primary}-500/40 to-${colors.secondary}-500/40 filter blur-3xl`}
            style={{
              width: 800 + (i * 50),
              height: 800 + (i * 50)
            }}
          />
        </motion.div>
      ))}
      
      {children}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AnimatedBackground);
