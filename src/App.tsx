
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";
import { useJourney } from "./context/JourneyContext";
import { useGuidance } from "./context/GuidanceContext";
import { useCommunity } from "./contexts/CommunityContext";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { currentPath, setCurrentPath } = useJourney();
  const { userState, updateUserState } = useGuidance();
  const { posts } = useCommunity();

  // Update current path in JourneyContext when location changes
  useEffect(() => {
    if (setCurrentPath) {
      setCurrentPath(location.pathname);
    }
    
    // Update user state for guidance system
    if (updateUserState) {
      updateUserState({
        currentPath: location.pathname,
        lastActive: new Date(),
        communityActivity: posts.length > 0
      });
    }
  }, [location, setCurrentPath, updateUserState, posts]);

  return (
    <div className="app-container">
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
