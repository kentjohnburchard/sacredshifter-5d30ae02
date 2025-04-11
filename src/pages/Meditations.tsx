
import React from 'react';
import Layout from '@/components/Layout';

const Meditations: React.FC = () => {
  return (
    <Layout pageTitle="Meditations">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Meditations</h1>
        <p className="mb-4">
          This page will contain various meditation practices and techniques.
        </p>
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-purple-800">
            Content for this page is coming soon. Please check back later for updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Meditations;
