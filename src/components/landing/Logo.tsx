
import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <motion.img 
          src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png" 
          alt="Sacred Shifter Logo" 
          className="h-[32rem] sm:h-[36rem] transition-all hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            filter: "drop-shadow(0 0 20px rgba(138, 43, 226, 0.7))"
          }}
          transition={{ duration: 1.5 }}
          style={{
            filter: "drop-shadow(0 0 20px rgba(138, 43, 226, 0.7))"
          }}
        />
        {/* Improved gradients with even softer edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 pointer-events-none rounded-[40%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-50 pointer-events-none rounded-[40%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-50 pointer-events-none rounded-[40%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent opacity-50 pointer-events-none rounded-[40%]" />
        
        {/* Enhanced glow effect around logo */}
        <div className="absolute inset-0 -z-10 bg-purple-500/15 blur-3xl animate-pulse rounded-[50%]"></div>
        <div className="absolute inset-0 -z-10 bg-indigo-500/10 blur-2xl animate-pulse-slow rounded-[50%]" 
          style={{animationDelay: "0.5s"}}></div>
      </div>
    </div>
  );
};

export default Logo;
