
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Star, Music, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationCard from './NavigationCard';

const ExploreSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
            Explore Sacred Shifter
          </h2>
          <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
            Navigate through our sacred spaces and tools for consciousness expansion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NavigationCard 
            title="Harmonic Map"
            description="Interactive map of frequencies and their relationships."
            icon={<Compass />}
            to="/harmonic-map"
          />
          
          <NavigationCard 
            title="Astrology"
            description="Discover how celestial bodies influence consciousness."
            icon={<Star />}
            to="/astrology"
          />
          
          <NavigationCard 
            title="Prime Frequency"
            description="Experience the power of prime number resonance."
            icon={<Music />}
            to="/prime-frequency"
          />
          
          <NavigationCard 
            title="Shift Perception"
            description="Tools for expanding your awareness and perception."
            icon={<Brain />}
            to="/shift-perception"
          />
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Link to="/site-map">
              Explore Full Site Map <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
