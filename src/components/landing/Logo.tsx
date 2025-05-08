
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  width?: number;
  height?: number;
  textSize?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, textSize = "text-xl" }) => {
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
        alt="Sacred Shifter Logo"
        style={{ width, height }}
      />
      <span className={`ml-2 font-semibold text-white ${textSize}`}>Sacred Shifter</span>
    </motion.div>
  );
};

export default Logo;
