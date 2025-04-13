
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { EasterEggProvider } from "@/context/EasterEggContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Meditations from '@/pages/Meditations';
import HermeticPrinciples from '@/pages/HermeticPrinciples';
import FrequencyShifting from '@/pages/FrequencyShifting';
import JourneyTemplates from '@/pages/JourneyTemplates';
import JourneyPlayer from '@/pages/JourneyPlayer';
import Admin from '@/pages/Admin';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';
import JourneyAudioMappingsViewer from '@/pages/admin/JourneyAudioMappingsViewer';
import SiteMap from '@/pages/SiteMap';
import Frequencies from '@/pages/Frequencies';
import SacredBlueprint from '@/pages/SacredBlueprint';
import HeartCenter from '@/pages/HeartCenter';
import ShiftPerception from '@/pages/ShiftPerception';
import Astrology from '@/pages/Astrology';
import Focus from '@/pages/Focus';
import Timeline from '@/pages/Timeline';
import FrequencyDetailPage from '@/pages/FrequencyDetailPage';
import HarmonicMap from '@/pages/HarmonicMap';
import HeartDashboard from '@/pages/HeartDashboard';
import EnergyCheck from '@/pages/EnergyCheck';
import Alignment from '@/pages/Alignment';
import Profile from '@/pages/Profile';
import Subscription from '@/pages/Subscription';
import TrinityGateway from '@/pages/TrinityGateway';
import HermeticWisdom from '@/pages/HermeticWisdom';
import AboutFounder from '@/pages/AboutFounder';
import Contact from '@/pages/Contact';
import PersonalVibeSettings from '@/pages/PersonalVibeSettings';
import Journeys from '@/pages/Journeys';
import PrimeHistory from '@/pages/PrimeHistory';
import Intentions from '@/pages/Intentions';
import { Toaster } from 'sonner';
import OriginFlow from '@/components/sacred-geometry/OriginFlow';
import ThemeEnhancer from '@/components/ThemeEnhancer';

function App() {
  return (
    <ThemeProvider>
      <EasterEggProvider>
        <Toaster />
        <OriginFlow />
        <ThemeEnhancer />
        <React.StrictMode>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meditations" element={<Meditations />} />
            <Route path="/intentions" element={<Intentions />} />
            <Route path="/hermetic-principles" element={<HermeticPrinciples />} />
            <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
            <Route path="/frequency-shifting" element={<FrequencyShifting />} />
            <Route path="/frequency-library" element={<Frequencies />} />
            <Route path="/frequencies" element={<Frequencies />} />
            <Route path="/frequency/:frequencyId" element={<FrequencyDetailPage />} />
            <Route path="/journey-templates" element={<JourneyTemplates />} />
            <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
            <Route path="/journey/:journeyId" element={<JourneyPlayer />} />
            <Route path="/journeys" element={<Journeys />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/journey-audio-admin" element={<JourneyAudioAdmin />} />
            <Route path="/admin/journey-audio-mappings" element={<JourneyAudioMappingsViewer />} />
            <Route path="/site-map" element={<SiteMap />} />
            <Route path="/sacred-blueprint" element={<SacredBlueprint />} />
            <Route path="/heart-center" element={<HeartCenter />} />
            <Route path="/shift-perception" element={<ShiftPerception />} />
            <Route path="/astrology" element={<Astrology />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/prime-history" element={<PrimeHistory />} />
            <Route path="/harmonic-map" element={<HarmonicMap />} />
            <Route path="/heart-dashboard" element={<HeartDashboard />} />
            <Route path="/energy-check" element={<EnergyCheck />} />
            <Route path="/alignment" element={<Alignment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/trinity-gateway" element={<TrinityGateway />} />
            <Route path="/about-founder" element={<AboutFounder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/personal-vibe" element={<PersonalVibeSettings />} />
          </Routes>
        </React.StrictMode>
      </EasterEggProvider>
    </ThemeProvider>
  );
}

export default App;
