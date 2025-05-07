
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './pages/Dashboard';
import SacredCircle from './pages/SacredCircle';
import CircleHomePage from './pages/circle';
import { activePages } from './config/navigation';

// Import actual pages instead of using placeholders
import HomePage from './pages/Home';
import LoginPage from './pages/Auth';
import RegisterPage from './pages/Auth';
import SacredBlueprintPage from './pages/SacredBlueprint';
import FrequencyLibraryPage from './pages/FrequencyLibrary';
import HeartCenterPage from './pages/HeartCenter';
import EmotionEnginePage from './pages/EmotionEngine';
import TimelinePage from './pages/Timeline';
import MusicGeneratorPage from './pages/MusicGenerator';
import MirrorPortalPage from './pages/MirrorPortal';
import FrequencyShiftPage from './pages/FrequencyShift';
import ShiftPerceptionPage from './pages/ShiftPerception';
import HermeticPrinciplesPage from './pages/HermeticPrinciples';
import SoulScribePage from './pages/SoulScribe';
import DeityOraclePage from './pages/DeityOracle';
import AstralAttunementPage from './pages/AstralAttunement';
import SubscriptionPage from './pages/Subscription';
import TrinityGatewayPage from './pages/TrinityGateway';
import AboutFounderPage from './pages/AboutFounder';
import ContactPage from './pages/Contact';
import ProfilePage from './pages/Profile';
import HarmonicMapPage from './pages/HarmonicMap';
import HeartDashboardPage from './pages/HeartDashboard';
import AlignmentPage from './pages/Alignment';
import EnergyCheckPage from './pages/EnergyCheck';
import FocusPage from './pages/Focus';
import HermeticWisdomPage from './pages/HermeticWisdom';
import JourneyTemplatesPage from './pages/JourneyTemplates';
import JourneysPage from './pages/Journeys';
import AstrologyPage from './pages/Astrology';
import SiteMapPage from './pages/SiteMap';
import SacredSpectrumPage from './pages/SacredSpectrum';
import JourneysDirectoryPage from './pages/JourneysDirectory';
import Placeholder from './pages/Placeholder';

// Lazy-loaded components
const SettingsPage = lazy(() => import('./pages/AccountPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

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
        
        {/* Protected Routes - Fixed by removing the nested Dashboard wrapping */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute>{activePages.dashboard ? <Dashboard /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/sacred-blueprint" element={<ProtectedRoute>{activePages.sacredBlueprint ? <SacredBlueprintPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/frequency-library" element={<ProtectedRoute>{activePages.frequencyLibrary ? <FrequencyLibraryPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/heart-center" element={<ProtectedRoute>{activePages.heartCenter ? <HeartCenterPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/emotion-engine" element={<ProtectedRoute>{activePages.emotionEngine ? <EmotionEnginePage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute>{activePages.timeline ? <TimelinePage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/music-generator" element={<ProtectedRoute>{activePages.musicGenerator ? <MusicGeneratorPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/mirror-portal" element={<ProtectedRoute>{activePages.mirrorPortal ? <MirrorPortalPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/frequency-shift" element={<ProtectedRoute>{activePages.frequencyShift ? <FrequencyShiftPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/shift-perception" element={<ProtectedRoute>{activePages.shiftPerception ? <ShiftPerceptionPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/hermetic-principles" element={<ProtectedRoute>{activePages.hermeticPrinciples ? <HermeticPrinciplesPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/soul-scribe" element={<ProtectedRoute>{activePages.soulScribe ? <SoulScribePage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/deity-oracle" element={<ProtectedRoute>{activePages.deityOracle ? <DeityOraclePage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/astral-attunement" element={<ProtectedRoute>{activePages.astralAttunement ? <AstralAttunementPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute>{activePages.subscription ? <SubscriptionPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/trinity-gateway" element={<ProtectedRoute>{activePages.trinityGateway ? <TrinityGatewayPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>{activePages.profile ? <ProfilePage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/harmonic-map" element={<ProtectedRoute>{activePages.harmonicMap ? <HarmonicMapPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/heart-dashboard" element={<ProtectedRoute>{activePages.heartDashboard ? <HeartDashboardPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/alignment" element={<ProtectedRoute>{activePages.alignment ? <AlignmentPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/energy-check" element={<ProtectedRoute>{activePages.energyCheck ? <EnergyCheckPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute>{activePages.focus ? <FocusPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/hermetic-wisdom" element={<ProtectedRoute>{activePages.hermeticWisdom ? <HermeticWisdomPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/journey-templates" element={<ProtectedRoute>{activePages.journeyTemplates ? <JourneyTemplatesPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/journeys" element={<ProtectedRoute>{activePages.journeys ? <JourneysPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/astrology" element={<ProtectedRoute>{activePages.astrology ? <AstrologyPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/site-map" element={<ProtectedRoute>{activePages.siteMap ? <SiteMapPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/sacred-spectrum" element={<ProtectedRoute>{activePages.sacredSpectrum ? <SacredSpectrumPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/journeys-directory" element={<ProtectedRoute>{activePages.journeysDirectory ? <JourneysDirectoryPage /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/sacred-circle" element={<ProtectedRoute><SacredCircle /></ProtectedRoute>} />
        <Route path="/circle" element={<ProtectedRoute><CircleHomePage /></ProtectedRoute>} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
