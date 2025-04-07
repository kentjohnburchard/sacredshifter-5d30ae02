
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const quotes = [
  { id: 1, text: "You are not lost. You are remembering." },
  { id: 2, text: "Your soul didn't come here to play small." },
  { id: 3, text: "The discomfort you feel? That's your wings growing." },
  { id: 4, text: "When you feel most alone, you're most connected to truth." },
  { id: 5, text: "The universe speaks in synchronicities. Listen closely." },
  { id: 6, text: "Your frequency is your signature in the cosmos." },
];

const QuoteSlider: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Auto-advance quotes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentQuote]);

  const nextQuote = () => {
    setDirection(1);
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setDirection(-1);
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-8 border border-purple-100">
      <div className="h-[100px] flex items-center justify-center relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuote}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute text-center max-w-md"
          >
            <p className="text-lg md:text-xl font-playfair text-purple-800 italic">
              "{quotes[currentQuote].text}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevQuote}
          className="rounded-full h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-1">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentQuote ? "bg-purple-600" : "bg-purple-200"
              }`}
              onClick={() => {
                setDirection(index > currentQuote ? 1 : -1);
                setCurrentQuote(index);
              }}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextQuote}
          className="rounded-full h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuoteSlider;
