
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
      case "pink": return "from-pink-500/80 to-pink-700/60";
      case "blue": return "from-blue-500/80 to-blue-700/60";
      case "gold": return "from-amber-500/80 to-amber-700/60";
      case "purple": 
      default: return "from-purple-500/80 to-purple-700/60";
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
      {/* Enhanced glow effect based on glowColor */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${getGlowClass()} opacity-90 z-0`}></div>
      
      {/* Stronger box shadow for extra glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_45px_rgba(139,92,246,0.6)] z-0"></div>
      
      {/* Content container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Add both named export and default export
export default CosmicContainer;
