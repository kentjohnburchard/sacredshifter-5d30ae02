import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music2 } from "lucide-react";
import Layout from "@/components/Layout";
import LandingPrompt from "@/components/LandingPrompt";
import HeroSection from "@/components/HeroSection";
import SoundJourneysSection from "@/components/SoundJourneysSection";
import MoodCheckSection from "@/components/MoodCheckSection";
import ChakraAlignmentSection from "@/components/ChakraAlignmentSection";
import IntentionSettingSection from "@/components/IntentionSettingSection";
import AnimatedBackground from "@/components/AnimatedBackground";
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
        <AnimatedBackground />
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
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <ComingSoonBanner />
        
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500">
              Sacred Sound Healing
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">
            Experience the ancient healing power of sacred frequencies. These sound vibrations have been used for millennia to restore harmony and balance to mind, body, and spirit.
          </p>
        </div>
        
        {/* Introduction Card */}
        <Card className="border border-gray-200 shadow-md overflow-hidden mb-10">
          <CardContent className="p-6">
            <h3 className="text-2xl font-light mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              The Sacred Science of Sound
            </h3>
            <p className="mb-4 text-gray-700">
              Sound healing is one of the oldest and most natural forms of healing known to man. Since ancient times, sound therapy has been used to treat a variety of physical and mental conditions. The Egyptians used vowel sound chants in healing because they believed vowels were sacred. Tibetan monks use singing bowls, which the body's chakra system responds to.
            </p>
            <p className="text-gray-700">
              Experience the power of sound healing in our Music Generation page, where you can listen to sacred frequencies and even create custom healing music with AI.
            </p>
          </CardContent>
        </Card>
        
        {/* Additional information section */}
        <Card className="mt-12 border border-gray-200 shadow-md">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Understanding Sound Healing
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <span>The Solfeggio Frequencies</span>
                  </h4>
                  <p className="text-gray-700">
                    The Solfeggio frequencies are a set of six tones that were used in ancient sacred music, including the beautiful Gregorian chants. Each Solfeggio tone helps to balance energy and heal the mind, body, and spirit in various ways.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <span>Sound and the Chakras</span>
                  </h4>
                  <p className="text-gray-700">
                    Each of the seven chakras in the human body vibrates at its own frequency. When these energy centers become blocked or imbalanced, specific sound frequencies can help to restore harmony. The frequencies provided here are aligned with specific chakras to target healing where you need it most.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <span>How to Use These Frequencies</span>
                  </h4>
                  <p className="text-gray-700">
                    For best results, listen to these healing frequencies with headphones in a quiet, comfortable space. A daily practice of 15-30 minutes can yield the most benefits. You may listen actively during meditation or passively while doing gentle activities or before sleep.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <span>The Science Behind Sound Healing</span>
                  </h4>
                  <p className="text-gray-700">
                    Modern research is beginning to validate what ancient cultures knew about sound healing. Studies show that specific frequencies can affect brainwave states, reduce stress hormones, and even promote cellular healing. Everything in the universe is in a state of vibration, including our bodies, and sound healing works on the principle of resonance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Begin Your Journey Button */}
        <div className="flex justify-center mt-8 mb-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/music-generation")}
          >
            <Music2 className="mr-2 h-5 w-5" />
            Begin Your Journey
          </Button>
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-gray-500">
        <p>Sacred Shifter - Heal with the power of sound. Journey to harmony through sacred frequencies.</p>
      </footer>
    </div>
  );
};

export default Index;
