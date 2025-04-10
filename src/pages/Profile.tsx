
import React from "react";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CosmicContainer } from "@/components/sacred-geometry";

const Profile = () => {
  return (
    <Layout pageTitle="Your Profile" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3">
            <CosmicContainer className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-purple-800 text-white text-xl">
                    US
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-medium mb-1">User Name</h2>
                <p className="text-sm text-gray-400 mb-4">user@example.com</p>
                
                <Button variant="outline" className="mb-6 w-full">Edit Profile</Button>
                
                <div className="grid grid-cols-2 gap-4 w-full text-center">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Plan</div>
                    <div className="font-medium">Free</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Joined</div>
                    <div className="font-medium">Apr 2024</div>
                  </div>
                </div>
              </div>
            </CosmicContainer>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card className="bg-black/40 border-purple-900/50 text-white">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Email</label>
                      <Input defaultValue="user@example.com" className="bg-black/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Display Name</label>
                      <Input defaultValue="User Name" className="bg-black/30" />
                    </div>
                    <div className="pt-4">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card className="bg-black/40 border-purple-900/50 text-white">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription className="text-gray-400">
                      Customize your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">Preference settings will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscription">
                <Card className="bg-black/40 border-purple-900/50 text-white">
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-900/20 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">Current Plan</h3>
                          <p className="text-sm text-gray-400">Free Access</p>
                        </div>
                        <Button variant="outline" className="h-8">Upgrade</Button>
                      </div>
                    </div>
                    
                    <Button variant="default" className="w-full">View Subscription Options</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
