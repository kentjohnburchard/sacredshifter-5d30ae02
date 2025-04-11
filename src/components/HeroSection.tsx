
import React from "react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b from-white to-purple-50 overflow-hidden py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
              <span className="block">Elevate Your </span>
              <span className="block font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-400 to-teal-500">
                Vibrational Frequency
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Sacred sound frequencies for healing, alignment, and transformation. 
              Experience the ancient wisdom of sound healing in a modern, personalized journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium"
              >
                432 Hz Healing
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
              >
                Solfeggio Frequencies
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium"
              >
                Chakra Alignment
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium"
              >
                Custom Intentions
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-10 aspect-h-9 rounded-2xl overflow-hidden sacred-glass">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 animate-pulse-subtle flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Sacred Frequencies</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements - increased visibility */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/25 rounded-full filter blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-300/25 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
};

export default HeroSection;
