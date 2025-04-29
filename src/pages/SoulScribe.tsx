
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import MetatronsCube from "@/components/sacred-geometry/shapes/MetatronsCube";
import { Card } from "@/components/ui/card";
import AudioDebugger from "@/components/hermetic-wisdom/AudioDebugger";

const SoulScribe = () => {
  return (
    <Layout pageTitle="Soul Scribe™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Soul Scribe™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Channel your inner wisdom and record the whispers of your soul
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">The Sacred Journey of Words</h2>
            <p className="text-gray-300 mb-4">
              Soul Scribe™ is a sacred practice that helps you connect with your higher self and
              channel wisdom through the written word.
            </p>
            <p className="text-gray-300">
              By entering a state of flow and receptivity, you can transcribe the insights, guidance,
              and revelations waiting to emerge from your soul's depths.
            </p>
          </div>
          
          <div className="h-96">
            <MetatronsCube />
          </div>
        </div>
        
        <section className="py-8">
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-purple-300 text-center">Audio Tools</h2>
            <AudioDebugger />
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default SoulScribe;
