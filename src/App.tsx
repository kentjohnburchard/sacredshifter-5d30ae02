
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

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<CosmicDashboard />} />
        <Route path="/landing" element={<SacredShifterLanding />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/hermetic-principles" element={<HermeticPrinciples />} />
        <Route path="/frequency-shifting" element={<FrequencyShifting />} />
        <Route path="/journey-templates" element={<JourneyTemplates />} />
        <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/journey-audio-admin" element={<JourneyAudioAdmin />} />
        <Route path="/admin/journey-audio-mappings" element={<JourneyAudioMappingsViewer />} />
        <Route path="/site-map" element={<SiteMap />} />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
