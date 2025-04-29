
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const Focus: React.FC = () => {
  return (
    <Layout pageTitle="Focus">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-8 shadow-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white text-contrast-high">Focus</h1>
          <p className="text-lg text-gray-100">
            Enhance your concentration and mental clarity with frequency-based tools.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Focus;
