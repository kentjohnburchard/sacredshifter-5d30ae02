
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-6 relative flex items-center">
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
                alt="Sacred Shifter Logo"
                className="h-32 md:h-40 mx-auto md:mx-0 mb-6 animate-pulse-subtle"
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-playfair font-bold text-center md:text-left text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Awaken Your Frequency.<br />Align Your Soul.
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 text-center md:text-left mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              A transformational platform for lightworkers, seekers, and Sacred Circle members.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Link to="/auth" className="flex items-center">
                  Start My Journey
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-purple-500 text-white hover:bg-purple-900/20">
                <Link to="#features" className="flex items-center">
                  Explore Features
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative">
              {/* Sacred geometry visuals */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
                <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow">
                  <circle cx="200" cy="200" r="150" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1" fill="none" />
                  <circle cx="200" cy="200" r="120" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" fill="none" />
                  <circle cx="200" cy="200" r="90" stroke="rgba(147, 51, 234, 0.6)" strokeWidth="1" fill="none" />
                  <path d="M200 50 L50 275 L350 275 Z" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1" fill="none" />
                  <path d="M200 350 L50 125 L350 125 Z" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              
              <div className="relative z-20">
                <div className="w-[320px] h-[320px] mx-auto rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/20 to-blue-500/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-purple-900/70 via-indigo-900/60 to-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-playfair text-white text-shadow-lg">Start</span>
                      <span className="block text-xl text-white/70 mt-2 font-light">Your Journey</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background particles/waves effect would go here */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Link 
          to="#about" 
          className="animate-bounce text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="h-8 w-8 rotate-90" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
