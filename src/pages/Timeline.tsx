
import React from "react";
import Layout from "@/components/Layout";
import TimelineViewer from "@/components/timeline/TimelineViewer";
import { motion } from "framer-motion";

const Timeline = () => {
  return (
    <Layout pageTitle="My Frequency Timeline">
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
          Revisit your frequency journey and reconnect with moments that resonated with your energy.
        </motion.p>
        
        <TimelineViewer />
      </motion.div>
    </Layout>
  );
};

export default Timeline;
