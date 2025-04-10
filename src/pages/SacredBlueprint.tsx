
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredBlueprintCreator from "@/components/sacred-blueprint/SacredBlueprintCreator";

const SacredBlueprint = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-300">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </div>
        
        <CosmicContainer className="p-6" glowColor="purple">
          <SacredBlueprintCreator />
        </CosmicContainer>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
