
import React from 'react';
import { motion } from 'framer-motion';

const HermeticSection: React.FC = () => {
  // Mathematical formulas and visualizations
  const formulas = [
    {
      name: "Golden Ratio",
      formula: "φ = (1 + √5) ÷ 2",
      description: "The divine proportion found throughout nature and sacred geometry."
    },
    {
      name: "Fibonacci Sequence",
      formula: "Fn = Fn-1 + Fn-2",
      description: "The mathematical blueprint of life's growth patterns."
    },
    {
      name: "Solfeggio Frequencies",
      formula: "396 Hz, 417 Hz, 528 Hz, 639 Hz, 741 Hz, 852 Hz",
      description: "Ancient sound healing frequencies for spiritual awakening."
    }
  ];

  return (
    <section className="py-24 px-6 relative" id="hermetic">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 
          className="text-3xl md:text-5xl font-playfair font-light mb-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          The <span className="text-purple-400 font-medium">Sacred Mathematics</span> of Frequency
        </motion.h2>
        
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto">
          Our frequency experiences are designed with mathematical precision, drawing from ancient wisdom and modern science.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {formulas.map((item, index) => (
            <motion.div 
              key={index}
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl text-purple-300 mb-4">{item.name}</div>
              <div className="text-lg text-white/70 mb-2 font-mono">{item.formula}</div>
              <div className="text-sm text-white/50">
                {item.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sacred Geometry Background */}
        <div className="mt-20 relative">
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <svg viewBox="0 0 800 800" className="w-full max-w-6xl">
              <circle cx="400" cy="400" r="150" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="400" cy="400" r="250" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="1" fill="none" />
              <path d="M400 50 L400 750" stroke="white" strokeWidth="1" />
              <path d="M50 400 L750 400" stroke="white" strokeWidth="1" />
              <path d="M400 50 L750 400 L400 750 L50 400 Z" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
          
          <motion.div
            className="text-center relative z-10 p-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-xl md:text-2xl italic font-playfair text-white/90">
              "As above, so below. As within, so without. As the universe, so the soul."
              <footer className="text-sm text-purple-300 mt-2">- Hermetic Axiom</footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HermeticSection;
