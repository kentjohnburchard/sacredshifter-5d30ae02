
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JourneyPage from '@/pages/JourneyPage';
import JourneyTemplates from '@/pages/journey-templates';
import JourneyTemplatesAdmin from '@/pages/JourneyTemplatesAdmin';
import JourneySoundscapeAdmin from '@/pages/JourneySoundscapeAdmin'; // Add this line

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect root to journey templates */}
      <Route path="/" element={<JourneyTemplates />} />
      
      {/* Journey routes */}
      <Route path="/journey/:slug" element={<JourneyPage />} />
      <Route path="/journeys" element={<JourneyTemplates />} />
      <Route path="/journey-templates" element={<JourneyTemplates />} />
      
      {/* Admin routes */}
      <Route path="/admin/journeys/templates" element={<JourneyTemplatesAdmin />} />
      <Route path="/admin/journeys/soundscapes" element={<JourneySoundscapeAdmin />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
