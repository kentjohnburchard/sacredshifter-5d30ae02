
import React, { useState, useEffect } from "react";
import LandingPrompt from "@/components/LandingPrompt";
import { motion } from "framer-motion";
import SacredFlowerOfLife from "@/components/sacred-geometry/shapes/SacredFlowerOfLife";
import StarfieldBackground from "@/components/sacred-geometry/StarfieldBackground";

const Welcome: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    console.log('Welcome page loaded');
    // Fade in the content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Sacred Geometry Background Layer */}
      <div className="absolute inset-0 opacity-30">
        <SacredFlowerOfLife />
      </div>
      
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        <StarfieldBackground density="medium" opacity={0.6} isStatic={false} />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-indigo-900/50 z-0"></div>
      
      {/* Sacred Floating Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Floating Circle */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
          initial={{ x: "10%", y: "20%", opacity: 0 }}
          animate={{ 
            x: ["10%", "15%", "10%"], 
            y: ["20%", "25%", "20%"], 
            opacity: 0.3,
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Floating Triangle */}
        <motion.div 
          className="absolute w-40 h-40 left-3/4 top-1/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2, rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border border-indigo-400/30" 
               style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
        </motion.div>
        
        {/* Floating Diamond */}
        <motion.div 
          className="absolute w-24 h-24 left-1/4 top-2/3"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25, 
            scale: [1, 1.1, 1],
            rotate: [45, 90, 45]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full border border-blue-300/20 transform rotate-45" />
        </motion.div>
      </div>
      
      {/* Content Layer with Landing Prompt */}
      <motion.div 
        className="relative z-10 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <LandingPrompt />
      </motion.div>
    </div>
  );
};

export default Welcome;
