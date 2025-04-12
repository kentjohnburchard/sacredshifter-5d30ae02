
import React from 'react';
import Layout from '@/components/Layout';
import TimelineViewer from '@/components/timeline/TimelineViewer';

const Timeline: React.FC = () => {
  return (
    <Layout pageTitle="My Journey" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Your Sacred Journey</h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-6">
            Track your frequency shifts and consciousness expansion through your personal timeline.
            Your journey is unique and evolving with each experience.
          </p>
          <TimelineViewer />
        </div>
      </div>
    </Layout>
  );
};

export default Timeline;
