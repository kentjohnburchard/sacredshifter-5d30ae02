
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import TestJourney from './pages/TestJourney';
import JourneyExperiencePage from './pages/JourneyExperiencePage';
import LightbearerPage from './pages/LightbearerPage';
import SacredCirclePage from './pages/SacredCirclePage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import RealityOptimizerPage from './pages/RealityOptimizerPage';
import SacredShifterHome from './pages/SacredShifterHome';
import AboutFounder from './pages/AboutFounder';
import Journeys from './pages/JourneysPage';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import HeartDashboard from './pages/HeartDashboard';
import JourneyTemplatesPage from './pages/journey-templates';
import JourneyIndex from './pages/JourneyIndex';
import JourneyPage from './pages/JourneyPage';
import JourneyPlayer from './components/frequency-journey/JourneyPlayer';

function App() {
  const { user, loading } = useAuth();

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-lg text-purple-700">Loading Sacred Shifter...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        
        {/* Journey Routes */}
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/journey-templates" element={<JourneyTemplatesPage />} />
        <Route path="/journey-index" element={<JourneyIndex />} />
        <Route path="/journey/:slug" element={<JourneyPage />} />
        <Route path="/journey/:journeySlug/experience" element={<JourneyExperiencePage />} />
        <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
        
        {/* Feature Routes */}
        <Route path="/frequency-engine" element={<FrequencyEnginePage />} />
        <Route path="/reality-optimizer" element={<RealityOptimizerPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sacred-circle" 
          element={
            <ProtectedRoute>
              <SacredCirclePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lightbearer" 
          element={
            <ProtectedRoute>
              <LightbearerPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/heart" 
          element={
            <ProtectedRoute>
              <HeartDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Public Feature Routes */}
        <Route path="/circle" element={<SacredCirclePage />} />
        
        {/* Fallback for missing routes */}
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
    </>
  );
}

export default App;
