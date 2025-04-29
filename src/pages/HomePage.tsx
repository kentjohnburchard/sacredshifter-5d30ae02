
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/landing/HeroSection';
import SacredInvitation from '@/components/landing/SacredInvitation';
import FeaturedExperiences from '@/components/landing/FeaturedExperiences';
import LightBearers from '@/components/landing/LightBearers';
import CosmicFooter from '@/components/landing/CosmicFooter';

const HomePage: React.FC = () => {
  return (
    <Layout 
      pageTitle="Sacred Shifter - Transform Your Consciousness" 
      showNavbar={true}
      showGlobalWatermark={true}
    >
      <div className="min-h-screen bg-black text-white">
        <HeroSection />
        <SacredInvitation />
        <FeaturedExperiences />
        <LightBearers />
        <CosmicFooter />
      </div>
    </Layout>
  );
};

export default HomePage;
