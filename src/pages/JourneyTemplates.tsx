
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { motion } from "framer-motion";
import { toast } from "sonner";

const JourneyTemplates = () => {
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Explore our curated journeys designed to address specific healing needs. Each journey combines frequencies, 
          soundscapes, and guidance to support your path to wellness.
        </motion.p>
        
        <JourneyTemplatesGrid />
      </motion.div>
    </Layout>
  );
};

export default JourneyTemplates;
