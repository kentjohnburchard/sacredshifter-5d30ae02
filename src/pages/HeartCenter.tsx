
import React from 'react';
import Layout from '@/components/Layout';

const HeartCenter: React.FC = () => {
  return (
    <Layout pageTitle="Heart Center">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Heart Center</h1>
        <p className="text-lg text-gray-700">
          Welcome to the Heart Center, a space for emotional balance and healing.
        </p>
      </div>
    </Layout>
  );
};

export default HeartCenter;
