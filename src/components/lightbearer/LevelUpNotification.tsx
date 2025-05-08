
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbearerLevel } from '@/types/lightbearer';

interface LevelUpNotificationProps {
  show: boolean;
  onClose: () => void;
  level: LightbearerLevel;
  previousLevel?: number;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  show,
  onClose,
  level,
  previousLevel = 1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  const handleAnimationComplete = () => {
    if (!isVisible) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
        >
          <div className="relative">
            {/* Animated Rays */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ delay: 0.3, duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-80 h-80 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 opacity-20 animate-pulse"></div>
            </motion.div>
            
            {/* Main Level Up Card */}
            <motion.div
              className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl border-2 border-purple-400 shadow-2xl max-w-md mx-auto text-center z-10 relative"
            >
              <h2 className="text-yellow-300 text-4xl font-bold mb-2">Level Up!</h2>
              <p className="text-white text-lg mb-6">
                You've reached level {level.level_num}
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-purple-800 border-4 border-yellow-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl font-bold text-white">{level.level_num}</span>
                </div>
                
                {level.title && (
                  <h3 className="text-2xl font-medium text-white mb-1">"{level.title}"</h3>
                )}
                
                <p className="text-gray-300">
                  You've been promoted from level {previousLevel} to level {level.level_num}
                </p>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition-colors"
                onClick={() => setIsVisible(false)}
              >
                Continue Your Journey
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpNotification;
