
import React from 'react';
import { motion } from 'framer-motion';

interface MilestoneBadgeProps {
  name: string;
  description?: string;
  icon?: string;
}

const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({ 
  name, 
  description = "Achievement unlocked",
  icon = "/symbols/lotus.svg" // Default icon
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg flex flex-col items-center"
      style={{ width: '120px' }}
    >
      <div className="h-14 w-14 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 border border-purple-500/50">
        <img 
          src={icon} 
          alt={name}
          className="h-8 w-8"
          style={{ filter: 'drop-shadow(0 0 5px #9b87f5)' }}
        />
      </div>
      <h4 className="text-sm font-medium text-center text-white mb-1">{name}</h4>
      <p className="text-xs text-gray-400 text-center">{description}</p>
    </motion.div>
  );
};

export default MilestoneBadge;
