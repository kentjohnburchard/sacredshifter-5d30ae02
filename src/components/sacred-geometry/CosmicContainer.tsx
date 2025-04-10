
import React, { ReactNode } from "react";

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
  // Get appropriate glow class based on color
  const getGlowClass = () => {
    switch (glowColor) {
      case "pink": return "bg-pink-500/5 shadow-lg shadow-pink-500/10";
      case "blue": return "bg-blue-500/5 shadow-lg shadow-blue-500/10";
      case "gold": return "bg-amber-500/5 shadow-lg shadow-amber-500/10";
      case "purple": 
      default: return "bg-purple-500/5 shadow-lg shadow-purple-500/10";
    }
  };

  // Optimized container with subtle animations that won't lock up the browser
  return (
    <div className={`relative min-h-[400px] flex items-center justify-center ${className}`}>
      {/* Animated gradient background with reduced complexity */}
      <div className={`absolute inset-0 rounded-lg ${getGlowClass()} backdrop-blur-sm transition-all duration-1000 z-0`}></div>
      
      {/* Content container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {children}
      </div>
    </div>
  );
};

export default CosmicContainer;
