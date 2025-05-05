
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const VisualizerTestPage = () => {
  return (
    <PageLayout title="Visualizer Test">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Sacred Visualizer Test Environment</h1>
        <p className="mb-4">This area is for testing new visualization experiences.</p>
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-12 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">Visualizer Test Coming Soon</span>
        </div>
      </div>
    </PageLayout>
  );
};

export default VisualizerTestPage;
