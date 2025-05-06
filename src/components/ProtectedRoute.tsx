
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute rendering for path:", location.pathname);
    
    // Store the current path for redirection after login
    if (!loading && !user) {
      console.log("User not authenticated, storing redirect path:", location.pathname);
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [user, loading, location.pathname]);
  
  // Show loading indicator if auth is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-lg text-purple-700">Verifying authentication...</div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
