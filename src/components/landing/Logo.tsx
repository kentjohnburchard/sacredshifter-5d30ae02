
import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <motion.img 
          src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
          alt="Sacred Shifter Logo" 
          className="h-[32rem] sm:h-[36rem] transition-all hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            filter: "drop-shadow(0 0 20px rgba(138, 43, 226, 0.6))"
          }}
          transition={{ duration: 1.5 }}
        />
        {/* Improved gradients with softer edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 pointer-events-none rounded-[30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-40 pointer-events-none rounded-[30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40 pointer-events-none rounded-[30%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent opacity-40 pointer-events-none rounded-[30%]" />
        
        {/* New: Added glow effect around logo */}
        <div className="absolute inset-0 bg-purple-500/10 blur-3xl animate-pulse-slow rounded-[50%]"></div>
      </div>
    </div>
  );
};

export default Logo;
