
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Placeholder from '@/pages/Placeholder';

// Simple admin routes - all placeholder for now as requested to simplify
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Placeholder />} />
      <Route path="/journeys" element={<Placeholder />} />
      <Route path="/users" element={<Placeholder />} />
      <Route path="/settings" element={<Placeholder />} />
      <Route path="*" element={<Placeholder />} />
    </Routes>
  );
};

export default AdminRoutes;
