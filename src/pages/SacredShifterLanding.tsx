
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
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/navigation/Footer';
import FixedFooter from '@/components/navigation/FixedFooter';
import { useNavigate } from 'react-router-dom';
import { Heart, Music, Sparkles, BookOpen, Brain, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [selectedShape, setSelectedShape] = useState("Flower of Life");
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0118] to-black text-white font-sans overflow-hidden">
      {/* Full screen starfield that shows through all elements */}
      <StarfieldBackground />

      {/* Top right floating area with Nav and Geometry Viewer */}
      <div className="fixed right-4 top-4 z-50 flex items-start gap-4">
        {/* Geometry Visualizer - Floating next to nav */}
        <motion.div 
          className="w-64 h-64 flex items-center justify-center" 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="rounded-2xl overflow-hidden border border-purple-600/20 shadow-2xl shadow-purple-900/20 backdrop-blur-sm bg-black/5 h-full w-full flex items-center justify-center">
            <div className="flex items-center justify-center h-full w-full">
              {geometryComponents[selectedShape]}
            </div>
          </div>
        </motion.div>
        
        {/* Floating Navigation with shape selector */}
        <nav className="bg-black/10 backdrop-blur-sm p-3 rounded-xl border border-purple-900/20">
          <div className="flex flex-col space-y-2">
            {Object.keys(geometryComponents).map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`text-sm whitespace-nowrap text-white hover:text-purple-300 transition-all duration-300 flex items-center gap-2
                  ${selectedShape === shape ? 'text-purple-300' : ''}
                `}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${selectedShape === shape ? 'bg-purple-500' : 'bg-purple-900'} opacity-70`}></span>
                {shape}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <header className="text-center pt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-6"
        >
          {/* More transparent logo that blends better with the theme */}
          <img 
            src="/lovable-uploads/d1dc7000-c2c4-4d7f-8e17-6702ea255abe.png" 
            alt="Sacred Shifter Logo" 
            className="mx-auto w-48 opacity-20 drop-shadow-[0_0_15px_rgba(138,43,226,0.5)]" 
          />
        </motion.div>
        <h1 className="sr-only">Sacred Shifter</h1>
        <motion.p 
          className="text-xl mt-6 max-w-2xl mx-auto text-purple-100/80 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.6, duration: 1.5 }}
        >
          Explore frequency-based healing, sacred geometry, and consciousness expansion in this interdimensional portal
        </motion.p>
      </header>

      {/* Main Navigation Links - Now in center */}
      <motion.div 
        className="flex justify-center gap-4 mt-12 flex-wrap z-10 relative px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        {['Home', 'Sound Journeys', 'Experiences', 'Frequencies', 'My Journey'].map((item) => (
          <Link
            key={item}
            to={`${item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`}`}
            className="px-5 py-2 rounded-full font-medium border transition-all duration-300
              bg-black/20 backdrop-blur-sm hover:bg-purple-900/20 border-purple-900/30 text-gray-300
              hover:text-white"
          >
            {item}
          </Link>
        ))}
      </motion.div>

      {/* Experience Grid - More transparent */}
      <motion.section 
        id="experiences" 
        className="mt-20 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto z-10 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        {[
          { 
            title: 'Sound Healing', 
            description: 'Frequency-based sound healing journeys', 
            path: '/journey-templates', 
            icon: <Music className="h-6 w-6" />,
            color: 'from-purple-800/5 to-indigo-900/5 border-purple-500/10' 
          },
          { 
            title: 'Meditation', 
            description: 'Guided meditations with sacred frequencies', 
            path: '/meditation', 
            icon: <BookOpen className="h-6 w-6" />,
            color: 'from-blue-800/5 to-cyan-900/5 border-blue-500/10'  
          },
          { 
            title: 'Heart Center', 
            description: 'Open and balance your heart chakra', 
            path: '/heart-center', 
            icon: <Heart className="h-6 w-6" />,
            color: 'from-pink-800/5 to-red-900/5 border-pink-500/10'  
          },
          { 
            title: 'Manifestation', 
            description: 'Focus your energy to manifest intentions', 
            path: '/focus', 
            icon: <Brain className="h-6 w-6" />,
            color: 'from-emerald-800/5 to-green-900/5 border-emerald-500/10'  
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
      </motion.section>

      {/* Footer Player - More transparent */}
      <motion.footer 
        className="mt-24 pb-24 text-center z-10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="bg-black/5 backdrop-blur-md rounded-full py-3 px-6 inline-flex items-center gap-3 border border-purple-500/10">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
          <audio autoPlay loop className="mx-auto">
            <source src="/audio/528hz-heart.mp3" type="audio/mpeg" />
          </audio>
          <p className="text-sm font-medium text-purple-300">528Hz - Heart Chakra</p>
        </div>
        <div className="mt-6 text-sm text-gray-400/70 font-light tracking-wide">
          Sound Journeys • Experiences • Frequencies • My Journey
        </div>
      </motion.footer>

      {/* Add the main site navigation components */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FixedFooter />
      </div>
    </div>
  );
};

export default SacredShifterLanding;
