
import React from 'react';
import Layout from '@/components/Layout';

const HermeticPrinciples: React.FC = () => {
  return (
    <Layout pageTitle="Hermetic Principles">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Hermetic Principles</h1>
        <p className="mb-6">
          The seven Hermetic principles from the Kybalion that form the foundation of Hermetic philosophy.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Mentalism", description: "The All is Mind; The Universe is Mental." },
            { name: "Correspondence", description: "As above, so below; as below, so above." },
            { name: "Vibration", description: "Nothing rests; everything moves; everything vibrates." },
            { name: "Polarity", description: "Everything is dual; everything has poles; everything has its pair of opposites." },
            { name: "Rhythm", description: "Everything flows, out and in; everything has its tides; all things rise and fall." },
            { name: "Cause & Effect", description: "Every cause has its effect; every effect has its cause." },
            { name: "Gender", description: "Gender is in everything; everything has its masculine and feminine principles." },
          ].map((principle, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow border border-purple-100">
              <h3 className="text-xl font-bold text-purple-800 mb-2">{principle.name}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HermeticPrinciples;
