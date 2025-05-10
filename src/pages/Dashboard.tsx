
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Crown, Star, Activity, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  
  // Pass-through for ProtectedRoute
  if (!user || loading) return null;
  
  return (
    <AppShell pageTitle="Dashboard | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Sacred Dashboard</h1>
            <p className="text-gray-300 mb-4">
              Welcome back, {profile?.display_name || user.email?.split('@')[0]}
            </p>
            
            {/* User Status Information */}
            <div className="flex flex-wrap gap-3">
              {profile?.is_premium && (
                <Badge variant="outline" className="bg-amber-600/20 text-amber-300 border-amber-500/30 flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium Member
                </Badge>
              )}
              {profile?.role === 'admin' && (
                <Badge variant="outline" className="bg-red-600/20 text-red-300 border-red-500/30">
                  Admin
                </Badge>
              )}
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          
          <Tabs defaultValue="journey" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="journey">Your Journey</TabsTrigger>
              <TabsTrigger value="frequencies">Frequencies</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {profile?.is_premium && <TabsTrigger value="premium">Premium</TabsTrigger>}
              {profile?.role === 'admin' && <TabsTrigger value="admin">Admin</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="journey">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-100">
                      <Activity className="h-5 w-5 mr-2 text-purple-400" />
                      Recent Journeys
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-300 text-sm">
                        You haven't completed any journeys yet.
                      </p>
                      <Link to="/journeys">
                        <Button variant="outline" className="w-full mt-2 border-purple-500/30 text-purple-200 hover:bg-purple-900/20">
                          Explore Journeys
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-100">
                      <Star className="h-5 w-5 mr-2 text-purple-400" />
                      Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-gray-300">
                      <div className="p-3 rounded bg-black/40 hover:bg-black/60 transition-colors cursor-pointer">
                        <p className="font-medium">Heart Center Journey</p>
                        <p className="text-sm text-gray-400">Activate your heart chakra</p>
                      </div>
                      <div className="p-3 rounded bg-black/40 hover:bg-black/60 transition-colors cursor-pointer">
                        <p className="font-medium">Frequency Healing</p>
                        <p className="text-sm text-gray-400">417 Hz Undoing Situations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-100">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" />
                      Daily Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-300 text-sm">
                        Set up your daily practice to build consistency in your spiritual journey.
                      </p>
                      <Link to="/daily-practice">
                        <Button variant="outline" className="w-full mt-2 border-purple-500/30 text-purple-200 hover:bg-purple-900/20">
                          Configure Practice
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="frequencies">
              <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Frequency Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Explore sacred frequencies for meditation, healing, and spiritual growth.
                    </p>
                    <Link to="/frequency">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        Open Frequency Library
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                      <p className="text-gray-200">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Display Name</h3>
                      <p className="text-gray-200">{profile?.display_name || "(Not set)"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Full Name</h3>
                      <p className="text-gray-200">{profile?.full_name || "(Not set)"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Membership</h3>
                      <p className="text-gray-200">
                        {profile?.is_premium ? (
                          <span className="text-amber-300">Premium</span>
                        ) : (
                          <span>Free</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link to="/profile">
                      <Button variant="outline">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {profile?.is_premium && (
              <TabsContent value="premium">
                <Card className="backdrop-blur-sm bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-100">
                      <Crown className="h-5 w-5 mr-2 text-amber-400" />
                      Premium Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Thank you for being a premium member! You have access to all premium features.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-black/40 border border-amber-500/20">
                          <h3 className="font-medium text-amber-300 mb-1">Advanced Journeys</h3>
                          <p className="text-sm text-gray-300">Access all premium spiritual journeys</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-amber-500/20">
                          <h3 className="font-medium text-amber-300 mb-1">Sacred Blueprint</h3>
                          <p className="text-sm text-gray-300">Access your personal frequency profile</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-amber-500/20">
                          <h3 className="font-medium text-amber-300 mb-1">Trinity Gateway</h3>
                          <p className="text-sm text-gray-300">Deep spiritual transformation tools</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {profile?.role === 'admin' && (
              <TabsContent value="admin">
                <Card className="backdrop-blur-sm bg-black/40 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-red-100">Admin Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        You have administrator access to Sacred Shifter.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-900/20">
                          Manage Users
                        </Button>
                        <Button variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-900/20">
                          Manage Content
                        </Button>
                        <Button variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-900/20">
                          View Analytics
                        </Button>
                        <Button variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-900/20">
                          System Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
