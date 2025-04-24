
import React from 'react';
import Layout from '@/components/Layout';
import MathematicalBackground from '@/components/backgrounds/MathematicalBackground';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HermeticSection from '@/components/landing/HermeticSection';
import ExploreSection from '@/components/landing/ExploreSection';
import JoinSection from '@/components/landing/JoinSection';
import { useAuth } from '@/context/AuthContext';

const SacredShifterHome = () => {
  const { user } = useAuth();

  return (
    <MathematicalBackground>
      <Layout 
        pageTitle="Sacred Shifter - Transform Your Consciousness" 
        showNavbar={true}
        hideHeader={true}
        showGlobalWatermark={true}
      >
        <HeroSection />
        <FeaturesSection />
        <HermeticSection />
        <ExploreSection />
        {!user && <JoinSection />}
      </Layout>
    </MathematicalBackground>
  );
};

export default SacredShifterHome;
