
import React from 'react';
import Layout from '@/components/layout/Layout';

const LightbearerPage: React.FC = () => {
  return (
    <Layout title="Lightbearer | Sacred Shifter">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Lightbearer Journey
        </h1>
        
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
          <p className="text-gray-300 mb-6 text-lg">
            Your Lightbearer progress will be displayed here. This page is being rebuilt for a cleaner, more modular experience.
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
          </div>
          
          <p className="text-center text-gray-400 mt-6">
            Coming soon with improved functionality
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LightbearerPage;
