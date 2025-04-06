
import React from "react";
import Layout from "@/components/Layout";
import { SacredBlueprintCreator } from "@/components/sacred-blueprint";
import { motion } from "framer-motion";

const SacredBlueprintPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Sacred Blueprint
          </h1>
          
          <SacredBlueprintCreator />
        </motion.div>
      </div>
    </Layout>
  );
};

export default SacredBlueprintPage;
