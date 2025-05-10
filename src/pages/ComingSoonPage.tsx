
import React from 'react';
import Layout from '@/components/Layout';

const ComingSoonPage: React.FC = () => {
  return (
    <Layout pageTitle="Coming Soon">
      <div className="max-w-7xl mx-auto p-4 md:p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
        <p className="text-xl text-gray-300 mb-8">This feature is currently under development.</p>
      </div>
    </Layout>
  );
};

export default ComingSoonPage;
