
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "sonner";
import { EasterEggProvider } from './context/EasterEggContext';
import ThemeEnhancer from './components/ThemeEnhancer';
import ConsciousnessToggle from './components/ConsciousnessToggle';

// Add console log for debugging
console.log("Starting Sacred Shifter application");

// Create root element and render application
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <EasterEggProvider>
        <ThemeEnhancer />
        <ConsciousnessToggle />
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            duration: 3000,
            style: { 
              background: 'rgba(30, 20, 60, 0.9)', 
              color: 'white',
            }
          }} 
        />
        <App />
      </EasterEggProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

console.log("Application rendering complete");
