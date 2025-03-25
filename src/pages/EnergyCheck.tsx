
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import MoodCheckSection from "@/components/MoodCheckSection";
import JournalSection from "@/components/JournalSection";

const EnergyCheck = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Energy Check-In
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover where your energy needs rebalancing and receive personalized frequency recommendations.
          </p>
        </div>
        
        <MoodCheckSection />
        
        <div className="mt-16">
          <JournalSection />
        </div>
      </div>
    </Layout>
  );
};

export default EnergyCheck;
