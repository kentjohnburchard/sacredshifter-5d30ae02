
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import MetatronsCube from "@/components/sacred-geometry/shapes/MetatronsCube";
import { Card, CardContent } from "@/components/ui/card";
import { TrademarkedName } from "@/components/ip-protection";
import { Sparkles, Triangle, Heart, Star } from "lucide-react";

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
            <p className="text-gray-300 mb-6">
              The Trinity Gateway™ provides tools and practices to balance these aspects and
              open the gateway to your highest potential.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-purple-900/30 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Triangle className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-purple-200">Mind</h3>
                  <p className="text-sm text-gray-300">Clarity & Wisdom</p>
                </CardContent>
              </Card>
              
              <Card className="bg-indigo-900/30 border-indigo-500/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Heart className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="font-medium text-indigo-200">Body</h3>
                  <p className="text-sm text-gray-300">Vitality & Presence</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-900/30 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-medium text-blue-200">Spirit</h3>
                  <p className="text-sm text-gray-300">Connection & Purpose</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-200">Gateway Activation</h3>
                </div>
                <p className="text-gray-300">
                  Experience guided meditations and frequency journeys designed to activate
                  and harmonize your trinity centers, opening the gateway to expanded consciousness.
                </p>
              </CardContent>
            </Card>
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
