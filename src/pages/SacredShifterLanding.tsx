
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import { Music, Heart, Sparkles, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import FixedFooter from '@/components/navigation/FixedFooter';
import Sidebar from '@/components/Sidebar';
import ConsciousnessToggle from '@/components/ConsciousnessToggle';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';

const SacredShifterLanding = () => {
  const [selectedShape, setSelectedShape] = useState<"flower-of-life" | "metatrons-cube" | "merkaba" | "torus" | "tree-of-life" | "sri-yantra" | "vesica-piscis">("flower-of-life");
  const { liftTheVeil } = useTheme();

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

      <div className="ml-20">
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[140vh] h-[140vh] max-w-none">
              <SacredGeometryVisualizer 
                defaultShape={selectedShape}
                size="xl"
                showControls={false}
                className="opacity-70"
                mode="fractal"
                expandable={false}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-24 relative z-10">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-6"
            >
              Welcome </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-100 max-w-3xl mx-auto"
            >
              There was once a person who was very aware he had a foot in two worlds. Being sensitive to energy he knew he was walking the path of accessing both. If you found this, you're not here by accident.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { 
                title: 'Sound Healing', 
                description: 'Frequency-based sound healing journeys', 
                path: '/journey-templates', 
                icon: <Music className="h-6 w-6" />,
                color: 'from-purple-800/5 to-indigo-900/5 border-purple-500/10' 
              },
              { 
                title: 'Heart Center', 
                description: 'Open and balance your heart chakra', 
                path: '/heart-center', 
                icon: <Heart className="h-6 w-6" />,
                color: 'from-pink-800/5 to-red-900/5 border-pink-500/10'  
              },
              { 
                title: 'Astrology', 
                description: 'Discover your cosmic blueprint', 
                path: '/astrology', 
                icon: <Star className="h-6 w-6" />,
                color: 'from-amber-800/5 to-orange-900/5 border-amber-500/10'  
              },
              { 
                title: 'Hermetic Wisdom', 
                description: 'Ancient wisdom for modern consciousness', 
                path: '/hermetic-wisdom', 
                icon: <Sparkles className="h-6 w-6" />,
                color: 'from-violet-800/5 to-fuchsia-900/5 border-violet-500/10'  
              },
            ].map(({ title, description, path, icon, color }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white border backdrop-blur-md bg-opacity-5 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex flex-col items-center md:items-start">
                  <div className="p-3 mb-3 rounded-full bg-black/5 backdrop-blur-sm border border-purple-500/10">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                </div>
                <p className="text-sm text-gray-200/90">{description}</p>
                <Link to={path} className="mt-4 inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors font-medium">
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20"
            >
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">About This Journey</h2>
              <p className="text-gray-300 mb-4">
                Every frequency carries intention. Every sound healing journey is unique. 
                The frequencies you're drawn to are often the ones your energy body is seeking for balance.
              </p>
              <p className="text-gray-300 mb-4">
                This is a space for those who sense there's more to reality than what meets the eye.
                For those who feel the vibrations between words, who know that healing comes through frequency alignment.
              </p>
              <p className="text-purple-300 italic">
                "The person who was very aware had a foot in two worlds..."
              </p>
            </motion.div>
          </div>

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
        </div>
      </div>

      <ConsciousnessToggle />
      <SacredAudioPlayer />
      <FixedFooter />
    </div>
  );
};

export default SacredShifterLanding;
