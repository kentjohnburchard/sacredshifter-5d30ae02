
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComingSoon } from '@/components/ComingSoon';

const DeityOracle: React.FC = () => {
  return (
    <Layout pageTitle="Deity Oracle™ | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300"
            style={{textShadow: '0 2px 10px rgba(251, 191, 36, 0.7)'}}>
          Deity Oracle™
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Connect with divine guidance across traditions and mythologies.
        </p>
        
        <div className="space-y-10">
          <Card className="bg-black/80 border-amber-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-amber-200"
                  style={{textShadow: '0 0 10px rgba(251, 191, 36, 0.7)'}}>
                Divine Connection Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComingSoon 
                title="Deity Oracle™ Coming Soon"
                description="The divine beings are coalescing as we prepare this sacred guidance tool."
                expectedDate="Winter 2025"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DeityOracle;
