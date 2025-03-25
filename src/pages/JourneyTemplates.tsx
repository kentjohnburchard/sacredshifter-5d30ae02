
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
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Frequency Journey Templates
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of frequency journeys, each designed to align with specific chakras and healing intentions.
          </p>
        </div>
        
        <JourneyTemplatesGrid />
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
