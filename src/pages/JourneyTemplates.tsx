
import React from 'react';
import Layout from '@/components/Layout';

const JourneyTemplates: React.FC = () => {
  return (
    <Layout pageTitle="Journey Templates">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Journey Templates</h1>
        <p className="text-lg text-gray-700">
          Explore curated frequency journeys for different intentions and purposes.
        </p>
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
