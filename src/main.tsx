
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

// Check if there's a saved theme preference
try {
  const savedTheme = localStorage.getItem('liftTheVeil');
  console.log("Initial theme from localStorage:", savedTheme);
  if (savedTheme === 'true') {
    // Add the veil-lifted class to document early to prevent flickering
    document.documentElement.classList.add('veil-lifted');
    console.log("Added veil-lifted class on initial load");
  }
} catch (e) {
  console.error("Error checking theme:", e);
}

// Create root element and render application
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <EasterEggProvider>
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
        <ThemeEnhancer />
        <ConsciousnessToggle />
        <App />
      </EasterEggProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Add extra debugging help
console.log("Application rendering complete");
console.log("TOGGLE DEBUG: To manually toggle consciousness state, run in console: localStorage.setItem('liftTheVeil', 'true') or localStorage.setItem('liftTheVeil', 'false')");
