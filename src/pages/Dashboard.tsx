import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import ComingSoonBanner from '@/components/ComingSoonBanner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Remove or comment out the ComingSoonBanner */}
        {/* <ComingSoonBanner show={false} /> */}
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
