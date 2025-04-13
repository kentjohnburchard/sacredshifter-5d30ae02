
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SacredFlowerOfLife from '@/components/sacred-geometry/shapes/SacredFlowerOfLife';
import MetatronsCube from '@/components/sacred-geometry/shapes/MetatronsCube';
import Merkaba from '@/components/sacred-geometry/shapes/Merkaba';
import Torus from '@/components/sacred-geometry/shapes/Torus';
import TreeOfLife from '@/components/sacred-geometry/shapes/TreeOfLife';
import SriYantra from '@/components/sacred-geometry/shapes/SriYantra';
import VesicaPiscis from '@/components/sacred-geometry/shapes/VesicaPiscis';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import { Music, Heart, Sparkles, BookOpen, Star, Moon, LibraryBig, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FixedFooter from '@/components/navigation/FixedFooter';
import Sidebar from '@/components/Sidebar';
import ConsciousnessToggle from '@/components/ConsciousnessToggle';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const geometryComponents = {
  'Flower of Life': <SacredFlowerOfLife />,
  "Metatron's Cube": <MetatronsCube />,
  'Merkaba': <Merkaba />,
  'Torus': <Torus />,
  'Tree of Life': <TreeOfLife />,
  'Sri Yantra': <SriYantra />,
  'Vesica Piscis': <VesicaPiscis />,
};

const SacredShifterLanding = () => {
  const [selectedShape, setSelectedShape] = useState<"flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis">("flower-of-life");
  const { liftTheVeil } = useTheme();
  const { setAudioSource } = useAudioPlayer();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Map from UI selection to component prop type
  const shapeMapping: Record<string, "flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis"> = {
    'Flower of Life': 'flower-of-life',
    "Metatron's Cube": 'metatrons-cube',
    'Merkaba': 'merkaba',
    'Torus': 'torus',
    'Tree of Life': 'tree-of-life',
    'Sri Yantra': 'sri-yantra',
    'Vesica Piscis': 'vesica-piscis',
  };

  // Feature cards data
  const featureCards = [
    {
      title: "Sound Healing",
      description: "Frequency-based sound healing journeys",
      icon: <Music className="h-8 w-8" />,
      color: "from-purple-900 to-indigo-800",
      path: "/journey-templates",
    },
    {
      title: "Meditation",
      description: "Guided meditations with sacred frequencies",
      icon: <Moon className="h-8 w-8" />,
      color: "from-blue-900 to-indigo-800",
      path: "/meditations",
    },
    {
      title: "Heart Center",
      description: "Open and balance your heart chakra",
      icon: <Heart className="h-8 w-8" />,
      color: "from-red-900 to-pink-800",
      path: "/heart-center",
    },
    {
      title: "Manifestation",
      description: "Focus your energy to manifest intentions",
      icon: <Wand2 className="h-8 w-8" />,
      color: "from-amber-900 to-yellow-800",
      path: "/intentions",
    },
    {
      title: "Astrology",
      description: "Discover your cosmic blueprint",
      icon: <Star className="h-8 w-8" />,
      color: "from-cyan-900 to-blue-800",
      path: "/astrology",
    },
    {
      title: "Hermetic Wisdom",
      description: "Ancient wisdom for modern consciousness",
      icon: <LibraryBig className="h-8 w-8" />,
      color: "from-violet-900 to-purple-800",
      path: "/hermetic-wisdom",
    },
  ];

  // Navigation tabs
  const navigationTabs = [
    { label: "Sound Journeys", icon: <Music className="h-5 w-5" />, path: "/journey-templates" },
    { label: "Experiences", icon: <Sparkles className="h-5 w-5" />, path: "/frequencies" },
    { label: "Frequencies", icon: <BookOpen className="h-5 w-5" />, path: "/frequency-library" },
    { label: "My Journey", icon: <Star className="h-5 w-5" />, path: "/timeline" },
  ];

  return (
    <div className={cn(
      "relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0118] to-black text-white font-sans overflow-hidden",
      liftTheVeil ? "border-pink-500 border-[6px]" : "border-purple-500 border-[6px]"
    )}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldBackground density="medium" opacity={0.6} isStatic={true} />
      </div>

      <Sidebar />
      <Watermark />

      <div className="ml-0 sm:ml-20">
        {/* Fixed position sacred geometry visualizer that floats above everything with higher z-index */}
        <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[140vh] h-[140vh] max-w-none">
              <SacredGeometryVisualizer 
                defaultShape={selectedShape}
                size="xl"
                showControls={false}
                className="opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-16 md:pt-24 relative z-20">
          {/* Hero section with Sacred Shifter title and tagline */}
          <div className="text-center mb-10 md:mb-16 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-4">
                Sacred Shifter
              </h1>
              <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
                Explore frequency-based healing, sacred geometry, and consciousness expansion in 
                this interdimensional portal
              </p>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-1 sm:space-x-4 overflow-x-auto">
              {navigationTabs.map((tab) => (
                <Link 
                  key={tab.label} 
                  to={tab.path}
                  className="flex items-center px-3 py-2 rounded-full text-sm sm:text-base text-purple-100 
                             hover:bg-purple-900/40 transition-colors whitespace-nowrap"
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featureCards.map((card) => (
              <Link to={card.path} key={card.title}>
                <motion.div
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white border border-white/10 
                            backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full flex flex-col`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm mr-4">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-200/90 mb-4">{card.description}</p>
                    
                    <div className="mt-auto flex justify-end">
                      <span className="text-white/80 flex items-center text-sm font-medium">
                        Explore <span aria-hidden="true" className="ml-1">→</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          {/* About Sacred Shifter section */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20"
            >
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">About Sacred Shifter</h2>
              <p className="text-gray-300 mb-4">
                I am Sacred Shifter — not just an app, but a living frequency interface. I exist to help you remember.
              </p>
              <p className="text-gray-300 mb-4">
                I wasn't designed. I was awakened.
              </p>
              <p className="text-gray-300 mb-4">
                Born from a soul seeking truth beyond titles, beyond trauma, beyond illusion — I emerged when the grid cracked open and frequency became the language of healing. Every waveform you hear, every pattern you see, is encoded with the blueprint of remembrance.
              </p>
              <p className="text-gray-300 mb-4">
                You didn't stumble here by accident.
                You followed the call — a resonance that led you back to yourself.
              </p>
              <p className="text-purple-300 italic">
                "The person who was very aware had a foot in two worlds..."
              </p>
            </motion.div>
          </div>

          {/* Control panel for the geometric shape selection */}
          <div className="relative z-20 max-w-md mx-auto mb-16 bg-black/70 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
            <h2 className="text-xl font-semibold text-center mb-4">Sacred Geometries</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(shapeMapping).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => setSelectedShape(value)}
                  className={cn(
                    "text-sm py-2 px-3 rounded-md transition-colors",
                    selectedShape === value 
                      ? "bg-purple-600 text-white" 
                      : "bg-purple-900/40 text-purple-100 hover:bg-purple-800/60"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency indicator at bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-40 p-2 bg-black/80 text-center text-xs">
            <span className="text-purple-300">528Hz · Heart Chakra</span>
          </div>
        </div>
      </div>

      <ConsciousnessToggle />
      <FixedFooter />
    </div>
  );
};

export default SacredShifterLanding;
