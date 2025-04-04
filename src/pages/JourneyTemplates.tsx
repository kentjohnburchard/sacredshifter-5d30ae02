
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { toast } from "sonner";

const JourneyTemplates = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center my-8 md:my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Sacred Healing Journeys
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated journeys designed to address specific healing needs. Each journey combines frequencies, 
            soundscapes, and guidance to support your path to wellness.
          </p>
        </div>
        
        <JourneyTemplatesGrid />
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
