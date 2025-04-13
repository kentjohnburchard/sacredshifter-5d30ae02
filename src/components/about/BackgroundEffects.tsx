
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundEffectsProps {
  isLiftedVeil: boolean;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ isLiftedVeil }) => {
  return (
    <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {isLiftedVeil ? (
          <motion.div
            key="veil-lifted-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-indigo-500/5 rounded-full filter blur-2xl"></div>
          </motion.div>
        ) : (
          <motion.div
            key="standard-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundEffects;
