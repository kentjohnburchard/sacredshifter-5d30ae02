
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkOnboardingStatus } from "@/utils/profiles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      
      // Skip onboarding check for the onboarding page itself
      if (location.pathname === "/onboarding") {
        return;
      }
      
      try {
        setCheckingOnboarding(true);
        const isCompleted = await checkOnboardingStatus(user.id);
        setOnboardingCompleted(isCompleted);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to not completed if there's an error
        setOnboardingCompleted(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };
    
    if (user) {
      checkOnboarding();
    }
  }, [user, location.pathname]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If we're not on the onboarding page and onboarding is not completed, redirect to onboarding
  if (
    onboardingCompleted === false && 
    location.pathname !== "/onboarding" && 
    !checkingOnboarding
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
