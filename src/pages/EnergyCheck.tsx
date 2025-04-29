
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const EnergyCheck: React.FC = () => {
  return (
    <Layout pageTitle="Energy Check">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-8 shadow-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white text-contrast-high">Energy Check</h1>
          <p className="text-lg text-gray-100">
            Monitor and balance your personal energetic field.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default EnergyCheck;
