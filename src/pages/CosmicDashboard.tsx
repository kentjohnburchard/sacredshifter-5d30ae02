
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CosmicContainer, SacredVisualizer, CosmicFooter, SacredGeometryVisualizer } from "@/components/sacred-geometry";
import StarfieldBackground from "@/components/sacred-geometry/StarfieldBackground";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  Music, Heart, Wand2, Lightbulb, 
  Sparkles, Moon, CloudSun, BookOpen,
  Clock, Headphones, Waves 
} from "lucide-react";

const CosmicDashboard = () => {
  const [selectedShape, setSelectedShape] = useState<
    "flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "sphere"
  >("flower-of-life");
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  const journeyCategories = [
    {
      id: "sound-healing",
      title: "Sound Healing",
      icon: <Waves className="h-5 w-5" />,
      color: "bg-purple-500",
      description: "Frequency-based sound healing journeys",
      path: "/journey-templates",
    },
    {
      id: "meditation",
      title: "Meditation",
      icon: <Moon className="h-5 w-5" />,
      color: "bg-blue-500",
      description: "Guided meditations with sacred frequencies",
      path: "/journey-templates?tab=meditation",
    },
    {
      id: "heart-center",
      title: "Heart Center",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-pink-500",
      description: "Open and balance your heart chakra",
      path: "/heart-center",
    },
    {
      id: "manifestation",
      title: "Manifestation",
      icon: <Wand2 className="h-5 w-5" />,
      color: "bg-amber-500",
      description: "Focus your energy to manifest intentions",
      path: "/focus",
    },
    {
      id: "astrology",
      title: "Astrology",
      icon: <CloudSun className="h-5 w-5" />,
      color: "bg-teal-500",
      description: "Discover your cosmic blueprint",
      path: "/astrology",
    },
    {
      id: "hermetic-wisdom",
      title: "Hermetic Wisdom",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-indigo-500",
      description: "Ancient wisdom for modern consciousness",
      path: "/hermetic-wisdom",
    },
  ];
  
  const featuredFrequencies = [
    { value: 432, name: "Miracle Tone", chakra: "Heart" },
    { value: 528, name: "Love Frequency", chakra: "Heart" },
    { value: 396, name: "Liberation Frequency", chakra: "Root" },
    { value: 639, name: "Connection Frequency", chakra: "Heart" },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  // Enhanced easter egg functionality
  const handleVisualizerClick = () => {
    setIsPlaying(!isPlaying);
    setEasterEggClicks(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        console.log("Easter egg activated!");
        toast.success("🎉 You found the secret frequency! Enlightenment awaits.", {
          duration: 5000,
        });
        setShowEasterEgg(true);
        return 0;
      }
      return newCount;
    });
  };

  // Reset easter egg after timeout
  useEffect(() => {
    if (showEasterEgg) {
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showEasterEgg]);
  
  return (
    <Layout pageTitle="Sacred Shifter" showFooter={false}>
      {/* Starfield background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldBackground density="medium" opacity={0.6} isStatic={false} />
      </div>
      
      {/* Fixed position visualizer controls at the top right */}
      <div className="fixed top-20 right-8 z-50 bg-black/80 backdrop-blur-md rounded-lg p-2 shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap gap-1">
          {["flower-of-life", "metatrons-cube", "merkaba", "torus", "sphere"].map((shape) => (
            <button
              key={shape}
              onClick={() => setSelectedShape(shape as any)}
              className={`text-xs py-1 px-2 rounded-md transition-colors ${
                selectedShape === shape 
                  ? "bg-purple-600 text-white" 
                  : "bg-purple-900/40 text-purple-100 hover:bg-purple-800/60"
              }`}
            >
              {shape.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Sacred Geometry Visualizer - fixed position */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <SacredGeometryVisualizer 
            defaultShape={selectedShape}
            size="xl"
            showControls={false}
          />
        </div>
      </div>
      
      {/* Easter egg animation overlay */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 3 }}
              className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-70"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                528Hz Activated
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 pb-24 relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 pt-4">
          <div className="w-full md:w-1/2 text-center md:text-left mb-4 md:mb-0 z-20">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
            >
              Welcome to Sacred Shifter
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-purple-100/80 max-w-2xl"
            >
              Welcome to your frequency sanctuary. Unlock sacred codes, align with sound, and shift your consciousness.
            </motion.p>
          </div>
          
          <div className="w-full md:w-1/2 h-64 md:h-80 flex items-center justify-center relative z-30">
            <div 
              className="w-full h-full cursor-pointer px-2" 
              onClick={handleVisualizerClick}
              title="Click 7 times for a surprise"
            >
              <div className="w-full h-full flex items-center justify-center">
                {/* This visualizer is just for interactions, main visualizer is fixed position */}
                <div className="w-full h-full opacity-40 hover:opacity-70 transition-opacity">
                  <SacredGeometryVisualizer 
                    defaultShape={selectedShape}
                    size="lg"
                    showControls={false}
                    className="transform scale-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 relative z-10"
        >
          <Tabs defaultValue="journeys" className="w-full">
            <TabsList className="w-full flex justify-center mb-6 bg-black/30 backdrop-blur-sm">
              <TabsTrigger value="journeys" className="data-[state=active]:bg-purple-900/50">
                <Music className="h-4 w-4 mr-2" /> Sound Journeys
              </TabsTrigger>
              <TabsTrigger value="experiences" className="data-[state=active]:bg-purple-900/50">
                <Sparkles className="h-4 w-4 mr-2" /> Experiences
              </TabsTrigger>
              <TabsTrigger value="frequencies" className="data-[state=active]:bg-purple-900/50">
                <Headphones className="h-4 w-4 mr-2" /> Frequencies
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-900/50">
                <Clock className="h-4 w-4 mr-2" /> My Journey
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="journeys">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journeyCategories.map((category, i) => (
                  <motion.div
                    key={category.id}
                    custom={i}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link to={category.path} className="block h-full">
                      <CosmicContainer 
                        className="h-full transition-transform hover:translate-y-[-5px]"
                        glowColor={
                          category.id === "heart-center" ? "pink" :
                          category.id === "manifestation" ? "gold" :
                          category.id === "astrology" ? "blue" :
                          category.id === "hermetic-wisdom" ? "purple" :
                          "purple"
                        }
                      >
                        <div className="p-6 h-full flex flex-col">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${category.color} bg-opacity-20`}>
                            {category.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                          <p className="text-purple-100/70 mb-6 text-sm">{category.description}</p>
                          <div className="mt-auto flex justify-end">
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="text-purple-300 text-sm font-medium"
                            >
                              Explore →
                            </motion.div>
                          </div>
                        </div>
                      </CosmicContainer>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="experiences">
              <CosmicContainer className="p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Sacred Experiences</h2>
                <p className="text-purple-100/80 mb-8">
                  Expand your consciousness through multidimensional experiences tailored to 
                  your energy state. Each journey combines frequency healing with sacred geometry
                  to create profound shifts.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/20">
                    <Sparkles className="h-5 w-5 mb-2 text-indigo-400" />
                    <h3 className="text-lg font-medium text-white mb-1">Energy Check</h3>
                    <p className="text-sm text-indigo-200/70">Calibrate your frequency to daily vibrations</p>
                    <Link to="/energy-check" className="text-indigo-400 text-xs mt-2 block">Begin →</Link>
                  </div>
                  
                  <div className="bg-rose-900/30 rounded-lg p-4 border border-rose-500/20">
                    <Heart className="h-5 w-5 mb-2 text-rose-400" />
                    <h3 className="text-lg font-medium text-white mb-1">Heart Center</h3>
                    <p className="text-sm text-rose-200/70">Open and balance your heart chakra</p>
                    <Link to="/heart-center" className="text-rose-400 text-xs mt-2 block">Begin →</Link>
                  </div>
                  
                  <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-500/20">
                    <Lightbulb className="h-5 w-5 mb-2 text-amber-400" />
                    <h3 className="text-lg font-medium text-white mb-1">Hermetic Wisdom</h3>
                    <p className="text-sm text-amber-200/70">Ancient wisdom for consciousness expansion</p>
                    <Link to="/hermetic-wisdom" className="text-amber-400 text-xs mt-2 block">Begin →</Link>
                  </div>
                </div>
              </CosmicContainer>
            </TabsContent>
            
            <TabsContent value="frequencies">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CosmicContainer className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Featured Frequencies</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {featuredFrequencies.map((freq, i) => (
                        <motion.div
                          key={freq.value}
                          custom={i}
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="bg-black/30 rounded-lg p-4 border border-purple-500/20 flex items-center"
                        >
                          <div className="mr-4 relative w-16 h-16">
                            <SacredGeometryVisualizer 
                              defaultShape="metatrons-cube"
                              size="sm"
                              showControls={false}
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{freq.name}</h4>
                            <p className="text-purple-200/70 text-sm">{freq.value}Hz - {freq.chakra} Chakra</p>
                            <Link to={`/frequency-library?frequency=${freq.value}`} className="text-purple-300 text-xs mt-1 block">
                              Experience →
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button asChild variant="outline">
                        <Link to="/frequency-library">
                          Explore Full Frequency Library
                        </Link>
                      </Button>
                    </div>
                  </CosmicContainer>
                </div>
                
                <CosmicContainer className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recently Played</h3>
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded p-3 border border-purple-500/10">
                      <p className="text-sm font-medium text-white">432Hz Miracle Tone</p>
                      <p className="text-xs text-purple-200/70">Heart Chakra • 15 min</p>
                    </div>
                    <div className="bg-black/20 rounded p-3 border border-purple-500/10">
                      <p className="text-sm font-medium text-white">963Hz Divine Connection</p>
                      <p className="text-xs text-purple-200/70">Crown Chakra • 20 min</p>
                    </div>
                    <div className="bg-black/20 rounded p-3 border border-purple-500/10">
                      <p className="text-sm font-medium text-white">528Hz DNA Repair</p>
                      <p className="text-xs text-purple-200/70">Heart Chakra • 30 min</p>
                    </div>
                  </div>
                </CosmicContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline">
              <CosmicContainer className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Your Sacred Journey</h2>
                <p className="text-purple-100/80 mb-6">
                  Track your frequency shifts and consciousness expansion through your personal timeline.
                </p>
                
                <div className="bg-black/30 rounded-lg p-8 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-60" />
                  <h3 className="text-lg font-medium text-white mb-2">Journey Timeline</h3>
                  <p className="text-purple-200/70 max-w-md mx-auto mb-6">
                    Start your frequency journey to build a personal timeline of your consciousness evolution.
                  </p>
                  <Button asChild>
                    <Link to="/journey-templates">Begin Your Journey</Link>
                  </Button>
                </div>
              </CosmicContainer>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 relative z-10"
        >
          <CosmicContainer className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">About Sacred Shifter</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto my-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                <p className="text-purple-100/80 mb-4">
                  Sacred Shifter was created to help individuals access higher states of consciousness 
                  through sacred frequencies and geometric patterns. We believe that sound healing combined 
                  with intentional visualization can create profound shifts in your energetic field.
                </p>
                <p className="text-purple-100/80">
                  Every frequency on this platform has been carefully selected for its healing properties 
                  and vibrational alignment with universal consciousness. Our journey templates combine 
                  these frequencies with guided meditations to facilitate deep inner transformation.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Sacred Code</h3>
                <p className="text-purple-100/80 mb-4">
                  The sacred geometries you see throughout Sacred Shifter are not just beautiful designs—they 
                  are visual representations of the mathematical principles that govern our universe. From the 
                  Flower of Life to Metatron's Cube, each pattern contains encoded wisdom that speaks directly 
                  to your subconscious mind.
                </p>
                <p className="text-purple-100/80">
                  <span className="italic text-pink-300 font-medium">
                    "The person who was very aware had a foot in two worlds..."
                  </span> This journey is for those who sense there is more to reality than what 
                  meets the eye—for those ready to explore the depths of consciousness through sound and sacred pattern.
                </p>
              </div>
            </div>
          </CosmicContainer>
        </motion.div>
      </div>
      
      <CosmicFooter 
        showFrequencyBar={isPlaying} 
        currentFrequency={528}
        currentChakra="Heart"
      />
    </Layout>
  );
};

export default CosmicDashboard;
