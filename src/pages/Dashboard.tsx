import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Music, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                Sacred Blueprint
              </CardTitle>
              <CardDescription>Discover your unique energetic signature</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Explore your personal frequency patterns and sacred geometry.</p>
              <Link to="/sacred-blueprint">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  View Blueprint
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-900 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-pink-500" />
                Heart Center
              </CardTitle>
              <CardDescription>Connect with your heart intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Access heart-centered meditations and coherence practices.</p>
              <Link to="/heart-center">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                  Open Heart Center
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Music className="h-5 w-5 mr-2 text-blue-500" />
                Frequency Library
              </CardTitle>
              <CardDescription>Explore healing sound frequencies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Browse our collection of sacred frequencies and sound healing.</p>
              <Link to="/frequency-library">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Browse Frequencies
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="featured" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">432 Hz Healing</CardTitle>
                  <CardDescription>Universal healing frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Experience the natural frequency of the universe.</p>
                  <Button variant="outline" className="mt-4 w-full">Listen Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heart Coherence</CardTitle>
                  <CardDescription>Guided meditation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Align your heart and mind for optimal wellbeing.</p>
                  <Button variant="outline" className="mt-4 w-full">Begin Practice</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chakra Alignment</CardTitle>
                  <CardDescription>Energy balancing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Harmonize your energy centers with sacred tones.</p>
                  <Button variant="outline" className="mt-4 w-full">Start Journey</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Theta Waves</CardTitle>
                  <CardDescription>Deep meditation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Access deep meditative states with theta brainwave entrainment.</p>
                  <Button variant="outline" className="mt-4 w-full">Listen Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Solfeggio 528 Hz</CardTitle>
                  <CardDescription>DNA repair frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Known as the "miracle tone" for cellular healing.</p>
                  <Button variant="outline" className="mt-4 w-full">Experience</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schumann Resonance</CardTitle>
                  <CardDescription>Earth's heartbeat</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Tune into the natural frequency of our planet.</p>
                  <Button variant="outline" className="mt-4 w-full">Connect</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liftTheVeil ? (
                <>
                  <Card className="border-pink-300 dark:border-pink-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Star className="h-4 w-4 mr-2 text-pink-500" />
                        Higher Consciousness
                      </CardTitle>
                      <CardDescription>Ascension frequency</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Access higher dimensions of consciousness.</p>
                      <Button variant="outline" className="mt-4 w-full border-pink-300 text-pink-600">Ascend</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-pink-300 dark:border-pink-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-pink-500" />
                        Kundalini Activation
                      </CardTitle>
                      <CardDescription>Energy awakening</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Awaken your dormant spiritual energy.</p>
                      <Button variant="outline" className="mt-4 w-full border-pink-300 text-pink-600">Activate</Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stress Relief</CardTitle>
                      <CardDescription>Alpha waves</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Calm your mind and reduce stress with alpha frequencies.</p>
                      <Button variant="outline" className="mt-4 w-full">Relax Now</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sleep Well</CardTitle>
                      <CardDescription>Delta waves</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Improve your sleep quality with delta brainwave entrainment.</p>
                      <Button variant="outline" className="mt-4 w-full">Sleep Better</Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Focus & Clarity</CardTitle>
                  <CardDescription>Beta waves</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Enhance mental clarity and focus with beta frequencies.</p>
                  <Button variant="outline" className="mt-4 w-full">Sharpen Mind</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {user ? (
          <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle>Welcome back, {user.email?.split('@')[0]}</CardTitle>
              <CardDescription>Continue your sacred journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Your personal frequency journey awaits. Continue where you left off or explore new healing sounds.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Resume Last Session</Button>
                <Button variant="outline">View History</Button>
                <Button variant="outline">Favorites</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>Unlock the full Sacred Shifter experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Sign up to save your favorite frequencies, track your progress, and access premium content.</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/auth">
                  <Button>Sign Up Now</Button>
                </Link>
                <Link to="/auth?login=true">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
