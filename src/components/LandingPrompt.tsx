
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
        console.log('Completed intro, redirecting to cosmic dashboard');
        // Navigate directly to the dashboard instead of index
        navigate("/home", { replace: true });
      }, 4000); // Wait 4 seconds after showing the last line
      return () => clearTimeout(redirectTimer);
    }
  }, [currentLine, navigate, lines.length]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20"
    >
      {/* Enhanced Logo Container with Glow */}
      <div className="relative mb-10 w-full flex justify-center">
        <motion.div 
          className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="relative bg-black/30 backdrop-blur-sm p-6 rounded-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Logo />
          
          {/* Subtle sparkles around logo */}
          <motion.div 
            className="absolute -top-2 -right-2 text-purple-300"
            animate={{
              rotate: [0, 15, 0],
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Sparkles size={16} />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-1 -left-3 text-blue-300"
            animate={{
              rotate: [0, -15, 0],
              scale: [0.7, 0.9, 0.7],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <Sparkles size={14} />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Keep the existing animated text component */}
      <AnimatedText lines={lines} currentLine={currentLine} />
      
      {/* Sacred Shimmer Effect */}
      <motion.div 
        className="absolute bottom-20 w-full max-w-md h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full mx-auto"
        animate={{
          opacity: [0, 0.7, 0],
          width: ["0%", "80%", "0%"],
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
