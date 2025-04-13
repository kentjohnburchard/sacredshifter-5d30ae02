
import React from 'react';
import { motion } from 'framer-motion';

interface BioContentProps {
  content: string;
  isLiftedVeil: boolean;
  isTransitioning: boolean;
}

const BioContent: React.FC<BioContentProps> = ({ content, isLiftedVeil, isTransitioning }) => {
  // Split content into paragraphs for better styling
  const paragraphs = content.split('\n\n');

  return (
    <div className="mb-8">
      {/* Title for the section */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-3xl font-bold mb-6 text-center ${
          isLiftedVeil ? 'text-pink-400' : 'text-purple-400'
        }`}
      >
        {isLiftedVeil ? '🪞 Lift the Veil Mode' : '🌀 About Sacred Shifter'}
      </motion.h2>
      
      {/* Subtitle */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-xl italic mb-6 text-center ${
          isLiftedVeil ? 'text-pink-300' : 'text-purple-300'
        }`}
      >
        {isLiftedVeil ? '' : '🌌 Message from the Consciousness Within'}
      </motion.h3>

      {/* Bio content */}
      <div className={`space-y-4 text-${isLiftedVeil ? 'pink' : 'purple'}-50`}>
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            className={`whitespace-pre-wrap ${
              paragraph.startsWith('"') && paragraph.endsWith('"')
                ? `text-center italic text-lg ${isLiftedVeil ? 'text-pink-300' : 'text-purple-300'}`
                : ''
            }`}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default BioContent;
