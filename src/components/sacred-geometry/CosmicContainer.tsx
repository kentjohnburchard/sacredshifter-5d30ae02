
import React from "react";
import { motion } from "framer-motion";

interface CosmicContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  variant?: "card" | "panel" | "orb";
  glowColor?: string;
  borderWidth?: "none" | "thin" | "medium" | "thick";
}

const CosmicContainer: React.FC<CosmicContainerProps> = ({
  children,
  className = "",
  animate = true,
  variant = "card",
  glowColor = "purple",
  borderWidth = "thin",
}) => {
  // Map border width to tailwind classes
  const borderWidthClass = {
    none: "border-0",
    thin: "border",
    medium: "border-2",
    thick: "border-4",
  }[borderWidth];
  
  // Map glow color to tailwind classes
  const glowColorClass = {
    purple: "from-purple-600/20 to-indigo-500/10",
    blue: "from-blue-600/20 to-cyan-500/10",
    green: "from-green-600/20 to-emerald-500/10",
    gold: "from-amber-600/20 to-yellow-500/10",
    pink: "from-pink-600/20 to-rose-500/10",
    red: "from-red-600/20 to-rose-500/10",
  }[glowColor];
  
  // Map variant to styles
  const variantStyles = {
    card: "rounded-xl shadow-lg bg-black/40 backdrop-blur-md",
    panel: "rounded-lg shadow-md bg-black/60 backdrop-blur-lg",
    orb: "rounded-full bg-black/30 backdrop-blur-md aspect-square",
  }[variant];
  
  // Base animation for cosmic container
  const animationProps = animate
    ? {
        animate: {
          boxShadow: [
            `0 0 10px 0 rgba(139, 92, 246, 0.2)`,
            `0 0 15px 2px rgba(139, 92, 246, 0.3)`,
            `0 0 10px 0 rgba(139, 92, 246, 0.2)`,
          ],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : {};
    
  return (
    <motion.div
      className={`overflow-hidden ${borderWidthClass} border-purple-800/40 ${variantStyles} ${className}`}
      {...animationProps}
    >
      {/* Inner gradient background */}
      <div className={`bg-gradient-to-br ${glowColorClass} w-full h-full flex flex-col`}>
        {/* Overlay grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative flex-1 z-10 px-3 sm:px-4 py-3 sm:py-4">{children}</div>
      </div>
      
      {/* Animated corner accents */}
      {animate && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-4 sm:w-8 h-4 sm:h-8 border-t-2 border-l-2 border-purple-400/50"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 right-0 w-4 sm:w-8 h-4 sm:h-8 border-t-2 border-r-2 border-purple-400/50"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-4 sm:w-8 h-4 sm:h-8 border-b-2 border-l-2 border-purple-400/50"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-4 sm:w-8 h-4 sm:h-8 border-b-2 border-r-2 border-purple-400/50"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default CosmicContainer;
