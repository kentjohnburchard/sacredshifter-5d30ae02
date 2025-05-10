
import React from 'react';
import Layout from '@/components/Layout';
import CircleFeed from '@/components/community/CircleFeed';
import CircleProfile from '@/components/community/CircleProfile';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const CircleHomePage: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Circle | Sacred Shifter" showNavbar={true} showGlobalWatermark={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-glow-purple mb-3">Sacred Circle</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join our conscious community on the path of awakening. Share insights, connect with fellow seekers, and grow together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile */}
              <CircleProfile />
              
              <Card className="ethereal-card">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-glow-purple">Sacred Circles</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Meditation', 'Frequency Healing', 'Sacred Geometry', 'Hermetic Wisdom', 'Conscious Living'].map((circle, i) => (
                      <div key={i} className="p-3 hover:bg-white/5 rounded-md cursor-pointer transition">
                        <p className="font-medium">{circle}</p>
                      </div>
                    ))}
                    <div className="pt-2 mt-3 border-t border-white/10">
                      <button className="w-full btn-primary standard-mode">
                        Explore All Circles
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ethereal-card">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-glow-purple">Sacred Badges</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4">
                    Earn badges on your spiritual journey by participating in our community
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Meditation Guide', 'Frequency Master', 'Sacred Geometer', 'Community Sage', 'Light Bearer', 'Cosmic Explorer'].map((badge, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-md border border-purple-500/20 flex items-center justify-center p-2 text-center"
                      >
                        <div>
                          <div className="w-8 h-8 bg-purple-700/30 rounded-full mx-auto mb-1 flex items-center justify-center">
                            {i + 1}
                          </div>
                          <p className="text-xs">{badge}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <CircleFeed />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CircleHomePage;
