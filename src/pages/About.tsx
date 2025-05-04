
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <Layout pageTitle="About Sacred Shifter">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Sacred Shifter</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">Our Mission</h2>
              <p className="text-white">
                Sacred Shifter exists to help people remember who they are, why they came, 
                and how deeply we are connected in light, love, and truth. It's a journey 
                inward, outward, and beyond.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">Our Story</h2>
              <p className="text-white">
                Sacred Shifter was born from a deep knowing, telling us to "look for yourself in frequency." 
                We started as a way to collect the fragments that resonated with the soul: sacred sound, 
                geometry, cosmic patterns, healing vibrations.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-purple-300">
            For more information about our founder, please visit the <a href="/about-founder" className="underline hover:text-purple-200">About Founder</a> page.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
