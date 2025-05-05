import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import JourneyPage from '@/pages/JourneyPage';
import FrequencyLibraryPage from '@/pages/FrequencyLibraryPage';
import HermeticWisdom from '@/pages/HermeticWisdom';
import AuthPage from '@/pages/AuthPage';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AccountPage from '@/pages/AccountPage';
import JourneyTemplatesAdmin from '@/pages/JourneyTemplatesAdmin';
import JourneyContentAdmin from '@/pages/JourneyContentAdmin';
import AdminPagesCanvas from '@/pages/admin/AdminPagesCanvas';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';
import JourneyAudioMappingsViewer from '@/pages/admin/JourneyAudioMappingsViewer';
import SacredGeometryPage from '@/pages/SacredGeometryPage';
import VisualizerTestPage from '@/pages/VisualizerTestPage';
import VisualizerAdmin from '@/pages/admin/VisualizerAdmin';
import AdminRoutes from './routes/adminRoutes';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey/:slug" element={<JourneyPage />} />
          <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
          <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/journey-templates-admin" element={<ProtectedRoute><JourneyTemplatesAdmin /></ProtectedRoute>} />
          <Route path="/journey-content-admin" element={<ProtectedRoute><JourneyContentAdmin /></ProtectedRoute>} />
          <Route path="/admin/pages-canvas" element={<ProtectedRoute><AdminPagesCanvas /></ProtectedRoute>} />
          <Route path="/admin/journey-audio" element={<ProtectedRoute><JourneyAudioAdmin /></ProtectedRoute>} />
          <Route path="/admin/journey-audio-mappings" element={<ProtectedRoute><JourneyAudioMappingsViewer /></ProtectedRoute>} />
          <Route path="/sacred-geometry" element={<SacredGeometryPage />} />
          <Route path="/visualizer-test" element={<VisualizerTestPage />} />
          <Route path="/admin/visualizer-scenes" element={<ProtectedRoute><VisualizerAdmin /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
