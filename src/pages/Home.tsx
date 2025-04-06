
import React from "react";
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

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Feature cards at the top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <HealingFeatures />
          </motion.div>
          
          {/* Quote Component - Moved higher for prominence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12"
          >
            <AboutSacredShifter />
          </motion.div>

          {/* Feature Sections Grid - Reorganized into a grid for better scan ability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Heart Center Feature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <Card className="h-full border-pink-100 hover:border-pink-200 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-500" />
                    Heart Center Expansion
                  </CardTitle>
                  <CardDescription>
                    Access, cultivate, and radiate love through sacred frequencies and heart-centered practices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-pink-500 mt-1" />
                      <div>
                        <p className="font-medium">Mirror Portal</p>
                        <p className="text-sm text-gray-600">Experience a reflective affirmation journey with real-time guidance.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Heart className="h-4 w-4 mr-2 text-pink-500 mt-1" />
                      <div>
                        <p className="font-medium">Soul Hugs</p>
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
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="h-5 w-5 mr-2 text-purple-500" />
                    Sound Healing
                  </CardTitle>
                  <CardDescription>
                    Experience ancient sound healing practices with modern frequency technology.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
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
                  
                  <Link to="/frequency-library">
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Explore Healing Frequencies
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sacred Blueprint Section (NEW) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <Card className="h-full border-indigo-100 hover:border-indigo-200 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-indigo-500" />
                    Sacred Blueprint
                  </CardTitle>
                  <CardDescription>
                    Discover your unique vibrational fingerprint and spiritual identity map.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 text-indigo-500 mt-1" />
                      <div>
                        <p className="font-medium">Frequency Chart</p>
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
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    Hermetic Principles
                  </CardTitle>
                  <CardDescription>
                    Ancient wisdom explaining the vibrational nature of the universe.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
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
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>
    </Layout>
  );
};

export default Home;
