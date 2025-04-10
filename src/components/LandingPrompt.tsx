
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText } from "@/components/landing";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LandingPrompt: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
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
          setIsAnimationComplete(true);
          
          // Slightly delay navigation to allow animations to complete
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 500);
        } catch (error) {
          console.error('Navigation error:', error);
          setLoadingError("Navigation error - trying fallback");
          
          // Fallback if navigation fails
          try {
            window.location.href = '/dashboard';
          } catch (fallbackError) {
            console.error('Fallback navigation also failed:', fallbackError);
            toast.error("Navigation failed. Please reload the page.");
          }
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
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-purple-50 to-white"
    >
      <Logo />
      <AnimatedText lines={lines} currentLine={currentLine} />
      
      {loadingError && (
        <div className="mt-6">
          <p className="text-red-500 text-sm">{loadingError}</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Continue to Dashboard
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LandingPrompt;
