
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import UserDashboard from '@/components/UserDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout 
      pageTitle="Dashboard | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <UserDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
