
import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  // Fix the pulseVariants type issue by using proper Framer Motion types
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.9 },
    animate: {
      scale: [1, 1.1, 1.05],
      opacity: [0.9, 1, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const // Use const assertion to fix type
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="mb-10 w-full flex justify-center"
    >
      <motion.img 
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
        alt="Sacred Shifter Logo" 
        className="w-full max-w-[270px] mx-auto"
      />
    </motion.div>
  );
};

export default Logo;
