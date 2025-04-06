
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { motion } from "framer-motion";

const JourneyTemplates = () => {
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our curated journeys designed to address specific healing needs. Each journey combines frequencies, 
            soundscapes, and guidance to support your path to wellness.
          </p>
        </motion.div>
        
        <JourneyTemplatesGrid />
      </motion.div>
    </Layout>
  );
};

export default JourneyTemplates;
