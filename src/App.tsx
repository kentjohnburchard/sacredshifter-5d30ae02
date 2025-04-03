
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Astrology from '@/pages/Astrology';
import { AuthProvider } from '@/context/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Toaster } from 'sonner';

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
      path === '/soundscapes'
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster />
        {showBackground && (
          <AnimatedBackground colorScheme="purple" />
        )}
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/pricing" element={<div>Pricing Page</div>} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/blog" element={<div>Blog Page</div>} />
          <Route path="/coming-soon" element={<div>Coming Soon</div>} />
          <Route path="/astrology" element={<Astrology />} />
          <Route path="/music-generation" element={<div>Music Generation</div>} />
          <Route path="/meditation" element={<div>Meditation</div>} />
          <Route path="/focus" element={<div>Focus</div>} />
          <Route path="/soundscapes" element={<div>Soundscapes</div>} />
          <Route path="/mood-journal" element={<div>Mood Journal</div>} />
          <Route path="/timeline" element={<div>Timeline</div>} />
          <Route
            path="/account"
            element={
              !session ? (
                <Navigate to="/login" replace />
              ) : (
                <div>Account Page</div>
              )
            }
          />
          <Route
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
          <Route path="/frequency/:id" element={<div>Frequency Details</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
