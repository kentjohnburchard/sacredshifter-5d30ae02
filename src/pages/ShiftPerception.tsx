
import React from 'react';
import Layout from '@/components/Layout';
import PerceptionChecklist from '@/components/shift-perception/PerceptionChecklist';
import QuoteSlider from '@/components/shift-perception/QuoteSlider';
import { Card } from '@/components/ui/card';

const ShiftPerception: React.FC = () => {
  return (
    <Layout pageTitle="Shift Perception">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white text-contrast-high">Shift Perception</h1>
        <p className="text-lg text-center text-gray-100 mb-12 max-w-3xl mx-auto">
          Tools and practices to expand your consciousness and shift your perception of reality.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="py-8">
            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6 h-full shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-purple-200">Perception Checklist</h2>
              <p className="text-gray-100 mb-6">Track your expanding consciousness with this checklist:</p>
              <PerceptionChecklist />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6 h-full shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-purple-200">Wisdom Quotes</h2>
              <p className="text-gray-100 mb-6">Contemplate these insights to shift your perspective:</p>
              <QuoteSlider />
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
