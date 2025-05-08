
import { Routes, Route } from 'react-router-dom';
import Placeholder from './pages/Placeholder';
import TestJourney from './pages/TestJourney';
import JourneysPage from './pages/JourneysPage';
import JourneyExperiencePage from './pages/JourneyExperiencePage';
import LightbearerPage from './pages/LightbearerPage';
import SacredCirclePage from './pages/SacredCirclePage';

function App() {
  return (
    <>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/journey/:slug" element={<Placeholder name="Journey" />} />
        <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
        <Route path="/sacred-circle" element={<SacredCirclePage />} />
        <Route path="/lightbearer" element={<LightbearerPage />} />
        <Route path="/circle" element={<SacredCirclePage />} />
        
        {/* Journey Experience Routes */}
        <Route path="/journeys" element={<JourneysPage />} />
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
