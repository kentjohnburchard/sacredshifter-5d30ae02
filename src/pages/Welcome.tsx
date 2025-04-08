
import React, { useState, useEffect } from "react";
import LandingPrompt from "@/components/LandingPrompt";

const Welcome: React.FC = () => {
  // This will allow us to debug welcome page functionality
  useEffect(() => {
    console.log('Welcome page loaded');
    // We'll only set hasSeenIntro to true after the welcome animation completes
    // This is now handled in LandingPrompt component
  }, []);
  
  return <LandingPrompt />;
};

export default Welcome;
