
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Placeholder from '@/pages/Placeholder';

// Simple admin routes - all placeholder for now as requested to simplify
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Admin Dashboard" />} />
      <Route path="/journeys" element={<Placeholder name="Admin Journeys" />} />
      <Route path="/users" element={<Placeholder name="Admin Users" />} />
      <Route path="/settings" element={<Placeholder name="Admin Settings" />} />
      <Route path="*" element={<Placeholder name="Admin Not Found" />} />
    </Routes>
  );
};

export default AdminRoutes;
