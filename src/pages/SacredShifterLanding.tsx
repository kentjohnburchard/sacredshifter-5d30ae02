
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalWatermark from '@/components/GlobalWatermark';

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
  const [activeTab, setActiveTab] = useState("sound");
  const [showGeometrySelector, setShowGeometrySelector] = useState(false);

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

  // Feature cards data grouped by category
  const categoryFeatures = {
    sound: [
      {
        title: "Sound Healing",
        description: "Frequency-based sound healing journeys",
        icon: <Music className="h-7 w-7" />,
        color: "from-purple-900 to-indigo-800",
        path: "/journey-templates",
      },
      {
        title: "Meditation",
        description: "Guided meditations with sacred frequencies",
        icon: <Moon className="h-7 w-7" />,
        color: "from-blue-900 to-indigo-800",
        path: "/meditations",
      },
    ],
    experiences: [
      {
        title: "Heart Center",
        description: "Open and balance your heart chakra",
        icon: <Heart className="h-7 w-7" />,
        color: "from-red-900 to-pink-800",
        path: "/heart-center",
      },
      {
        title: "Manifestation",
        description: "Focus your energy to manifest intentions",
        icon: <Wand2 className="h-7 w-7" />,
        color: "from-amber-900 to-yellow-800",
        path: "/intentions",
      },
    ],
    frequencies: [
      {
        title: "Astrology",
        description: "Discover your cosmic blueprint",
        icon: <Star className="h-7 w-7" />,
        color: "from-cyan-900 to-blue-800",
        path: "/astrology",
      },
      {
        title: "Hermetic Wisdom",
        description: "Ancient wisdom for modern consciousness",
        icon: <LibraryBig className="h-7 w-7" />,
        color: "from-violet-900 to-purple-800",
        path: "/hermetic-wisdom",
      },
    ],
    journey: [
      {
        title: "Timeline",
        description: "Track your consciousness journey",
        icon: <Sparkles className="h-7 w-7" />,
        color: "from-green-900 to-teal-800",
        path: "/timeline",
      },
      {
        title: "Sacred Blueprint",
        description: "Discover your unique energetic pattern",
        icon: <BookOpen className="h-7 w-7" />,
        color: "from-indigo-900 to-blue-800",
        path: "/sacred-blueprint",
      },
    ],
  };

  // All features combined for tile display
  const allFeatures = [
    ...categoryFeatures.sound,
    ...categoryFeatures.experiences,
    ...categoryFeatures.frequencies,
    ...categoryFeatures.journey
  ];

  // Navigation tabs
  const navigationTabs = [
    { label: "Sound Journeys", icon: <Music className="h-5 w-5" />, value: "sound" },
    { label: "Experiences", icon: <Sparkles className="h-5 w-5" />, value: "experiences" },
    { label: "Frequencies", icon: <BookOpen className="h-5 w-5" />, value: "frequencies" },
    { label: "My Journey", icon: <Star className="h-5 w-5" />, value: "journey" },
  ];

  // Toggle geometry selector
  const toggleGeometrySelector = () => {
    setShowGeometrySelector(!showGeometrySelector);
  };

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
      <GlobalWatermark />

      <div className="ml-0 sm:ml-20">
        {/* Fixed position sacred geometry visualizer positioned lower on the page */}
        <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center mt-40">
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

        <div className="container mx-auto px-4 pt-24 md:pt-40 relative z-20">
          {/* Hero section with Sacred Shifter title and tagline */}
          <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-6">
                Welcome to Sacred Shifter
              </h1>
              <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
                Explore frequency-based healing, sacred geometry, and consciousness expansion in 
                this interdimensional portal
              </p>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center mx-auto">
              {navigationTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center px-3 py-2 rounded-full text-sm sm:text-base text-purple-100 
                           hover:bg-purple-900/40 transition-colors whitespace-nowrap data-[state=active]:bg-purple-800/70"
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Feature Tiles Grid - All features shown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-16 animate-fade-in">
              {allFeatures.map((card) => (
                <Link to={card.path} key={card.title} className="block">
                  <motion.div
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className={`bg-gradient-to-br ${card.color} rounded-lg p-4 text-white border border-white/10 
                              backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full flex flex-col`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm mr-3">
                          {card.icon}
                        </div>
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                      </div>
                      
                      <p className="text-xs text-gray-200/90 mt-1">{card.description}</p>
                      
                      <div className="mt-auto pt-2 flex justify-end">
                        <span className="text-white/80 flex items-center text-xs font-medium">
                          Explore <span aria-hidden="true" className="ml-1">→</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Tabs>
          
          {/* About Sacred Shifter section */}
          <div className="mb-24 text-center">
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

          {/* Spacer to push content above the floating geometry selector */}
          <div className="h-24"></div>
        </div>
      </div>

      {/* Floating Sacred Geometry Selector */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30 shadow-lg shadow-purple-900/20"
        >
          <h2 className="text-lg font-semibold text-center mb-3">Sacred Geometries</h2>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(shapeMapping).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSelectedShape(value)}
                className={cn(
                  "text-xs py-2 px-2 rounded-md transition-colors text-center",
                  selectedShape === value 
                    ? "bg-purple-600 text-white" 
                    : "bg-purple-900/40 text-purple-100 hover:bg-purple-800/60"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <ConsciousnessToggle />
      <FixedFooter />
    </div>
  );
};

export default SacredShifterLanding;
