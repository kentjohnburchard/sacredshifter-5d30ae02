
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from '@/pages/Home';
import Meditations from '@/pages/Meditations';
import HermeticPrinciples from '@/pages/HermeticPrinciples';
import FrequencyShifting from '@/pages/FrequencyShifting';
import JourneyTemplates from '@/pages/JourneyTemplates';
import JourneyPlayer from '@/pages/JourneyPlayer';
import Admin from '@/pages/Admin';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';
import JourneyAudioMappingsViewer from '@/pages/admin/JourneyAudioMappingsViewer';
import Welcome from '@/pages/Welcome';
import SacredShifterLanding from '@/pages/SacredShifterLanding';
import CosmicDashboard from '@/pages/CosmicDashboard';
import SiteMap from '@/pages/SiteMap';
import Index from '@/pages/Index';
import Frequencies from '@/pages/Frequencies';
import SacredBlueprint from '@/pages/SacredBlueprint';
import HeartCenter from '@/pages/HeartCenter';
import ShiftPerception from '@/pages/ShiftPerception';
import Astrology from '@/pages/Astrology';
import Focus from '@/pages/Focus';
import Timeline from '@/pages/Timeline';

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<CosmicDashboard />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/landing" element={<SacredShifterLanding />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/hermetic-principles" element={<HermeticPrinciples />} />
        <Route path="/hermetic-wisdom" element={<HermeticPrinciples />} />
        <Route path="/frequency-shifting" element={<FrequencyShifting />} />
        <Route path="/frequency-library" element={<Frequencies />} />
        <Route path="/frequencies" element={<Frequencies />} />
        <Route path="/journey-templates" element={<JourneyTemplates />} />
        <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
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
      </Routes>
    </React.StrictMode>
  );
}

export default App;
