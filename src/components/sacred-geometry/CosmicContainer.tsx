
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
  // Simplified glow class for performance
  const getGlowClass = () => {
    switch (glowColor) {
      case "pink": return "from-pink-500/40 to-pink-700/20";
      case "blue": return "from-blue-500/40 to-blue-700/20";
      case "gold": return "from-amber-500/40 to-amber-700/20";
      case "purple": 
      default: return "from-purple-500/40 to-purple-700/20";
    }
  };

  // Extremely simplified container with minimal animations
  return (
    <div className={`relative min-h-[400px] flex items-center justify-center ${className}`}>
      {/* Static gradient background instead of animated */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-b ${getGlowClass()} opacity-90 z-0`}></div>
      
      {/* Content container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {children}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CosmicContainer);
