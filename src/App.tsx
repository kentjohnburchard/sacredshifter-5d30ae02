
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EnergyCheck from './pages/EnergyCheck';
import Alignment from './pages/Alignment';
import Intentions from './pages/Intentions';
import Timeline from './pages/Timeline';
import Profile from './pages/Profile';
import Focus from './pages/Focus';
import MusicLibrary from './pages/MusicLibrary';
import MusicGeneration from './pages/MusicGeneration';
import HermeticWisdom from './pages/HermeticWisdom';
import Astrology from './pages/Astrology';
import Meditation from './pages/Meditation';
import Subscription from './pages/Subscription';
import NotFound from './pages/NotFound';
import FrequencyLibraryPage from './pages/FrequencyLibrary';
import FrequencyDetailPage from './pages/FrequencyDetailPage';
import Onboarding from './pages/Onboarding';
import JourneyTemplates from './pages/JourneyTemplates';
import Soundscapes from './pages/Soundscapes';
import LandingPrompt from './components/LandingPrompt';

// Define routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/welcome" element={<LandingPrompt />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/energy-check" element={<ProtectedRoute><EnergyCheck /></ProtectedRoute>} />
      <Route path="/alignment" element={<ProtectedRoute><Alignment /></ProtectedRoute>} />
      <Route path="/intentions" element={<ProtectedRoute><Intentions /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
      <Route path="/music-library" element={<ProtectedRoute><MusicLibrary /></ProtectedRoute>} />
      <Route path="/music-generation" element={<ProtectedRoute><MusicGeneration /></ProtectedRoute>} />
      <Route path="/hermetic-wisdom" element={<ProtectedRoute><HermeticWisdom /></ProtectedRoute>} />
      <Route path="/astrology" element={<ProtectedRoute><Astrology /></ProtectedRoute>} />
      <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/frequencies/:frequencyId" element={<FrequencyDetailPage />} />
      <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
      <Route path="/journey-templates" element={<ProtectedRoute><JourneyTemplates /></ProtectedRoute>} />
      <Route path="/soundscapes" element={<ProtectedRoute><Soundscapes /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
