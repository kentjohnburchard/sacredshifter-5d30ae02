
import React, { useEffect } from "react";
import UserDashboard from "@/components/UserDashboard";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { cleanupUserPreferencesData } from "@/utils/cleanupPreferencesData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardVisits, setDashboardVisits] = useLocalStorage<number>("dashboard-visit-count", 0);
  
  // Run the cleanup function once when the dashboard loads
  useEffect(() => {
    if (user?.id) {
      cleanupUserPreferencesData(user.id);
    }
    
    // Track dashboard visits - Fix TS error by using a non-function value
    setDashboardVisits(typeof dashboardVisits === 'number' ? dashboardVisits + 1 : 1);
  }, [user, dashboardVisits, setDashboardVisits]);
  
  return (
    <Layout pageTitle="Dashboard">
      <div className="py-4 pb-8">
        <UserDashboard />
      </div>
      
      {/* Add Sacred Audio Player */}
      <SacredAudioPlayer />
    </Layout>
  );
};

export default Dashboard;
