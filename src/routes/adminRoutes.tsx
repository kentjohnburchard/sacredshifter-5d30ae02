
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminConsole from '@/pages/admin/AdminConsole';
import JourneysManager from '@/pages/admin/JourneysManager';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';
import JourneyAudioMappingsViewer from '@/pages/admin/JourneyAudioMappingsViewer';
import JourneyTemplatesAdmin from '@/pages/JourneyTemplatesAdmin';
import JourneyContentAdmin from '@/pages/JourneyContentAdmin';
import AdminPagesCanvas from '@/pages/admin/AdminPagesCanvas';
import SacredSpectrumAdmin from '@/pages/admin/SacredSpectrumAdmin';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default route redirects to Admin Console */}
      <Route index element={<Navigate to="/admin/console" replace />} />
      
      {/* Admin Console main dashboard */}
      <Route path="console" element={<AdminConsole />} />
      
      {/* Journey management routes */}
      <Route path="journeys" element={<JourneysManager />} />
      
      {/* Audio management routes */}
      <Route path="journey-audio" element={<JourneyAudioAdmin />} />
      <Route path="journey-audio-mappings" element={<JourneyAudioMappingsViewer />} />
      
      {/* Page editor routes */}
      <Route path="pages-canvas" element={<AdminPagesCanvas />} />
      
      {/* Frequency management */}
      <Route path="sacred-spectrum" element={<SacredSpectrumAdmin />} />
      
      {/* Catch-all redirects to main admin console */}
      <Route path="*" element={<Navigate to="/admin/console" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
