
import React from 'react';
import Layout from '@/components/Layout';
import { Star } from 'lucide-react';

const Astrology: React.FC = () => {
  return (
    <Layout pageTitle="Astrology" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="text-yellow-500" />
          Astrology
        </h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Explore the cosmic influences that shape your journey and discover how planetary 
            energies affect your spiritual path and frequency resonance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].map((planet) => (
              <div key={planet} className="bg-indigo-900/40 p-4 rounded-lg text-center">
                <h3 className="text-xl font-semibold">{planet}</h3>
                <p className="text-sm mt-2">Discover your {planet} energy</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Astrology;
