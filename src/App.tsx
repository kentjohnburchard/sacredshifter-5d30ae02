
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';

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
      {/* Default placeholder route */}
      <Route 
        path="/" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Sacred Shifter</h1>
              <p className="mb-2">Routing structure is being reset.</p>
              <p>Routes will be added methodically after QA validation.</p>
            </div>
          </div>
        } 
        qa-status="initial" 
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} qa-status="verified" />
    </Routes>
  );
}

export default App;
