
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    console.log("ProtectedRoute rendering for path:", location.pathname);
    console.log("Auth state:", { authenticated: !!user, loading, userEmail: user?.email });
    
    // Store the current path for redirection after login
    if (!loading && !user) {
      console.log("User not authenticated, storing redirect path:", location.pathname);
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
    
    // Set a timeout to prevent infinite loading state
    const authCheckTimeout = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 3000); // 3 seconds max wait time
    
    return () => clearTimeout(authCheckTimeout);
  }, [user, loading, location.pathname]);
  
  // Only show loading indicator for a reasonable amount of time
  if (loading && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-lg text-purple-700">Verifying authentication...</div>
      </div>
    );
  }
  
  // Either authenticated or timed out - proceed accordingly
  if (!user) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
