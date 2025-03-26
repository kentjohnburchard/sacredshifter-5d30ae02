
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music2 } from "lucide-react";
import Layout from "@/components/Layout";
import LandingPrompt from "@/components/LandingPrompt";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [showLandingPrompt, setShowLandingPrompt] = useState(true);
  
  // Check if user has seen the landing prompt before
  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('hasSeenPrompt');
    if (hasSeenPrompt) {
      setShowLandingPrompt(false);
    }
  }, []);
  
  const handleFinishPrompt = () => {
    setShowLandingPrompt(false);
    localStorage.setItem('hasSeenPrompt', 'true');
  };

  // If showing landing prompt, only show that
  if (showLandingPrompt) {
    return (
      <div className="min-h-screen bg-white">
        <LandingPrompt />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8, duration: 1 }}
          className="absolute bottom-4 right-4"
        >
          <button 
            onClick={handleFinishPrompt}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Skip Intro
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
          <ComingSoonBanner />
          
          <div className="text-center space-y-2 mb-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500">
                Sacred Sound Healing
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light text-base">
              Experience the ancient healing power of sacred frequencies. These sound vibrations have been used for millennia to restore harmony and balance.
            </p>
          </div>
          
          {/* Content in horizontal layout */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Introduction Card */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden h-full">
              <CardContent className="p-4">
                <h3 className="text-xl font-light mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  The Sacred Science of Sound
                </h3>
                <p className="mb-2 text-gray-700 text-sm">
                  Sound healing is one of the oldest and most natural forms of healing known to man. The Egyptians used vowel sound chants in healing because they believed vowels were sacred. Tibetan monks use singing bowls, which the body's chakra system responds to.
                </p>
                <p className="text-gray-700 text-sm">
                  Experience the power of sound healing in our Music Generation page, where you can listen to sacred frequencies.
                </p>
              </CardContent>
            </Card>
            
            {/* Understanding Sound Healing Card */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden h-full">
              <CardContent className="p-4">
                <h3 className="text-xl font-light mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Understanding Sound Healing
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Solfeggio Frequencies</h4>
                    <p className="text-xs text-gray-700">
                      Ancient sacred tones used in Gregorian chants, each balancing energy and healing in various ways.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Sound and Chakras</h4>
                    <p className="text-xs text-gray-700">
                      Each chakra vibrates at its own frequency. Specific frequencies restore harmony to blocked energy centers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Begin Your Journey Button */}
          <div className="flex justify-center mb-4">
            <Button 
              size="default" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/music-generation")}
            >
              <Music2 className="mr-2 h-4 w-4" />
              Begin Your Journey
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-3 text-center text-xs text-gray-500">
        <p>Sacred Shifter - Heal with the power of sound. Journey through sacred frequencies.</p>
      </footer>
    </div>
  );
};

export default Index;
