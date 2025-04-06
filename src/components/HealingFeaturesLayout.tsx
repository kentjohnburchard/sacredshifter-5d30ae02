
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface HealingFeaturesLayoutProps {
  children: ReactNode;
}

const HealingFeaturesLayout: React.FC<HealingFeaturesLayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full mx-auto flex justify-center items-center min-h-[80vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Create a visible decorative border */}
      <div className="relative max-w-3xl mx-auto border border-purple-200 rounded-2xl p-8 bg-white/5 backdrop-blur-sm shadow-sm">
        {/* Main content in the center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-5 max-w-xl mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default HealingFeaturesLayout;
