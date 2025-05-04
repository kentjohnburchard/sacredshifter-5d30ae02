import React from 'react';
import Layout from '@/components/Layout';
import FeaturedJourneys from '@/components/journey/FeaturedJourneys';

const HomePage: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Shifter">
      
      
      <FeaturedJourneys />
    </Layout>
  );
};

export default HomePage;
