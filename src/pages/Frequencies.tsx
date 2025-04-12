
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, BookmarkIcon, Music, Sparkles } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FrequencyLibraryViewer from "@/components/frequency-library/FrequencyLibraryViewer";
import SacredGeometryVisualizer from "@/components/sacred-geometry/SacredGeometryVisualizer";

const Frequencies: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout pageTitle="Frequency Library" theme="cosmic">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Music className={`${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
            Sacred Frequency Library
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4">
                    Explore our comprehensive library of sacred frequencies, each designed to align with specific 
                    chakras, healing intentions, and consciousness states. These frequencies have been calibrated to 
                    create profound resonance within your energetic system.
                  </p>
                  
                  {liftTheVeil ? (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
                    >
                      With the veil lifted, these frequencies connect to the quantum field directly, 
                      allowing for multidimensional healing and consciousness expansion beyond the 
                      limitations of ordinary perception.
                    </motion.p>
                  ) : (
                    <p className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                      Each frequency creates a specific resonance pattern that can facilitate healing, 
                      meditation, creativity, focus, or spiritual awakening, depending on its vibrational quality.
                    </p>
                  )}
                </div>
                
                <div className="relative h-[200px]">
                  <SacredGeometryVisualizer 
                    defaultShape="flower-of-life" 
                    size="md" 
                    showControls={false}
                    isVisible={true}
                    chakra="throat"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="library" className="w-full">
              <TabsList className="bg-black/40 border border-white/10 mb-6">
                <TabsTrigger value="library" className="data-[state=active]:bg-purple-800/50">
                  <Library className="h-4 w-4 mr-2" />
                  Browse Library
                </TabsTrigger>
                <TabsTrigger value="saved" className="data-[state=active]:bg-purple-800/50">
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Saved Frequencies
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="library">
                <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <FrequencyLibraryViewer />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="py-12">
                      <Sparkles className={`h-12 w-12 mx-auto mb-4 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
                      <h3 className="text-xl font-medium text-white mb-2">Your Sacred Collection</h3>
                      <p className="text-gray-300 max-w-md mx-auto mb-6">
                        Save your favorite frequencies here to create your personal healing library
                        for easy access during your consciousness journeys.
                      </p>
                      
                      <Button className={liftTheVeil ? 'bg-pink-700 hover:bg-pink-800' : 'bg-purple-700 hover:bg-purple-800'}>
                        Browse Frequencies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className={`border ${liftTheVeil ? 'border-pink-500/30 bg-pink-950/20' : 'border-purple-500/30 bg-purple-950/20'} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Frequency Benefits</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 ${liftTheVeil ? 'bg-pink-900/50' : 'bg-purple-900/50'}`}>
                      <div className={`w-2 h-2 rounded-full ${liftTheVeil ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                    </div>
                    <span className="text-gray-300">Chakra alignment and balancing</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 ${liftTheVeil ? 'bg-pink-900/50' : 'bg-purple-900/50'}`}>
                      <div className={`w-2 h-2 rounded-full ${liftTheVeil ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                    </div>
                    <span className="text-gray-300">Cellular regeneration support</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 ${liftTheVeil ? 'bg-pink-900/50' : 'bg-purple-900/50'}`}>
                      <div className={`w-2 h-2 rounded-full ${liftTheVeil ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                    </div>
                    <span className="text-gray-300">Enhanced meditation states</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 ${liftTheVeil ? 'bg-pink-900/50' : 'bg-purple-900/50'}`}>
                      <div className={`w-2 h-2 rounded-full ${liftTheVeil ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                    </div>
                    <span className="text-gray-300">DNA activation and repair</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 ${liftTheVeil ? 'bg-pink-900/50' : 'bg-purple-900/50'}`}>
                      <div className={`w-2 h-2 rounded-full ${liftTheVeil ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                    </div>
                    <span className="text-gray-300">Emotional processing and release</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Using Frequencies</h2>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>
                    For optimal results, listen with headphones in a calm environment. 
                    Regular practice helps establish stronger resonance patterns.
                  </p>
                  <p>
                    Start with 5-10 minute sessions and gradually increase to 30 minutes 
                    as your energy system attunes to the vibrations.
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link to="/dashboard">
                    <Button 
                      variant="outline"
                      className={`w-full ${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
                    >
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Frequencies;
