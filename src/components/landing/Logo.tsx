
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
        src="/lovable-uploads/09ffadc3-5726-41e7-a925-e6e16e0aa144.png" 
        alt="Sacred Shifter Logo" 
        className="w-full max-w-[800px] mx-auto" 
      />
    </motion.div>
  );
};

export default Logo;
