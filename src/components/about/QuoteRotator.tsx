
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export type Quote = {
  text: string;
  author?: string;
};

interface QuoteRotatorProps {
  quote: Quote;
  isLiftedVeil: boolean;
}

const QuoteRotator: React.FC<QuoteRotatorProps> = ({ quote, isLiftedVeil }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-10 p-8 bg-opacity-10 backdrop-blur-sm 
        ${isLiftedVeil 
          ? 'bg-pink-900/30 border border-pink-500/30' 
          : 'bg-purple-900/30 border border-purple-500/30'} 
        rounded-lg shadow-md`}
    >
      <p className="italic text-center text-white text-xl md:text-2xl font-light">
        "{quote.text}"
      </p>
      {quote.author && (
        <p className={`text-center text-sm mt-4 ${isLiftedVeil ? 'text-pink-200' : 'text-purple-200'}`}>
          — {quote.author}
        </p>
      )}
      <div className="flex justify-center mt-4">
        <Sparkles className={`h-5 w-5 ${isLiftedVeil ? 'text-pink-400' : 'text-purple-400'} animate-pulse`} />
      </div>
    </motion.div>
  );
};

export default QuoteRotator;
