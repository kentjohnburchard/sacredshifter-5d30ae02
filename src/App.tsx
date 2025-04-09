
import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import FrequencyLibraryPage from './pages/FrequencyLibraryPage';
import FrequencyDetailPage from './pages/FrequencyDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import AboutFounder from './pages/AboutFounder';
import Contact from './pages/Contact';
import HarmonicMap from './pages/HarmonicMap';
import HeartCenter from './pages/HeartCenter';
import HeartDashboard from './pages/HeartDashboard';
import Alignment from './pages/Alignment';
import EnergyCheck from './pages/EnergyCheck';
import Focus from './pages/Focus';
import EmotionEngine from './pages/EmotionEngine';
import ScrollToTop from './components/ScrollToTop';
import HermeticWisdom from './pages/HermeticWisdom';
import JourneyPlayer from './pages/JourneyPlayer';
import JourneyTemplates from './pages/JourneyTemplates';
import Astrology from './pages/Astrology';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Frequency Routes */}
        <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
        <Route path="/frequency/:id" element={<FrequencyDetailPage />} />
        
        {/* Feature Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/harmonic-map" element={<HarmonicMap />} />
        <Route path="/heart-center" element={<HeartCenter />} />
        <Route path="/heart-dashboard" element={<HeartDashboard />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/energy-check" element={<EnergyCheck />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/emotion-engine" element={<EmotionEngine />} />
        <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
        <Route path="/journey-templates" element={<JourneyTemplates />} />
        <Route path="/journey/:frequencyId" element={<JourneyPlayer />} />
        <Route path="/astrology" element={<Astrology />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
