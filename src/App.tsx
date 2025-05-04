import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Meditation from './pages/Meditation';
import SoundHealing from './pages/SoundHealing';
import FrequencyLibrary from './pages/FrequencyLibrary';
import FrequencyDetail from './pages/FrequencyDetail';
import JourneyTemplates from './pages/journey-templates';
import JourneyDetail from './pages/JourneyDetail';
import JourneyPlayer from './pages/JourneyPlayer';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import JourneyContentAdmin from './pages/JourneyContentAdmin';
import JourneyTemplatesAdmin from './pages/JourneyTemplatesAdmin';
import JourneysManager from './pages/admin/JourneysManager';
import SacredSpectrumAdmin from './pages/admin/SacredSpectrumAdmin';
import JourneyAudioAdmin from './pages/admin/JourneyAudioAdmin';
import JourneyAudioMappings from './pages/admin/JourneyAudioMappings';
import PagesAdmin from './pages/admin/PagesAdmin';
import SiteMap from './pages/SiteMap';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster as SonnerToaster } from 'sonner';
import JourneyBulkImport from "./pages/admin/JourneyBulkImport";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meditation" element={<Meditation />} />
              <Route path="/sound-healing" element={<SoundHealing />} />
              <Route path="/frequency-library" element={<FrequencyLibrary />} />
              <Route path="/frequency/:id" element={<FrequencyDetail />} />
              <Route path="/journey-templates" element={<JourneyTemplates />} />
              <Route path="/journey/:slug" element={<JourneyDetail />} />
              <Route path="/journey-player/:slug" element={<JourneyPlayer />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/journey-content" element={<JourneyContentAdmin />} />
              <Route path="/admin/journey-spirals" element={<JourneyTemplatesAdmin />} />
              <Route path="/admin/journeys" element={<JourneysManager />} />
              <Route path="/admin/sacred-spectrum" element={<SacredSpectrumAdmin />} />
              <Route path="/admin/journey-audio-admin" element={<JourneyAudioAdmin />} />
              <Route path="/admin/journey-audio-mappings" element={<JourneyAudioMappings />} />
              <Route path="/admin/pages" element={<PagesAdmin />} />
              <Route path="/admin/journey-bulk-import" element={<JourneyBulkImport />} />
              <Route path="/sitemap" element={<SiteMap />} />
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
