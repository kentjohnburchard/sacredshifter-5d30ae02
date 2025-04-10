
import React, { ReactNode } from "react";
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
  // Determine glow color class based on the prop
  const getGlowClass = () => {
    switch (glowColor) {
      case "pink": return "from-pink-500/50 to-pink-700/30";
      case "blue": return "from-blue-500/50 to-blue-700/30";
      case "gold": return "from-amber-500/50 to-amber-700/30";
      case "purple": 
      default: return "from-purple-500/50 to-purple-700/30";
    }
  };

  return (
    <motion.div 
      className={`relative min-h-[400px] flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect based on glowColor */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${getGlowClass()} opacity-60 z-0`}></div>
      
      {/* Box shadow for extra glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_25px_rgba(139,92,246,0.3)] z-0"></div>
      
      {/* Content container with increased opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 z-0">
        {children}
      </div>
    </motion.div>
  );
};

// Add both named export and default export
export default CosmicContainer;
