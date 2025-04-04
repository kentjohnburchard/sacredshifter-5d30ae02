import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { AstrologyPage } from '@/components/astrology';  // Updated import
import Focus from '@/pages/Focus';
import Meditation from '@/pages/Meditation';
import { AuthProvider } from '@/context/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Toaster } from 'sonner';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import Header from '@/components/Header';

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
        <ScrollToTop />
        <Toaster />
        {showBackground && (
          <AnimatedBackground colorScheme="purple" />
        )}
        <Routes>
          <Route path="/" element={<Layout><div className="min-h-screen">Home Page</div></Layout>} />
          <Route path="/pricing" element={<Layout><div className="min-h-screen">Pricing Page</div></Layout>} />
          <Route path="/about" element={<Layout><div className="min-h-screen">About Page</div></Layout>} />
          <Route path="/contact" element={<Layout><div className="min-h-screen">Contact Page</div></Layout>} />
          <Route path="/blog" element={<Layout><div className="min-h-screen">Blog Page</div></Layout>} />
          <Route path="/coming-soon" element={<Layout><div className="min-h-screen">Coming Soon</div></Layout>} />
          <Route path="/astrology" element={<AstrologyPage />} />
          <Route path="/music-generation" element={<Layout><div className="min-h-screen">Music Generation</div></Layout>} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/soundscapes" element={<Layout><div className="min-h-screen">Soundscapes</div></Layout>} />
          <Route path="/mood-journal" element={<Layout><div className="min-h-screen">Mood Journal</div></Layout>} />
          <Route path="/timeline" element={<Layout><div className="min-h-screen">Timeline</div></Layout>} />
          <Route
            path="/account"
            element={
              !session ? (
                <Navigate to="/login" replace />
              ) : (
                <Layout><div className="min-h-screen">Account Page</div></Layout>
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
          <Route path="/frequency/:id" element={<Layout><div className="min-h-screen">Frequency Details</div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
