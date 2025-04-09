
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JourneyAffirmationProps {
  affirmation: string;
  show: boolean;
}

const JourneyAffirmation: React.FC<JourneyAffirmationProps> = ({ affirmation, show }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      // Show the affirmation
      setIsVisible(true);
      
      // Hide it after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 3 }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/40 backdrop-blur-sm px-8 py-6 rounded-xl max-w-md text-center">
            <p className="text-white/90 text-xl italic font-light">
              "{affirmation}"
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JourneyAffirmation;
