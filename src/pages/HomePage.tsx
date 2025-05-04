
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HermeticSection from '@/components/landing/HermeticSection';
import JoinSection from '@/components/landing/JoinSection';
import SacredJourneyScroll from '@/components/sacred-journey/SacredJourneyScroll';
import SacredResourcesSection from '@/components/landing/SacredResourcesSection';

const HomePage: React.FC = () => {
  return (
    <Layout 
      pageTitle="Sacred Shifter - Reconnect with your highest self" 
      showNavbar={true}
    >
      <HeroSection />
      <FeaturesSection />
      
      {/* Add Sacred Journey Scroll section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/70 to-indigo-50/70">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700">
            Sacred Journey Scroll
          </h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
            Embark on transformative sacred journeys designed to elevate your consciousness,
            balance your energy, and reconnect you with your highest self.
          </p>
          
          <SacredJourneyScroll />
          
          <div className="text-center mt-10">
            <Link to="/journeys">
              <Button className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700">
                Explore All Journeys
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add Sacred Resources Section */}
      <SacredResourcesSection />
      
      <HermeticSection />
      <JoinSection />
    </Layout>
  );
};

export default HomePage;
