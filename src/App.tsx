
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Journeys from "./pages/Journeys";
import EnergyCheck from "./pages/EnergyCheck";
import Alignment from "./pages/Alignment";
import Intentions from "./pages/Intentions";
import MusicGeneration from "./pages/MusicGeneration";
import Subscription from "./pages/Subscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MusicLibrary from "./pages/MusicLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/journeys" element={<Journeys />} />
            <Route path="/energy-check" element={<EnergyCheck />} />
            <Route path="/alignment" element={<Alignment />} />
            <Route path="/intentions" element={<Intentions />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/music-generation" 
              element={
                <ProtectedRoute>
                  <MusicGeneration />
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
              path="/music-library" 
              element={
                <ProtectedRoute>
                  <MusicLibrary />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
