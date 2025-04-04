
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { toast } from "sonner";

const JourneyTemplates = () => {
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Explore our curated journeys designed to address specific healing needs. Each journey combines frequencies, 
          soundscapes, and guidance to support your path to wellness.
        </p>
        
        <JourneyTemplatesGrid />
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
