
import React from "react";
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './lib/queryClient';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { GuidanceProvider } from './context/GuidanceContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import PromptManager from "@/components/journey/PromptManager"; 
import GuidanceEngine from "@/components/guidance/GuidanceEngine";
import App from "./App";

// Create a client instance outside component for persistence
const queryClient = createQueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <JourneyProvider>
            <CommunityProvider>
              <GuidanceProvider>
                <App />
                <PromptManager />
                <GuidanceEngine />
                <SonnerToaster position="top-right" richColors />
                <Toaster />
              </GuidanceProvider>
            </CommunityProvider>
          </JourneyProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default Root;
