
import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from "sonner";
import App from "../App";
import ThemeEnhancer from '@/components/ThemeEnhancer';
import { AuthProvider } from '@/context/AuthContext';

// Create a React Query client
const queryClient = new QueryClient();

function Root() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <div className="relative min-h-screen w-full sacred-app">
              {/* Fixed background */}
              <div className="fixed inset-0 z-[-2] bg-gradient-to-b from-black to-gray-900/95">
                {/* Stars effect */}
                <div className="stars-bg absolute inset-0 opacity-60"></div>
                
                {/* Glowing radial gradients */}
                <div className="absolute inset-0 opacity-40" style={{
                  background: "radial-gradient(circle at 20% 30%, rgba(155, 135, 245, 0.2) 0%, transparent 70%), radial-gradient(circle at 80% 60%, rgba(98, 147, 232, 0.2) 0%, transparent 70%)",
                }}></div>
              </div>
              
              <App />
              <ThemeEnhancer />
              <Toaster 
                position="top-right" 
                richColors 
                toastOptions={{
                  style: {
                    background: 'rgba(15, 14, 31, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }
                }}
              />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default Root;
