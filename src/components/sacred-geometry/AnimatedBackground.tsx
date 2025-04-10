
import React, { useEffect, useState, useRef } from "react";

interface AnimatedBackgroundProps {
  theme?: 'cosmic' | 'ethereal' | 'temple';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

/**
 * Optimized animated background with performance improvements
 * Uses CSS animations instead of heavy JS animations
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  theme = 'cosmic',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delayed activation for smoother page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply different color schemes based on theme
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
      <div className={`absolute inset-0 ${getBackgroundClass()} transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Animated elements with CSS animations instead of JS */}
      {isVisible && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full bg-purple-900/5 filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute top-1/3 left-1/3 w-[40vw] h-[40vh] rounded-full bg-blue-900/5 filter blur-[70px] animate-pulse-medium"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[60vw] h-[60vh] rounded-full bg-indigo-900/5 filter blur-[85px] animate-pulse-fast"></div>
        </>
      )}
      
      {children}
    </div>
  );
};

export default AnimatedBackground;
