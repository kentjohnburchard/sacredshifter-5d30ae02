
import React from "react";
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './lib/queryClient';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import { GlobalAudioPlayerProvider } from './context/GlobalAudioPlayerContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { GuidanceProvider } from './context/GuidanceContext';
import { DailyPracticeProvider } from './context/DailyPracticeContext';
import { ModalProvider } from './context/ModalContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import ScrollToTop from "./components/ScrollToTop";
import App from "./App";

// Create a client instance outside component for persistence
const queryClient = createQueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="sacred-theme">
        <BrowserRouter>
          <AuthProvider>
            <JourneyProvider>
              <GlobalAudioPlayerProvider>
                <CommunityProvider>
                  <GuidanceProvider>
                    <DailyPracticeProvider>
                      <ModalProvider>
                        <ScrollToTop />
                        <App />
                        <SonnerToaster position="top-right" richColors />
                        <Toaster />
                      </ModalProvider>
                    </DailyPracticeProvider>
                  </GuidanceProvider>
                </CommunityProvider>
              </GlobalAudioPlayerProvider>
            </JourneyProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Root;
