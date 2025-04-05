import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EnergyCheck from './pages/EnergyCheck';
import Alignment from './pages/Alignment';
import Intentions from './pages/Intentions';
import Timeline from './pages/Timeline';
import Profile from './pages/Profile';
import Focus from './pages/Focus';
import MusicLibrary from './pages/MusicLibrary';
import MusicGeneration from './pages/MusicGeneration';
import HermeticWisdom from './pages/HermeticWisdom';
import Astrology from './pages/Astrology';
import Meditation from './pages/Meditation';
import Subscription from './pages/Subscription';
import NotFound from './pages/NotFound';
import FrequencyLibraryPage from './pages/FrequencyLibrary';
import FrequencyDetailPage from './pages/FrequencyDetailPage';

// ProtectedRoute component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? children : null;
}

// Define routes
function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/energy-check" element={<ProtectedRoute><EnergyCheck /></ProtectedRoute>} />
      <Route path="/alignment" element={<ProtectedRoute><Alignment /></ProtectedRoute>} />
      <Route path="/intentions" element={<ProtectedRoute><Intentions /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
      <Route path="/music-library" element={<ProtectedRoute><MusicLibrary /></ProtectedRoute>} />
      <Route path="/music-generation" element={<ProtectedRoute><MusicGeneration /></ProtectedRoute>} />
      <Route path="/hermetic-wisdom" element={<ProtectedRoute><HermeticWisdom /></ProtectedRoute>} />
      <Route path="/astrology" element={<Astrology />} />
      <Route path="/meditation" element={<Meditation />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/frequencies/:frequencyId" element={<FrequencyDetailPage />} />
      <Route path="/frequency-library" element={<FrequencyLibraryPage />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
