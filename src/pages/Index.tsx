import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  
  useEffect(() => {
    console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
  }, [hasSeenIntro]);
  
  // If they haven't seen the intro, show the welcome page
  if (!hasSeenIntro) {
    return <Navigate to="/welcome" replace />;
  }
  
  // Otherwise, redirect to the cosmic dashboard
  return <Navigate to="/home" replace />;
};

export default Index;
