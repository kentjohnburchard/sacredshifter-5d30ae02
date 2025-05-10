
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JourneyPage from '@/pages/JourneyPage';
import JourneyTemplates from '@/pages/journey-templates';
import JourneyTemplatesAdmin from '@/pages/JourneyTemplatesAdmin';
import JourneySoundscapeAdmin from '@/pages/JourneySoundscapeAdmin';
import NotFound from '@/pages/NotFound';
import LandingPage from '@/pages/landing/LandingPage';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Placeholder from '@/pages/Placeholder';
import Journeys from '@/pages/JourneysPage';
import AboutFounder from '@/pages/AboutFounder';
import HeartDashboard from '@/pages/HeartDashboard';
import SacredCirclePage from '@/pages/SacredCirclePage';
import LightbearerPage from '@/pages/LightbearerPage';
import FrequencyEnginePage from '@/pages/FrequencyEnginePage';
import RealityOptimizerPage from '@/pages/RealityOptimizerPage';
import JourneyTemplatesPage from '@/pages/journey-templates';
import JourneyIndex from '@/pages/JourneyIndex';
import JourneyExperiencePage from '@/pages/JourneyExperiencePage';
import JourneyPlayer from '@/components/frequency-journey/JourneyPlayer';
import ProtectedRoute from '@/components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Path - Direct to Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Public Routes */}
      <Route path="/home" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/about" element={<Placeholder name="About" />} />
      <Route path="/about-founder" element={<AboutFounder />} />
      
      {/* Journey Routes */}
      <Route path="/journeys" element={<Journeys />} />
      <Route path="/journey-templates" element={<JourneyTemplatesPage />} />
      <Route path="/journey-index" element={<JourneyIndex />} />
      <Route path="/journey/:slug" element={<JourneyPage />} />
      <Route path="/journey/:journeySlug/experience" element={<JourneyExperiencePage />} />
      <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
      
      {/* Feature Routes */}
      <Route path="/frequency-engine" element={<FrequencyEnginePage />} />
      <Route path="/reality-optimizer" element={<RealityOptimizerPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sacred-circle" 
        element={
          <ProtectedRoute>
            <SacredCirclePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lightbearer" 
        element={
          <ProtectedRoute>
            <LightbearerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/heart" 
        element={
          <ProtectedRoute>
            <HeartDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route path="/admin/journeys/templates" element={<JourneyTemplatesAdmin />} />
      <Route path="/admin/journeys/soundscapes" element={<JourneySoundscapeAdmin />} />
      
      {/* Public Feature Routes */}
      <Route path="/circle" element={<SacredCirclePage />} />
      
      {/* Fallback for missing routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
