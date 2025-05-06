
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import SacredCircle from './pages/SacredCircle';
import CircleHomePage from './pages/circle';
import { activePages } from './config/navigation';

// Use the Placeholder component for pages that don't exist yet
const LandingPage = Placeholder;
const LoginPage = Placeholder;
const RegisterPage = Placeholder;
const SacredBlueprintPage = Placeholder;
const FrequencyLibraryPage = Placeholder;
const HeartCenterPage = Placeholder;
const EmotionEnginePage = Placeholder;
const TimelinePage = Placeholder;
const MusicGeneratorPage = Placeholder;
const MirrorPortalPage = Placeholder;
const FrequencyShiftPage = Placeholder;
const ShiftPerceptionPage = Placeholder;
const HermeticPrinciplesPage = Placeholder;
const SoulScribePage = Placeholder;
const DeityOraclePage = Placeholder;
const AstralAttunementPage = Placeholder;
const SubscriptionPage = Placeholder;
const TrinityGatewayPage = Placeholder;
const AboutFounderPage = Placeholder;
const ContactPage = Placeholder;
const ProfilePage = Placeholder;
const HarmonicMapPage = Placeholder;
const HeartDashboardPage = Placeholder;
const AlignmentPage = Placeholder;
const EnergyCheckPage = Placeholder;
const FocusPage = Placeholder;
const HermeticWisdomPage = Placeholder;
const JourneyTemplatesPage = Placeholder;
const JourneysPage = Placeholder;
const AstrologyPage = Placeholder;
const SiteMapPage = Placeholder;
const SacredSpectrumPage = Placeholder;
const JourneysDirectoryPage = Placeholder;

// Lazy-loaded components
const SettingsPage = lazy(() => import('./pages/Placeholder'));
const NotFoundPage = lazy(() => import('./pages/Placeholder'));

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
        <Route element={<ProtectedRoute><Placeholder /></ProtectedRoute>}>
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
