
import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import './styles/sacred-geometry.css';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
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
import TrinityGateway from './pages/TrinityGateway';
import Profile from './pages/Profile';
import SiteMap from './pages/SiteMap';
import MusicGenerator from './pages/MusicGenerator';
import Meditation from './pages/Meditation';
import MusicLibraryPage from './pages/MusicLibraryPage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SacredThemeProvider>
        <JourneySettingsProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<SacredShifterLanding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cosmic" element={<CosmicDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about-founder" element={<AboutFounder />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Main Feature Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sacred-blueprint" element={<SacredBlueprint />} />
            <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
            <Route path="/heart-center" element={<HeartCenter />} />
            <Route path="/emotion-engine" element={<EmotionEngine />} />
            <Route path="/timeline" element={<Dashboard />} />
            <Route path="/shift-perception" element={<ShiftPerception />} />
            <Route path="/trinity-gateway" element={<TrinityGateway />} />
            
            {/* Additional Feature Routes */}
            <Route path="/music-generator" element={<MusicGenerator />} />
            <Route path="/music-library" element={<MusicLibraryPage />} />
            <Route path="/mirror-portal" element={<MirrorPortal />} />
            <Route path="/frequency-shift" element={<FrequencyShift />} />
            <Route path="/soul-scribe" element={<SoulScribe />} />
            <Route path="/deity-oracle" element={<DeityOracle />} />
            <Route path="/astral-attunement" element={<AstralAttunement />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/site-map" element={<SiteMap />} />
            
            {/* Frequency Detail Route */}
            <Route path="/frequency/:id" element={<FrequencyDetailPage />} />
            
            {/* Additional Features */}
            <Route path="/harmonic-map" element={<HarmonicMap />} />
            <Route path="/heart-dashboard" element={<HeartDashboard />} />
            <Route path="/alignment" element={<Alignment />} />
            <Route path="/energy-check" element={<EnergyCheck />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
            <Route path="/journey-templates" element={<JourneyTemplates />} />
            <Route path="/journey/:journeyId" element={<JourneyPlayer />} />
            <Route path="/astrology" element={<Astrology />} />
            <Route path="/journeys" element={<JourneyTemplates />} />
            <Route path="/meditation" element={<Meditation />} />
          </Routes>
          <Toaster />
        </JourneySettingsProvider>
      </SacredThemeProvider>
    </ThemeProvider>
  );
}

export default App;
