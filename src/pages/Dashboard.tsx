
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import UserDashboard from '@/components/UserDashboard';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log("Dashboard page mounting:", {
      authenticated: !!user,
      loading,
      email: user?.email
    });

    // Show welcome message when user is authenticated
    if (user && !loading) {
      toast.success(`Welcome back, ${user.email?.split('@')[0] || 'Sacred Shifter'}!`, {
        id: 'dashboard-welcome', // Prevent duplicate toasts
        duration: 3000
      });
    }
  }, [user, loading]);

  return (
    <Layout 
      pageTitle="Dashboard | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mr-3"></div>
              <div className="text-purple-700">Loading your dashboard...</div>
            </div>
          ) : user ? (
            <UserDashboard />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
              <p className="text-gray-600">
                Your personal journey dashboard will appear here once you're signed in.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
