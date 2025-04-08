
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";

const JourneyTemplates = () => {
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="mb-4">
          <p className="text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
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
