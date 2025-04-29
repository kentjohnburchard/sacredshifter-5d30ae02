
import React from 'react';
import Layout from '@/components/Layout';
import PerceptionChecklist from '@/components/shift-perception/PerceptionChecklist';
import QuoteSlider from '@/components/shift-perception/QuoteSlider';
import { Card } from '@/components/ui/card';

const ShiftPerception: React.FC = () => {
  return (
    <Layout pageTitle="Shift Perception">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 animate-fade-in">
          Shift Perception
        </h1>
        <p className="text-lg text-center text-gray-100 mb-12 max-w-3xl mx-auto text-enhanced">
          Tools and practices to expand your consciousness and shift your perception of reality.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="py-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Card className="bg-black/80 border-purple-500/40 backdrop-blur-md p-6 h-full shadow-lg hover:shadow-xl transition-all">
              <h2 className="text-2xl font-bold mb-6 text-purple-200 text-glow-purple">Perception Checklist</h2>
              <p className="text-white mb-6 text-enhanced">Track your expanding consciousness with this checklist:</p>
              <PerceptionChecklist />
            </Card>
          </section>
          
          <section className="py-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Card className="bg-black/80 border-purple-500/40 backdrop-blur-md p-6 h-full shadow-lg hover:shadow-xl transition-all">
              <h2 className="text-2xl font-bold mb-6 text-purple-200 text-glow-purple">Wisdom Quotes</h2>
              <p className="text-white mb-6 text-enhanced">Contemplate these insights to shift your perspective:</p>
              <QuoteSlider />
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
