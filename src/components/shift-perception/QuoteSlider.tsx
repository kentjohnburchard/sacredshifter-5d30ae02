
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const quotes = [
  {
    text: "The day you decide that you are more interested in being aware of your thoughts than you are in the thoughts themselves—that is the day you will find your way out.",
    author: "Michael Singer"
  },
  {
    text: "You are not the voice of the mind, you are the one who hears it.",
    author: "Eckhart Tolle"
  },
  {
    text: "The mind is a wonderful servant but a terrible master.",
    author: "Robin Sharma"
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl"
  },
  {
    text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
    author: "Albert Einstein"
  }
];

const QuoteSlider: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  
  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex(prevIndex => (prevIndex === 0 ? quotes.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setDirection('right');
    setCurrentIndex(prevIndex => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1));
  };
  
  useEffect(() => {
    const timer = setTimeout(goToNext, 12000);
    return () => clearTimeout(timer);
  }, [currentIndex]);
  
  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -200 : 200,
      opacity: 0
    })
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between mb-4">
        <button
          onClick={goToPrevious}
          className={`p-2 rounded-full transition-all ${
            liftTheVeil 
              ? 'bg-pink-900/40 hover:bg-pink-800/60 text-pink-200 shadow-[0_0_8px_rgba(236,72,153,0.3)]' 
              : 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
          }`}
          aria-label="Previous quote"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className={`p-2 rounded-full transition-all ${
            liftTheVeil 
              ? 'bg-pink-900/40 hover:bg-pink-800/60 text-pink-200 shadow-[0_0_8px_rgba(236,72,153,0.3)]' 
              : 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
          }`}
          aria-label="Next quote"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className={`relative overflow-hidden p-6 rounded-lg backdrop-blur-sm ${
        liftTheVeil 
          ? 'bg-pink-950/40 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
          : 'bg-purple-950/40 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
      }`}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.5 }}
            className="min-h-[120px] flex flex-col justify-center"
          >
            <p className="text-white italic mb-2 text-enhanced">"{quotes[currentIndex].text}"</p>
            <p className="text-right text-sm text-gray-200">— {quotes[currentIndex].author}</p>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-4 flex justify-center space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex
                  ? (liftTheVeil 
                      ? 'bg-pink-400 shadow-[0_0_5px_rgba(236,72,153,0.7)]' 
                      : 'bg-purple-400 shadow-[0_0_5px_rgba(139,92,246,0.7)]')
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteSlider;
