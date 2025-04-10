
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredFlowerOfLife from "@/components/sacred-geometry/shapes/SacredFlowerOfLife";

const MirrorPortal = () => {
  return (
    <Layout pageTitle="Mirror Portal" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Mirror Portal
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Reflect, transform, and transcend through the sacred mirror of self-realization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">The Divine Reflection</h2>
            <p className="text-gray-300 mb-4">
              The Mirror Portal helps you see your true self beyond the illusions of the ego.
              By confronting your reflections with compassion, you can transform your perceptions.
            </p>
            <p className="text-gray-300">
              Enter the portal to begin your journey of deep self-reflection and transformation.
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

export default MirrorPortal;
