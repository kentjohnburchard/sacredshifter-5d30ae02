
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComingSoon } from '@/components/ComingSoon';

const AstralAttunement: React.FC = () => {
  return (
    <Layout pageTitle="Astral Attunement™ | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300"
            style={{textShadow: '0 2px 10px rgba(139, 92, 246, 0.7)'}}>
          Astral Attunement™
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Align with celestial energies and expand your astral awareness.
        </p>
        
        <div className="space-y-10">
          <Card className="bg-black/80 border-violet-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-violet-200"
                  style={{textShadow: '0 0 10px rgba(139, 92, 246, 0.7)'}}>
                Astral Connection Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComingSoon 
                title="Astral Attunement™ Coming Soon"
                description="The stars are aligning to bring you this powerful cosmic connection tool."
                expectedDate="Spring 2026"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AstralAttunement;
