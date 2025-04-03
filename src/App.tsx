import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Account from '@/pages/Account';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import ComingSoon from '@/pages/ComingSoon';
import AnimatedBackground from '@/components/AnimatedBackground';
import Astrology from '@/pages/Astrology';
import MusicGeneration from '@/pages/MusicGeneration';
import Meditation from '@/pages/Meditation';
import Focus from '@/pages/Focus';
import MoodJournal from '@/pages/MoodJournal';
import Timeline from '@/pages/Timeline';
import { AuthProvider } from '@/context/AuthContext';
import CreditsDisplay from '@/components/CreditsDisplay';
import MusicPlayer from '@/components/MusicPlayer';
import FrequencyDetails from '@/components/FrequencyDetails';
import Soundscapes from '@/pages/Soundscapes';
import { Sonner } from 'sonner';

function App() {
  const [showBackground, setShowBackground] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
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
      path === '/soundscapes'
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Sonner />
        {showBackground && (
          <AnimatedBackground colorScheme="purple" />
        )}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/pricing" element={<Pricing />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route exact path="/coming-soon" element={<ComingSoon />} />
          <Route exact path="/astrology" element={<Astrology />} />
          <Route exact path="/music-generation" element={<MusicGeneration />} />
          <Route exact path="/meditation" element={<Meditation />} />
          <Route exact path="/focus" element={<Focus />} />
          <Route exact path="/soundscapes" element={<Soundscapes />} />
          <Route exact path="/mood-journal" element={<MoodJournal />} />
          <Route exact path="/timeline" element={<Timeline />} />
          <Route
            exact
            path="/account"
            element={
              !session ? (
                <Navigate to="/login" replace />
              ) : (
                <Account key={session.user.id} session={session} />
              )
            }
          />
          <Route
            exact
            path="/login"
            element={
              session ? (
                <Navigate to="/account" replace />
              ) : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="w-full max-w-md">
                    <Auth
                      supabaseClient={supabase}
                      appearance={{ theme: ThemeSupa }}
                      providers={['google', 'github']}
                      redirectTo={`${window.location.origin}/account`}
                    />
                  </div>
                </div>
              )
            }
          />
          <Route exact path="/frequency/:id" element={<FrequencyDetails />} />
        </Routes>
        <CreditsDisplay />
        <MusicPlayer />
      </Router>
    </AuthProvider>
  );
}

export default App;
