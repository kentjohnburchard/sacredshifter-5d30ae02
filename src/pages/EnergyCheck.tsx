
import React from 'react';
import Layout from '@/components/Layout';

const EnergyCheck: React.FC = () => {
  return (
    <Layout pageTitle="Energy Check">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Energy Check</h1>
        <p className="text-lg text-gray-700">
          Monitor and balance your personal energetic field.
        </p>
      </div>
    </Layout>
  );
};

export default EnergyCheck;
