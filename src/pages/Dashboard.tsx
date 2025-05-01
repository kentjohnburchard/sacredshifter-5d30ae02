
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import UserDashboard from '@/components/UserDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    console.log("Dashboard page mounting, user:", user ? "authenticated" : "not authenticated");
  }, [user]);

  return (
    <Layout 
      pageTitle="Dashboard | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {user ? (
            <UserDashboard />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
              <p className="text-gray-600">
                Your personal journey dashboard will appear here once you're signed in.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
