
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
import { Music, Heart, Sparkles, BookOpen, Brain, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import FixedFooter from '@/components/navigation/FixedFooter';
import Sidebar from '@/components/Sidebar';

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0118] to-black text-white font-sans overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldBackground />
      </div>

      <Sidebar />

      <div className="ml-20">
        <div className="fixed inset-0 z-1 pointer-events-none opacity-30 flex items-center justify-center">
          <div className="w-[80vw] h-[80vh] max-w-4xl">
            {geometryComponents[selectedShape]}
          </div>
        </div>

        <div className="fixed right-4 top-4 z-20">
          <nav className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-purple-900/20">
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

        <div className="container mx-auto px-4 z-10 relative">
          <header id="home" className="text-center pt-32 pb-16 relative z-10">
            <div className="flex justify-center items-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="w-full flex justify-center"
              >
                <img 
                  src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
                  alt="Sacred Shifter Logo" 
                  className="mx-auto w-64 md:w-80 drop-shadow-xl" 
                />
              </motion.div>
            </div>
            <h1 className="sr-only">Sacred Shifter</h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto text-purple-100/80 font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.6, duration: 1.5 }}
            >
              Explore frequency-based healing, sacred geometry, and consciousness expansion in this interdimensional portal
            </motion.p>
          </header>

          <motion.div 
            id="journeys"
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

          <motion.section 
            id="frequencies" 
            className="mt-24 py-16 px-6 max-w-5xl mx-auto z-10 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-center mb-8">Sacred Frequencies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { freq: "432 Hz", desc: "Earth Frequency", color: "bg-emerald-500/20" },
                { freq: "528 Hz", desc: "Heart Frequency", color: "bg-green-500/20" },
                { freq: "639 Hz", desc: "Connection", color: "bg-sky-500/20" },
                { freq: "741 Hz", desc: "Expression", color: "bg-indigo-500/20" },
              ].map(item => (
                <div key={item.freq} className={`p-4 rounded-xl ${item.color} backdrop-blur-md border border-white/10 text-center`}>
                  <h3 className="text-xl font-bold">{item.freq}</h3>
                  <p className="text-sm opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            id="my-journey" 
            className="mt-24 py-16 px-6 max-w-5xl mx-auto z-10 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-center mb-8">My Journey</h2>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-gray-300/90">Track your frequency shifts, consciousness expansion, and healing progress.</p>
              <Link 
                to="/timeline"
                className="mt-6 inline-block px-6 py-2 rounded-full border border-purple-500/30 bg-purple-900/20 hover:bg-purple-800/30 transition-all"
              >
                View My Timeline
              </Link>
            </div>
          </motion.section>

          <motion.footer 
            className="mt-24 pb-24 text-center z-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="bg-black/20 backdrop-blur-md rounded-full py-3 px-6 inline-flex items-center gap-3 border border-purple-500/10">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <audio className="mx-auto">
                <source src="/audio/528hz-heart.mp3" type="audio/mpeg" />
              </audio>
              <p className="text-sm font-medium text-purple-300">528Hz - Heart Chakra</p>
            </div>
            <div className="mt-6 text-sm text-gray-400/70 font-light tracking-wide">
              Sound Journeys • Experiences • Frequencies • My Journey
            </div>
            <div className="mt-4 text-xs text-gray-500/60">
              © {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </div>
          </motion.footer>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <FixedFooter />
      </div>
    </div>
  );
};

export default SacredShifterLanding;
