import React from 'react';
import { motion } from 'framer-motion';

interface Chakra {
  name: string;
  color: string;
  description: string;
}

interface ChakraAlignmentSectionProps {
  chakras: Chakra[];
  activeChakra: Chakra | null;
  onChakraSelect: (chakra: Chakra) => void;
}

const ChakraAlignmentSection: React.FC<ChakraAlignmentSectionProps> = ({ 
  chakras,
  activeChakra,
  onChakraSelect,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-center items-center">
        {chakras.map((chakra) => (
          <div
            key={chakra.name}
            className="flex flex-col items-center mx-2 cursor-pointer"
            onClick={() => onChakraSelect(chakra)}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-white font-bold shadow-md`}
              style={{ backgroundColor: chakra.color }}
            >
              {chakra.name.charAt(0).toUpperCase()}
            </motion.div>
            <p className="text-sm mt-1 text-gray-300">{chakra.name}</p>
          </div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          // Using style prop instead of direct boxShadow
          // This avoids the TS error
        }}
        style={{ 
          boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.2)" 
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-full pointer-events-none"
      >
        
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        className="absolute"
      >
        
      </motion.div>
    </div>
  );
};

export default ChakraAlignmentSection;
