
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Info, BookOpen, Sparkles } from "lucide-react";
import HealingFeatures from "@/components/HealingFeatures";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SoundLibraryPreview from "@/components/landing/SoundLibraryPreview";
import GlobalWatermark from "@/components/GlobalWatermark";
import Header from "@/components/navigation/Header";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 pt-24">
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
          
          {/* Sound Healing Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Understanding Sound Healing
                </span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Sound healing is an ancient practice that uses vibrations to restore balance and harmony to the body and mind.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Music className="h-5 w-5 mr-2 text-purple-500" />
                    Solfeggio Frequencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Ancient sacred tones used in Gregorian chants, each vibrating at specific frequencies that can promote healing and spiritual awakening. 
                    The most known frequencies include 396Hz (releasing fear), 432Hz (universal harmony), 528Hz (transformation and DNA repair), and 639Hz (connecting relationships).
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                    Sound and Chakras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Each chakra vibrates at its own frequency. Using specific sound frequencies can restore harmony to blocked energy centers. 
                    From the Root chakra (396Hz) to the Crown chakra (963Hz), sound waves help realign your subtle energy system.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Link to="/frequency-library">
              <Button 
                variant="default" 
                className="mx-auto block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Music className="mr-2 h-4 w-4" />
                Explore Healing Frequencies
              </Button>
            </Link>
          </motion.div>
          
          {/* Hermetic Wisdom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
                  Hermetic Principles & Vibration
                </span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Ancient wisdom that explains the vibrational nature of the universe, connecting sound healing with universal laws.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    The Principle of Vibration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    "Nothing rests; everything moves; everything vibrates." The entire universe is in constant motion and vibration, including our bodies, thoughts, and emotions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    Sound as Medicine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    By applying specific sound frequencies, we can influence our own vibrational state, promoting healing and alignment with higher frequencies of consciousness.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                    Vibrational Alignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    When we align our personal vibration with healing frequencies, we can shift our state of being, overcome blockages, and manifest our intentions more effectively.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Link to="/hermetic-wisdom">
              <Button 
                variant="outline" 
                className="mx-auto block border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Hermetic Wisdom
              </Button>
            </Link>
          </motion.div>
          
          {/* Sound Library Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <SoundLibraryPreview />
          </motion.div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Global Watermark */}
      <GlobalWatermark />
    </div>
  );
};

export default Home;
