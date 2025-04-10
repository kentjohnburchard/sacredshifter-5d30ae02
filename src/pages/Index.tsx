
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [route, setRoute] = useState<string>('/welcome');
  
  useEffect(() => {
    // For debugging
    console.log('Index component loaded, checking application state...');
    
    try {
      // Check if the user has seen the intro
      const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
      console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
      
      // Determine the route based on intro status
      if (hasSeenIntro) {
        setRoute('/home');
      } else {
        setRoute('/welcome');
      }
    } catch (error) {
      console.error('Error checking intro status:', error);
      // Default to welcome if there's an error
      setRoute('/welcome');
    } finally {
      setIsLoaded(true);
    }
    
    // Add global error handler for network requests
    const handleNetworkError = () => {
      console.warn('Network connection issue detected');
      // We could show a toast notification here
    };
    
    window.addEventListener('offline', handleNetworkError);
    
    return () => {
      window.removeEventListener('offline', handleNetworkError);
    };
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
