import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './context/AuthContext';
import ComingSoon from './components/ComingSoon';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/auth/index'));
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
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JourneyScroll = lazy(() => import('./pages/JourneyScroll'));
const HeartDashboard = lazy(() => import('./pages/HeartDashboard'));
const AboutFounder = lazy(() => import('./pages/AboutFounder'));
const SiteMap = lazy(() => import('./pages/SiteMap'));

// Add dynamic journey page
const JourneyPage = lazy(() => import('./pages/journey/[slug]'));

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
        
        {/* Home route first (landing page for all users) */}
        <Route path="/" element={
          user ? <ProtectedRoute><HomePage /></ProtectedRoute> : <HomePage />
        } />
        
        {/* Dashboard route specifically for authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        {/* Journey Scroll Dashboard */}
        <Route path="/journey-scroll" element={
          <ProtectedRoute><JourneyScroll /></ProtectedRoute>
        } />

        {/* Dynamic Journey Page */}
        <Route path="/journey/:slug" element={
          <ProtectedRoute><JourneyPage /></ProtectedRoute>
        } />
        
        {/* Heart Dashboard */}
        <Route path="/heart-dashboard" element={
          <ProtectedRoute><HeartDashboard /></ProtectedRoute>
        } />

        {/* About Founder */}
        <Route path="/about-founder" element={
          <ProtectedRoute><AboutFounder /></ProtectedRoute>
        } />

        {/* Site Map */}
        <Route path="/site-map" element={
          <ProtectedRoute><SiteMap /></ProtectedRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/timeline" element={
          <ProtectedRoute><Timeline /></ProtectedRoute>
        } />
        
        <Route path="/frequencies" element={
          <ProtectedRoute><Frequencies /></ProtectedRoute>
        } />
        
        <Route path="/frequencies/:frequencyId" element={
          <ProtectedRoute><FrequencyDetailPage /></ProtectedRoute>
        } />
        
        <Route path="/sacred-circle" element={
          <ProtectedRoute><SacredCircle /></ProtectedRoute>
        } />
        
        <Route path="/prime-activation" element={
          <ProtectedRoute><PrimeFrequencyActivation /></ProtectedRoute>
        } />
        
        <Route path="/prime-frequencies" element={
          <ProtectedRoute><PrimeFrequencies /></ProtectedRoute>
        } />
        
        <Route path="/music-generation" element={
          <ProtectedRoute><MusicGenerationPage /></ProtectedRoute>
        } />
        
        <Route path="/hermetic-wisdom" element={
          <ProtectedRoute><HermeticWisdom /></ProtectedRoute>
        } />
        
        <Route path="/journey-editor" element={
          <ProtectedRoute><JourneyEditor /></ProtectedRoute>
        } />
        
        <Route path="/journey-audio-mapper" element={
          <ProtectedRoute><JourneyAudioMapper /></ProtectedRoute>
        } />
        
        {/* All navigation paths from config */}
        <Route path="/energy-check" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Energy Check"
              description="Your energy assessment tool is being prepared."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />
        
        <Route path="/heart-center" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Heart Center"
              description="Your heart-centered practices hub is being constructed."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />
        
        <Route path="/sacred-blueprint" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Sacred Blueprint"
              description="Your unique vibrational blueprint is being generated."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />
        
        <Route path="/shift-perception" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Shift Perception"
              description="Tools for shifting your perception are being assembled."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />
        
        <Route path="/trinity-gateway" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Trinity Gateway"
              description="The gateway to higher dimensions is being prepared."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />
        
        <Route path="/focus" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Focus"
              description="Focus enhancement tools are being calibrated."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        <Route path="/about-founder" element={
          <ProtectedRoute>
            <ComingSoon 
              title="About the Founder"
              description="The founder's story is being prepared."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        <Route path="/contact" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Contact"
              description="Contact options are being configured."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Profile"
              description="Your profile management page is being built."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        <Route path="/subscription" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Subscription"
              description="Subscription management options are being prepared."
              expectedDate="Coming soon"
            />
          </ProtectedRoute>
        } />

        <Route path="/site-map" element={
          <ProtectedRoute>
            <ComingSoon 
              title="Site Map"
              description="A complete map of the Sacred Shifter journey is being created."
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
