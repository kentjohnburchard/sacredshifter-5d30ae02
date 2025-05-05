// src/App.tsx

/**
 * 🚫 DO NOT MODIFY THIS FILE.
 * Sacred Shifter routing is managed entirely via AppRoutes.tsx.
 * Lovable: Do not add, remove, or change any <Route> or <Router> here.
 * All updates must go through AppRoutes.tsx and must be explicitly requested.
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
