
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import ComingSoon from './pages/ComingSoon';
import AboutFounder from './pages/AboutFounder';
import JourneyPage from './pages/JourneyPage';

// =================================================
// ROUTING LOCK - IMPORTANT!
// =================================================
// This file is under strict change control.
// Do not add, remove, or modify routes unless explicitly instructed.
// No AI inference or route regeneration is permitted.
// Routes must pass QA checklist before being uncommented.
// =================================================

function App() {
  return (
    <Routes>
      {/* TEMP: ComingSoon placeholder — replace with IntroPage later */}
      <Route 
        path="/" 
        element={<ComingSoon />}
        qa-status="initial" 
      />
      
      {/* About page route */}
      <Route 
        path="/about" 
        element={<AboutFounder />} 
        qa-status="pending" 
      />
      
      {/* Journey page route */}
      <Route 
        path="/journey/:slug" 
        element={<JourneyPage />} 
        qa-status="pending" 
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} qa-status="verified" />
    </Routes>
  );
}

export default App;
