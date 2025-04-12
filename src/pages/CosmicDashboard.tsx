
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CosmicContainer, SacredGeometryVisualizer, CosmicFooter } from "@/components/sacred-geometry";
import StarfieldBackground from "@/components/sacred-geometry/StarfieldBackground";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import TimelineViewer from "@/components/timeline/TimelineViewer";
import { 
  Music, Heart, Wand2, Lightbulb, 
  Sparkles, Moon, CloudSun, BookOpen,
  Clock, Headphones, Waves 
} from "lucide-react";

const CosmicDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("journeys");
  const [selectedShape, setSelectedShape] = useState<
    "flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "sphere"
  >("flower-of-life");
  
  const [isPlaying, setIsPlaying] = useState(false);
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  
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
      id: "heart-center",
      title: "Heart Center",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-pink-500",
      description: "Open and balance your heart chakra",
      path: "/heart-center",
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

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    
    // Navigate to appropriate pages based on tab selection
    if (value === "frequencies") {
      navigate("/frequencies");
    } else if (value === "timeline") {
      navigate("/timeline"); 
    }
  };
  
  return (
    <Layout pageTitle="Sacred Shifter">
      {/* Starfield background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldBackground density="medium" opacity={0.6} isStatic={false} />
      </div>
      
      {/* Fixed position visualizer controls at the top right */}
      <div className="fixed top-20 right-8 z-50 bg-black/80 backdrop-blur-md rounded-lg p-2 shadow-xl border border-purple-500/30">
        <div className="flex flex-wrap gap-1">
          {["flower-of-life", "metatrons-cube", "merkaba", "torus"].map((shape) => (
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

      {/* Easter egg toggle button - fixed in bottom right - redundant, removed to avoid duplicates */}
      
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
              {liftTheVeil 
                ? "You have crossed the threshold into heightened perception. The sacred frequencies now resonate more deeply with your consciousness."
                : "Welcome to your frequency sanctuary. Unlock sacred codes, align with sound, and shift your consciousness."}
            </motion.p>
          </div>
          
          <div className="w-full md:w-1/2 h-64 md:h-80 flex items-center justify-center relative z-30">
            <div className="w-full h-full px-2">
              <div className="w-full h-full flex items-center justify-center">
                {/* This visualizer is just for decoration */}
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
          <Tabs defaultValue="journeys" className="w-full" value={selectedTab} onValueChange={handleTabChange}>
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
              {/* This content will not be displayed as we'll navigate to the Frequencies page */}
              <div>Redirecting to frequencies page...</div>
            </TabsContent>
            
            <TabsContent value="timeline">
              {/* This content will not be displayed as we'll navigate to the Timeline page */}
              <div>Redirecting to timeline page...</div>
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
                  {liftTheVeil 
                    ? "Beyond ordinary perception lies the realm of frequencies where consciousness itself becomes malleable. Sacred Shifter bridges dimensions, revealing the vibrational nature of reality."
                    : "Sacred Shifter was created to help individuals access higher states of consciousness through sacred frequencies and geometric patterns. We believe that sound healing combined with intentional visualization can create profound shifts in your energetic field."}
                </p>
                <p className="text-purple-100/80">
                  {liftTheVeil
                    ? "Those who perceive these frequencies understand that the veil between worlds is thin. Your presence here is no accident, but a cosmic alignment."
                    : "Every frequency on this platform has been carefully selected for its healing properties and vibrational alignment with universal consciousness. Our journey templates combine these frequencies with guided meditations to facilitate deep inner transformation."}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Sacred Code</h3>
                <p className="text-purple-100/80 mb-4">
                  {liftTheVeil
                    ? "The geometries you observe are more than visual elements—they are keys to understanding the mathematical language of creation itself. Each pattern holds encoded wisdom that resonates with your DNA."
                    : "The sacred geometries you see throughout Sacred Shifter are not just beautiful designs—they are visual representations of the mathematical principles that govern our universe. From the Flower of Life to Metatron's Cube, each pattern contains encoded wisdom that speaks directly to your subconscious mind."}
                </p>
                <p className="text-purple-100/80">
                  <span className={`italic ${liftTheVeil ? "text-pink-300" : "text-purple-300"} font-medium`}>
                    "The person who was very aware had a foot in two worlds..."
                  </span> {liftTheVeil 
                    ? "You now stand at this threshold between dimensions, perceiving both the physical and energetic realms simultaneously."
                    : "This journey is for those who sense there is more to reality than what meets the eye—for those ready to explore the depths of consciousness through sound and sacred pattern."}
                </p>
              </div>
            </div>
          </CosmicContainer>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CosmicDashboard;
