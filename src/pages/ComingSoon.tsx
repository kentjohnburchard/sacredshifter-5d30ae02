
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SacredGridBackground from '@/components/visualization/SacredGridBackground';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ComingSoon = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-40">
        <SacredGridBackground 
          intensity={0.3}
          color="#9b87f5"
          pulseSpeed={0.5}
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl"
        >
          {/* Logo */}
          <motion.img
            src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
            alt="Sacred Shifter"
            className="mx-auto mb-12 h-32 w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          
          {/* Main headline */}
          <motion.h1 
            className="mb-8 font-playfair text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            A Sacred Journey Awaits
          </motion.h1>
          
          {/* Sub headline */}
          <motion.p 
            className="mb-12 text-xl text-gray-300 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Weaving ancient wisdom with vibrational remembrance
          </motion.p>
          
          {/* Description */}
          <motion.div
            className="mb-16 space-y-6 text-lg text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <p>
              Experience transformative healing journeys through sacred sound resonance
            </p>
            <p>
              Expand your consciousness through harmonious frequencies
            </p>
          </motion.div>
          
          {/* Coming soon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-black/50 px-6 py-3 text-purple-300 backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-lg font-light tracking-wider">Awakening Begins Soon</span>
          </motion.div>
          
          {/* Admin access link - only visible to logged in users */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-12"
            >
              <Link 
                to="/home" 
                className="inline-flex items-center gap-2 rounded-md border border-purple-500/30 bg-black/70 px-4 py-2 text-purple-300 hover:bg-black/90 hover:text-purple-200 backdrop-blur-sm transition-all duration-300"
              >
                <span className="text-sm font-light tracking-wider">Enter Site</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
