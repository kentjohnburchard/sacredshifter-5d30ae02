
import React, { useEffect } from "react";
import UserDashboard from "@/components/UserDashboard";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { cleanupUserPreferencesData } from "@/utils/cleanupPreferencesData";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Run the cleanup function once when the dashboard loads
  useEffect(() => {
    if (user?.id) {
      cleanupUserPreferencesData(user.id);
    }
  }, [user]);
  
  return (
    <Layout pageTitle="Dashboard">
      <div className="py-4 pb-8">
        <UserDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;
