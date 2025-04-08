
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import Focus from "@/pages/Focus";
import { Timeline } from "@/pages/Timeline";
import { MusicGenerator } from "@/pages/MusicGenerator";
import EmotionEngine from "@/pages/EmotionEngine";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalWatermark from "@/components/GlobalWatermark";
import Auth from "@/pages/Auth";
// Import our pages
import TrinityGateway from "./pages/TrinityGateway";
import Contact from "./pages/Contact";
import HeartDashboard from "./pages/HeartDashboard";
import MusicGeneration from "@/pages/MusicGeneration";
import SiteMap from "@/pages/SiteMap";
import EnergyCheck from "@/pages/EnergyCheck";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster closeButton position="top-center" />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
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
              path="/music-generator"
              element={
                <ProtectedRoute>
                  <MusicGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/music-generation"
              element={
                <ProtectedRoute>
                  <MusicGeneration />
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
              path="/heart-dashboard"
              element={
                <ProtectedRoute>
                  <HeartDashboard />
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
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <GlobalWatermark />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
