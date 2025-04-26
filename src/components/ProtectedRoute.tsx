
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

  console.log("ProtectedRoute: User authenticated?", !!user, "Loading?", loading);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      
      // Always set onboarding as completed for now to prevent redirect loops
      setOnboardingCompleted(true);
      return;
    };
    
    if (user) {
      checkOnboarding();
    }
  }, [user, location.pathname]);

  if (loading) {
    console.log("ProtectedRoute: Still loading authentication state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to auth page");
    // Explicitly store the intended path before redirecting
    const currentPath = location.pathname;
    if (currentPath !== "/auth") {
      console.log("ProtectedRoute: Storing redirect path:", currentPath);
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  
  console.log("ProtectedRoute: User authenticated, rendering protected content");
  // Always return children for now since onboarding is disabled
  return <>{children}</>;
};

export default ProtectedRoute;
