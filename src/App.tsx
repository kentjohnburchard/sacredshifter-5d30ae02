
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Astrology from '@/pages/Astrology';
import Focus from '@/pages/Focus';
import Meditation from '@/pages/Meditation';
import Timeline from '@/pages/Timeline';
import EnergyCheck from '@/pages/EnergyCheck';
import Alignment from '@/pages/Alignment';
import Intentions from '@/pages/Intentions';
import Soundscapes from '@/pages/Soundscapes';
import JourneyTemplates from '@/pages/JourneyTemplates';
import JourneyPlayer from '@/pages/JourneyPlayer';
import Index from '@/pages/Index';
import AuthPage from '@/pages/Auth';
import { AuthProvider } from '@/context/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Toaster } from 'sonner';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  const [showBackground, setShowBackground] = React.useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  React.useEffect(() => {
    const path = window.location.pathname;
    setShowBackground(
      path === '/' ||
      path === '/pricing' ||
      path === '/about' ||
      path === '/contact' ||
      path === '/blog' ||
      path === '/astrology' ||
      path === '/music-generation' ||
      path === '/meditation' ||
      path === '/focus' ||
      path === '/soundscapes' ||
      path === '/timeline'
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster />
        {showBackground && (
          <AnimatedBackground colorScheme="purple" />
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Layout pageTitle="Pricing"><div className="min-h-screen">Pricing Page</div></Layout>} />
          <Route path="/about" element={<Layout pageTitle="About Us"><div className="min-h-screen">About Page</div></Layout>} />
          <Route path="/contact" element={<Layout pageTitle="Contact Us"><div className="min-h-screen">Contact Page</div></Layout>} />
          <Route path="/blog" element={<Layout pageTitle="Blog"><div className="min-h-screen">Blog Page</div></Layout>} />
          <Route path="/coming-soon" element={<Layout pageTitle="Coming Soon"><div className="min-h-screen">Coming Soon</div></Layout>} />
          <Route path="/astrology" element={<Astrology />} />
          <Route path="/music-generation" element={<Layout pageTitle="Music Generation"><div className="min-h-screen">Music Generation</div></Layout>} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/soundscapes" element={<Soundscapes />} />
          <Route path="/mood-journal" element={<Layout pageTitle="Mood Journal"><div className="min-h-screen">Mood Journal</div></Layout>} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/journeys" element={<Navigate to="/journey-templates" replace />} />
          <Route path="/journey-templates" element={<JourneyTemplates />} />
          <Route path="/journey/:frequencyId" element={<JourneyPlayer />} />
          <Route path="/energy-check" element={<EnergyCheck />} />
          <Route path="/alignment" element={<Alignment />} />
          <Route path="/intentions" element={<Intentions />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/account"
            element={
              !session ? (
                <Navigate to="/auth" replace />
              ) : (
                <Layout pageTitle="My Account"><div className="min-h-screen">Account Page</div></Layout>
              )
            }
          />
          <Route
            path="/login"
            element={
              session ? (
                <Navigate to="/account" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route path="/frequency/:id" element={<Layout pageTitle="Frequency Details"><div className="min-h-screen">Frequency Details</div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
