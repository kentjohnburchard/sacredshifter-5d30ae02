// src/AppRoutes.tsx

/**
 * 🚫 DO NOT MODIFY THIS FILE UNLESS EXPLICITLY INSTRUCTED.
 * Sacred Shifter routing is managed here.
 * Lovable: DO NOT delete or alter routes. Create placeholders for missing components.
 * All routes — public, protected, admin — live here in one place.
 */

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';

// Core Pages
import HomePage from '@/pages/HomePage';
import JourneyPage from '@/pages/JourneyPage';
import FrequencyLibraryPage from '@/pages/FrequencyLibraryPage';
import SacredGeometryPage from '@/pages/SacredGeometryPage';
import VisualizerTestPage from '@/pages/VisualizerTestPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';

// Journey Player & Directory
import JourneyPlayer from '@/pages/JourneyPlayer';
import JourneysDirectory from '@/pages/JourneysDirectory';

// Admin Console
import AdminRoutes from '@/routes/AdminRoutes';
import AdminPagesCanvas from '@/pages/admin/AdminPagesCanvas';
import SacredSpectrumAdmin from '@/pages/admin/SacredSpectrumAdmin';

// App Pages
import Subscription from '@/pages/Subscription';
import AboutFounder from '@/pages/AboutFounder';
import Meditation from '@/pages/Meditation';
import HermeticWisdom from '@/pages/HermeticWisdom';
import HermeticPrinciples from '@/pages/HermeticPrinciples';
import FrequencyShift from '@/pages/FrequencyShift';
import SiteMap from '@/pages/SiteMap';
import SacredGridDemo from '@/pages/SacredGridDemo';
import HarmonicMapPage from '@/pages/HarmonicMap';
import HeartCenter from '@/pages/HeartCenter';
import HeartDashboard from '@/pages/HeartDashboard';
import SacredBlueprint from '@/pages/SacredBlueprint';
import ShiftPerception from '@/pages/ShiftPerception';
import TrinityGateway from '@/pages/TrinityGateway';
import Alignment from '@/pages/Alignment';
import EnergyCheck from '@/pages/EnergyCheck';
import Focus from '@/pages/Focus';
import Astrology from '@/pages/Astrology';
import Contact from '@/pages/Contact';
import PrimeFrequencyActivation from '@/pages/PrimeFrequencyActivation';
import SacredShifterWhat from '@/pages/SacredShifterWhat';
import SacredShifterWhy from '@/pages/SacredShifterWhy';
import SacredShifterHow from '@/pages/SacredShifterHow';
import Soundscapes from '@/pages/Soundscapes';
import Timeline from '@/pages/Timeline';
import Intentions from '@/pages/Intentions';
import Lightbearer from '@/pages/Lightbearer';
import SacredCircle from '@/pages/SacredCircle';
import MirrorPortal from '@/pages/MirrorPortal';
import EmotionEngine from '@/pages/EmotionEngine';
import SoulScribe from '@/pages/SoulScribe';
import DeityOracle from '@/pages/DeityOracle';
import AstralAttunement from '@/pages/AstralAttunement';
import MusicGeneration from '@/pages/MusicGeneration';

// Landing & Group Pages
import CircleHomePage from '@/pages/circle/index';
import PremiumHomePage from '@/pages/premium/index';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4 text-purple-500">Loading Sacred Shifter...</div>}>
      <ScrollToTop />
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/journey/:slug" element={<JourneyPage />} />
        <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
        <Route path="/sacred-geometry" element={<SacredGeometryPage />} />
        <Route path="/visualizer-test" element={<VisualizerTestPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
        <Route path="/hermetic-principles" element={<HermeticPrinciples />} />
        <Route path="/frequency-shift" element={<FrequencyShift />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/sacred-grid" element={<SacredGridDemo />} />
        <Route path="/harmonic-map" element={<HarmonicMapPage />} />
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
        <Route path="/mirror-portal" element={<MirrorPortal />} />
        <Route path="/emotion-engine" element={<EmotionEngine />} />
        <Route path="/soul-scribe" element={<SoulScribe />} />
        <Route path="/deity-oracle" element={<DeityOracle />} />
        <Route path="/astral-attunement" element={<AstralAttunement />} />
        <Route path="/music-generator" element={<MusicGeneration />} />

        {/* 💎 Special Areas */}
        <Route path="/circle" element={<CircleHomePage />} />
        <Route path="/premium" element={<ProtectedRoute><PremiumHomePage /></ProtectedRoute>} />
        <Route path="/lightbearer" element={<ProtectedRoute><Lightbearer /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><SacredCircle /></ProtectedRoute>} />

        {/* 📜 Journey Navigation */}
        <Route path="/journeys-directory" element={<JourneysDirectory />} />
        <Route path="/journey-player/:journeyId" element={<ProtectedRoute><JourneyPlayer /></ProtectedRoute>} />
        <Route path="/journey-player/*" element={<ProtectedRoute><JourneyPlayer /></ProtectedRoute>} />

        {/* 🔐 Account + Admin */}
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/heart-dashboard" element={<ProtectedRoute><HeartDashboard /></ProtectedRoute>} />
        <Route path="/heart-center" element={<HeartCenter />} />
        <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />
        <Route path="/admin/pages-canvas" element={<ProtectedRoute><AdminPagesCanvas /></ProtectedRoute>} />
        <Route path="/admin/sacred-spectrum" element={<ProtectedRoute><SacredSpectrumAdmin /></ProtectedRoute>} />

        {/* 🚧 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
