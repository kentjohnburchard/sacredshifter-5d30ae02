
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import FrequencyLibrary from './pages/FrequencyLibrary';
import SacredShifterHome from './pages/SacredShifterHome';
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

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SacredShifterHome />} />
        <Route path="/home" element={<SacredShifterHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/frequency-library" element={<FrequencyLibrary />} />
        <Route path="/frequencies" element={<FrequencyLibrary />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
        <Route path="/frequency-shift" element={<FrequencyShift />} />
        <Route path="/journey-templates" element={<JourneyTemplatesPage />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
        <Route path="/journey-player/*" element={<JourneyPlayer />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/sacred-grid" element={<SacredGridDemo />} />
        <Route path="/harmonic-map" element={<HarmonicMapPage />} />
        <Route path="/heart-center" element={<HeartCenter />} />
        <Route path="/heart-dashboard" element={<HeartDashboard />} />
        <Route path="/sacred-blueprint" element={<SacredBlueprint />} />
        <Route path="/shift-perception" element={<ShiftPerception />} />
        <Route path="/trinity-gateway" element={<TrinityGateway />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/energy-check" element={<EnergyCheck />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/prime-frequency" element={<PrimeFrequencyActivation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
