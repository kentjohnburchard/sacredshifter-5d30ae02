
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import Torus from "@/components/sacred-geometry/shapes/Torus";

const FrequencyShift = () => {
  return (
    <Layout pageTitle="Frequency Shift™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Frequency Shift™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Elevate your energetic vibration through sacred frequencies and transformative sound
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Elevate Your Frequency</h2>
            <p className="text-gray-300 mb-4">
              Everything in existence vibrates at specific frequencies. When you shift your energetic
              frequency, you transform your physical, emotional, and spiritual experience.
            </p>
            <p className="text-gray-300">
              The Frequency Shift™ tools help you intentionally raise your vibration to align with
              your highest potential and desired reality.
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

export default FrequencyShift;
