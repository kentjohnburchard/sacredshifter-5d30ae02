
import React from 'react';
import Layout from '@/components/layout/Layout';
import JourneyGallery from '@/components/journey/JourneyGallery';
import { motion } from 'framer-motion';

const JourneysPage: React.FC = () => {
  return (
    <Layout 
      pageTitle="Sacred Journeys" 
      className="bg-gradient-to-b from-purple-900/30 to-black min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Sacred Journeys
          </motion.h1>
          <motion.p 
            className="text-lg text-white/70 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore transformative energetic experiences aligned with your chakras and archetypal resonance.
            Each journey combines breathwork, sound, and sacred visuals to elevate your consciousness.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <JourneyGallery variant="grid" showFilters={true} />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default JourneysPage;
