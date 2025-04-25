
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
import ThemeEnhancer from '@/components/ThemeEnhancer';
import ConsciousnessToggle from '@/components/ConsciousnessToggle';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';

const SacredShifterHome = () => {
  const { user } = useAuth();
  const { liftTheVeil } = useTheme();

  // Trigger component re-render on mount to ensure animations start
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      
      // Enhanced logging for debugging
      console.log('SacredShifterHome component mounted');
      console.log('User authenticated:', !!user);
      console.log('Mathematical background rendering with high intensity');
      console.log('Current consciousness mode:', liftTheVeil ? 'veil-lifted' : 'standard');
      
      // Show welcome toast - only once when component first mounts
      toast.success("Welcome to Sacred Shifter", {
        description: "Experience the power of sacred geometry and mathematical harmony",
        duration: 5000,
        id: "welcome-toast", // Add ID to prevent duplicates
      });
    }
  }, [mounted, user, liftTheVeil]);

  return (
    <MathematicalBackground intensity="high">
      <Layout 
        pageTitle="Sacred Shifter - Transform Your Consciousness" 
        showNavbar={true}
        hideHeader={true}
        showGlobalWatermark={true}
      >
        {/* Add ThemeEnhancer and ConsciousnessToggle back */}
        <ThemeEnhancer />
        <ConsciousnessToggle />
        <Watermark />
        
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
