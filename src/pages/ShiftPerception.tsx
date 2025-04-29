
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuoteSlider from '@/components/shift-perception/QuoteSlider';
import PerceptionChecklist from '@/components/shift-perception/PerceptionChecklist';

const ShiftPerception: React.FC = () => {
  return (
    <Layout pageTitle="Shift Perception | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
            style={{textShadow: '0 2px 10px rgba(100, 72, 253, 0.7)'}}>
          Shift Perception
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Transform how you see reality through conscious awareness practices
        </p>
        
        <div className="space-y-12">
          <Card className="bg-black/80 border-purple-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-purple-200"
                  style={{textShadow: '0 0 10px rgba(139, 92, 246, 0.7)'}}>
                Consciousness Shifting Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteSlider />
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-purple-500/40 backdrop-blur-md p-6 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 text-center text-purple-200"
                  style={{textShadow: '0 0 10px rgba(139, 92, 246, 0.7)'}}>
                Perception Shift Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerceptionChecklist />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
