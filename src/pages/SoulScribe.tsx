
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComingSoon } from '@/components/ComingSoon';

const SoulScribe: React.FC = () => {
  return (
    <Layout pageTitle="Soul Scribe™ | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-300"
            style={{textShadow: '0 2px 10px rgba(20, 184, 166, 0.7)'}}>
          Soul Scribe™
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Record the journey of your soul through guided self-reflection and conscious writing.
        </p>
        
        <div className="space-y-10">
          <Card className="bg-black/80 border-teal-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-teal-200"
                  style={{textShadow: '0 0 10px rgba(20, 184, 166, 0.7)'}}>
                Soul Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComingSoon 
                title="Soul Scribe™ Coming Soon"
                description="Your sacred journal awaits as we complete the cosmic encoding process."
                expectedDate="Summer 2025"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SoulScribe;
