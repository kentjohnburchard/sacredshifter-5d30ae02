
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Users, Package, File, Activity, Settings, Shield, Sparkles } from 'lucide-react';
import AdminNavigation from '@/components/admin/AdminNavigation';
import GuidanceRulesAdmin from '@/components/admin/GuidanceRulesAdmin';

const AdminDashboard: React.FC = () => {
  return (
    <PageLayout title="Admin Dashboard">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Sacred Shifter Admin Console
          </span>
        </h1>
        <p className="text-muted-foreground text-center md:text-left mb-6">
          Manage your application's content, components, and settings
        </p>
        
        <AdminNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5 text-blue-500" />
                Pages
              </CardTitle>
              <CardDescription>Manage site pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-2xl font-bold">
                <span>28</span>
                <span className="text-sm text-muted-foreground">5 drafts</span>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Last updated 2 hours ago
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Components
              </CardTitle>
              <CardDescription>UI building blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-2xl font-bold">
                <span>56</span>
                <span className="text-sm text-muted-foreground">12 custom</span>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              3 new components added
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Users
              </CardTitle>
              <CardDescription>User management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-2xl font-bold">
                <span>1,253</span>
                <span className="text-sm text-muted-foreground">64 active now</span>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              128 new users this month
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="activity" className="mt-6">
          <TabsList>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
            <TabsTrigger value="guidance">Guidance Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Page Updated</p>
                      <p className="text-sm text-muted-foreground">Home page content was modified</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">2 hours ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <Package className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Component Created</p>
                      <p className="text-sm text-muted-foreground">New ChakraDisplay component added</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">Yesterday</div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Security Update</p>
                      <p className="text-sm text-muted-foreground">Authentication policies updated</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">3 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system metrics and status</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-500 font-medium">All systems operational</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <span className="text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage</span>
                    <span className="text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Authentication</span>
                    <span className="text-green-500">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-2 border rounded-md">
                    <p className="font-medium">Review content submissions</p>
                    <p className="text-sm text-muted-foreground">3 submissions awaiting review</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <p className="font-medium">Update privacy policy</p>
                    <p className="text-sm text-muted-foreground">Due by next week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* New tab for guidance rules */}
          <TabsContent value="guidance" className="mt-4">
            <GuidanceRulesAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
