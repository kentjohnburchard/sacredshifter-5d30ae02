
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText } from "@/components/landing";
import { useNavigate } from "react-router-dom";

const LandingPrompt: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const navigate = useNavigate();
  const lines = [
    "Welcome to Sacred Shifter.",
    "Your body is frequency. Your thoughts are tone.",
    "Let's begin your resonance journey."
  ];

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // After showing the last line, wait a moment and then navigate to index
      const redirectTimer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 4000); // Wait 4 seconds after showing the last line
      return () => clearTimeout(redirectTimer);
    }
  }, [currentLine, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-50 to-white"
    >
      <Logo />
      <AnimatedText lines={lines} currentLine={currentLine} />
      {currentLine >= lines.length - 1 && (
        <div className="mt-6 text-xl text-gray-600">
          Let's begin your resonance journey.
        </div>
      )}
    </motion.div>
  );
};

export default LandingPrompt;
