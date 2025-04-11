
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import MetatronsCube from "@/components/sacred-geometry/shapes/MetatronsCube";
import { Card, CardContent } from "@/components/ui/card";
import { TrademarkedName } from "@/components/ip-protection";
import { Sparkles, Heart } from "lucide-react";

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
            
            <div className="mt-8 space-y-4">
              <Card className="bg-purple-900/30 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-purple-200">Core Frequency Analysis</h3>
                  </div>
                  <p className="text-gray-300">
                    Discover your unique vibrational signature that influences how you perceive
                    and interact with the world around you.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-indigo-900/30 border-indigo-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-medium text-indigo-200">Chakra Energy Assessment</h3>
                  </div>
                  <p className="text-gray-300">
                    Map your energy centers and understand how they shape your emotional, mental,
                    and spiritual experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
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
