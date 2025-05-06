
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

// Fix ProtectedRoute by creating a proper interface
interface ProtectedRouteProps {
  children: React.ReactNode;
}

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
        <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
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
