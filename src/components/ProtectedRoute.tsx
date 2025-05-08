
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requirePremium = false
}) => {
  const { user, loading, isAdmin, isPremium } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute rendering for path:", location.pathname);
    console.log("User authenticated?", !!user, "Loading?", loading);
    
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

  // Check if admin access is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <div className="text-lg text-red-600 mb-4">Admin access required</div>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  // Check if premium access is required but user is not premium
  if (requirePremium && !isPremium()) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <div className="text-lg text-amber-600 mb-4">Premium access required</div>
        <p className="text-gray-600 mb-4">This content is only available to premium users.</p>
        <a 
          href="/subscription" 
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Upgrade to Premium
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
