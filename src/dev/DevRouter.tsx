
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages needed for dev testing
import HomePage from '../pages/HomePage';
import FrequencyEnginePage from '../pages/FrequencyEnginePage';
import JourneyPage from '../pages/JourneyPage';
import SacredCirclePage from '../pages/SacredCirclePage';

// Optional playground component
const LovablePlayground: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Lovable Development Playground</h1>
      <p className="mb-4">This is a sandbox environment for component testing.</p>
      <div className="p-6 border border-purple-500/30 rounded-lg bg-black/20 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-2">Testing Area</h2>
        <p>Add components here for isolated testing.</p>
        <div className="mt-4 space-y-2">
          <a href="/dev/sacred-circle" className="text-blue-400 hover:underline block">Test Sacred Circle</a>
          <a href="/dev/frequency-engine" className="text-blue-400 hover:underline block">Test Frequency Engine</a>
          <a href="/dev/home" className="text-blue-400 hover:underline block">Test Home</a>
        </div>
      </div>
    </div>
  );
};

/**
 * DevRouter - Isolated routing layer for development and testing
 * This router uses the same Router instance as the main application
 * and simply adds extra routes for development purposes.
 */
const DevRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/dev/home" element={<HomePage />} />
      <Route path="/dev/frequency-engine" element={<FrequencyEnginePage />} />
      <Route path="/dev/journey/:slug" element={<JourneyPage />} />
      <Route path="/dev/sacred-circle" element={<SacredCirclePage />} />
      <Route path="/dev/sandbox" element={<LovablePlayground />} />
      <Route path="/dev" element={<LovablePlayground />} />
    </Routes>
  );
};

export default DevRouter;
