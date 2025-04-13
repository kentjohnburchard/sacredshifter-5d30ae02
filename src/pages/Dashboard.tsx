
import React, { useEffect, useState } from "react";
import UserDashboard from "@/components/UserDashboard";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { cleanupUserPreferencesData } from "@/utils/cleanupPreferencesData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import OriginFlow from "@/components/sacred-geometry/OriginFlow";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showOriginFlow, setShowOriginFlow] = useState(false);
  const [dashboardVisits, setDashboardVisits] = useLocalStorage<number>("dashboard-visit-count", 0);
  
  // Run the cleanup function once when the dashboard loads
  useEffect(() => {
    if (user?.id) {
      cleanupUserPreferencesData(user.id);
    }
    
    // Track dashboard visits
    setDashboardVisits((prev: number) => {
      // Need to ensure we're treating prev as a number
      const currentVisits = typeof prev === 'number' ? prev : 0;
      return currentVisits + 1;
    });
    
    // Show origin flow if this is one of the first three visits
    if ((typeof dashboardVisits === 'number' && dashboardVisits < 3)) {
      const timer = setTimeout(() => {
        setShowOriginFlow(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, dashboardVisits, setDashboardVisits]);
  
  return (
    <Layout pageTitle="Dashboard">
      <div className="py-4 pb-8">
        <UserDashboard />
      </div>
      
      {showOriginFlow && (
        <OriginFlow 
          forceShow={true}
          onComplete={() => setShowOriginFlow(false)} 
        />
      )}
    </Layout>
  );
};

export default Dashboard;
