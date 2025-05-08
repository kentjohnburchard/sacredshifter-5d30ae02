
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const frequencies = [
  { name: '396 Hz', description: 'Liberating Fear', icon: <Music className="h-5 w-5" /> },
  { name: '417 Hz', description: 'Facilitating Change', icon: <Sparkles className="h-5 w-5" /> },
  { name: '528 Hz', description: 'DNA Repair', icon: <Heart className="h-5 w-5" /> },
  { name: '639 Hz', description: 'Connecting Relationships', icon: <Music className="h-5 w-5" /> },
];

const SoundLibraryPreview: React.FC = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Sacred Frequency Library
          </motion.h2>
          <motion.p
            className="text-lg text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore our collection of healing frequencies designed to elevate your consciousness
          </motion.p>
        </div>
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {frequencies.map((freq, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:bg-black/40 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mb-3">
                  {freq.icon}
                </div>
                <h4 className="text-lg font-medium text-white mb-1">{freq.name}</h4>
                <p className="text-sm text-gray-300">{freq.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-purple-500 text-purple-200 hover:bg-purple-900/20"
          >
            <Link to="/frequency">Explore Full Library</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SoundLibraryPreview;
