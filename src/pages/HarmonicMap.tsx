
import React from 'react';
import Layout from '@/components/Layout';
import HarmonicMapViewer from '@/components/harmonic-map/HarmonicMapViewer';

const HarmonicMapPage: React.FC = () => {
  return (
    <Layout pageTitle="Harmonic Map">
      <div className="container mx-auto p-4 pb-24">
        <HarmonicMapViewer />
      </div>
    </Layout>
  );
};

export default HarmonicMapPage;
