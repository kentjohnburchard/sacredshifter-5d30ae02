
import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="mb-10 w-full flex justify-center"
    >
      <img 
        src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
        alt="Sacred Shifter Logo" 
        className="w-full max-w-[180px] mx-auto" 
      />
    </motion.div>
  );
};

export default Logo;
