
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hermeticPrinciples } from '@/data/hermeticPrinciples';
import { Sparkles } from 'lucide-react';

interface HermeticPrinciple {
  id: string;
  name: string;
  description: string;
  application: string;
}

const HermeticPrinciples: React.FC = () => {
  // Convert the record to an array for mapping
  const principlesArray: HermeticPrinciple[] = 
    Array.isArray(hermeticPrinciples) 
      ? hermeticPrinciples 
      : Object.entries(hermeticPrinciples).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));

  return (
    <Layout pageTitle="Hermetic Principles | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300"
            style={{textShadow: '0 2px 10px rgba(251, 191, 36, 0.7)'}}>
          Hermetic Principles
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Ancient wisdom of Hermes Trismegistus - "As above, so below"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principlesArray.map((principle) => (
            <Card key={principle.id} className="bg-black/80 border-amber-500/40 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-950/50 to-yellow-950/50 p-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-200">{principle.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-gray-200 mb-4">{principle.description}</p>
                <div className="border-t border-amber-700/30 pt-3 mt-3">
                  <h4 className="text-amber-300 text-sm font-medium mb-2">Application:</h4>
                  <p className="text-gray-300 text-sm">{principle.application}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HermeticPrinciples;
