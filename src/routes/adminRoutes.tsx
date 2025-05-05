
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { Shield, Key } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define your admin route guard
const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has admin access
    const checkAdminStatus = () => {
      // In a real implementation, this would check against Supabase or a cookie/localStorage
      const adminStatus = localStorage.getItem('sacredShifterAdminStatus');
      const isAdminUser = adminStatus === 'true';
      
      setIsAdmin(isAdminUser);
      setIsLoading(false);
      
      if (!isAdminUser) {
        // Redirect to admin login page
        navigate('/admin/console', { 
          state: { 
            from: location.pathname,
            requiresAuth: true 
          } 
        });
        
        // Show error message
        if (location.pathname !== '/admin/console') {
          toast.error("Admin access required", {
            description: "You must be logged in as an admin to access this page",
            icon: <Shield className="h-5 w-5 text-red-500" />
          });
        }
      }
    };
    
    checkAdminStatus();
  }, [navigate, location.pathname]);
  
  if (isLoading) {
    // Return loading state
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  // Only render children if user is admin, otherwise the useEffect will have redirected
  return isAdmin ? <>{children}</> : null;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default route redirects to Admin Console */}
      <Route index element={<Navigate to="/admin/console" replace />} />
      
      {/* Admin Console main dashboard - no guard since it handles authentication itself */}
      <Route path="console" element={<AdminConsole />} />
      
      {/* All other admin routes are protected */}
      
      {/* Journey & Content management routes */}
      <Route path="journeys" element={
        <AdminRouteGuard>
          <JourneysManager />
        </AdminRouteGuard>
      } />
      
      <Route path="content-scheduler" element={
        <AdminRouteGuard>
          <ContentScheduler />
        </AdminRouteGuard>
      } />
      
      <Route path="media-library" element={
        <AdminRouteGuard>
          <MediaLibrary />
        </AdminRouteGuard>
      } />
      
      {/* Component & Page Management */}
      <Route path="components" element={
        <AdminRouteGuard>
          <ComponentExplorer />
        </AdminRouteGuard>
      } />
      
      <Route path="pages-canvas" element={
        <AdminRouteGuard>
          <AdminPagesCanvas />
        </AdminRouteGuard>
      } />
      
      {/* Audio management routes */}
      <Route path="journey-audio" element={
        <AdminRouteGuard>
          <JourneyAudioAdmin />
        </AdminRouteGuard>
      } />
      
      <Route path="journey-audio-mappings" element={
        <AdminRouteGuard>
          <JourneyAudioMappingsViewer />
        </AdminRouteGuard>
      } />
      
      {/* Visualization management */}
      <Route path="visualizer" element={
        <AdminRouteGuard>
          <VisualizerAdmin />
        </AdminRouteGuard>
      } />
      
      {/* Database & System Tools */}
      <Route path="database" element={
        <AdminRouteGuard>
          <DatabaseBrowser />
        </AdminRouteGuard>
      } />
      
      <Route path="settings" element={
        <AdminRouteGuard>
          <AdminSettings />
        </AdminRouteGuard>
      } />
      
      <Route path="users" element={
        <AdminRouteGuard>
          <UserManager />
        </AdminRouteGuard>
      } />
      
      {/* Frequency management */}
      <Route path="sacred-spectrum" element={
        <AdminRouteGuard>
          <SacredSpectrumAdmin />
        </AdminRouteGuard>
      } />
      
      {/* Journey Template routes */}
      <Route path="journey-templates" element={
        <AdminRouteGuard>
          <JourneyTemplatesAdmin />
        </AdminRouteGuard>
      } />
      
      <Route path="journey-content" element={
        <AdminRouteGuard>
          <JourneyContentAdmin />
        </AdminRouteGuard>
      } />
      
      {/* Catch-all redirects to main admin console */}
      <Route path="*" element={<Navigate to="/admin/console" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
