
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';

interface LightProgressProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  recentLevelUp?: boolean;
}

const LightProgress: React.FC<LightProgressProps> = ({ 
  percentage, 
  size = 'md', 
  showAnimation = true,
  recentLevelUp = false
}) => {
  // Height based on size
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  return (
    <div className="relative">
      <Progress 
        value={percentage} 
        className={`${heightClass} bg-gradient-to-r from-purple-500/20 to-indigo-500/20`}
      />
      
      {/* Glow effect for level up */}
      {recentLevelUp && showAnimation && (
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 rounded-full"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: 2,
              repeatType: "reverse",
            }}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default LightProgress;
