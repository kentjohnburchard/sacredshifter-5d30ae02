
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import TestJourney from './pages/TestJourney';
import JourneysPage from './pages/JourneysPage';
import JourneyExperiencePage from './pages/JourneyExperiencePage';
import LightbearerPage from './pages/LightbearerPage';
import SacredCirclePage from './pages/SacredCirclePage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import SacredShifterHome from './pages/SacredShifterHome';
import AboutFounder from './pages/AboutFounder';
import Journeys from './pages/Journeys';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import HeartDashboard from './pages/HeartDashboard';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        
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
        <Route path="/frequency" element={<FrequencyEnginePage />} />
        
        {/* Journey Experience Routes */}
        <Route 
          path="/journeys" 
          element={
            <ProtectedRoute>
              <Journeys />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journey/:journeySlug/experience" 
          element={
            <ProtectedRoute>
              <JourneyExperiencePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/journey/:slug" element={<Placeholder name="Journey" />} />
        
        {/* Legacy Routes - redirected */}
        <Route path="/home" element={<SacredShifterHome />} />
        
        {/* Test Route - For internal dev preview only */}
        <Route path="/test-journey" element={<TestJourney />} />
        
        {/* Fallback for missing routes */}
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
    </>
  );
}

export default App;
