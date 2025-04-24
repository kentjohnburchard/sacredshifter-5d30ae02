import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import RotatingSoulText from './RotatingSoulText';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-0"></div>
      
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
            </radialGradient>
          </defs>
          
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 2 }}
          >
            <motion.circle 
              cx="50" cy="50" r="8" 
              fill="none" 
              stroke="url(#glow)" 
              strokeWidth="0.2"
              animate={{ 
                r: [8, 8.5, 8],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 6;
              const x = 50 + 16 * Math.cos(angle);
              const y = 50 + 16 * Math.sin(angle);
              
              return (
                <motion.circle 
                  key={`circle-1-${i}`}
                  cx={x} cy={y} r="8" 
                  fill="none" 
                  stroke="url(#glow)" 
                  strokeWidth="0.2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ 
                    duration: 4,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              );
            })}
            
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 12;
              const x = 50 + 24 * Math.cos(angle);
              const y = 50 + 24 * Math.sin(angle);
              
              return (
                <motion.circle 
                  key={`circle-2-${i}`}
                  cx={x} cy={y} r="8" 
                  fill="none" 
                  stroke="url(#glow)" 
                  strokeWidth="0.1"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: 5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              );
            })}
          </motion.g>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="mx-auto mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          >
            <Logo />
          </motion.div>
          
          <RotatingSoulText />
          
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
                Discover Your Sacred Blueprint <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-purple-400/50 hover:bg-purple-900/20 text-purple-100 rounded-full px-8 py-6 text-lg"
            >
              <Link to="/frequency-library">
                Explore Frequencies <Music className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
