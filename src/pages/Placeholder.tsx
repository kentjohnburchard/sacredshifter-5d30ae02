
import React from 'react';
import Layout from '@/components/Layout';

const Placeholder: React.FC = () => {
  return (
    <Layout pageTitle="Page Under Construction" showNavbar={true}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-purple-900/30 backdrop-blur-md rounded-lg border border-purple-500/30 max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-purple-100">This page is under construction ✨</h1>
          <p className="text-purple-200 mb-2">
            The Sacred Shifter team is currently working on this experience.
          </p>
          <p className="text-purple-300 text-sm">
            Please check back soon for updates on your spiritual journey.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Placeholder;
