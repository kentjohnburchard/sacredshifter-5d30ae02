
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Music2, CheckSquare, Heart, Zap, Book, Stars, Library, Clock, HeartPulse } from "lucide-react";
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
                  Experience the power of sound healing in our application, where you can listen to sacred frequencies.
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
          
          {/* All App Pages Section */}
          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-light text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Explore Our Sacred Healing Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Journey Templates */}
              <Card className="border border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-purple-700 flex items-center">
                    <Library className="mr-2 h-4 w-4" />
                    Healing Journeys
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore curated sound experiences designed for specific healing purposes like sleep, focus, and anxiety release.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/journey-templates">Explore Healing Journeys</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Energy Check */}
              <Card className="border border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-blue-700 flex items-center">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Energy Check
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Assess your current energy state, set intentions, and discover frequencies that align with your needs.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/energy-check">Try Energy Check</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Alignment */}
              <Card className="border border-indigo-100 hover:border-indigo-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-indigo-700 flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Chakra Alignment
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Balance your energy centers with precision frequency healing designed for each chakra.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/alignment">Align Your Chakras</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Intentions */}
              <Card className="border border-teal-100 hover:border-teal-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-teal-700 flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Intentions
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set powerful intentions that resonate with your highest vibration and manifest your desired reality.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/intentions">Set Your Intentions</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Meditation */}
              <Card className="border border-cyan-100 hover:border-cyan-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-cyan-700 flex items-center">
                    <Music2 className="mr-2 h-4 w-4" />
                    Meditation
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Find peace and elevate your consciousness through guided meditations enhanced with sacred frequencies.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/meditation">Start Meditating</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Focus */}
              <Card className="border border-green-100 hover:border-green-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-green-700 flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    Focus
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Enhance concentration and mental clarity with sound frequencies designed to optimize brain function.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/focus">Improve Focus</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Astrology */}
              <Card className="border border-violet-100 hover:border-violet-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-violet-700 flex items-center">
                    <Stars className="mr-2 h-4 w-4" />
                    Astrology
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore cosmic connections and how celestial energies influence your personal frequency.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/astrology">Discover Astrology</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Soundscapes */}
              <Card className="border border-amber-100 hover:border-amber-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-amber-700 flex items-center">
                    <Library className="mr-2 h-4 w-4" />
                    Soundscapes
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Immerse yourself in ambient sound environments designed to enhance your focus, creativity, and spiritual connection.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/soundscapes">Explore Soundscapes</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Timeline */}
              <Card className="border border-rose-100 hover:border-rose-300 transition-all shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2 text-rose-700 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Revisit your frequency journey and reconnect with moments that resonated with your energy.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/timeline">View Your Timeline</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Begin Your Journey Button */}
          <div className="flex justify-center mb-4">
            <Button 
              size="default" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/energy-check")}
            >
              <HeartPulse className="mr-2 h-4 w-4" />
              Begin Your Healing Journey
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
