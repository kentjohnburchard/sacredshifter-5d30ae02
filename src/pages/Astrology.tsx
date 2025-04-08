
import React from "react";
import Layout from "@/components/Layout";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import { Star } from "lucide-react";

const Astrology = () => {
  return (
    <Layout pageTitle="Astrology">
      <div className="container mx-auto px-4 py-8">
        <ComingSoonBanner message="Our Astrology features are coming soon. Track planetary influences on your energy." />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-xl p-8 border border-purple-200/20">
            <div className="flex justify-center mb-6">
              <Star className="h-16 w-16 text-purple-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Cosmic Alignment & Astrological Insights
            </h2>
            
            <p className="text-white/80 mb-6 text-center">
              Discover how celestial bodies influence your energy and learn to harness their power for personal growth.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-300/10">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Natal Chart Analysis</h3>
                <p className="text-white/70">
                  Gain insights into your unique cosmic blueprint and understand how it shapes your life path.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-lg border border-purple-300/10">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Planetary Transits</h3>
                <p className="text-white/70">
                  Track how current planetary movements affect your energy and consciousness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Astrology;
