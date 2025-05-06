import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import HeartDashboard from './pages/HeartDashboard';
import SacredBlueprint from './pages/SacredBlueprint';
import CosmicBlueprintPage from './pages/CosmicBlueprintPage';
import AdminInsightsDashboard from './pages/admin/AdminInsightsDashboard';
import Auth from './pages/Auth';
import Timeline from './pages/Timeline';
import Lightbearer from './pages/Lightbearer';
import Community from './pages/Community';
import JourneyPage from './pages/JourneyPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/heart-dashboard" element={<HeartDashboard />} />
      <Route path="/sacred-blueprint" element={<SacredBlueprint />} />
      <Route path="/cosmic-blueprint" element={<CosmicBlueprintPage />} />
      <Route path="/admin/insights" element={<AdminInsightsDashboard />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/lightbearer" element={<Lightbearer />} />
      <Route path="/community" element={<Community />} />
      <Route path="/journey/:journeyId" element={<JourneyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
