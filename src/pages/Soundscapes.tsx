
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {soundscapeItems.map((item, index) => (
            <motion.div 
              key={index}
              className="rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-md flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <div className={`h-40 sm:h-48 w-full ${item.bgGradient} rounded-md mb-4 flex items-center justify-center`}>
                <p className="text-white font-medium">Coming Soon</p>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

// Extract soundscape items to make the component cleaner
const soundscapeItems = [
  {
    title: "Ocean Tranquility",
    description: "Gentle waves and oceanic frequencies for deep calm",
    bgGradient: "bg-gradient-to-br from-indigo-300 to-purple-400"
  },
  {
    title: "Forest Meditation",
    description: "Immerse in the healing sounds of nature",
    bgGradient: "bg-gradient-to-br from-green-300 to-blue-400"
  },
  {
    title: "Cosmic Journey",
    description: "Celestial sounds for higher consciousness exploration",
    bgGradient: "bg-gradient-to-br from-purple-300 to-pink-400"
  }
];

export default Soundscapes;
