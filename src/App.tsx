
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Pages
import JourneyPage from './pages/JourneyPage';
import JourneyIndex from './pages/JourneyIndex';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import AboutFounder from './pages/AboutFounder';
import SacredSpectrum from './pages/SacredSpectrum';
import SacredCircle from './pages/SacredCircle';
import Subscription from './pages/Subscription';
import Contact from './pages/Contact';
import Placeholder from './pages/Placeholder';

// Admin routes (only shown in dev mode)
import AdminRoutes from './routes/adminRoutes';

function App() {
  const isDevMode = process.env.NODE_ENV === 'development';

  return (
    <>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journey/:slug" element={<JourneyPage />} />
        <Route path="/journeys" element={<JourneyIndex />} />
        <Route path="/sacred-circle" element={<SacredCircle />} />
        <Route path="/sacred-spectrum" element={<SacredSpectrum />} />
        <Route path="/about-founder" element={<AboutFounder />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes (only in dev mode) */}
        {isDevMode && <Route path="/admin/*" element={<AdminRoutes />} />}
        
        {/* Fallback for missing routes */}
        <Route path="*" element={<Placeholder />} />
      </Routes>
      
      <Toaster />
      <SonnerToaster position="top-center" />
    </>
  );
}

export default App;
