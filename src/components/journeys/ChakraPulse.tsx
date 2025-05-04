
import React from 'react';
import { motion } from 'framer-motion';

interface ChakraPulseProps {
  chakra: string;
  size?: number;
  intensity?: 'light' | 'medium' | 'strong';
}

// Map chakra names to color values
const chakraColors: Record<string, { bg: string, ring: string }> = {
  'root': { bg: 'bg-red-500', ring: 'ring-red-500' },
  'sacral': { bg: 'bg-orange-500', ring: 'ring-orange-500' },
  'solar plexus': { bg: 'bg-yellow-400', ring: 'ring-yellow-400' },
  'solar-plexus': { bg: 'bg-yellow-400', ring: 'ring-yellow-400' },
  'heart': { bg: 'bg-green-500', ring: 'ring-green-500' },
  'throat': { bg: 'bg-blue-500', ring: 'ring-blue-500' },
  'third eye': { bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
  'third-eye': { bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
  'crown': { bg: 'bg-violet-500', ring: 'ring-violet-500' },
  'sound': { bg: 'bg-cyan-400', ring: 'ring-cyan-400' },
  'breathwork': { bg: 'bg-white', ring: 'ring-white' },
};

const ChakraPulse: React.FC<ChakraPulseProps> = ({ 
  chakra, 
  size = 40, 
  intensity = 'medium' 
}) => {
  const lowercaseChakra = chakra.toLowerCase();
  const colors = chakraColors[lowercaseChakra] || { bg: 'bg-purple-500', ring: 'ring-purple-500' };
  
  // Set opacity based on intensity
  const opacities = {
    light: { start: 0.05, peak: 0.15 },
    medium: { start: 0.1, peak: 0.3 },
    strong: { start: 0.15, peak: 0.5 },
  };
  
  const { start, peak } = opacities[intensity];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        className={`rounded-full ${colors.bg}/10 absolute`}
        style={{
          width: size,
          height: size,
        }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [start, peak, start]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div
        className={`rounded-full ${colors.bg}/5 absolute`}
        style={{
          width: size * 1.5,
          height: size * 1.5,
        }}
        animate={{ 
          scale: [1, 1.7, 1],
          opacity: [start * 0.5, peak * 0.7, start * 0.5]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      />
      
      <motion.div
        className={`rounded-full ${colors.bg}/3 absolute`}
        style={{
          width: size * 0.5,
          height: size * 0.5,
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [start * 1.5, peak * 1.7, start * 1.5]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
};

export default ChakraPulse;
