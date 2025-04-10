
import React, { useEffect } from "react";
import LandingPrompt from "@/components/LandingPrompt";

const Welcome: React.FC = () => {
  // This will allow us to debug welcome page functionality
  useEffect(() => {
    console.log('Welcome page loaded');
  }, []);
  
  return <LandingPrompt />;
};

export default Welcome;
