import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Subscription } from "@/pages/Subscription";
import { Focus } from "@/pages/Focus";
import { Timeline } from "@/pages/Timeline";
import { MusicGenerator } from "@/pages/MusicGenerator";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalWatermark } from "@/components/GlobalWatermark";
// Import our new Trinity Gateway page
import TrinityGateway from "./pages/TrinityGateway";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster closeButton position="top-center" />
              <ScrollToTop />
              <div className="flex flex-col min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
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
                    path="/trinity-gateway"
                    element={
                      <ProtectedRoute>
                        <TrinityGateway />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <GlobalWatermark />
            </QueryClientProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
