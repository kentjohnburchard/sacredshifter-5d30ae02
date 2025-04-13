
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Music, Heart, Sparkles, BookOpen, Star, Moon, LibraryBig, Wand2, Compass, Brain, Activity, Map } from 'lucide-react';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import Sidebar from '@/components/Sidebar';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalWatermark from '@/components/GlobalWatermark';
import { CosmicFooter } from '@/components/sacred-geometry';
import { LegalFooter } from '@/components/ip-protection';

// Enhanced Starfield Background
const EnhancedStarfield: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black">
        <StarfieldBackground starCount={200} speed={0.5} />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/60"></div>
    </div>
  );
};

// Simple content changer for sigil clicks
const ContentSection: React.FC<{ pageState: string }> = ({ pageState }) => {
  return (
    <div className="mt-8 max-w-3xl mx-auto">
      {pageState === "normal" ? (
        <div className="cosmic-glass p-6 rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/30">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-300">Sacred Geometry</h3>
          <p className="text-gray-200 mb-3">
            Sacred geometry is the foundation of all creation, the blueprint of reality itself.
            Each pattern connects to a specific vibration and consciousness state.
          </p>
          <p className="text-gray-200">
            As you explore these forms, notice how your energy field responds to each pattern.
            Your resonance is unique - trust what you're drawn to.
          </p>
        </div>
      ) : (
        <div className="cosmic-glass p-6 rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/30">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-300">Frequency Science</h3>
          <p className="text-gray-200 mb-3">
            Everything in existence is energy, vibrating at different frequencies. 
            Your thoughts, emotions, and physical body are all waveforms of consciousness.
          </p>
          <p className="text-gray-200">
            The Sacred Shifter library contains tone patterns specifically calibrated to help
            realign your personal frequency field with more coherent states of being.
          </p>
        </div>
      )}
    </div>
  );
};

