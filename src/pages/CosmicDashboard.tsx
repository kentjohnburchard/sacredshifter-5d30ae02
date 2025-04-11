
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CosmicContainer, SacredVisualizer, CosmicFooter, SacredGeometryVisualizer } from "@/components/sacred-geometry";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Music, Heart, Wand2, Lightbulb, 
  Sparkles, Moon, CloudSun, BookOpen,
  Clock, Headphones, Waves 
} from "lucide-react";

const CosmicDashboard = () => {
  const [selectedShape, setSelectedShape] = useState<
    "flower-of-life" | "cube" | "merkaba" | "torus" | "sphere"
  >("flower-of-life");
  
  const [isPlaying, setIsPlaying] = useState(false);
  
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
  
  return (
    <Layout pageTitle="Sacred Shifter" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
          <div className="text-center lg:text-left">
            {/*<motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-2xl lg:text-6xl font-playfair font-bold text-white mb-3"
            >Welcome
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
                
              </span>
            </motion.h1>
            */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-purple-100/80 max-w-2xl mb-4"
              >Welcome to your frequency sanctuary. Unlock sacred codes, align with sound, and shift your consciousness.
            </motion.p>
            <Link to="/landing" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                View Sacred Shifter Landing
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 100
            }}
            className="w-full md:w-96 h-96 flex-shrink-0 relative"
          >
            <div className="w-full h-full" onClick={() => setIsPlaying(!isPlaying)}>
              <SacredGeometryVisualizer 
                defaultShape={selectedShape as any}
                size="lg"
              />
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3, duration: 0.6 }}
        >
        </motion.div>

        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="w-full flex justify-center mb-8 bg-black/30 backdrop-blur-sm">
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
                            defaultShape="cube"
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
