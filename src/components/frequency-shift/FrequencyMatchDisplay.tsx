
import React from "react";
import { motion } from "framer-motion";
import { HealingFrequency } from "@/data/frequencies";

interface FrequencyMatchDisplayProps {
  frequency: HealingFrequency;
}

const FrequencyMatchDisplay: React.FC<FrequencyMatchDisplayProps> = ({ frequency }) => {
  return (
    <motion.div 
      className="text-center mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="text-4xl font-playfair font-bold mb-3 cosmic-text-gradient"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {frequency.frequency} Hz
      </motion.div>
      
      <div className="text-lg font-medium mb-4 text-gray-800 font-playfair">
        {frequency.name}
      </div>
      
      <motion.div 
        className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 
                 text-purple-800 font-medium mb-4 shadow-sm glow-hover"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {frequency.chakra || "Healing"} Energy
      </motion.div>
      
      {/* Chakra orb with shimmer effect */}
      <div className="flex justify-center">
        <motion.div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/80 to-blue-400/80 
                   flex items-center justify-center shadow-inner relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <div className="w-full h-full absolute top-0 left-0 bg-white opacity-20 animate-shimmer"></div>
          <span className="text-white text-xs font-medium z-10">
            {frequency.chakra?.charAt(0) || "H"}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FrequencyMatchDisplay;
