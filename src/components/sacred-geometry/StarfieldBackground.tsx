
import React from "react";

/**
 * Completely static starfield background with no animations
 * Replaces the animated stars with a simple background image
 */
const StarfieldBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Static gradient background instead of animated stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050014] via-[#0a0118] to-[#050014]"></div>
      
      {/* Simple static overlay */}
      <div className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default StarfieldBackground;
