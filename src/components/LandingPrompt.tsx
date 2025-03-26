
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPrompt: React.FC = () => {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const lines = [
    "Welcome to Sacred Shifter.",
    "Your body is frequency. Your thoughts are tone.",
    "Let's begin your resonance journey."
  ];

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-50 to-white"
    >
      {/* Enlarged Logo */}
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
      
      <div className="space-y-12 mb-10">
        {lines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index <= currentLine ? 1 : 0,
              y: index <= currentLine ? 0 : 20
            }}
            transition={{ 
              duration: 1.5,
              delay: index <= currentLine ? 0 : 0.5 
            }}
            className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 max-w-2xl mx-auto"
          >
            {line}
          </motion.p>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: currentLine >= lines.length - 1 ? 1 : 0,
          y: currentLine >= lines.length - 1 ? 0 : 20
        }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Button 
          onClick={() => navigate("/energy-check")}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
          size="lg"
        >
          Begin Vibe Check-In
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default LandingPrompt;
