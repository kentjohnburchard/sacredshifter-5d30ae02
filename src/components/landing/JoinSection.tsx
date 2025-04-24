
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const JoinSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black/70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-xl border border-purple-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Join the Sacred Shift Today
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Create your free account to access personalized frequencies, save your favorite journeys, and track your spiritual progress.
            </motion.p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8"
            >
              <Link to="/auth?signup=true">
                Create Free Account
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-purple-400 text-purple-100 rounded-full px-8"
            >
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
