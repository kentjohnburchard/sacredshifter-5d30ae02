
import React from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import IntentionSettingSection from "@/components/IntentionSettingSection";

const Intentions = () => {
  return (
    <Layout pageTitle="Intention Setting">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p 
          className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Set powerful intentions that resonate with your highest vibration.
        </motion.p>
        
        <IntentionSettingSection />
      </motion.div>
    </Layout>
  );
};

export default Intentions;
