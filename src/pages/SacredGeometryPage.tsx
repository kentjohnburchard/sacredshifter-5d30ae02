
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const SacredGeometryPage = () => {
  return (
    <PageLayout title="Sacred Geometry">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Sacred Geometry Explorer</h1>
        <p className="mb-4">Discover the divine patterns that connect all existence.</p>
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-12 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">Sacred Geometry Visualizations Coming Soon</span>
        </div>
      </div>
    </PageLayout>
  );
};

export default SacredGeometryPage;
