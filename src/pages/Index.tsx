
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [route, setRoute] = useState<string>('/dashboard'); // Default to dashboard
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('Index component loaded, checking application state...');
    
    // Use a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Loading timeout reached, redirecting to dashboard as fallback');
        setRoute('/dashboard');
        setIsLoaded(true);
      }
    }, 3000); // 3 second timeout
    
    try {
      // Check if the user has seen the intro
      const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
      console.log('Index component loaded, hasSeenIntro:', hasSeenIntro);
      
      // Go to welcome for new users, dashboard for returning users
      setRoute(hasSeenIntro ? '/dashboard' : '/welcome');
    } catch (error) {
      console.error('Error checking intro status:', error);
      setError('Failed to check if you have seen the intro. Redirecting to welcome page.');
      // Default to welcome if there's an error
      setRoute('/welcome');
    } finally {
      setIsLoaded(true);
      clearTimeout(timeoutId);
    }
    
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
  
  if (error) {
    toast.error(error);
  }
  
  // Navigate to the determined route
  return <Navigate to={route} replace />;
};

export default Index;
