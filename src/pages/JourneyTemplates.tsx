
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";

const JourneyTemplates = () => {
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <div className="max-w-5xl mx-auto py-4 pb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sacred Healing Journeys</h1>
          <p className="text-base text-gray-700 dark:text-gray-300">
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
