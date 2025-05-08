
import { Routes, Route } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<SacredShifterHome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/journey/:slug" element={<Placeholder name="Journey" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/sacred-circle" element={<SacredCirclePage />} />
        <Route path="/lightbearer" element={<LightbearerPage />} />
        <Route path="/circle" element={<SacredCirclePage />} />
        <Route path="/frequency" element={<FrequencyEnginePage />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        
        {/* Journey Experience Routes */}
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/journey/:journeySlug/experience" element={<JourneyExperiencePage />} />
        
        {/* Test Route - For internal dev preview only */}
        <Route path="/test-journey" element={<TestJourney />} />
        
        {/* Fallback for missing routes */}
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
    </>
  );
}

export default App;
