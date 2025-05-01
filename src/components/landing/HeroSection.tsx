
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-0"></div>
      
      {/* Sacred Geometry Background Animation - Gentle, Accessible */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="sacred-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
            </radialGradient>
          </defs>
          
          {/* Developer note: Animation is intentionally gentle with slow transitions 
              to ensure accessibility for users with sensory sensitivities */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 3 }}
          >
            <motion.circle 
              cx="50" cy="50" r="8" 
              fill="none" 
              stroke="url(#sacred-glow)" 
              strokeWidth="0.2"
              animate={{ 
                r: [8, 8.5, 8],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{ 
                duration: 5, // Slowed down for gentler animation
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            {/* Flower of Life pattern - with gentle pulsing */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 6;
              const x = 50 + 16 * Math.cos(angle);
              const y = 50 + 16 * Math.sin(angle);
              
              return (
                <motion.circle 
                  key={`circle-1-${i}`}
                  cx={x} cy={y} r="8" 
                  fill="none" 
                  stroke="url(#sacred-glow)" 
                  strokeWidth="0.2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ 
                    duration: 7, // Slowed significantly for gentle effect
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            
            {/* Outer ring - with very slow animation */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 12;
              const x = 50 + 24 * Math.cos(angle);
              const y = 50 + 24 * Math.sin(angle);
              
              return (
                <motion.circle 
                  key={`circle-2-${i}`}
                  cx={x} cy={y} r="8" 
                  fill="none" 
                  stroke="url(#sacred-glow)" 
                  strokeWidth="0.1"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: 8, // Very slow transition
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </motion.g>
        </svg>
      </div>
      
      {/* Main Content - Moved up to top since logo was removed */}
      <div className="container mx-auto px-4 z-10 pt-12">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400">
              Sacred Shifter
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transmute your consciousness through sacred geometry, 
            frequency alignment, and harmonic resonance
          </p>
          
          <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg p-6 mt-8 border border-purple-500/20">
            <p className="text-gray-100 italic">
              "We are not just observers of reality, but co-creators in the cosmic dance.
              Through sacred vibrations and geometric harmony, we remember our divine nature
              and awaken to the infinite possibilities within."
            </p>
          </div>
          
          <motion.div 
            className="pt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 text-lg"
            >
              <Link to="/sacred-blueprint">
                Begin Your Sacred Journey <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-purple-400/50 hover:bg-purple-900/20 text-purple-100 rounded-full px-8 py-6 text-lg"
            >
              <Link to="/circle">
                Join the Sacred Circle <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Accessibility Support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
