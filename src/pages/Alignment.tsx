
import React from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
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
        <motion.p 
          className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-8"
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
