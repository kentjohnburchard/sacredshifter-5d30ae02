import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { JourneyProvider } from '@/context/JourneyContext';
import { AuthProvider } from '@/context/AuthContext';
import { GlobalAudioPlayerProvider } from '@/context/GlobalAudioPlayerContext';

// Pages
import JourneyPage from './pages/JourneyPage';
import JourneyIndex from './pages/JourneyIndex';

// Import any other pages here

function App() {
  return (
    <>
      <Routes>
        <Route path="/journey/:slug" element={<JourneyPage />} />
        <Route path="/journeys" element={<JourneyIndex />} />
        <Route path="/" element={<JourneyIndex />} />
        
        {/* Add more routes as needed */}
      </Routes>
      
      <Toaster />
      <SonnerToaster position="top-center" />
    </>
  );
}

export default App;
