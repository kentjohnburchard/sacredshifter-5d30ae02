import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SacredBlueprintPage from './pages/SacredBlueprintPage';
import FrequencyLibraryPage from './pages/FrequencyLibraryPage';
import HeartCenterPage from './pages/HeartCenterPage';
import EmotionEnginePage from './pages/EmotionEnginePage';
import TimelinePage from './pages/TimelinePage';
import MusicGeneratorPage from './pages/MusicGeneratorPage';
import MirrorPortalPage from './pages/MirrorPortalPage';
import FrequencyShiftPage from './pages/FrequencyShiftPage';
import ShiftPerceptionPage from './pages/ShiftPerceptionPage';
import HermeticPrinciplesPage from './pages/HermeticPrinciplesPage';
import SoulScribePage from './pages/SoulScribePage';
import DeityOraclePage from './pages/DeityOraclePage';
import AstralAttunementPage from './pages/AstralAttunementPage';
import SubscriptionPage from './pages/SubscriptionPage';
import TrinityGatewayPage from './pages/TrinityGatewayPage';
import AboutFounderPage from './pages/AboutFounderPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import HarmonicMapPage from './pages/HarmonicMapPage';
import HeartDashboardPage from './pages/HeartDashboardPage';
import AlignmentPage from './pages/AlignmentPage';
import EnergyCheckPage from './pages/EnergyCheckPage';
import FocusPage from './pages/FocusPage';
import HermeticWisdomPage from './pages/HermeticWisdomPage';
import JourneyTemplatesPage from './pages/JourneyTemplatesPage';
import JourneysPage from './pages/JourneysPage';
import AstrologyPage from './pages/AstrologyPage';
import SiteMapPage from './pages/SiteMapPage';
import SacredSpectrumPage from './pages/SacredSpectrumPage';
import JourneysDirectoryPage from './pages/JourneysDirectoryPage';
import SacredCircle from './pages/SacredCircle';
import CircleHomePage from './pages/circle';
import { activePages } from './config/navigation';

// Lazy-loaded components
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/about-founder" element={activePages.aboutFounder ? <AboutFounderPage /> : <Navigate to="/" />} />
        <Route path="/contact" element={activePages.contact ? <ContactPage /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={activePages.dashboard ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/sacred-blueprint" element={activePages.sacredBlueprint ? <SacredBlueprintPage /> : <Navigate to="/" />} />
          <Route path="/frequency-library" element={activePages.frequencyLibrary ? <FrequencyLibraryPage /> : <Navigate to="/" />} />
          <Route path="/heart-center" element={activePages.heartCenter ? <HeartCenterPage /> : <Navigate to="/" />} />
          <Route path="/emotion-engine" element={activePages.emotionEngine ? <EmotionEnginePage /> : <Navigate to="/" />} />
          <Route path="/timeline" element={activePages.timeline ? <TimelinePage /> : <Navigate to="/" />} />
          <Route path="/music-generator" element={activePages.musicGenerator ? <MusicGeneratorPage /> : <Navigate to="/" />} />
          <Route path="/mirror-portal" element={activePages.mirrorPortal ? <MirrorPortalPage /> : <Navigate to="/" />} />
          <Route path="/frequency-shift" element={activePages.frequencyShift ? <FrequencyShiftPage /> : <Navigate to="/" />} />
          <Route path="/shift-perception" element={activePages.shiftPerception ? <ShiftPerceptionPage /> : <Navigate to="/" />} />
          <Route path="/hermetic-principles" element={activePages.hermeticPrinciples ? <HermeticPrinciplesPage /> : <Navigate to="/" />} />
          <Route path="/soul-scribe" element={activePages.soulScribe ? <SoulScribePage /> : <Navigate to="/" />} />
          <Route path="/deity-oracle" element={activePages.deityOracle ? <DeityOraclePage /> : <Navigate to="/" />} />
          <Route path="/astral-attunement" element={activePages.astralAttunement ? <AstralAttunementPage /> : <Navigate to="/" />} />
          <Route path="/subscription" element={activePages.subscription ? <SubscriptionPage /> : <Navigate to="/" />} />
          <Route path="/trinity-gateway" element={activePages.trinityGateway ? <TrinityGatewayPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={activePages.profile ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/harmonic-map" element={activePages.harmonicMap ? <HarmonicMapPage /> : <Navigate to="/" />} />
          <Route path="/heart-dashboard" element={activePages.heartDashboard ? <HeartDashboardPage /> : <Navigate to="/" />} />
          <Route path="/alignment" element={activePages.alignment ? <AlignmentPage /> : <Navigate to="/" />} />
          <Route path="/energy-check" element={activePages.energyCheck ? <EnergyCheckPage /> : <Navigate to="/" />} />
          <Route path="/focus" element={activePages.focus ? <FocusPage /> : <Navigate to="/" />} />
          <Route path="/hermetic-wisdom" element={activePages.hermeticWisdom ? <HermeticWisdomPage /> : <Navigate to="/" />} />
          <Route path="/journey-templates" element={activePages.journeyTemplates ? <JourneyTemplatesPage /> : <Navigate to="/" />} />
          <Route path="/journeys" element={activePages.journeys ? <JourneysPage /> : <Navigate to="/" />} />
          <Route path="/astrology" element={activePages.astrology ? <AstrologyPage /> : <Navigate to="/" />} />
          <Route path="/site-map" element={activePages.siteMap ? <SiteMapPage /> : <Navigate to="/" />} />
          <Route path="/sacred-spectrum" element={activePages.sacredSpectrum ? <SacredSpectrumPage /> : <Navigate to="/" />} />
          <Route path="/journeys-directory" element={activePages.journeysDirectory ? <JourneysDirectoryPage /> : <Navigate to="/" />} />
          <Route path="/sacred-circle" element={<SacredCircle />} />
          <Route path="/circle" element={<CircleHomePage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
