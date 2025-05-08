
import React from 'react';
import Layout from '@/components/Layout';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';

const HomePage: React.FC = () => {
  return (
    <Layout 
      pageTitle="Sacred Shifter"
      showNavbar={true}
      showGlobalWatermark={true}
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <JourneyAwareSpiralVisualizer 
          showControls={false} 
          containerId="homeSpiral"
        />
        
        <div className="text-center z-10 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Sacred Shifter
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8">
            Embark on a journey of spiritual transformation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
            <div className="bg-purple-900/20 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30">
              <h2 className="text-2xl font-semibold text-white mb-2">Sacred Journeys</h2>
              <p className="text-purple-200">Explore guided experiences for spiritual growth</p>
            </div>
            
            <div className="bg-purple-900/20 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30">
              <h2 className="text-2xl font-semibold text-white mb-2">Sacred Spectrum</h2>
              <p className="text-purple-200">Discover the frequencies that resonate with your soul</p>
            </div>
            
            <div className="bg-purple-900/20 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30">
              <h2 className="text-2xl font-semibold text-white mb-2">Sacred Circle</h2>
              <p className="text-purple-200">Connect with others on the path of enlightenment</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
