
import React, { useEffect } from "react";
import LandingPrompt from "@/components/LandingPrompt";

const Welcome: React.FC = () => {
  // Mark that the user has seen the intro
  useEffect(() => {
    localStorage.setItem('hasSeenIntro', 'true');
  }, []);
  
  return <LandingPrompt />;
};

export default Welcome;
