import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Info, BookOpen, Sparkles, Heart } from "lucide-react";
import HealingFeatures from "@/components/HealingFeatures";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalWatermark from "@/components/GlobalWatermark";
import Header from "@/components/navigation/Header";
import AboutSacredShifter from "@/components/AboutSacredShifter";
import ConsciousnessToggle from "@/components/ConsciousnessToggle";
import Layout from "@/components/Layout";
import { TrademarkedName } from "@/components/ip-protection";
import { SacredGeometryVisualizer } from "@/components/sacred-geometry";

const Home: React.FC = () => {
  // Track the current sacred geometry shape
  const [currentShape, setCurrentShape] = useState<'flower-of-life' | 'metatrons-cube' | 'merkaba'>('flower-of-life');
  
  // Change shape every 10 seconds
  React.useEffect(() => {
    const shapes: ('flower-of-life' | 'metatrons-cube' | 'merkaba')[] = ['flower-of-life', 'metatrons-cube', 'merkaba'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % shapes.length;
      setCurrentShape(shapes[currentIndex]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Layout>
      {/* Large Sacred Geometry Visualizer as background element */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SacredGeometryVisualizer 
          defaultShape={currentShape}
          size="xl"
          showControls={false}
          scale={6} // Doubled from 3 to 6
          className="opacity-95" // Increased opacity for better visibility
        />
      </div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Feature cards at the top - reduced spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <HealingFeatures />
          </motion.div>
          
          {/* About Sacred Shifter - reduced spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mb-8"
          >
            <AboutSacredShifter />
          </motion.div>
          
          {/* Sacred Blueprint Hero Section - reduced padding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg">
              <div className="absolute inset-0 bg-cover bg-center opacity-10" 
                   style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3')" }}>
              </div>
              <div className="grid md:grid-cols-2 gap-6 p-5 md:p-6 relative z-10">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                    New Feature
                  </span>
                  <h2 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    <TrademarkedName>Sacred Blueprint</TrademarkedName>
                  </h2>
                  <p className="text-gray-700">
                    Discover your unique vibrational fingerprint that reveals your energetic signature, 
                    spiritual identity, and soul purpose through a personalized frequency assessment.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-indigo-600" />
                      </span>
                      <p className="text-sm text-gray-700">Reveal your core frequency</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <Heart className="h-3 w-3 text-purple-600" />
                      </span>
                      <p className="text-sm text-gray-700">Map your chakra signature</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Music className="h-3 w-3 text-blue-600" />
                      </span>
                      <p className="text-sm text-gray-700">Discover your musical key resonance</p>
                    </div>
                  </div>
                  <Link to="/sacred-blueprint" className="inline-block mt-2">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Reveal Your Blueprint
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300/30 to-indigo-300/30 animate-pulse-subtle"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-400/40 to-indigo-400/40 animate-pulse-subtle" style={{ animationDelay: "0.5s" }}></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/50 to-indigo-500/50 animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-16 w-16 text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Sections Grid - tighter spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Heart Center Feature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <Card className="h-full border-pink-100 hover:border-pink-200 transition-all">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-500" />
                    <TrademarkedName>Heart Center</TrademarkedName> Expansion
                  </CardTitle>
                  <CardDescription>
                    Access, cultivate, and radiate love through sacred frequencies and heart-centered practices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-pink-500 mt-1" />
                      <div>
                        <p className="font-medium"><TrademarkedName>Mirror Portal</TrademarkedName></p>
                        <p className="text-sm text-gray-600">Experience a reflective affirmation journey with real-time guidance.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Heart className="h-4 w-4 mr-2 text-pink-500 mt-1" />
                      <div>
                        <p className="font-medium"><TrademarkedName>Soul Hugs</TrademarkedName></p>
                        <p className="text-sm text-gray-600">Share and receive love through community-powered messages.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/heart-center">
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Enter Heart Center
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Sound Healing Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full border-purple-100 hover:border-purple-200 transition-all">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-purple-500" />
                    Sound Healing
                  </CardTitle>
                  <CardDescription>
                    Experience ancient sound healing practices with modern frequency technology.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <Music className="h-4 w-4 mr-2 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">Solfeggio Frequencies</p>
                        <p className="text-sm text-gray-600">Ancient sacred tones for spiritual and physical healing.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">Sound and Chakras</p>
                        <p className="text-sm text-gray-600">Specific frequencies to restore harmony to your energy centers.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link to="/frequency-library">
                      <Button 
                        variant="default" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <Music className="mr-2 h-4 w-4" />
                        Explore Healing Frequencies
                      </Button>
                    </Link>
                    
                    <Link to="/meditation">
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Music className="mr-2 h-4 w-4" />
                        Guided Meditations
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sacred Blueprint Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <Card className="h-full border-indigo-100 hover:border-indigo-200 transition-all">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-indigo-500" />
                    <TrademarkedName>Sacred Blueprint</TrademarkedName>
                  </CardTitle>
                  <CardDescription>
                    Discover your unique vibrational fingerprint and spiritual identity map.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium"><TrademarkedName>Frequency Chart</TrademarkedName></p>
                        <p className="text-sm text-gray-600">Visualize your unique energetic signature and resonance patterns.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Heart className="h-4 w-4 mr-2 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Soul Profile</p>
                        <p className="text-sm text-gray-600">Receive a personalized spiritual identity map and guidance.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/sacred-blueprint">
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Reveal Your Blueprint
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Hermetic Wisdom Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="h-full border-blue-100 hover:border-blue-200 transition-all">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    Hermetic Principles
                  </CardTitle>
                  <CardDescription>
                    Ancient wisdom explaining the vibrational nature of the universe.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Principle of Vibration</p>
                        <p className="text-sm text-gray-600">"Nothing rests; everything moves; everything vibrates."</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">Vibrational Alignment</p>
                        <p className="text-sm text-gray-600">Shift your state of being by aligning with healing frequencies.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/hermetic-wisdom">
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Explore Hermetic Wisdom
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Fixed Consciousness Mode Toggle */}
      <ConsciousnessToggle />
    </Layout>
  );
};

export default Home;
