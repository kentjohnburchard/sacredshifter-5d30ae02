
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BioContentProps {
  content: string;
  isLiftedVeil: boolean;
  isTransitioning: boolean;
}

const BioContent: React.FC<BioContentProps> = ({ content, isLiftedVeil, isTransitioning }) => {
  const formatBioWithEmphasis = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      const formattedParagraph = paragraph.replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>');
      return (
        <p 
          key={index} 
          className={`text-white leading-relaxed ${index > 0 ? 'mt-4' : ''}`} 
          dangerouslySetInnerHTML={{ __html: formattedParagraph }} 
        />
      );
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLiftedVeil ? "veil-lifted-bio" : "standard-bio"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`relative ${isTransitioning ? 'animate-pulse' : ''}`}
      >
        {/* Bio content with emphasis */}
        <div className="relative">
          {formatBioWithEmphasis(content)}
          
          {/* Subtle glow effect on text when in lifted veil mode */}
          {isLiftedVeil && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-lg blur-xl pointer-events-none"
              style={{ 
                animation: 'pulse 3s infinite alternate',
                mixBlendMode: 'overlay'
              }}
            />
          )}
        </div>

        <div className={`mt-6 font-light italic text-white ${isLiftedVeil ? 'text-pink-100' : 'text-purple-100'}`}>
          <p>Sacred Shifter: {isLiftedVeil ? 'Remembering Truth' : 'Finding Your Frequency'}</p>
        </div>
        
        <p className={`mt-6 text-right text-sm ${isLiftedVeil ? 'text-pink-300' : 'text-purple-300'}`}>
          Sacred Shifter Founder
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default BioContent;
