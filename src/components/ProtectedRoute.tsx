
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
    console.log("Auth state:", { authenticated: !!user, loading });
    
    if (!loading && !user) {
      console.log("User not authenticated, storing redirect path:", location.pathname);
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [user, loading, location.pathname]);

  // Show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full"></div>
        <div className="ml-3 text-purple-700">Verifying authentication...</div>
      </div>
    );
  }

  // Only redirect when we're sure user is not authenticated (loading is false)
  if (!user) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
