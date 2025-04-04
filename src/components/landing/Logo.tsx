
import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.9 },
    animate: {
      scale: [1, 1.1, 1.05],
      opacity: [0.9, 1, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
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
        src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
        alt="Sacred Shifter Logo" 
        className="w-full max-w-[270px] mx-auto" // Increased by 50% from 180px
      />
    </motion.div>
  );
};

export default Logo;
