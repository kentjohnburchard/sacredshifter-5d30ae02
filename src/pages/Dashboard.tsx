
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import UserDashboard from '@/components/UserDashboard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DailyPracticeAutoLauncher from '@/components/daily-practice/DailyPracticeAutoLauncher';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    console.log("Dashboard page mounting:", {
      authenticated: !!user,
      loading,
      email: user?.email
    });

    // Mark auth as checked after the initial load
    if (!loading) {
      setAuthChecked(true);
    }

    // Show welcome message when user is authenticated and loading is complete
    if (user && !loading) {
      const username = user.email?.split('@')[0] || 'Sacred Shifter';
      toast.success(`Welcome back, ${username}!`, {
        id: 'dashboard-welcome', // Prevent duplicate toasts
        duration: 3000
      });
    }
  }, [user, loading]);

  // If auth is still loading, show loading state
  if (loading) {
    return (
      <Layout pageTitle="Dashboard | Sacred Shifter">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mr-3"></div>
          <div className="text-purple-700">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  // If auth check is done but no user, redirect to auth
  if (!loading && !user) {
    console.log("Dashboard: No user found after auth check, redirecting to /auth");
    navigate('/auth');
    return null;
  }

  return (
    <Layout 
      pageTitle="Dashboard | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {user ? (
            <>
              <UserDashboard />
              <DailyPracticeAutoLauncher />
            </>
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
