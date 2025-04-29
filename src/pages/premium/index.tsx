
import React from 'react';
import Layout from '@/components/Layout';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

const PremiumHomePage: React.FC = () => {
  const premiumFeatures = [
    "Exclusive Sacred Journeys",
    "Advanced Frequency Healing",
    "Divine Blueprint Access",
    "Soul Awakening Sessions",
    "Higher Consciousness Meditations"
  ];

  return (
    <Layout pageTitle="Ascended Path | Sacred Shifter" showNavbar={true} showGlobalWatermark={true}>
      <PremiumProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-4 text-md">Premium Experience</Badge>
              <h1 className="text-5xl font-bold text-glow-purple mb-4">Ascended Path</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Elevate your consciousness journey with our premium sacred experiences designed to accelerate your spiritual growth
              </p>
            </div>
            
            {/* Featured Experiences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="ethereal-card">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-medium text-glow-pink mb-2">{feature}</h3>
                    <p className="text-sm text-gray-300">Unlock your consciousness with premium tools and guidance.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Upgrade CTA */}
            <div className="text-center mb-16">
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-10 rounded-2xl backdrop-blur-sm border border-purple-500/30">
                <Star className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Transcend Your Consciousness
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  Join the Ascended Path and access premium sacred journeys, frequency healings, and divine connections.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 py-6 text-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-glow-purple mb-8">
                Ascended Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Ethan Light",
                    quote: "The premium meditations have completely transformed my relationship with consciousness. I've experienced depths I didn't know existed.",
                  },
                  {
                    name: "Sophia Moon",
                    quote: "The frequency healing journeys on the Ascended Path helped me release energetic blockages I'd carried for decades. Life-changing!",
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="ethereal-card p-6">
                    <CardContent className="p-0">
                      <p className="italic text-gray-200 mb-4">"{testimonial.quote}"</p>
                      <p className="font-medium text-purple-300">— {testimonial.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PremiumProvider>
    </Layout>
  );
};

export default PremiumHomePage;
