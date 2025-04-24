
import React from 'react';
import { Sparkles, Music, Heart, Triangle, Brain, BookOpen } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { useTheme } from '@/context/ThemeContext';

const FeaturesSection: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-100 mb-4">
            Sacred Frequencies & Spiritual Technology
          </h2>
          <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
            Sacred Shifter combines ancient wisdom with modern science to create powerful tools for transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Sacred Blueprint™"
            description="Discover your unique energetic signature and spiritual path through vibrational analysis."
            icon={<Sparkles className="h-8 w-8 text-indigo-400" />}
            to="/sacred-blueprint"
            color={liftTheVeil ? "pink" : "indigo"}
          />
          
          <FeatureCard 
            title="Frequency Library"
            description="Access healing frequencies calibrated to balance chakras and elevate consciousness."
            icon={<Music className="h-8 w-8 text-blue-400" />}
            to="/frequency-library"
            color={liftTheVeil ? "pink" : "blue"}
          />
          
          <FeatureCard 
            title="Heart Center"
            description="Tools for heart coherence, emotional healing, and opening the heart chakra."
            icon={<Heart className="h-8 w-8 text-pink-400" />}
            to="/heart-center"
            color={liftTheVeil ? "pink" : "pink"}
          />
          
          <FeatureCard 
            title="Trinity Gateway™"
            description="Access the tripartite nature of consciousness through sacred geometry and sound."
            icon={<Triangle className="h-8 w-8 text-amber-400" />}
            to="/trinity-gateway"
            color={liftTheVeil ? "pink" : "amber"}
          />
          
          <FeatureCard 
            title="Shift Perception"
            description="Techniques to transform consciousness and shift into higher states of awareness."
            icon={<Brain className="h-8 w-8 text-purple-400" />}
            to="/shift-perception"
            color={liftTheVeil ? "pink" : "purple"}
          />
          
          <FeatureCard 
            title="Hermetic Wisdom"
            description="Ancient teachings of Hermes Trismegistus presented for modern spiritual seekers."
            icon={<BookOpen className="h-8 w-8 text-emerald-400" />}
            to="/hermetic-wisdom"
            color={liftTheVeil ? "pink" : "emerald"}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
