
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Check if the user has seen the intro
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  
  useEffect(() => {
    // For debugging
    console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
  }, [hasSeenIntro]);
  
  // If they haven't seen the intro, show the welcome page
  if (!hasSeenIntro) {
    return <Navigate to="/welcome" replace />;
  }
  
  // Otherwise, redirect to the home page (instead of dashboard)
  return <Navigate to="/home" replace />;
};

export default Index;
