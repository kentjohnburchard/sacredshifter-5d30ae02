
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredBlueprintCreator from "@/components/sacred-blueprint/SacredBlueprintCreator";
import { Sparkles } from "lucide-react";

// Performance optimized Sacred Blueprint page
const SacredBlueprint = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-purple-100/90 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </div>
        
        <CosmicContainer className="p-6" glowColor="purple">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-500/30 p-2 rounded-full">
              <Sparkles className="h-7 w-7 text-purple-200" />
            </div>
          </div>
          <SacredBlueprintCreator />
        </CosmicContainer>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
