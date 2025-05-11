
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface GlobalWatermarkProps {
  className?: string;
}

const GlobalWatermark: React.FC<GlobalWatermarkProps> = ({ className = '' }) => {
  const { liftTheVeil } = useTheme();
  
  return (
    <motion.div 
      className={`fixed bottom-5 right-5 text-xs text-white/30 pointer-events-none z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      style={{
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Playfair Display, serif',
        letterSpacing: '0.05em'
      }}
    >
      <div className="flex items-center gap-1.5">
        <span 
          className="bg-clip-text text-transparent transition-all duration-500"
          style={{
            backgroundImage: liftTheVeil
              ? 'linear-gradient(45deg, rgba(236, 72, 153, 1), rgba(236, 72, 153, 0.6))'
              : 'linear-gradient(45deg, rgba(168, 85, 247, 1), rgba(139, 92, 246, 0.6))'
          }}
        >
          Sacred Shifter
        </span>
        <span className="opacity-75">•</span>
        <span>Ascending Consciousness</span>
      </div>
    </motion.div>
  );
};

export default GlobalWatermark;
