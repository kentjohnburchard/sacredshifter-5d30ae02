
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
  // Static glow class without animations
  const getGlowClass = () => {
    switch (glowColor) {
      case "pink": return "bg-pink-500/5";
      case "blue": return "bg-blue-500/5";
      case "gold": return "bg-amber-500/5";
      case "purple": 
      default: return "bg-purple-500/5";
    }
  };

  // Extremely simplified container with no animations
  return (
    <div className={`relative min-h-[400px] flex items-center justify-center ${className}`}>
      {/* Static background instead of animated gradient */}
      <div className={`absolute inset-0 rounded-lg ${getGlowClass()} z-0`}></div>
      
      {/* Content container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {children}
      </div>
    </div>
  );
};

export default CosmicContainer;
