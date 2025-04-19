
import React from 'react';
import Layout from '@/components/Layout';

const Astrology: React.FC = () => {
  return (
    <Layout pageTitle="Astrology">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Astrology</h1>
        <p className="text-lg text-gray-700">
          Explore how cosmic energies influence your personal frequency.
        </p>
      </div>
    </Layout>
  );
};

export default Astrology;
