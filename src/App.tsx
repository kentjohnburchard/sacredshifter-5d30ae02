
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import './styles/sacred-geometry.css';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import FrequencyLibraryPage from './pages/FrequencyLibraryPage';
import FrequencyDetailPage from './pages/FrequencyDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import AboutFounder from './pages/AboutFounder';
import Contact from './pages/Contact';
import HarmonicMap from './pages/HarmonicMap';
import HeartCenter from './pages/HeartCenter';
import HeartDashboard from './pages/HeartDashboard';
import Alignment from './pages/Alignment';
import EnergyCheck from './pages/EnergyCheck';
import Focus from './pages/Focus';
import EmotionEngine from './pages/EmotionEngine';
import ScrollToTop from './components/ScrollToTop';
import HermeticWisdom from './pages/HermeticWisdom';
import JourneyPlayer from './pages/JourneyPlayer';
import JourneyTemplates from './pages/JourneyTemplates';
import Astrology from './pages/Astrology';
import CosmicDashboard from './pages/CosmicDashboard';
import { JourneySettingsProvider } from './context/JourneySettingsContext';
import { ThemeProvider as SacredThemeProvider } from './context/ThemeContext';
import SacredShifterLanding from './pages/SacredShifterLanding';
import ShiftPerception from './pages/ShiftPerception';
import SacredBlueprint from './pages/SacredBlueprint';
import MirrorPortal from './pages/MirrorPortal';
import FrequencyShift from './pages/FrequencyShift';
import SoulScribe from './pages/SoulScribe';
import DeityOracle from './pages/DeityOracle';
import AstralAttunement from './pages/AstralAttunement';
import Subscription from './pages/Subscription';
import ReferralProgram from './pages/ReferralProgram';
import TrinityGateway from './pages/TrinityGateway';
import Profile from './pages/Profile';
import SiteMap from './pages/SiteMap';
import MusicGenerator from './pages/MusicGenerator';
import Index from './pages/Index';
import Welcome from './pages/Welcome';
import StarfieldBackground from './components/sacred-geometry/StarfieldBackground';
import MainLayout from './components/MainLayout';
import { safeFetchLegacy } from './utils/safeFetch';

function App() {
  // Apply global fetch timeout to prevent UI freezes
  useEffect(() => {
    console.log('Setting up global fetch timeout protection');
    
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override fetch with timeout protection using our safeFetch utility
    window.fetch = function(resource, options) {
      return safeFetchLegacy(resource, options);
    };
    
    // Add global error handling for better debugging
    const errorHandler = (event) => {
      console.error('Global error caught:', event.error || event);
    };
    
    const rejectionHandler = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };
    
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    // Clean up the fetch override and event listeners when component unmounts
    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      console.log('Restored original fetch function and removed error handlers');
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SacredThemeProvider>
        <JourneySettingsProvider>
          <ScrollToTop />
          {/* Global starfield background that appears on all pages */}
          <StarfieldBackground />
          <Routes>
            {/* Entry and Auth Routes (no layout wrapper) */}
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Redirect any /home requests to dashboard */}
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            
            {/* Journey aliases with consistent redirects */}
            <Route path="/journeys" element={<Navigate to="/journey-templates" replace />} />
            
            {/* Main Feature Routes (all with consistent layout) */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/cosmic" element={<MainLayout><CosmicDashboard /></MainLayout>} />
            <Route path="/about-founder" element={<MainLayout><AboutFounder /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/sacred-blueprint" element={<MainLayout><SacredBlueprint /></MainLayout>} />
            <Route path="/frequency-library" element={<MainLayout><FrequencyLibraryPage /></MainLayout>} />
            <Route path="/heart-center" element={<MainLayout><HeartCenter /></MainLayout>} />
            <Route path="/emotion-engine" element={<MainLayout><EmotionEngine /></MainLayout>} />
            <Route path="/timeline" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/shift-perception" element={<MainLayout><ShiftPerception /></MainLayout>} />
            <Route path="/trinity-gateway" element={<MainLayout><TrinityGateway /></MainLayout>} />
            
            {/* Additional Feature Routes */}
            <Route path="/music-generator" element={<MainLayout><MusicGenerator /></MainLayout>} />
            <Route path="/mirror-portal" element={<MainLayout><MirrorPortal /></MainLayout>} />
            <Route path="/frequency-shift" element={<MainLayout><FrequencyShift /></MainLayout>} />
            <Route path="/soul-scribe" element={<MainLayout><SoulScribe /></MainLayout>} />
            <Route path="/deity-oracle" element={<MainLayout><DeityOracle /></MainLayout>} />
            <Route path="/astral-attunement" element={<MainLayout><AstralAttunement /></MainLayout>} />
            <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
            <Route path="/referral" element={<MainLayout><ReferralProgram /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/site-map" element={<MainLayout><SiteMap /></MainLayout>} />
            
            {/* Frequency Detail Route */}
            <Route path="/frequency/:id" element={<MainLayout><FrequencyDetailPage /></MainLayout>} />
            
            {/* Additional Features */}
            <Route path="/harmonic-map" element={<MainLayout><HarmonicMap /></MainLayout>} />
            <Route path="/heart-dashboard" element={<MainLayout><HeartDashboard /></MainLayout>} />
            <Route path="/alignment" element={<MainLayout><Alignment /></MainLayout>} />
            <Route path="/energy-check" element={<MainLayout><EnergyCheck /></MainLayout>} />
            <Route path="/focus" element={<MainLayout><Focus /></MainLayout>} />
            <Route path="/hermetic-wisdom" element={<MainLayout><HermeticWisdom /></MainLayout>} />
            <Route path="/journey-templates" element={<MainLayout><JourneyTemplates /></MainLayout>} />
            <Route path="/journey/:frequencyId" element={<MainLayout><JourneyPlayer /></MainLayout>} />
            <Route path="/astrology" element={<MainLayout><Astrology /></MainLayout>} />
            
            {/* Catch-all route for 404 - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </JourneySettingsProvider>
      </SacredThemeProvider>
    </ThemeProvider>
  );
}

export default App;
