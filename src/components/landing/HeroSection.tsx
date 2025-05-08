
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-transparent overflow-hidden py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl font-extralight tracking-tight text-white">
              <span className="block">Elevate Your </span>
              <span className="block font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-400 to-teal-500">
                Consciousness
              </span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed">
              Sacred sound frequencies for healing, alignment, and transformation. 
              Experience the ancient wisdom of sound healing in a modern, personalized journey.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg group"
                onClick={() => navigate('/auth')}
              >
                Begin Your Journey 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                onClick={() => navigate('/sacred-circle')}
              >
                Join the Community
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 text-xs font-medium"
              >
                432 Hz Healing
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-xs font-medium"
              >
                Solfeggio Frequencies
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-teal-900/40 text-teal-200 text-xs font-medium"
              >
                Chakra Alignment
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 rounded-full bg-amber-900/40 text-amber-200 text-xs font-medium"
              >
                Sacred Geometry
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-w-10 aspect-h-9 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png" 
                  alt="Sacred Shifter Logo" 
                  className="w-5/6 max-w-xs md:max-w-sm"
                />
              </div>
              
              {/* Animated orbs */}
              <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-purple-400/40 animate-pulse-slow"></div>
              <div className="absolute bottom-1/3 right-1/3 w-8 h-8 rounded-full bg-blue-400/40 animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
              <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-pink-400/40 animate-pulse-slow" style={{ animationDelay: "0.8s" }}></div>
            </div>
            
            {/* Sacred geometry overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <circle cx="250" cy="250" r="100" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="250" cy="250" r="150" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="250" cy="250" r="200" stroke="white" strokeWidth="1" fill="none" />
                <path d="M250 50 L250 450" stroke="white" strokeWidth="1" />
                <path d="M50 250 L450 250" stroke="white" strokeWidth="1" />
                <path d="M250 50 L450 250 L250 450 L50 250 Z" stroke="white" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements - increased visibility */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
};

export default HeroSection;
