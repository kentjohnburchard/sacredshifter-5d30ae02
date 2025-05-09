
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, showText = false }) => {
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <img
          src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
          alt="Sacred Shifter Logo"
          className="filter drop-shadow-lg"
          style={{ 
            width, 
            height,
            filter: 'drop-shadow(0 0 8px rgba(155, 135, 245, 0.5))'
          }}
        />
        {/* Enhanced glow effect */}
        <div 
          className="absolute inset-0 bg-purple-500/20 rounded-full blur-md -z-10" 
          style={{ width, height }}
        ></div>
      </div>
      
      {showText && (
        <span className="ml-2 font-semibold text-white">Sacred Shifter</span>
      )}
    </motion.div>
  );
};

export default Logo;
