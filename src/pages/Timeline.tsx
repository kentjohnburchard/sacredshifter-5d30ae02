
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ToggleView from '@/components/timeline/ToggleView';
import { useAuth } from '@/context/AuthContext';

const Timeline: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'timeline' | 'grid'>('timeline');

  const handleViewChange = (view: 'timeline' | 'grid') => {
    setCurrentView(view);
  };

  return (
    <Layout 
      pageTitle="Timeline | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
            Your Spiritual Timeline
          </h1>
          <ToggleView view={currentView} onViewChange={handleViewChange} />
        </div>

        <div className="bg-gray-800/60 rounded-lg p-6 backdrop-blur-sm">
          {!user ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Please sign in to view your timeline</h2>
              <p className="text-gray-400">
                Your personal timeline of spiritual growth and frequency shifts will appear here once you're signed in.
              </p>
            </div>
          ) : currentView === 'timeline' ? (
            <div className="space-y-6">
              <p className="text-center text-lg text-gray-300">
                Your spiritual journey timeline will be displayed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <p className="text-center text-lg text-gray-300 col-span-full">
                Your spiritual journey grid will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Timeline;
