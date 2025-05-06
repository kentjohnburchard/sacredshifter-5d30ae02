
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminConsole from '@/pages/admin/AdminConsole';
import AdminInsightsDashboard from '@/pages/admin/AdminInsightsDashboard';
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
      {/* Default route redirects to the consolidated admin dashboard */}
      <Route index element={<Navigate to="/admin/insights" replace />} />
      
      {/* Admin Console main dashboard - no guard since it handles authentication itself */}
      <Route path="console" element={<AdminConsole />} />
      
      {/* New consolidated admin insights dashboard */}
      <Route path="insights" element={
        <AdminRouteGuard>
          <AdminInsightsDashboard />
        </AdminRouteGuard>
      } />
      
      {/* Legacy routes - all redirect to insights dashboard */}
      <Route path="journeys" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="content-scheduler" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="media-library" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="components" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="pages-canvas" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="journey-audio" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="journey-audio-mappings" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="visualizer" element={
        <AdminRouteGuard>
          <VisualizerAdmin />  {/* Keep this one for now as it's specialized */}
        </AdminRouteGuard>
      } />
      
      <Route path="database" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="settings" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="users" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="sacred-spectrum" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="journey-templates" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      <Route path="journey-content" element={
        <Navigate to="/admin/insights" replace />
      } />
      
      {/* Catch-all redirects to main admin insights dashboard */}
      <Route path="*" element={<Navigate to="/admin/insights" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
