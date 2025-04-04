
import React from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import ChakraAlignmentSection from "@/components/ChakraAlignmentSection";

const Alignment = () => {
  return (
    <Layout pageTitle="Chakra Alignment">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ComingSoonBanner message="Our Chakra Alignment tools are being energetically calibrated for your journey." />
        
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Balance your energy centers with precision frequency healing designed for each chakra.
        </motion.p>
        
        <ChakraAlignmentSection />
      </motion.div>
    </Layout>
  );
};

export default Alignment;
