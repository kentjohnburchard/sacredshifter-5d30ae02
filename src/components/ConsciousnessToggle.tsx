
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Number of clicks needed to trigger the easter egg
const CLICKS_TO_TRIGGER = 7;
// Time window in milliseconds for the clicks (3 seconds)
const CLICK_WINDOW = 3000;

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  const [clickCount, setClickCount] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Reset click count after timeout
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, CLICK_WINDOW);
      
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  
  // Handle click on the logo or secret area
  const handleSecretClick = () => {
    // Increment click counter
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Show progress indicator
    if (newCount > 1 && newCount < CLICKS_TO_TRIGGER) {
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 1000);
    }
    
    // If we reach the target click count, toggle easter egg mode
    if (newCount >= CLICKS_TO_TRIGGER) {
      setClickCount(0);
      setLiftTheVeil(!liftTheVeil);
    }
  };
  
  // Return a hidden interactive element for development and a small 
  // visual indicator when the easter egg is being triggered
  return (
    <>
      {/* Hidden clickable area in bottom right - for logo or other secret area */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-12 h-12 opacity-0"
        onClick={handleSecretClick}
        aria-hidden="true"
      />
      
      {/* Visual feedback for click progress */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 right-4 z-[1000] bg-black/80 text-white text-xs py-1 px-2 rounded-full"
          >
            {clickCount}/{CLICKS_TO_TRIGGER}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click trigger on Sacred Shifter logo in header */}
      <div 
        className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000] w-40 h-10 opacity-0"
        onClick={handleSecretClick}
        aria-hidden="true"
      />
    </>
  );
};

export default ConsciousnessToggle;
