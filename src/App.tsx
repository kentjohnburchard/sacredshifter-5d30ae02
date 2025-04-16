
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import FrequencyLibrary from './pages/FrequencyLibrary';
import FrequencyDetail from './pages/FrequencyDetail';
import ChakraSelfAssessment from './pages/ChakraSelfAssessment';
import JourneyTemplates from './pages/JourneyTemplates';
import JourneyDetailPage from './pages/JourneyDetailPage';
import JourneyPlayer from './pages/JourneyPlayer';
import ValeMysteries from './pages/ValeMysteries';
import HermeticPrinciples from './pages/HermeticPrinciples';
import EgyptianWisdom from './pages/EgyptianWisdom';
import ConsciousnessShifter from './pages/ConsciousnessShifter';
import DigitalTwinPage from './pages/DigitalTwinPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import JourneyAudioAdmin from './pages/JourneyAudioAdmin';
import NavigationRoot from './components/NavigationRoot';
import PreferencesLoader from './components/PreferencesLoader';
import { UserPreferencesProvider, useUserPreferences } from './context/UserPreferencesContext';

function AppContent() {
  const queryClient = new QueryClient();
  const { userPreferences } = useUserPreferences();

  return (
    <div className={`App ${userPreferences.reduceAnimations ? "reduce-animations" : ""}`}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <NavigationRoot />
              <Routes>
                {/* Core routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/journey-audio-admin" element={<JourneyAudioAdmin />} />
                
                {/* Frequency routes */}
                <Route path="/frequency-library" element={<FrequencyLibrary />} />
                <Route path="/frequency/:id" element={<FrequencyDetail />} />
                
                {/* Chakra routes */}
                <Route path="/chakra-assessment" element={<ChakraSelfAssessment />} />
                
                {/* Vale routes */}
                <Route path="/vale-mysteries" element={<ValeMysteries />} />
                
                {/* Hermetic routes */}
                <Route path="/hermetic-principles" element={<HermeticPrinciples />} />
                
                {/* Egyptian Wisdom routes */}
                <Route path="/egyptian-wisdom" element={<EgyptianWisdom />} />
                
                {/* Consciousness Shifter route */}
                <Route path="/consciousness-shifter" element={<ConsciousnessShifter />} />
                
                {/* Digital Twin route */}
                <Route path="/digital-twin" element={<DigitalTwinPage />} />
                
                {/* Journey routes */}
                <Route path="/journey-templates" element={<JourneyTemplates />} />
                <Route path="/journey-detail/:id" element={<JourneyDetailPage />} />
                <Route path="/journey-player/:id" element={<JourneyPlayer />} />
              </Routes>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

function App() {
  return (
    <UserPreferencesProvider>
      <PreferencesLoader>
        <AppContent />
      </PreferencesLoader>
    </UserPreferencesProvider>
  );
}

export default App;
