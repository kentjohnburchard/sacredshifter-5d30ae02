
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import { IntentionProvider } from './context/IntentionContext';
import { useAuthentication } from './hooks/useAuthentication.tsx';

// Pages
import LandingPage from './pages/landing/LandingPage';
import HomePage from './pages/HomePage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import MusicLibrary from './pages/MusicLibrary';
import DailyPracticePage from './pages/DailyPracticePage';
import FrequencyDetailPage from './pages/FrequencyDetailPage';
import Soundscapes from './pages/Soundscapes';
import HermeticJourneyPage from './pages/HermeticJourneyPage';
import ComingSoonPage from './pages/ComingSoonPage';
import NotFoundPage from './pages/NotFoundPage';
import Auth from './pages/Auth';
import Alignment from './pages/Alignment';

// Journey Experience Pages
import JourneyPage from './pages/JourneyPage';
import JourneyPlayer from './components/frequency-journey/JourneyPlayer';
import Journeys from './pages/JourneysPage';
import JourneyIndex from './pages/JourneyIndex';
import JourneyTemplatesPage from './pages/journey-templates';
import JourneyExperiencePage from './pages/JourneyExperiencePage';

// Community & Info
import AboutFounder from './pages/AboutFounder';
import SacredCirclePage from './pages/SacredCirclePage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import JourneyAdmin from './pages/admin/JourneyAdmin';
import FrequencyAdmin from './pages/admin/FrequencyAdmin';
import UserAdmin from './pages/admin/UserAdmin';
import JourneyAudioAdmin from './pages/admin/JourneyAudioAdmin';
import JourneySoundscapesAdmin from './pages/admin/JourneySoundscapesAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import LightbearerPage from './pages/LightbearerPage';
import RealityOptimizerPage from './pages/RealityOptimizerPage';

function App() {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  // Optional redirect logic can be uncommented
  // useEffect(() => {
  //   if (user && window.location.pathname === '/') {
  //     navigate('/home');
  //   }
  // }, [user, navigate]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <JourneyProvider>
          <IntentionProvider>
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutFounder />} />
              <Route path="/about-founder" element={<AboutFounder />} />
              <Route path="/sacred-circle" element={<SacredCirclePage />} />
              <Route path="/circle" element={<SacredCirclePage />} />
              <Route path="/frequency-engine" element={<FrequencyEnginePage />} />
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/daily-practice" element={<DailyPracticePage />} />
              <Route path="/frequency/:frequency" element={<FrequencyDetailPage />} />
              <Route path="/soundscapes" element={<Soundscapes />} />
              <Route path="/hermetic-journey" element={<HermeticJourneyPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="/alignment" element={<Alignment />} />
              <Route path="/lightbearer" element={<LightbearerPage />} />
              <Route path="/reality-optimizer" element={<RealityOptimizerPage />} />
              
              {/* Auth Route */}
              <Route path="/auth" element={<Auth />} />

              {/* Journey Experience */}
              <Route path="/journey/:slug" element={<JourneyPage />} />
              <Route path="/journey/:slug/experience" element={<JourneyExperiencePage />} />
              <Route path="/journey-player" element={<JourneyPlayer />} />
              <Route path="/journeys" element={<Journeys />} />
              <Route path="/journey-index" element={<JourneyIndex />} />
              <Route path="/journey-templates" element={<JourneyTemplatesPage />} />

              {/* Admin (Protected) */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/journeys" element={<ProtectedRoute><JourneyAdmin /></ProtectedRoute>} />
              <Route path="/admin/frequencies" element={<ProtectedRoute><FrequencyAdmin /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserAdmin /></ProtectedRoute>} />
              <Route path="/admin/journey-audio" element={<ProtectedRoute><JourneyAudioAdmin /></ProtectedRoute>} />
              <Route path="/admin/journeys/soundscapes" element={<ProtectedRoute><JourneySoundscapesAdmin /></ProtectedRoute>} />

              {/* Optional Future Routes */}
              {/* <Route path="/frequency-library" element={<FrequencyLibrary />} /> */}
              {/* <Route path="/sacred-geometry" element={<SacredGeometryVisualizer />} /> */}

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </IntentionProvider>
        </JourneyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
