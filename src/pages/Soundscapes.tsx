
import React from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Soundscapes: React.FC = () => {
  return (
    <Layout pageTitle="Sacred Soundscapes">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
            Immersive Soundscapes
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of healing soundscapes designed to transport you to states of deep relaxation and transformation.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gradient-to-br from-indigo-300 to-purple-400 rounded-md mb-4 flex items-center justify-center">
              <p className="text-white font-medium">Coming Soon</p>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ocean Tranquility</h3>
            <p className="text-gray-600 dark:text-gray-400">Gentle waves and oceanic frequencies for deep calm</p>
          </div>
          
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gradient-to-br from-green-300 to-blue-400 rounded-md mb-4 flex items-center justify-center">
              <p className="text-white font-medium">Coming Soon</p>
            </div>
            <h3 className="text-xl font-semibold mb-2">Forest Meditation</h3>
            <p className="text-gray-600 dark:text-gray-400">Immerse in the healing sounds of nature</p>
          </div>
          
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gradient-to-br from-purple-300 to-pink-400 rounded-md mb-4 flex items-center justify-center">
              <p className="text-white font-medium">Coming Soon</p>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cosmic Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">Celestial sounds for higher consciousness exploration</p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Soundscapes;
