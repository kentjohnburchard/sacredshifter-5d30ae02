
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

// Import styles
import "@/styles/globals.css";
import "@/styles/sacred-geometry.css";
import "@/styles/sacred-theme.css";

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import SacredCirclePage from './pages/SacredCirclePage';
import LightbearerPage from './pages/LightbearerPage';
import JourneyPage from './pages/JourneyPage';
import FrequencyEnginePage from './pages/FrequencyEnginePage';
import AuthPage from './pages/AuthPage';
import SacredCircle from './pages/SacredCircle';

// Import additional components
import NotFoundPage from './pages/NotFoundPage';
import DevRouter from './dev/DevRouter';

// Determine if we're in development mode
const isDev = import.meta.env.DEV;

function App() {
  const { liftTheVeil } = useTheme();
  
  // Apply the base body class based on veil state
  const bodyClassName = liftTheVeil ? 'veil-mode' : 'standard-mode';
  document.body.className = bodyClassName;
  
  return (
    <>
      {/* Main App Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sacred-circle" element={<SacredCirclePage />} />
        <Route path="/circle" element={<SacredCircle />} />
        <Route path="/lightbearer" element={<LightbearerPage />} />
        <Route path="/journey/:slug" element={<JourneyPage />} />
        <Route path="/frequency-engine" element={<FrequencyEnginePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {/* Development Routes - Only rendered in development mode */}
      {isDev && <DevRouter />}
    </>
  );
}

export default App;
