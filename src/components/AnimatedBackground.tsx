
import React, { memo } from "react";

interface AnimatedBackgroundProps {
  colorScheme: string;
  isActive?: boolean;
}

// Extremely simplified background component with no animations
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-blue-900/20">
      {/* Static gradient instead of animated elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 filter blur-3xl" />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AnimatedBackground);
