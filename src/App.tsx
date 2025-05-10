import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import { IntentionProvider } from './context/IntentionContext';
import LandingPage from './pages/landing/LandingPage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import MusicLibrary from './pages/MusicLibrary';
import DailyPracticePage from './pages/DailyPracticePage';
import FrequencyDetailPage from './pages/FrequencyDetailPage';
import Soundscapes from './pages/Soundscapes';
import HermeticJourneyPage from './pages/HermeticJourneyPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import JourneyAdmin from './pages/admin/JourneyAdmin';
import FrequencyAdmin from './pages/admin/FrequencyAdmin';
import UserAdmin from './pages/admin/UserAdmin';
import JourneyAudioAdmin from './pages/admin/JourneyAudioAdmin';
import JourneySoundscapesAdmin from './pages/admin/JourneySoundscapesAdmin';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users away from the landing page
    if (user && window.location.pathname === '/') {
      navigate('/frequency-engine');
    }
  }, [user, navigate]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <JourneyProvider>
          <IntentionProvider>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/frequency-engine" element={<FrequencyEnginePage />} />
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/daily-practice" element={<DailyPracticePage />} />
              <Route path="/frequency/:frequency" element={<FrequencyDetailPage />} />
              <Route path="/soundscapes" element={<Soundscapes />} />
              <Route path="/hermetic-journey" element={<HermeticJourneyPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="*" element={<NotFoundPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/journeys" element={<JourneyAdmin />} />
              <Route path="/admin/frequencies" element={<FrequencyAdmin />} />
              <Route path="/admin/users" element={<UserAdmin />} />
              <Route path="/admin/journey-audio" element={<JourneyAudioAdmin />} />
              <Route path="/admin/journeys/soundscapes" element={<JourneySoundscapesAdmin />} />
              
            </Routes>
          </IntentionProvider>
        </JourneyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