// Sacred scroll reveal animation (spiral sigil in corner)
const SacredScrollReveal: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { scrollYProgress } = useScroll();
  const opacityProgress = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.8, 1.1, 0.9]);
  const rotateProgress = useTransform(scrollYProgress, [0, 0.8], [0, 360]);
  
  return (
    <motion.div 
      className="fixed right-12 bottom-32 cursor-pointer z-10"
      style={{ 
        opacity: opacityProgress, 
        scale: scaleProgress,
        rotate: rotateProgress
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-400/30 border-purple-500/50 border-2 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-300/20 border-purple-400/60 border flex items-center justify-center animate-spin-slow">
          <div className="text-2xl font-bold text-purple-200">
            φ
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SacredShifterLanding: React.FC = () => {
  // State management
  const [selectedShape, setSelectedShape] = useState<"flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis">("flower-of-life");
  const { liftTheVeil } = useTheme();
  const [activeTab, setActiveTab] = useState("sound");
  const [pageState, setPageState] = useState<"normal" | "sacred">("normal");
  
  // Auto-cycle through shapes
  useEffect(() => {
    const shapes: ("flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis")[] = [
      "flower-of-life", "metatrons-cube", "merkaba", "torus", "tree-of-life", "sri-yantra", "vesica-piscis"
    ];
    
    let currentIndex = shapes.indexOf(selectedShape);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % shapes.length;
      setSelectedShape(shapes[currentIndex]);
    }, 15000); // Change every 15 seconds
    
    return () => clearInterval(interval);
  }, [selectedShape]);

  // Change page state when sigil is clicked
  const handleSigilClick = () => {
    setPageState(prev => prev === "normal" ? "sacred" : "normal");
  };

  // Feature categories for the navigation tabs
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
  };

  // Navigation tabs configuration
  const navigationTabs = [
    { label: "Sound Journeys", icon: <Music className="h-5 w-5" />, value: "sound" },
    { label: "Experiences", icon: <Sparkles className="h-5 w-5" />, value: "experiences" },
    { label: "Sacred Wisdom", icon: <BookOpen className="h-5 w-5" />, value: "wisdom" },
    { label: "My Journey", icon: <Star className="h-5 w-5" />, value: "journey" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Enhanced starfield background */}
      <EnhancedStarfield />

      {/* Core UI components */}
      <Sidebar />
      <Watermark />
      <GlobalWatermark />
      
      {/* Sacred Shifter logo */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-10 flex justify-center items-start">
        <motion.img 
          src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
          alt="Sacred Shifter Top Watermark" 
          className="max-w-[70%] max-h-[20%] object-contain opacity-[0.35] mt-12 app-logo"
          animate={{
            opacity: [0.35, 0.45, 0.35],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="ml-0 sm:ml-20">
        <div className="container mx-auto px-4 pt-8 md:pt-12 relative z-20">
          {/* Welcome Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-4 mt-8 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30 rounded-full bg-gradient-radial from-purple-500/20 via-indigo-400/10 to-transparent">
                <motion.div 
                  className="w-full h-full" 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                  }}
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-2">
              Welcome to Sacred Shifter
            </h1>
            <p className="text-sm md:text-base max-w-xl mx-auto text-purple-100">
              Explore frequency healing and consciousness expansion
            </p>
          </motion.div>
          
          {/* Feature Tabs Section */}
          <div className="mb-6">
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <div className="flex justify-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent pb-2">
                <TabsList className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1.5 flex items-center justify-start mx-auto w-auto overflow-x-auto no-scrollbar">
                  {navigationTabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm text-purple-100 
                               hover:bg-purple-900/40 transition-colors data-[state=active]:bg-purple-800/70 whitespace-nowrap"
                    >
                      <span className="hidden sm:block mr-1">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {Object.keys(categoryFeatures).map((tabKey) => (
                <TabsContent key={tabKey} value={tabKey} className="mt-6 animate-fade-in">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                  >
                    {categoryFeatures[tabKey as keyof typeof categoryFeatures].map((card, index) => (
                      <Link to={card.path} key={card.title}>
                        <motion.div 
                          className="cosmic-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: '0 10px 25px -5px rgba(147,51,234,0.3)'
                          }}
                        >
                          <div 
                            className={`bg-gradient-to-br ${card.color} rounded-lg p-3 text-white border border-white/10 
                                       backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full flex flex-col cosmic-glass-hover`}
                          >
                            <div className="flex flex-col h-full">
                              <div className="flex items-center mb-1">
                                <motion.div 
                                  className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm mr-2"
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{
                                    duration: 3, 
                                    repeat: Infinity, 
                                    repeatType: "reverse",
                                    delay: index * 0.5
                                  }}
                                >
                                  {card.icon}
                                </motion.div>
                                <h3 className="text-base font-semibold">{card.title}</h3>
                              </div>
                              
                              <p className="text-xs text-gray-200/90 mt-1">{card.description}</p>
                              
                              <div className="mt-auto pt-1 flex justify-end">
                                <motion.span 
                                  className="text-white/80 flex items-center text-xs font-medium"
                                  whileHover={{ x: 3 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  Explore <span aria-hidden="true" className="ml-1">→</span>
                                </motion.span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Content section - changes when sigil is clicked */}
          <ContentSection pageState={pageState} />
          
          {/* Main sacred geometry visualization */}
          <div className="relative mt-12 mb-16 z-10 flex items-center justify-center">
            <motion.div 
              className="w-full h-[50vh] sm:h-[60vh] flex items-center justify-center"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.8, 0.9, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full max-w-[90%] max-h-[90%]">
                <SacredGeometryVisualizer 
                  defaultShape={selectedShape}
                  size="xl"
                  showControls={true}
                  className="opacity-90"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Secondary sacred geometry visualization */}
          <div className="fixed bottom-0 right-0 z-4 pointer-events-none">
            <motion.div
              className="w-[40vh] h-[40vh] opacity-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <SacredGeometryVisualizer 
                defaultShape={selectedShape === 'flower-of-life' ? 'merkaba' : 'flower-of-life'}
                size="md"
                showControls={false}
                className="opacity-70"
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Sacred scroll reveal */}
      <SacredScrollReveal onClick={handleSigilClick} />
      
      {/* Footer sections */}
      <div className="relative z-20">
        <LegalFooter />
      </div>
      
      <CosmicFooter />
    </div>
  );
};

export default SacredShifterLanding;
