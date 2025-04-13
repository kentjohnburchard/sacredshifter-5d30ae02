
import React, { useState, useEffect } from 'react';
import { StarfieldBackground } from '@/components/sacred-geometry';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Music, Heart, BookOpen, Moon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SacredGeometryVisualizer } from '@/components/sacred-geometry';

const EnhancedStarfield: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black">
        <StarfieldBackground 
          density="medium" 
          opacity={0.5} 
          isStatic={false}
          starCount={800} 
          speed={0.2} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/80"></div>
    </div>
  );
};

const SacredShifterLanding: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<'flower-of-life' | 'metatrons-cube' | 'merkaba' | 'torus'>('flower-of-life');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay for smoother animation sequence
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const navigationItems = [
    { 
      icon: <Sparkles className="w-6 h-6 text-purple-300" />,
      name: "Experiences",
      description: "Frequency-based transformational experiences",
      route: "/frequency-shifting",
      color: "from-purple-600/40 to-indigo-700/40"
    },
    { 
      icon: <Music className="w-6 h-6 text-emerald-300" />,
      name: "Sound Journeys",
      description: "Guided sound healing and meditation",
      route: "/journey-templates",
      color: "from-emerald-600/40 to-teal-700/40"
    },
    { 
      icon: <Heart className="w-6 h-6 text-pink-300" />,
      name: "Heart Center",
      description: "Open and balance your heart chakra",
      route: "/heart-center",
      color: "from-pink-600/40 to-red-700/40"
    },
    { 
      icon: <BookOpen className="w-6 h-6 text-blue-300" />,
      name: "Wisdom",
      description: "Sacred knowledge and hermetic principles",
      route: "/hermetic-wisdom",
      color: "from-blue-600/40 to-indigo-700/40"
    },
    { 
      icon: <Moon className="w-6 h-6 text-amber-300" />,
      name: "Astrology",
      description: "Discover your cosmic blueprint",
      route: "/astrology",
      color: "from-amber-600/40 to-orange-700/40"
    },
    { 
      icon: <Star className="w-6 h-6 text-cyan-300" />,
      name: "My Journey",
      description: "View your personal timeline",
      route: "/timeline",
      color: "from-cyan-600/40 to-blue-700/40"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced starfield background */}
      <EnhancedStarfield />
      
      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        {/* Logo & Sacred Geometry */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="mb-6 w-full max-w-[280px] relative"
        >
          <img 
            src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
            alt="Sacred Shifter" 
            className="w-full h-auto"
          />
        </motion.div>
        
        {/* Main Sacred Geometry Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-full max-w-2xl aspect-square sm:max-h-[450px] mb-12"
        >
          <SacredGeometryVisualizer 
            defaultShape={currentShape}
            size="lg" 
            showControls={false}
            expandable={false}
          />
          
          {/* Shape Selector */}
          <div className="flex justify-center mt-4 gap-2">
            {[
              { id: 'flower-of-life', name: 'Flower of Life' },
              { id: 'metatrons-cube', name: 'Metatron\'s Cube' },
              { id: 'merkaba', name: 'Merkaba' },
              { id: 'torus', name: 'Torus' }
            ].map((shape) => (
              <Button 
                key={shape.id}
                variant="outline" 
                size="sm"
                onClick={() => setCurrentShape(shape.id as any)}
                className={`text-xs px-3 py-1 h-auto ${currentShape === shape.id ? 
                  'bg-purple-900/60 border-purple-400/50 text-purple-100' : 
                  'bg-transparent border-purple-400/30 text-purple-300/70 hover:bg-purple-900/30'}`}
              >
                {shape.name}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {navigationItems.map((item, index) => (
            <Link to={item.route} key={item.name}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className={`bg-gradient-to-br ${item.color} hover:bg-gradient-to-tr backdrop-blur-sm border border-white/10 rounded-xl p-4 h-full transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-black/30 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
        
        {/* Tagline and Begin Journey Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-lg text-purple-200 mb-4 italic">
            "Discover frequency. Reclaim your truth. Shift perception."
          </p>
          <Link to="/home">
            <Button className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-medium px-8 py-2 rounded-full hover:shadow-lg hover:shadow-purple-700/50 transition-all duration-300">
              Begin Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SacredShifterLanding;
