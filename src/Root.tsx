
import React from "react";
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './lib/queryClient';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import { GlobalAudioPlayerProvider } from './context/GlobalAudioPlayerContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { GuidanceProvider } from './context/GuidanceContext';
import { VisualThemeProvider } from './context/VisualThemeContext';
import { DailyPracticeProvider } from './context/DailyPracticeContext';
import { ModalProvider } from './context/ModalContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import PromptManager from "@/components/journey/PromptManager"; 
import GuidanceEngine from "@/components/guidance/GuidanceEngine";
import App from "./App";
import ScrollToTop from "./components/ScrollToTop";

// Create a client instance outside component for persistence
const queryClient = createQueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <ThemeProvider defaultTheme="dark" storageKey="sacred-theme">
          <AuthProvider>
            <JourneyProvider>
              <GlobalAudioPlayerProvider>
                <CommunityProvider>
                  <GuidanceProvider>
                    <VisualThemeProvider>
                      <DailyPracticeProvider>
                        <ModalProvider>
                          <App />
                          <PromptManager />
                          <GuidanceEngine />
                          <SonnerToaster position="top-right" richColors />
                          <Toaster />
                        </ModalProvider>
                      </DailyPracticeProvider>
                    </VisualThemeProvider>
                  </GuidanceProvider>
                </CommunityProvider>
              </GlobalAudioPlayerProvider>
            </JourneyProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default Root;
