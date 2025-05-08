
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders content based on user's authentication status,
 * admin role, or premium status.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAdmin = false,
  requirePremium = false,
  fallback,
}) => {
  const { user, isAdmin, isPremium, loading } = useAuth();
  const location = useLocation();
  
  // Store the current path for redirection after login
  if (!loading && !user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-sm text-purple-700">Checking authorization...</div>
      </div>
    );
  }
  
  // Check authentication
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Check admin role if required
  if (requireAdmin && !isAdmin()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Admin Access Required</h3>
        <p className="text-gray-300">You don't have permission to access this area.</p>
      </div>
    );
  }
  
  // Check premium status if required
  if (requirePremium && !isPremium()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="text-center p-8 border border-yellow-500/20 bg-black/50 rounded-lg">
        <h3 className="text-xl font-semibold text-yellow-500 mb-2">Premium Access Required</h3>
        <p className="text-gray-300 mb-4">This content is only available to premium users.</p>
        <a 
          href="/subscription" 
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all"
        >
          Upgrade to Premium
        </a>
      </div>
    );
  }
  
  // All conditions passed
  return <>{children}</>;
};

export default AuthGuard;
