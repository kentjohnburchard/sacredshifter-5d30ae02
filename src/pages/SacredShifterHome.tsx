
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText, CallToAction } from "@/components/landing";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Heart, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import EnhancedGeometryVisualizer from "@/components/sacred-geometry/EnhancedGeometryVisualizer";
import { useTheme } from "@/context/ThemeContext";
import ConsciousnessToggle from "@/components/ConsciousnessToggle";

const SacredShifterHome: React.FC = () => {
  const { liftTheVeil, currentQuote } = useTheme();
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [geometryExpanded, setGeometryExpanded] = useState(false);
  
  // Determine background classes based on mode
  const bgClasses = liftTheVeil 
    ? "bg-gradient-to-b from-pink-900/30 to-purple-900/30"
    : "bg-gradient-to-b from-indigo-900/30 to-purple-900/30";
    
  // Handle visualizer expand/collapse state change
  const handleVisualizerExpandChange = (expanded: boolean) => {
    setGeometryExpanded(expanded);
  };

  return (
    <Layout pageTitle="Sacred Shifter" useBlueWaveBackground={!liftTheVeil}>
      <div className={`container mx-auto px-4 py-8 relative z-20 ${bgClasses}`}>
        {/* Hidden Easter Egg Toggle */}
        <ConsciousnessToggle />
        
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative">
          {/* Main Content */}
          <div className={`transition-all duration-500 ${geometryExpanded ? 'opacity-20' : 'opacity-100'}`}>
            {/* Logo with Animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: liftTheVeil ? 1.05 : 1.02 }}
            >
              <Logo />
            </motion.div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-6 mb-8"
            >
              <h1 className={`text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
                ${liftTheVeil 
                  ? 'bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400' 
                  : 'bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400'} mb-4`}
              >
                Welcome to Sacred Shifter
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Experience the healing power of sacred frequencies and sound vibrations
              </p>
              
              {/* Whisper quote */}
              <motion.p 
                className={`text-sm italic mt-3 ${liftTheVeil ? 'text-pink-300/70' : 'text-purple-300/70'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                {currentQuote || "You are not lost... you are remembering"}
              </motion.p>
            </motion.div>

            {/* Animated Text Elements */}
            <div className="space-y-6 mb-12">
              <AnimatedText text="Expand Your Consciousness" className="delay-300" />
              <AnimatedText text="Elevate Your Frequency" className="delay-500" />
              <AnimatedText text="Transform Your Energy" className="delay-700" />
            </div>

            {/* Call to Action Button */}
            <CallToAction to="/dashboard">
              Begin Your Journey
            </CallToAction>
          </div>
          
          {/* Sacred Geometry Visualizer */}
          <div className={`w-full max-w-4xl mx-auto mt-8 mb-16 ${geometryExpanded ? 'z-30' : 'z-10'}`}>
            <EnhancedGeometryVisualizer 
              showControls={true}
              isAudioReactive={true}
              expandable={true}
              onExpandStateChange={handleVisualizerExpandChange}
              mode={liftTheVeil ? 'spiral' : 'fractal'}
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-24 transition-opacity duration-500 ${geometryExpanded ? 'opacity-0' : 'opacity-100'}`}>
          {[
            { 
              title: 'Sound Healing', 
              description: 'Frequency-based sound healing journeys', 
              path: '/journey-templates', 
              icon: <Music className="h-6 w-6" />,
              color: 'border-purple-500/20' 
            },
            { 
              title: 'Heart Center', 
              description: 'Open and balance your heart chakra', 
              path: '/heart-center', 
              icon: <Heart className="h-6 w-6" />,
              color: 'border-pink-500/20'  
            },
            { 
              title: 'Sacred Blueprint', 
              description: 'Discover your unique energetic signature', 
              path: '/sacred-blueprint', 
              icon: <Sparkles className="h-6 w-6" />,
              color: 'border-indigo-500/20'  
            },
            { 
              title: 'Hermetic Wisdom', 
              description: 'Ancient wisdom for modern consciousness', 
              path: '/hermetic-wisdom', 
              icon: <BookOpen className="h-6 w-6" />,
              color: 'border-blue-500/20'  
            },
          ].map(({ title, description, path, icon, color }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className={`bg-black/30 backdrop-blur-sm border ${color} hover:bg-black/40 transition-all h-full`}
              >
                <CardContent className="pt-6">
                  <div className="p-3 mb-3 rounded-full bg-black/40 w-fit border border-purple-500/20">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-300 mb-4">{description}</p>
                  <Link to={path} className="text-purple-300 hover:text-purple-100 inline-flex items-center">
                    Explore <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SacredShifterHome;
