import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Index: React.FC = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage<boolean>("has-seen-welcome", false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Short delay to ensure local storage is checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse text-purple-300">Loading...</div>
    </div>;
  }
  
  // If they haven't seen the welcome page, redirect there and mark as seen
  if (!hasSeenWelcome) {
    setHasSeenWelcome(true);
    return <Navigate to="/welcome" replace />;
  }
  
  // Otherwise, go straight to home
  return <Navigate to="/home" replace />;
};

export default Index;
