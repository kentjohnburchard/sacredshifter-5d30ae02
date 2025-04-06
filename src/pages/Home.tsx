
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Waveform } from "lucide-react";
import HealingFeaturesLayout from "@/components/HealingFeaturesLayout";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <HealingFeaturesLayout>
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <img 
              src="lovable-uploads/70c01625-30c8-41b4-aaa3-e989e8ef118d.png" 
              alt="Sacred Shifter" 
              className="h-12 mb-4" 
            />
          </motion.div>
          
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Understanding Sound Healing
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-purple-100 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Solfeggio Frequencies</h3>
              <p className="text-gray-600">
                Ancient sacred tones used in Gregorian chants, each balancing energy and healing in various ways.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-purple-100 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Sound and Chakras</h3>
              <p className="text-gray-600">
                Each chakra vibrates at its own frequency. Specific frequencies restore harmony to blocked energy centers.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
              Explore Our Sacred Healing Features
            </h2>
            <p className="text-gray-600 mb-6">
              Our healing modalities combine ancient wisdom with modern science to bring you powerful transformation tools.
            </p>
          </div>
          
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Waveform className="mr-2 h-5 w-5" />
            Begin Your Healing Journey
          </Button>
        </div>
      </HealingFeaturesLayout>
    </div>
  );
};

export default Home;
