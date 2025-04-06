
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import HealingFeaturesLayout from "@/components/HealingFeaturesLayout";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-6">
      <HealingFeaturesLayout>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <img 
              src="lovable-uploads/70c01625-30c8-41b4-aaa3-e989e8ef118d.png" 
              alt="Sacred Shifter" 
              className="h-10 mb-1" 
            />
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-light mb-2">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Understanding Sound Healing
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-purple-100 shadow-sm">
              <h3 className="text-base font-medium text-gray-800 mb-1">Solfeggio Frequencies</h3>
              <p className="text-gray-600 text-xs">
                Ancient sacred tones used in Gregorian chants, each balancing energy and healing in various ways.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-purple-100 shadow-sm">
              <h3 className="text-base font-medium text-gray-800 mb-1">Sound and Chakras</h3>
              <p className="text-gray-600 text-xs">
                Each chakra vibrates at its own frequency. Specific frequencies restore harmony to blocked energy centers.
              </p>
            </div>
          </div>
          
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all mt-4"
          >
            <Music className="mr-2 h-4 w-4" />
            Begin Your Healing Journey
          </Button>
        </div>
      </HealingFeaturesLayout>
    </div>
  );
};

export default Home;
