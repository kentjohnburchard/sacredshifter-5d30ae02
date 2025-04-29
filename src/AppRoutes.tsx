
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import FrequencyLibrary from './pages/FrequencyLibrary';
import SacredShifterHome from './pages/SacredShifterHome';
import HomePage from './pages/HomePage';  // Import our new HomePage
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AboutFounder from './pages/AboutFounder';
import Meditation from './pages/Meditation';
import HermeticWisdom from './pages/HermeticWisdom';
import FrequencyShift from './pages/FrequencyShift';
import JourneyTemplatesPage from './pages/journey-templates';
import Journeys from './pages/Journeys';
import JourneyPlayer from './pages/JourneyPlayer';
import SiteMap from './pages/SiteMap';
import SacredGridDemo from './pages/SacredGridDemo';
import HarmonicMapPage from './pages/HarmonicMap';
import HeartCenter from './pages/HeartCenter';
import HeartDashboard from './pages/HeartDashboard';
import SacredBlueprint from './pages/SacredBlueprint';
import ShiftPerception from './pages/ShiftPerception';
import TrinityGateway from './pages/TrinityGateway';
import Alignment from './pages/Alignment';
import EnergyCheck from './pages/EnergyCheck';
import Focus from './pages/Focus';
import Astrology from './pages/Astrology';
import Contact from './pages/Contact';
import PrimeFrequencyActivation from './pages/PrimeFrequencyActivation';
import Subscription from './pages/Subscription';
import SacredShifterWhat from './pages/SacredShifterWhat';
import SacredShifterWhy from './pages/SacredShifterWhy';
import SacredShifterHow from './pages/SacredShifterHow';
import Admin from './pages/Admin';
import JourneyAudioManager from './components/admin/JourneyAudioManager';
import JourneyAudioMappingsViewer from './pages/admin/JourneyAudioMappingsViewer';
import AdminPagesCanvas from './pages/admin/AdminPagesCanvas';
import ProtectedRoute from './components/ProtectedRoute';
import Soundscapes from './pages/Soundscapes';
import CircleHomePage from './pages/circle/index';
import PremiumHomePage from './pages/premium/index';
import ComingSoon from './components/ComingSoon';
import MusicGeneration from './pages/MusicGeneration';
import Timeline from './pages/Timeline';
import Intentions from './pages/Intentions';
import Lightbearer from '@/pages/Lightbearer';
import SacredCircle from '@/pages/SacredCircle';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full"></div>
      </div>
    }>
      <ScrollToTop />
      <Routes>
        {/* Redirect root path to our new Home Page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/home" element={<SacredShifterHome />} />
        <Route path="/original-home" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/frequency-library" element={<FrequencyLibrary />} />
        <Route path="/frequencies" element={<FrequencyLibrary />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/subscription" element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        } />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
        <Route path="/frequency-shift" element={<FrequencyShift />} />
        <Route path="/journey-templates" element={<JourneyTemplatesPage />} />
        <Route path="/journeys" element={
          <ProtectedRoute>
            <Journeys />
          </ProtectedRoute>
        } />
        <Route path="/journey-player/:journeyId" element={
          <ProtectedRoute>
            <JourneyPlayer />
          </ProtectedRoute>
        } />
        <Route path="/journey-player/*" element={
          <ProtectedRoute>
            <JourneyPlayer />
          </ProtectedRoute>
        } />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/sacred-grid" element={<SacredGridDemo />} />
        <Route path="/harmonic-map" element={<HarmonicMapPage />} />
        <Route path="/heart-center" element={<HeartCenter />} />
        <Route path="/heart-dashboard" element={
          <ProtectedRoute>
            <HeartDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sacred-blueprint" element={<SacredBlueprint />} />
        <Route path="/shift-perception" element={<ShiftPerception />} />
        <Route path="/trinity-gateway" element={<TrinityGateway />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/energy-check" element={<EnergyCheck />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/prime-frequency" element={<PrimeFrequencyActivation />} />
        <Route path="/about/what" element={<SacredShifterWhat />} />
        <Route path="/about/why" element={<SacredShifterWhy />} />
        <Route path="/about/how" element={<SacredShifterHow />} />
        <Route path="/soundscapes" element={<Soundscapes />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/intentions" element={<Intentions />} />
        
        {/* New Routes */}
        <Route path="/lightbearer" element={
          <ProtectedRoute>
            <Lightbearer />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <SacredCircle />
          </ProtectedRoute>
        } />
        
        {/* Sacred Circle Community Routes */}
        <Route path="/circle" element={<CircleHomePage />} />
        
        {/* Premium Ascended Path Routes */}
        <Route path="/premium" element={
          <ProtectedRoute>
            <PremiumHomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/journey-audio-admin" element={
          <ProtectedRoute>
            <JourneyAudioManager />
          </ProtectedRoute>
        } />
        <Route path="/admin/journey-audio-mappings" element={
          <ProtectedRoute>
            <JourneyAudioMappingsViewer />
          </ProtectedRoute>
        } />
        <Route path="/admin/pages" element={
          <ProtectedRoute>
            <AdminPagesCanvas />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
