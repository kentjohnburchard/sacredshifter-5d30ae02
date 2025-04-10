
import React from "react";

interface AnimatedBackgroundProps {
  colorScheme?: string;
  isActive?: boolean;
}

/**
 * Static background component with no animations
 * Removes all animation elements that could cause browser lockups
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-blue-900/10">
      {/* Simple static gradient only - no dynamic elements */}
    </div>
  );
};

export default AnimatedBackground;
