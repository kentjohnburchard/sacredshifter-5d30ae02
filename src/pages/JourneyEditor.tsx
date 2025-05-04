
import React from 'react';
import Layout from '@/components/Layout';
import ComingSoon from '@/components/ComingSoon';

const JourneyEditor: React.FC = () => {
  return (
    <Layout 
      pageTitle="Journey Editor | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <ComingSoon 
        title="Journey Editor"
        description="Create your own spiritual journeys with our powerful editor."
        expectedDate="Coming soon"
      />
    </Layout>
  );
};

export default JourneyEditor;
