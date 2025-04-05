
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HermeticWisdomLibrary, 
  HermeticSoundExplorer,
  FractalVisualsExplorer,
  VisualVibrationViewer
} from "@/components/hermetic-wisdom";
import { useLocation } from "react-router-dom";

const HermeticWisdom: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Check if the URL contains a specific hermetic principle
    if (location.pathname.includes("/hermetic-wisdom/")) {
      return "principles";
    }
    return "principles";
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              The Hermetic Wisdom
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the vibrational essence of the Seven Hermetic Principles through sound frequencies 
            and fractal visuals aligned with chakra energy centers.
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto">
            <TabsTrigger value="principles" className="w-1/5">
              Principles
            </TabsTrigger>
            <TabsTrigger value="sound" className="w-1/5">
              Sound Library
            </TabsTrigger>
            <TabsTrigger value="fractals" className="w-1/5">
              Fractals
            </TabsTrigger>
            <TabsTrigger value="vibration-viewer" className="w-1/5">
              Vibration Viewer
            </TabsTrigger>
            <TabsTrigger value="journeys" className="w-1/5">
              My Journeys
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="principles" className="space-y-6">
            <HermeticWisdomLibrary />
          </TabsContent>
          
          <TabsContent value="sound" className="space-y-6">
            <HermeticSoundExplorer />
          </TabsContent>
          
          <TabsContent value="fractals" className="space-y-6">
            <FractalVisualsExplorer />
          </TabsContent>
          
          <TabsContent value="vibration-viewer" className="space-y-6">
            <VisualVibrationViewer />
          </TabsContent>
          
          <TabsContent value="journeys" className="space-y-6">
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                Your personal journey collection and saved sessions will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HermeticWisdom;
