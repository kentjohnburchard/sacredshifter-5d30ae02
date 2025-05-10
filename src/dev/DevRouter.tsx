
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages needed for dev testing
import HomePage from '../pages/HomePage';
import FrequencyEnginePage from '../pages/FrequencyEnginePage';
import JourneyPage from '../pages/JourneyPage';

// Optional playground component
const LovablePlayground: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Lovable Development Playground</h1>
      <p className="mb-4">This is a sandbox environment for component testing.</p>
      <div className="p-6 border border-purple-500/30 rounded-lg bg-black/20 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-2">Testing Area</h2>
        <p>Add components here for isolated testing.</p>
      </div>
    </div>
  );
};

/**
 * DevRouter - Isolated routing layer for development and testing
 * This router is completely separate from the main application routing
 * and can be mounted independently for testing purposes.
 */
const DevRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dev/home" element={<HomePage />} />
        <Route path="/dev/frequency-engine" element={<FrequencyEnginePage />} />
        <Route path="/dev/journey/:slug" element={<JourneyPage />} />
        <Route path="/dev/sandbox" element={<LovablePlayground />} />
      </Routes>
    </BrowserRouter>
  );
};

export default DevRouter;
