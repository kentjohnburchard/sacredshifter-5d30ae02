import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SacredFlowerOfLife from '@/components/sacred-geometry/shapes/SacredFlowerOfLife';
import MetatronsCube from '@/components/sacred-geometry/shapes/MetatronsCube';
import Merkaba from '@/components/sacred-geometry/shapes/Merkaba';
import Torus from '@/components/sacred-geometry/shapes/Torus';
import TreeOfLife from '@/components/sacred-geometry/shapes/TreeOfLife';
import SriYantra from '@/components/sacred-geometry/shapes/SriYantra';
import VesicaPiscis from '@/components/sacred-geometry/shapes/VesicaPiscis';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import { Music, Heart, Sparkles, BookOpen, Star, Moon, LibraryBig, Wand2, Compass, Brain, Activity, Map } from 'lucide-react';
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
import OriginFlow from '@/components/sacred-geometry/OriginFlow';
import AboutSacredShifter from '@/components/AboutSacredShifter';
import PrimeSigilActivator from '@/components/sacred-geometry/PrimeSigilActivator';

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
  const [showOriginFlow, setShowOriginFlow] = useState(false);
  const [showAboutComponent, setShowAboutComponent] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shapeMapping: Record<string, "flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis"> = {
    'Flower of Life': 'flower-of-life',
    "Metatron's Cube": 'metatrons-cube',
    'Merkaba': 'merkaba',
    'Torus': 'torus',
    'Tree of Life': 'tree-of-life',
    'Sri Yantra': 'sri-yantra',
    'Vesica Piscis': 'vesica-piscis',
  };

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
      {
        title: "Frequency Library",
        description: "Explore sacred tones and frequencies",
        icon: <Activity className="h-7 w-7" />,
        color: "from-cyan-900 to-blue-800",
        path: "/frequency-library",
      },
      {
        title: "Music Generator",
        description: "Create custom healing soundscapes",
        icon: <Music className="h-7 w-7" />,
        color: "from-indigo-900 to-blue-700", 
        path: "/music-generator",
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
      {
        title: "Mirror Portal",
        description: "Self-reflection and consciousness expansion",
        icon: <Compass className="h-7 w-7" />,
        color: "from-emerald-900 to-teal-800",
        path: "/mirror-portal",
      },
      {
        title: "Perception Shift",
        description: "Transform how you see reality",
        icon: <Brain className="h-7 w-7" />,
        color: "from-violet-900 to-purple-800",
        path: "/shift-perception",
      },
    ],
    wisdom: [
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
      {
        title: "Trinity Gateway",
        description: "Experience the three-fold path of awakening",
        icon: <Sparkles className="h-7 w-7" />,
        color: "from-amber-900 to-orange-800",
        path: "/trinity-gateway",
      },
      {
        title: "Soul Scribe",
        description: "Sacred writing and wisdom channeling",
        icon: <BookOpen className="h-7 w-7" />,
        color: "from-blue-900 to-indigo-800",
        path: "/soul-scribe",
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
      {
        title: "Harmonic Map",
        description: "Visualize your frequency alignment",
        icon: <Map className="h-7 w-7" />,
        color: "from-purple-900 to-indigo-800",
        path: "/harmonic-map",
      },
      {
        title: "Energy Check",
        description: "Assess and balance your energy field",
        icon: <Activity className="h-7 w-7" />,
        color: "from-pink-900 to-red-800",
        path: "/energy-check",
      },
    ],
    about: [
      {
        title: "About Sacred Shifter",
        description: "Learn about our consciousness mission",
        icon: <Sparkles className="h-7 w-7" />,
        color: "from-purple-900 to-indigo-800",
        path: "/about",
        onClick: () => setShowAboutComponent(!showAboutComponent),
      },
      {
        title: "About Founder",
        description: "Meet the creator behind Sacred Shifter",
        icon: <Heart className="h-7 w-7" />,
        color: "from-pink-900 to-red-800",
        path: "/about-founder",
      },
      {
        title: "Origin Flow",
        description: "Discover the primal source codes",
        icon: <Compass className="h-7 w-7" />,
        color: "from-cyan-900 to-blue-800",
        onClick: () => setShowOriginFlow(!showOriginFlow),
      },
      {
        title: "Contact Us",
        description: "Reach out with questions or insights",
        icon: <Star className="h-7 w-7" />,
        color: "from-blue-900 to-indigo-800",
        path: "/contact",
      },
    ],
  };

  const allFeatures = [
    ...categoryFeatures.sound,
    ...categoryFeatures.experiences, 
    ...categoryFeatures.wisdom,
    ...categoryFeatures.journey,
    ...categoryFeatures.about
  ];

  const navigationTabs = [
    { label: "Sound Journeys", icon: <Music className="h-5 w-5" />, value: "sound" },
    { label: "Experiences", icon: <Sparkles className="h-5 w-5" />, value: "experiences" },
    { label: "Sacred Wisdom", icon: <BookOpen className="h-5 w-5" />, value: "wisdom" },
    { label: "My Journey", icon: <Star className="h-5 w-5" />, value: "journey" },
    { label: "About", icon: <Compass className="h-5 w-5" />, value: "about" },
  ];

  const toggleOriginFlow = () => {
    setShowOriginFlow(!showOriginFlow);
  };

  const toggleAboutComponent = () => {
    setShowAboutComponent(!showAboutComponent);
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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed left-6 top-[50%] z-50 cursor-pointer"
        onClick={toggleOriginFlow}
      >
        <div className="p-2 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 transition-colors">
          <Compass className="h-5 w-5 text-purple-200" />
        </div>
      </motion.div>

      {showOriginFlow && <OriginFlow forceShow={true} />}

      {showAboutComponent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute right-4 top-4 text-white/60 hover:text-white z-10"
              onClick={toggleAboutComponent}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <AboutSacredShifter />
          </div>
        </motion.div>
      )}

      <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-start">
        <img 
          src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
          alt="Sacred Shifter Top Watermark" 
          className="max-w-[70%] max-h-[20%] object-contain opacity-[0.35] mt-12" 
        />
      </div>

      <div className="ml-0 sm:ml-20">
        <div className="fixed inset-0 z-5 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90vh] h-[90vh] max-w-[90%] max-h-[90%]">
              <SacredGeometryVisualizer 
                defaultShape={selectedShape}
                size="xl"
                showControls={false}
                className="opacity-80"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-24 md:pt-32 relative z-20">
          <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
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

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-12">
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
            
            {Object.keys(categoryFeatures).map((category) => (
              <TabsContent key={category} value={category} className="animate-fade-in mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                  {categoryFeatures[category as keyof typeof categoryFeatures].map((card) => (
                    card.onClick ? (
                      <div key={card.title} onClick={card.onClick} className="cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          className={`bg-gradient-to-br ${card.color} rounded-lg p-3 text-white border border-white/10 
                                    backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full flex flex-col`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-center mb-1">
                              <div className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm mr-2">
                                {card.icon}
                              </div>
                              <h3 className="text-base font-semibold">{card.title}</h3>
                            </div>
                            
                            <p className="text-xs text-gray-200/90 mt-1">{card.description}</p>
                            
                            <div className="mt-auto pt-1 flex justify-end">
                              <span className="text-white/80 flex items-center text-xs font-medium">
                                Explore <span aria-hidden="true" className="ml-1">→</span>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <Link to={card.path} key={card.title} className="block">
                        <motion.div
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          className={`bg-gradient-to-br ${card.color} rounded-lg p-3 text-white border border-white/10 
                                    backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full flex flex-col`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-center mb-1">
                              <div className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm mr-2">
                                {card.icon}
                              </div>
                              <h3 className="text-base font-semibold">{card.title}</h3>
                            </div>
                            
                            <p className="text-xs text-gray-200/90 mt-1">{card.description}</p>
                            
                            <div className="mt-auto pt-1 flex justify-end">
                              <span className="text-white/80 flex items-center text-xs font-medium">
                                Explore <span aria-hidden="true" className="ml-1">→</span>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    )
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="h-24"></div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-40">
        <div onClick={toggleAboutComponent} className="cursor-pointer">
          <PrimeSigilActivator size="md" />
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 max-w-sm w-full">
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
