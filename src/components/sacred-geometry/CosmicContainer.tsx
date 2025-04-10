
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
      case "pink": return "from-pink-500/40 to-pink-700/20";
      case "blue": return "from-blue-500/40 to-blue-700/20";
      case "gold": return "from-amber-500/40 to-amber-700/20";
      case "purple": 
      default: return "from-purple-500/40 to-purple-700/20";
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
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${getGlowClass()} opacity-40 z-0`}></div>
      
      {/* Increased opacity for better visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 z-0">
        {children}
      </div>
    </motion.div>
  );
};

// Add both named export and default export
export default CosmicContainer;
