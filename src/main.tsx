import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Remove BrowserRouter import
// import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "sonner";
import { ThemeProvider } from '@/context/ThemeContext';
import { EasterEggProvider } from './context/EasterEggContext';
import ThemeEnhancer from './components/ThemeEnhancer';
import ConsciousnessToggle from './components/ConsciousnessToggle';

// Custom SPA router import
import { RouterProvider, Route } from './lib/spa-router';
import SacredShifterHome from './pages/SacredShifterHome';
import Dashboard from './pages/Dashboard';
import FrequencyLibrary from './pages/FrequencyLibrary';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AboutFounder from './pages/AboutFounder';
import Meditation from './pages/Meditation';
import HermeticWisdom from './pages/HermeticWisdom';
import FrequencyShift from './pages/FrequencyShift';
import JourneyTemplatesPage from './pages/journey-templates';
import Journeys from './pages/Journeys';
import JourneyPlayer from './pages/JourneyPlayer';
import SiteMap from './pages/SiteMap';
import SacredGridDemo from './pages/SacredGridDemo';
import HarmonicMapPage from './pages/HarmonicMap';
import HeartCenter from './pages/HeartCenter';
import HeartDashboard from './pages/HeartDashboard';
import SacredBlueprint from './pages/SacredBlueprint';
import ShiftPerception from './pages/ShiftPerception';
import TrinityGateway from './pages/TrinityGateway';
import Alignment from './pages/Alignment';
import EnergyCheck from './pages/EnergyCheck';
import Focus from './pages/Focus';
import Astrology from './pages/Astrology';
import Contact from './pages/Contact';
import PrimeFrequencyActivation from './pages/PrimeFrequencyActivation';
import Subscription from './pages/Subscription';
import SacredShifterWhat from './pages/SacredShifterWhat';
import SacredShifterWhy from './pages/SacredShifterWhy';
import SacredShifterHow from './pages/SacredShifterHow';
import NotFound from './pages/NotFound';

console.log("Starting Sacred Shifter application");

// Check theme BEFORE React mounts
const initializeTheme = () => {
  try {
    const savedTheme = localStorage.getItem('liftTheVeil');
    console.log("Initial theme check from localStorage:", savedTheme);
    if (savedTheme === 'true') {
      document.documentElement.classList.add('veil-lifted');
      console.log("Added veil-lifted class on initial load");
    } else {
      document.documentElement.classList.remove('veil-lifted');
      console.log("Ensuring veil-lifted class is not present on initial load");
    }
  } catch (e) {
    console.error("Error checking theme:", e);
  }
};

initializeTheme();

// Define your SPA routes using your custom router's structure
const routes = [
  Route({ path: "/", element: <SacredShifterHome /> }),
  Route({ path: "/home", element: <SacredShifterHome /> }),
  Route({ path: "/dashboard", element: <Dashboard /> }),
  Route({ path: "/frequency-library", element: <FrequencyLibrary /> }),
  Route({ path: "/frequencies", element: <FrequencyLibrary /> }),
  Route({ path: "/auth", element: <Auth /> }),
  Route({ path: "/profile", element: <Profile /> }),
  Route({ path: "/subscription", element: <Subscription /> }),
  Route({ path: "/about-founder", element: <AboutFounder /> }),
  Route({ path: "/meditation", element: <Meditation /> }),
  Route({ path: "/hermetic-wisdom", element: <HermeticWisdom /> }),
  Route({ path: "/frequency-shift", element: <FrequencyShift /> }),
  Route({ path: "/journey-templates", element: <JourneyTemplatesPage /> }),
  Route({ path: "/journeys", element: <Journeys /> }),
  Route({ path: "/journey-player/:journeyId", element: <JourneyPlayer /> }),
  Route({ path: "/journey-player/*", element: <JourneyPlayer /> }),
  Route({ path: "/site-map", element: <SiteMap /> }),
  Route({ path: "/sacred-grid", element: <SacredGridDemo /> }),
  Route({ path: "/harmonic-map", element: <HarmonicMapPage /> }),
  Route({ path: "/heart-center", element: <HeartCenter /> }),
  Route({ path: "/heart-dashboard", element: <HeartDashboard /> }),
  Route({ path: "/sacred-blueprint", element: <SacredBlueprint /> }),
  Route({ path: "/shift-perception", element: <ShiftPerception /> }),
  Route({ path: "/trinity-gateway", element: <TrinityGateway /> }),
  Route({ path: "/alignment", element: <Alignment /> }),
  Route({ path: "/energy-check", element: <EnergyCheck /> }),
  Route({ path: "/focus", element: <Focus /> }),
  Route({ path: "/astrology", element: <Astrology /> }),
  Route({ path: "/contact", element: <Contact /> }),
  Route({ path: "/prime-frequency", element: <PrimeFrequencyActivation /> }),
  // SacredShifter info dropdown pages:
  Route({ path: "/about/what", element: <SacredShifterWhat /> }),
  Route({ path: "/about/why", element: <SacredShifterWhy /> }),
  Route({ path: "/about/how", element: <SacredShifterHow /> }),
  Route({ path: "*", element: <NotFound /> }),
];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider routes={routes}>
      <ThemeProvider>
        <EasterEggProvider>
          <Toaster 
            position="top-center" 
            richColors 
            toastOptions={{
              duration: 3000,
              style: { 
                background: 'rgba(30, 20, 60, 0.9)', 
                color: 'white',
              }
            }} 
          />
          <ThemeEnhancer />
          <ConsciousnessToggle />
          {/* Instead of rendering <App /> here, use App to wrap the providers' children */}
          <App>
            {/* Move all routable children here */}
            {/* If any children should be directly inside App, move them here */}
          </App>
        </EasterEggProvider>
      </ThemeProvider>
    </RouterProvider>
  </React.StrictMode>,
);

console.log("Application rendering complete");
console.log("TOGGLE DEBUG: To manually toggle consciousness state, run in console: localStorage.setItem('liftTheVeil', 'true') and reload, or localStorage.setItem('liftTheVeil', 'false') and reload");
