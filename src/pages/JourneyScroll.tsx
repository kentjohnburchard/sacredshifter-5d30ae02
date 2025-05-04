
import React from 'react';
import Layout from '@/components/Layout';
import JourneyScrollDashboard from '@/components/journey-scroll/JourneyScrollDashboard';

const JourneyScroll: React.FC = () => {
  return (
    <Layout 
      pageTitle="Journey Scroll | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <JourneyScrollDashboard />
    </Layout>
  );
};

export default JourneyScroll;
