
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Meditation from './pages/Meditation';
import FrequencyLibrary from './pages/FrequencyLibrary';
import JourneyTemplates from './pages/journey-templates';
import JourneyPlayer from './pages/JourneyPlayer';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import JourneyTemplatesAdmin from './pages/JourneyTemplatesAdmin';
import JourneysManager from './pages/admin/JourneysManager';
import SacredSpectrumAdmin from './pages/admin/SacredSpectrumAdmin';
import SiteMap from './pages/SiteMap';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster as SonnerToaster } from 'sonner';
import JourneyBulkImport from "./pages/admin/JourneyBulkImport";
import JourneyPage from '@/pages/JourneyPage';
import Auth from './pages/Auth';
import AboutFounder from './pages/AboutFounder';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meditation" element={<Meditation />} />
              <Route path="/frequency-library" element={<FrequencyLibrary />} />
              <Route path="/journey-templates" element={<JourneyTemplates />} />
              <Route path="/journey/:journeySlug" element={<JourneyPage />} />
              <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about-founder" element={<AboutFounder />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/journey-spirals" element={<JourneyTemplatesAdmin />} />
              <Route path="/admin/journeys" element={<JourneysManager />} />
              <Route path="/admin/sacred-spectrum" element={<SacredSpectrumAdmin />} />
              <Route path="/admin/journey-bulk-import" element={<JourneyBulkImport />} />
              <Route path="/site-map" element={<SiteMap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
