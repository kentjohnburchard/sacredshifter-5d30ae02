
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText } from "@/components/landing";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const LandingPrompt: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const navigate = useNavigate();
  const lines = [
    "Welcome to Sacred Shifter.",
    "Your body is frequency. Your thoughts are tone.",
    "Let's begin your resonance journey."
  ];

  useEffect(() => {
    console.log('LandingPrompt loaded, currentLine:', currentLine, 'of', lines.length);
    
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (currentLine === lines.length - 1) {
      // After showing the last line, wait a moment and then navigate directly to the dashboard
      const redirectTimer = setTimeout(() => {
        console.log('Completed intro, redirecting to dashboard');
        // Navigate directly to the dashboard instead of home
        navigate("/dashboard", { replace: true });
      }, 4000); // Wait 4 seconds after showing the last line
      return () => clearTimeout(redirectTimer);
    }
  }, [currentLine, navigate, lines.length]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 max-w-7xl mx-auto"
    >
      {/* Enhanced Logo Container with Glow */}
      <div className="relative mb-6 sm:mb-8 lg:mb-12 w-full flex justify-center">
        <motion.div 
          className="absolute -inset-6 bg-gradient-to-r from-purple-500/30 via-blue-500/40 to-pink-500/30 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="relative bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Logo />
          
          {/* Enhanced sparkles around logo */}
          <motion.div 
            className="absolute -top-3 -right-3 text-purple-300"
            animate={{
              rotate: [0, 20, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Sparkles size={20} />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-2 -left-4 text-blue-300"
            animate={{
              rotate: [0, -20, 0],
              scale: [0.7, 1.1, 0.7],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <Sparkles size={18} />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Keep the existing animated text component */}
      <AnimatedText lines={lines} currentLine={currentLine} />
      
      {/* Enhanced Sacred Shimmer Effect */}
      <motion.div 
        className="absolute bottom-10 sm:bottom-16 lg:bottom-20 w-full max-w-md h-2 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent rounded-full mx-auto"
        animate={{
          opacity: [0, 0.9, 0],
          width: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          delay: 1
        }}
      />
    </motion.div>
  );
};

export default LandingPrompt;
