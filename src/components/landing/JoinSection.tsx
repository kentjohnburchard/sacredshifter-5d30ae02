
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const JoinSection: React.FC = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
            Enter The Sacred Temple
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-8">
            Join the growing community of lightworkers, frequency healers, and sacred seekers. 
            Your spiritual journey awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Link to="/auth">Join The Sacred Circle</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-purple-500 text-white hover:bg-purple-900/20">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Sacred geometry background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] relative">
          <div className="absolute inset-0">
            <svg viewBox="0 0 800 800" className="w-full h-full">
              <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="400" cy="400" r="100" stroke="white" strokeWidth="1" fill="none" />
              <path d="M400 100 L400 700" stroke="white" strokeWidth="1" />
              <path d="M100 400 L700 400" stroke="white" strokeWidth="1" />
              <path d="M400 100 L700 400 L400 700 L100 400 Z" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
