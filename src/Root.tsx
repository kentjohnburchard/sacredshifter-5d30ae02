
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from "sonner";
import App from "./App";

// Create a React Query client
const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="sacred-theme">
          <App />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default Root;
