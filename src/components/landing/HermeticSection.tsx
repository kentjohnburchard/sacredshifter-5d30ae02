
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hermeticPrinciples } from '@/data/hermeticPrinciples';

const HermeticSection: React.FC = () => {
  const [activeHermeticPrinciple, setActiveHermeticPrinciple] = useState<string>("vibration");
  const hermeticPrinciplesArray = Object.values(hermeticPrinciples);
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-gray-900/40 z-0"></div>
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full">
          {Array.from({ length: 7 }).map((_, i) => {
            const size = 30 + i * 20;
            return (
              <motion.div
                key={`geo-circle-${i}`}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/30"
                style={{ width: `${size}%`, height: `${size}%` }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 100 + i * 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            );
          })}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-100 mb-4">
            The Seven Hermetic Principles
          </h2>
          <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
            Ancient universal laws that govern the cosmos, consciousness, and all reality.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            {hermeticPrinciplesArray.map((principle) => (
              <motion.div
                key={principle.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeHermeticPrinciple === principle.id 
                    ? `bg-${principle.color ? principle.color.substring(1) : 'purple'}-900/30 border border-${principle.color ? principle.color.substring(1) : 'purple'}-500/50` 
                    : 'hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveHermeticPrinciple(principle.id)}
                whileHover={{ x: 5 }}
              >
                <h3 className="font-medium text-white">
                  {principle.name}
                </h3>
              </motion.div>
            ))}
          </div>
          
          <div className="md:col-span-2">
            {hermeticPrinciplesArray.map((principle) => {
              const isActive = activeHermeticPrinciple === principle.id;
              
              return (
                <motion.div
                  key={`details-${principle.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 20,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`absolute ${isActive ? 'relative' : 'hidden'}`}
                >
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="mr-4">
                        <div 
                          className="w-16 h-16 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: `${principle.color}30` }}
                        >
                          <span className="text-2xl">{principle.symbol}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{principle.name}</h3>
                        {principle.chakra && (
                          <span 
                            className="text-sm px-3 py-1 rounded-full" 
                            style={{ backgroundColor: `${principle.color}30`, color: principle.color }}
                          >
                            {principle.chakra} Chakra
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <blockquote className="italic text-lg border-l-4 pl-4 my-4" style={{ borderColor: principle.color }}>
                      "{principle.principle}"
                    </blockquote>
                    
                    <p className="text-gray-300">{principle.description}</p>
                    
                    {principle.frequency && (
                      <div className="mt-4 flex items-center">
                        <span className="text-sm text-gray-400">Resonant Frequency:</span>
                        <span className="ml-2 text-white">{principle.frequency} Hz</span>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button 
                        asChild
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Link to="/hermetic-wisdom">
                          Explore Hermetic Teachings
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HermeticSection;
