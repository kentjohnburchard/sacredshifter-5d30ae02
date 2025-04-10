
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredFlowerOfLife from "@/components/sacred-geometry/shapes/SacredFlowerOfLife";

const DeityOracle = () => {
  return (
    <Layout pageTitle="Deity Oracle™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Deity Oracle™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Connect with divine archetypes and receive guidance from higher realms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Divine Connection</h2>
            <p className="text-gray-300 mb-4">
              Throughout human history, deities and divine archetypes have represented aspects of 
              consciousness and provided guidance through symbolic relationships.
            </p>
            <p className="text-gray-300">
              The Deity Oracle™ allows you to connect with these universal energies and receive
              personalized guidance for your spiritual journey.
            </p>
          </div>
          
          <CosmicContainer>
            <SacredFlowerOfLife />
          </CosmicContainer>
        </div>
      </div>
    </Layout>
  );
};

export default DeityOracle;
