
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [route, setRoute] = useState<string>('/dashboard'); // Default to dashboard
  
  useEffect(() => {
    console.log('Index component loaded, checking application state...');
    
    // Use a short timeout to prevent "flash of redirect"
    const timeoutId = setTimeout(() => {
      try {
        // Check if the user has seen the intro
        const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
        console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
        
        // Go to welcome for new users, dashboard for returning users
        setRoute(hasSeenIntro ? '/dashboard' : '/welcome');
      } catch (error) {
        console.error('Error checking intro status:', error);
        // Default to welcome if there's an error accessing localStorage
        toast.error('Failed to check if you have seen the intro. Redirecting to welcome page.');
        setRoute('/welcome');
      } finally {
        setIsLoaded(true);
      }
    }, 200); // Short timeout for smoother transition
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading Sacred Shifter...</p>
          <div className="mt-4 w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Navigate to the determined route
  return <Navigate to={route} replace />;
};

export default Index;
