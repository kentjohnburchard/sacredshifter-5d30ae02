
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MirrorPortal as MirrorPortalComponent } from '@/components/heart-center/MirrorPortal';

const MirrorPortal: React.FC = () => {
  return (
    <Layout pageTitle="Mirror Portal | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
            style={{textShadow: '0 2px 10px rgba(100, 72, 253, 0.7)'}}>
          Mirror Portal
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Discover your reflection through the sacred mirror of consciousness.
        </p>
        
        <div className="space-y-10">
          <Card className="bg-black/80 border-indigo-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-indigo-200"
                  style={{textShadow: '0 0 10px rgba(100, 72, 253, 0.7)'}}>
                Self-Reflection Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MirrorPortalComponent />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MirrorPortal;
