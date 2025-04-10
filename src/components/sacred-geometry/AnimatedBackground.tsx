
import React from "react";

interface AnimatedBackgroundProps {
  theme?: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

/**
 * Completely static background with no animations or heavy elements
 * Replaces all motion elements with simple static divs
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme = 'cosmic',
  children
}) => {
  // Apply different color schemes based on theme but with no animations
  const getBackgroundClass = () => {
    switch (theme) {
      case 'cosmic':
        return 'bg-gradient-to-br from-black via-[#0a0118] to-black';
      case 'ethereal':
        return 'bg-gradient-to-br from-black via-[#0a1818] to-black';
      case 'temple':
        return 'bg-gradient-to-br from-black via-[#181000] to-black';
      default:
        return 'bg-gradient-to-br from-black via-[#0a0118] to-black';
    }
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static background */}
      <div className={`absolute inset-0 ${getBackgroundClass()}`}></div>
      
      {/* Single static glow instead of animated waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full bg-purple-900/5 filter blur-[100px]"></div>
      
      {children}
    </div>
  );
};

export default AnimatedBackground;
