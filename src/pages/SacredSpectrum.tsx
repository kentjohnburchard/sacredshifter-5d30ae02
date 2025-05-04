
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SacredSpectrum: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Spectrum">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm border border-purple-200/30 dark:border-purple-900/30 bg-white/80 dark:bg-black/60">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                Sacred Spectrum
              </CardTitle>
              <CardDescription className="text-center">
                Explore the vibrational knowledge of the universe
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-purple dark:prose-invert max-w-none">
                <p className="text-center">
                  The Sacred Spectrum provides access to in-depth research and resources about frequency, vibration, and their effects on consciousness.
                </p>
                <p className="text-center mt-4">
                  Content for this section is currently being developed. Check back soon for a wealth of vibrational knowledge.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SacredSpectrum;
