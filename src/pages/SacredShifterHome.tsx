import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SacredShifterHome: React.FC = () => {
  return (
    <Layout 
      pageTitle="Sacred Shifter"
      useBlueWaveBackground={true}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Welcome to Sacred Shifter
          </h1>
          
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Your journey to higher consciousness begins here. Explore our tools for spiritual growth, 
            frequency healing, and energetic alignment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard 
              title="Frequency Library" 
              description="Access healing frequencies for mind, body, and spirit"
              link="/frequency-library"
            />
            
            <FeatureCard 
              title="Sacred Blueprint™" 
              description="Discover your unique energetic signature and spiritual path"
              link="/sacred-blueprint"
            />
            
            <FeatureCard 
              title="Sound Journeys" 
              description="Immersive audio experiences for transformation"
              link="/journeys"
            />
            
            <FeatureCard 
              title="Harmonic Map" 
              description="Explore the mathematical harmony of sound frequencies"
              link="/harmonic-map"
            />
            
            <FeatureCard 
              title="Heart Center" 
              description="Tools for emotional healing and heart coherence"
              link="/heart-center"
            />
            
            <FeatureCard 
              title="Meditation" 
              description="Guided practices for spiritual growth"
              link="/meditation"
            />
          </div>
          
          <div className="mt-16">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, link }) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
        <h3 className="text-xl font-semibold mb-3 text-purple-600 dark:text-purple-400">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </Link>
  );
};

export default SacredShifterHome;
