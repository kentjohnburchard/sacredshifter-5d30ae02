
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import SacredGridBackground from '@/components/visualization/SacredGridBackground';
import { Card, CardContent } from '@/components/ui/card';

const ComingSoon: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced Sacred Grid Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <SacredGridBackground 
          intensity={0.8}
          color={'#9b87f5'}
          pulseSpeed={0.7}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl w-full px-4">
        <Card className="ethereal-card p-8 text-center">
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-glow-purple">
                Sacred Shifter
              </h1>
              <p className="text-xl md:text-2xl text-glow-light">
                Coming Soon
              </p>
              <p className="text-lg text-white/90 mt-4 max-w-lg mx-auto">
                A sacred journey to elevate your consciousness through frequency, geometry and divine wisdom.
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <p className="text-purple-300">Be the first to experience Sacred Shifter</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Join the Waiting List
                </Button>
                
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                  Learn More
                </Button>
              </div>
            </div>
            
            {user && (
              <div className="pt-6 border-t border-purple-500/20 mt-6">
                <p className="text-sm text-purple-300 mb-3">Developer Preview Links</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                  <Link to="/home" className="text-sm py-2 px-3 rounded bg-purple-900/30 hover:bg-purple-900/50 transition">
                    Home Preview
                  </Link>
                  <Link to="/circle" className="text-sm py-2 px-3 rounded bg-purple-900/30 hover:bg-purple-900/50 transition">
                    Sacred Circle
                  </Link>
                  <Link to="/premium" className="text-sm py-2 px-3 rounded bg-purple-900/30 hover:bg-purple-900/50 transition">
                    Ascended Path
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;
