
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [route, setRoute] = useState<string>('/dashboard'); // Default to dashboard
  
  useEffect(() => {
    console.log('Index component loaded, checking application state...');
    
    try {
      // Check if the user has seen the intro
      const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
      console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
      
      // Always go to dashboard if they've seen intro, otherwise welcome
      setRoute(hasSeenIntro ? '/dashboard' : '/welcome');
    } catch (error) {
      console.error('Error checking intro status:', error);
      // Default to welcome if there's an error
      setRoute('/welcome');
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading Sacred Shifter...</p>
        </div>
      </div>
    );
  }
  
  // Navigate to the determined route
  return <Navigate to={route} replace />;
};

export default Index;
