
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

const SacredBlueprint: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" hideHeader={true}>
      <div className="container mx-auto p-4">
        <Card className="bg-black/40 backdrop-blur-md border-purple-500/20">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Sacred Blueprint™</h1>
            <p className="text-lg text-gray-300">
              Discover your unique energetic blueprint and spiritual path.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
