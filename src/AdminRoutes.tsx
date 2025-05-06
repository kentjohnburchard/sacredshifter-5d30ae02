
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ComponentExplorer from '@/pages/admin/ComponentExplorer';
import PagesManager from '@/pages/admin/PagesManager';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/components" element={<ComponentExplorer />} />
      <Route path="/pages" element={<PagesManager />} />
      {/* Add more admin routes as needed */}
    </Routes>
  );
};

export default AdminRoutes;
