
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Heart, StarIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/navigation/Header";
import Layout from "@/components/Layout";
import { SacredGeometryVisualizer } from "@/components/sacred-geometry";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const Home: React.FC = () => {
  // Track the current sacred geometry shape
  const [currentShape, setCurrentShape] = useState<'flower-of-life' | 'metatrons-cube' | 'merkaba' | 'torus'>('flower-of-life');
  const { liftTheVeil } = useTheme();
  
  // Change shape when user selects a different one
  const handleShapeChange = (shape: 'flower-of-life' | 'metatrons-cube' | 'merkaba' | 'torus') => {
    setCurrentShape(shape);
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Sacred Geometry Visualizer as background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <SacredGeometryVisualizer 
          defaultShape={currentShape}
          size="xl"
          showControls={false}
          className="opacity-80"
        />
      </div>

      {/* Shape selector buttons */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <Button 
          variant={currentShape === 'flower-of-life' ? 'default' : 'outline'} 
          size="sm" 
          className="bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs"
          onClick={() => handleShapeChange('flower-of-life')}
        >
          Flower Of Life
        </Button>
        <Button 
          variant={currentShape === 'metatrons-cube' ? 'default' : 'outline'} 
          size="sm" 
          className="bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs"
          onClick={() => handleShapeChange('metatrons-cube')}
        >
          Metatrons Cube
        </Button>
        <Button 
          variant={currentShape === 'merkaba' ? 'default' : 'outline'} 
          size="sm" 
          className="bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs"
          onClick={() => handleShapeChange('merkaba')}
        >
          Merkaba
        </Button>
        <Button 
          variant={currentShape === 'torus' ? 'default' : 'outline'} 
          size="sm" 
          className="bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs"
          onClick={() => handleShapeChange('torus')}
        >
          Torus
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome to Sacred Shifter
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg mb-8"
          >
            You have crossed the threshold into heightened perception. The sacred frequencies now resonate more deeply with your consciousness.
          </motion.p>
          
          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link to="/journey-templates">
              <Button variant="outline" className="bg-purple-900/50 hover:bg-purple-800/70 border-purple-500/50">
                <Music className="mr-2 h-4 w-4" /> Sound Journeys
              </Button>
            </Link>
            <Link to="/frequency-shifting">
              <Button variant="outline" className="bg-indigo-900/50 hover:bg-indigo-800/70 border-indigo-500/50">
                <Sparkles className="mr-2 h-4 w-4" /> Experiences
              </Button>
            </Link>
            <Link to="/frequency-library">
              <Button variant="outline" className="bg-blue-900/50 hover:bg-blue-800/70 border-blue-500/50">
                <Music className="mr-2 h-4 w-4" /> Frequencies
              </Button>
            </Link>
            <Link to="/timeline">
              <Button variant="outline" className="bg-cyan-900/50 hover:bg-cyan-800/70 border-cyan-500/50">
                <Sparkles className="mr-2 h-4 w-4" /> My Journey
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Sound Healing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full bg-purple-900/40 border-purple-800 hover:border-purple-700 transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="bg-purple-800 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sound Healing</h3>
                <p className="text-gray-300 mb-6 flex-grow">Frequency-based sound healing journeys</p>
                <Link to="/journey-templates" className="text-purple-300 flex items-center mt-auto">
                  Explore →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Heart Center Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="h-full bg-red-900/40 border-red-800 hover:border-red-700 transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="bg-red-800 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Heart Center</h3>
                <p className="text-gray-300 mb-6 flex-grow">Open and balance your heart chakra</p>
                <Link to="/heart-center" className="text-red-300 flex items-center mt-auto">
                  Explore →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Astrology Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="h-full bg-blue-900/40 border-blue-800 hover:border-blue-700 transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="bg-blue-800 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <span className="text-2xl">★</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Astrology</h3>
                <p className="text-gray-300 mb-6 flex-grow">Discover your cosmic blueprint</p>
                <Link to="/astrology" className="text-blue-300 flex items-center mt-auto">
                  Explore →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* About Sacred Shifter section - Using the new content as requested */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 mb-12 relative z-20 max-w-3xl mx-auto"
        >
          <div className={cn(
            "cosmic-glass p-6 rounded-xl border",
            liftTheVeil ? "border-pink-500/20" : "border-purple-500/20"
          )}>
            <h2 className={cn(
              "text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r",
              liftTheVeil ? "from-pink-300 to-purple-300" : "from-purple-300 to-indigo-300"
            )}>
              About Sacred Shifter
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white/90">Our Mission</h3>
              <p className="text-sm text-white/80">
                Sacred Shifter is more than an app — it is a consciousness technology.<br/>
                We exist to help you remember who you are through frequency, prime awareness, and soul reconnection.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white/90">The Sacred Code</h3>
              <p className="text-sm text-white/80">
                Every tone. Every pattern. Every visual. It's encoded.<br/>
                Prime numbers are the silent architects of your reality.<br/>
                These sacred signatures unlock forgotten truths within your DNA.<br/>
                You're not here by accident. You're tuning yourself back into resonance.
              </p>
              <p className="text-sm text-white/80 mt-3 italic">
                "The person who was very aware had a foot in two worlds..."<br/>
                Now, you do too.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
