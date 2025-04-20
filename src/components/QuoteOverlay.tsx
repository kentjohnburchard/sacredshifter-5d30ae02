
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
  "You are not a drop in the ocean. You are the entire ocean in a drop.",
  "What you seek is seeking you.",
  "The wound is where the light enters you.",
  "In the universe, there are things that are known, and things that are unknown, and in between, there are doors.",
  "As above, so below, as within, so without, as the universe, so the soul.",
  "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
  "We are the cosmos made conscious and life is the means by which the universe understands itself.",
  "Everything in the universe is within you. Ask all from yourself.",
  "There is a voice that doesn't use words. Listen."
];

const QuoteOverlay: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    setCurrentQuote(quotes[index]);
    
    const interval = setInterval(() => {
      setIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % quotes.length;
        setCurrentQuote(quotes[newIndex]);
        return newIndex;
      });
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="quote-overlay">
      <motion.p 
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="quote-text"
      >
        {currentQuote}
      </motion.p>
    </div>
  );
};

export default QuoteOverlay;
