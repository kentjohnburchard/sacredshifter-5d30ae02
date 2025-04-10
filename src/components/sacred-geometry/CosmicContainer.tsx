
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface CosmicContainerProps {
  children: ReactNode;
  className?: string;
}

const CosmicContainer: React.FC<CosmicContainerProps> = ({ children, className = "" }) => {
  return (
    <motion.div 
      className={`relative min-h-[400px] flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Increased opacity from 0.3 to 0.5 for better visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-0">
        {children}
      </div>
    </motion.div>
  );
};

export { CosmicContainer };
