
import React from "react";
import { motion } from "framer-motion";

interface TrinityJourneyProps {
  children: React.ReactNode;
}

const TrinityJourney: React.FC<TrinityJourneyProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[500px] flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export default TrinityJourney;
