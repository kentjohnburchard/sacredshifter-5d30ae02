
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import Header from "@/components/navigation/Header";
import HealingFeatures from "@/components/HealingFeatures";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* HealingFeatures moved to the top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <HealingFeatures />
          </motion.div>
          
          {/* Understanding Sound Healing moved below features */}
          <div className="text-center space-y-4 mt-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-4"
            >
              <h1 className="text-3xl md:text-4xl font-light">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Understanding Sound Healing
                </span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-purple-100 shadow-sm">
                  <h3 className="text-base font-medium text-gray-800 mb-1">Solfeggio Frequencies</h3>
                  <p className="text-gray-600 text-sm">
                    Ancient sacred tones used in Gregorian chants, each balancing energy and healing in various ways.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-purple-100 shadow-sm">
                  <h3 className="text-base font-medium text-gray-800 mb-1">Sound and Chakras</h3>
                  <p className="text-gray-600 text-sm">
                    Each chakra vibrates at its own frequency. Specific frequencies restore harmony to blocked energy centers.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all mt-6"
              >
                <Music className="mr-2 h-4 w-4" />
                Begin Your Healing Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default Home;
