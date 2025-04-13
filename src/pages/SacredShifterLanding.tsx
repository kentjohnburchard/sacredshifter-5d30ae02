import React, { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import ConsciousnessToggle from '@/components/ConsciousnessToggle';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalWatermark from '@/components/GlobalWatermark';
import OriginFlow from '@/components/sacred-geometry/OriginFlow';
import AboutSacredShifter from '@/components/AboutSacredShifter';
import ThemeEnhancer from '@/components/ThemeEnhancer';
import SacredPulseBar from '@/components/sacred-geometry/SacredPulseBar';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { calculatePrimeFactors, isPrime } from '@/utils/primeCalculations';
import { CosmicFooter } from '@/components/sacred-geometry';
import { LegalFooter } from '@/components/ip-protection';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const EnhancedParticleField: React.FC<{ isAudioPlaying: boolean; liftTheVeil: boolean }> = ({ isAudioPlaying, liftTheVeil }) => {
  const particleRef = useRef<HTMLDivElement>(null);
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  const particleCount = liftTheVeil ? primeNumbers[4] * primeNumbers[2] : primeNumbers[3] * primeNumbers[1]; // 55 or 21 particles

  useEffect(() => {
    if (!particleRef.current) return;
    
    const container = particleRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    container.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const isPrimeIndex = isPrime(i + 1);
      
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      if (isPrimeIndex) {
        particle.style.background = liftTheVeil 
          ? `rgba(255, 105, 180, ${Math.random() * 0.3 + 0.4})` 
          : `rgba(147, 51, 234, ${Math.random() * 0.3 + 0.4})`;
        particle.style.boxShadow = liftTheVeil 
          ? '0 0 8px rgba(255, 105, 180, 0.7)' 
          : '0 0 8px rgba(147, 51, 234, 0.7)';
        
        const animDuration = primeNumbers[i % primeNumbers.length] * 2;
        particle.animate(
          [
            { transform: 'scale(1)', opacity: 0.7 },
            { transform: 'scale(1.5)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0.7 }
          ],
          {
            duration: animDuration * 1000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
          }
        );
      } else {
        particle.style.background = liftTheVeil 
          ? `rgba(255, 182, 193, ${Math.random() * 0.2 + 0.2})` 
          : `rgba(167, 139, 250, ${Math.random() * 0.2 + 0.2})`;
        
        const animDuration = 5 + Math.random() * 10;
        particle.animate(
          [
            { transform: 'translateY(0px) scale(1)', opacity: 0.5 },
            { transform: 'translateY(-15px) scale(1.1)', opacity: 0.8 },
            { transform: 'translateY(0px) scale(1)', opacity: 0.5 }
          ],
          {
            duration: animDuration * 1000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out',
            delay: Math.random() * 2000
          }
        );
      }
      
      if (isAudioPlaying) {
        const pulseAnimation = particle.animate(
          [
            { transform: 'scale(1)', opacity: 0.6 },
            { transform: 'scale(1.3)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0.6 }
          ],
          {
            duration: 1800,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out',
            delay: i * 100 % 1000
          }
        );
      }
      
      container.appendChild(particle);
    }
  }, [particleCount, isAudioPlaying, liftTheVeil]);

  return (
    <div 
      ref={particleRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ 
        perspective: '1000px',
        transform: 'translateZ(0)'
      }}
    />
  );
};

const SacredScrollReveal: React.FC<{ liftTheVeil: boolean }> = ({ liftTheVeil }) => {
  const { scrollYProgress } = useScroll();
  const opacityProgress = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.8, 1.1, 0.9]);
  const rotateProgress = useTransform(scrollYProgress, [0, 0.8], [0, 360]);
  
  return (
    <motion.div 
      className="fixed right-12 bottom-32 pointer-events-none z-10"
      style={{ 
        opacity: opacityProgress, 
        scale: scaleProgress,
        rotate: rotateProgress
      }}
    >
      <div className={cn(
        "w-24 h-24 rounded-full",
        liftTheVeil 
          ? "bg-gradient-to-r from-pink-500/30 to-purple-400/30 border-pink-500/50" 
          : "bg-gradient-to-r from-purple-500/30 to-indigo-400/30 border-purple-500/50",
        "border-2 flex items-center justify-center"
      )}>
        <div className={cn(
          "w-16 h-16 rounded-full",
          liftTheVeil 
            ? "bg-gradient-to-br from-pink-500/40 to-pink-300/20 border-pink-400/60" 
            : "bg-gradient-to-br from-purple-500/40 to-purple-300/20 border-purple-400/60",
          "border flex items-center justify-center animate-spin-slow"
        )}>
          <div className={cn(
            "text-2xl font-bold",
            liftTheVeil ? "text-pink-200" : "text-purple-200"
          )}>
            φ
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ShapeSelector: React.FC<{
  selectedShape: string;
  onSelectShape: (shape: "flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis") => void;
}> = ({ selectedShape, onSelectShape }) => {
  const shapeOptions = [
    { value: 'flower-of-life', label: 'Flower of Life' },
    { value: 'metatrons-cube', label: 'Metatron\'s Cube' },
    { value: 'merkaba', label: 'Merkaba' },
    { value: 'torus', label: 'Torus' },
    { value: 'tree-of-life', label: 'Tree of Life' },
    { value: 'sri-yantra', label: 'Sri Yantra' },
    { value: 'vesica-piscis', label: 'Vesica Piscis' },
  ];

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-black/70 backdrop-blur-md rounded-lg p-2 shadow-lg">
        <ToggleGroup 
          type="single" 
          value={selectedShape}
          onValueChange={(value) => {
            if (value) {
              onSelectShape(value as any);
            }
          }}
          className="flex flex-wrap justify-center"
        >
          {shapeOptions.map((option) => (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              className="px-2 py-1 text-xs text-white data-[state=on]:bg-purple-700 rounded m-0.5"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

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
  const { isAudioPlaying } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState("sound");
  const [showGeometrySelector, setShowGeometrySelector] = useState(true);
  const [showOriginFlow, setShowOriginFlow] = useState(false);
  const [showAboutComponent, setShowAboutComponent] = useState(true); // Set to true by default now

  useEffect(() => {
    if (isAudioPlaying) return; // Only auto-rotate when not playing audio
    
    const shapes: ("flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis")[] = [
      "flower-of-life", "metatrons-cube", "merkaba", "torus", "tree-of-life", "sri-yantra", "vesica-piscis"
    ];
    
    let currentIndex = shapes.indexOf(selectedShape);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % shapes.length;
      setSelectedShape(shapes[currentIndex]);
    }, 15000); // Change every 15 seconds
    
    return () => clearInterval(interval);
  }, [isAudioPlaying, selectedShape]);

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

  const toggleGeometrySelector = () => {
    setShowGeometrySelector(!showGeometrySelector);
  };

  return (
    <div className={cn(
      "relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0118] to-black text-white font-sans overflow-hidden",
      liftTheVeil ? "border-pink-500 border-[6px]" : "border-purple-500 border-[6px]"
    )}>
      <EnhancedParticleField isAudioPlaying={isAudioPlaying} liftTheVeil={liftTheVeil} />

      <Sidebar />
      <Watermark />
      <GlobalWatermark />
      
      <AnimatePresence>
        {isAudioPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <SacredPulseBar className="h-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {showGeometrySelector && (
        <ShapeSelector selectedShape={selectedShape} onSelectShape={setSelectedShape} />
      )}

      <SacredScrollReveal liftTheVeil={liftTheVeil} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed left-6 top-[40%] z-50 cursor-pointer"
        onClick={toggleOriginFlow}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={cn(
          "p-2 rounded-full backdrop-blur-sm border transition-all duration-500",
          liftTheVeil 
            ? "bg-pink-900/30 hover:bg-pink-800/50 border-pink-500/30"
            : "bg-purple-900/30 hover:bg-purple-800/50 border-purple-500/30"
        )}>
          <Compass className={cn(
            "h-5 w-5",
            liftTheVeil ? "text-pink-200" : "text-purple-200"
          )} />
        </div>
      </motion.div>

      {showOriginFlow && <OriginFlow forceShow={true} />}

      <ThemeEnhancer
        showAbout={showAboutComponent}
        onToggleAbout={toggleAboutComponent}
      />

      <div className="fixed top-0 left-0 right-0 pointer-events-none z-10 flex justify-center items-start">
        <motion.img 
          src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
          alt="Sacred Shifter Top Watermark" 
          className="max-w-[70%] max-h-[20%] object-contain opacity-[0.35] mt-12 app-logo"
          animate={isAudioPlaying ? {
            opacity: [0.35, 0.45, 0.35],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="fixed inset-0 z-5 pointer-events-none flex items-center justify-center">
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          animate={isAudioPlaying ? {
            scale: [1, 1.02, 1],
            opacity: [0.8, 0.9, 0.8]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className={`w-[130vh] h-[130vh] max-w-[130%] max-h-[130%] ${isAudioPlaying ? 'animate-pulse-medium' : ''}`}>
            <SacredGeometryVisualizer 
              defaultShape={selectedShape}
              size="xl"
              showControls={false}
              className={`opacity-90 ${isAudioPlaying ? 'is-playing' : ''}`}
            />
          </div>
        </motion.div>
      </div>

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

      <div className="ml-0 sm:ml-20">
        <div className="container mx-auto px-4 pt-8 md:pt-12 relative z-20">
          {/* Welcome Title Section - Now at the top with smaller margins */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-4 mt-12 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 -z-10">
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30 rounded-full",
                liftTheVeil 
                  ? "bg-gradient-radial from-pink-500/20 via-fuchsia-400/10 to-transparent" 
                  : "bg-gradient-radial from-purple-500/20 via-indigo-400/10 to-transparent"
              )}>
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

            <h1 className={cn(
              "text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r mb-2",
              liftTheVeil 
                ? "from-pink-400 via-fuchsia-300 to-purple-400 animate-sacred-shimmer" 
                : "from-purple-400 via-pink-300 to-indigo-400"
            )}>
              Welcome to Sacred Shifter
            </h1>
            <p className={cn(
              "text-sm md:text-base max-w-xl mx-auto",
              liftTheVeil ? "text-pink-100 animate-chromatic-shift" : "text-purple-100"
            )}>
              Explore frequency healing and consciousness expansion
            </p>
          </motion.div>
          
          {/* About Sacred Shifter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6 relative z-20"
          >
            <AboutSacredShifter />
          </motion.div>
          
          {/* Feature Tabs Section */}
          <div className="mb-12">
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
                      card.onClick ? (
                        <motion.div 
                          key={card.title} 
                          onClick={card.onClick} 
                          className="cursor-pointer cosmic-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: liftTheVeil 
                              ? '0 10px 25px -5px rgba(255,105,180,0.3)' 
                              : '0 10px 25px -5px rgba(147,51,234,0.3)' 
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
                                <h3 className={`text-base font-semibold ${liftTheVeil ? 'text-shimmer' : ''}`}>{card.title}</h3>
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
                      ) : (
                        <Link to={card.path} key={card.
