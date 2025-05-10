
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppRoutes from './routes/appRoutes';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import TestJourney from './pages/TestJourney';
import JourneyExperiencePage from '@/pages/JourneyExperiencePage';
import LightbearerPage from './pages/LightbearerPage';
import SacredCirclePage from './pages/SacredCirclePage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import RealityOptimizerPage from './pages/RealityOptimizerPage';
import SacredShifterHome from './pages/SacredShifterHome';
import AboutFounder from './pages/AboutFounder';
import Journeys from './pages/JourneysPage';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import HeartDashboard from './pages/HeartDashboard';
import JourneyTemplatesPage from './pages/journey-templates';
import JourneyIndex from './pages/JourneyIndex';
import JourneyPage from './pages/JourneyPage';
import JourneyPlayer from './components/frequency-journey/JourneyPlayer';

function App() {
  const { user, loading } = useAuth();

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-lg text-purple-700">Loading Sacred Shifter...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
