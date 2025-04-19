import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Music, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Welcome to Sacred Shifter
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Transform your consciousness through sacred sound frequencies
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/frequency-library">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Explore Frequencies <Music className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sacred-blueprint">
                <Button size="lg" variant="outline" className="border-purple-400">
                  My Sacred Blueprint <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Discover Your Journey</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="mr-2 h-5 w-5 text-purple-500" />
                    Sound Healing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Experience the transformative power of sacred frequencies calibrated to your unique energetic signature.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/frequency-library" className="text-purple-600 hover:text-purple-800 flex items-center">
                    Explore Frequencies <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-pink-500" />
                    Heart Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Activate your heart intelligence and align with your highest potential through guided practices.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/heart-center" className="text-pink-600 hover:text-pink-800 flex items-center">
                    Open Your Heart <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-amber-500" />
                    Sacred Blueprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Discover your unique energetic signature and the frequencies that resonate with your highest self.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/sacred-blueprint" className="text-amber-600 hover:text-amber-800 flex items-center">
                    View Blueprint <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          {/* Call to Action */}
          {!user && (
            <section className="py-12 text-center">
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Begin Your Sacred Journey</h2>
                <p className="mb-6">Create an account to unlock personalized frequencies and track your progress.</p>
                <Link to="/auth?signup=true">
                  <Button size="lg">
                    Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
