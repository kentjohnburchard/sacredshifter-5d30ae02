
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/context/ThemeContext";
import ConsciousnessToggle from "@/components/ConsciousnessToggle";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import Focus from "@/pages/Focus";
import { Timeline } from "@/pages/Timeline";
import EmotionEngine from "@/pages/EmotionEngine";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalWatermark from "@/components/GlobalWatermark";
import Auth from "@/pages/Auth";
import TrinityGateway from "./pages/TrinityGateway";
import Contact from "./pages/Contact";
import Welcome from "./pages/Welcome";
import SiteMap from "@/pages/SiteMap";
import EnergyCheck from "@/pages/EnergyCheck";
import NotFound from "@/pages/NotFound";
import SacredBlueprintPage from "@/pages/SacredBlueprint";
import ShiftPerception from "@/pages/ShiftPerception";
import HeartCenter from "@/pages/HeartCenter";
import HermeticWisdom from "@/pages/HermeticWisdom";
import Alignment from "@/pages/Alignment";
import Intentions from "@/pages/Intentions";
import MusicLibraryPage from "@/pages/MusicLibraryPage";
import JourneyTemplates from "@/pages/JourneyTemplates";
import Astrology from "@/pages/Astrology";
import AboutFounder from "@/pages/AboutFounder";
import PersonalVibeSettings from "@/pages/PersonalVibeSettings";
import HarmonicMapPage from "@/pages/HarmonicMap";
import Index from "@/pages/Index";

function App() {
  return (
    <ThemeProvider>
      <Toaster closeButton position="top-center" />
      <ScrollToTop />
      <ConsciousnessToggle />
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/index" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/site-map" element={<SiteMap />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal-vibe"
            element={
              <ProtectedRoute>
                <PersonalVibeSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <Focus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <Timeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/music-library"
            element={
              <ProtectedRoute>
                <MusicLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journey-templates"
            element={
              <ProtectedRoute>
                <JourneyTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emotion-engine"
            element={
              <ProtectedRoute>
                <EmotionEngine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trinity-gateway"
            element={
              <ProtectedRoute>
                <TrinityGateway />
              </ProtectedRoute>
            }
          />
          <Route
            path="/heart-center"
            element={
              <ProtectedRoute>
                <HeartCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/energy-check"
            element={
              <ProtectedRoute>
                <EnergyCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sacred-blueprint"
            element={
              <ProtectedRoute>
                <SacredBlueprintPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shift-perception"
            element={
              <ProtectedRoute>
                <ShiftPerception />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hermetic-wisdom"
            element={
              <ProtectedRoute>
                <HermeticWisdom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alignment"
            element={
              <ProtectedRoute>
                <Alignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intentions"
            element={
              <ProtectedRoute>
                <Intentions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/astrology"
            element={
              <ProtectedRoute>
                <Astrology />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about-founder"
            element={
              <ProtectedRoute>
                <AboutFounder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/harmonic-map"
            element={
              <ProtectedRoute>
                <HarmonicMapPage />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <GlobalWatermark />
    </ThemeProvider>
  );
}

export default App;
