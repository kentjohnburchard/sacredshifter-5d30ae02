
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
            <div className="relative min-h-screen w-full">
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

// Add global CSS for stars background
const styleElement = document.createElement("style");
styleElement.textContent = `
  .stars-bg {
    background-image: radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                      radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                      radial-gradient(2px 2px at 60px 110px, #ffffff, rgba(0,0,0,0)),
                      radial-gradient(2px 2px at 80px 150px, #ffffff, rgba(0,0,0,0));
    background-size: 200px 200px;
    animation: stars-move 100s linear infinite;
  }
  
  @keyframes stars-move {
    0% { background-position: 0 0; }
    100% { background-position: 200px 200px; }
  }
`;
document.head.appendChild(styleElement);

export default Root;
