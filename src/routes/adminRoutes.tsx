
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
import VisualizerAdmin from '@/pages/admin/VisualizerAdmin';
import ComponentExplorer from '@/pages/admin/ComponentExplorer';
import DatabaseBrowser from '@/pages/admin/DatabaseBrowser';
import AdminSettings from '@/pages/admin/AdminSettings';
import UserManager from '@/pages/admin/UserManager';
import ContentScheduler from '@/pages/admin/ContentScheduler';
import MediaLibrary from '@/pages/admin/MediaLibrary';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default route redirects to Admin Console */}
      <Route index element={<Navigate to="/admin/console" replace />} />
      
      {/* Admin Console main dashboard */}
      <Route path="console" element={<AdminConsole />} />
      
      {/* Journey & Content management routes */}
      <Route path="journeys" element={<JourneysManager />} />
      <Route path="content-scheduler" element={<ContentScheduler />} />
      <Route path="media-library" element={<MediaLibrary />} />
      
      {/* Component & Page Management */}
      <Route path="components" element={<ComponentExplorer />} />
      <Route path="pages-canvas" element={<AdminPagesCanvas />} />
      
      {/* Audio management routes */}
      <Route path="journey-audio" element={<JourneyAudioAdmin />} />
      <Route path="journey-audio-mappings" element={<JourneyAudioMappingsViewer />} />
      
      {/* Visualization management */}
      <Route path="visualizer" element={<VisualizerAdmin />} />
      
      {/* Database & System Tools */}
      <Route path="database" element={<DatabaseBrowser />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="users" element={<UserManager />} />
      
      {/* Frequency management */}
      <Route path="sacred-spectrum" element={<SacredSpectrumAdmin />} />
      
      {/* Catch-all redirects to main admin console */}
      <Route path="*" element={<Navigate to="/admin/console" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
