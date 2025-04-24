
import React from 'react';
import Layout from '@/components/Layout';
import MathematicalBackground from '@/components/backgrounds/MathematicalBackground';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HermeticSection from '@/components/landing/HermeticSection';
import ExploreSection from '@/components/landing/ExploreSection';
import JoinSection from '@/components/landing/JoinSection';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

const SacredShifterHome = () => {
  const { user } = useAuth();

  // Trigger component re-render on mount to ensure animations start
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    
    // Enhanced logging for debugging
    console.log('SacredShifterHome component mounted');
    console.log('User authenticated:', !!user);
    console.log('Mathematical background rendering with high intensity');
    
    // Show welcome toast
    toast.success("Welcome to Sacred Shifter", {
      description: "Experience the power of sacred geometry and mathematical harmony",
      duration: 5000,
    });
    
  }, [user]);

  return (
    <MathematicalBackground intensity="high">
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
