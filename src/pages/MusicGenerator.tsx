
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredFlowerOfLife from "@/components/sacred-geometry/shapes/SacredFlowerOfLife";

const MusicGenerator = () => {
  return (
    <Layout pageTitle="Music Generator" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Music Generator
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Create personalized frequency-based music for healing and transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Sacred Sound Creation</h2>
            <p className="text-gray-300 mb-4">
              Sound has been used as a healing tool across cultures for thousands of years.
              Our Music Generator allows you to create custom frequency-based compositions
              tailored to your specific energetic needs.
            </p>
            <p className="text-gray-300">
              Choose chakras, intentions, or emotional states to generate music that supports
              your spiritual journey and energetic wellbeing.
            </p>
          </div>
          
          <div className="h-96">
            <SacredFlowerOfLife />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MusicGenerator;
