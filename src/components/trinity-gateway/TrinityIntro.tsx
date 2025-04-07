
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Triangle, Hexagon, CircleDot } from "lucide-react";

interface TrinityIntroProps {
  onStart: () => void;
}

const TrinityIntro: React.FC<TrinityIntroProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-center gap-8 mb-8">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-purple-500"
        >
          <Triangle size={64} />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="text-indigo-500"
        >
          <Hexagon size={88} />
        </motion.div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="text-violet-500"
        >
          <CircleDot size={64} />
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Begin Your 3-6-9 Journey</h2>
      
      <div className="text-center space-y-6 mb-8">
        <p className="text-gray-300">
          The Trinity Gateway™ integrates Nikola Tesla's 3-6-9 theory with sacred frequencies to guide you through a transformational journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-center mb-3">
              <Triangle className="text-purple-400" size={32} />
            </div>
            <h3 className="font-medium text-lg mb-2">Phase 1: Release (3)</h3>
            <p className="text-sm text-gray-300">396Hz Root Chakra frequency to release fear and clear blockages</p>
          </div>
          
          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-center mb-3">
              <Hexagon className="text-indigo-400" size={32} />
            </div>
            <h3 className="font-medium text-lg mb-2">Phase 2: Embody (6)</h3>
            <p className="text-sm text-gray-300">639Hz Heart Chakra frequency to activate love and harmonize relationships</p>
          </div>
          
          <div className="bg-violet-900/20 border border-violet-600/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-center mb-3">
              <CircleDot className="text-violet-400" size={32} />
            </div>
            <h3 className="font-medium text-lg mb-2">Phase 3: Transcend (9)</h3>
            <p className="text-sm text-gray-300">963Hz Crown Chakra frequency to return to source and universal connection</p>
          </div>
        </div>
        
        <p className="text-gray-400 italic">
          "If you only knew the magnificence of the 3, 6, and 9, then you would have the key to the universe." — Nikola Tesla
        </p>
      </div>
      
      <Button 
        onClick={onStart}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-md font-medium text-lg"
      >
        Begin Trinity Gateway™ Journey
      </Button>
    </motion.div>
  );
};

export default TrinityIntro;
