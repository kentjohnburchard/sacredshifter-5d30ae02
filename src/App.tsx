import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import MusicGeneration from "@/pages/MusicGeneration";
import MusicLibrary from "@/pages/MusicLibrary";
import Timeline from "@/pages/Timeline";
import EnergyCheck from "@/pages/EnergyCheck";
import Focus from "@/pages/Focus";
import Intentions from "@/pages/Intentions";
import Meditation from "@/pages/Meditation";
import Soundscapes from "@/pages/Soundscapes";
import FrequencyLibrary from "@/pages/FrequencyLibrary"; // Updated to use existing file
import HermeticWisdom from "@/pages/HermeticWisdom";
import Journeys from "@/pages/Journeys";
import JourneyPlayer from "@/pages/JourneyPlayer";
import JourneyTemplates from "@/pages/JourneyTemplates";
import Alignment from "@/pages/Alignment";
import Astrology from "@/pages/Astrology";
import Subscription from "@/pages/Subscription";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./App.css";

function App() {
  const location = useLocation();
  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    // Hide Toaster on specific routes
    const excludedRoutes = ['/auth'];
    setShowToaster(!excludedRoutes.includes(location.pathname));
  }, [location]);

  return (
    <>
      <ScrollToTop />
      {showToaster && <Toaster />}
      <SonnerToaster position="bottom-center" richColors />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/music-generation" element={<MusicGeneration />} />
        <Route path="/music-library" element={<MusicLibrary />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/energy-check" element={<EnergyCheck />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/intentions" element={<Intentions />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/soundscapes" element={<Soundscapes />} />
        <Route path="/frequency-library" element={<FrequencyLibrary />} />
        <Route path="/hermetic-wisdom" element={<HermeticWisdom />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/journey/:id" element={<JourneyPlayer />} />
        <Route path="/journey-templates" element={<JourneyTemplates />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
