
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from "sonner";
import App from "./App";
import ThemeEnhancer from '@/components/ThemeEnhancer';
import { AuthProvider } from '@/context/AuthContext';

// Create a React Query client
const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
            <ThemeEnhancer />
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default Root;
