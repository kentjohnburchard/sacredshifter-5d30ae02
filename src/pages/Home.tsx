
import React from 'react';
import Layout from '@/components/Layout';
import { VisualizerScene } from '@/components/visualizer';

/**
 * This component is the visualizer home page, not the main landing page.
 * The main landing page is now SacredShifterHome.tsx
 */
const VisualizerHome: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Shifter Visualizer" showNavbar={true}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Sacred Geometry Visualizer</h1>
        <div className="w-full h-[70vh] bg-black/30 rounded-lg overflow-hidden">
          <VisualizerScene scene="nebula" isPlaying={true} />
        </div>
      </div>
    </Layout>
  );
};

export default VisualizerHome;
