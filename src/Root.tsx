
import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from "sonner";
import App from "./App";
import ThemeEnhancer from '@/components/ThemeEnhancer';
import { AuthProvider } from '@/context/AuthContext';
import { CommunityProvider } from '@/contexts/CommunityContext';

// Create a React Query client
const queryClient = new QueryClient();

function Root() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <CommunityProvider>
              <App />
              <ThemeEnhancer />
              <Toaster position="top-right" richColors />
            </CommunityProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default Root;
