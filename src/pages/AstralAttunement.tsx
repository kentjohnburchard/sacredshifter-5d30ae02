
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import Torus from "@/components/sacred-geometry/shapes/Torus";

const AstralAttunement = () => {
  return (
    <Layout pageTitle="Astral Attunement™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Astral Attunement™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Align with cosmic forces and harness the power of celestial energies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Cosmic Alignment</h2>
            <p className="text-gray-300 mb-4">
              The planets, stars, and cosmic bodies are constantly influencing the energetic field
              of our planet and our personal energy systems.
            </p>
            <p className="text-gray-300">
              Astral Attunement™ helps you connect with these cosmic forces, understand their influence,
              and harmonize your energy with celestial rhythms.
            </p>
          </div>
          
          <div className="h-96">
            <Torus />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AstralAttunement;
