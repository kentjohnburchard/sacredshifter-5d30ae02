
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react';

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();

  return (
    <motion.button
      className={`fixed bottom-6 right-6 z-[1000] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
        liftTheVeil
          ? 'bg-gradient-to-r from-pink-500 to-pink-700 text-white'
          : 'bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30'
      }`}
      onClick={() => setLiftTheVeil(!liftTheVeil)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={liftTheVeil ? 'Return to normal consciousness' : 'Lift the veil of perception'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Sparkles className={`h-5 w-5 ${liftTheVeil ? 'animate-pulse' : ''}`} />
      {liftTheVeil && (
        <motion.div
          className="absolute -inset-2 bg-pink-500/20 rounded-full -z-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default ConsciousnessToggle;
