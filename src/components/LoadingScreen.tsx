
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <motion.div
        className="relative w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 opacity-75"></div>
        <div className="absolute inset-0 rounded-full border-r-2 border-indigo-500 opacity-75" style={{ rotate: '45deg' }}></div>
        <div className="absolute inset-0 rounded-full border-b-2 border-blue-500 opacity-75" style={{ rotate: '90deg' }}></div>
      </motion.div>
      <motion.p
        className="mt-8 text-lg text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
