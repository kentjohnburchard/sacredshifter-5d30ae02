
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './context/AuthContext';
import ComingSoon from './components/ComingSoon';

// Lazy load page components
const Home = lazy(() => import('./pages/index'));
const AuthPage = lazy(() => import('./pages/Auth'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Frequencies = lazy(() => import('./pages/Frequencies'));
const SacredCircle = lazy(() => import('./pages/SacredCircle'));
const PrimeFrequencyActivation = lazy(() => import('./pages/PrimeFrequencyActivation'));
const PrimeFrequencies = lazy(() => import('./pages/PrimeFrequencies'));
const MusicGenerationPage = lazy(() => import('./pages/MusicGenerationPage'));
const FrequencyDetailPage = lazy(() => import('./pages/FrequencyDetailPage'));
const HermeticWisdom = lazy(() => import('./pages/HermeticWisdom'));
const JourneyEditor = lazy(() => import('./pages/JourneyEditor'));
const JourneyAudioMapper = lazy(() => import('./pages/JourneyAudioMapper'));

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/timeline" element={
          <ProtectedRoute>
            <Timeline />
          </ProtectedRoute>
        } />
        
        <Route path="/frequencies" element={
          <ProtectedRoute>
            <Frequencies />
          </ProtectedRoute>
        } />
        
        <Route path="/frequencies/:frequencyId" element={
          <ProtectedRoute>
            <FrequencyDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/sacred-circle" element={
          <ProtectedRoute>
            <SacredCircle />
          </ProtectedRoute>
        } />
        
        <Route path="/prime-activation" element={
          <ProtectedRoute>
            <PrimeFrequencyActivation />
          </ProtectedRoute>
        } />
        
        <Route path="/prime-frequencies" element={
          <ProtectedRoute>
            <PrimeFrequencies />
          </ProtectedRoute>
        } />
        
        <Route path="/music-generation" element={
          <ProtectedRoute>
            <MusicGenerationPage />
          </ProtectedRoute>
        } />
        
        <Route path="/hermetic-wisdom" element={
          <ProtectedRoute>
            <HermeticWisdom />
          </ProtectedRoute>
        } />
        
        <Route path="/journey-editor" element={
          <ProtectedRoute>
            <JourneyEditor />
          </ProtectedRoute>
        } />
        
        <Route path="/journey-audio-mapper" element={
          <ProtectedRoute>
            <JourneyAudioMapper />
          </ProtectedRoute>
        } />
        
        {/* Coming soon pages */}
        <Route path="/soul-blueprint" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Soul Blueprint"
              description="Your unique vibrational signature is being generated."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
