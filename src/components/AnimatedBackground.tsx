
import React from "react";

interface AnimatedBackgroundProps {
  colorScheme?: string;
  isActive?: boolean;
}

/**
 * Animated background component with improved performance
 * Using optimized animation techniques to prevent browser lockups
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  colorScheme = "purple",
  isActive = true
}) => {
  // Dynamic color based on scheme
  const getGradientColors = () => {
    switch (colorScheme) {
      case "blue": return "from-blue-900/10 via-indigo-900/5 to-blue-900/10";
      case "green": return "from-green-900/10 via-teal-900/5 to-green-900/10";
      case "gold": return "from-amber-900/10 via-yellow-900/5 to-amber-900/10";
      case "purple":
      default: return "from-purple-900/10 via-indigo-900/5 to-blue-900/10";
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-br ${getGradientColors()} transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated orbs with requestAnimationFrame for better performance */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-purple-500/5 animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 animate-pulse-medium"></div>
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full bg-indigo-500/5 animate-pulse-fast"></div>
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;
