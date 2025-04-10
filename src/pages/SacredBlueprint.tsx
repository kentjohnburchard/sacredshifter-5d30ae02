
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import MetatronsCube from "@/components/sacred-geometry/shapes/MetatronsCube";

const SacredBlueprint = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Your Unique Blueprint</h2>
            <p className="text-gray-300 mb-4">
              Every soul has a unique energetic signature - a blueprint designed to help you 
              fulfill your purpose in this incarnation. Understand yours to unlock your greatest potential.
            </p>
            <p className="text-gray-300">
              The Sacred Blueprint™ helps you identify your core frequencies, soul lessons, 
              and energetic patterns that shape your journey.
            </p>
          </div>
          
          <div className="h-96">
            <MetatronsCube />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
