
import React from 'react';
import Layout from '@/components/Layout';

const HeartDashboard: React.FC = () => {
  return (
    <Layout pageTitle="Heart Dashboard">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Heart Dashboard</h1>
        <p className="text-lg text-gray-700">
          Track your heart-centered practices and emotional well-being.
        </p>
      </div>
    </Layout>
  );
};

export default HeartDashboard;
