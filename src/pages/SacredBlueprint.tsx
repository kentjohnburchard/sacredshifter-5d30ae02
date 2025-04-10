
import React from "react";
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";
import SacredBlueprintCreator from "@/components/sacred-blueprint/SacredBlueprintCreator";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SacredBlueprint = () => {
  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CosmicContainer className="p-6" glowColor="purple">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Sparkles className="h-8 w-8 text-purple-300" />
              </div>
            </div>
            <SacredBlueprintCreator />
          </CosmicContainer>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
