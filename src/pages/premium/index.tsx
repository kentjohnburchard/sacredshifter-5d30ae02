
import React from 'react';
import Layout from '@/components/Layout';
import PremiumPortal from '@/components/premium/PremiumPortal';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PremiumHomePage: React.FC = () => {
  return (
    <Layout pageTitle="Ascended Path | Sacred Shifter" showNavbar={true} showGlobalWatermark={true}>
      <PremiumProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 veil-mode">
              <div className="inline-block p-2 rounded-full bg-pink-900/30 text-sm border border-pink-500/20 mb-3">
                Premium Access
              </div>
              <h1 className="text-4xl font-bold text-glow-pink mb-3">The Ascended Path</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Welcome to your premium sacred journey. Experience advanced frequencies, guided meditations, and transformational practices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
              {["Sacred Journeys", "Meditation Library", "Frequency Templates", "Blueprint Builder"].map((feature, i) => (
                <Card key={i} className="ethereal-card veil-mode text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-pink-900/40 flex items-center justify-center mx-auto mb-3">
                    <span className="text-glow-pink">{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-medium text-glow-pink mb-2">{feature}</h3>
                  <p className="text-sm text-gray-300">Unlock your consciousness with premium tools and guidance.</p>
                </CardContent>
              </Card>
            ))}
            
            <div className="mb-12">
              <Card className="ethereal-card veil-mode overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-glow-pink mb-4">This Week's Featured Experience</h2>
                    <h3 className="text-xl mb-2">Sacred Cosmic Portal Activation</h3>
                    <p className="text-gray-300 mb-4">
                      Access higher dimensions of consciousness with this guided journey that combines ancient wisdom with quantum frequencies.
                    </p>
                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                      Begin Featured Journey
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 flex items-center justify-center p-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-pink-500/30">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/40 to-purple-500/40 flex items-center justify-center border border-pink-500/40">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/60 to-purple-500/60 flex items-center justify-center">
                          <span className="text-glow-pink">✧</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold text-glow-pink mb-6 text-center">Sacred Experiences</h2>
            <PremiumPortal />
          </div>
        </div>
      </PremiumProvider>
    </Layout>
  );
};

export default PremiumHomePage;
