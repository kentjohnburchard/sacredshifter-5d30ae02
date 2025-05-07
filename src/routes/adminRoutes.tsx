
// =================================================
// ROUTING LOCK - IMPORTANT!
// =================================================
// This file is under strict change control.
// Do not add, remove, or modify routes unless explicitly instructed.
// No AI inference or route regeneration is permitted.
// Routes must pass QA checklist before being uncommented.
// =================================================

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';

// QA Checklist for routes:
// 1. Component exists
// 2. Types are imported and compatible
// 3. Props validated
// 4. No console errors
// 5. Passes at least basic visual/manual test

const AdminPlaceholder = () => {
  return (
    <PageLayout title="Admin Area">
      <div className="container mx-auto py-8 px-4">
        <div className="p-8 bg-slate-800 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Routes Deactivated</h1>
          <p className="mb-4">Admin routes are being rebuilt methodically after QA validation.</p>
          <p>Please check back later or contact the development team.</p>
        </div>
      </div>
    </PageLayout>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default admin placeholder route */}
      <Route index element={<AdminPlaceholder />} qa-status="initial" />
      
      {/* Redirect all other admin routes to the placeholder */}
      <Route path="*" element={<Navigate to="/admin" replace />} qa-status="initial" />
    </Routes>
  );
};

export default AdminRoutes;
