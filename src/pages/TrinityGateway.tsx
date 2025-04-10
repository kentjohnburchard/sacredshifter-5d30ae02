
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import MetatronsCube from "@/components/sacred-geometry/shapes/MetatronsCube";

const TrinityGateway = () => {
  return (
    <Layout pageTitle="Trinity Gateway™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Trinity Gateway™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Access the sacred trinity of mind, body, and spirit to unlock your highest potential
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">The Sacred Trinity</h2>
            <p className="text-gray-300 mb-4">
              The trinity represents the threefold nature of consciousness - mind, body, and spirit.
              When these aspects are in harmony, you can access higher states of awareness and spiritual growth.
            </p>
            <p className="text-gray-300">
              The Trinity Gateway™ provides tools and practices to balance these aspects and
              open the gateway to your highest potential.
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

export default TrinityGateway;
