import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Journeys from './pages/Journeys';
import EnergyCheck from './pages/EnergyCheck';
import Alignment from './pages/Alignment';
import Intentions from './pages/Intentions';
import MusicGeneration from './pages/MusicGeneration';
import MusicLibrary from './pages/MusicLibrary';
import Subscription from './pages/Subscription';
import NotFound from './pages/NotFound';
import Timeline from './pages/Timeline';
import JourneyTemplates from "./pages/JourneyTemplates";
import JourneyPlayer from "./pages/JourneyPlayer";
import FrequencyLibrary from "./pages/FrequencyLibrary";
import HermeticWisdom from "./pages/HermeticWisdom";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Onboarding from './components/Onboarding';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { QueryClientProvider, QueryClient } from 'react-query';
import { ThemeProvider } from 'next-themes';
import AnimatedBackground from './components/AnimatedBackground';

const queryClient = new QueryClient();

// Auth callback page for OAuth providers
const AuthCallback = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an error in the URL
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const errorParam = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    if (errorParam) {
      setError(`${errorParam}: ${errorDescription}`);
    }
  }, [location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

// Check if user needs to complete onboarding
const OnboardingWrapper = () => {
  const { user, loading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || loading) return;
      
      try {
        const { data, error } = await fetch(`/api/check-onboarding?userId=${user.id}`).then(res => res.json());
        
        if (error) throw error;
        
        setNeedsOnboarding(!data?.onboarding_completed);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to showing onboarding if we can't check
        setNeedsOnboarding(true);
      }
    };
    
    checkOnboardingStatus();
  }, [user, loading]);
  
  if (loading || needsOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (needsOnboarding) {
    return <Onboarding />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="sacred-shifter-theme">
          <ScrollToTop />
          <BrowserRouter>
            <AnimatedBackground />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/journeys" element={<Journeys />} />
              <Route path="/energy-check" element={<EnergyCheck />} />
              <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
              <Route path="/music-generation" element={<MusicGeneration />} />
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/frequency-library" element={<FrequencyLibrary />} />
              <Route path="/journey-player/:frequencyId" element={<JourneyPlayer />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/journey-templates" element={<JourneyTemplates />} />
              <Route path="/intentions" element={<Intentions />} />
              <Route path="/alignment" element={<Alignment />} />
              <Route path="/astrology" element={<Astrology />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
