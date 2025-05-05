
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminConsole from '@/pages/admin/AdminConsole';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';
import JourneyAudioMappingsViewer from '@/pages/admin/JourneyAudioMappingsViewer';
import JourneysManager from '@/pages/admin/JourneysManager';
import VisualizerAdmin from '@/pages/admin/VisualizerAdmin';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminConsole />} />
      <Route path="journey-audio" element={<JourneyAudioAdmin />} />
      <Route path="journey-audio-mappings" element={<JourneyAudioAdmin />} />
      <Route path="journeys" element={<JourneysManager />} />
      <Route path="visualizer" element={<VisualizerAdmin />} />
    </Routes>
  );
};

export default AdminRoutes;
