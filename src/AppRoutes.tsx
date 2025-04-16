
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

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SacredShifterHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/frequencies" element={<FrequencyLibrary />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutFounder />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/hermetic" element={<HermeticWisdom />} />
        <Route path="/frequency-shift" element={<FrequencyShift />} />
        <Route path="/journey-templates" element={<JourneyTemplatesPage />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/journey-player/:journeyId" element={<JourneyPlayer />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
