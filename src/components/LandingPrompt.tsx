
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText } from "@/components/landing";
import { useNavigate } from "react-router-dom";

const LandingPrompt: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);
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
      // After showing the last line, wait a moment and then navigate to home
      const redirectTimer = setTimeout(() => {
        try {
          // Set localStorage to remember user has seen intro
          localStorage.setItem('hasSeenIntro', 'true');
          console.log('Setting hasSeenIntro to true and redirecting to dashboard');
          navigate("/dashboard", { replace: true }); // Changed from /home to /dashboard
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback if navigation fails
          window.location.href = '/dashboard'; // Changed from /home to /dashboard
        }
      }, 4000); // Wait 4 seconds after showing the last line
      return () => clearTimeout(redirectTimer);
    }
  }, [currentLine, navigate, lines.length]);

  // If there's a loading error, show it but still allow continuing
  if (loadingError) {
    console.warn('Loading error occurred:', loadingError);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-50 to-white"
    >
      <Logo />
      <AnimatedText lines={lines} currentLine={currentLine} />
    </motion.div>
  );
};

export default LandingPrompt;
