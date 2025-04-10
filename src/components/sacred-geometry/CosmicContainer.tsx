
import React, { ReactNode, memo } from "react";
import { motion } from "framer-motion";

interface CosmicContainerProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; 
}

export const CosmicContainer: React.FC<CosmicContainerProps> = ({ 
  children, 
  className = "", 
  glowColor = "purple" 
}) => {
  // Determine glow color class based on the prop - simplified for performance
  const getGlowClass = () => {
    switch (glowColor) {
      case "pink": return "from-pink-500/60 to-pink-700/40";
      case "blue": return "from-blue-500/60 to-blue-700/40";
      case "gold": return "from-amber-500/60 to-amber-700/40";
      case "purple": 
      default: return "from-purple-500/60 to-purple-700/40";
    }
  };

  // Use a performance-optimized container with reduced effects
  return (
    <motion.div 
      className={`relative min-h-[400px] flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Simplified gradient background */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${getGlowClass()} opacity-95 z-0`}></div>
      
      {/* Simpler box shadow for better performance */}
      <div className="absolute inset-0 rounded-lg shadow-lg shadow-purple-500/30 z-0"></div>
      
      {/* Content container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CosmicContainer);
