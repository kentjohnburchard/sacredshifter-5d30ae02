
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Timeline from '@/pages/Timeline';
import Settings from '@/pages/Settings';
import Subscription from '@/pages/Subscription';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import SacredCircle from '@/pages/SacredCircle';

// Premium routes
import PremiumHomePage from '@/pages/premium/index';
import ValePage from '@/pages/premium/Vale';

// Auth
import AuthPage from '@/pages/Auth';

// Add other imports as needed

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/timeline" element={
        <ProtectedRoute>
          <Timeline />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } />
      <Route path="/community" element={
        <ProtectedRoute>
          <SacredCircle />
        </ProtectedRoute>
      } />
      
      {/* Premium routes */}
      <Route path="/premium" element={
        <ProtectedRoute>
          <PremiumHomePage />
        </ProtectedRoute>
      } />
      <Route path="/premium/vale" element={
        <ProtectedRoute>
          <ValePage />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
