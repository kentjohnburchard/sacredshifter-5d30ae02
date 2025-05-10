
import React from 'react';
import SacredLayout from '@/components/layout/SacredLayout';
import UserDashboard from '@/components/UserDashboard';

const Dashboard: React.FC = () => {
  return (
    <SacredLayout 
      pageTitle="Dashboard" 
      showSidebar={true}
      chakraColor="#8b5cf6"
      themeIntensity="medium"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          Your Sacred Dashboard
        </h1>
        
        <UserDashboard />
      </div>
    </SacredLayout>
  );
};

export default Dashboard;
