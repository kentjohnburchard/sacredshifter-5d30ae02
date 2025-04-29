
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import BlueprintChart from '@/components/sacred-blueprint/BlueprintChart';
import BlueprintDisplay from '@/components/sacred-blueprint/BlueprintDisplay';
import BlueprintQuiz from '@/components/sacred-blueprint/BlueprintQuiz';
import SacredBlueprintCreator from '@/components/sacred-blueprint/SacredBlueprintCreator';

const SacredBlueprint: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" hideHeader={true}>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/40 backdrop-blur-md border-purple-500/20 mb-12">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Sacred Blueprint™</h1>
            <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
              Discover your unique energetic blueprint and spiritual path.
            </p>
          </div>
        </Card>
        
        <div className="space-y-16">
          <section className="py-8">
            <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 text-center">Create Your Blueprint</h2>
              <SacredBlueprintCreator />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 text-center">Blueprint Assessment</h2>
              <BlueprintQuiz />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 text-center">Blueprint Visualization</h2>
              <BlueprintChart />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 text-center">Your Blueprint Results</h2>
              <BlueprintDisplay />
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
