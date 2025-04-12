
import React from 'react';
import Layout from '@/components/Layout';

const Frequencies: React.FC = () => {
  return (
    <Layout pageTitle="Frequency Library" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Frequency Library</h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Explore our collection of healing frequencies and sound therapies designed to 
            restore harmony and balance to your energy centers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[432, 528, 639, 741, 852, 963].map((frequency) => (
              <div key={frequency} className="bg-purple-900/40 p-4 rounded-lg text-center">
                <h3 className="text-xl font-semibold">{frequency} Hz</h3>
                <p className="text-sm mt-2">Healing frequency for balance and harmony</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Frequencies;
