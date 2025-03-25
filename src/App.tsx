
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Journeys from './pages/Journeys';
import EnergyCheck from './pages/EnergyCheck';
import Alignment from './pages/Alignment';
import Intentions from './pages/Intentions';
import MusicGeneration from './pages/MusicGeneration';
import MusicLibrary from './pages/MusicLibrary';
import Subscription from './pages/Subscription';
import NotFound from './pages/NotFound';
import Timeline from './pages/Timeline';
import JourneyTemplates from "./pages/JourneyTemplates";
import JourneyPlayer from "./pages/JourneyPlayer";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/energy-check" element={<EnergyCheck />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/intentions" element={<Intentions />} />
        <Route path="/music-generation" element={<MusicGeneration />} />
        <Route path="/music-library" element={<MusicLibrary />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/journey-templates" element={<JourneyTemplates />} />
        <Route path="/journey/:frequencyId" element={<JourneyPlayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
