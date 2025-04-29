
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const Alignment: React.FC = () => {
  return (
    <Layout pageTitle="Alignment">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-8 shadow-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white text-contrast-high">Alignment</h1>
          <p className="text-lg text-gray-100">
            Tools and practices to align your physical, emotional, and spiritual bodies.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Alignment;
